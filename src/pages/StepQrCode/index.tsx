import { useNavigation, useRoute } from "@react-navigation/native";
import { BarCodeEvent, BarCodeScanner } from "expo-barcode-scanner";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "../../components/Button";
import Layout from "../../components/Layout";
import OrbitalBackground from "../../components/OrbitalBackground";
import {
  WheelchairByCodeQueryResponse,
  WheelchairByCodeQueryVariables,
  wheelchairByCodeQuery,
} from "../../graphql/queries/wheelchair-by-code";
import { useCreateCheckInMutation } from "../../hooks/useCreateCheckInMutation";
import { apolloClient } from "../../lib/apollo";
import { IssueOption, PassengerOption } from "../Activity";
import { styles } from "./style";

export interface StepQrCodeProps {
  issueId: string;
  selectedPassengers: PassengerOption[];
  flightId: string;
  numberFligh?: string;
  ETD?: string;
  STA?: string;
  actionType?: string;
}

export const StepQrCode: React.FC = ({}) => {
  const { params } = useRoute();
  const [scanned, setScanned] = useState(false);
  const [createCheckin] = useCreateCheckInMutation();
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const { navigate } = useNavigation();

  const askForPermission = useCallback(async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === "granted");
  }, []);

  useEffect(() => {
    askForPermission();
  }, [askForPermission]);

  const { issueId } = params as StepQrCodeProps;
  const { selectedPassengers } = params as StepQrCodeProps;
  const { flightId } = params as StepQrCodeProps;
  const { numberFligh } = params as StepQrCodeProps;
  const { STA } = params as StepQrCodeProps;
  const { actionType } = params as StepQrCodeProps;

  async function handleBarCodeScanned({ type, data: code }: BarCodeEvent) {
    setScanned(true);

    if (type !== BarCodeScanner.Constants.BarCodeType.qr) {
      return Alert.alert("Scan", "Formato inválido.");
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
        issueOptionQrCode: issueOptions,
      });
    } catch (error) {
      console.error(error);
      setIsCheckingIn(false);
      Alert.alert("Check-in", "Não foi possível fazer o check-in.");
    }
  }

  function handleGoToStart() {
    navigate("StepInput", {
      issueId,
      flightId,
      selectedPassengers,
      actionType,
      numberFligh,
      STA,
    });
  }
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
        <ScrollView contentContainerStyle={styles.container}>
          <View>
            <Text style={{ ...styles.text, ...styles.title }}>Check in</Text>
            <Text style={styles.text}>Faça seu check-in na cadeira</Text>
          </View>

          <View
            style={{
              marginTop: 40,
            }}
          >
            <Text style={{ ...styles.text, ...styles.title }}>
              Aproxime sua câmera{"\n"}
              do QR Code:
            </Text>
          </View>

          <View
            style={{
              marginTop: 40,
            }}
          >
            {hasPermission === null ? (
              <ActivityIndicator size={40} color="#2C5484" />
            ) : hasPermission ? (
              <View>
                <View style={[styles.box, { marginBottom: 16 }]}>
                  <BarCodeScanner
                    style={StyleSheet.absoluteFillObject}
                    onBarCodeScanned={
                      scanned ? undefined : handleBarCodeScanned
                    }
                  />
                </View>

                <Button
                  isLoading={isCheckingIn}
                  title="Escanear novamente"
                  onPress={() => setScanned(false)}
                />
              </View>
            ) : (
              <Button onPress={askForPermission} title="Permitir câmera" />
            )}

            <Button
              isLoading={isCheckingIn}
              title="Insira o código"
              onPress={handleGoToStart}
            />
            <TouchableOpacity
              onPress={handleGoBack}
              style={{ marginTop: 40, marginBottom: 40 }}
            >
              <Text style={styles.text}>Está com problema?</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Layout>
    </OrbitalBackground>
  );
};
