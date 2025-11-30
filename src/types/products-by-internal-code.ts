import { gql } from "@apollo/client";

export interface ProductsByInternalCodeVariables {
  internalCodes: string[];
}

export interface ProductsByInternalCodeQueryResponse {
  products: {
    data: Array<{
      id: string;
      attributes: {
        internalCode: string;
      };
    }>;
  };
}

export const ProductsByInternalCodeQuery = gql`
  query GetProduct($internalCodes: [String!]!) {
    products(filters: { internalCode: { in: $internalCodes } }) {
      data {
        id
        attributes {
          internalCode
        }
      }
    }
  }
`;
