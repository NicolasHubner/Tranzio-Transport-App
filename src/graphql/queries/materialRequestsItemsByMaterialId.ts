import { gql } from "@apollo/client";

export type MaterialRequestItemStatus =
  | "accepted"
  | "rejected"
  | "pending"
  | "processed";

export interface MaterialRequestItemsByMaterialIdQueryResponse {
  materialRequestItems: {
    data: Array<{
      id: string;
      attributes: {
        status: MaterialRequestItemStatus;
        qtty: string;
        ptmOTK: string;
        osOTK: string;
        products: {
          data: Array<{
            id: string;
            attributes: {
              internalCode: string;
              barcode: string;
              productDescription: string;
              complement: string;
              productBrand: string | null;
              productModel: string | null;
              measurementUnitySymbol: string;
              weight: string;
              defaultSaleValue: string;
              measurementUnityCode: number;
              minimumStock: number;
              maxStock: number;
              quantityInStock: number;
              usernameLastUpdate: string;
              lastUpdateDate: string;
              sectionCode: string | null;
              sectionDescription: string | null;
            };
          }>;
        };
      };
    }>;
  };
}

export interface MaterialRequestItemsByMaterialIdQueryVariables {
  materialRequestId: string;
}

export const materialRequestItemsByMaterialIdQuery = gql`
  query GetMaterialRequestItemsByMaterialId($materialRequestId: ID!) {
    materialRequestItems(
      filters: { material_request: { id: { eq: $materialRequestId } } }
    ) {
      data {
        id
        attributes {
          status
          qtty
          ptmOTK
          osOTK
          products {
            data {
              id
              attributes {
                internalCode
                barcode
                productDescription
                complement
                productBrand
                productModel
                measurementUnitySymbol
                weight
                defaultSaleValue
                measurementUnityCode
                minimumStock
                maxStock
                quantityInStock
                usernameLastUpdate
                lastUpdateDate
                sectionCode
                sectionDescription
              }
            }
          }
        }
      }
    }
  }
`;
