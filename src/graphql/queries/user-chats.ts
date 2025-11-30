import { gql } from "@apollo/client";

export interface UserChatsQueryResponse {
  chats: {
    data: Array<{
      id: string;
      attributes: {
        users: {
          data: Array<{
            id: string;
          }>;
        };
      };
    }>;
  };
}

export interface UserChatsQueryVariables {
  userId: string;
  type?: "direct" | "group";
}

export const userChatsQuery = gql`
  query GetAllUserChats($userId: ID!, $type: String) {
    chats(
      pagination: { limit: -1 }
      filters: { type: { eq: $type }, users: { id: { eq: $userId } } }
    ) {
      data {
        id
        attributes {
          users {
            data {
              id
            }
          }
        }
      }
    }
  }
`;
