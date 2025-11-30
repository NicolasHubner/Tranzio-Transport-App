import { gql } from "@apollo/client";

export interface FlightsNumbersQueryResponse {
  flights: {
    data: Array<{
      id: string;
      attributes: {
        flightNumber: number;
      };
    }>;
  };
}

export interface FlightsNumbersQueryVariables {
  flightNumber: number;
}

export const flightsNumbersQuerys = gql`
  query GetAllFlightsNumbers {
    flights(pagination: { limit: -1 }) {
      data {
        id
        attributes {
          flightNumber
        }
      }
    }
  }
`;
