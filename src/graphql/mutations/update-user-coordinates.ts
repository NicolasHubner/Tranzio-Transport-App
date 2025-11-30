import { gql } from "@apollo/client";
import type { Coordinates } from "../../types/Coordinates";

export interface UpdateUserCoordinatesMutationResponse {
  updateUserCoordinate: {
    data: {
      id: string;
    };
  };
}

export interface UpdateUserCoordinatesMutationVariables {
  id: string;
  data: Coordinates;
}

export const updateUserCoordinatesMutation = gql`
  mutation UpdateUserCoordinates($id: ID!, $data: UserCoordinateInput!) {
    updateUserCoordinate(id: $id, data: $data) {
      data {
        id
      }
    }
  }
`;
