import { gql } from "@apollo/client";

export interface CreateIssueMutationVariables {
  input: {
    area: string;
    flight: string;
    flightDate: string;
    description?: string;
    passengerName: string;
    destiny: string;
    origin: string;
    status: string;
    users: string;
    dtStart?: string;
    shift: string;
    workerCoordinatesWhenRequested: string;
    publishedAt: string;
    serviceType: string;
    route: string;
    issueOrigin: string;
    issueDestiny: string;
  };
}
export interface CreateIssueMutationResponse {
  createIssue: {
    data: {
      id: string;
    };
  };
}
export const crateIssueMutation = gql`
  mutation CreateIssue($input: IssueInput!) {
    createIssue(data: $input) {
      data {
        id
      }
    }
  }
`;
