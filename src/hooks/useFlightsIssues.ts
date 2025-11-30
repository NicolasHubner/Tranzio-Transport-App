import { useQuery } from "@apollo/client";
import { FlightsIssuesQueryResponse, FlightsIssuesQueryVariables, issuesFlightsQuery } from "~/graphql/queries/flightsIssues";

export function useFlightsIssuesQuery(
  id:string
) {
  return useQuery<FlightsIssuesQueryResponse, FlightsIssuesQueryVariables>(
    issuesFlightsQuery,{
      variables:{
        workerId:
        {
          id: 
          {
          eq:id
        }
      }
    }
  })
}
