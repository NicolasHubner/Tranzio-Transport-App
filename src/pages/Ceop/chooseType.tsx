import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import { Button } from "~/components/Button";
import Layout from "~/components/Layout";
import OrbitalBackground from "~/components/OrbitalBackground";

type options = "devolucao" | "entrega";

export default function ChooseTypeCeop() {
  const { navigate } = useNavigation();

  const handleNavigate = (param: options) => {
    // @ts-ignore
    navigate("Ceop", { type: param });
  };

  function handleBack() {
    navigate("Home");
  }

  return (
    <OrbitalBackground>
      <Layout back={handleBack}>
        <View className="flex-1 items-center justify-center">
          <View className="w-full flex-1 justify-center p-5">
            <Button
              title="Retirada"
              onPress={() => handleNavigate("entrega")}
            />

            <Button
              title="Devolução"
              onPress={() => handleNavigate("devolucao")}
            />
          </View>
        </View>
      </Layout>
    </OrbitalBackground>
  );
}
