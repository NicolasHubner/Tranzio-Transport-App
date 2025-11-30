import { gql } from "@apollo/client";

export interface FlightsQueryResponse {
  flights: {
    data: Array<{
      id: string;
      attributes: {
        flightNumber: number;
        ETD: string;
        STA: string;
        actionType: string;
      };
    }>;
  };
}

export interface FlightsQueryVariables {
  query?: number;
  flightDate?: string;
}

export const flightsQuery = gql`
  query GetAllFlight($query: Long) {
    flights(
      pagination: { limit: -1 }
      filters: { flightNumber: { containsi: $query } }
    ) {
      data {
        id
        attributes {
          flightNumber
          ETD
          STA
          actionType
        }
      }
    }
  }
`;

export const flightsQueryUnfiltered = gql`
  query Flights($flightDate: Date) {
    flights(
      pagination: { limit: -1 }
      sort: ["flightDate:desc", "updatedAt:desc"]
      filters: {
        issues: {
          flight: { id: { notNull: true }, flightDate: { eq: $flightDate } }
        }
      }
    ) {
      data {
        id
        attributes {
          flightNumber
          actionType
          flightDate
          gate
          route
          flightOrigin
          flightDestiny
          STA
        }
      }
    }
  }
`;
