import { gql } from "@apollo/client";

export interface AttendanceLiveByIdQueryResponse {
  attendanceLive: {
    data: {
      id: string;
      attributes: {
        dtStop: string | null;
        createdAt: string;
        durationMinutes: number;
        minutesToStart: number;
        flight: {
          data: {
            id: string;
            attributes: {
              flightNumber: number;
              flightOrigin: string;
              flightDestiny: string;
              flightDate: string;
              actionType: "Arrival" | "Departure";
              ETA: string | null;
              STA: string;
              ETD: string | null;
              STD: string;
              BOX: string;
              prefix: string;
              cpm: string | null;
              lir: string | null;
              bag: string | null;
              load: string | null;
              description: string;
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
        department: {
          data: {
            attributes: {
              name: string;
              code: string;
            };
          };
        };
        attendance_spec_origin: {
          data: {
            attributes: {
              code: string;
              description: string;
            };
          };
        };
        attendanceLiveTasks: {
          data: Array<{
            id: string;
            __typename: string;
            attributes: {
              code: string;
              __typename: string;
              description: string;
              durationMinutes: number;
              status: "Todo" | "Done";
              EvidencePhotoRequired: boolean | null;
              SignatureOnScreenRequired: boolean | null;
              attendance_live_previous_task: {
                data: {
                  id: string;
                };
              };
              attendance_live_task_evidences: {
                data: Array<{
                  attributes: {
                    evidenceType: "Message" | "Photo" | "Signature";
                  };
                }>;
              };
            };
          }>;
        };
      };
    };
  };
}

export interface AttendanceLiveByIdQueryVariables {
  id: string;
  departmentIds?: string[];
}

export const attendanceLiveByIdQuery = gql`
  query AttendanceLiveById($id: ID!, $departmentIds: [ID!]) {
    attendanceLive(id: $id) {
      data {
        id
        attributes {
          dtStop
          createdAt
          durationMinutes
          minutesToStart
          flight {
            data {
              id
              attributes {
                flightNumber
                flightOrigin
                actionType
                flightDestiny
                ETA
                STA
                ETD
                STD
                BOX
                cpm
                lir
                bag
                load
                prefix
                description
                flightDate
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
          department {
            data {
              attributes {
                name
                code
              }
            }
          }
          attendance_spec_origin {
            data {
              attributes {
                code
                description
              }
            }
          }
          attendanceLiveTasks(
            sort: "code:asc"
            pagination: { limit: -1 }
            filters: { department: { id: { in: $departmentIds } } }
          ) {
            data {
              id
              attributes {
                code
                status
                description
                durationMinutes
                EvidencePhotoRequired
                SignatureOnScreenRequired
                attendance_live_previous_task {
                  data {
                    id
                  }
                }
                attendance_live_task_evidences(pagination: { limit: -1 }) {
                  data {
                    attributes {
                      evidenceType
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
