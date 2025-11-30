import { gql } from "@apollo/client";
import type { IssueData } from "./issues";

export interface IssueQueryResponse {
  issue: {
    data: IssueData;
  };
}

export interface IssueQueryVariables {
  id: string;
}

export const issueQuery = gql`
  query Issue($id: ID!) {
    issue(id: $id) {
      data {
        id
        attributes {
          shift
          dtEnd
          status
          dtStart
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
                flightDate
                prefix
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
