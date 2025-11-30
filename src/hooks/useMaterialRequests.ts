import { QueryHookOptions, useQuery } from "@apollo/client";
import {
  MaterialRequestsQuery,
  MaterialRequestsQueryResponse,
} from "~/graphql/queries/materialRequests";

export function useMaterialRequests(
  options?: QueryHookOptions<MaterialRequestsQueryResponse>,
) {
  return useQuery<MaterialRequestsQueryResponse>(
    MaterialRequestsQuery,
    options,
  );
}
