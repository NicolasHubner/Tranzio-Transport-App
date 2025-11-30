import { gql } from "@apollo/client";
import {
  MaterialRequestPriority,
  MaterialRequestStatus,
} from "~/types/MaterialRequest";

export interface MaterialRequestStatusQueryResponse {
  materialRequests: {
    data: Array<{
      id: string;
      attributes: {
        status: MaterialRequestStatus;
        approver: string;
        priority: MaterialRequestPriority;
        createdAt: string;
        requestCode: string;
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

export interface MaterialRequestStatusQueryVariables {
  page: number;
  pageSize: number;
  search?: string;
  status?: MaterialRequestStatus;
}

export const materialStatusQuery = gql`
  query GetMaterialRequestsPending(
    $page: Int!
    $pageSize: Int!
    $status: String
    $search: String
  ) {
    materialRequests(
      sort: "createdAt:desc"
      pagination: { page: $page, pageSize: $pageSize }
      filters: {
        status: { eq: $status }
        requestCode: { containsi: $search }
        material_request_items: { products: { id: { notNull: true } } }
      }
    ) {
      data {
        id
        attributes {
          requestCode
          status
          approver
          priority
          createdAt
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
        }
      }
    }
  }
`;
