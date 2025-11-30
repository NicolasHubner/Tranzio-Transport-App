import { QueryHookOptions, useQuery } from "@apollo/client";
import {
  DepartmentsQuery,
  DepartmentsQueryResponse,
} from "~/graphql/queries/departments";

export function useDepartments(
  options?: QueryHookOptions<DepartmentsQueryResponse>,
) {
  return useQuery<DepartmentsQueryResponse>(DepartmentsQuery, options);
}
