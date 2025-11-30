import { gql } from "@apollo/client";

export interface LoginMutationResponse {
  login: {
    jwt: string;
    user: {
      id: string;
    };
  };
}

export interface LoginMutationVariables {
  input: {
    identifier: string;
    password: string;
  };
}

export const loginMutation = gql`
  mutation Login($input: UsersPermissionsLoginInput!) {
    login(input: $input) {
      jwt
      user {
        id
      }
    }
  }
`;
