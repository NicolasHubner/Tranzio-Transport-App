import { gql } from "@apollo/client";

export interface CreateChatGroupResponse {
  createChatGroup: {
    data: {
      id: string;
      attributes: {
        name: string;
        users: {
          id: string;
          attributes: {
            name: string;
          };
        };
      };
    };
  };
}

export interface CreateChatGroupVariables {
  input: {
    name: string;
    user: string;
  };
}

export const createChatGroupMutation = gql`
  mutation CreateChatGroup($input: ChatGroupInput!) {
    createChatGroup(data: $input) {
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
