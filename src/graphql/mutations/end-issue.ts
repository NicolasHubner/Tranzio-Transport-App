import { gql } from "@apollo/client";

export interface EndIssueMutationVariables {
  id: string;
  dtEnd?: string;
}

export const endIssueMutation = gql`
  mutation EndIssue($id: ID!, $dtEnd: DateTime!) {
    updateIssue(id: $id, data: { dtEnd: $dtEnd, status: attended }) {
      data {
        id
        attributes {
          dtEnd
        }
      }
    }
  }
`;
