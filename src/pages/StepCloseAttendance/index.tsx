import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import Autocomplete from "react-native-autocomplete-input";
import { ScrollView } from "react-native-gesture-handler";
import Layout from "~/components/Layout";
import OrbitalBackground from "~/components/OrbitalBackground";
import {
  EndFlightIssueMutationResponse,
  EndFlightIssueMutationVariables,
  endFlightIssueMutation,
} from "~/graphql/mutations/end-flight-issue";
import {
  FlightTransferResponse,
  FlightTransferVariables,
  flightTransferMutation,
} from "~/graphql/mutations/flight-transfer";
import {
  IssueTransferResponse,
  IssueTransferVariables,
  issueTransferMutation,
} from "~/graphql/mutations/issue-transfer";
import {
  UpdateIssueDescriptionMutationResponse,
  UpdateIssueDescriptionMutationVariables,
  updateIssueDescriptionMutation,
} from "~/graphql/mutations/updateIssueDescription";
import {
  NotAttendedIssueMutationResponse,
  NotAttendedIssueMutationVariables,
  notAttendedIssueMutation,
} from "~/graphql/mutations/update_not_issue";
import { useAuth } from "~/hooks/useAuth";
import { useEndIssueMutation } from "~/hooks/useEndIssueMutation";
import { useFlightQuery } from "~/hooks/useFlightQuery";
import { useIssuesNotDtStartQuery } from "~/hooks/useIssuesNotDtStartQuery ";
import { useQueryPolling } from "~/hooks/useQueryPolling";
import { useWorkers } from "~/hooks/useWorkersQuery";
import { apolloClient } from "~/lib/apollo";
import type { ActivityParams } from "~/pages/Activity";
import { UpdateStatusUserLocation } from "~/utils/LocationTracker";
import {
  arriveIcon,
  comentIcon,
  planeIcon,
  removeIcon,
  transferIcon,
} from "../../images";
import { pnaeTask, shiftTask } from "../Activity/SendLocation/BackGroundTask";
import { Timer } from "../StepStartAttendance/Timer";
import { ModalCancel } from "./ModalCancell";
import { ModalComment } from "./ModalComment";
import { styles } from "./style";

interface Worker {
  id: string;
  attributes: {
    name: string;
  };
}

export const StepCloseAttendance: React.FC = () => {
  const { params } = useRoute();

  const { navigate } = useNavigation();

  const [endIssue] = useEndIssueMutation();

  const { flightId, numberFligh, actionType } = params as ActivityParams;

  const { data, startPolling, stopPolling } = useFlightQuery(flightId);

  const { data: workers } = useWorkers("pnae_aap", "");

  const [descriptions, setDescriptionComment] = useState("");

  const [loadingModal, setLoadingModal] = useState(false);

  const [modal, setModal] = useState(false);

  const [description, setDescription] = useState("");

  const now = new Date().toISOString();

  const [modalVisible, setModalVisible] = useState(false);

  const [comentModalVisible, setComentModalVisible] = useState(false);

  const [isCardVisible, _] = useState(false);

  const [selectedWorkerId, setSelectedWorkerId] = useState("");

  const { user: loggedUser } = useAuth();

  const loggedUserId = loggedUser?.id;

  const [isLoadingFinishedStep, setIsLoadingFinishedStep] = useState(false);

  const {
    data: issuesNotDtStartQuery,
    refetch,
    startPolling: startPollingIssue,
    stopPolling: stopPollingIssue,
  } = useIssuesNotDtStartQuery({
    variables: {
      status: "in_attendance",
      flightId,
      userId: loggedUser?.id,
    },
  });

  const handleGoBack = useCallback(() => {
    navigate("Pnae");
  }, [navigate]);

  const issue = useMemo(() => {
    if (!data) {
      return null;
    }
    return data.flight.data;
  }, [data]);
  const [searchValue, setSearchValue] = useState("");
  const filterWorks = (value: string) => {
    return workers?.usersPermissionsUsers.data.filter(worker =>
      worker.attributes.name.toLowerCase().includes(value.toLowerCase()),
    );
  };

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  // useEffect(() => {
  //   if (issuesNotDtStartQuery?.issues.data.length === 0) {
  //     // Delay for 3 seconds and then navigate
  //     const delay = 1500; // 3000 milliseconds = 3 seconds
  //     const timeout = setTimeout(() => {
  //       handleGoBack();
  //     }, delay);

  //     return () => clearTimeout(timeout); // Clean up the timer when the component unmounts
  //   }
  // }, [handleGoBack, issuesNotDtStartQuery?.issues.data.length]);

  useQueryPolling(10000, startPollingIssue, stopPollingIssue);

  useQueryPolling(10000, startPolling, stopPolling);

  const locationTrackingActions = useCallback(async () => {
    await pnaeTask.stopLocationTracking();
    await shiftTask.startLocationTracking();
  }, []);

  async function handleUnlinkAttendeFromFlight() {
    try {
      await apolloClient.mutate<
        EndFlightIssueMutationResponse,
        EndFlightIssueMutationVariables
      >({
        mutation: endFlightIssueMutation,
        variables: {
          id: flightId,
        },
      });
    } catch (error) {
      console.log("Error unlink attendence from flight", error);
    }
  }

  async function handleEndIssue() {
    setIsLoadingFinishedStep(true);
    try {
      issuesNotDtStartQuery!.issues.data.map(async passenger => {
        await endIssue({
          variables: {
            id: passenger.id,
            dtEnd: new Date().toISOString(),
          },
        });
      });

      await handleUnlinkAttendeFromFlight();
      // Stop the location tracking for the current issue and start Shift location tracking
      await locationTrackingActions();

      await UpdateStatusUserLocation(loggedUserId!, false);

      // --------------------------------------------//
    } catch (error) {
      console.error("Error StepCloseAttendence", error);
      Alert.alert(
        "Finalizar atendimento",
        "Não foi possível finalizar o atendimento.",
      );
    } finally {
      setIsLoadingFinishedStep(false);

      Alert.alert(
        "Finalizar atendimento",
        "Atendimento finalizado com sucesso.",
      );
      navigate("Pnae");
    }
  }

  const handleSelectWorker = (worker: Worker) => {
    setSelectedWorkerId(worker.id);
    setSearchValue(worker.attributes.name);
  };

  async function handleTransferMutation(id: string) {
    setLoadingModal(true);
    try {
      await apolloClient.mutate<IssueTransferResponse, IssueTransferVariables>({
        mutation: issueTransferMutation,
        variables: {
          idIssue: id,
          status: "in_attendance",
          user: [selectedWorkerId!],
        },
      });

      await apolloClient.mutate<
        FlightTransferResponse,
        FlightTransferVariables
      >({
        mutation: flightTransferMutation,
        variables: {
          idWorker: [selectedWorkerId, loggedUserId!],
          id: flightId,
        },
      });

      await refetch();

      if (issuesNotDtStartQuery?.issues.data.length === 1) {
        handleUnlinkAttendeFromFlight();

        navigate("Pnae");

        // Stop the location tracking for the current issue and start Shift location tracking
        await locationTrackingActions();

        //End the location tracking for the current issue
        await UpdateStatusUserLocation(loggedUserId!, false);
        // --------------------------------------------//
      }

      Alert.alert(
        "Transferir atendimento",
        "Atendimento transferido com sucesso.",
      );

      setModalVisible(false);
    } catch {
      Alert.alert(
        "Transferir atendimento",
        "Erro na transferencia de atendimento.",
      );
    } finally {
      setLoadingModal(false);
    }
  }

  async function handleAddComent(id: string, description: string) {
    setLoadingModal(true);
    try {
      await apolloClient.mutate<
        UpdateIssueDescriptionMutationResponse,
        UpdateIssueDescriptionMutationVariables
      >({
        mutation: updateIssueDescriptionMutation,
        variables: {
          id: id,
          evidenceDescription: description,
          dtEnd: new Date().toISOString(),
        },
      });

      Alert.alert("Finalizar atendimento", "Descrição adicionada com sucesso.");
      setComentModalVisible(false);
      setDescriptionComment("");
    } catch (error) {
      console.log("Error", error);
      Alert.alert(
        "Finalizar atendimento",
        "Não foi possivel adicionar descrição ao atendimento.",
      );
    } finally {
      setLoadingModal(false);
    }
  }

  async function handleClearItem(id: string, description: string) {
    setLoadingModal(true);
    try {
      await apolloClient.mutate<
        NotAttendedIssueMutationResponse,
        NotAttendedIssueMutationVariables
      >({
        mutation: notAttendedIssueMutation,
        variables: {
          id: id,
          dtEnd: now,
          description: description,
        },
      });
      Alert.alert("Atendimento cancelado com sucesso");
      // setClearItemCalled(true);

      setModal(false);

      if (issuesNotDtStartQuery?.issues.data.length === 1) {
        await handleUnlinkAttendeFromFlight();

        navigate("Pnae");

        // Stop the location tracking for the current issue and start Shift location tracking
        await locationTrackingActions();

        //End the location tracking for the current issue
        await UpdateStatusUserLocation(loggedUserId!, false);
        // --------------------------------------------//
      }
    } catch (error) {
      console.log("Error clear Item Attendence", error);
      Alert.alert(
        "Finalizar atendimento",
        "Não foi possível finalizar o atendimento.",
      );
    } finally {
      setLoadingModal(false);
    }
  }

  const timeToShow = useMemo(() => {
    const time =
      actionType === "Arrival"
        ? issue?.attributes.ETA ?? issue?.attributes.STA
        : issue?.attributes.ETD ?? issue?.attributes.STD;

    return time?.split(":").slice(0, 2).join(":");
  }, [issue, actionType]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      enabled
    >
      <OrbitalBackground>
        <Layout back={handleGoBack}>
          <ScrollView>
            <View
              className="mx-3 flex flex-col space-y-5"
              style={styles.container}
            >
              <View>
                {issue && (
                  <Timer
                    sta={issue.attributes.STA}
                    etd={issue.attributes.ETD}
                    std={issue.attributes.STD}
                    eta={issue.attributes.ETA}
                    actionType={actionType}
                  />
                )}
              </View>

              <View className="flex flex-col">
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
                    Tipo de voo:{" "}
                    {actionType === "Arrival" ? "Chegada" : "Saída"}
                  </Text>
                </View>
                <Text style={{ color: "#034881", paddingVertical: 4 }}>
                  {actionType === "Arrival" ? "ETA" ?? "STA" : "ETD" ?? "STD"}
                  {": "}
                  {timeToShow}
                </Text>
              </View>

              <View>
                {issuesNotDtStartQuery?.issues.data!.map(passenger => (
                  <View
                    key={passenger.id}
                    style={{
                      borderRadius: 10,
                      // borderWidth: 1,
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      elevation: 5,
                      width: "100%",
                      // borderColor: "darkgray",
                      padding: 10,
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "white",
                      marginBottom: 8,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        width: "80%",
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "column",
                          paddingHorizontal: 10,
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
                            {passenger.attributes.passengerName ||
                              "Não informado!"}
                          </Text>
                          <Text style={{ color: "#034881" }}>
                            {passenger.attributes.serviceTypes}
                          </Text>
                        </View>
                        <Text style={{ color: "#034881" }}>
                          Rota:{" "}
                          {passenger.attributes.route == undefined
                            ? "Não informado!"
                            : passenger.attributes.route == "Connection"
                            ? "Conexão"
                            : "Local"}
                        </Text>
                        <Text style={{ color: "#034881" }}>
                          Origem:{" "}
                          {passenger.attributes.issueOrigin == undefined
                            ? "Não informado!"
                            : passenger.attributes.issueOrigin}
                        </Text>
                        <Text style={{ color: "#034881" }}>
                          Destino:{" "}
                          {passenger.attributes.issueDestiny == undefined
                            ? "Não informado!"
                            : passenger.attributes.issueDestiny}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => setComentModalVisible(true)}
                          style={{
                            padding: 10,
                            borderRadius: 10,
                            backgroundColor: "#35383E1A",
                            alignItems: "center",
                            marginRight: 5,
                          }}
                        >
                          <Image
                            source={comentIcon}
                            style={{
                              width: 24,
                              height: 24,
                              tintColor: "#034881",
                            }}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => setModalVisible(true)}
                          style={{
                            padding: 10,
                            borderRadius: 10,
                            backgroundColor: "#35383E1A",
                            alignItems: "center",
                            marginRight: 5,
                          }}
                        >
                          <Image
                            source={transferIcon}
                            style={{
                              width: 24,
                              height: 24,
                              tintColor: "#034881",
                            }}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => setModal(true)}
                          style={{
                            padding: 10,
                            borderRadius: 10,
                            backgroundColor: "#35383E1A",
                            alignItems: "center",
                          }}
                        >
                          <Image
                            source={removeIcon}
                            style={{
                              width: 24,
                              height: 24,
                              tintColor: "#034881",
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <Modal visible={comentModalVisible} transparent={true}>
                      <ModalComment
                        setComentModalVisible={setComentModalVisible}
                        handleAddComent={handleAddComent}
                        passenger={passenger}
                        descriptions={descriptions}
                        setDescriptionComment={setDescriptionComment}
                        loadingModal={loadingModal}
                      />
                    </Modal>

                    <Modal visible={modal} transparent={true}>
                      <ModalCancel
                        setModal={setModal}
                        handleClearItem={handleClearItem}
                        passenger={passenger}
                        description={description}
                        setDescription={setDescription}
                        loadingModal={loadingModal}
                      />
                    </Modal>

                    <Modal visible={modalVisible} transparent={true}>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                        }}
                      >
                        <View
                          className="flex flex-col space-y-16"
                          style={{
                            width: "90%",
                            backgroundColor: "#F2F9FF",
                            borderRadius: 12,
                            padding: 20,
                            // height: 250,
                          }}
                        >
                          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                            Selecione um novo Atendente:
                          </Text>
                          <View
                            className={
                              searchValue.length > 2
                                ? "h-32 flex-row"
                                : "h-12 flex-row"
                            }
                            // className="h-12 flex-row"
                            style={{ alignItems: "center" }}
                          >
                            <View
                              style={{
                                flex: 1,
                                borderRadius: 8,
                                zIndex: 999,
                              }}
                            >
                              <Autocomplete
                                scrollEnabled={false}
                                placeholder="Buscar"
                                data={
                                  searchValue ? filterWorks(searchValue)! : []!
                                }
                                containerStyle={{
                                  flex: 1,
                                  borderRadius: 8,
                                  height: 40,
                                }}
                                value={searchValue}
                                onChangeText={text => setSearchValue(text)}
                                flatListProps={{
                                  ListEmptyComponent: () => (
                                    <Text>Nenhum item encontrado.</Text>
                                  ),
                                  keyExtractor: (_, index) => index.toString(),
                                  renderItem: ({ item }) => (
                                    <View className="mx-2 my-2" style={{}}>
                                      <TouchableOpacity
                                        onPress={() => handleSelectWorker(item)}
                                      >
                                        <Text style={{ fontSize: 16 }}>
                                          {" "}
                                          {item.attributes.name}{" "}
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                  ),
                                }}
                              />
                            </View>
                          </View>
                          {isCardVisible && (
                            <View
                              style={{
                                borderBottomLeftRadius: 8,
                                borderBottomRightRadius: 8,
                              }}
                            >
                              <View className="flex flex-row justify-around p-5">
                                {workers?.usersPermissionsUsers.data.map(
                                  request => (
                                    <View>
                                      <TouchableOpacity
                                        onPress={() =>
                                          handleSelectWorker(request)
                                        }
                                        className="max-w-30 rounded-md"
                                        style={{ maxWidth: 120 }}
                                      >
                                        <View className="mb-20">
                                          <Text
                                            numberOfLines={1}
                                            ellipsizeMode="tail"
                                            className="mb-20 p-1.5 "
                                            style={{ fontSize: 14 }}
                                          >
                                            {request.attributes.name}
                                          </Text>
                                        </View>
                                      </TouchableOpacity>
                                    </View>
                                  ),
                                )}
                              </View>
                            </View>
                          )}
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <TouchableOpacity
                              onPress={() => setModalVisible(false)}
                              style={{
                                backgroundColor: "#7C7C7C",
                                paddingVertical: 12,
                                paddingHorizontal: 20,
                                borderRadius: 10,
                                alignItems: "center",
                                marginRight: 10,
                              }}
                              disabled={loadingModal}
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
                              onPress={() =>
                                handleTransferMutation(passenger?.id)
                              }
                              style={{
                                backgroundColor: "#034881",
                                paddingVertical: 12,
                                paddingHorizontal: 20,
                                borderRadius: 10,
                                alignItems: "center",
                              }}
                              disabled={loadingModal}
                            >
                              {loadingModal ? (
                                <ActivityIndicator size={24} color="white" />
                              ) : (
                                <Text
                                  style={{
                                    fontSize: 16,
                                    color: "white",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Transferir
                                </Text>
                              )}
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </Modal>
                  </View>
                ))}
                <View />
              </View>

              {/* View de Finalizar Atendimento */}

              <View className="w-[100%]">
                {issuesNotDtStartQuery?.issues.data.length === 0 && (
                  <ActivityIndicator
                    className="py-16"
                    size="large"
                    color="#034881"
                    style={{ marginVertical: 16 }}
                  />
                )}

                <TouchableHighlight
                  onPress={handleEndIssue}
                  style={{
                    marginTop: 30,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 12,
                    width: "100%",
                    borderRadius: 10,
                    elevation: 3,
                    backgroundColor: "#034881",
                  }}
                >
                  {isLoadingFinishedStep ? (
                    <ActivityIndicator
                      className="py-2"
                      size="small"
                      color="#fff"
                    />
                  ) : (
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
                      FINALIZAR
                    </Text>
                  )}
                </TouchableHighlight>
              </View>
            </View>
          </ScrollView>
        </Layout>
      </OrbitalBackground>
    </KeyboardAvoidingView>
  );
};
