import { gql } from "@apollo/client";

interface UserDepartment {
  data: {
    id: string;
    attributes: {
      name: string;
    };
  };
}

export interface MeQueryResponse {
  me: {
    id: string;
    name: string;
    username: string;
    email: string;
    isShiftOpen: boolean;
    isFirstLogin: boolean;
    department: UserDepartment;
    role: {
      name: string;
    };
    coordinates: {
      data: {
        id: string;
      } | null;
    };
  };
}

export const meQuery = gql`
  query Me {
    me {
      id
      name
      username
      isShiftOpen
      isFirstLogin
      email
      department {
        data {
          id
          attributes {
            name
          }
        }
      }
      role {
        name
      }
      coordinates {
        data {
          id
        }
      }
    }
  }
`;
