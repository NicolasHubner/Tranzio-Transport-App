import { gql } from "@apollo/client";

export interface FlightsIssuesQueryResponse {
  flights: {
    data: Array<{
      id: string;
      attributes: {
        flightNumber: string;
        ETD: string;
        ETA: string;
        description: string;
        STD: string;
        STA: string;
        actionType: string;
        gate: string;
        BOX: string;
        route: string;
        issues: {
          data: {
            id: string;
          };
        };
        workers: {
          data: {
            id: string;
            attributes: {
              name: string;
            };
          };
        };
        airline: {
          data: {
            id: string;
            attributes: {
              name: string;
            };
          };
        };
      };
    }>;
  };
}

export interface FlightsIssuesQueryVariables {
  workerId?: {
    id: {
      eq: string;
    };
  };
}

export const issuesFlightsQuery = gql`
  query GetAllFlight($workerId: UsersPermissionsUserFiltersInput!) {
    flights(
      pagination: { limit: -1 }
      filters: { workers: $workerId, issues: { not: null } }
    ) {
      data {
        id
        attributes {
          flightNumber
          ETD
          ETA
          STA
          description
          STD
          actionType
          gate
          BOX
          route
          issues {
            data {
              id
            }
          }
          workers {
            data {
              id
              attributes {
                name
              }
            }
          }
          airline {
            data {
              id
              attributes {
                name
              }
            }
          }
        }
      }
    }
  }
`;
