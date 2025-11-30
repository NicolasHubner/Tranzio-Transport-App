import { useQuery } from "@apollo/client";
import {
  UserCoordinatesQueryResponse,
  UserCoordinatesQueryVariables,
  userCoordinatesQuery,
} from "~/graphql/queries/userCoordinates";

export function useUserCoordinates(id: string) {
  return useQuery<UserCoordinatesQueryResponse, UserCoordinatesQueryVariables>(
    userCoordinatesQuery,
    {
      variables: {
        id: id,
      },
    },
  );
}
