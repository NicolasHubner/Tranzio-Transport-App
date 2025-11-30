import { useNavigation, useRoute } from "@react-navigation/native";
import { Text, View } from "react-native";
import { CardFlightStatus } from "~/components/CardFlightStatus";
import Layout from "~/components/Layout";
import OrbitalBackground from "~/components/OrbitalBackground";
import { QueryFailed } from "~/components/QueryFailed";
import { Spinner } from "~/components/Spinner";
import { useFlightStatusQuery } from "~/hooks/useFlightStatus";

export interface FlightStatusParams {
  id: string;
}

export const FlightStatus: React.FC = () => {
  const { params } = useRoute();
  const { id } = params as FlightStatusParams;
  const { goBack } = useNavigation();
  const { data, loading, error, refetch } = useFlightStatusQuery({
    variables: {
      id,
    },
  });

  return (
    <OrbitalBackground>
      <Layout back={goBack}>
        <View className="px-4">
          <Text className="text-lg font-medium text-regal-blue">
            Status do voo
          </Text>

          <View className="mt-4">
            {loading ? (
              <View className="items-center">
                <Spinner size={40} />
              </View>
            ) : error || !data ? (
              <QueryFailed refetch={refetch} />
            ) : (
              <CardFlightStatus
                ETA={data.flight.data.attributes.ETA}
                ETD={data.flight.data.attributes.ETD}
                STA={data.flight.data.attributes.STA}
                STD={data.flight.data.attributes.STD}
                location={data.flight.data.attributes.BOX}
                prefix={data.flight.data.attributes.prefix}
                origin={data.flight.data.attributes.flightOrigin}
                destiny={data.flight.data.attributes.flightDestiny}
                flightDate={data.flight.data.attributes.flightDate}
                actionType={data.flight.data.attributes.actionType}
                flightNumber={data.flight.data.attributes.flightNumber}
                isInternational={data.flight.data.attributes.isInternational}
              />
            )}
          </View>
        </View>
      </Layout>
    </OrbitalBackground>
  );
};
