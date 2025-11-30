import { gql } from "@apollo/client";

export interface UpdateShiftMutationVariables {
  userId: string;
  isShiftOpen: boolean;
}

export const updateShiftMutation = gql`
  mutation UpdateShift($userId: ID!, $isShiftOpen: Boolean!) {
    updateUsersPermissionsUser(
      id: $userId
      data: { isShiftOpen: $isShiftOpen }
    ) {
      data {
        id
      }
    }
  }
`;
