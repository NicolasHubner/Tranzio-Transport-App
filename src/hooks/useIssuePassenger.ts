import { useQuery } from "@apollo/client";
import { PassagersQueryResponse, PassagersQueryVariables, passagersQuery } from "~/graphql/queries/issuePassangers";

export function usePassengersQuery(id: string) {

  return useQuery<PassagersQueryResponse, PassagersQueryVariables>(
    passagersQuery,
    {
      variables: {
        issuePassenger: {
          id: { eq: id }
        }
      }
    }

  );
}
