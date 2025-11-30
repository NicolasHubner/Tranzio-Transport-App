import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import classNames from "classnames";
import React from "react";
import { Text, TouchableOpacity, View, ViewProps } from "react-native";
import FlightTakeOffIcon from "~/assets/icons/airplane-takeoff.svg";
import FlightLandIcon from "~/assets/icons/flight-land.svg";
import MapPinIcon from "~/assets/icons/map-pin.svg";

interface ActivityCardProps extends ViewProps {
  id: string;
  departureTime: string;
  flightPrefix: string;
  landingTime: string;
  box?: string | null;
  aircraftName: string;
  hasStarted: boolean;
  hasStopped: boolean;
  isDisabled?: boolean;
  flightOrigin: string;
  flightDestiny: string;
  description: string;
  actionType: "Arrival" | "Departure";
  isTurnAround: boolean;
  flightDate: string;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  id,
  departureTime,
  flightPrefix,
  landingTime,
  box,
  aircraftName,
  isDisabled,
  className,
  hasStarted,
  hasStopped,
  actionType,
  flightOrigin,
  flightDestiny,
  description,
  isTurnAround,
  flightDate,
  ...props
}) => {
  const { navigate } = useNavigation();
  function handleNavigate() {
    navigate(
      hasStopped
        ? "ActivitiesFinish"
        : hasStarted
        ? "ActivitiesStop"
        : "ActivitiesStart",
      { id },
    );
  }

  const timeToUse = actionType === "Arrival" ? landingTime : departureTime;

  const [year, month, day] = flightDate.split("-");

  const [hours, minutes, seconds] = timeToUse.split(":");
  const milliseconds = parseInt(String(seconds.split(".")[1] || 0), 10);

  const combinedDate = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hours),
    Number(minutes),
    Number(seconds.split(".")[0]),
    milliseconds,
  );

  const now = new Date();

  const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);

  const combinedDateTimestamp = combinedDate.getTime();
  const twelveHoursAgoTimestamp = twelveHoursAgo.getTime();

  if (combinedDateTimestamp < twelveHoursAgoTimestamp) {
    // If want to show the activity card, but disable the button, uncomment the line below
    // isDisabled = true;

    // If want to hide the activity card, uncomment the line below
    return null;
  }

  return (
    <View className={classNames("flex-row", className)} {...props}>
      <View
        style={{ elevation: 8 }}
        className=" flex-1 space-y-4 rounded-2xl bg-blue-light p-3.5"
      >
        <Text className="text-center text-2xl font-semibold text-regal-blue">
          {flightPrefix} {description} {"  "}
          {/* {isTurnAround && <AntDesign name="swap" size={24} color="#034881" />} */}
        </Text>

        <View className="space-y-3">
          {actionType === "Arrival" ? (
            <View className="flex-row space-x-2.5">
              <FlightLandIcon width={24} height={24} />
              <Text className="text-base font-medium text-regal-blue">
                ETA: {landingTime.substring(0, 5)}
              </Text>
            </View>
          ) : (
            <View className="flex-row space-x-2.5">
              <FlightTakeOffIcon width={24} height={24} />
              <Text className="text-base font-medium text-regal-blue">
                ETD: {departureTime.substring(0, 5)}
              </Text>
            </View>
          )}

          {actionType === "Departure" ? (
            <View className="flex-row space-x-2.5">
              <MaterialCommunityIcons
                name="airport"
                size={24}
                color="#034881"
              />
              <Text className="text-base font-medium text-regal-blue">
                {flightDestiny}
              </Text>
            </View>
          ) : (
            <View className="flex-row space-x-2.5">
              <MaterialCommunityIcons
                name="airport"
                size={24}
                color="#034881"
              />
              <Text className="text-base font-medium text-regal-blue">
                {flightOrigin}
              </Text>
            </View>
          )}

          <View className="flex-row space-x-2.5">
            <MapPinIcon width={24} height={24} />
            <Text className="text-base font-medium text-regal-blue">
              Box {box}
            </Text>
          </View>

          <View className="flex-row space-x-2.5">
            <MaterialIcons name="local-airport" size={24} color="#034881" />

            <Text className="text-base font-medium text-regal-blue">
              {aircraftName}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.6}
          disabled={isDisabled}
          onPress={handleNavigate}
          style={{ borderRadius: 10 }}
          className={classNames(
            "w-full py-2.5",
            isDisabled ? "bg-gray-neutral" : "bg-regal-blue",
          )}
        >
          <Text className="text-center text-sm font-medium uppercase text-white">
            {hasStopped ? "Concluir" : hasStarted ? "Continuar" : "Iniciar"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
