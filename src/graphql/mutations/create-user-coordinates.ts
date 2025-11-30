import { gql } from "@apollo/client";
import type { Coordinates } from "../../types/Coordinates";

export interface CreateUserCoordinatesMutationResponse {
  createUserCoordinate: {
    data: {
      id: string;
    };
  };
}

export interface CreateUserCoordinatesMutationVariables {
  data: Coordinates & {
    user: string;
    publishedAt: string;
  };
}

export const createUserCoordinatesMutation = gql`
  mutation CreateUserCoordinates($data: UserCoordinateInput!) {
    createUserCoordinate(data: $data) {
      data {
        id
      }
    }
  }
`;
