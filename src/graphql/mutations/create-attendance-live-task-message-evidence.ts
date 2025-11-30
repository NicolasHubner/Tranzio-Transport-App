import { gql } from "@apollo/client";

export interface CreateAttendanceLiveTaskMessageEvidenceVariables {
  data: {
    attendance_live_task: string;
    evidenceType: "Message";
    description: string;
    lastLatitude: number;
    lastLongitude: number;
    userOperator: string;
    publishedAt: string;
    willBeCompleted: boolean;
  };
}

export const createAttendanceLiveTaskMessageEvidenceMutation = gql`
  mutation CreateAttendanceLiveTaskMessageEvidence(
    $data: AttendanceLiveTaskEvidenceInput!
  ) {
    createAttendanceLiveTaskEvidence(data: $data) {
      data {
        id
      }
    }
  }
`;
