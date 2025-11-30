import { gql } from "@apollo/client";

export interface AirportsQueryResponse {
  airports: {
    data: Array<{
      id: string;
      attributes: {
        IATA: string;
      };
    }>;
  };
}

export const AirportQuery = gql`
  query airports {
    airports {
      data {
        id
        attributes {
          IATA
        }
      }
    }
  }
`;
