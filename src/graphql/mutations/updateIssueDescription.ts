import { gql } from "@apollo/client";

export interface UpdateIssueDescriptionMutationVariables {
  id: string;
  evidenceDescription?: string;
  status?: string;
  dtEnd?: string;
}
export interface UpdateIssueDescriptionMutationResponse {
  updateIssue: {
    data: {
      id: string;
      attributes: {
        dtEnd: string;
      };
    };
  };
}

export const updateIssueDescriptionMutation = gql`
  mutation updateIssueDescription(
    $id: ID!
    $evidenceDescription: String!
    $dtEnd: DateTime!
  ) {
    updateIssue(
      id: $id
      data: { evidenceDescription: $evidenceDescription, dtEnd: $dtEnd }
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
