import { gql } from "@apollo/client";

export interface CreateAttendanceServiceDayMutationResponse {
  createAttendanceServiceDay: {
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

export interface CreateAttendanceServiceDayMutationVariables {
  input: {
    userLeader: string;
    departments: string[];
    qtdUsers: number;
    publishedAt: string;
    dtStart: string;
    flights: string[];
  };
}

export const createAttendanceServiceDayMutation = gql`
  mutation CreateAttendanceServiceDay($input: AttendanceServiceDayInput!) {
    createAttendanceServiceDay(data: $input) {
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

export const getAttenceServiceDayByUserId = gql`
  query attendanceServiceDays($userId: ID!) {
    attendanceServiceDays(filters: { userLeader: { id: { eq: $userId } } }) {
      data {
        id
        attributes {
          flights {
            data {
              id
            }
          }
        }
      }
    }
  }
`;
