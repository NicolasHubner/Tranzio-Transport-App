import { gql } from "@apollo/client";

export interface ProductByIdProdResponse {
  productCustom: {
    quantityInStock: number;
  };
}

export interface ProductByIdProdVariables {
  idProd: string;
}

export const productByIdProdQuery = gql`
  query ProductCustom($idProd: String!) {
    productCustom(idProd: $idProd) {
      quantityInStock
    }
  }
`;
