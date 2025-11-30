import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import CaretRightIcon from "~/assets/icons/caret-right.svg";
import WarningIcon from "~/assets/icons/warning.svg";
import Avatar from "~/components/Avatar";
import Layout from "~/components/Layout";
import OrbitalBackground from "~/components/OrbitalBackground";
import { useAuth } from "~/hooks/useAuth";

interface ActivitiesHistoryHomeProps {}

export const ActivitiesHistoryHome: React.FC<
  ActivitiesHistoryHomeProps
> = () => {
  const { user } = useAuth();
  const { goBack } = useNavigation();

  if (!user) {
    return null;
  }

  return (
    <OrbitalBackground>
      <Layout back={goBack}>
        <View className="flex-1 items-center px-6">
          <Avatar size={104} user={user} />

          <View
            className="mx-auto w-full max-w-[294px] border bg-regal-blue px-2.5 py-2"
            style={{
              marginTop: 18,
              borderRadius: 10,
              borderColor: "#5C5C5C",
            }}
          >
            <Text className="text-sm font-light text-white">Nome</Text>
            <Text className="text-lg font-medium text-white">{user?.name}</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.6}
            style={{ borderRadius: 10 }}
            className="mt-7 w-full flex-row items-center space-x-3 bg-white px-2.5 py-3.5"
          >
            <WarningIcon width={24} height={24} />

            <TouchableOpacity activeOpacity={0.6} className="flex-1">
              <Text className="text-lg font-medium text-regal-blue">
                Histórico
              </Text>

              <Text className="text-sm font-normal text-regal-blue">
                Histórico de atividades
              </Text>
            </TouchableOpacity>

            <CaretRightIcon width={20} height={20} />
          </TouchableOpacity>
        </View>
      </Layout>
    </OrbitalBackground>
  );
};
