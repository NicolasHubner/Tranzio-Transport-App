import { QueryHookOptions, useQuery } from "@apollo/client";
import {
  FlightsListQueryResponse,
  FlightsListQueryVariables,
  flightsListQuery,
} from "~/graphql/queries/flights-list";

export function useFlightsListQuery(
  options?: QueryHookOptions<
    FlightsListQueryResponse,
    FlightsListQueryVariables
  >,
) {
  return useQuery<FlightsListQueryResponse, FlightsListQueryVariables>(
    flightsListQuery,
    options,
  );
}
