import { gql } from "@apollo/client";

export interface WheelchairByCodeQueryResponse {
  vehicles: {
    data: Array<{
      id: string;
    }>;
  };
}

export interface WheelchairByCodeQueryVariables {
  code: string;
}

export const wheelchairByCodeQuery = gql`
  query WheelchairByCode($code: String!) {
    vehicles(
      filters: { code: { eq: $code }, type: { eq: "Wheelchair" } }
      pagination: { limit: 1 }
    ) {
      data {
        id
      }
    }
  }
`;
