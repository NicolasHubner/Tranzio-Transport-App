import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import Layout from "../Layout";
import OrbitalBackground from "../OrbitalBackground";

interface RampOpenShiftProps {}

export const RampOpenShift: React.FC<RampOpenShiftProps> = () => {
  const { navigate, goBack } = useNavigation();

  function handleOpenShift() {
    navigate("AttendanceServiceDay");
  }

  return (
    <OrbitalBackground>
      <Layout back={goBack}>
        <View className="flex-1 justify-center p-5">
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={handleOpenShift}
            className="items-center justify-center rounded-md bg-[#034881] px-10 py-6"
          >
            <Text className="text-base font-bold uppercase text-white">
              Abrir Turno
            </Text>
          </TouchableOpacity>
        </View>
      </Layout>
    </OrbitalBackground>
  );
};
