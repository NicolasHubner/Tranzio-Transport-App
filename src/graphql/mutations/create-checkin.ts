import { gql } from "@apollo/client";

export interface CreateCheckinMutationVariables {
  dtStart: string;
  issueId: string;
  vehicleId: string;
  publishedAt: string;
}

export const createCheckinMutation = gql`
  mutation CreateCheckin(
    $issueId: ID!
    $vehicleId: ID!
    $dtStart: DateTime!
    $publishedAt: DateTime!
  ) {
    createCheckin(
      data: {
        issue: $issueId
        vehicle: $vehicleId
        dtStart: $dtStart
        publishedAt: $publishedAt
      }
    ) {
      data {
        id
      }
    }
  }
`;
