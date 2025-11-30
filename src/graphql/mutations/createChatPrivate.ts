import { gql } from "@apollo/client";

export interface CreateChatPrivateResponse {
  createChatMessageState: {
    data: {
      id: string;
      attributes: {
        name: string;
        users_permissions_user: {
          id: string;
          attributes: {
            name: string;
          };
        };
      };
    };
  };
}

export interface CreateChatPrivateVariables {
  input: {
    users_permissions_user: string;
    name: string;
  };
}

export const createChatPrivateMutation = gql`
  mutation CreateChatPrivate($input: ChatPrivateInput!) {
    createChatPrivate(data: $input) {
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
