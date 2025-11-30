import { gql } from "@apollo/client";

export interface TodayFlightsQueryResponse {
  flights: {
    data: Array<{
      id: string;
      attributes: {
        flightNumber: number;
      };
    }>;
  };
}

export interface TodayFlightsQueryVariables {
  date: string;
}

export const todayFlightsQuery = gql`
  query GetAllTodayFlights($date: Date!) {
    flights(pagination: { limit: -1 }, filters: { flightDate: { eq: $date } }) {
      data {
        id
        attributes {
          flightNumber
        }
      }
    }
  }
`;
