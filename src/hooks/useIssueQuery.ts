import { QueryHookOptions, useQuery } from "@apollo/client";
import {
  IssueQueryResponse,
  IssueQueryVariables,
  issueQuery,
} from "~/graphql/queries/issue";

export function useIssueQuery(
  options?: QueryHookOptions<IssueQueryResponse, IssueQueryVariables>,
) {
  return useQuery<IssueQueryResponse, IssueQueryVariables>(issueQuery, options);
}
