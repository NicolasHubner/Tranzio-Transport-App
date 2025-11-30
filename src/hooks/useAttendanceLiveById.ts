import { QueryHookOptions, useQuery } from "@apollo/client";
import {
  AttendanceLiveByIdQueryResponse,
  AttendanceLiveByIdQueryVariables,
  attendanceLiveByIdQuery,
} from "~/graphql/queries/attendanceLiveById";

export function useAttendanceLiveById(
  options?: QueryHookOptions<
    AttendanceLiveByIdQueryResponse,
    AttendanceLiveByIdQueryVariables
  >,
) {
  return useQuery<
    AttendanceLiveByIdQueryResponse,
    AttendanceLiveByIdQueryVariables
  >(attendanceLiveByIdQuery, options);
}
