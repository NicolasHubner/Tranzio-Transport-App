import { QueryHookOptions, useQuery } from "@apollo/client";
import {
  UserByIdQueryResponse,
  UserByIdQueryVariables,
  userByIdQuery,
} from "~/graphql/queries/user";

export function useUserById(
  options?: QueryHookOptions<UserByIdQueryResponse, UserByIdQueryVariables>,
) {
  return useQuery<UserByIdQueryResponse, UserByIdQueryVariables>(
    userByIdQuery,
    options,
  );
}
