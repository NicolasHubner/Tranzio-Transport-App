import { gql } from "@apollo/client";

export interface UpdateMaterialRequestPriorityResponse {
  updateMaterialRequest: {
    data: {
      id: string;
    }
  }
}

export interface UpdateMaterialRequestPriorityVariables {
  id: string;
  priority: string;
}

export const UpdateMaterialRequestPriorityMutation = gql`
mutation UpdateStatusItem($id:ID!,$priority:ENUM_MATERIALREQUEST_PRIORITY!){
  updateMaterialRequest(id: $id,data:{priority:$priority }){
    data{
      id
    }
  }
}
`;
