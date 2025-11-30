import { gql } from "@apollo/client";

export interface ChatGroupsQueryResponse {
  chatGroups: {
    data: {
      id: string;
      attributes: {
        name: string;
        users: {
          data: {
            id: string;
            attributes: {
              name: string;
            };
          };
        };
      };
    };
  };
}

export const chatGroupsQuery = gql`
  query GetAllChatGroup {
    chatGroups {
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
