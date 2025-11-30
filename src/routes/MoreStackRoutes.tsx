import { createStackNavigator } from "@react-navigation/stack";
import { ActivityHistory } from "~/pages/ActivityHistory";
import { FlightHistory } from "~/pages/FlightHistory";
import { Flights } from "~/pages/Flights";
import { More } from "~/pages/More";
import { UpdateShiftUserCount } from "~/pages/UpdateShiftUserCount";

const { Navigator, Screen } = createStackNavigator();

export const MoreStackRoutes = () => (
  <Navigator screenOptions={{ headerShown: false }}>
    <Screen name="More" component={More} />
    <Screen name="UpdateShiftUserCount" component={UpdateShiftUserCount} />
    <Screen name="FlightHistory" component={FlightHistory} />
    <Screen name="Flights" component={Flights} />
    <Screen name="ActivityHistory" component={ActivityHistory} />
  </Navigator>
);
