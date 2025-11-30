import { gql } from "@apollo/client";

export interface MaterialRequestItemByInternalCodeQtdVariables {
  internalCode: string;
}

export interface MaterialRequestItemByInternalCodeQtdQueryResponse {
  materialRequestItems: {
    data: Array<{
      id: string;
      attributes: {
        qtty: number;
      };
    }>;
  };
}

export const MaterialRequestItemByInternalCodeQtdQuery = gql`
  query GetAllMaterialRequestItems($internalCode: String!) {
    materialRequestItems(
      filters: { products: { internalCode: { eq: $internalCode } } }
    ) {
      data {
        id
        attributes {
          qtty
        }
      }
    }
  }
`;
