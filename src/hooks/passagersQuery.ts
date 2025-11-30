import { QueryHookOptions, useQuery } from "@apollo/client";
import { passagersQuery } from "~/graphql/queries/issuePassangers";
import {
  IssuesQueryResponse,
  IssuesQueryVariables,
} from "~/graphql/queries/issues";

export function passagersIssuesQuery(
  options?: QueryHookOptions<IssuesQueryResponse, IssuesQueryVariables>,
) {
  return useQuery<IssuesQueryResponse, IssuesQueryVariables>(
    passagersQuery,
    options,
  );
}
