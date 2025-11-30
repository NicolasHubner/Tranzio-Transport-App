import { QueryHookOptions, useQuery } from "@apollo/client";
import {
  AttendanceLivesQueryResponse,
  AttendanceLivesQueryVariables,
  attendanceLivesQuery,
} from "~/graphql/queries/attendanceLives";

export function useAttendanceLives(
  options?: QueryHookOptions<
    AttendanceLivesQueryResponse,
    AttendanceLivesQueryVariables
  >,
) {
  return useQuery<AttendanceLivesQueryResponse, AttendanceLivesQueryVariables>(
    attendanceLivesQuery,
    options,
  );
}
