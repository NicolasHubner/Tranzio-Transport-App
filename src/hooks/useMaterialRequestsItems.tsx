import { useQuery } from "@apollo/client";
import { MaterialRequestsItemsQuery, MaterialRequestsItemsQueryResponse, MaterialRequestsItemsVariables } from "~/graphql/queries/materialRequestsItems";


export function useMaterialRequestsItems(id: string) {
  return useQuery<MaterialRequestsItemsQueryResponse, MaterialRequestsItemsVariables>(
    MaterialRequestsItemsQuery, {
    skip: !id,
    variables: {
      id: id!,
    },
  },
  )
}