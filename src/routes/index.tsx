import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import ChangePasswordScreen from "~/components/ChangePasswordScreen";
import OrbitalBackground from "~/components/OrbitalBackground";
import { useAuth } from "~/hooks/useAuth";
import { useNotifications } from "~/hooks/useNotifications";
import { usePendingChatMessageStatesData } from "~/hooks/usePendingChatMessageStatesData";
import { Notifications } from "~/pages/Notifications";
import { ChatStackRoutes } from "./ChatStackRoutes";
import { HomeStackRoutes } from "./HomeStackRoutes";
import { LoginStackRoutes } from "./LoginStackRoutes";
import { MoreStackRoutes } from "./MoreStackRoutes";

const Tab = createBottomTabNavigator();

export const Routes: React.FC = () => {
  useNotifications();
  const { pendingStates } = usePendingChatMessageStatesData();
  const { isInitialLoad, isAuthenticated, isFirstLogin } = useAuth();

  if (isInitialLoad) {
    return (
      <OrbitalBackground>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size={48} color="#034881" />
        </View>
      </OrbitalBackground>
    );
  }

  if (!isAuthenticated) {
    return <LoginStackRoutes />;
  }

  if (isFirstLogin) {
    return <ChangePasswordScreen />;
  }

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FFF",
        tabBarStyle: {
          height: 60,
          borderTopWidth: 0,
          backgroundColor: "#034881",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: -8,
          marginBottom: 7,
          fontWeight: "400",
        },
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStackRoutes}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Entypo name="home" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="ChatStack"
        component={ChatStackRoutes}
        options={{
          tabBarBadge:
            pendingStates.length === 0
              ? undefined
              : pendingStates.length > 9
              ? "9+"
              : pendingStates.length,
          tabBarLabel: "Chat",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-chatbubble-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={{
          tabBarLabel: "Notificações",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="MoreStack"
        component={MoreStackRoutes}
        options={{
          tabBarLabel: "Mais",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="menu" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
