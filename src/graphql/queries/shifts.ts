import { gql } from "@apollo/client";

export interface IssuePassengerQueryResponse {
  shifts: {
    data: Array<{
      id: string;
      attributes: {
        name: string;
        serviceType: string;
      };
    }>;
  };
}

export const IssuePassengerQuery = gql`
  query GetAllShifts {
    shifts {
      data {
        id
      }
    }
  }
`;
