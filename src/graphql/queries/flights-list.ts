import { gql } from "@apollo/client";

export interface FlightsListQueryResponse {
  flights: {
    data: Array<{
      id: string;
      attributes: {
        flightNumber: number;
        flightOrigin: string;
        flightDestiny: string;
        ETD: string;
        ETA: string | null;
        STA: string;
        STD: string,
        BOX: string;
        bag: string | null;
        load: string | null;
        prefix: string;
        description: string;
        actionType: string;
        aircraft: {
          data: {
            attributes: {
              name: string;
            };
          };
        };
      };
    }>;
  };
}

export interface FlightsListQueryVariables {
  userId?: string;
}

export const flightsListQuery = gql`
  query GetAllFlightsList($userId: ID) {
    flights(
      pagination: { limit: -1 }
      filters: {
        aircraft: { id: { not: null } }
        attendanceServiceDays: {
          userLeader: { id: { eq: $userId } }
          dtEnd: { eq: null }
        }
      }
    ) {
      data {
        id
        attributes {
          flightNumber
          ETD
          STA
          actionType
          description
          prefix
          STD
          flightOrigin
          flightDestiny
          BOX
          ETD
          ETA
          bag
          load
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
`;
