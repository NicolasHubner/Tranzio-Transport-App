import { gql } from "@apollo/client";

export interface CloseAttendanceServiceDayMutationResponse {
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

export interface CloseAttendanceServiceDayMutationVariables {
  dtEnd: string;
  id: string;
}

export const closeAttendanceServiceDayMutation = gql`
  mutation CloseAttendanceServiceDay($id: ID!, $dtEnd: DateTime!) {
    updateAttendanceServiceDay(id: $id, data: { dtEnd: $dtEnd }) {
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
