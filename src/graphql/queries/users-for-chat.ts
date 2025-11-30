import { gql } from "@apollo/client";

export interface UsersForChatQueryResponse {
  usersPermissionsUsers: {
    data: Array<{
      id: string;
      attributes: {
        name: string;
        username: string;
      };
    }>;
  };
}

export interface UsersForChatQueryVariables {
  query?: string;
}

export const usersForChatQuery = gql`
  query GetAllUsersForChat($query: String) {
    usersPermissionsUsers(
      sort: "name:asc"
      pagination: { limit: 25 }
      filters: { name: { containsi: $query } }
    ) {
      data {
        id
        attributes {
          name
          username
        }
      }
    }
  }
`;
