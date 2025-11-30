import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
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
import FlightTakeOffIcon from "~/assets/icons/airplane-takeoff.svg";
import ArrowBackIcon from "~/assets/icons/arrow-back.svg";
import MapPinIcon from "~/assets/icons/map-pin.svg";
import PlayBoxIcon from "~/assets/icons/play-box.svg";
import { ActivityCpmLirButton } from "~/components/ActivityCpmLirButton";
import Layout from "~/components/Layout";
import OrbitalBackground from "~/components/OrbitalBackground";
import { QueryFailed } from "~/components/QueryFailed";
import { Spinner } from "~/components/Spinner";
import {
  StartAttendanceLiveVariables,
  startAttendanceLiveMutation,
} from "~/graphql/mutations/start-attendance-live";
import { useAttendanceLiveById } from "~/hooks/useAttendanceLiveById";
import { useAuth } from "~/hooks/useAuth";
import { useLoggedUserDepartmentIds } from "~/hooks/useLoggedUserDepartmentIds";
import { useQueryPolling } from "~/hooks/useQueryPolling";
import { apolloClient } from "~/lib/apollo";
import { restApi } from "~/services";
import { TasksCollapsible } from "./TasksCollapsible";

export interface ActivitiesStartParams {
  id: string;
}

interface ActivitiesStartProps {}

export const ActivitiesStart: React.FC<ActivitiesStartProps> = () => {
  const { params } = useRoute();
  const { user } = useAuth();
  const { goBack, navigate } = useNavigation();
  const [isStarting, setIsStarting] = useState(false);
  const { departmentIds, isLoading } = useLoggedUserDepartmentIds();
  const { id } = params as ActivitiesStartParams;
  const { data, loading, error, refetch, startPolling, stopPolling } =
    useAttendanceLiveById({
      skip: isLoading,
      variables: {
        id,
        departmentIds,
      },
    });

  useQueryPolling(10000, startPolling, stopPolling);

  async function getEquipmentsInUse() {
    try {
      const { data } = await restApi.get(`allocations/users/${user?.username}`);
      if (data) {
        return data;
      }
    } catch (error) {
      console.error("error", error);
    }
  }

  async function syncEquipments(payload: any) {
    try {
      const allocation = await restApi.post(
        `/allocations/sync/attendance`,
        payload,
      );
      if (allocation) {
        return allocation;
      }
    } catch (error) {
      console.error("erro", error);
    }
  }

  async function checkEquipments() {
    try {
      setIsStarting(true);
      const equipments = await getEquipmentsInUse();
      if (equipments.length > 0) {
        const flightInfos = data?.attendanceLive.data.attributes.flight.data;
        await handleStart();
        const payloadSync = {
          flightId: data?.attendanceLive.data.attributes.flight.data.id,
          flight_number: flightInfos?.attributes.flightNumber,
          box: flightInfos?.attributes.BOX,
          prefix: flightInfos?.attributes.prefix,
          flight_date: moment(flightInfos?.attributes.flightDate).toISOString(),
          flight_origin: flightInfos?.attributes.flightOrigin,
          flight_destiny: flightInfos?.attributes.flightDestiny,
          std: moment(flightInfos?.attributes.STD, "HH:mm:ss").toISOString(),
          sta: moment(flightInfos?.attributes.STA, "HH:mm:ss").toISOString(),
          etd: moment(flightInfos?.attributes.ETD, "HH:mm:ss").toISOString(),
          eta: moment(flightInfos?.attributes.ETA, "HH:mm:ss").toISOString(),
          actionType: flightInfos?.attributes.actionType,
          created_at: moment().toISOString(),
          allocations_ids: equipments.map((item: any) => item.id),
          attendanceId: id,
        };
        await syncEquipments(payloadSync);
      } else {
        Alert.alert(
          "Atenção!",
          "Não há equipamentos alocados em seu nome, deseja continuar?",
          [
            {
              text: "Cancelar",
              onPress: () => {},
            },
            {
              text: "Continuar",
              onPress: () => handleStart(),
            },
          ],
        );
      }
    } catch (error) {
      setIsStarting(false);
      Alert.alert(
        "Erro.",
        "Não foi possível iniciar a atividade, feche o aplicativo e tente novamente.",
      );
    } finally {
      setIsStarting(false);
    }
  }

  async function handleStart() {
    setIsStarting(true);
    try {
      await apolloClient.mutate<{}, StartAttendanceLiveVariables>({
        mutation: startAttendanceLiveMutation,
        variables: {
          id,
          dtStart: new Date().toISOString(),
        },
      });
      navigate("ActivitiesStop", { id });
    } catch (error) {
      console.error(error);
      setIsStarting(false);
      Alert.alert("Erro.", "Não foi possível iniciar a atividade.");
    } finally {
      setIsStarting(false);
    }
  }

  return (
    <OrbitalBackground>
      <Layout
        back={goBack}
        headerMiddleComponent={
          <Text className="flex-1 text-center text-base font-medium text-regal-blue">
            Iniciar atividade
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
          <View className="flex-1 space-y-2 px-5 pb-5">
            <View className="flex-1">
              <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <View className="space-y-6">
                  <Text className="text-center text-lg font-semibold text-regal-blue">
                    {
                      data.attendanceLive.data.attributes.flight.data.attributes
                        .prefix
                    }{" "}
                    {
                      data.attendanceLive.data.attributes.flight.data.attributes
                        .description
                    }
                  </Text>

                  <View className="flex-row space-x-2.5">
                    <FlightTakeOffIcon width={24} height={24} />

                    {data.attendanceLive.data.attributes.flight.data.attributes
                      .actionType === "Departure" ? (
                      <View className="flex-row space-x-2.5">
                        <Text className="text-base font-medium text-regal-blue">
                          STD:{" "}
                          {data.attendanceLive.data.attributes.flight.data.attributes.STD?.slice(
                            0,
                            5,
                          ) ?? "-"}
                        </Text>
                      </View>
                    ) : (
                      <View className="flex-row space-x-2.5">
                        <Text className="text-base font-medium text-regal-blue">
                          STA:{" "}
                          {data.attendanceLive.data.attributes.flight.data.attributes.STA?.slice(
                            0,
                            5,
                          ) ?? "-"}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View className="flex-row space-x-2.5">
                    <MaterialCommunityIcons
                      name="airplane-settings"
                      size={24}
                      color="#034881"
                    />

                    <Text className="text-base font-medium text-regal-blue">
                      Origem:{" "}
                      {
                        data.attendanceLive.data.attributes.flight.data
                          .attributes.flightOrigin
                      }
                    </Text>
                  </View>
                  <View className="flex-row space-x-2.5">
                    <MaterialCommunityIcons
                      name="airplane-marker"
                      size={24}
                      color="#034881"
                    />

                    <Text className="text-base font-medium text-regal-blue">
                      Destino:{" "}
                      {
                        data.attendanceLive.data.attributes.flight.data
                          .attributes.flightDestiny
                      }
                    </Text>
                  </View>
                  <View className="flex-row space-x-2.5">
                    <MapPinIcon width={24} height={24} />

                    <Text className="text-base font-medium text-regal-blue">
                      Box{" "}
                      {
                        data.attendanceLive.data.attributes.flight.data
                          .attributes.BOX
                      }
                    </Text>
                  </View>

                  {data.attendanceLive.data.attributes.flight.data.attributes
                    .actionType === "Departure" ? (
                    <View className="flex-row space-x-2.5">
                      <MaterialCommunityIcons
                        name="airplane-clock"
                        size={24}
                        color="#034881"
                      />
                      <Text className="text-base font-medium text-regal-blue">
                        ETD:{" "}
                        {data.attendanceLive.data.attributes.flight.data.attributes.ETD?.slice(
                          0,
                          5,
                        ) ?? "-"}
                      </Text>
                    </View>
                  ) : (
                    <View className="flex-row space-x-2.5">
                      <MaterialCommunityIcons
                        name="airplane-clock"
                        size={24}
                        color="#034881"
                      />
                      <Text className="text-base font-medium text-regal-blue">
                        ETA:{" "}
                        {data.attendanceLive.data.attributes.flight.data.attributes.ETA?.slice(
                          0,
                          5,
                        ) ?? "-"}
                      </Text>
                    </View>
                  )}

                  <View className="flex-row space-x-2.5">
                    <MaterialIcons
                      name="local-airport"
                      size={24}
                      color="#034881"
                    />

                    <Text className="text-base font-medium text-regal-blue">
                      {
                        data.attendanceLive.data.attributes.flight.data
                          .attributes.aircraft.data.attributes.name
                      }
                    </Text>
                  </View>

                  <Text className="text-base font-medium text-regal-blue">
                    Cód. Roteiro:{" "}
                    <Text className="text-base font-medium text-gray-neutral">
                      {
                        data.attendanceLive.data.attributes
                          .attendance_spec_origin.data.attributes.code
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
                        data.attendanceLive.data.attributes
                          .attendance_spec_origin.data.attributes.description
                      }
                    </Text>
                  </Text>
                  <View>
                    <TasksCollapsible data={data} />
                  </View>
                </View>
              </ScrollView>
            </View>

            <ActivityCpmLirButton
              actionType={
                data.attendanceLive.data.attributes.flight.data.attributes
                  .actionType
              }
              cpm={
                data.attendanceLive.data.attributes.flight.data.attributes.cpm
              }
              lir={
                data.attendanceLive.data.attributes.flight.data.attributes.lir
              }
            />

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
                onPress={checkEquipments}
                disabled={isStarting}
                className="flex-1 flex-row items-center space-x-2.5 rounded-md bg-regal-blue p-4"
              >
                <Text className="flex-1 text-center text-sm font-bold uppercase text-white">
                  Iniciar
                </Text>

                {isStarting ? (
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
