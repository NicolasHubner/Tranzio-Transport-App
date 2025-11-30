import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import { Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Layout from "~/components/Layout";
import OrbitalBackground from "~/components/OrbitalBackground";
import { QueryFailed } from "~/components/QueryFailed";
import { Spinner } from "~/components/Spinner";
import { useFlightWarnings } from "~/hooks/useFlightWarnings";
import { useQueryPolling } from "~/hooks/useQueryPolling";

interface FlightHistoryProps {}

export const FlightHistory: React.FC<FlightHistoryProps> = () => {
  const { goBack } = useNavigation();
  const { data, loading, error, refetch, startPolling, stopPolling } =
    useFlightWarnings();
  useQueryPolling(10000, startPolling, stopPolling);

  return (
    <OrbitalBackground>
      <Layout
        back={goBack}
        headerMiddleComponent={
          <Text className="flex-1 text-center text-lg font-medium text-regal-blue">
            Histórico de voos
          </Text>
        }
      >
        <View className="mt-8 flex-1">
          {loading || loading ? (
            <Spinner />
          ) : error || !data ? (
            <QueryFailed refetch={refetch} />
          ) : (
            <FlatList
              data={data.flightWarnings.data}
              keyExtractor={attendanceLive => attendanceLive.id}
              contentContainerStyle={{
                paddingTop: 4,
                paddingBottom: 32,
                gap: 10,
                paddingHorizontal: 16,
              }}
              ListEmptyComponent={() => (
                <Text className="text-center text-sm text-gray-neutral">
                  Não há histórico de voos aqui...
                </Text>
              )}
              renderItem={({ item: flightWarning }) => {
                return (
                  <View
                    style={{ elevation: 8 }}
                    className="space-y-4 rounded-2xl bg-blue-light p-3.5"
                  >
                    <Text className="text-center text-2xl font-semibold text-regal-blue">
                      {flightWarning.attributes.flight.data.attributes.prefix}{" "}
                      {""}
                      {
                        flightWarning.attributes.flight.data.attributes
                          .description
                      }
                    </Text>

                    <View className="space-y-3">
                      <View className="flex-row space-x-2.5">
                        <MaterialIcons
                          name="description"
                          size={24}
                          color="#034881"
                        />
                        <Text className="text-base font-medium text-regal-blue">
                          Descrição: {flightWarning.attributes.description}
                        </Text>
                      </View>
                      <View className="flex-row space-x-2.5">
                        <AntDesign name="left" size={24} color="#034881" />
                        <Text className="text-base font-medium text-regal-blue">
                          Antes: {flightWarning.attributes.old}
                        </Text>
                      </View>
                      <View className="flex-row space-x-2.5">
                        <AntDesign name="right" size={24} color="#034881" />
                        <Text className="text-base font-medium text-regal-blue">
                          Depois: {flightWarning.attributes.new}
                        </Text>
                      </View>
                      <View className="flex-row space-x-2.5">
                        <MaterialCommunityIcons
                          name="clock-time-ten"
                          size={24}
                          color="#034881"
                        />
                        <Text className="text-base font-medium text-regal-blue">
                          Horário de alteração:{" "}
                          {dayjs(flightWarning.attributes.warningDate).format(
                            "DD/MM/YYYY HH:mm",
                          )}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              }}
            />
          )}
        </View>
      </Layout>
    </OrbitalBackground>
  );
};
