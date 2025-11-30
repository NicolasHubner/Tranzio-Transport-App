import { gql } from "@apollo/client";

export interface UpdateIssueCordinatesResponse {
  updateIssueCoordinate: {
    data: {
      id: string;
    };
  };
}

export interface UpdateIssueCordinatesVariables {
  input: {
    issue: string;
    latitude: number;
    longitude: number;
    publishedAt: string;
  };
}

export const UpdateIssueCordinatesMutation = gql`
  mutation CreateIssueCordinates($input: IssueCoordinateInput!) {
    createIssueCoordinate(data: $input) {
      data {
        id
      }
    }
  }
`;
