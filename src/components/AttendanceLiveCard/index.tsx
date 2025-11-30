import { useNavigation } from "@react-navigation/native";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

interface AttendanceLiveCardProps {
  flightCode: string;
  timeLanding: string;
  location: string;
  aircraft: string;
  buttonDisable: boolean;
}

const AttendanceLiveCard: React.FC<AttendanceLiveCardProps> = ({
  buttonDisable,
  flightCode,
  timeLanding,
  location,
  aircraft,
}) => {
  const { navigate } = useNavigation();

  function handleGo() {
    navigate("AttendanceLiveTask", {
      flightCode: flightCode,
      time: timeLanding,
      location: location,
      aircraft: aircraft,
      codRot: "codRot",
      codServc: "codServc",
    });
  }

  return (
    <View
      className="w-48 space-y-5 rounded-lg p-4"
      style={{ backgroundColor: "#F2F9FF" }}
    >
      <View className="flex-row justify-center">
        <Text className="" style={{ color: "#034881" }}>
          {flightCode}
        </Text>
      </View>
      <View>
        <Text style={{ color: "#034881" }}>{timeLanding}</Text>
        <Text style={{ color: "#034881" }}>{location}</Text>
        <Text style={{ color: "#034881" }}>{aircraft}</Text>
      </View>
      <TouchableOpacity
        onPress={handleGo}
        className="flex-row justify-center rounded-lg p-2"
        style={{ backgroundColor: "#034881" }}
        disabled={buttonDisable}
      >
        <Text style={{ color: "#F2F9FF" }}>INICIAR3</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AttendanceLiveCard;
