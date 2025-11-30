import { gql } from "@apollo/client";

export interface UsersQueryResponse {
  usersPermissionsUsers: {
    data: Array<{
      id: string;
      attributes: {
        name: string;
      };
    }>;
  };
}

export interface UsersQueryVariables {
  query?: string;
}

export const usersQuery = gql`
  query GetAllUsers($query: String) {
    usersPermissionsUsers(
      pagination: { limit: -1 }
      filters: { name: { containsi: $query } }
    ) {
      data {
        id
        attributes {
          name
        }
      }
    }
  }
`;
