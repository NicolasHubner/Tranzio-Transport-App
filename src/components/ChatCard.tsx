import { Feather } from "@expo/vector-icons";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";
import Siren from "~/assets/icons/siren-fill.svg";
import { getInitials } from "~/utils/getInitials";

dayjs.locale("pt-br");
dayjs.extend(relativeTime);

interface ChatCardProps {
  name: string;
  onPress: () => void;
  isMentioned?: boolean;
  hasPriority?: boolean;
  lastMessageAt?: string;
  notificationCount: number;
  lastMessage?: string | null;
}

export const ChatCard: React.FC<ChatCardProps> = ({
  name,
  onPress,
  isMentioned,
  lastMessage,
  hasPriority,
  lastMessageAt,
  notificationCount,
}) => {
  const [timeAgo, setTimeAgo] = useState(
    lastMessageAt ? dayjs(lastMessageAt).fromNow() : undefined,
  );

  useEffect(() => {
    if (lastMessageAt) {
      const intervalId = setInterval(() => {
        const timeAgoString = dayjs(lastMessageAt).fromNow();
        setTimeAgo(timeAgoString);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [lastMessageAt]);

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center rounded-2xl bg-[#F0F4F8] px-2 py-1"
    >
      <View className="aspect-square w-12 items-center justify-center rounded-2xl bg-[#166FF6]">
        <Text className="text-sm font-bold text-white">
          {getInitials(name)}
        </Text>
      </View>

      <View className="ml-4 flex-1 space-y-0.5">
        <View className="flex-row items-center justify-between space-x-2">
          <Text
            numberOfLines={1}
            className="shrink text-sm font-semibold leading-relaxed text-[#034881]"
          >
            {name}
          </Text>

          {lastMessageAt ? (
            <Text className="shrink-0 text-xs text-[#7C7C7C]">{timeAgo}</Text>
          ) : null}
        </View>

        <View className="flex-1 flex-row items-end space-x-2 py-1">
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            className="flex-1 text-sm leading-relaxed text-[#7C7C7C]"
          >
            {lastMessage}
          </Text>

          {hasPriority ? (
            <Animatable.View animation="tada" iterationCount="infinite">
              <Siren width={24} height={24} fill="#ff0000" />
            </Animatable.View>
          ) : isMentioned ? (
            <Animatable.View animation="rubberBand" iterationCount="infinite">
              <Feather name="at-sign" size={24} color="#ff0000" />
            </Animatable.View>
          ) : (
            notificationCount > 0 && (
              <View className="aspect-square w-6 items-center justify-center rounded-full bg-[#D30101]">
                <Text className="text-xs font-bold text-white">
                  {notificationCount}
                </Text>
              </View>
            )
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
