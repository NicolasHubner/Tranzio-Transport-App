import { QueryHookOptions, useQuery } from "@apollo/client";
import {
  ChatsQueryResponse,
  ChatsQueryVariables,
  chatsQuery,
} from "~/graphql/queries/chats";

export function useChats(
  options?: QueryHookOptions<ChatsQueryResponse, ChatsQueryVariables>,
) {
  return useQuery<ChatsQueryResponse, ChatsQueryVariables>(chatsQuery, options);
}
