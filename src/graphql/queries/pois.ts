import { gql } from "@apollo/client";

export interface PoisQueryResponse {
  pois: {
    data: Array<{
      id: string;
      attributes: {
        name: string;
      }
    }>
  }
}

export interface PoisQueryVariable {
  query: string;
}

export const poisQuery = gql`
query GetAllPoi($query:String){
  pois (    
    pagination: { limit: -1 }
    filters:{name:{containsi:$query}}
    ){
    data{
      id
      attributes{
        name
      }
    }
  }
}
`;
