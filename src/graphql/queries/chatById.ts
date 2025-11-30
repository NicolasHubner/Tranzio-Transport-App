import { gql } from "@apollo/client";

export interface ChatByIdQueryResponse {
  chat: {
    data: {
      id: string;
      attributes: {
        name: string;
        users: {
          data: Array<{
            id: string;
            attributes: {
              name: string;
            };
          }>;
        };
      };
    };
  };
}

export interface ChatByIdQueryVariables {
  id: string;
}

export const chatByIdQuery = gql`
  query GetChatById($id: ID!) {
    chat(id: $id) {
      data {
        id
        attributes {
          name
          users {
            data {
              id
              attributes {
                name
              }
            }
          }
        }
      }
    }
  }
`;
