import { gql } from "@apollo/client";
import { MaterialRequestItemStatus } from "../queries/materialRequestsItemsByMaterialId";

export interface UpdateMaterialRequestItemResponse {
  updateMaterialRequestItem: {
    data: {
      id: string;
    };
  };
}

export interface UpdateMaterialRequestItemVariables {
  id: string;
  status: MaterialRequestItemStatus;
}

export const UpdateMaterialRequestItemMutation = gql`
  mutation UpdateStatusItem(
    $id: ID!
    $status: ENUM_MATERIALREQUESTITEM_STATUS!
  ) {
    updateMaterialRequestItem(id: $id, data: { status: $status }) {
      data {
        id
      }
    }
  }
`;
