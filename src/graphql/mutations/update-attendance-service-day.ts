import { gql } from "@apollo/client";

export interface UpdateAttendanceServiceDayMutationResponse {
  updateAttendanceServiceDay: {
    data: {
      id: string;
      attributes: {
        createdAt: string;
        dtEnd: string;
        qtdUsers: number;
      };
    };
  };
}

export interface UpdateAttendanceServiceDayMutationVariables {
  id: string;
  qtdUsers: number;
}

export const updateAttendanceServiceDayMutation = gql`
  mutation UpdateAttendanceServiceDay($id: ID!, $qtdUsers: Int!) {
    updateAttendanceServiceDay(id: $id, data: { qtdUsers: $qtdUsers }) {
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
`;
