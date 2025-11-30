import { gql } from "@apollo/client";

export interface UpdateAttendanceLiveTaskStatusResponse {
  updateAttendanceLiveTask: {
    data: {
      id: string;
      attributes: {
        status: "Todo" | "Done";
      };
    };
  };
}

export interface UpdateAttendanceLiveTaskStatusVariables {
  id: string;
  status: "Todo" | "Done";
}

export const updateAttendanceLiveTaskStatusMutation = gql`
  mutation UpdateAttendanceLiveTaskStatus(
    $id: ID!
    $status: ENUM_ATTENDANCELIVETASK_STATUS!
  ) {
    updateAttendanceLiveTask(id: $id, data: { status: $status }) {
      data {
        id
        attributes {
          status
        }
      }
    }
  }
`;
