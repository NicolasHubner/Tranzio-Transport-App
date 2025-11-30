import { useNavigation, useRoute } from "@react-navigation/native";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import AttendanceLiveTaskItem from "~/components/AttendanceLiveTaskItem";
import Layout from "~/components/Layout";
import OrbitalBackground from "~/components/OrbitalBackground";

const AttendanceLiveTask: React.FC = () => {
  const route = useRoute();

  const { flightCode } = route.params as { flightCode: string };
  const { time } = route.params as { time: string };
  const { location } = route.params as { location: string };
  const { aircraft } = route.params as { aircraft: string };
  const { codRot } = route.params as { codRot: string };
  const { codServc } = route.params as { codServc: string };

  const { navigate } = useNavigation();

  function handleBack() {
    navigate("AttendanceLive");
  }
  function handleGo() {
    navigate("AttendanceLiveTaskCompleted");
  }
  const data = [
    { title: "Limpeza", subtasks: ["limpar", "distribuir"] },
    { title: "Recolhimento", subtasks: ["limpar", "distribuir"] },
    { title: "Abastecimento", subtasks: ["limpar", "distribuir"] },
  ];

  return (
    <OrbitalBackground>
      <Layout back={handleBack}>
        <View className="space-y-5 px-5">
          <Text
            className="text-center text-xl font-bold"
            style={{ color: "#034881", fontSize: 16 }}
          >
            {flightCode}
          </Text>
          <Text className="mt-2" style={{ color: "#034881", fontSize: 14 }}>
            {time}
          </Text>
          <Text className="mt-2" style={{ color: "#034881", fontSize: 14 }}>
            {location}
          </Text>
          <Text className="mt-2" style={{ color: "#034881", fontSize: 14 }}>
            {aircraft}
          </Text>
          <Text className="mt-2" style={{ color: "#034881", fontSize: 14 }}>
            {codRot}
          </Text>
          <Text className="mt-2" style={{ color: "#034881", fontSize: 14 }}>
            {codServc}
          </Text>
        </View>
        {data.map((item, index) => (
          <AttendanceLiveTaskItem
            key={index}
            titleTaskLive={item.title}
            subtasksLive={item.subtasks}
          />
        ))}
        <View className="flex-row justify-around pt-10">
          <TouchableOpacity
            onPress={handleBack}
            className="rounded-lg"
            style={{ backgroundColor: "#717171" }}
          >
            <Text
              className="px-8 py-4"
              style={{ color: "white", fontSize: 16 }}
            >
              VOLTAR
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleGo}
            className="rounded-lg"
            style={{ backgroundColor: "#034881" }}
          >
            <Text
              className="px-8 py-4 "
              style={{ color: "white", fontSize: 16 }}
            >
              INICIAR
            </Text>
          </TouchableOpacity>
        </View>
      </Layout>
    </OrbitalBackground>
  );
};
export default AttendanceLiveTask;
