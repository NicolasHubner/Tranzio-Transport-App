import { gql } from "@apollo/client";

export interface UserByIdQueryResponse {
  usersPermissionsUser: {
    data: {
      id: string;
      attributes: {
        name: string;
        attendanceServiceDay: {
          data: {
            id: string;
            attributes: {
              createdAt: string;
              dtEnd: string;
              qtdUsers: number,
            };
          } | null;
        };
      };
    };
  };
}

export interface UserByIdQueryVariables {
  id?: string;
}

export const userByIdQuery = gql`
  query GetUserById($id: ID!) {
    usersPermissionsUser(id: $id) {
      data {
        id
        attributes {
          name
          attendanceServiceDay {
            data {
              id
              attributes {
                createdAt
                dtEnd
                qtdUsers
              }
            }
          }
        }
      }
    }
  }
`;
