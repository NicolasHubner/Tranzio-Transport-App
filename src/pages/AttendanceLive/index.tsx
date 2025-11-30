import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Apresentation from "~/components/Apresentation";
import AttendanceLiveRowItem from "~/components/AttendanceLiveRowItem";
import Layout from "~/components/Layout";
import OrbitalBackground from "~/components/OrbitalBackground";
import { styles } from "../Home/styles";

const AttendanceLive: React.FC = () => {
  const { navigate } = useNavigation();

  function handleBack() {
    navigate("Home");
  }

  const data = [
    {
      time: "10:00",
      flightCode: "ABC123",
      timeLanding: "11:30",
      location: "Box 140",
      aircraft: "Boing-140",
      buttonDisable: false,
    },
    {
      time: "12:30",
      flightCode: "DEF456",
      timeLanding: "14:00",
      location: "Box 110",
      aircraft: "Boing-150",
      buttonDisable: true,
    },
    {
      time: "15:00",
      flightCode: "GHI789",
      timeLanding: "16:30",
      location: "Box 103",
      aircraft: "Boing-100",
      buttonDisable: false,
    },
  ];

  return (
    <OrbitalBackground>
      <Layout back={handleBack}>
        <View style={styles.apresentation}>
          <Apresentation />
        </View>
        <View className="flex-1 px-5 py-5">
          <ScrollView>
            {data.map((item, index) => (
              <AttendanceLiveRowItem
                key={index}
                time={item.time}
                flightCode={item.flightCode}
                timeLanding={item.timeLanding}
                location={item.location}
                aircraft={item.aircraft}
                buttonDisable={item.buttonDisable}
              />
            ))}
          </ScrollView>
        </View>
      </Layout>
    </OrbitalBackground>
  );
};
export default AttendanceLive;
