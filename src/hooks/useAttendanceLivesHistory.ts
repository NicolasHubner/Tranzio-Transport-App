import { QueryHookOptions, useQuery } from "@apollo/client";
import {
  AttendanceLivesHistoryQueryResponse,
  AttendanceLivesHistoryQueryVariables,
  attendanceLivesHistoryQuery,
} from "~/graphql/queries/attendanceLivesHistory";

export function useAttendanceLivesHistory(
  options?: QueryHookOptions<
    AttendanceLivesHistoryQueryResponse,
    AttendanceLivesHistoryQueryVariables
  >,
) {
  return useQuery<
    AttendanceLivesHistoryQueryResponse,
    AttendanceLivesHistoryQueryVariables
  >(attendanceLivesHistoryQuery, options);
}
