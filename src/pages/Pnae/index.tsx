import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import Apresentation from "~/components/Apresentation";
import DayPlanning from "~/components/DayPlanning";
import Layout from "~/components/Layout";
import OrbitalBackground from "~/components/OrbitalBackground";
import { useAuth } from "~/hooks/useAuth";
import { useFlightsIssuesQuery } from "~/hooks/useFlightsIssues";
import { useQueryPolling } from "~/hooks/useQueryPolling";
import { styles } from "../Pnae/styles";

export const Pnae: React.FC = () => {
  const { user } = useAuth();
  const id = user?.id;
  const { data, error, loading, startPolling, stopPolling, refetch } =
    useFlightsIssuesQuery(id!);

  // console.log("data", JSON.stringify(data?.flights?.data, null, 2));

  useQueryPolling(10000, startPolling, stopPolling);
  const { navigate } = useNavigation();

  function handleGoBack() {
    navigate("Home");
  }

  useFocusEffect(
    React.useCallback(() => {
      refetch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  return (
    <OrbitalBackground>
      <Layout back={handleGoBack}>
        <View style={styles.apresentation}>
          <Apresentation />
        </View>

        {loading ? (
          <View style={{ alignItems: "center" }}>
            <ActivityIndicator color="#2C5484" size={48} />
          </View>
        ) : error ? (
          <Text
            style={{
              fontWeight: "500",
              fontSize: 16,
              textAlign: "center",
              color: "#dc2626",
            }}
          >
            Ocorreu um erro inesperado.
          </Text>
        ) : !data?.flights?.data.length ? (
          <Text
            style={{
              fontWeight: "500",
              fontSize: 16,
              textAlign: "center",
              color: "#768396",
              marginBottom: 16,
              marginTop: 16,
            }}
          >
            Não há atendimentos em espera.
          </Text>
        ) : (
          <View style={{ flex: 1 }}>
            <View
              className="py-3"
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 20,
              }}
            >
              <Text style={{ color: "#2C5484" }}>Planejamento do dia</Text>
            </View>

            {/* <ScrollView
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingBottom: 24,
              }}
            >
              {data.flights.data.map(({ id, attributes }) => (
                <View key={id}>
                  <DayPlanning id={id} flights={attributes} />
                </View>
              ))}
            </ScrollView> */}

            <DayPlanning
              id={data.flights.data[0].id}
              flights={data.flights.data[0].attributes}
            />
          </View>
        )}

        <TouchableOpacity
          className="absolute bottom-0 left-0 right-0 mx-10 mb-10 items-center"
          onPress={() => navigate("NewAttendanceIssue")}
          style={{ backgroundColor: "#034881", borderRadius: 6 }}
        >
          <Text
            className="text-14 px-10 py-3"
            style={{ color: "white", fontSize: 20 }}
          >
            Novo Atendimento
          </Text>
        </TouchableOpacity>
      </Layout>
    </OrbitalBackground>
  );
};
