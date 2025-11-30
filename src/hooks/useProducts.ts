import { QueryHookOptions, useQuery } from "@apollo/client";
import {
  ProductsQuery,
  ProductsQueryResponse,
} from "~/graphql/queries/products";

export function useProducts(options?: QueryHookOptions<ProductsQueryResponse>) {
  return useQuery<ProductsQueryResponse>(ProductsQuery, options);
}
