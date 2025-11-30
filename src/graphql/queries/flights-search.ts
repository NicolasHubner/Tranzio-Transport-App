import { gql } from "@apollo/client";

export interface FlightsSearchQueryResponse {
  flights: {
    meta: {
      pagination: {
        pageCount: number;
      };
    };
    data: Array<{
      id: string;
      attributes: {
        flightNumber: number;
        flightDate: string;
        STA: string;
        STD: string;
        actionType: "Arrival" | "Departure";
        BOX: string;
      };
    }>;
  };
}

export interface FlightsSearchQueryVariables {
  query?: number;
  page: number;
  pageSize: number;
}

export const flightsSearchQuery = gql`
  query GetFlightsSearch($query: Long, $page: Int!, $pageSize: Int!) {
    flights(
      pagination: { page: $page, pageSize: $pageSize }
      sort: ["flightDate:desc", "STA:desc"]
      filters: { flightNumber: { containsi: $query } }
    ) {
      meta {
        pagination {
          pageCount
        }
      }
      data {
        id
        attributes {
          flightNumber
          flightDate
          STA
          STD
          BOX
          actionType
        }
      }
    }
  }
`;
