import AsyncStorage from "@react-native-async-storage/async-storage";
import * as TaskManager from "expo-task-manager";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  UpdateShiftMutationVariables,
  updateShiftMutation,
} from "~/graphql/mutations/update-shift";
import { useAuth } from "~/hooks/useAuth";
import { apolloClient } from "~/lib/apollo";
import {
  pnaeTask,
  shiftTask,
} from "~/pages/Activity/SendLocation/BackGroundTask";
import { sendOpenShiftLocation } from "~/pages/AttendanceServiceDay/OpenShiftLocation/sendOpenShiftLocation";

interface PnaeOpenShiftProps {}

const LOCATION_TRACKING_SHIFT_TASK = "location-tracking-shift";

interface IParseInitShift {
  idUser: string;
  nameUser: string;
}

TaskManager.defineTask(
  LOCATION_TRACKING_SHIFT_TASK,
  async ({ data, error }) => {
    if (error) {
      console.error(error);
      return;
    }
    if (data) {
      const { locations } = data as any;
      const { coords } = locations[0];

      const location = await AsyncStorage.getItem("@Cfs:UserShiftStart");

      const parseLocation: IParseInitShift = JSON.parse(location!);

      await sendOpenShiftLocation({
        latitude: coords.latitude.toString(),
        longitude: coords.longitude.toString(),
        idUser: parseLocation.idUser,
        nameUser: parseLocation.nameUser,
      });
    }
  },
);

export const PnaeOpenShift: React.FC<PnaeOpenShiftProps> = () => {
  const { user, setUser } = useAuth();
  const [isUpdatingShift, setIsUpdatingShift] = useState(false);

  async function handleToggleShift() {
    setIsUpdatingShift(true);
    const newIsShiftOpen = !user?.isShiftOpen;

    try {
      await apolloClient.mutate<{}, UpdateShiftMutationVariables>({
        mutation: updateShiftMutation,
        variables: {
          userId: user!.id,
          isShiftOpen: newIsShiftOpen,
        },
      });

      setUser(currentUser => {
        if (!currentUser) {
          return currentUser;
        }

        return {
          ...currentUser,
          isShiftOpen: newIsShiftOpen,
        };
      });

      // Start tracking location in background OPEN SHIFT
      const objectUserShiftStart: IParseInitShift = {
        idUser: user?.id || "",
        nameUser: user?.username || "",
      };

      await AsyncStorage.setItem(
        "@Cfs:UserShiftStart",
        JSON.stringify(objectUserShiftStart),
      );

      await pnaeTask.stopLocationTracking();
      await shiftTask.startLocationTracking();

      // ----------------------------------------//
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Erro",
        `Não foi possível ${newIsShiftOpen ? "abrir" : "fechar"} o turno.`,
      );
    } finally {
      setIsUpdatingShift(false);
    }
  }

  return (
    <View className="mt-5 justify-center px-5">
      {user?.isShiftOpen ? null : (
        <TouchableOpacity
          activeOpacity={0.6}
          disabled={isUpdatingShift}
          onPress={handleToggleShift}
          className="items-center justify-center rounded-md bg-[#034881] px-10 py-6"
        >
          {isUpdatingShift ? (
            <ActivityIndicator color="white" size={24} />
          ) : (
            <Text className="text-base font-bold uppercase text-white">
              {user?.isShiftOpen ? "Fechar" : "Abrir"} Turno
            </Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};
