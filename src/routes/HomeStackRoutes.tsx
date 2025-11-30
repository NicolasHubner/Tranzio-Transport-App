import { createStackNavigator } from "@react-navigation/stack";
import { RampOpenShift } from "~/components/RampOpenShift";
import { Accompany } from "~/pages/Accompany";
import { TrackingDetails } from "~/pages/Accompany/TrackingDetails";
import { ActivitiesAddMessage } from "~/pages/Activities/ActivitiesAddMessage";
import { ActivitiesAddPicture } from "~/pages/Activities/ActivitiesAddPicture";
import { ActivitiesAddSignature } from "~/pages/Activities/ActivitiesAddSignature";
import { ActivitiesFinish } from "~/pages/Activities/ActivitiesFinish";
import { ActivitiesHistoryHome } from "~/pages/Activities/ActivitiesHistoryHome";
import { ActivitiesList } from "~/pages/Activities/ActivitiesList";
import { ActivitiesStart } from "~/pages/Activities/ActivitiesStart";
import { ActivitiesStop } from "~/pages/Activities/ActivitiesStop";
import { Activity } from "~/pages/Activity";
import { AttendanceServiceDay } from "~/pages/AttendanceServiceDay";
import Ceop from "~/pages/Ceop";
import ChooseTypeCeop from "~/pages/Ceop/chooseType";
import { HandleGse } from "~/pages/HandleGse";
import { History } from "~/pages/History";
import { Home } from "~/pages/Home";
import { NewAttendanceIssue } from "~/pages/NewAttendanceIssue";
import { Pnae } from "~/pages/Pnae";
import { Profile } from "~/pages/Profile";
import { Requester } from "~/pages/Requester";
import { StepCloseAttendance } from "~/pages/StepCloseAttendance";
import { StepInput } from "~/pages/StepInput";
import { StepQrCode } from "~/pages/StepQrCode";
import { StepStartAttendance } from "~/pages/StepStartAttendance";

const { Navigator, Screen } = createStackNavigator();

export const HomeStackRoutes = () => (
  <Navigator screenOptions={{ headerShown: false }}>
    <Screen name="Home" component={Home} />
    <Screen name="Activity" component={Activity} />
    <Screen name="Requester" component={Requester} />
    <Screen name="History" component={History} />
    <Screen name="Accompany" component={Accompany} />
    <Screen name="Profile" component={Profile} />
    <Screen name="Pnae" component={Pnae} />
    <Screen name="HandleGse" component={HandleGse} />
    <Screen name="TrackingDetails" component={TrackingDetails} />
    <Screen name="NewAttendanceIssue" component={NewAttendanceIssue} />
    <Screen name="AttendanceServiceDay" component={AttendanceServiceDay} />
    <Screen name="StepQrCode" component={StepQrCode} />
    <Screen name="StepInput" component={StepInput} />
    <Screen name="StepStartAttendance" component={StepStartAttendance} />
    <Screen name="StepCloseAttendance" component={StepCloseAttendance} />
    <Screen name="Ceop" component={Ceop} />
    <Screen name="StepOneCeop" component={ChooseTypeCeop} />

    <Screen name="RampOpenShift" component={RampOpenShift} />
    <Screen name="ActivitiesList" component={ActivitiesList} />
    <Screen name="ActivitiesHistoryHome" component={ActivitiesHistoryHome} />
    <Screen name="ActivitiesStart" component={ActivitiesStart} />
    <Screen name="ActivitiesStop" component={ActivitiesStop} />
    <Screen name="ActivitiesFinish" component={ActivitiesFinish} />
    <Screen name="ActivitiesAddMessage" component={ActivitiesAddMessage} />
    <Screen name="ActivitiesAddPicture" component={ActivitiesAddPicture} />
    <Screen name="ActivitiesAddSignature" component={ActivitiesAddSignature} />
  </Navigator>
);
