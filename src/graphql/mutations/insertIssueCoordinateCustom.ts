import { gql } from "@apollo/client";
import { Float } from "react-native/Libraries/Types/CodegenTypes";

export interface IssueCoordinate {
  issue: string;
  latitude: Float;
  longitude: Float;
  publishedAt: string;
}

export interface InsertIssueInputCustomVariables {
  input: IssueCoordinate[];
}
export interface InsertIssueInputCustomResponse {
  data: {
    id: string;
    attributes: {
      issue: {
        data: {
          id: string;
        };
      };
    };
  };
}

export const InsertIssueInputCustomQuery = gql`
  mutation InsertIssueInputCustom(
    $input: [InsertIssueCoordinateInputCustom!]!
  ) {
    insertIssueCoordinateCustom(data: $input) {
      insertedCount
    }
  }
`;
