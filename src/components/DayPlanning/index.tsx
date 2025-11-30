import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useMemo } from "react";
import { Alert, Image, Text, View } from "react-native";
import { useAuth } from "~/hooks/useAuth";
import { useIssuesNotDtStartQuery } from "~/hooks/useIssuesNotDtStartQuery ";
import { useQueryPolling } from "~/hooks/useQueryPolling";
import { PassengerOption } from "~/pages/Activity";
import { airline, landIcon } from "../../images";
import { StartButton } from "../StartButton";

interface DayPlanningProps {
  id: string;
  flights: {
    flightNumber: string;
    ETD: string;
    STA: string;
    ETA: string;
    STD: string;
    actionType: string;
    gate: string;
    description: string;
    route: string;
    BOX: string;
    issues: {
      data: {
        id: string;
      };
    };
    workers: {
      data: {
        id: string;
        attributes: {
          name: string;
        };
      };
    };
    airline: {
      data: {
        id: string;
        attributes: {
          name: string;
        };
      };
    };
  };
}

const DayPlanning: React.FC<DayPlanningProps> = ({ flights, id }) => {
  const { navigate } = useNavigation();
  const { user } = useAuth();

  function handleStartIssue() {
    navigate("Activity", {
      flightId: id,
      numberFligh: flights.flightNumber.toString(),
      actionType: flights.actionType,
      STA: flights.STA,
      ETD: flights.ETD,
    });
  }

  const selectedPassenger: PassengerOption[] = [];

  const {
    data: issueStatus,
    refetch: refetchIssueStatus,
    startPolling,
    stopPolling,
  } = useIssuesNotDtStartQuery({
    fetchPolicy: "no-cache",
    variables: {
      status: "in_attendance",
      flightId: id,
      userId: user?.id,
    },
  });

  useQueryPolling(10000, startPolling, stopPolling);

  // // Trying to fix when open this page and the issueStatus differs from the actual status
  useFocusEffect(
    useCallback(() => {
      refetchIssueStatus();
    }, [refetchIssueStatus]),
  );

  const idMap: Record<string, boolean> = {};

  function handleStartedIssue() {
    if (issueStatus && issueStatus.issues?.data?.length >= 0) {
      issueStatus.issues.data.forEach(issue => {
        const id = issue.id;
        if (!idMap[id]) {
          selectedPassenger.push({
            id: issue.id,
            idIssue: issue.id,
            issuePassenger:
              issue.attributes.issuePassengers?.data[0]?.attributes
                ?.serviceType,
            title: issue.attributes.passengerName || "", // Provide a default value if passengerName is undefined
          });
          idMap[id] = true;
        }
      });
    } else {
      Alert.alert("Criação de atendimento", "Erro na Criação do passageiro");
      return; // Exit the function early if there's an issue
    }

    navigate("StepCloseAttendance", {
      flightId: id,
      actionType: flights.actionType,
      ETD: flights.ETD,
      numberFligh: flights.flightNumber,
      selectedPassengers: selectedPassenger,
    });
  }

  const typeFlight = flights.actionType === "Arrival" ? "Chegada" : "Saida";

  const issueStatusLength = useMemo(
    () => issueStatus?.issues?.data?.length,
    [issueStatus],
  );

  const gateOrBox = useMemo(() => {
    if (flights.gate) {
      return `Portão ${flights.gate}`;
    }

    if (flights.BOX) {
      return `Box ${flights.BOX}`;
    }

    return "Não informado";
  }, [flights.gate, flights.BOX]);

  return (
    <View
      style={{
        paddingVertical: 12,
        flex: 1,
        marginHorizontal: 12,
      }}
    >
      <View
        style={{
          justifyContent: "space-around",
          backgroundColor: "#F2F9FF",
          width: "100%",
          borderRadius: 16,
          padding: 12,
        }}
      >
        <Text style={{ fontSize: 16, color: "#2C5484", fontWeight: "600" }}>
          VÔO {flights.description}
        </Text>

        {flights.ETA && flights.ETD && (
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Image source={landIcon} style={{ height: 16, width: 16 }} />

            <Text style={{ marginLeft: 4, color: "#2C5484" }}>
              {typeFlight === "Chegada" ? "ETA" : "ETD"}{" "}
              {typeFlight === "Chegada"
                ? flights.ETA.substring(0, 5) ?? flights.STA.substring(0, 5)
                : flights.ETD.substring(0, 5) ?? flights.STD.substring(0, 5)}
            </Text>
          </View>
        )}

        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <Image source={landIcon} style={{ height: 16, width: 16 }} />

          <Text style={{ marginLeft: 4, color: "#2C5484" }}>
            {typeFlight === "Chegada" ? "STA" : "STD"}{" "}
            {typeFlight === "Chegada"
              ? flights.STA.substring(0, 5)
              : flights.STD.substring(0, 5)}
          </Text>
        </View>

        <View style={{ flexDirection: "row", marginTop: 10 }}>
          {/* <Image source={landIcon} style={{ height: 16, width: 16 }} /> */}

          <Text style={{ marginLeft: 4, color: "#2C5484" }}>{gateOrBox}</Text>
        </View>

        <View style={{ flexDirection: "row", marginTop: 10 }}>
          {/* <Image source={landIcon} style={{ height: 16, width: 16 }} /> */}

          <Text style={{ marginLeft: 4, color: "#2C5484" }}>
            Rota: {flights.route}
          </Text>
        </View>

        <View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Image
              source={airline}
              style={{ tintColor: "#2C5484", height: 16, width: 16 }}
            />

            <Text style={{ marginLeft: 4, color: "#2C5484" }}>
              {"Tipo de Voo: " +
                (flights.actionType === "Arrival"
                  ? "Chegada"
                  : flights.actionType !== null
                  ? "Saida"
                  : "Não informado!")}
            </Text>
          </View>

          <View style={{ marginTop: 12 }}>
            <StartButton
              title={issueStatusLength == 0 ? "Visualizar" : "Em andamento"}
              onPress={
                issueStatusLength == 0 ? handleStartIssue : handleStartedIssue
              }
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default DayPlanning;
