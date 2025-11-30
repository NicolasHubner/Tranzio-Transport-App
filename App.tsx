import { ApolloProvider } from "@apollo/client";
import { useNetInfo } from "@react-native-community/netinfo";
import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import * as ScreenOrientation from "expo-screen-orientation";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";
import OrbitalBackground from "~/components/OrbitalBackground";
import { InternetConnectionContextProvider } from "~/contexts/InternetConnectionContext";
import "./polyfill";
import { AuthProvider } from "./src/contexts/AuthContext";
import { DrawerMenuContextProvider } from "./src/contexts/DrawerMenuContext";
import { LocationContextProvider } from "./src/contexts/LocationContext";
import { apolloClient } from "./src/lib/apollo";
import { Routes } from "./src/routes";

ScreenOrientation.lockAsync(
  ScreenOrientation.OrientationLock.PORTRAIT_UP,
).catch(console.error);

// launchURL example path issues/:issueId:
// com.qodework.cfs://issues/1
const linking: LinkingOptions<ReactNavigation.RootParamList> = {
  prefixes: ["com.qodework.cfs://"],
  config: {
    screens: {
      Activity: {
        path: "issues/:issueId",
      },
      Chat: {
        path: "chats/:chatId",
      },
      ResetPassword: {
        path: "reset-password/:token",
      },
    },
  },
};

export default function App() {
  const { isConnected } = useNetInfo();

  return (
    <View className="flex-1">
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="transparent"
      />

      <AutocompleteDropdownContextProvider>
        <ApolloProvider client={apolloClient}>
          <DrawerMenuContextProvider>
            {typeof isConnected !== "boolean" ? (
              <OrbitalBackground>
                <View className="flex-1 items-center justify-center">
                  <ActivityIndicator size={48} color="#034881" />
                </View>
              </OrbitalBackground>
            ) : (
              <InternetConnectionContextProvider isConnected={isConnected}>
                <AuthProvider>
                  <LocationContextProvider>
                    <NavigationContainer linking={linking}>
                      <Routes />
                    </NavigationContainer>
                  </LocationContextProvider>
                </AuthProvider>
              </InternetConnectionContextProvider>
            )}
          </DrawerMenuContextProvider>
        </ApolloProvider>
      </AutocompleteDropdownContextProvider>
    </View>
  );
}
