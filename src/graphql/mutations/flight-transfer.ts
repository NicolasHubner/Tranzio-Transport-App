import { gql } from "@apollo/client";

export interface FlightTransferVariables {
  idWorker: string[];
  id: string;
}
export interface FlightTransferResponse {
  updateFlight: {
    data: {
      id: string;
    }
  }
}

export const flightTransferMutation = gql`
mutation FlightTransfer($id: ID!,
  $idWorker: [ID]) {
  updateFlight(id: $id,
    data: { workers: $idWorker}) {
    data {
      id
    }
  }
}
`;
