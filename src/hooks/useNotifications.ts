import * as Linking from "expo-linking";
import { useEffect } from "react";
import OneSignal from "react-native-onesignal";
import { useAuth } from "./useAuth";

OneSignal.setAppId(process.env.ONE_SIGNAL_APP_ID);

export function useNotifications() {
  const { user } = useAuth();

  const userEmail = user?.email;

  useEffect(() => {
    if (!userEmail) return;
    OneSignal.sendTag("user_email", userEmail);
  }, [userEmail]);

  useEffect(() => {
    OneSignal.setNotificationOpenedHandler(event => {
      if (event.notification.launchURL) {
        Linking.openURL(event.notification.launchURL);
      }

      // if ("actionId" in event.action) {
      //   switch (event.action.actionId) {
      //     default: {
      //       console.log("actionId inesperado: ", event.action.actionId);
      //     }
      //   }
      // } else {
      //   console.log("Nenhum botão de ação selecionado");
      // }
    });
  }, []);
}
