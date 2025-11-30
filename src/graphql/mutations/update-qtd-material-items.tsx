import { gql } from "@apollo/client";

export interface UpdateMaterialRequestQtdResponse {
  updateMaterialRequestItem: {
    data: {
      id: string;
    };
  };
}

export interface UpdateMaterialRequestQtdVariables {
  id: string;
  qtd: number;
}

export const UpdateMaterialRequestQtdMutation = gql`
mutation UpdateMaterialRequest($id: ID!, $qtd: Int!) {
  updateMaterialRequestItem(id: $id, data: { qtty: $qtd }) {
    data {
      id
    }
  }
}
`;
