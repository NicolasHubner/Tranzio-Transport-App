import { useQuery } from "@apollo/client";
import {
  MaterialRequestByIdQuery,
  MaterialRequestByIdQueryResponse,
  MaterialRequestByIdVariables,
} from "~/graphql/queries/materialRequest";
import { useAuth } from "./useAuth";

export function useMaterialRequest() {
  const { user } = useAuth();
  const id = user?.id;

  return useQuery<
    MaterialRequestByIdQueryResponse,
    MaterialRequestByIdVariables
  >(MaterialRequestByIdQuery, {
    skip: !id,
    variables: {
      id: {
        eq: id!,
      },
    },
  });
}
