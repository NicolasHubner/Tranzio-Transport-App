import { gql } from "@apollo/client";

export interface PassagersQueryResponse {

  data: {
    attributes: {
      name: string;
    }
  }
}


export interface PassagersQueryVariables {
  issuePassenger: {
    id: { eq: string; }
  }
}

export const passagersQuery = gql`
query IssuesPassenger($issuePassenger: IssuePassengerFiltersInput) {
  issuePassengers(pagination: { limit: -1 }, filters: $issuePassenger) {
    data {
      attributes {
        name
      }
    }
  }
}

`;
