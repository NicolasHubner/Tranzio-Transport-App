import React from "react";
import { Text, View } from "react-native";
import Layout from "~/components/Layout";
import OrbitalBackground from "~/components/OrbitalBackground";

export const Notifications: React.FC = () => {
  return (
    <OrbitalBackground>
      <Layout>
        <View className="mt-2 px-4">
          <Text className="text-lg font-semibold text-[#034881]">
            Notificações
          </Text>

          <Text className="mt-4 text-center text-sm font-medium text-gray-neutral">
            Não há notificações...
          </Text>
        </View>
      </Layout>
    </OrbitalBackground>
  );
};
