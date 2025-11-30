import { gql } from "@apollo/client";

export interface CreateAttendanceLiveTaskPhotoEvidenceVariables {
  data: {
    attendance_live_task: string;
    evidenceType: "Photo";
    lastLatitude: number;
    lastLongitude: number;
    userOperator: string;
    publishedAt: string;
    willBeCompleted: boolean;
    sourceURL: string;
  };
}

export const createAttendanceLiveTaskPhotoEvidenceMutation = gql`
  mutation CreateAttendanceLiveTaskPhotoEvidence(
    $data: AttendanceLiveTaskEvidenceInput!
  ) {
    createAttendanceLiveTaskEvidence(data: $data) {
      data {
        id
      }
    }
  }
`;
