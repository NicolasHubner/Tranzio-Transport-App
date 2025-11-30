import { gql } from "@apollo/client";

export interface SendResetPasswordTokenResponse {
  sendResetPasswordToken: {
    success: boolean;
    status: number;
  };
}

export interface SendResetPasswordTokenVariables {
  email: string;
}

export const sendResetPasswordTokenMutation = gql`
  mutation SendResetPasswordToken($email: String!) {
    sendResetPasswordToken(email: $email, origin: MOBILE) {
      success
      status
    }
  }
`;
