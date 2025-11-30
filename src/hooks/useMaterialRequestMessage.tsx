import { useQuery } from "@apollo/client";
import { MaterialRequestMessageQuery, MaterialRequestMessageResponse, MaterialRequestMessageVariables } from "~/graphql/queries/materialRequestMessage";
import { useAuth } from "./useAuth";

export function useMaterialRequestMessage() {
  const { user } = useAuth();
  const id = user?.id;

  return useQuery<MaterialRequestMessageResponse, MaterialRequestMessageVariables>(MaterialRequestMessageQuery, {
    skip: !id,
    variables: {
      id: {
        eq: id!,
      },
      status: "delivered"
    },
  });
}

