import { QueryHookOptions, useQuery } from "@apollo/client";
import {
  ChatGroupsQueryResponse,
  chatGroupsQuery,
} from "~/graphql/queries/chatGroups";

export function useChatGroups(
  options?: QueryHookOptions<ChatGroupsQueryResponse>,
) {
  return useQuery<ChatGroupsQueryResponse>(chatGroupsQuery, options);
}
