import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import React, { useMemo } from "react";
import { Alert, Animated, Text, TouchableOpacity, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import CameraPlusIcon from "~/assets/icons/camera-plus.svg";
import PenNibIcon from "~/assets/icons/pen-nib.svg";
import RateReviewIcon from "~/assets/icons/rate-review.svg";
import {
  UpdateAttendanceLiveTaskStatusResponse,
  UpdateAttendanceLiveTaskStatusVariables,
  updateAttendanceLiveTaskStatusMutation,
} from "~/graphql/mutations/update-attendance-live-task-status";
import {
  AttendanceLiveByIdQueryResponse,
  AttendanceLiveByIdQueryVariables,
  attendanceLiveByIdQuery,
} from "~/graphql/queries/attendanceLiveById";
import { apolloClient } from "~/lib/apollo";

interface TaskCardProps {
  activityId: string;
  userDepartmentIds?: string[];
  activityStartsAt: dayjs.Dayjs;
  previousTaskDurationMinutes: number;
  task: AttendanceLiveByIdQueryResponse["attendanceLive"]["data"]["attributes"]["attendanceLiveTasks"]["data"][number];
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  activityId,
  userDepartmentIds,
  // activityStartsAt,
  // previousTaskDurationMinutes,
}) => {
  const { navigate } = useNavigation();
  // const { now } = useCurrentTime();

  const evidencesCounts = useMemo(() => {
    return task.attributes.attendance_live_task_evidences.data.reduce(
      (counts, evidence) => {
        switch (evidence.attributes.evidenceType) {
          case "Message": {
            counts.message++;
            break;
          }
          case "Photo": {
            counts.photo++;
            break;
          }
          case "Signature": {
            counts.signature++;
            break;
          }
        }

        return counts;
      },
      {
        photo: 0,
        message: 0,
        signature: 0,
      },
    );
  }, [task.attributes.attendance_live_task_evidences.data]);

  function handleNavigateToAddDescription() {
    navigate("ActivitiesAddMessage", {
      attendanceLiveId: activityId,
      attendanceLiveTaskId: task.id,
    });
  }

  function handleNavigateToAddPicture() {
    navigate("ActivitiesAddPicture", {
      attendanceLiveId: activityId,
      attendanceLiveTaskId: task.id,
    });
  }

  function handleNavigateToAddSignature() {
    navigate("ActivitiesAddSignature", {
      attendanceLiveId: activityId,
      attendanceLiveTaskId: task.id,
    });
  }

  const isDone = task.attributes.status === "Done";
  // const startsAt = activityStartsAt.add(previousTaskDurationMinutes, "minutes");

  // const progress = isDone
  //   ? 100
  //   : startsAt.isAfter(now)
  //   ? 0
  //   : clamp(
  //       0,
  //       (dayjs(now).diff(startsAt, "seconds") /
  //         60 /
  //         task.attributes.durationMinutes) *
  //         100,
  //       100,
  //     );

  // const progressBarStyle = useAnimatedStyle(() => {
  //   return {
  //     width: withTiming(`${progress}%`, {
  //       duration: 300,
  //     }),
  //   };
  // }, [progress]);

  // const isDelayed =
  //   !isDone &&
  //   startsAt.add(task.attributes.durationMinutes, "minutes").isBefore(now);

  async function handleComplete() {
    if (
      task.attributes.EvidencePhotoRequired &&
      !task.attributes.attendance_live_task_evidences.data.some(
        evidence => evidence.attributes.evidenceType === "Photo",
      )
    ) {
      return Alert.alert(
        "Erro",
        "É necessário enviar evidência com foto para finalizar esta tarefa.",
      );
    }
    if (
      task.attributes.SignatureOnScreenRequired &&
      !task.attributes.attendance_live_task_evidences.data.some(
        evidence => evidence.attributes.evidenceType === "Signature",
      )
    ) {
      return Alert.alert(
        "Erro",
        "É necessário enviar evidência de assinatura para finalizar esta tarefa.",
      );
    }

    try {
      const variables: AttendanceLiveByIdQueryVariables = {
        id: activityId,
        departmentIds: userDepartmentIds,
      };

      const attendanceLiveData = apolloClient.readQuery<
        AttendanceLiveByIdQueryResponse,
        AttendanceLiveByIdQueryVariables
      >({
        variables,
        query: attendanceLiveByIdQuery,
      });

      if (attendanceLiveData) {
        apolloClient.writeQuery<
          AttendanceLiveByIdQueryResponse,
          AttendanceLiveByIdQueryVariables
        >({
          variables,
          query: attendanceLiveByIdQuery,
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
                      attendanceLiveTask => {
                        if (attendanceLiveTask.id === task.id) {
                          return {
                            ...attendanceLiveTask,
                            attributes: {
                              ...attendanceLiveTask.attributes,
                              status: "Done",
                            },
                          };
                        }
                        return attendanceLiveTask;
                      },
                    ),
                  },
                },
              },
            },
          },
        });
      }
      await apolloClient.mutate<
        UpdateAttendanceLiveTaskStatusResponse,
        UpdateAttendanceLiveTaskStatusVariables
      >({
        mutation: updateAttendanceLiveTaskStatusMutation,
        variables: {
          id: task.id,
          status: "Done",
        },
      });
    } catch {
      Alert.alert("Erro", "Não foi possível alterar o status da tarefa.");
    }
  }

  return (
    <Swipeable
      renderLeftActions={(_progress, dragX) => {
        const transform = dragX.interpolate({
          inputRange: [0, 50, 100, 101],
          outputRange: [-20, 0, 0, 1],
        });

        return (
          <View>
            <Animated.View
              className="h-full w-full"
              style={{ transform: [{ translateX: transform }] }}
            >
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={handleComplete}
                className="h-full items-center justify-center space-y-0.5 bg-[#034881] px-3"
              >
                <Text className="text-sm text-white">
                  {task.attributes.code}
                </Text>

                <View className="aspect-square w-6 items-center justify-center rounded border-3 border-white">
                  {isDone && (
                    <MaterialIcons name="check" color="white" size={16} />
                  )}
                </View>

                <Text className="text-sm text-white">Concluir</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        );
      }}
      renderRightActions={(_progress, dragX) => {
        const transform = dragX.interpolate({
          inputRange: [-300, -250, -50, 0],
          outputRange: [-30, 0, 0, 1],
        });

        return (
          <View>
            <Animated.View
              className="h-full w-full flex-row"
              style={{ transform: [{ translateX: transform }] }}
            >
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={handleNavigateToAddSignature}
                className="relative h-full items-center justify-center space-y-1 bg-[#062B4A] p-6"
              >
                <PenNibIcon width={24} height={24} />
                <Text className="text-sm font-normal text-white">Ass.</Text>

                {evidencesCounts.signature ? (
                  <View
                    style={{ backgroundColor: "#F00" }}
                    className="absolute right-3 top-1 aspect-square w-4 items-center justify-center rounded-full"
                  >
                    <Text className="text-center text-xs font-semibold text-white">
                      {evidencesCounts.signature}
                    </Text>
                  </View>
                ) : null}

                {task.attributes.SignatureOnScreenRequired && (
                  <View
                    style={{ backgroundColor: "#e00b0b" }}
                    className="absolute left-3 top-1 aspect-square w-5 items-center justify-center rounded-full"
                  >
                    <FontAwesome5
                      name="exclamation"
                      size={12}
                      color="white"
                      className="text-center text-xs"
                    />
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.6}
                onPress={handleNavigateToAddDescription}
                className="relative h-full items-center justify-center space-y-1 bg-[#0E5971] p-6"
              >
                <RateReviewIcon width={24} height={24} />
                <Text className="text-sm font-normal text-white">Msg</Text>

                {evidencesCounts.message ? (
                  <View
                    style={{ backgroundColor: "#F00" }}
                    className="absolute right-3 top-1 aspect-square w-4 items-center justify-center rounded-full"
                  >
                    <Text className="text-center text-xs font-semibold text-white">
                      {evidencesCounts.message}
                    </Text>
                  </View>
                ) : null}
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.6}
                onPress={handleNavigateToAddPicture}
                className="relative h-full items-center justify-center space-y-1 bg-[#4795D5] p-6"
              >
                <CameraPlusIcon width={24} height={24} />
                <Text className="text-sm font-normal text-white">Foto</Text>

                {evidencesCounts.photo ? (
                  <View
                    style={{ backgroundColor: "#F00" }}
                    className="absolute right-3 top-1 aspect-square w-4 items-center justify-center rounded-full"
                  >
                    <Text className="text-center text-xs font-semibold text-white">
                      {evidencesCounts.photo}
                    </Text>
                  </View>
                ) : null}

                {task.attributes.EvidencePhotoRequired && (
                  <View
                    style={{ backgroundColor: "#e00b0b" }}
                    className="absolute left-3 top-1 aspect-square w-5 items-center justify-center rounded-full"
                  >
                    <FontAwesome5
                      name="exclamation"
                      size={12}
                      color="white"
                      className="text-center text-xs"
                    />
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          </View>
        );
      }}
    >
      <View className="h-20 flex-row items-center space-x-2 bg-blue-light px-4 py-2.5">
        <View className="flex-1">
          <Text className="text-base font-medium text-[#034881]">
            {task.attributes.description}
          </Text>
          {/* <View
            className={classNames(
              "mt-2 h-2 w-full rounded-full border",
              isDelayed ? "border-red-600" : "border-[#3052A9]",
            )}
          >
            <Reanimated.View
              className={classNames(
                "h-full rounded-full",
                isDelayed ? "bg-red-600" : "bg-[#3052A9]",
              )}
              style={progressBarStyle}
            />
          </View> */}
        </View>

        <MaterialIcons name="chevron-right" size={24} />
      </View>
    </Swipeable>
  );
};
