import { gql } from "@apollo/client";
import type { Coordinates } from "../../types/Coordinates";
import type { Flight } from "../../types/Flight";
import type { Issue } from "../../types/Issue";
import type { IssuePassenger } from "../../types/IssuePassenger";
import type { POI } from "../../types/POI";

export type IssueData = {
  id: Issue["id"];
  attributes: Omit<
    Issue,
    "id" | "flight" | "origin" | "destiny" | "workerCoordinatesWhenRequested"
  > & {
    flight: {
      data: {
        attributes: Flight;
      };
    };
    origin: {
      data: {
        attributes: POI;
      };
    };
    destiny: {
      data: {
        attributes: POI;
      };
    };
    issuePassengers: {
      data: Array<{
        attributes: IssuePassenger;
      }>;
    };
    serviceType: string;
    workerCoordinatesWhenRequested: {
      data: {
        attributes: Coordinates;
      };
    };
    route: string;
  };
};

export interface IssuesQueryResponse {
  issues: {
    data: IssueData[];
  };
}

export type IssuesQueryFormatedResponse = {
  issues: {
    meta: {
      pagination: {
        total: number;
        pageCount: number;
      };
    };
    data: Array<{
      id: string;
      attributes: {
        stdEta: string;
        shift: string;
        dtEnd: string;
        status: string;
        dtStart: string;
        createdAt: string;
        evidenceDescription: string;
        passengerName: string;
        serviceType: string;
        solicitation: string;
        issueOrigin: string;
        issueDestiny: string;
        issuePassengers: {
          data: {
            attributes: {
              serviceType: string;
              name: string;
            };
          };
        };
        origin: {
          data: {
            attributes: {
              name: string;
              latitude: string;
              longitude: string;
            };
          };
        };
        destiny: {
          data: {
            attributes: {
              name: string;
              latitude: string;
              longitude: string;
            };
          };
        };
        flight: {
          data: {
            id: string;
            attributes: {
              flightNumber: string;
              actionType: string;
              flightDate: string;
              gate: string;
              route: string;
              flightOrigin: string;
              flightDestiny: string;
              STA: string;
              STD: string;
              airline: {
                data: {
                  id: string;
                  attributes: {
                    name: string;
                    code: string;
                  };
                };
              };
            };
          };
        };
        users: {
          data: {
            id: string;
            attributes: {
              name: string;
              username: string;
              email: string;
            };
          };
        };
        route: string;
      };
    }>;
  };
};

export interface IssuesQueryVariables {
  areaCode?: string;
  idIssue?: string;
  status?: Issue["status"];
  userId?: string;
  flightId?: string;
  issuePassengers?: { containsi: string };
}

export const issuesQuery = gql`
  query Issues(
    $areaCode: String
    $status: String
    $userId: ID
    $flightId: ID
    $issuePassengers: StringFilterInput
    $idIssue: ID
  ) {
    issues(
      sort: "createdAt:asc"
      pagination: { limit: -1 }
      filters: {
        id: { eq: $idIssue }
        flight: { id: { eq: $flightId } }
        status: { eq: $status }
        users: { id: { eq: $userId } }
        area: { code: { eq: $areaCode } }
        passengerName: $issuePassengers
      }
    ) {
      data {
        id
        attributes {
          shift
          dtEnd
          status
          dtStart
          createdAt
          requestedAt
          passengerName
          serviceType
          issueOrigin
          issueDestiny
          users {
            data {
              id
              attributes {
                name
              }
            }
          }
          issuePassengers {
            data {
              attributes {
                serviceType
              }
            }
          }
          origin {
            data {
              attributes {
                name
                latitude
                longitude
              }
            }
          }
          destiny {
            data {
              attributes {
                name
                latitude
                longitude
              }
            }
          }
          flight {
            data {
              attributes {
                STA
                route
                actionType
                flightNumber
                flightOrigin
                flightDestiny
                isInternational
              }
            }
          }
          workerCoordinatesWhenRequested {
            data {
              attributes {
                latitude
                longitude
              }
            }
          }
          route
        }
      }
    }
  }
`;
