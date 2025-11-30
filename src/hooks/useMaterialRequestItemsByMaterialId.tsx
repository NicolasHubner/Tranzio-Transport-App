import { QueryHookOptions, useQuery } from "@apollo/client";
import {
  MaterialRequestItemsByMaterialIdQueryResponse,
  MaterialRequestItemsByMaterialIdQueryVariables,
  materialRequestItemsByMaterialIdQuery,
} from "~/graphql/queries/materialRequestsItemsByMaterialId";

export function useMaterialRequestItemsByMaterialId(
  options?: QueryHookOptions<
    MaterialRequestItemsByMaterialIdQueryResponse,
    MaterialRequestItemsByMaterialIdQueryVariables
  >,
) {
  return useQuery<
    MaterialRequestItemsByMaterialIdQueryResponse,
    MaterialRequestItemsByMaterialIdQueryVariables
  >(materialRequestItemsByMaterialIdQuery, options);
}
