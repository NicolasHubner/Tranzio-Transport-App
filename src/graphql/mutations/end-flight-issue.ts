import { gql } from "@apollo/client";

export interface EndFlightIssueMutationResponse {
  issues: {
    data: {
      id: string;
    };
  };
}

export interface EndFlightIssueMutationVariables {
  id: string;
}

export const endFlightIssueMutation = gql`
  mutation endFlightIssue($id: ID!) {
    updateFlight(id: $id, data: { workers: [] }) {
      data {
        id
      }
    }
  }
`;
