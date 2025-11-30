import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Fragment, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ArrowBackIcon from "~/assets/icons/arrow-back.svg";
import CameraPlusIcon from "~/assets/icons/camera-plus.svg";
import CheckIcon from "~/assets/icons/check.svg";
import PlayBoxIcon from "~/assets/icons/play-box.svg";
import { ActivityTimeForecast } from "~/components/ActivityTimeForecast";
import Layout from "~/components/Layout";
import OrbitalBackground from "~/components/OrbitalBackground";
import { QueryFailed } from "~/components/QueryFailed";
import { Spinner } from "~/components/Spinner";
import { useLocationContext } from "~/contexts/LocationContext";
import {
  CreateAttendanceLiveTaskPhotoEvidenceVariables,
  createAttendanceLiveTaskPhotoEvidenceMutation,
} from "~/graphql/mutations/create-attendance-live-task-photo-evidence";
import {
  AttendanceLiveByIdQueryResponse,
  AttendanceLiveByIdQueryVariables,
  attendanceLiveByIdQuery,
} from "~/graphql/queries/attendanceLiveById";
import { useAttendanceLiveById } from "~/hooks/useAttendanceLiveById";
import { useAuth } from "~/hooks/useAuth";
import { useLoggedUserDepartmentIds } from "~/hooks/useLoggedUserDepartmentIds";
import { useQueryPolling } from "~/hooks/useQueryPolling";
import { apolloClient } from "~/lib/apollo";
import { getAccessToken } from "~/utils/accessToken";
import { API_BASE_URL, imageMimeTypes } from "~/utils/constants";

export interface ActivitiesAddPictureParams {
  attendanceLiveId: string;
  attendanceLiveTaskId: string;
}

interface ActivitiesAddPictureProps {}

export const ActivitiesAddPicture: React.FC<ActivitiesAddPictureProps> = () => {
  const { user } = useAuth();
  const { params } = useRoute();
  const { goBack } = useNavigation();
  const { coordinates } = useLocationContext();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [willBeCompleted, setWillBeCompleted] = useState(true);
  const [asset, setAsset] = useState<
    ImagePicker.ImagePickerAsset | undefined
  >();

  const { departmentIds, isLoading } = useLoggedUserDepartmentIds();

  const { attendanceLiveId, attendanceLiveTaskId } =
    params as ActivitiesAddPictureParams;

  const { data, loading, error, refetch, startPolling, stopPolling } =
    useAttendanceLiveById({
      skip: isLoading,
      variables: {
        departmentIds,
        id: attendanceLiveId,
      },
    });

  useQueryPolling(10000, startPolling, stopPolling);

  async function handleRegister() {
    setIsRegistering(true);

    if (!coordinates) {
      return Alert.alert(
        "Erro",
        "É necessário obter coordenadas para prosseguir.",
      );
    }

    if (!asset) {
      setIsRegistering(false);
      return Alert.alert("Erro", "É necessário selecionar uma imagem.");
    }

    try {
      const extension = asset.uri.split(".").pop()!;
      const formData = new FormData();
      formData.append("file", {
        uri: asset.uri,
        name: `${Date.now()}-${asset.fileName || "file"}.${extension}`,
        type: imageMimeTypes[extension as keyof typeof imageMimeTypes],
      } as any);

      const response = await fetch(
        `${API_BASE_URL}/api/upload-activity-evidence-image`,
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${getAccessToken()}`,
          },
        },
      );

      if (!response.ok) {
        throw response;
      }

      const { uploadedFileUrl } = (await response.json()) as {
        uploadedFileUrl: string;
      };

      await apolloClient.mutate<
        {},
        CreateAttendanceLiveTaskPhotoEvidenceVariables
      >({
        mutation: createAttendanceLiveTaskPhotoEvidenceMutation,
        variables: {
          data: {
            willBeCompleted,
            evidenceType: "Photo",
            userOperator: user!.id,
            sourceURL: uploadedFileUrl,
            lastLatitude: coordinates.latitude,
            lastLongitude: coordinates.longitude,
            publishedAt: new Date().toISOString(),
            attendance_live_task: attendanceLiveTaskId,
          },
        },
      });

      // atualiza cache do attendance live para adicionar count de evidência na tela anterior
      const attendanceLiveData = apolloClient.readQuery<
        AttendanceLiveByIdQueryResponse,
        AttendanceLiveByIdQueryVariables
      >({
        query: attendanceLiveByIdQuery,
        variables: {
          id: attendanceLiveId,
          departmentIds,
        },
      });

      if (attendanceLiveData) {
        apolloClient.writeQuery<
          AttendanceLiveByIdQueryResponse,
          AttendanceLiveByIdQueryVariables
        >({
          query: attendanceLiveByIdQuery,
          variables: {
            id: attendanceLiveId,
            departmentIds,
          },
          data: {
            ...attendanceLiveData,
            attendanceLive: {
              ...attendanceLiveData.attendanceLive,
              data: {
                ...attendanceLiveData.attendanceLive.data,
                attributes: {
                  ...attendanceLiveData.attendanceLive.data.attributes,
                  attendanceLiveTasks: {
                    ...attendanceLiveData.attendanceLive.data.attributes
                      .attendanceLiveTasks,
                    data: attendanceLiveData.attendanceLive.data.attributes.attendanceLiveTasks.data.map(
                      task => {
                        if (task.id === attendanceLiveTaskId) {
                          return {
                            ...task,
                            attributes: {
                              ...task.attributes,
                              attendance_live_task_evidences: {
                                ...task.attributes
                                  .attendance_live_task_evidences,
                                data: [
                                  ...task.attributes
                                    .attendance_live_task_evidences.data,
                                  {
                                    attributes: {
                                      evidenceType: "Photo",
                                    },
                                  },
                                ],
                              },
                            },
                          };
                        }

                        return task;
                      },
                    ),
                  },
                },
              },
            },
          },
        });
      }

      goBack();
    } catch (error) {
      console.error(error);
      console.error(JSON.stringify(error, null, 2));
      setIsRegistering(false);
      Alert.alert("Erro.", "Não foi possível registrar a imagem.");
    } finally {
      setIsRegistering(false);
    }
  }

  async function handleTakePhoto() {
    setIsLoadingImage(true);

    try {
      const takenPhoto = await ImagePicker.launchCameraAsync({
        quality: 0.5,
        allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (takenPhoto.canceled) return;
      setAsset(takenPhoto.assets![0]);
    } catch {
      Alert.alert("Erro.", "Não foi possível tirar a foto.");
    } finally {
      setIsLoadingImage(false);
    }
  }

  return (
    <OrbitalBackground>
      <Layout
        back={goBack}
        headerMiddleComponent={
          <Text className="flex-1 text-center text-base font-medium text-regal-blue">
            Atividade iniciada
          </Text>
        }
      >
        {isLoading || loading ? (
          <Spinner />
        ) : error || !data ? (
          <QueryFailed refetch={refetch} />
        ) : (
          <View className="flex-1 px-5 pb-5">
            <ActivityTimeForecast
              attendanceLive={data.attendanceLive.data.attributes}
            />
            <ScrollView className="my-6 flex-1">
              <Text className="text-base font-normal text-regal-blue">
                Adicione uma imagem
              </Text>

              <TouchableOpacity
                activeOpacity={0.6}
                style={{ height: 270 }}
                onPress={handleTakePhoto}
                disabled={isLoadingImage || isRegistering}
                className="mt-3 w-full items-center justify-center space-y-2 overflow-hidden rounded-lg bg-blue-light"
              >
                {isLoadingImage ? (
                  <ActivityIndicator size={36} color="#034881" />
                ) : asset ? (
                  <View className="relative h-full w-full flex-1 items-center justify-center">
                    <Image
                      resizeMode="contain"
                      source={{ uri: asset.uri }}
                      style={StyleSheet.absoluteFill}
                    />
                    <Text className="text-center text-sm font-normal text-white/50">
                      R.E {user?.username}
                      {"\n"}
                      {user?.name}
                    </Text>
                  </View>
                ) : (
                  <Fragment>
                    <CameraPlusIcon width={24} height={24} />

                    <Text className="text-sm font-light text-regal-blue">
                      Tire uma foto
                    </Text>
                  </Fragment>
                )}
              </TouchableOpacity>

              <Text className="mt-7 text-lg font-semibold text-regal-blue">
                A atividade será realizada?
              </Text>

              <View className="mt-7 flex-row items-center justify-center space-x-12">
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => setWillBeCompleted(true)}
                  className="flex-row items-center space-x-1.5"
                >
                  <Text className="text-2xl font-semibold uppercase text-regal-blue">
                    Sim
                  </Text>

                  <View
                    className="aspect-square w-9 items-center justify-center rounded-xl border"
                    style={{
                      backgroundColor: "#E2E3E3",
                      borderColor: "rgba(53, 56, 62, 0.2)",
                    }}
                  >
                    {willBeCompleted && <CheckIcon width={24} height={24} />}
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => setWillBeCompleted(false)}
                  className="flex-row items-center space-x-1.5"
                >
                  <Text className="text-2xl font-semibold uppercase text-regal-blue">
                    Não
                  </Text>

                  <View
                    className="aspect-square w-9 items-center justify-center rounded-xl border"
                    style={{
                      backgroundColor: "#E2E3E3",
                      borderColor: "rgba(53, 56, 62, 0.2)",
                    }}
                  >
                    {!willBeCompleted && <CheckIcon width={24} height={24} />}
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View className="flex-row items-center space-x-1.5">
              <TouchableOpacity
                onPress={goBack}
                className="flex-1 flex-row items-center space-x-2.5 rounded-md bg-gray-neutral p-4"
              >
                <ArrowBackIcon width={24} height={24} />

                <Text className="flex-1 text-center text-sm font-bold uppercase text-white">
                  Voltar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleRegister}
                disabled={isRegistering}
                className="flex-1 flex-row items-center space-x-2.5 rounded-md bg-regal-blue p-4"
              >
                <Text className="flex-1 text-center text-sm font-bold uppercase text-white">
                  Registrar
                </Text>

                {isRegistering ? (
                  <ActivityIndicator size={24} color="white" />
                ) : (
                  <PlayBoxIcon width={24} height={24} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Layout>
    </OrbitalBackground>
  );
};
