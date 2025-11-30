import { QueryHookOptions, useQuery } from "@apollo/client";
import {
  UserChatsQueryResponse,
  UserChatsQueryVariables,
  userChatsQuery,
} from "~/graphql/queries/user-chats";

export function useUserChats(
  options?: QueryHookOptions<UserChatsQueryResponse, UserChatsQueryVariables>,
) {
  return useQuery<UserChatsQueryResponse, UserChatsQueryVariables>(
    userChatsQuery,
    options,
  );
}
