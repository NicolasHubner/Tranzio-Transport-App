import { gql } from "@apollo/client";

export interface FinishAttendanceLiveVariables {
  id: string;
  dtFinish: string;
}

export const finishAttendanceLiveMutation = gql`
  mutation FinishAttendanceLive($id: ID!, $dtFinish: DateTime!) {
    updateAttendanceLive(id: $id, data: { dtFinish: $dtFinish }) {
      data {
        id
      }
    }
  }
`;
