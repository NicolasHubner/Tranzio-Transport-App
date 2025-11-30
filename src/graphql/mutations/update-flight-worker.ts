import { gql } from "@apollo/client";

export interface UpdateFlightResponse {
  updateFlight: {
    data: {
      id: string;
      attributes: {
        flightOrigin: string;
        flightDestiny: string;
      }
    }
  }
}

export interface UpdateFlightVariables {
  id: string;
  input: {
    workers: string;
  }
}

export const updateFlightMutation = gql`
mutation updateFlight($id: ID!, $input: FlightInput!) {
  updateFlight(id: $id, data: $input) {
    data {
      id
      attributes{
        flightOrigin
        flightDestiny
      }
    }
  }
}
`;
