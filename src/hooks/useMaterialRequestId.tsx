import { useQuery } from "@apollo/client";
import {
  MaterialRequestIdQuery,
  MaterialRequestIdQueryResponse,
  MaterialRequestIdVariables,
} from "~/graphql/queries/materialRequestId";

export function useMaterialRequestId(id?: string) {
  return useQuery<MaterialRequestIdQueryResponse, MaterialRequestIdVariables>(
    MaterialRequestIdQuery,
    {
      skip: !id,
      variables: {
        id: {
          eq: id!,
        },
      },
    },
  );
}
