import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Apresentation from "~/components/Apresentation";
import Layout from "~/components/Layout";
import OrbitalBackground from "~/components/OrbitalBackground";
import { useAuth } from "~/hooks/useAuth";
import { MaterialRequestStatus } from "~/types/MaterialRequest";

export const HandleGse: React.FC = () => {
  const { user } = useAuth();
  const { navigate } = useNavigation();

  const role = user?.role?.name;

  function handleGoBack() {
    navigate("Home");
  }

  function handleGoResquester() {
    navigate("Requester");
  }

  function handleGoAccompany(status: MaterialRequestStatus | "operator") {
    navigate("Accompany", { status });
  }

  const shouldShowAccompanyButtons =
    role === "GLOBALDYNE" ||
    role === "Authenticated" ||
    role === "ALMOXARIFADO" ||
    role === "GSE_ADMIN";

  return (
    <OrbitalBackground>
      <Layout back={handleGoBack}>
        <ScrollView>
          <View className="px-5">
            <View>
              <Apresentation />
            </View>
            <View className="flex-1 pt-10">
              {
                // role !== "Authenticated"  &&
                role === "GLOBALDYNE" || role !== "ALMOXARIFADO" ? (
                  <TouchableOpacity
                    onPress={() => handleGoAccompany("operator")}
                  >
                    <View className="mb-8 h-32 justify-center rounded-md bg-regal-blue">
                      <Text className="text-14 text-center text-white">
                        ACOMPANHAR
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : null
              }

              {
                // role !== "Authenticated"  &&
                // role !== "Almoxarifado"
                // &&
                role === "GLOBALDYNE" || role !== "ALMOXARIFADO" ? (
                  <TouchableOpacity onPress={handleGoResquester}>
                    <View className="mb-8 h-32 justify-center rounded-md bg-regal-blue">
                      <Text className="text-14 text-center text-white">
                        REQUISITAR
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : null
              }

              {shouldShowAccompanyButtons ? (
                <TouchableOpacity
                  onPress={() => handleGoAccompany("delivered")}
                >
                  <View className="mb-8 h-32 justify-center rounded-md bg-regal-blue">
                    <Text className="text-14 text-center text-white">
                      REQUISIÇÕES ATENDIDAS
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : null}

              {shouldShowAccompanyButtons ? (
                <TouchableOpacity onPress={() => handleGoAccompany("serviced")}>
                  <View className="mb-8 h-32 justify-center rounded-md bg-regal-blue">
                    <Text className="text-14 text-center text-white">
                      REQUISIÇÕES EM ABERTO
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : null}

              {shouldShowAccompanyButtons ? (
                <TouchableOpacity onPress={() => handleGoAccompany("pending")}>
                  <View className="mb-8 h-32 justify-center rounded-md bg-regal-blue">
                    <Text className="text-14 text-center text-white">
                      REQUISIÇÕES PENDENTES
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : null}

              {shouldShowAccompanyButtons ? (
                <TouchableOpacity onPress={() => handleGoAccompany("rejected")}>
                  <View className="mb-8 h-32 justify-center rounded-md bg-regal-blue">
                    <Text className="text-14 text-center text-white">
                      REQUISIÇÕES REJEITADAS
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </ScrollView>
      </Layout>
    </OrbitalBackground>
  );
};
