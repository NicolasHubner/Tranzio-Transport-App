import { createStackNavigator } from "@react-navigation/stack";
import Login from "~/pages/Login";
import { ForgotPassword } from "~/pages/Login/ForgotPassword";
import { ResetPassword } from "~/pages/Login/ResetPassword";

const { Navigator, Screen } = createStackNavigator();

export const LoginStackRoutes = () => (
  <Navigator screenOptions={{ headerShown: false }}>
    <Screen name="Login" component={Login} />
    <Screen name="ForgotPassword" component={ForgotPassword} />
    <Screen name="ResetPassword" component={ResetPassword} />
  </Navigator>
);
