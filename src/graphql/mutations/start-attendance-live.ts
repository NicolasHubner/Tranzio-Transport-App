import { gql } from "@apollo/client";

export interface StartAttendanceLiveVariables {
  id: string;
  dtStart: string;
}

export const startAttendanceLiveMutation = gql`
  mutation StartAttendanceLive($id: ID!, $dtStart: DateTime!) {
    updateAttendanceLive(id: $id, data: { dtStart: $dtStart }) {
      data {
        id
      }
    }
  }
`;
