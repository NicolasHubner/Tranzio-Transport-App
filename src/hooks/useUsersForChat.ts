import { QueryHookOptions, useQuery } from "@apollo/client";
import {
  UsersForChatQueryResponse,
  UsersForChatQueryVariables,
  usersForChatQuery,
} from "~/graphql/queries/users-for-chat";

export function useUsersForChat(
  options?: QueryHookOptions<
    UsersForChatQueryResponse,
    UsersForChatQueryVariables
  >,
) {
  return useQuery<UsersForChatQueryResponse, UsersForChatQueryVariables>(
    usersForChatQuery,
    options,
  );
}
