import { useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import DatePicker from "react-native-date-picker";
import { ScrollView } from "react-native-gesture-handler";
import { Input } from "~/components/Input";
import Layout from "~/components/Layout";
import OrbitalBackground from "~/components/OrbitalBackground";
import {
  CreateIssueMutationResponse,
  CreateIssueMutationVariables,
  crateIssueMutation,
} from "~/graphql/mutations/create-issue";
import {
  UpdateFlightResponse,
  UpdateFlightVariables,
  updateFlightMutation,
} from "~/graphql/mutations/update-flight-worker";
import { useAuth } from "~/hooks/useAuth";
import { useFlightsForForm } from "~/hooks/useFlightsForForm";
import { usePoisQuery } from "~/hooks/usePoi";
import { useQueryPolling } from "~/hooks/useQueryPolling";
import { useUserCoordinates } from "~/hooks/useUserCoordinates";
import { apolloClient } from "~/lib/apollo";
import arrowUpIcon from "/images/arrowUpIcon.png";

interface FlightOption {
  id: string;
  title: string;
}

export const NewAttendanceIssue: React.FC = () => {
  const { navigate } = useNavigation();

  const handleToggleServiceType = () => {
    setIsCardVisibleServiceType(!isCardVisibleServiceType);
  };

  const [isCardVisibleServiceType, setIsCardVisibleServiceType] =
    useState(false);
  const handleSelectServiceType = (index: number, name: string) => {
    setSelectedServiceTypeIndex(index);
    setSelectedServiceTypeName(name);
    setIsCardVisibleServiceType(false);
  };
  const handleSelectRoute = (index: number, name: string) => {
    setSelectedRouteIndex(index);
    setSelectedRouteName(name);
    setIsCardVisibleRoute(false);
  };

  const handleToggleRoute = () => {
    setIsCardVisibleRoute(!isCardVisibleRoute);
  };

  const [selectedServiceTypeIndex, setSelectedServiceTypeIndex] = useState<
    number | null
  >(null);
  const [selectedServiceTypeName, setSelectedServiceTypeName] = useState<
    string | null
  >(null);
  const [selectedRouteName, setSelectedRouteName] = useState<string | null>(
    null,
  );

  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number | null>(
    null,
  );

  const [isCardVisibleRoute, setIsCardVisibleRoute] = useState(false);

  const [passenger, setPassenger] = useState<string | null>(null);
  const now = new Date().toISOString();
  const { user } = useAuth();
  const cordinates = useUserCoordinates(user!.id);
  const [, setFlight] = useState("");
  const [poiOrigin, setPoiOrigin] = useState("");
  const [poiDestiny, setPoiDestiny] = useState("");
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const {
    data: poisOringin,
    startPolling: startPollingPoi,
    stopPolling: stopPollingPoi,
  } = usePoisQuery(poiOrigin);
  useQueryPolling(10000, startPollingPoi, stopPollingPoi);

  const {
    data: poisDestiny,
    startPolling: startPollingDestiny,
    stopPolling: stopPollingDestiny,
  } = usePoisQuery(poiDestiny);
  useQueryPolling(10000, startPollingDestiny, stopPollingDestiny);

  const originOptions =
    poisOringin?.pois.data.map(poi => ({
      id: poi.id,
      title: poi.attributes.name,
    })) ?? [];

  const destinyOptions =
    poisDestiny?.pois.data.map(poi => ({
      id: poi.id,
      title: poi.attributes.name,
    })) ?? [];

  const [selectedFlightOption, setSelectedFlightOption] =
    useState<FlightOption | null>(null);

  const [selectedPoiOriginOption, setSelectedPoiOriginOption] =
    useState<FlightOption | null>(null);

  const [selectedPoiDestinynOption, setSelectedPoiDestinyOption] =
    useState<FlightOption | null>(null);

  const { data: flightData } = useFlightsForForm({
    variables: {
      flightDate: format(date, "yyyy-MM-dd"),
    },
  });

  const flightOptions =
    flightData?.flights.data.map(flight => ({
      id: flight.id,
      title: flight.attributes.flightNumber.toString(),
    })) ?? [];

  const serviceTypes = [
    ,
    "WCHR",
    "WCHS",
    "WCHC",
    "WCBW",
    "WCBD",
    "WCLB",
    "DPNA",
    "WCBB",
    "WCPW",
    "WCMP",
    "MAAS",
    "UMNR",
    "TEEN",
  ];
  const routeType = ["Local", "Connection"];

  const [isLoading, setIsLoading] = useState(false);
  function handleGoBack() {
    navigate("Pnae");
  }
  async function handleCreateIssue() {
    try {
      setIsLoading(true);
      const hours = now.substring(11, 13);
      let shift = "T4"; // Default shift

      switch (hours) {
        case "00":
        case "01":
        case "02":
        case "03":
        case "04":
        case "05":
          shift = "T1";
          break;
        case "06":
        case "07":
        case "08":
        case "09":
        case "10":
        case "11":
          shift = "T2";
          break;
        case "12":
        case "13":
        case "14":
        case "15":
        case "16":
        case "17":
          shift = "T3";
          break;
      }

      // First mutation
      if (
        apolloClient &&
        updateFlightMutation &&
        selectedFlightOption &&
        user
      ) {
        const flightId = selectedFlightOption.id;
        const userId = user.id;

        if (flightId && userId) {
          await apolloClient.mutate<
            UpdateFlightResponse,
            UpdateFlightVariables
          >({
            mutation: updateFlightMutation,
            variables: {
              id: flightId,
              input: { workers: userId },
            },
          });
        } else {
          console.error(
            "Variáveis flightId e/ou userId ausentes ou inválidas.",
          );
          // Trate o erro ou adicione a lógica apropriada aqui
        }
      } else {
        console.error(
          "Apollo Client, mutation, selectedFlightOption ou user ausentes ou inválidos.",
        );
        // Trate o erro ou adicione a lógica apropriada aqui
      }

      // Second mutation

      const userCordinatesId = cordinates.data?.userCoordinates.data[0].id;
      if (
        passenger &&
        selectedPoiOriginOption?.id &&
        selectedFlightOption?.id &&
        shift &&
        selectedPoiDestinynOption &&
        user
      ) {
        const input: CreateIssueMutationVariables["input"] = {
          area: "12",
          flight: selectedFlightOption.id,
          flightDate: format(date, "yyyy-MM-dd"),
          description: passenger,
          passengerName: passenger,
          destiny: selectedPoiDestinynOption.id,
          origin: selectedPoiOriginOption.id,
          status: "pending",
          users: user.id,
          shift: shift!,
          workerCoordinatesWhenRequested: userCordinatesId!,
          publishedAt: now,
          serviceType: selectedServiceTypeName!,
          route: selectedRouteName!,
          issueOrigin: selectedPoiOriginOption.title,
          issueDestiny: selectedPoiDestinynOption?.title ?? "",
        };

        // Third mutation
        await apolloClient.mutate<
          CreateIssueMutationResponse,
          CreateIssueMutationVariables
        >({
          mutation: crateIssueMutation,
          variables: { input },
        });

        Alert.alert(
          "Criação de atendimento",
          "Atendimento criado com sucesso.",
        );
        setIsLoading(false);
        navigate("Pnae");
      } else {
        Alert.alert(
          "Criação de atendimento",
          "Impossível criar atendimento, preencha todos os campos.",
        );
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error NewAttendence", error);
      Alert.alert(
        "Criação de atendimento",
        "Impossível criar atendimento, tente novamente mais tarde.",
      );
      setIsLoading(false);
    }
  }

  return (
    <OrbitalBackground>
      <Layout back={handleGoBack}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <View className="flex flex-col space-y-5">
            <View className="flex flex-col space-y-2">
              <Text
                style={{
                  color: "#034881",
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                Data do voo
              </Text>
              <TouchableOpacity onPress={() => setOpen(true)}>
                <View
                  style={{
                    backgroundColor: "white",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderRadius: 8,
                    height: 46,
                    paddingHorizontal: 20,
                  }}
                >
                  <Text
                    style={{
                      color: "#034881",
                      fontSize: 20,
                      fontWeight: "normal",
                      marginBottom: 7,
                    }}
                  >
                    {date ? date.toDateString() : "Data do voo"}
                  </Text>
                </View>
              </TouchableOpacity>

              <DatePicker
                modal
                textColor="#034881"
                open={open}
                date={date}
                onConfirm={date => {
                  setOpen(false);
                  setDate(date);
                }}
                onCancel={() => {
                  setOpen(false);
                }}
              />
            </View>
          </View>
          <View className="flex flex-col space-y-5">
            <View className="flex flex-col space-y-8">
              <Text
                style={{
                  color: "#034881",
                  fontSize: 20,
                  fontWeight: "bold",
                  marginBottom: 7,
                }}
              >
                Voo
              </Text>
              <AutocompleteDropdown
                closeOnSubmit
                debounce={600}
                useFilter={false}
                closeOnBlur={false}
                dataSet={flightOptions}
                onChangeText={setFlight}
                onSelectItem={setSelectedFlightOption as any}
                inputContainerStyle={{ backgroundColor: "white" }}
              />
            </View>
            <View className="flex-col">
              <Text
                style={{
                  color: "#034881",
                  fontSize: 20,
                  fontWeight: "bold",
                  marginBottom: 10,
                }}
              >
                Tipo de atendimento
              </Text>
              <TouchableOpacity onPress={handleToggleServiceType}>
                <View
                  style={{
                    backgroundColor: "white",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderRadius: 8,
                    height: 46,
                    paddingHorizontal: 20,
                  }}
                >
                  <Text style={{ color: "#034881", fontSize: 16 }}>
                    {selectedServiceTypeName || "Tipo de serviço"}
                  </Text>
                  {isCardVisibleServiceType ? (
                    <Image
                      style={{ tintColor: "grey", width: 12 }}
                      source={arrowUpIcon}
                    />
                  ) : (
                    <Image
                      style={{
                        tintColor: "grey",
                        width: 12,
                        transform: [{ scaleY: -1 }],
                      }}
                      source={arrowUpIcon}
                    />
                  )}
                </View>
              </TouchableOpacity>
              {isCardVisibleServiceType && (
                <View
                  style={{
                    backgroundColor: "white",
                    padding: 16,
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8,
                  }}
                >
                  <View style={{ flex: 1, paddingLeft: 10 }}>
                    {serviceTypes === null || serviceTypes === undefined ? (
                      <Text
                        style={{ color: "#034881", fontSize: 14, padding: 5 }}
                      >
                        Não há tipos de serviços disponíveis!
                      </Text>
                    ) : (
                      serviceTypes.map((serviceType, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() =>
                            handleSelectServiceType(index, serviceType!)
                          }
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              padding: 10,
                              borderRadius: 8,
                              backgroundColor:
                                selectedServiceTypeIndex === index
                                  ? "#034881"
                                  : "white",
                              marginBottom: 5,
                            }}
                          >
                            <Text
                              style={{
                                color:
                                  selectedServiceTypeIndex === index
                                    ? "white"
                                    : "#034881",
                                fontSize: 14,
                              }}
                            >
                              {serviceType}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))
                    )}
                  </View>
                </View>
              )}
            </View>
            <View className="flex-col">
              <Text
                style={{
                  color: "#034881",
                  fontSize: 20,
                  fontWeight: "bold",
                  marginBottom: 10,
                }}
              >
                Rota
              </Text>
              <TouchableOpacity onPress={handleToggleRoute}>
                <View
                  style={{
                    backgroundColor: "white",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderRadius: 8,
                    height: 46,
                    paddingHorizontal: 20,
                  }}
                >
                  <Text style={{ color: "#034881", fontSize: 16 }}>
                    {selectedRouteName || "Rota do Passageiro"}
                  </Text>
                  {isCardVisibleRoute ? (
                    <Image
                      style={{ tintColor: "grey", width: 12 }}
                      source={arrowUpIcon}
                    />
                  ) : (
                    <Image
                      style={{
                        tintColor: "grey",
                        width: 12,
                        transform: [{ scaleY: -1 }],
                      }}
                      source={arrowUpIcon}
                    />
                  )}
                </View>
              </TouchableOpacity>
              {isCardVisibleRoute && (
                <View
                  style={{
                    backgroundColor: "white",
                    padding: 16,
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8,
                  }}
                >
                  <View style={{ flex: 1, paddingLeft: 10 }}>
                    {!routeType?.length ? (
                      <Text
                        style={{ color: "#034881", fontSize: 14, padding: 5 }}
                      >
                        Não há tipos de rota disponíveis!
                      </Text>
                    ) : (
                      routeType.map((route, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => handleSelectRoute(index, route!)}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              padding: 10,
                              borderRadius: 8,
                              backgroundColor:
                                selectedRouteIndex === index
                                  ? "#034881"
                                  : "white",
                              marginBottom: 5,
                            }}
                          >
                            <Text
                              style={{
                                color:
                                  selectedRouteIndex === index
                                    ? "white"
                                    : "#034881",
                                fontSize: 14,
                              }}
                            >
                              {route}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))
                    )}
                  </View>
                </View>
              )}
            </View>
            <View className="flex-col space-y-5">
              <Text
                style={{
                  color: "#034881",
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                Nome do passageiro
              </Text>
              <Input
                style={{
                  backgroundColor: "white",
                  padding: 10,
                  borderRadius: 8,
                }}
                value={passenger!}
                onChangeText={setPassenger}
                placeholder="Digite o nome do passageiro..."
              />
            </View>

            <View className="flex-col space-y-5">
              <Text
                style={{
                  color: "#034881",
                  fontSize: 20,
                  fontWeight: "bold",
                  marginBottom: 7,
                }}
              >
                Origem
              </Text>
              <AutocompleteDropdown
                closeOnSubmit
                debounce={600}
                useFilter={false}
                closeOnBlur={false}
                dataSet={originOptions}
                onChangeText={setPoiOrigin}
                onSelectItem={setSelectedPoiOriginOption as any}
                inputContainerStyle={{ backgroundColor: "white" }}
              />
            </View>

            <View className="flex-col space-y-5">
              <Text
                style={{
                  color: "#034881",
                  fontSize: 20,
                  fontWeight: "bold",
                  marginBottom: 7,
                }}
              >
                Destino
              </Text>
              <AutocompleteDropdown
                closeOnSubmit
                debounce={600}
                useFilter={false}
                closeOnBlur={false}
                dataSet={destinyOptions}
                onChangeText={setPoiDestiny}
                onSelectItem={setSelectedPoiDestinyOption as any}
                inputContainerStyle={{ backgroundColor: "white" }}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                paddingVertical: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => navigate("Pnae")}
                style={{
                  backgroundColor: "#7C7C7C",
                  borderRadius: 6,
                  width: 120,
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white", fontSize: 16 }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreateIssue}
                style={{
                  backgroundColor: "#034881",
                  borderRadius: 6,
                  width: 120,
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white", fontSize: 16 }}>
                  {isLoading ? (
                    <ActivityIndicator size={20} color="white" />
                  ) : (
                    "Salvar"
                  )}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Layout>
    </OrbitalBackground>
  );
};
