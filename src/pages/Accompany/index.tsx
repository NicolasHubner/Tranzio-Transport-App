import { useNavigation, useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import React from "react";
import { Text, View } from "react-native";
import { CardAccompany } from "~/components/CardsAccompany";
import Layout from "~/components/Layout";
import OrbitalBackground from "~/components/OrbitalBackground";
import type { MaterialRequestStatus } from "~/types/MaterialRequest";

export const Accompany: React.FC = () => {
  const { navigate } = useNavigation();
  const formattedDate = dayjs().format("DD/MM/YYYY");

  function handleGoBack() {
    navigate("HandleGse");
  }

  const route = useRoute();
  const { status } = route.params as { status: MaterialRequestStatus };

  return (
    <OrbitalBackground>
      <Layout back={handleGoBack}>
        <View className="flex flex-1 flex-col pt-2">
          <View className="mb-3.5 flex flex-row justify-around px-5">
            <Text className="text-sm text-[#2C5484]">Base: GRU</Text>

            <Text className="px-5 text-sm text-[#2C5484]">
              Hoje: {formattedDate}
            </Text>
          </View>

          <CardAccompany status={status} />
        </View>
      </Layout>
    </OrbitalBackground>
  );
};
