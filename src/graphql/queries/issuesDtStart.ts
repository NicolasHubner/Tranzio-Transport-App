import { gql } from "@apollo/client";
import type { Coordinates } from "../../types/Coordinates";
import type { Flight } from "../../types/Flight";
import type { Issue } from "../../types/Issue";
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
        attributes: {
          serviceType: string;
        };
      }>;
    };
    serviceType: string;
    workerCoordinatesWhenRequested: {
      data: {
        attributes: Coordinates;
      };
    };
  };
};

export interface IssuesDtStartQueryResponse {
  issues: {
    data: IssueData[];
  };
}

export interface IssuesDtStartQueryVariables {
  areaCode?: string;
  fromDate?: string;
  toDate?: string;
  status?: Issue["status"];
  userId?: string;
}

export const issuesDtStartQuery = gql`
  query Issues(
    $areaCode: String
    $fromDate: DateTime
    $toDate: DateTime
    $status: String
    $userId: ID
  ) {
    issues(
      sort: "createdAt:asc"
      pagination: { limit: -1 }
      filters: {
        status: { eq: $status }
        users: { id: { eq: $userId } }
        area: { code: { eq: $areaCode } }
        createdAt: { gte: $fromDate, lte: $toDate }
        dtStart: { ne: null }
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
        }
      }
    }
  }
`;
