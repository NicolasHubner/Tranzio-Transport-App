import { QueryHookOptions, useQuery } from "@apollo/client";
import { IssuesNotDtStartQueryResponse, IssuesNotDtStartQueryVariables, issuesNotDtStartQuery } from "~/graphql/queries/issuesNotDtStart";

export function useIssuesNotDtStartQuery(
  options?: QueryHookOptions<IssuesNotDtStartQueryResponse, IssuesNotDtStartQueryVariables>,
) {
  return useQuery<IssuesNotDtStartQueryResponse, IssuesNotDtStartQueryVariables>(
    issuesNotDtStartQuery,
    options,
  );
}
