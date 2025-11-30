import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation, useRoute } from "@react-navigation/native";
import classNames from "classnames";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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
  CreateAttendanceLiveTaskMessageEvidenceVariables,
  createAttendanceLiveTaskMessageEvidenceMutation,
} from "~/graphql/mutations/create-attendance-live-task-message-evidence";
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
import {
  CreateAttendanceLiveTaskMessageEvidenceFormInput,
  createAttendanceLiveTaskMessageEvidenceValidationSchema,
} from "~/validation/create-attendance-live-task-message-evidence";

export interface ActivitiesAddMessageParams {
  attendanceLiveId: string;
  attendanceLiveTaskId: string;
}

interface ActivitiesAddMessageProps {}

export const ActivitiesAddMessage: React.FC<ActivitiesAddMessageProps> = () => {
  const { user } = useAuth();
  const { params } = useRoute();
  const { goBack } = useNavigation();
  const { coordinates } = useLocationContext();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CreateAttendanceLiveTaskMessageEvidenceFormInput>({
    resolver: zodResolver(
      createAttendanceLiveTaskMessageEvidenceValidationSchema,
    ),
    defaultValues: {
      description: "",
      willBeCompleted: true,
    },
  });
  const { departmentIds, isLoading } = useLoggedUserDepartmentIds();

  const { attendanceLiveId, attendanceLiveTaskId } =
    params as ActivitiesAddMessageParams;

  const { data, loading, error, refetch, startPolling, stopPolling } =
    useAttendanceLiveById({
      skip: isLoading,
      variables: {
        departmentIds,
        id: attendanceLiveId,
      },
    });

  useQueryPolling(10000, startPolling, stopPolling);

  const handleRegister = handleSubmit(async values => {
    if (!coordinates) {
      return Alert.alert(
        "Erro",
        "É necessário obter coordenadas para prosseguir.",
      );
    }

    try {
      await apolloClient.mutate<
        {},
        CreateAttendanceLiveTaskMessageEvidenceVariables
      >({
        mutation: createAttendanceLiveTaskMessageEvidenceMutation,
        variables: {
          data: {
            ...values,
            userOperator: user!.id,
            evidenceType: "Message",
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
                                      evidenceType: "Message",
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
    } catch {
      Alert.alert("Erro.", "Não foi possível registrar a descrição.");
    }
  });

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
                Descreva a ocorrência
              </Text>

              <Controller
                control={control}
                name="description"
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <View className="space-y-1">
                    <TextInput
                      multiline
                      value={value}
                      textAlignVertical="top"
                      style={{ height: 270 }}
                      onChangeText={onChange}
                      onSubmitEditing={handleRegister}
                      placeholder="Escreva a ocorrência..."
                      className={classNames(
                        "mt-3 w-full rounded-lg bg-blue-light px-2.5 py-3.5 text-sm",
                        value
                          ? "font-normal text-regal-blue"
                          : "font-light italic text-gray-neutral",
                      )}
                    />

                    {error?.message ? (
                      <Text className="text-sm text-red-600">
                        {error.message}
                      </Text>
                    ) : null}
                  </View>
                )}
              />

              <Text className="mt-7 text-lg font-semibold text-regal-blue">
                A atividade será realizada?
              </Text>

              <Controller
                control={control}
                name="willBeCompleted"
                render={({ field: { value, onChange } }) => (
                  <View className="mt-7 flex-row items-center justify-center space-x-12">
                    <TouchableOpacity
                      activeOpacity={0.6}
                      onPress={() => onChange(true)}
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
                        {value && <CheckIcon width={24} height={24} />}
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.6}
                      onPress={() => onChange(false)}
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
                        {!value && <CheckIcon width={24} height={24} />}
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              />
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
                disabled={isSubmitting}
                onPress={handleRegister}
                className="flex-1 flex-row items-center space-x-2.5 rounded-md bg-regal-blue p-4"
              >
                <Text className="flex-1 text-center text-sm font-bold uppercase text-white">
                  Registrar
                </Text>

                {isSubmitting ? (
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
