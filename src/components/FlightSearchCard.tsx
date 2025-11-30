import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import { Text, TouchableOpacity, View } from "react-native";

interface FlightSearchCardProps {
  flightNumber: number;
  id: string;
  sta: string;
  std: string;
  box: string;
  flightDate: string;
  actionType: "Arrival" | "Departure";
}

export const FlightSearchCard: React.FC<FlightSearchCardProps> = ({
  box,
  sta,
  id,
  std,
  flightDate,
  actionType,
  flightNumber,
}) => {
  const { navigate } = useNavigation();

  function handleFlightStatus() {
    navigate("FlightStatus", {
      id,
    });
  }

  return (
    <TouchableOpacity
      onPress={handleFlightStatus}
      className="rounded-lg bg-[#F2F9FF] p-2.5"
    >
      <View className="flex-row items-center">
        <View className="flex-1">
          <Text className="text-lg font-medium text-[#034881]">
            LA{flightNumber}
          </Text>
          <Text className="font-medium text-[#717171]">
            {dayjs(flightDate).format("DD/MM/YYYY")}
          </Text>
          <View className="flex-row justify-between">
            <View className="mt-2 flex-row">
              <Text className="font-medium text-[#717171]">
                {actionType === "Arrival" ? "Chegada" : "Saída"} -{" "}
              </Text>
              <Text className="font-medium text-[#717171]">
                {actionType === "Arrival"
                  ? sta.substring(0, 5)
                  : std.substring(0, 5)}{" "}
                - {""}
              </Text>
              <Text className="font-medium text-[#717171]">
                Box {box || "N/A"}
              </Text>
            </View>
          </View>
        </View>
        <AntDesign name="right" size={24} color="#034881" />
      </View>
    </TouchableOpacity>
  );
};
