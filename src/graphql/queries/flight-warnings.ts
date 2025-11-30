import { gql } from "@apollo/client";

export interface FlightWarningsQueryResponse {
  flightWarnings: {
    data: Array<{
      id: string;
      attributes: {
        old: string;
        new: string;
        warningDate: string;
        description: string;
        flight: {
          data: {
            attributes: {
              description: string;
              prefix: string;
            };
          };
        };
      };
    }>;
  };
}

export const flightWarningsQuery = gql`
  query FlightWarnings {
    flightWarnings(filters: { flight: { id: { notNull: true } } }) {
      data {
        id
        attributes {
          old
          new
          warningDate
          description
          flight {
            data {
              attributes {
                description
                prefix
              }
            }
          }
        }
      }
    }
  }
`;
