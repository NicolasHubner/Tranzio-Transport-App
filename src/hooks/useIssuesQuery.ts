import { QueryHookOptions, useQuery } from "@apollo/client";
import {
  IssuesQueryFormatedResponse,
  IssuesQueryResponse,
  IssuesQueryVariables,
  issuesQuery,
} from "~/graphql/queries/issues";

export function useIssuesQuery(
  options?: QueryHookOptions<IssuesQueryResponse, IssuesQueryVariables>,
) {
  return useQuery<IssuesQueryResponse, IssuesQueryVariables>(
    issuesQuery,
    options,
  );
}
export function useIssuesFormatedQuery(
  options?: QueryHookOptions<IssuesQueryFormatedResponse, IssuesQueryVariables>,
) {
  return useQuery<IssuesQueryFormatedResponse, IssuesQueryVariables>(
    issuesQuery,
    options,
  );
}
