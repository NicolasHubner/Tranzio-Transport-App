import { QueryHookOptions, useQuery } from "@apollo/client";
import {
  ChatMessagesByChatIdQueryResponse,
  ChatMessagesByChatIdQueryVariables,
  chatMessagesByChatIdQuery,
} from "~/graphql/queries/chatMessagesByChatId";

export function useChatMessagesByChatId(
  options?: QueryHookOptions<
    ChatMessagesByChatIdQueryResponse,
    ChatMessagesByChatIdQueryVariables
  >,
) {
  return useQuery<
    ChatMessagesByChatIdQueryResponse,
    ChatMessagesByChatIdQueryVariables
  >(chatMessagesByChatIdQuery, options);
}
