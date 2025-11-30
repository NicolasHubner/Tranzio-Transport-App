import dayjs from "dayjs";
import { Text, View } from "react-native";

interface ChatDateGroupProps {
  date: string;
}

export const ChatDateGroup: React.FC<ChatDateGroupProps> = ({ date }) => {
  let formattedDate = dayjs(date).format("dddd, DD [de] MMMM YYYY");

  if (dayjs().isSame(date, "day")) {
    formattedDate = "Hoje";
  } else if (dayjs().subtract(1, "day").isSame(date, "day")) {
    formattedDate = "Ontem";
  }

  return (
    <View className="relative isolate mb-4 flex w-full flex-row items-center justify-center gap-4">
      <View className="h-px flex-1 bg-[#EDEDED]" />

      <Text className="text-sm font-medium text-[#ADB5BD]">
        {formattedDate}
      </Text>

      <View className="h-px flex-1 bg-[#EDEDED]" />
    </View>
  );
};
