import type { AttendanceLiveByIdQueryResponse } from "~/graphql/queries/attendanceLiveById";

type Task =
  AttendanceLiveByIdQueryResponse["attendanceLive"]["data"]["attributes"]["attendanceLiveTasks"]["data"][number];

export function getPreviousTaskDurationMinutes(
  tasks: Task[],
  task?: Task,
): number {
  if (!task || !task.attributes.attendance_live_previous_task.data) {
    return 0;
  }

  const previousTask = tasks.find(
    ({ id }) => id === task.attributes.attendance_live_previous_task.data!.id,
  );

  return (
    (previousTask?.attributes.durationMinutes ?? 0) +
    getPreviousTaskDurationMinutes(tasks, previousTask)
  );
}
