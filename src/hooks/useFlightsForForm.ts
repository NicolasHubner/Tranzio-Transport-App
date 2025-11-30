import { QueryHookOptions, useQuery } from "@apollo/client";
import { FlightsQueryResponseUnfiltered } from "~/graphql/queries/flight";
import {
  FlightsQueryVariables,
  flightsQueryUnfiltered,
} from "~/graphql/queries/flights";

export function useFlightsForForm(
  options?: QueryHookOptions<
    FlightsQueryResponseUnfiltered,
    FlightsQueryVariables
  >,
) {
  return useQuery<FlightsQueryResponseUnfiltered, FlightsQueryVariables>(
    flightsQueryUnfiltered,
    options,
  );
}
