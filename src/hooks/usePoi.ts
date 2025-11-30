import { useQuery } from "@apollo/client";
import { PoisQueryResponse, PoisQueryVariable, poisQuery } from "~/graphql/queries/pois";

export function usePoisQuery(query: string) {

  return useQuery<PoisQueryResponse, PoisQueryVariable>(poisQuery, { variables: { query: query } });
}
