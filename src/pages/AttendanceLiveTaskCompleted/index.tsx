import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Layout from "~/components/Layout";
import OrbitalBackground from "~/components/OrbitalBackground";
import AttendanceLiveTaskColumn from "./AttendanceLiveTaskColumn";

interface AttendanceLiveTaskCompletedProps {}

const AttendanceLiveTaskCompleted: React.FC<
  AttendanceLiveTaskCompletedProps
> = () => {
  const { navigate } = useNavigation();

  function handleBack() {
    navigate("AttendanceLive");
  }
  const data = [
    { title: "Limpar" },
    { title: "Distribuir" },
    { title: "Recolher" },
  ];

  return (
    <OrbitalBackground>
      <Layout back={handleBack}>
        <View className="flex flex-col space-y-24">
          <AttendanceLiveTaskColumn data={data} />
          <View className="flex-row justify-around ">
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
              className="rounded-lg"
              style={{ backgroundColor: "#034881" }}
            >
              <Text
                className="px-8 py-4 "
                style={{ color: "white", fontSize: 16 }}
              >
                FINALIZAR
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Layout>
    </OrbitalBackground>
  );
};

export default AttendanceLiveTaskCompleted;
