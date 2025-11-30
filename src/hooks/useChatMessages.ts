import { QueryHookOptions, useQuery } from "@apollo/client";
import {
  ChatMessagesQueryResponse,
  chatMessageQuery,
} from "~/graphql/queries/chatMessages";

export function useChatMessages(
  options?: QueryHookOptions<ChatMessagesQueryResponse>,
) {
  return useQuery<ChatMessagesQueryResponse>(chatMessageQuery, options);
}
