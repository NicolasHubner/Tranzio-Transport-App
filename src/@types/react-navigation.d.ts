import type { ActivitiesAddMessageParams } from "~/pages/Activities/ActivitiesAddMessage";
import type { ActivitiesAddPictureParams } from "~/pages/Activities/ActivitiesAddPicture";
import { ActivitiesAddSignatureParams } from "~/pages/Activities/ActivitiesAddSignature";
import type { ActivitiesFinishParams } from "~/pages/Activities/ActivitiesFinish";
import type { ActivitiesStartParams } from "~/pages/Activities/ActivitiesStart";
import type { ActivitiesStopParams } from "~/pages/Activities/ActivitiesStop";
import { CeopRouteParams } from "~/pages/Ceop";
import type { ChatParams } from "~/pages/Chat";
import { FlightStatusParams } from "~/pages/FlightSearch/FlightStatus";
import { ResetPasswordParams } from "~/pages/Login/ResetPassword";
import type { TrackingDetailsParams } from "../pages/Accompany/TrackingDetails";
import type { ActivityParams, ActivityRouteParams } from "../pages/Activity";
import type { StepQrCodeProps } from "../pages/StepQrCode";

export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      HomeStack: undefined;
      Home: undefined;
      Login: undefined;
      Activity: ActivityRouteParams;
      Requester: undefined;
      History: undefined;
      Accompany: { status: string };
      Ceop: CeopRouteParams;
      StepOneCeop: undefined;
      Profile: undefined;
      TrackingDetails: TrackingDetailsParams;
      Pnae: undefined;
      NewAttendanceIssue: undefined;
      HandleGse: undefined;
      AttendanceLive: undefined;
      AttendanceLiveTask: {
        flightCode: string;
        time: string;
        location: string;
        aircraft: string;
        codRot: string;
        codServc: string;
      };
      AttendanceLiveTaskCompleted: undefined;
      RampOpenShift: undefined;
      ActivitiesList: undefined;
      ActivitiesHistoryHome: undefined;
      ActivitiesStart: ActivitiesStartParams;
      ActivitiesStop: ActivitiesStopParams;
      ActivitiesFinish: ActivitiesFinishParams;
      ActivitiesAddMessage: ActivitiesAddMessageParams;
      ActivitiesAddPicture: ActivitiesAddPictureParams;
      ActivitiesAddSignature: ActivitiesAddSignatureParams;
      AttendanceServiceDay: undefined;
      StepStartAttendance: ActivityParams;
      StepQrCode: StepQrCodeProps;
      StepInput: StepQrCodeProps;
      StepCloseAttendance: ActivityParams;
      Chats: undefined;
      Chat: ChatParams;
      CreateChat: undefined;
      FlightSearch: undefined;
      FlightStatus: FlightStatusParams;
      UpdateShiftUserCount: undefined;
      FlightHistory: undefined;
      Flights: undefined;
      ActivityHistory: undefined;
      ForgotPassword: undefined;
      ResetPassword: ResetPasswordParams;
    }
  }
}
