import { gql } from "@apollo/client";

export interface WorkersQueryResponse {
  usersPermissionsUsers: {
    data: Array<{
      id: string;
      attributes: {
        name: string;
      }
    }>;
  };
}

export interface WorkersQueryVariables {
  roleType: string;
  workerName: string;
}

export const workersQuery = gql`
query Workers($roleType: String!, 
  $workerName: String) {
  usersPermissionsUsers(
    pagination: { limit: -1 }
    filters: {
      role: { type: { eq: $roleType } }
      name: { containsi: $workerName }
      coordinates: { id: { notNull: true } }
    }
  ) {
    data {
      id
      attributes{
        name
      }
    }
  }
}

`;
