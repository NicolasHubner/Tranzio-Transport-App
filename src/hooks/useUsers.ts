import { QueryHookOptions, useQuery } from "@apollo/client";
import {
  UsersQueryResponse,
  UsersQueryVariables,
  usersQuery,
} from "~/graphql/queries/users";

export function useUsers(
  options?: QueryHookOptions<UsersQueryResponse, UsersQueryVariables>,
) {
  return useQuery<UsersQueryResponse, UsersQueryVariables>(usersQuery, options);
}
