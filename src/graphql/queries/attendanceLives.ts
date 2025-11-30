import { gql } from "@apollo/client";

export interface AttendanceLivesQueryResponse {
  attendanceLives: {
    data: Array<{
      id: string;
      attributes: {
        dtStart: string | null;
        dtStop: string | null;

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
              flightDate: string;
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
      };
    }>;
  };
}

export type AttendanceSpecType = "National" | "International";

export interface AttendanceLivesQueryVariables {
  attendanceSpecType?: AttendanceSpecType;
  departmentIds?: string[];
  userId?: string;
}

export const attendanceLivesQuery = gql`
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
          dtStart
          dtStop
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
                flightDate
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
        }
      }
    }
  }
`;
