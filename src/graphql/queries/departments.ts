import { gql } from "@apollo/client";
import { Department } from "~/types/Department";
import type { User } from "~/types/User";

export interface DepartmentsData {
  id: User["id"];
  attributes: Department;
}

export interface DepartmentsQueryResponse {
  departments: {
    data: DepartmentsData[];
  };
}

export const DepartmentsQuery = gql`
  query GetAllDepartment {
    departments(pagination: { limit: -1 }) {
      data {
        id
        attributes {
          name
          code
          company {
            data {
              id
              attributes {
                name
                Cnpj
              }
            }
          }
        }
      }
    }
  }
`;
