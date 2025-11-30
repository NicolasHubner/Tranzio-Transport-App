import { useNavigation } from "@react-navigation/native";
import Layout from "~/components/Layout";
import OrbitalBackground from "~/components/OrbitalBackground";
import RequesterSimple from "./RequesterSimple";
import { Alert, Modal, Text, View } from "react-native";

export const Requester: React.FC = () => {
  const { navigate } = useNavigation();



  function handleGoBack() {
    Alert.alert(
      "Atenção!",
      "Você perderá todos os dados já preenchidos, deseja continuar?",
      [
        {
          text: "Cancelar",
          onPress: () => {},
        },
        {
          text: "Continuar",
          onPress: () => {
            navigate("HandleGse");
          },
        },
      ],
    );
  }

  return (
    <OrbitalBackground>
      <Layout back={handleGoBack}>
        <RequesterSimple />
      </Layout>
    </OrbitalBackground>
  );
};
