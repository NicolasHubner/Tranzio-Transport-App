import { gql } from "@apollo/client";

export interface UpdateUserPasswordResponse {
  updateUsersPermissionsUser: {
    data: {
      id: string;
      attributes: {
        name: string;
        username: string;
        isFirstLogin: boolean;
      };
    };
  };
}

export interface UpdateUserPasswordVariables {
  id: string;
  input: {
    password?: string;
    isFirstLogin: boolean;
  };
}

export const updateUserPasswordMutation = gql`
  mutation updateUserPassword($id: ID!, $input: UsersPermissionsUserInput!) {
    updateUsersPermissionsUser(id: $id, data: $input) {
      data {
        id
        attributes {
          name
          username
          email
          isFirstLogin
        }
      }
    }
  }
`;
