import { gql } from "@apollo/client";
import { MaterialRequestStatus } from "~/types/MaterialRequest";

export interface MaterialRequestMessageVariables {
  id: {
    eq: string;
  };
  status: string;
}

export interface MaterialRequestMessageResponse {
  materialRequests: {
    data: Array<{
      id: string;
      attributes: {
        user: {
          data: {
            id: string
          }
        }
        requestCode: string;
        status: MaterialRequestStatus;
      };
    }>;
  };
}

export const MaterialRequestMessageQuery = gql`
query GetMaterialRequests($id: IDFilterInput!, $status: String!) {
  materialRequests(
    pagination: { limit: -1 }
    filters: { user: { id: $id }, status: { eq: $status } }) {
    data {
      id
      attributes {
        user {
          data {
            id
          }
        }
        requestCode
        status
      }
    }
  }
}
`;
