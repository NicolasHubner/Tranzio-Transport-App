import { QueryHookOptions, useQuery } from "@apollo/client";
import {
  FlightsSearchQueryResponse,
  FlightsSearchQueryVariables,
  flightsSearchQuery,
} from "~/graphql/queries/flights-search";

export function useFlightsSearchQuery(
  options?: QueryHookOptions<
    FlightsSearchQueryResponse,
    FlightsSearchQueryVariables
  >,
) {
  return useQuery<FlightsSearchQueryResponse, FlightsSearchQueryVariables>(
    flightsSearchQuery,
    options,
  );
}
