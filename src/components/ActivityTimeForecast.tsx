import dayjs from "dayjs";
import { Text, View } from "react-native";
import { AttendanceLiveByIdQueryResponse } from "~/graphql/queries/attendanceLiveById";
import { getPreviousTaskDurationMinutes } from "~/utils/getPreviousTaskDurationMinutes";

interface ActivityTimeForecastProps {
  attendanceLive: AttendanceLiveByIdQueryResponse["attendanceLive"]["data"]["attributes"];
}

export const ActivityTimeForecast: React.FC<ActivityTimeForecastProps> = ({
  attendanceLive,
}) => {
  const arrivalTime =
    attendanceLive.flight.data.attributes.ETA ||
    attendanceLive.flight.data.attributes.STA;

  const [hoursArrival, minutesArrival, secondsArrival] = arrivalTime
    .split(":")
    .map(Number);

  const startsAt = dayjs(attendanceLive.flight.data.attributes.flightDate)
    .set("hours", hoursArrival)
    .set("minutes", minutesArrival)
    .set("seconds", secondsArrival)
    .set("milliseconds", 0)
    .add(attendanceLive.minutesToStart ?? 0, "minutes");

  const totalActivityDurationMinutes =
    attendanceLive.attendanceLiveTasks.data.reduce(
      (totalMinutes, attendanceLiveTask) => {
        const minutes =
          attendanceLiveTask.attributes.durationMinutes +
          getPreviousTaskDurationMinutes(
            attendanceLive.attendanceLiveTasks.data,
            attendanceLiveTask,
          );

        if (minutes > totalMinutes) {
          return minutes;
        }

        return totalMinutes;
      },
      0,
    ) ?? 0;

  const endsAt = startsAt.add(totalActivityDurationMinutes, "minutes");
  return (
    <View className="space-y-2 rounded-lg bg-regal-blue px-7 py-2.5">
      <Text className="text-sm font-semibold text-white">
        <Text className="text-sm font-semibold capitalize text-white">
          {attendanceLive.department.data.attributes.name.toLowerCase()}
        </Text>{" "}
        {attendanceLive.attendance_spec_origin.data.attributes.description}
      </Text>

      <Text className="text-xs font-normal text-white/50">
        Previsão de atividade: {startsAt.format("HH:mm")} -{" "}
        {endsAt.format("HH:mm")}
      </Text>
    </View>
  );
};
