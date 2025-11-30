import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, View } from "react-native";
import Layout from "~/components/Layout";
import OrbitalBackground from "~/components/OrbitalBackground";

export const Profile: React.FC = () => {
  const { navigate } = useNavigation();

  function handleGoBack() {
    navigate("Home");
  }

  return (
    <OrbitalBackground>
      <Layout back={handleGoBack}>
        <View>
          <Text>Profile</Text>
        </View>
      </Layout>
    </OrbitalBackground>
  );
};
