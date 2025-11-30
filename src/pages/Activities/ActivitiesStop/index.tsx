import { useNavigation, useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import { useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import ArrowBackIcon from "~/assets/icons/arrow-back.svg";
import { ActivityCpmLirButton } from "~/components/ActivityCpmLirButton";
import { ActivityTimeForecast } from "~/components/ActivityTimeForecast";
import Layout from "~/components/Layout";
import OrbitalBackground from "~/components/OrbitalBackground";
import { QueryFailed } from "~/components/QueryFailed";
import { Spinner } from "~/components/Spinner";
import {
  StopAttendanceLiveVariables,
  stopAttendanceLiveMutation,
} from "~/graphql/mutations/stop-attendance-live";
import { useAttendanceLiveById } from "~/hooks/useAttendanceLiveById";
import { useLoggedUserDepartmentIds } from "~/hooks/useLoggedUserDepartmentIds";
import { useQueryPolling } from "~/hooks/useQueryPolling";
import { apolloClient } from "~/lib/apollo";
import { getPreviousTaskDurationMinutes } from "~/utils/getPreviousTaskDurationMinutes";
import { TaskCard } from "./TaskCard";

export interface ActivitiesStopParams {
  id: string;
}

interface ActivitiesStopProps {}

export const ActivitiesStop: React.FC<ActivitiesStopProps> = () => {
  const { params } = useRoute();
  const { navigate } = useNavigation();
  const [isFinishing, setIsFinishing] = useState(false);
  const { departmentIds, isLoading } = useLoggedUserDepartmentIds();
  const { id } = params as ActivitiesStopParams;
  const { data, loading, error, refetch, startPolling, stopPolling } =
    useAttendanceLiveById({
      skip: isLoading,
      variables: {
        id,
        departmentIds,
      },
    });

  useQueryPolling(10000, startPolling, stopPolling);

  const totalTasksDurationMinutes =
    data?.attendanceLive.data.attributes.attendanceLiveTasks.data.reduce(
      (total, attendanceLiveTask) => {
        return total + attendanceLiveTask.attributes.durationMinutes;
      },
      0,
    ) ?? 0;

  const progress = Math.ceil(
    data?.attendanceLive.data.attributes.attendanceLiveTasks.data.reduce(
      (progress, attendanceLiveTask) => {
        if (attendanceLiveTask.attributes.status === "Done") {
          progress +=
            (attendanceLiveTask.attributes.durationMinutes /
              totalTasksDurationMinutes) *
            100;
        }

        return progress;
      },
      0,
    ) ?? 0,
  );
  function handleGoBack() {
    navigate("ActivitiesList");
  }

  async function handleStop() {
    if (
      !data?.attendanceLive.data.attributes.attendanceLiveTasks.data.every(
        task => task.attributes.status === "Done",
      )
    ) {
      return Alert.alert(
        "Erro",
        "É necessário finalizar todas as tarefas primeiro.",
      );
    }

    setIsFinishing(true);

    try {
      await apolloClient.mutate<{}, StopAttendanceLiveVariables>({
        mutation: stopAttendanceLiveMutation,
        variables: {
          id,
          dtStop: new Date().toISOString(),
        },
      });

      navigate("ActivitiesFinish", { id });
    } catch (error) {
      console.error(error);
      setIsFinishing(false);
      Alert.alert("Erro.", "Não foi possível finalizar a atividade.");
    }
  }

  const [hoursArrival, minutesArrival, secondsArrival] =
    data?.attendanceLive.data.attributes.flight.data.attributes.STA.split(
      ":",
    ).map(Number) ?? [];

  const startsAt = dayjs(
    data?.attendanceLive.data.attributes.flight.data.attributes.flightDate,
  )
    .set("hours", hoursArrival)
    .set("minutes", minutesArrival)
    .set("seconds", secondsArrival)
    .set("milliseconds", 0)
    .add(data?.attendanceLive.data.attributes.minutesToStart ?? 0, "minutes");

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
          <View className="flex-1 pb-5">
            <View className="px-5">
              <ActivityTimeForecast
                attendanceLive={data.attendanceLive.data.attributes}
              />
            </View>

            <FlatList
              className="mt-2"
              keyExtractor={task => task.id}
              contentContainerStyle={{ paddingVertical: 16 }}
              data={data.attendanceLive.data.attributes.attendanceLiveTasks.data.filter(
                attendanceLiveTask =>
                  attendanceLiveTask.attributes.status !== "Done",
              )}
              ListEmptyComponent={() => (
                <Text className="text-center text-sm text-gray-neutral">
                  Esta atividade não possui tarefas para o seu departamento.
                </Text>
              )}
              renderItem={({ item: task }) => (
                <TaskCard
                  task={task}
                  activityId={id}
                  userDepartmentIds={departmentIds}
                  activityStartsAt={startsAt}
                  previousTaskDurationMinutes={getPreviousTaskDurationMinutes(
                    data.attendanceLive.data.attributes.attendanceLiveTasks
                      .data,
                    task,
                  )}
                />
              )}
            />

            <View className="mb-2 px-5">
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
            </View>

            <View className="flex-row items-center space-x-1.5 px-5">
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
                onPress={handleStop}
                disabled={isFinishing || progress < 100}
                className="flex-1 flex-row items-center space-x-2.5 rounded-md bg-regal-blue p-4"
              >
                <Text className="flex-1 text-center text-sm font-bold uppercase text-white">
                  Finalizar
                </Text>

                {/* {isFinishing ? (
                  <ActivityIndicator size={24} color="white" />
                ) : progress < 100 ? (
                  <CircularProgress
                    backgroundColor="darkcyan"
                    progress={progress}
                    size={24}
                    strokeWidth={2}
                    ringColor="white"
                  />
                ) : (
                  <CheckboxOutlineIcon width={24} height={24} />
                )} */}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Layout>
    </OrbitalBackground>
  );
};
