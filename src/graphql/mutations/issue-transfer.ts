import { gql } from "@apollo/client";

export interface IssueTransferVariables {
  idIssue: string;
  status: string;
  user: string[];
}
export interface IssueTransferResponse {
  updateIssue: {
    data: {
      id: string;
    };
  };
}

export const issueTransferMutation = gql`
  mutation IssueTransfer(
    $idIssue: ID!
    $status: ENUM_ISSUE_STATUS
    $user: [ID]
  ) {
    updateIssue(id: $idIssue, data: { status: $status, users: $user }) {
      data {
        id
      }
    }
  }
`;
