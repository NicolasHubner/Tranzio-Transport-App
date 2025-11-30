import { gql } from "@apollo/client";

export interface ChatPrivatesQueryResponse {
  chatPrivates: {
    data: Array<{
      id: string;
      attributes: {
        name: string;
        user: {
          data: {
            id: string;
            attributes: {
              name: string;
            };
          };
        };
      };
    }>;
  };
}

export const chatPrivatesQuery = gql`
  query GetAllChatPrivates {
    chatPrivates {
      data {
        id
        attributes {
          name
          user {
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
