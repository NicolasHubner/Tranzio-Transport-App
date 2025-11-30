import { QueryHookOptions, useQuery } from "@apollo/client";
import {
  UserDepartmentQueryResponse,
  UserDepartmentQueryVariables,
  userDepartmentQuery,
} from "~/graphql/queries/userDepartment";

export function useUserDepartment(
  options: QueryHookOptions<
    UserDepartmentQueryResponse,
    UserDepartmentQueryVariables
  >,
) {
  return useQuery<UserDepartmentQueryResponse, UserDepartmentQueryVariables>(
    userDepartmentQuery,
    options,
  );
}
