import { useQuery } from "@apollo/client";
import {
  FlightsQueryResponse,
  FlightsQueryVariables,
  flightsQuery,
} from "~/graphql/queries/flights";

export function useFlightsQuery(
  query: number
) {
  return useQuery<FlightsQueryResponse, FlightsQueryVariables>(
    flightsQuery, { variables: { query } }
  );
}
