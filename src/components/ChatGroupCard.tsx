import { Text, TouchableOpacity, View } from "react-native";
import { getInitials } from "~/utils/getInitials";

interface ChatGroupCardProps {
  name: string;
  onPress: () => void;
}

export const ChatGroupCard: React.FC<ChatGroupCardProps> = ({
  name,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} className="w-14 items-center space-y-1">
      <View className="w-full rounded-2xl border-2 border-[#034881] p-0.5">
        <View className="aspect-square w-full items-center justify-center rounded-2xl bg-[#166FF6]">
          <Text className="text-sm font-bold text-white">
            {getInitials(name)}
          </Text>
        </View>
      </View>

      <Text numberOfLines={1} className="text-sm text-[#5C7181]">
        {name}
      </Text>
    </TouchableOpacity>
  );
};
