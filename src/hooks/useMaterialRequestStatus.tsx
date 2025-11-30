import { QueryHookOptions, useQuery } from "@apollo/client";
import {
  MaterialRequestStatusQueryResponse,
  MaterialRequestStatusQueryVariables,
  materialStatusQuery,
} from "~/graphql/queries/materialRequestsStatus";

export function useMaterialRequestStatus(
  options?: QueryHookOptions<
    MaterialRequestStatusQueryResponse,
    MaterialRequestStatusQueryVariables
  >,
) {
  return useQuery<
    MaterialRequestStatusQueryResponse,
    MaterialRequestStatusQueryVariables
  >(materialStatusQuery, options);
}
