import { useQuery } from "@apollo/client";
import {
  FlightQueryResponse,
  FlightQueryVariables,
  flightQuery,
} from "~/graphql/queries/flight";

export function useFlightQuery(flightId: string) {
  return useQuery<FlightQueryResponse, FlightQueryVariables>(flightQuery, {
    variables: { flightId: flightId },
  });
}
