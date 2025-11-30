import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  StartIssueMutationResponse,
  StartIssueMutationVariables,
  startIssueMutation,
} from "~/graphql/mutations/start-issue";
import {
  IssuesQueryFormatedResponse,
  IssuesQueryVariables,
  issuesQuery,
} from "~/graphql/queries/issues";
import { useAuth } from "~/hooks/useAuth";
import { useFlightQuery } from "~/hooks/useFlightQuery";
import { useIssuesNotDtStartQuery } from "~/hooks/useIssuesNotDtStartQuery ";
import { useQueryPolling } from "~/hooks/useQueryPolling";
import { apolloClient } from "~/lib/apollo";
import { UpdateStatusUserLocation } from "~/utils/LocationTracker";
import { Button } from "../../components/Button";
import Layout from "../../components/Layout";
import OrbitalBackground from "../../components/OrbitalBackground";
import { arriveIcon, chairIcon, planeIcon } from "../../images";
import { ActivityParams } from "../Activity";
import { pnaeTask, shiftTask } from "../Activity/SendLocation/BackGroundTask";
import { Timer } from "./Timer";
import { styles } from "./style";

//tela com cronometro e os passageiros selecionados

export interface IParseLocation {
  nameUser: string;
  idPassengers: string[];
  idUser: string;
}

export const StepStartAttendance: React.FC = ({}) => {
  const { params } = useRoute();

  const {
    selectedPassengers,
    flightId,
    numberFligh,
    actionType,
    issueOptionQrCode,
  } = params as ActivityParams;

  const [show, setShow] = useState(false);
  const { navigate } = useNavigation();
  // const [start] = useState(false);
  const [status, setStatus] = useState("");

  const { user: loggedUser } = useAuth();
  const loggedUserId = loggedUser?.id;

  const {
    data,
    startPolling: startPollingFlight,
    stopPolling: stopPollingFlight,
  } = useFlightQuery(flightId);

  useQueryPolling(10000, startPollingFlight, stopPollingFlight);
  const [isStartingLoading, setIsStartingLoading] = useState(false);

  const {
    data: issueStatus,
    refetch: refetchIssueStatus,
    startPolling,
    stopPolling,
  } = useIssuesNotDtStartQuery({
    fetchPolicy: "cache-and-network",
    variables: {
      status: "in_attendance",
      flightId: flightId,
      userId: loggedUserId,
    },
  });

  const issue = useMemo(() => {
    if (!data) {
      return null;
    }
    return data.flight.data;
  }, [data]);

  // const HandleGoBack = () =>
  //   useCallback(() => {
  //     navigate("Pnae");
  //   }, []);

  function HandleGoBack() {}

  // const idMap: Record<string, boolean> = {};

  function handleStepQrCode(id: string) {
    navigate("StepQrCode", {
      issueId: id,
      flightId,
      selectedPassengers: selectedPassengers!,
      actionType,
      numberFligh,
      STA: issue?.attributes.STA,
    });
  }

  useQueryPolling(10000, startPolling, stopPolling);

  useFocusEffect(
    useCallback(() => {
      refetchIssueStatus();
    }, [refetchIssueStatus]),
  );

  // async function showModal() {
  //   for (const passenger of selectedPassengers!) {
  //     try {
  //       const issueData = await apolloClient.mutate<
  //         IssuesQueryFormatedResponse,
  //         IssuesQueryVariables
  //       >({
  //         mutation: issuesQuery,
  //         variables: {
  //           idIssue: passenger.idIssue,
  //         },
  //       });
  //       setStatus(
  //         issueData.data?.issues.data[0].attributes.status || "pending",
  //       );

  //       console.log(
  //         passenger,
  //         issueData.data?.issues.data[0].attributes.status,
  //       );
  //       setShow(true);
  //       if (status == "in_attendance") {
  //       } else {
  //         // handleStartIssue();
  //       }
  //     } catch (error) {
  //       console.error("Errossss: ", error);
  //     }
  //   }
  //   // When start the PNAE task, the shift task is stopped
  //   if (selectedPassengers && selectedPassengers.length > 0) {
  //     const idPassengers = selectedPassengers!.map(
  //       passenger => passenger.idIssue,
  //     );
  //     const objectLocationSend: IParseLocation = {
  //       idPassengers: idPassengers,
  //       idUser: loggedUserId?.toString() || "",
  //       nameUser: loggedUser?.name || "",
  //     };

  //     await AsyncStorage.setItem(
  //       "@Cfs:Location",
  //       JSON.stringify(objectLocationSend),
  //     );

  //     await shiftTask.stopLocationTracking();
  //     await pnaeTask.startLocationTracking();

  //     // ----------------------------------------//
  //   }
  // }

  const consultingPassangersStatus = useCallback(async () => {
    const isAttendeSomePassenger = Promise.all(
      selectedPassengers!.map(async passenger => {
        try {
          const issueData = await apolloClient.mutate<
            IssuesQueryFormatedResponse,
            IssuesQueryVariables
          >({
            mutation: issuesQuery,
            variables: {
              idIssue: passenger.idIssue,
            },
          });
          return {
            status: issueData.data?.issues.data[0].attributes.status || "",
            name: issueData.data?.issues.data[0].attributes.passengerName || "",
          };
        } catch (error) {
          console.error("Error consulting status passanger: ", error);
        }
      }),
    );

    const isAttended = (await isAttendeSomePassenger).filter(
      status => status?.status === "in_attendance",
    );

    if (isAttended.length > 0) {
      const passengers = isAttended
        .map(passenger => passenger?.name)
        .join(", ");
      Alert.alert(
        `Passageiro(s) em Atendimento`,
        `O(s) passageiro(s) ${passengers.slice(
          0,
          20,
        )} já está(ão) em atendimento.`,
      );
      return;
    }
  }, [selectedPassengers]);

  async function handleStartIssue() {
    setIsStartingLoading(true);

    try {
      await UpdateStatusUserLocation(loggedUserId?.toString() || "", true);

      await consultingPassangersStatus();

      issueStatus?.issues.data.map(issue => {
        // if (!idMap[id]) {
        selectedPassengers?.push({
          id: issue.id,
          idIssue: issue.id,
          issuePassenger:
            issue.attributes.issuePassengers.data[0]?.attributes?.serviceType ||
            "",
          title: issue.attributes.passengerName! || "",
          destiny: issue.attributes.issueDestiny || " ",
          origin: issue.attributes.issueOrigin || " ",
          route: issue.attributes.route || "",
        });
        //   idMap[id] = true;
        // }
      });

      await Promise.all(
        selectedPassengers!.map(async passenger => {
          try {
            await apolloClient.mutate<
              StartIssueMutationResponse,
              StartIssueMutationVariables
            >({
              mutation: startIssueMutation,
              variables: {
                id: passenger.idIssue,
                status: "in_attendance",
                dtStart: new Date().toISOString(),
                workerId: loggedUserId || "",
              },
            });
            console.log("Passageiro iniciado com sucesso");
          } catch (error) {
            console.error("Error: ", error);
            // You may choose to handle the error here or throw it again if needed.
            throw error;
          }
        }),
      );

      if (selectedPassengers && selectedPassengers.length > 0) {
        const idPassengers = selectedPassengers!.map(
          passenger => passenger.idIssue,
        );
        const objectLocationSend: IParseLocation = {
          idPassengers: idPassengers,
          idUser: loggedUserId?.toString() || "",
          nameUser: loggedUser?.name || "",
        };

        await AsyncStorage.setItem(
          "@Cfs:Location",
          JSON.stringify(objectLocationSend),
        );

        await shiftTask.stopLocationTracking();
        await pnaeTask.startLocationTracking();
      }

      navigate("StepCloseAttendance", {
        flightId,
        selectedPassengers,
        actionType,
        numberFligh,
        STA: issue?.attributes.STA,
      });
    } catch (error: any) {
      Alert.alert("Erro no atendimento", error.message);
    } finally {
      setIsStartingLoading(false);
    }
  }

  async function handleUpdateNotAttended() {
    // When the user is not attended, we need to stop the location tracking and initialize the shift tracking
    await pnaeTask.stopLocationTracking();
    await shiftTask.startLocationTracking();
    AsyncStorage.removeItem("@Cfs:Location");

    console.log("passou aqui handleUpdateNotAttended");
    navigate("Pnae");
  }

  const timeToShow = useMemo(() => {
    const time =
      actionType === "Arrival"
        ? issue?.attributes.ETA ?? issue?.attributes.STA
        : issue?.attributes.ETD ?? issue?.attributes.STD;

    return time?.split(":").slice(0, 2).join(":");
  }, [issue, actionType]);
  return (
    <OrbitalBackground>
      <Layout back={HandleGoBack}>
        <ScrollView>
          <View
            className="mx-3 flex  flex-col space-y-5"
            style={styles.container}
          >
            <View>
              {issue && (
                <Timer
                  sta={issue.attributes.STA}
                  std={issue.attributes.STD}
                  etd={issue.attributes.ETD}
                  eta={issue.attributes.ETA}
                  actionType={actionType}
                />
              )}
            </View>

            <View className="flex flex-col ">
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={planeIcon}
                  style={{ width: 16, height: 16, marginRight: 6 }}
                />

                <Text style={{ color: "#034881", paddingVertical: 4 }}>
                  Nº Voo: {numberFligh}
                </Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={arriveIcon}
                  style={{ width: 16, height: 16, marginRight: 6 }}
                />

                <Text style={{ color: "#034881", paddingVertical: 4 }}>
                  Tipo de Voo: {actionType === "Arrival" ? "Chegada" : "Saída"}
                </Text>
              </View>
              <Text style={{ color: "#034881", paddingVertical: 4 }}>
                {actionType === "Arrival" ? "ETA" ?? "STA" : "ETD" ?? "STD"}
                {": "}
                {timeToShow}
              </Text>
            </View>

            {selectedPassengers!.map(passenger => {
              const foundIssueOption = issueOptionQrCode?.find(
                issueOption => issueOption.id === passenger.idIssue,
              );
              return (
                <View
                  key={passenger.id}
                  style={{
                    borderRadius: 12,
                    // borderWidth: 1,
                    // borderColor: "darkgray",
                    padding: 10,
                    marginVertical: 5,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    maxWidth: 400,
                    width: "100%",
                    alignSelf: "center",
                    backgroundColor: "white",
                    shadowOffset: { width: 0, height: 2 },
                    shadowColor: "rgba(0, 0, 0, 0.678)",
                    shadowOpacity: 1,
                    shadowRadius: 2,
                    elevation: 3,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "#034881",
                      }}
                    >
                      {passenger.title}
                    </Text>

                    <Text style={{ color: "#034881", paddingTop: 10 }}>
                      Serviço:{" "}
                      {passenger.issuePassenger == undefined
                        ? "Não informado!"
                        : passenger.issuePassenger}
                    </Text>
                    <Text style={{ color: "#034881" }}>
                      Rota:{" "}
                      {passenger.route == undefined
                        ? "Não informado!"
                        : passenger.route == "Connection"
                        ? "Conexão"
                        : "Local"}
                    </Text>
                    <Text style={{ color: "#034881" }}>
                      Origem:{" "}
                      {passenger.origin == undefined
                        ? "Não informado!"
                        : passenger.origin}
                    </Text>
                    <Text style={{ color: "#034881" }}>
                      Destino:{" "}
                      {passenger.destiny == undefined
                        ? "Não informado!"
                        : passenger.destiny}
                    </Text>
                  </View>
                  {passenger.issuePassenger !== "WCMP" &&
                    passenger.issuePassenger !== "WCBB" &&
                    passenger.issuePassenger !== "WCPW" &&
                    passenger.issuePassenger !== "MAAS" &&
                    passenger.issuePassenger !== "TEEN" &&
                    passenger.issuePassenger !== "UMNR" &&
                    passenger.issuePassenger !== "undefined" && (
                      <TouchableOpacity
                        onPress={() => handleStepQrCode(passenger.idIssue)}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 18,
                          backgroundColor: foundIssueOption?.existQrCode
                            ? "#2ecc71"
                            : "darkgray",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Image
                          source={chairIcon}
                          style={{
                            width: 18,
                            height: 18,
                            tintColor: "white",
                          }}
                        />
                      </TouchableOpacity>
                    )}
                </View>
              );
            })}

            <View style={{ width: "80%" }}>
              <Button
                isLoading={isStartingLoading}
                title={"ATENDER"}
                disabled={isStartingLoading || selectedPassengers?.length === 0}
                onPress={handleStartIssue}
              />

              <TouchableHighlight
                onPress={handleUpdateNotAttended}
                style={{
                  marginTop: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 8,
                  paddingHorizontal: 70,
                  borderRadius: 12,
                  elevation: 3,
                  backgroundColor: "#7C7C7C",
                }}
              >
                <Text
                  className="py-2"
                  style={{
                    fontSize: 16,
                    lineHeight: 20,
                    fontWeight: "bold",
                    letterSpacing: 0.25,
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  CANCELAR
                </Text>
              </TouchableHighlight>
            </View>
            <View />

            <Modal visible={show} transparent={true}>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              >
                <View
                  style={{
                    width: "80%",
                    backgroundColor: "#F2F9FF",
                    borderRadius: 10,
                    padding: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      marginBottom: 10,
                    }}
                  >
                    O passageiro está em outro atendimento, deseja prosseguir?
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => setShow(false)}
                      style={{
                        flex: 1,
                        backgroundColor: "#7C7C7C",
                        paddingVertical: 12,
                        borderRadius: 10,
                        alignItems: "center",
                        marginRight: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        Cancelar
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleStartIssue}
                      style={{
                        flex: 1,
                        backgroundColor: "#034881",
                        paddingVertical: 12,
                        borderRadius: 10,
                        alignItems: "center",
                        marginRight: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        Atender
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </ScrollView>
      </Layout>
    </OrbitalBackground>
  );
};
