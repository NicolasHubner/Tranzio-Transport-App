import { gql } from "@apollo/client";
import { Float } from "react-native/Libraries/Types/CodegenTypes";

export interface CreateIssueCoordinateVariables {
  input: {
    issue: string;
    latitude: Float;
    longitude: Float;
    publishedAt: string;
  };
}

export interface CreateIssueCoordinateResponse {
  data: {
    id: string;
    attributes: {
      issue: {
        data: {
          id: string;
        }
      }
    }
  }
}


export const CreateIssueCoordinateMutation = gql`
mutation CreateIssueCoordinate($input: IssueCoordinateInput!) {
  createIssueCoordinate(data: $input) {
    data {
      id
      attributes {
        issue {
          data {
            id
          }
        }
      }
    }
  }
}

`;
