import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, Text, View } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import Apresentation from "~/components/Apresentation";
import Layout from "~/components/Layout";
import OrbitalBackground from "~/components/OrbitalBackground";
import { sortIcon } from "~/images";
import { styles } from "./styles";

export const History: React.FC = () => {
  const { navigate } = useNavigation();

  function handleGoBack() {
    navigate("Home");
  }

  return (
    <OrbitalBackground>
      <Layout back={handleGoBack}>
        <View style={styles.apresentation}>
          <Apresentation />
        </View>
        <View style={styles.search}>
          <TextInput
            placeholderTextColor="#2C5484"
            placeholder="Procurar vôo"
            style={styles.input}
          />
        </View>
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: "4%",
              marginTop: 10,
            }}
          >
            <Text style={{ color: "#2C5484" }}>Horário</Text>
            <Text style={{ color: "#2C5484" }}>Planejamento do dia</Text>
            <Text>
              <Image source={sortIcon} style={{ height: 20, width: 20 }} />
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
              paddingHorizontal: "4%",
            }}
          >
            <View>
              <Text style={{ textAlign: "right" }}>12:30</Text>
            </View>
            <View style={{ maxHeight: "84%" }}>
              <ScrollView>
                {/* {calendarData.map(({ day }) => (
                  <DayPlanning key={day} />
                ))} */}
              </ScrollView>
            </View>
          </View>
        </View>
      </Layout>
    </OrbitalBackground>
  );
};
