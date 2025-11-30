import { Text, TouchableOpacity, View } from "react-native";

interface QueryFailedProps {
  refetch?: () => void;
}

export const QueryFailed: React.FC<QueryFailedProps> = ({ refetch }) => (
  <View className="items-center space-y-4">
    <Text className="text-center text-sm font-medium text-red-500">
      Ocorreu um erro inesperado 😰
    </Text>

    {refetch ? (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => refetch()}
        className="rounded-lg bg-regal-blue px-6 py-3.5"
      >
        <Text className="text-sm font-medium text-white">Tentar novamente</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);
