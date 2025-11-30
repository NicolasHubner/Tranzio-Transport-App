import { gql } from "@apollo/client";
import { Product } from "~/types/Product";
import type { User } from "~/types/User";

export interface ProductsData {
  id: User["id"];
  attributes: Product;
}

export interface ProductsQueryResponse {
  products: {
    data: ProductsData[];
  };
}

export const ProductsQuery = gql`
  query GetAllProducts($search: String) {
    products(
      pagination: { limit: 20 }
      filters: {
        or: [
          { productDescription: { contains: $search } }
          { internalCode: { contains: $search } }
        ]
      }
    ) {
      data {
        id
        attributes {
          idProd
          internalCode
          barcode
          productDescription
          complement
          productBrand
          productModel
          measurementUnitySymbol
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
`;
