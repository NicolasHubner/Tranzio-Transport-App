import { gql } from "@apollo/client";

export interface CreateAttendanceLiveTaskSignatureEvidenceVariables {
  data: {
    attendance_live_task: string;
    evidenceType: "Signature";
    lastLatitude: number;
    lastLongitude: number;
    userOperator: string;
    publishedAt: string;
    willBeCompleted: boolean;
    sourceBase64: string;
  };
}

export const createAttendanceLiveTaskSignatureEvidenceMutation = gql`
  mutation CreateAttendanceLiveTaskSignatureEvidence(
    $data: AttendanceLiveTaskEvidenceInput!
  ) {
    createAttendanceLiveTaskEvidence(data: $data) {
      data {
        id
      }
    }
  }
`;
