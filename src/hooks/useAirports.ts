import { QueryHookOptions, useQuery } from "@apollo/client";
import {
  AirportQuery,
  AirportsQueryResponse,
} from "~/graphql/queries/airports";

export function useAirports(options?: QueryHookOptions<AirportsQueryResponse>) {
  return useQuery<AirportsQueryResponse>(AirportQuery, options);
}
