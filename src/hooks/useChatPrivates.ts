import { QueryHookOptions, useQuery } from "@apollo/client";
import {
  ChatPrivatesQueryResponse,
  chatPrivatesQuery,
} from "~/graphql/queries/chatPrivates";

export function useChatPrivates(
  options?: QueryHookOptions<ChatPrivatesQueryResponse>,
) {
  return useQuery<ChatPrivatesQueryResponse>(chatPrivatesQuery, options);
}
