import { gql } from "@apollo/client";

export interface ResetPasswordResponse {
  resetUserPassword: {
    success: boolean;
    message: string;
  };
}

export interface ResetPasswordVariables {
  token: string;
  password: string;
}

export const ResetPasswordToken = gql`
  mutation ResetPassword($token: String!, $password: String!) {
    resetUserPassword(token: $token, password: $password) {
      success
      message
    }
  }
`;
