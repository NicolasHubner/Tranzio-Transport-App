import { gql } from "@apollo/client";

export interface IssuePassengerQueryResponse {
  issuePassengers: {
    data: Array<{
      id: string;
      attributes: {
        name: string;
        serviceType: string;
      }
    }>
  }
}


export const IssuePassengerQuery = gql`
query GetAllIssuePassenger{
  issuePassengers{
    data{
      id
      attributes{
        name
        serviceType
      }
    }
  }
}
`;
