import {
  AntDesign,
  Entypo,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useState } from "react";
import { Text, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import FlightTakeOffIcon from "~/assets/icons/airplane-takeoff.svg";
import FlightLandIcon from "~/assets/icons/flight-land.svg";
import MapPinIcon from "~/assets/icons/map-pin.svg";
import { CircularProgress } from "~/components/CircularProgress";
import { AttendanceLivesHistoryQueryResponse } from "~/graphql/queries/attendanceLivesHistory";

interface ActivityHistoryCardProps {
  attendanceLive: AttendanceLivesHistoryQueryResponse["attendanceLives"]["data"][number];
}

export const ActivityHistoryCard: React.FC<ActivityHistoryCardProps> = ({
  attendanceLive,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [titleWidth, setTitleWidth] = useState(0);
  const [subtitleWidth, setSubtitleWidth] = useState(0);
  const [buttonWidth, setButtonWidth] = useState(0);

  const attendanceLiveTasksData =
    attendanceLive.attributes.attendanceLiveTasks.data;

  const totalTasksDurationMinutes = attendanceLiveTasksData.reduce(
    (total, attendanceLiveTask) => {
      return total + attendanceLiveTask.attributes.durationMinutes;
    },
    0,
  );

  const tasksProgress = attendanceLiveTasksData.reduce(
    (progress, attendanceLiveTask) => {
      if (attendanceLiveTask.attributes.status === "Done") {
        progress +=
          (attendanceLiveTask.attributes.durationMinutes /
            totalTasksDurationMinutes) *
          100;
      }

      return progress;
    },
    0,
  );

  const onItemPress = () => {
    setExpanded(!expanded);
  };

  const contentStyle = useAnimatedStyle(() => {
    const animatedHeight = expanded ? withTiming(120) : withTiming(0);
    return {
      height: animatedHeight,
    };
  });
  const titleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(
            expanded ? buttonWidth / 2 - titleWidth / 2 : 0,
          ),
        },
      ],
    };
  });
  const subtitleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(expanded ? -(subtitleWidth * 1.2) : 0),
        },
      ],
    };
  });
  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: withTiming(expanded ? "180deg" : "0deg"),
        },
      ],
    };
  });

  return (
    <View
      className="w-full space-y-4 rounded-2xl bg-blue-light px-2.5 py-3.5"
      style={{ elevation: 8 }}
    >
      <TouchableWithoutFeedback onPress={onItemPress}>
        <View
          className="w-full flex-row items-center justify-between"
          onLayout={event => {
            setButtonWidth(event.nativeEvent.layout.width);
          }}
        >
          <View>
            <Animated.View
              style={titleStyle}
              onLayout={event => {
                setTitleWidth(event.nativeEvent.layout.width);
              }}
            >
              <Text className="self-start text-center text-xl font-semibold text-regal-blue">
                {attendanceLive.attributes.flight.data.attributes.description}{" "}
                {attendanceLive.attributes.flight.data.attributes
                  .isTurnAround && (
                  <AntDesign name="swap" size={24} color="#034881" />
                )}
              </Text>
            </Animated.View>
            <Animated.View
              style={subtitleStyle}
              onLayout={event => {
                setSubtitleWidth(event.nativeEvent.layout.width);
              }}
            >
              <Text className="mt-2 self-start text-center text-base font-semibold text-[#717171]">
                {attendanceLive.attributes.code}
              </Text>
            </Animated.View>
          </View>
          <Animated.View style={indicatorStyle}>
            <Entypo name="chevron-small-down" size={32} color="#034881" />
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
      <Animated.View style={contentStyle} className="w-full overflow-hidden">
        <View className="w-full flex-row items-center justify-between">
          <View className="space-y-2">
            {attendanceLive.attributes.flight.data.attributes.actionType ===
            "Arrival" ? (
              <View className="flex-row space-x-2.5">
                <FlightLandIcon width={24} height={24} />
                <Text className="text-base font-medium text-regal-blue">
                  STA:{" "}
                  {attendanceLive.attributes.flight.data.attributes.STA.substring(
                    0,
                    5,
                  )}
                </Text>
              </View>
            ) : (
              <View className="flex-row space-x-2.5">
                <FlightTakeOffIcon width={24} height={24} />
                <Text className="text-base font-medium text-regal-blue">
                  STD:{" "}
                  {attendanceLive.attributes.flight.data.attributes.STD.substring(
                    0,
                    5,
                  )}
                </Text>
              </View>
            )}
            {attendanceLive.attributes.flight.data.attributes.actionType ===
            "Departure" ? (
              <View className="flex-row space-x-2.5">
                <MaterialCommunityIcons
                  name="airport"
                  size={24}
                  color="#034881"
                />
                <Text className="text-base font-medium text-regal-blue">
                  {
                    attendanceLive.attributes.flight.data.attributes
                      .flightDestiny
                  }
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
                  {
                    attendanceLive.attributes.flight.data.attributes
                      .flightOrigin
                  }
                </Text>
              </View>
            )}
            <View className="flex-row space-x-2.5">
              <MapPinIcon width={24} height={24} />
              <Text className="text-base font-medium text-regal-blue">
                Box {attendanceLive.attributes.flight.data.attributes.BOX}
              </Text>
            </View>
            <View className="flex-row space-x-2.5">
              <MaterialIcons name="local-airport" size={24} color="#034881" />
              <Text className="text-base font-medium text-regal-blue">
                {
                  attendanceLive.attributes.flight.data.attributes.aircraft.data
                    .attributes.name
                }
              </Text>
            </View>
          </View>

          <CircularProgress
            backgroundColor="grey"
            ringColor="#034881"
            size={52}
            strokeWidth={8}
            progress={expanded ? tasksProgress : 0}
            text={`${tasksProgress.toFixed(0)}%`}
            animationDelay={expanded ? 200 : 0}
          />
        </View>
      </Animated.View>
    </View>
  );
};
