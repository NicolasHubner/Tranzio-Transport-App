import { gql } from "@apollo/client";

export interface UserDepartmentQueryResponse {
  usersPermissionsUser: {
    data: {
      attributes: {
        department: {
          data: {
            id: string;
            attributes: {
              name: string;
            };
          } | null;
        };
      };
    };
  };
}

export interface UserDepartmentQueryVariables {
  id: string;
}

export const userDepartmentQuery = gql`
  query GetUserDepartment($id: ID!) {
    usersPermissionsUser(id: $id) {
      data {
        attributes {
          department {
            data {
              id
              attributes {
                name
              }
            }
          }
        }
      }
    }
  }
`;
