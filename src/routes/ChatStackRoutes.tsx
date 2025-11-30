import { createStackNavigator } from "@react-navigation/stack";
import { Chat } from "~/pages/Chat";
import { Chats } from "~/pages/Chats";
import { CreateChat } from "~/pages/CreateChat";
import { FlightSearch } from "~/pages/FlightSearch";
import { FlightStatus } from "~/pages/FlightSearch/FlightStatus";

const { Navigator, Screen } = createStackNavigator();

interface ChatStackRoutesProps {}

export const ChatStackRoutes: React.FC<ChatStackRoutesProps> = () => (
  <Navigator screenOptions={{ headerShown: false }}>
    <Screen name="Chats" component={Chats} />
    <Screen name="Chat" component={Chat} />
    <Screen name="CreateChat" component={CreateChat} />
    <Screen name="FlightSearch" component={FlightSearch} />
    <Screen name="FlightStatus" component={FlightStatus} />
  </Navigator>
);
