import { QueryHookOptions, useQuery } from "@apollo/client";
import {
  ChatMessagesStateQueryResponse,
  chatMessageStateQuery,
} from "~/graphql/queries/chatMessageStates";

export function useChatMessageStates(
  options?: QueryHookOptions<ChatMessagesStateQueryResponse>,
) {
  return useQuery<ChatMessagesStateQueryResponse>(
    chatMessageStateQuery,
    options,
  );
}
