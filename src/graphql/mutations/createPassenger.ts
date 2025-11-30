import { gql } from "@apollo/client";

export interface CreatePassengerResponse {
  createIssuePassenger: {
    data: {
      id: string;
    };
  };
}

export interface CreatePassengerVariables {
  name: string;
  serviceType: string;
  publishedAt: string;
}

export const CreatePassengerMutation = gql`
mutation CreatePassenger(
  $name: String!
  $serviceType: ENUM_ISSUEPASSENGER_SERVICETYPE!
  $publishedAt: DateTime!
) {
  createIssuePassenger(
    data: { publishedAt: $publishedAt, name: $name, serviceType: $serviceType }
  ) {
    data {
      id
    }
  }
}
`;