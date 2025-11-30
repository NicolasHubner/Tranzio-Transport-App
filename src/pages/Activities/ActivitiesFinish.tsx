import { useNavigation, useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import moment from "moment";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AirplaneIcon from "~/assets/icons/airplane.svg";
import ArrowBackIcon from "~/assets/icons/arrow-back.svg";
import FlightLandIcon from "~/assets/icons/flight-land.svg";
import MapPinIcon from "~/assets/icons/map-pin.svg";
import PlayBoxIcon from "~/assets/icons/play-box.svg";
import { ActivityTimeForecast } from "~/components/ActivityTimeForecast";
import Layout from "~/components/Layout";
import OrbitalBackground from "~/components/OrbitalBackground";
import { QueryFailed } from "~/components/QueryFailed";
import { Spinner } from "~/components/Spinner";
import {
  FinishAttendanceLiveVariables,
  finishAttendanceLiveMutation,
} from "~/graphql/mutations/finish-attendance-live";
import { useAttendanceLiveById } from "~/hooks/useAttendanceLiveById";
import { useLoggedUserDepartmentIds } from "~/hooks/useLoggedUserDepartmentIds";
import { useQueryPolling } from "~/hooks/useQueryPolling";
import { apolloClient } from "~/lib/apollo";
import { restApi } from "~/services";

export interface ActivitiesFinishParams {
  id: string;
}

interface ActivitiesFinishProps {}

export const ActivitiesFinish: React.FC<ActivitiesFinishProps> = () => {
  const { params } = useRoute();
  const { navigate } = useNavigation();
  const [isRegistering, setIsRegistering] = useState(false);

  const { departmentIds, isLoading } = useLoggedUserDepartmentIds();

  const { id } = params as ActivitiesFinishParams;
  const { data, loading, error, refetch, startPolling, stopPolling } =
    useAttendanceLiveById({
      skip: isLoading,
      variables: {
        id,
        departmentIds,
      },
    });

  useQueryPolling(10000, startPolling, stopPolling);

  function handleGoBack() {
    navigate("ActivitiesList");
  }

  async function updateSyncAllocation() {
    try {
      await restApi.put(`/allocations/sync/attendance/${id}`, {
        finished_at: moment().toISOString(),
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function handleRegister() {
    setIsRegistering(true);

    try {
      await apolloClient.mutate<{}, FinishAttendanceLiveVariables>({
        mutation: finishAttendanceLiveMutation,
        variables: {
          id,
          dtFinish: new Date().toISOString(),
        },
        update: cache => {
          cache.evict({ id: "ROOT_QUERY", fieldName: "attendanceLives" });
          cache.gc();
        },
      });
      handleGoBack();
    } catch (error) {
      console.error(error);
      setIsRegistering(false);
      Alert.alert("Erro.", "Não foi possível concluir a atividade.");
    }
  }

  return (
    <OrbitalBackground>
      <Layout
        back={handleGoBack}
        headerMiddleComponent={
          <Text className="flex-1 text-center text-base font-medium text-regal-blue">
            Atividade iniciada
          </Text>
        }
      >
        {isLoading || loading ? (
          <Spinner />
        ) : !departmentIds.length ? (
          <Text className="text-center text-sm text-gray-neutral">
            Para acessar essa página, é necessário possuir departamento.
          </Text>
        ) : error || !data ? (
          <QueryFailed refetch={refetch} />
        ) : (
          <View className="flex-1 px-5 pb-5">
            <ActivityTimeForecast
              attendanceLive={data.attendanceLive.data.attributes}
            />

            <ScrollView className="my-6 flex-1">
              <Text className="text-center text-lg font-semibold text-regal-blue">
                {
                  data.attendanceLive.data.attributes.flight.data.attributes
                    .prefix
                }
                {
                  data.attendanceLive.data.attributes.flight.data.attributes
                    .flightNumber
                }
              </Text>

              <View className="mt-6 space-y-5">
                <View className="flex-row space-x-2.5">
                  <FlightLandIcon width={24} height={24} />

                  <Text className="text-base font-medium text-regal-blue">
                    {(
                      data.attendanceLive.data.attributes.flight.data.attributes
                        .ETD ||
                      data.attendanceLive.data.attributes.flight.data.attributes
                        .STD
                    ).substring(0, 5)}
                  </Text>
                </View>

                <View className="flex-row space-x-2.5">
                  <MapPinIcon width={24} height={24} />

                  <Text className="text-base font-medium text-regal-blue">
                    {
                      data.attendanceLive.data.attributes.flight.data.attributes
                        .BOX
                    }
                  </Text>
                </View>

                <View className="flex-row space-x-2.5">
                  <AirplaneIcon width={24} height={24} />

                  <Text className="text-base font-medium text-regal-blue">
                    {
                      data.attendanceLive.data.attributes.flight.data.attributes
                        .aircraft.data.attributes.name
                    }
                  </Text>
                </View>

                <Text className="text-base font-medium text-regal-blue">
                  Cód. Roteiro:{" "}
                  <Text className="text-base font-medium text-gray-neutral">
                    {
                      data.attendanceLive.data.attributes.attendance_spec_origin
                        .data.attributes.code
                    }
                  </Text>
                </Text>

                <Text className="text-base font-medium text-regal-blue">
                  Cód.{" "}
                  <Text className="text-base font-medium capitalize">
                    {data.attendanceLive.data.attributes.department.data.attributes.name.toLowerCase()}
                  </Text>
                  :{" "}
                  <Text className="text-base font-medium text-gray-neutral">
                    {
                      data.attendanceLive.data.attributes.department.data
                        .attributes.code
                    }{" "}
                    -{" "}
                    {
                      data.attendanceLive.data.attributes.attendance_spec_origin
                        .data.attributes.description
                    }
                  </Text>
                </Text>

                <Text className="text-base font-medium text-regal-blue">
                  Ocorrências:{" "}
                  <Text className="text-base font-medium text-gray-neutral">
                    {data.attendanceLive.data.attributes.attendanceLiveTasks.data.reduce(
                      (total, occurrence) =>
                        total +
                        occurrence.attributes.attendance_live_task_evidences
                          .data.length,
                      0,
                    )}
                  </Text>
                </Text>

                <Text className="text-center text-base font-semibold text-regal-blue">
                  Atividade finalizada às{" "}
                  {dayjs(data.attendanceLive.data.attributes.dtStop).format(
                    "HH:mm",
                  )}
                </Text>
              </View>
            </ScrollView>

            <View className="flex-row items-center space-x-1.5">
              <TouchableOpacity
                onPress={handleGoBack}
                className="flex-1 flex-row items-center space-x-2.5 rounded-md bg-gray-neutral p-4"
              >
                <ArrowBackIcon width={24} height={24} />

                <Text className="flex-1 text-center text-sm font-bold uppercase text-white">
                  Voltar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={async () => {
                  await updateSyncAllocation();
                  handleRegister();
                }}
                disabled={isRegistering}
                className="flex-1 flex-row items-center space-x-2.5 rounded-md bg-regal-blue p-4"
              >
                <Text className="flex-1 text-center text-sm font-bold uppercase text-white">
                  Concluir
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
