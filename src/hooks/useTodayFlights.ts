import { useQuery } from "@apollo/client";
import dayjs from "dayjs";
import {
  TodayFlightsQueryResponse,
  TodayFlightsQueryVariables,
  todayFlightsQuery,
} from "~/graphql/queries/todayFlights";

export function useTodayFlightsQuery() {
  return useQuery<TodayFlightsQueryResponse, TodayFlightsQueryVariables>(
    todayFlightsQuery,
    {
      variables: {
        date: dayjs().format("YYYY-MM-DD"),
      },
    },
  );
}
