import { QueryHookOptions, useQuery } from "@apollo/client";
import { IssuesDtStartQueryResponse, IssuesDtStartQueryVariables, issuesDtStartQuery } from "~/graphql/queries/issuesDtStart";

export function useIssuesDtStartQuery(
  options?: QueryHookOptions<IssuesDtStartQueryResponse, IssuesDtStartQueryVariables>,
) {
  return useQuery<IssuesDtStartQueryResponse, IssuesDtStartQueryVariables>(
    issuesDtStartQuery,
    options,
  );
}
