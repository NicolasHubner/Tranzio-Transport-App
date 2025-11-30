import { gql } from "@apollo/client";

export interface AttendanceLivesHistoryQueryResponse {
  attendanceLives: {
    data: Array<{
      id: string;
      attributes: {
        code: string;
        flight: {
          data: {
            attributes: {
              flightOrigin: string;
              flightDestiny: string;
              actionType: "Arrival" | "Departure";
              flightNumber: number;
              ETA: string | null;
              STA: string;
              ETD: string | null;
              STD: string;
              BOX: string;
              prefix: string;
              description: string;
              isTurnAround: boolean;
              aircraft: {
                data: {
                  attributes: {
                    name: string;
                  };
                };
              };
            };
          };
        };
        attendanceLiveTasks: {
          data: Array<{
            id: string;
            attributes: {
              durationMinutes: number;
              status: "Todo" | "Done";
            };
          }>;
        };
      };
    }>;
  };
}

export type AttendanceSpecType = "National" | "International";

export interface AttendanceLivesHistoryQueryVariables {
  attendanceSpecType?: AttendanceSpecType;
  departmentIds?: string[];
  userId?: string;
}

export const attendanceLivesHistoryQuery = gql`
  query AttendanceLives(
    $attendanceSpecType: String
    $departmentIds: [ID!]
    $userId: ID
  ) {
    attendanceLives(
      sort: "createdAt:asc"
      pagination: { limit: -1 }
      filters: {
        dtFinish: { eq: null }
        flight: {
          id: { not: null }
          aircraft: { id: { not: null } }
          attendanceServiceDays: {
            userLeader: { id: { eq: $userId } }
            dtEnd: { eq: null }
          }
        }
        attendance_spec_origin: { id: { not: null } }
        attendanceSpecType: { eqi: $attendanceSpecType }
        department: { id: { in: $departmentIds } }
      }
    ) {
      data {
        id
        attributes {
          code
          department {
            data {
              id
            }
          }
          flight {
            data {
              attributes {
                flightOrigin
                flightDestiny
                actionType
                flightNumber
                description
                ETA
                STA
                ETD
                STD
                BOX
                prefix
                isTurnAround
                aircraft {
                  data {
                    attributes {
                      name
                    }
                  }
                }
              }
            }
          }
          attendanceLiveTasks {
            data {
              id
              attributes {
                status
                durationMinutes
              }
            }
          }
        }
      }
    }
  }
`;
