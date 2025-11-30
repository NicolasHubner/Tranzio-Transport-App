import { gql } from "@apollo/client";

export interface UpdateUserExpoPushTokenMutationResponse {
  updateUsersPermissionsUser: {
    data: {
      id: string;
    };
  };
}

export interface UpdateUserExpoPushTokenMutationVariables {
  id: string;
  expoPushToken: string | null;
}

export const updateUserExpoPushTokenMutation = gql`
  mutation UpdateUserExpoPushToken($id: ID!, $expoPushToken: String) {
    updateUsersPermissionsUser(
      id: $id
      data: { expoPushToken: $expoPushToken }
    ) {
      data {
        id
      }
    }
  }
`;
