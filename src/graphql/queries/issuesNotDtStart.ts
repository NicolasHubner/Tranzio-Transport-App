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
    | "id"
    | "flight"
    | "origin"
    | "destiny"
    | "workerCoordinatesWhenRequested"
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
    issueOrigin: string;
    issueDestiny: string;
    issuePassengers: {
      data: Array<{
        attributes: IssuePassenger;
      }>;
    };
    workerCoordinatesWhenRequested: {
      data: {
        attributes: Coordinates;
      };
    };
    route:string;
  };
};

export interface IssuesNotDtStartQueryResponse {
  issues: {
    data: IssueData[];
  };
}

export interface IssuesNotDtStartQueryVariables {
  areaCode?: string;
  status?: Issue["status"];
  userId?: string;
  flightId?: string;
  issuePassengers?: { containsi: string };
}

export const issuesNotDtStartQuery = gql`
query Issues(
  $areaCode: String
  $status: String
  $userId: ID
  $flightId:ID
  $issuePassengers:StringFilterInput
) {
  issues(
    sort: "createdAt:asc"
    pagination: { limit: -1 }
    filters: {
      dtStart: { not: null }
      flight:{id:{eq:$flightId}}
      status: { eq: $status }
      users: { id: { eq: $userId } }
      area: {code:{eq:$areaCode}}
      passengerName:$issuePassengers}
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
        issueOrigin
        issueDestiny
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
