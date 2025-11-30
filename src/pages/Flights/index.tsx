import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import FlightTakeOffIcon from "~/assets/icons/airplane-takeoff.svg";
import MapPinIcon from "~/assets/icons/map-pin.svg";
import Layout from "~/components/Layout";
import OrbitalBackground from "~/components/OrbitalBackground";
import { QueryFailed } from "~/components/QueryFailed";
import { Spinner } from "~/components/Spinner";
import { useAuth } from "~/hooks/useAuth";
import { useFlightsListQuery } from "~/hooks/useFlightsList";
import { useQueryPolling } from "~/hooks/useQueryPolling";

export interface ActivitiesStartParams {
  id: string;
}

export const Flights: React.FC = () => {
  const { goBack } = useNavigation();
  const { user } = useAuth();
  const { data, loading, error, refetch, startPolling, stopPolling } =
    useFlightsListQuery({
      variables: {
        userId: user?.id,
      },
    });

  useQueryPolling(10000, startPolling, stopPolling);

  return (
    <OrbitalBackground>
      <Layout
        back={goBack}
        headerMiddleComponent={
          <Text className="flex-1 text-center text-lg font-medium text-regal-blue">
            Detalhes dos voos
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
              data={data.flights.data}
              keyExtractor={attendanceLive => attendanceLive.id}
              contentContainerStyle={{
                paddingTop: 4,
                paddingBottom: 32,
                gap: 10,
                paddingHorizontal: 16,
              }}
              ListEmptyComponent={() => (
                <Text className="text-center text-sm text-gray-neutral">
                  Não há voos aqui...
                </Text>
              )}
              renderItem={({ item: flight }) => {
                return (
                  <View
                    style={{ elevation: 8 }}
                    className=" space-y-4 rounded-2xl bg-blue-light p-3.5"
                  >
                    <Text className="text-center text-2xl font-semibold text-regal-blue">
                      {flight.attributes.prefix} {flight.attributes.description}
                    </Text>

                    <View className="space-y-2">
                      <View className="flex-row space-x-2.5">
                        <FlightTakeOffIcon width={24} height={24} />

                        <Text className="text-base font-medium text-regal-blue">
                          STD: {flight.attributes.STD.substring(0, 5)}
                        </Text>
                      </View>
                      <View className="flex-row space-x-2.5">
                        <MaterialCommunityIcons
                          name="airplane-settings"
                          size={24}
                          color="#034881"
                        />

                        <Text className="text-base font-medium text-regal-blue">
                          Origem: {flight.attributes.flightOrigin}
                        </Text>
                      </View>
                      <View className="flex-row space-x-2.5">
                        <MaterialCommunityIcons
                          name="airplane-marker"
                          size={24}
                          color="#034881"
                        />

                        <Text className="text-base font-medium text-regal-blue">
                          Destino: {flight.attributes.flightDestiny}
                        </Text>
                      </View>
                      <View className="flex-row space-x-2.5">
                        <MapPinIcon width={24} height={24} />

                        <Text className="text-base font-medium text-regal-blue">
                          Box {flight.attributes.BOX}
                        </Text>
                      </View>

                      {flight.attributes.actionType === "Departure" ? (
                        <View className="flex-row space-x-2.5">
                          <MaterialCommunityIcons
                            name="airplane-clock"
                            size={24}
                            color="#034881"
                          />
                          <Text className="text-base font-medium text-regal-blue">
                            ETD: {flight.attributes.ETD?.slice(0, 5) ?? "-"}
                          </Text>
                        </View>
                      ) : (
                        <View className="flex-row space-x-2.5">
                          <MaterialCommunityIcons
                            name="airplane-clock"
                            size={24}
                            color="#034881"
                          />
                          <Text className="text-base font-medium text-regal-blue">
                            ETA: {flight.attributes.ETA?.slice(0, 5) ?? "-"}
                          </Text>
                        </View>
                      )}

                      <View className="flex-row space-x-2.5">
                        <MaterialIcons
                          name="local-airport"
                          size={24}
                          color="#034881"
                        />

                        <Text className="text-base font-medium text-regal-blue">
                          {flight.attributes.aircraft.data.attributes.name}
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
