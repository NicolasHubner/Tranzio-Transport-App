import { useQuery } from "@apollo/client";
import { WorkersQueryResponse, WorkersQueryVariables, workersQuery } from "~/graphql/queries/workers";

export function useWorkers(
  roleType: string, workerName: string) {
  return useQuery<WorkersQueryResponse, WorkersQueryVariables>(
    workersQuery, { variables: { roleType, workerName } });
}
