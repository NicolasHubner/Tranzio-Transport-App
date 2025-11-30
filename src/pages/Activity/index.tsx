import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import * as TaskManager from "expo-task-manager";
import { useCallback, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import Layout from "~/components/Layout";
import OrbitalBackground from "~/components/OrbitalBackground";
import {
  RemoveUserFromIssueMutationVariables,
  StartIssueMutationResponse,
  StartIssueMutationVariables,
  startIssueMutation,
} from "~/graphql/mutations/start-issue";
import { useAuth } from "~/hooks/useAuth";
import { useIssuesFormatedQuery } from "~/hooks/useIssuesQuery";
import { useQueryPolling } from "~/hooks/useQueryPolling";
import PlusIcon from "~/images/plus.svg";
import { apolloClient } from "~/lib/apollo";
import { removeIcon } from "../../images";
import { IParseLocation } from "../StepStartAttendance";
import { SendData } from "./SendLocation/SendLocation";
export interface PassengerOption {
  id: string;
  title: string;
  idIssue: string;
  issuePassenger: string;
  description?: string;
  origin?: string;
  destiny?: string;
  route?: string;
}
export interface ActivityRouteParams {
  flightId: string;
  numberFligh?: string;
  ETD?: string;
  STA?: string;
  actionType?: string;
  gate?: string;
}
export interface IssueOption {
  id: string;
  existQrCode: boolean;
}
export interface ActivityParams {
  selectedPassengers?: PassengerOption[];
  flightId: string;
  numberFligh?: string;
  ETD?: string;
  STA?: string;
  actionType?: string;
  issueOptionQrCode?: IssueOption[];
  description?: string;
}

const LOCATION_TRACKING = "location-tracking";

TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }
  if (data) {
    const { locations } = data as any;
    const { coords } = locations[0];

    const location = await AsyncStorage.getItem("@Cfs:Location");

    const parseLocation: IParseLocation = JSON.parse(location!);

    await SendData({
      latitude: coords.latitude.toString(),
      longitude: coords.longitude.toString(),
      pnaeIdStrapi: parseLocation.idPassengers,
      idUser: parseLocation.idUser,
      nameUser: parseLocation.nameUser,
    });
  }
});

export const Activity: React.FC = () => {
  const { params } = useRoute();

  const { flightId, numberFligh, actionType } = params as ActivityRouteParams;

  const [isLoadingFinishedFlight, setIsLoadingFinishedFlight] =
    useState<boolean>(false);

  const [selectedPassengerOption, setSelectedPassengerOption] =
    useState<PassengerOption | null>(null);

  async function handleAddPassenger() {
    try {
      setSelectedPassengers(currentSelectedPassenger => [
        ...currentSelectedPassenger,
        selectedPassengerOption!,
      ]);

      setSelectedPassengerOption(null);

      if (!!selectedPassengerOption) {
        const { data } = await apolloClient.mutate<
          StartIssueMutationResponse,
          StartIssueMutationVariables
        >({
          mutation: startIssueMutation,
          variables: {
            id: selectedPassengerOption?.idIssue,
            workerId: loggedUserId ? loggedUserId : "",
          },
        });

        // if (data) {
        //   // A mutação foi bem-sucedida, e você pode lidar com a resposta aqui
        //   console.log(
        //     "Passageiro adicionado com sucesso:",
        //     data.updateIssue.data.id,
        //   );
        // }
      }
    } catch (error) {
      // Se ocorrer algum erro durante a mutação, você pode lidar com ele aqui
      console.error("Erro ao adicionar passageiro:", error);
    }
  }

  const { user: loggedUser } = useAuth();
  const loggedUserId = loggedUser?.id;

  function handleStartAttendePnae() {
    if (selectedPassengers.length == 0) {
      Alert.alert("Erro!", "Adione um passageiro ao seu atendimento !");
    } else {
      navigate("StepStartAttendance", {
        selectedPassengers: selectedPassengers!,
        flightId: flightId,
        numberFligh: numberFligh!,
        actionType: actionType,
      });
    }
  }

  const handleClearItem = async (id: string, issueId: string) => {
    try {
      setSelectedPassengers(prevPassengers =>
        prevPassengers.filter(passenger => passenger.id !== id),
      );

      const { data } = await apolloClient.mutate<
        StartIssueMutationResponse,
        RemoveUserFromIssueMutationVariables
      >({
        mutation: startIssueMutation,
        variables: {
          id: issueId,
          workerId: [],
        },
      });

      // if (data) {
      //   // A mutação foi bem-sucedida, e você pode lidar com a resposta aqui
      //   console.log(
      //     "Passageiro removido com sucesso:",
      //     data.updateIssue.data.id,
      //   );
      // }
    } catch (error) {
      // Se ocorrer algum erro durante a mutação, você pode lidar com ele aqui
      console.error("Erro ao limpar item:", error);
    }
  };

  const { data, refetch, startPolling, stopPolling } = useIssuesFormatedQuery({
    fetchPolicy: "no-cache",
    variables: {
      status: "pending",
      flightId: flightId,
    },
  });

  useQueryPolling(10000, startPolling, stopPolling);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const { navigate } = useNavigation();

  function handleGoBack() {
    navigate("Pnae");
  }
  const [selectedPassengers, setSelectedPassengers] = useState<
    PassengerOption[]
  >([]);

  const userOptions =
    data?.issues.data.map((issues, index) => ({
      id: index.toString(),
      title: `${issues.attributes.serviceType} |${issues.attributes.passengerName}`,
      idIssue: issues.id,
      issuePassenger: issues.attributes.serviceType,
      origin: issues.attributes.issueOrigin,
      destiny: issues.attributes.issueDestiny,
      route: issues.attributes.route,
      users: issues.attributes.users.data.id,
    })) ?? [];

  const userOptionsFiltered = userOptions.filter(
    option => !selectedPassengers.some(passenger => passenger.id === option.id),
  );

  // async function handleUnlinkFlight() {
  //   setIsLoadingFinishedFlight(true);
  //   try {
  //     await apolloClient.mutate<
  //       EndFlightIssueMutationResponse,
  //       EndFlightIssueMutationVariables
  //     >({
  //       mutation: endFlightIssueMutation,
  //       variables: {
  //         id: flightId,
  //       },
  //     });
  //     handleGoBack();
  //   } catch (error) {
  //     Alert.alert(
  //       `Erro!", "A requisição falhou! ${error} \n\n ${flightId} \n\ ${loggedUserId}`,
  //     );
  //   } finally {
  //     setIsLoadingFinishedFlight(false);
  //   }
  // }

  return (
    <OrbitalBackground>
      <Layout back={handleGoBack}>
        <View className="mx-4 flex-1 flex-col space-y-2">
          <Text className="text-sm font-normal text-[#034881]">
            Selecionar passageiros:
          </Text>
          <View className="flex-row space-x-2 py-2">
            <AutocompleteDropdown
              closeOnSubmit
              debounce={600}
              useFilter={false}
              closeOnBlur={false}
              dataSet={userOptionsFiltered}
              // onChangeText={setPassengerQuery}
              containerStyle={{ flex: 1 }}
              onSelectItem={setSelectedPassengerOption as any}
              inputContainerStyle={{ backgroundColor: "white" }}
            />
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={handleAddPassenger}
              disabled={!selectedPassengerOption}
              className="items-center justify-center rounded-md bg-[#2C5484] px-3 py-1"
            >
              <PlusIcon width={24} height={24} />
            </TouchableOpacity>
          </View>

          <Text className="text-sm font-normal text-[#034881]">
            Passageiros adicionados: {selectedPassengers.length}
          </Text>
          <ScrollView
            style={{
              width: "100%",
              // alignSelf: "center",
              maxHeight: Dimensions.get("window").height * 0.48,
              // maxWidth: 400,
              // backgroundColor: "red",
            }}
          >
            {selectedPassengers.map(passenger => {
              return (
                <View
                  key={passenger.id}
                  style={{
                    borderRadius: 12,
                    padding: 12,
                    // marginVertical: 8,
                    flexDirection: "column",
                    justifyContent: "space-around",
                    // alignItems: "center",
                    // maxWidth: 400,
                    width: "100%",
                    height: 120,
                    paddingRight: 48,
                    marginBottom: 8,
                    backgroundColor: "white",
                    shadowColor: "rgba(0, 0, 0, 0.637)",
                    shadowOpacity: 1,
                    shadowRadius: 2,
                    elevation: 7,
                  }}
                >
                  <Text
                    style={{
                      // flex: 1, // Permite que o texto ocupe o espaço disponível
                      flexShrink: 1, // Permite que o texto reduza de tamanho quando necessário
                      flexGrow: 0.3,
                      fontSize: 16,
                      fontWeight: "bold",
                      color: "#034881",
                    }}
                  >
                    {passenger.title}
                  </Text>

                  <Text
                    style={{
                      // flex: 1, // Permite que o texto ocupe o espaço disponível
                      flexShrink: 1, // Permite que o texto reduza de tamanho quando necessário
                      fontSize: 16,
                      marginTop: 8,
                      color: "#034881",
                    }}
                  >
                    {"Tipo de serviço: " + passenger.issuePassenger}
                  </Text>

                  <TouchableOpacity
                    onPress={() =>
                      handleClearItem(passenger.id, passenger.idIssue)
                    }
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 50,
                      backgroundColor: "#034881",
                      position: "absolute",
                      right: 8,
                      top: 48,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      source={removeIcon}
                      style={{
                        width: 18,
                        height: 18,
                        tintColor: "white",
                      }}
                    />
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>

          <View>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={handleStartAttendePnae}
              className="mb-2 mt-auto items-center rounded-md bg-[#034881] px-4 py-4"
            >
              {
                <Text className="text-base font-semibold uppercase text-white">
                  Iniciar Atendimento
                </Text>
              }
            </TouchableOpacity>

            {/* <TouchableOpacity
              activeOpacity={0.6}
              onPress={handleUnlinkFlight}
              className="mt-auto items-center rounded-md bg-[#034881] px-4 py-4"
              style={{
                backgroundColor:
                  userOptionsFiltered.length > 0 ? "gray" : "#fa4848",
                opacity: userOptionsFiltered.length > 0 ? 0.5 : 1,
              }}
              disabled={
                userOptionsFiltered.length > 0 || isLoadingFinishedFlight
              }
            >
              {isLoadingFinishedFlight ? (
                <ActivityIndicator size={20} color="white" />
              ) : (
                <Text className="text-base font-semibold uppercase text-white">
                  Finalizar voo {numberFligh}
                </Text>
              )}
            </TouchableOpacity> */}
          </View>
        </View>
      </Layout>
    </OrbitalBackground>
  );
};
