import { QueryHookOptions, useQuery } from "@apollo/client";
import {
  FlightStatusQueryResponse,
  FlightStatusQueryVariables,
  flightStatusQuery,
} from "~/graphql/queries/flights-status";

export function useFlightStatusQuery(
  options?: QueryHookOptions<
    FlightStatusQueryResponse,
    FlightStatusQueryVariables
  >,
) {
  return useQuery<FlightStatusQueryResponse, FlightStatusQueryVariables>(
    flightStatusQuery,
    options,
  );
}
