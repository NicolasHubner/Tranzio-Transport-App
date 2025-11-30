import { QueryHookOptions, useQuery } from "@apollo/client";
import {
  ProductByIdProdResponse,
  ProductByIdProdVariables,
  productByIdProdQuery,
} from "~/graphql/queries/product-by-id-prod";

export function useProductByIdProdQuery(
  options?: QueryHookOptions<ProductByIdProdResponse, ProductByIdProdVariables>,
) {
  return useQuery<ProductByIdProdResponse, ProductByIdProdVariables>(
    productByIdProdQuery,
    options,
  );
}
