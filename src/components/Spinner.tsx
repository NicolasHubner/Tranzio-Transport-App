import { ActivityIndicator, View } from "react-native";

interface SpinnerProps {
  size?: number;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 36 }) => (
  <View className="items-center">
    <ActivityIndicator size={size} color="#034881" />
  </View>
);
