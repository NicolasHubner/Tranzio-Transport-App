import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ArrowBackIcon from "~/assets/icons/arrow-back.svg";
import CheckIcon from "~/assets/icons/check.svg";
import PlayBoxIcon from "~/assets/icons/play-box.svg";
import { ActivityTimeForecast } from "~/components/ActivityTimeForecast";
import Layout from "~/components/Layout";
import OrbitalBackground from "~/components/OrbitalBackground";
import { QueryFailed } from "~/components/QueryFailed";
import { Spinner } from "~/components/Spinner";
import { useLocationContext } from "~/contexts/LocationContext";
import {
  CreateAttendanceLiveTaskSignatureEvidenceVariables,
  createAttendanceLiveTaskSignatureEvidenceMutation,
} from "~/graphql/mutations/create-attendance-live-task-signature-evidence";
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
import { Signature } from "./Signature";

export interface ActivitiesAddSignatureParams {
  attendanceLiveId: string;
  attendanceLiveTaskId: string;
}

interface ActivitiesAddSignatureProps {}

export const ActivitiesAddSignature: React.FC<
  ActivitiesAddSignatureProps
> = () => {
  const { user } = useAuth();
  const { params } = useRoute();
  const { goBack } = useNavigation();
  const { coordinates } = useLocationContext();
  const [isRegistering, setIsRegistering] = useState(false);
  const [willBeCompleted, setWillBeCompleted] = useState(true);
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const [isSignatureModalVisible, setSignatureModalVisible] = useState(false);

  const { departmentIds, isLoading } = useLoggedUserDepartmentIds();

  const { attendanceLiveId, attendanceLiveTaskId } =
    params as ActivitiesAddSignatureParams;

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

    if (!signatureImage) {
      return Alert.alert("Erro", "A assinatura é obrigatória.");
    }

    if (!coordinates) {
      return Alert.alert(
        "Erro",
        "É necessário obter coordenadas para prosseguir.",
      );
    }

    try {
      await apolloClient.mutate<
        {},
        CreateAttendanceLiveTaskSignatureEvidenceVariables
      >({
        mutation: createAttendanceLiveTaskSignatureEvidenceMutation,
        variables: {
          data: {
            willBeCompleted,
            evidenceType: "Signature",
            userOperator: user!.id,
            sourceBase64: signatureImage,
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
                                      evidenceType: "Signature",
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
      Alert.alert("Erro.", "Não foi possível registrar a assinatura.");
    }
  }

  const toggleSignatureModal = () => {
    setSignatureModalVisible(!isSignatureModalVisible);
  };

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
                Adicione uma assinatura
              </Text>

              <TouchableOpacity
                activeOpacity={0.6}
                style={{ height: 305 }}
                disabled={isRegistering}
                className="z-10 mt-3 w-full items-center justify-center space-y-2 overflow-hidden rounded-lg bg-blue-light"
                onPress={toggleSignatureModal}
              >
                {signatureImage ? (
                  <Image
                    style={{ height: 305, width: "100%" }}
                    source={{ uri: `data:image/png;base64,${signatureImage}` }}
                  />
                ) : (
                  <Ionicons name="md-add" size={25} color="#0E3657" />
                )}
              </TouchableOpacity>

              <Modal
                visible={isSignatureModalVisible}
                animationType="slide"
                transparent
                statusBarTranslucent
              >
                <GestureHandlerRootView
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  className="bg-gray-100 pt-8"
                >
                  <Signature
                    setSignatureImage={setSignatureImage}
                    setSignatureModalVisible={setSignatureModalVisible}
                  />
                  <TouchableOpacity
                    onPress={toggleSignatureModal}
                    className="mb-5"
                  >
                    <AntDesign name="closecircle" size={34} color="gray" />
                  </TouchableOpacity>
                </GestureHandlerRootView>
              </Modal>

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
