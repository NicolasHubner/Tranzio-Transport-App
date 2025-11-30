import { QueryHookOptions, useQuery } from "@apollo/client";
import {
  FlightWarningsQueryResponse,
  flightWarningsQuery,
} from "~/graphql/queries/flight-warnings";

export function useFlightWarnings(
  options?: QueryHookOptions<FlightWarningsQueryResponse>,
) {
  return useQuery<FlightWarningsQueryResponse>(flightWarningsQuery, options);
}
