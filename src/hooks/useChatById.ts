import { QueryHookOptions, useQuery } from "@apollo/client";
import {
  ChatByIdQueryResponse,
  ChatByIdQueryVariables,
  chatByIdQuery,
} from "~/graphql/queries/chatById";

export function useChatById(
  options?: QueryHookOptions<ChatByIdQueryResponse, ChatByIdQueryVariables>,
) {
  return useQuery<ChatByIdQueryResponse, ChatByIdQueryVariables>(
    chatByIdQuery,
    options,
  );
}
