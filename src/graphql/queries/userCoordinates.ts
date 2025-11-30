import { gql } from "@apollo/client";

export interface UserCoordinatesQueryResponse {
  userCoordinates: {
    data: Array<{
      id: string;
    }>;
  };
}
export interface UserCoordinatesQueryVariables {
  id: string;
}

export const userCoordinatesQuery = gql`
  query GetAllWorkerCoordinates($id: ID!) {
    userCoordinates(filters: { user: { id: { eq: $id } } }) {
      data {
        id
      }
    }
  }
`;
