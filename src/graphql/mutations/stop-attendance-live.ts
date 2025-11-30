import { gql } from "@apollo/client";

export interface StopAttendanceLiveVariables {
  id: string;
  dtStop: string;
}

export const stopAttendanceLiveMutation = gql`
  mutation StopAttendanceLive($id: ID!, $dtStop: DateTime!) {
    updateAttendanceLive(id: $id, data: { dtStop: $dtStop }) {
      data {
        id
      }
    }
  }
`;
