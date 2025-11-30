import { gql } from "@apollo/client";
import { Coordinates } from "~/types/Coordinates";
import { Flight } from "~/types/Flight";
import { Issue } from "~/types/Issue";
import { IssuePassenger } from "~/types/IssuePassenger";
import { POI } from "~/types/POI";
import { User } from "~/types/User";

export interface FlightQueryResponse {
  flight: {
    data: {
      id: string;
      attributes: {
        flightNumber: number;
        STD: string;
        STA: string;
        ETD: string;
        ETA: string;
        actionType: string;
        gate: string;
        route: string;
        issues: {
          data: Array<{
            attributes: {
              origin: {
                data: {
                  attributes: {
                    name: string;
                  };
                };
              };
              destiny: {
                data: {
                  attributes: {
                    name: string;
                  };
                };
              };
            };
          }>;
        };
      };
    };
  };
}

export interface FlightsQueryResponseUnfiltered {
  flights: {
    data: Array<{
      id: string;
      attributes: Omit<Flight, "id"> & {
        issues: {
          data: IssueData[];
        };
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
    }>;
  };
}

export type IssueData = {
  id: Issue["id"];
  attributes: Omit<
    Issue,
    | "id"
    | "flight"
    | "origin"
    | "destiny"
    | "serviceTypes"
    | "solicitation"
    | "workerCoordinatesWhenRequested"
  > & {
    solicitation: "";
    flight: {
      data: {
        id: Flight["id"];
        attributes: Omit<Flight, "id">;
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
    workerCoordinatesWhenRequested?: {
      data?: {
        attributes: Coordinates;
      } | null;
    } | null;
    users: {
      data: Array<{
        attributes: User;
      }>;
    };
  };
};

export interface FlightQueryVariables {
  flightId?: string;
}

export const flightQuery = gql`
  query GetFlight($flightId: ID) {
    flight(id: $flightId) {
      data {
        id
        attributes {
          flightNumber
          issues {
            data {
              attributes {
                origin {
                  data {
                    attributes {
                      name
                    }
                  }
                }
                destiny {
                  data {
                    attributes {
                      name
                    }
                  }
                }
              }
            }
          }
          STD
          ETD
          STA
          ETA
          actionType
          gate
          route
        }
      }
    }
  }
`;
