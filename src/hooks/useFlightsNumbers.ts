import { QueryHookOptions, useQuery } from "@apollo/client";
import {
  FlightsNumbersQueryResponse,
  FlightsNumbersQueryVariables,
  flightsNumbersQuerys,
} from "~/graphql/queries/flightsNumbers";

export function useFlightsNumbers(
  options?: QueryHookOptions<
    FlightsNumbersQueryResponse,
    FlightsNumbersQueryVariables
  >,
) {
  return useQuery<FlightsNumbersQueryResponse, FlightsNumbersQueryVariables>(
    flightsNumbersQuerys,
    options,
  );
}
