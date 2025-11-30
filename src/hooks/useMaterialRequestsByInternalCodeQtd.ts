import { QueryHookOptions, useQuery } from "@apollo/client";
import {
  MaterialRequestItemByInternalCodeQtdQuery,
  MaterialRequestItemByInternalCodeQtdQueryResponse,
  MaterialRequestItemByInternalCodeQtdVariables,
} from "~/graphql/queries/materialRequestItemsByInternalCodeQtd";

export function useMaterialRequestsItemByInternalCodeQtd(
  options?: QueryHookOptions<
    MaterialRequestItemByInternalCodeQtdQueryResponse,
    MaterialRequestItemByInternalCodeQtdVariables
  >,
) {
  return useQuery<
    MaterialRequestItemByInternalCodeQtdQueryResponse,
    MaterialRequestItemByInternalCodeQtdVariables
  >(MaterialRequestItemByInternalCodeQtdQuery, options);
}
