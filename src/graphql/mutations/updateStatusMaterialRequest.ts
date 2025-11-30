import { gql } from "@apollo/client";

export interface UpdateMaterialRequestResponse {
  createMaterialRequestItem: {
    data: {
      id: string;
      attributes: {
        status: string;
      }
    };
  };
}

export interface UpdateMaterialRequestVariables {
  id: string;
  status: string;
}

export const UpdateMaterialRequestMutation = gql`
mutation UpdateMaterialStatus($id: ID!, $status: ENUM_MATERIALREQUEST_STATUS!) {
  updateMaterialRequest(id: $id, data: { status: $status }) {
    data {
      id
      attributes {
        status
      }
    }
  }
}
`;
