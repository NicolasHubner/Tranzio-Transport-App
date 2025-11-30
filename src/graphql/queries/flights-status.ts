import { gql } from "@apollo/client";

export interface FlightStatusQueryResponse {
  flight: {
    data: {
      id: string;
      attributes: {
        prefix: string;
        ETA: string | null;
        ETD: string | null;
        flightOrigin: string;
        flightDestiny: string;
        flightNumber: number;
        isInternational: boolean | null;
        flightDate: string;
        STA: string;
        STD: string;
        actionType: "Arrival" | "Departure";
        BOX: string;
      };
    };
  };
}

export interface FlightStatusQueryVariables {
  id: string;
}

export const flightStatusQuery = gql`
  query GetFlightStatus($id: ID!) {
    flight(id: $id) {
      data {
        id
        attributes {
          prefix
          ETA
          ETD
          actionType
          isInternational
          flightNumber
          flightDate
          flightOrigin
          flightDestiny
          STA
          STD
          BOX
        }
      }
    }
  }
`;
