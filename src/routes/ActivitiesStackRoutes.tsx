import { createStackNavigator } from "@react-navigation/stack";
import { ActivitiesAddMessage } from "~/pages/Activities/ActivitiesAddMessage";
import { ActivitiesAddPicture } from "~/pages/Activities/ActivitiesAddPicture";
import { ActivitiesAddSignature } from "~/pages/Activities/ActivitiesAddSignature";
import { ActivitiesFinish } from "~/pages/Activities/ActivitiesFinish";
import { ActivitiesHistoryHome } from "~/pages/Activities/ActivitiesHistoryHome";
import { ActivitiesList } from "~/pages/Activities/ActivitiesList";
import { ActivitiesStart } from "~/pages/Activities/ActivitiesStart";
import { ActivitiesStop } from "~/pages/Activities/ActivitiesStop";

const { Navigator, Screen } = createStackNavigator();

interface ActivitiesStackRoutesProps {}

export const ActivitiesStackRoutes: React.FC<
  ActivitiesStackRoutesProps
> = () => (
  <Navigator screenOptions={{ headerShown: false }}>
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
