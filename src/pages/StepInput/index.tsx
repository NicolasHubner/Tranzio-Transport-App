import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import Layout from "../../components/Layout";
import OrbitalBackground from "../../components/OrbitalBackground";
import {
  WheelchairByCodeQueryResponse,
  WheelchairByCodeQueryVariables,
  wheelchairByCodeQuery,
} from "../../graphql/queries/wheelchair-by-code";
import { useCreateCheckInMutation } from "../../hooks/useCreateCheckInMutation";
import { apolloClient } from "../../lib/apollo";
import { IssueOption } from "../Activity";
import { StepQrCodeProps } from "../StepQrCode";
import { styles } from "./style";

export const StepInput: React.FC = () => {
  const { params } = useRoute();
  const [vehicleCode, setVehicleCode] = useState("");
  const [createCheckin] = useCreateCheckInMutation();
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const { navigate } = useNavigation();

  async function handleCheckIn() {
    const code = vehicleCode.trim();

    if (!code) {
      return Alert.alert("Check-in", "O código é obrigatório.");
    }

    setIsCheckingIn(true);

    try {
      const { data } = await apolloClient.query<
        WheelchairByCodeQueryResponse,
        WheelchairByCodeQueryVariables
      >({
        query: wheelchairByCodeQuery,
        variables: { code },
      });

      const wheelchair = data.vehicles.data[0];

      if (!wheelchair) {
        setIsCheckingIn(false);
        return Alert.alert("Check-in", "Não foi possível encontrar a cadeira.");
      }

      const { issueId } = params as StepQrCodeProps;
      const today = new Date().toISOString();
      await createCheckin({
        variables: {
          issueId: issueId!,
          vehicleId: wheelchair.id,
          dtStart: today,
          publishedAt: today,
        },
      });
      const issueOption: IssueOption = { id: issueId, existQrCode: true };

      const issueOptions: IssueOption[] = [];
      issueOptions.push(issueOption);
      navigate("StepStartAttendance", {
        flightId,
        selectedPassengers,
        actionType,
        numberFligh,
        STA,
        issueOptionQrCode: issueOptions!,
      });
    } catch (error) {
      console.error(error);
      setIsCheckingIn(false);
      Alert.alert("Check-in", "Não foi possível fazer o check-in.");
    }
  }
  const { selectedPassengers } = params as StepQrCodeProps;
  const { flightId } = params as StepQrCodeProps;
  const { numberFligh } = params as StepQrCodeProps;
  const { STA } = params as StepQrCodeProps;
  const { actionType } = params as StepQrCodeProps;

  function handleGoBack() {
    navigate("StepStartAttendance", {
      flightId,
      selectedPassengers,
      actionType,
      numberFligh,
      STA,
    });
  }

  return (
    <OrbitalBackground>
      <Layout back={handleGoBack}>
        <View style={styles.container}>
          <View>
            <Text style={styles.title}>Check in</Text>
            <Text style={styles.text}>Faça seu check-in na cadeira</Text>
          </View>

          <View>
            <Input
              value={vehicleCode}
              onChangeText={setVehicleCode}
              onSubmitEditing={handleCheckIn}
              placeholder="Insira aqui o código da cadeira"
            />

            <Button
              title="Fazer check-in"
              isLoading={isCheckingIn}
              onPress={handleCheckIn}
            />
          </View>

          <TouchableOpacity onPress={handleGoBack} activeOpacity={0.7}>
            <Text style={styles.qrCodeText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </Layout>
    </OrbitalBackground>
  );
};
