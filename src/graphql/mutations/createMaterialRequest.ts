import { gql } from "@apollo/client";

export interface CreateMaterialRequestResponse {
  createMaterialRequest: {
    data: {
      id: string;
      attributes: {
        requestCode: string;
      }
    };
  };
}

export interface CreateMaterialRequestVariables {
  input: {
    publishedAt: string;
    requestCode: string;
    status: string;
    priority: string;
    approver: string;
    department_id: number | string;
    user: string | string;
  };
}

export const CreateMaterialRequestMutation = gql`
mutation CreateMaterialRequest($input: MaterialRequestInput!) {
    createMaterialRequest(data: $input) {
    data {
      id
      attributes {
        requestCode
      }
    }
  }
}
`;
