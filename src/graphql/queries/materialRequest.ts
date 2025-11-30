import { gql } from "@apollo/client";
import {
  MaterialRequestPriority,
  MaterialRequestStatus,
} from "~/types/MaterialRequest";

export interface MaterialRequestByIdVariables {
  id: {
    eq: string;
  };
}

export interface MaterialRequestByIdQueryResponse {
  materialRequests: {
    data: Array<{
      id: string;
      attributes: {
        user: {
          data: {
            id: string;
          };
        };
        department_id: {
          data: {
            id: string;
            attributes: {
              name: string;
              code: string;
              company: {
                data: {
                  id: string;
                  attributes: {
                    Name: string;
                  };
                };
              };
            };
          };
        };
        status: MaterialRequestStatus;
        approver: string;
        priority: MaterialRequestPriority;
        createdAt: string;
        requestCode: string;
        material_request_items: {
          data: Array<{
            id: string;
            attributes: {
              status: string;
              qtty: string;
              ptmOTK: string;
              osOTK: string;
              codSection: string;
              codLocal: string;
              codWarehouse: number;
              products: {
                data: Array<{
                  id: string;
                  attributes: {
                    internalCode: string;
                    barcode: string;
                    productDescription: string;
                    complement: string;
                    productBrand: string;
                    productModel: string;
                    measurementUnitySymbol: string;
                    weight: string;
                    defaultSaleValue: string;
                    measurementUnityCode: number;
                    minimumStock: number;
                    maxStock: number;
                    quantityInStock: number;
                    usernameLastUpdate: string;
                    lastUpdateDate: string;
                  };
                }>;
              };
            };
          }>;
        };
      };
    }>;
  };
}

export const MaterialRequestByIdQuery = gql`
  query GetMaterialRequests($id: IDFilterInput!) {
    materialRequests(
      pagination: { limit: -1 }
      filters: {
        user: { id: $id }
        material_request_items: { products: { id: { notNull: true } } }
      }
    ) {
      data {
        id
        attributes {
          user {
            data {
              id
            }
          }
          department_id {
            data {
              id
              attributes {
                name
                code
                company {
                  data {
                    id
                    attributes {
                      name
                    }
                  }
                }
              }
            }
          }
          material_request_items {
            data {
              id
              attributes {
                status
                qtty
                ptmOTK
                osOTK
                codSection
                codLocal
                codWarehouse
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
                    }
                  }
                }
              }
            }
          }
          requestCode
          status
          approver
          priority
          createdAt
        }
      }
    }
  }
`;
