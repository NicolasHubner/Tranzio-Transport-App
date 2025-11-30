import { gql } from "@apollo/client";

export interface StartIssueMutationVariables {
  id: string;
  dtStart?: string;
  status?: string;
  workerId: string;
}
export interface RemoveUserFromIssueMutationVariables {
  id: string;
  dtStart?: string;
  status?: string;
  workerId: string[];
}
export interface StartIssueMutationResponse {
  updateIssue: {
    data: {
      id: string;
      attributes: {
        dtStart: string;
      };
    };
  };
}

export const startIssueMutation = gql`
  mutation StartIssue(
    $id: ID!
    $dtStart: DateTime
    $status: ENUM_ISSUE_STATUS
    $workerId: [ID]
  ) {
    updateIssue(
      id: $id
      data: { dtStart: $dtStart, status: $status, users: $workerId }
    ) {
      data {
        id
        attributes {
          dtStart
        }
      }
    }
  }
`;
