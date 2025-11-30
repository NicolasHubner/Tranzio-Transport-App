import { gql } from "@apollo/client";
import { MaterialRequestStatus } from "~/types/MaterialRequest";

export interface CreateMaterialRequestItemResponse {
  createMaterialRequestItem: {
    data: {
      id: string;
    };
  };
}

export interface CreateMaterialRequestItemVariables {
  input: {
    publishedAt: string;
    material_request: string | undefined;
    products: string | string[];
    ptmOTK?: string;
    osOTK?: string;
    qtty: number;
    status: MaterialRequestStatus;
    // codWarehouse: number;
    // codSection: string;
    // codLocal: string;
  };
}

export const CreateMaterialRequestItemMutation = gql`
  mutation CreateMaterialRequestItem($input: MaterialRequestItemInput!) {
    createMaterialRequestItem(data: $input) {
      data {
        id
      }
    }
  }
`;
