import { Entypo } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import AlertHexagon from "~/assets/icons/alert-hexagon.svg";

interface MoreCardProps {
  title: string;
  description: string;
  onPress?: () => void;
}

export const MoreCard: React.FC<MoreCardProps> = ({
  title,
  description,
  onPress,
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.6}
    className="flex-row items-center space-x-3 px-2.5"
  >
    <AlertHexagon width={24} height={24} />

    <View className="flex-1 space-y-1.5 py-3">
      <Text className="text-lg font-medium text-white">{title}</Text>
      <Text className="text-sm font-normal text-white">{description}</Text>
    </View>

    <Entypo name="chevron-right" size={24} color="white" />
  </TouchableOpacity>
);
