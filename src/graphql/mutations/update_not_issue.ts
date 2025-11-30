import { gql } from "@apollo/client";

export interface NotAttendedIssueMutationVariables {
  id: string | undefined;
  dtEnd: string;
  description?: string;
}
export interface NotAttendedIssueMutationResponse {
  updateIssue: {
    data: {
      attributes: {
        dtEnd: string;
      };
    };
  };
}
export const notAttendedIssueMutation = gql`
  mutation EndIssue($id: ID!, $description: String!, $dtEnd: DateTime!) {
    updateIssue(
      id: $id
      data: {
        dtEnd: $dtEnd
        status: not_attended
        evidenceDescription: $description
      }
    ) {
      data {
        id
        attributes {
          dtEnd
        }
      }
    }
  }
`;
