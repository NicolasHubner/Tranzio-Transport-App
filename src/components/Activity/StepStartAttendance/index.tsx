// import { useNavigation, useRoute } from "@react-navigation/native";
// import * as Location from "expo-location";
// import React, { useEffect, useMemo, useState } from "react";
// import { Alert, Image, Text, TouchableHighlight, View } from "react-native";
// import { UpdateIssueCordinatesMutation, UpdateIssueCordinatesResponse, UpdateIssueCordinatesVariables } from "~/graphql/mutations/update_issue_cordinates";
// import { NotAttendedIssueMutationResponse, NotAttendedIssueMutationVariables, notAttendedIssueMutation } from "~/graphql/mutations/update_not_issue";
// import { apolloClient } from "~/lib/apollo";
// import { useIssueQuery } from "../../../hooks/useIssueQuery";
// import { useStartIssueMutation } from "../../../hooks/useStartIssueMutation";
// import {
//   airlineDigitalGateIcon,
//   arriveIcon,
//   calendarIcon,
//   chairIcon,
//   clockIcon,
//   compassIcon,
//   planeIcon,
// } from "../../../images";
// import type { ActivityRouteParams } from "../../../pages/Activity";
// import { formatIssue } from "../../../utils/formatIssue";
// import { Button } from "../../Button";
// import Layout from "../../Layout";
// import OrbitalBackground from "../../OrbitallBackground";
// import { Timer } from "./Timer";
// import { styles } from "./style";

// interface StepStartAttendanceProps {
//   setStep: React.Dispatch<React.SetStateAction<number>>;
// }

// const StepStartAttendance: React.FC<StepStartAttendanceProps> = ({
//   setStep,
// }) => {
//   const { params } = useRoute();
//   const { issueId } = params as ActivityRouteParams;
//   const { navigate } = useNavigation();
//   const [start] = useState(false);
//   const [startIssue] = useStartIssueMutation();
//   const { data } = useIssueQuery({ variables: { id: issueId! } });
//   const [isStarting, setIsStarting] = useState(false);

//   const issue = useMemo(() => {
//     if (!data) {
//       return null;
//     }

//     return formatIssue(data.issue.data);
//   }, [data]);

//   function handleGoBack() {
//     setStep(currentStep => currentStep - 2);
//   }

//   async function handleStartIssue() {
//     setIsStarting(true);
//     try {
//       await startIssue({
//         variables: {
//           id: issueId!,
//           dtStart: new Date().toISOString(),
//         },
//       });

//       setIsConfirmed(true); // Atendimento confirmado
//       setStep(currentStep => currentStep + 1);
//     } catch (error) {
//       console.error(error);
//       setIsStarting(false);
//     }
//   }

//   const [isConfirmed, setIsConfirmed] = useState(false);
//   useEffect(() => {

//     if (start && !isConfirmed) {
//       let intervalId = setInterval(updateIssueCordinates, 60000); // Chama a função a cada 11 segundos (11000 milissegundos)

//       // Limpa o intervalo quando o componente for desmontado ou quando o atendimento for confirmado
//       return () => clearInterval(intervalId!);
//     }
//   }, [start, isConfirmed]);
//   async function updateIssueCordinates() {
//     const now = new Date().toISOString();
//     const location = await Location.getCurrentPositionAsync();
//     await apolloClient.mutate<
//       UpdateIssueCordinatesResponse,
//       UpdateIssueCordinatesVariables
//     >({
//       mutation: UpdateIssueCordinatesMutation,
//       variables: {
//         input: {
//           issue: issueId!,
//           latitude: location.coords.latitude,
//           longitude: location.coords.longitude,
//           publishedAt: now
//         },
//       },
//     }
//     );
//   }
//   async function handleUpdateNotAttended() {
//     const now = new Date().toISOString();

//     try {
//       await apolloClient.mutate<
//         NotAttendedIssueMutationResponse,
//         NotAttendedIssueMutationVariables
//       >({
//         mutation: notAttendedIssueMutation,
//         variables: {
//           id: issue?.id,
//           dtEnd: now
//         },
//       });
//       Alert.alert(
//         "Finalizar atendimento",
//         "Atendimento finalizado com sucesso.",
//       );
//       navigate("Pnae");
//     } catch (error) {
//       Alert.alert(
//         "Finalizar atendimento",
//         "Não foi possível finalizar o atendimento.",
//       );
//     }

//   }

//   return (
//     <OrbitalBackground>
//       <Layout back={handleGoBack}>
//         <View style={styles.container}>
//           <View>
//             <Text style={{ ...styles.text, ...styles.title }}>
//               Check in realizado
//             </Text>

//             <Text style={{ ...styles.text, ...styles.title }}>com sucesso</Text>
//           </View>

//           <View>{issue && <Timer sta={issue.flight.STA} />}</View>

//           <View>
//             <View style={{ flexDirection: "row", alignItems: "center" }}>
//               <Image
//                 source={calendarIcon}
//                 style={{ width: 16, height: 16, marginRight: 6 }}
//               />
//               {/* 3147501 */}
//               <Text style={{ paddingVertical: 4 }}>56W: {issue!.shift}</Text>
//             </View>

//             <View style={{ flexDirection: "row", alignItems: "center" }}>
//               <Image
//                 source={planeIcon}
//                 style={{ width: 16, height: 16, marginRight: 6 }}
//               />

//               <Text style={{ paddingVertical: 4 }}>
//                 Nº Voo: {issue!.flight.flightNumber}
//               </Text>
//             </View>

//             <View style={{ flexDirection: "row", alignItems: "center" }}>
//               <Image
//                 source={compassIcon}
//                 style={{ width: 16, height: 16, marginRight: 6 }}
//               />

//               <Text style={{ paddingVertical: 4 }}>
//                 Destino/Origem: {issue!.flight.flightOrigin}-
//                 {issue!.flight.flightDestiny}
//               </Text>
//             </View>

//             <View style={{ flexDirection: "row", alignItems: "center" }}>
//               <Image
//                 source={arriveIcon}
//                 style={{ width: 16, height: 16, marginRight: 6 }}
//               />

//               <Text style={{ paddingVertical: 4 }}>
//                 Chegada/Saída:{" "}
//                 {issue!.flight.actionType === "Arrival" ? "Chegada" : "Saída"}
//               </Text>
//             </View>

//             <View style={{ flexDirection: "row", alignItems: "center" }}>
//               <Image
//                 source={chairIcon}
//                 style={{
//                   width: 16,
//                   height: 16,
//                   marginRight: 6,
//                   tintColor: "#2C5484",
//                 }}
//               />

//               <Text style={{ paddingVertical: 4 }}>
//                 Serviço: {issue!.serviceTypes.join("/")}
//               </Text>
//             </View>

//             <View style={{ flexDirection: "row", alignItems: "center" }}>
//               <Image
//                 source={arriveIcon}
//                 style={{ width: 16, height: 16, marginRight: 6 }}
//               />

//               <Text style={{ paddingVertical: 4 }}>
//                 Conexão: {issue!.flight.route === "Connection" ? "Sim" : "Não"}
//               </Text>
//             </View>

//             <View style={{ flexDirection: "row", alignItems: "center" }}>
//               <Image
//                 source={arriveIcon}
//                 style={{ width: 16, height: 16, marginRight: 6 }}
//               />

//               <Text style={{ paddingVertical: 4 }}>
//                 Origem: {issue!.origin.name}
//               </Text>
//             </View>

//             <View style={{ flexDirection: "row", alignItems: "center" }}>
//               <Image
//                 source={arriveIcon}
//                 style={{ width: 16, height: 16, marginRight: 6 }}
//               />

//               <Text style={{ paddingVertical: 4 }}>
//                 Destino: {issue!.destiny.name}
//               </Text>
//             </View>

//             <View style={{ flexDirection: "row", alignItems: "center" }}>
//               <Image
//                 source={clockIcon}
//                 style={{ width: 16, height: 16, marginRight: 6 }}
//               />

//               <Text style={{ paddingVertical: 4 }}>
//                 Horário do embarque: {issue!.flight.STA.substring(0, 5)}h
//               </Text>
//             </View>

//             <View style={{ flexDirection: "row", alignItems: "center" }}>
//               <Image
//                 source={airlineDigitalGateIcon}
//                 style={{ width: 16, height: 16, marginRight: 6 }}
//               />

//               <Text style={{ paddingVertical: 4 }}>
//                 Passageiro: {issue!.passengerName}
//               </Text>
//             </View>
//           </View>

//           <View>
//             <Button
//               isLoading={isStarting}
//               title={"CONFIRMAR"}
//               onPress={handleStartIssue}
//             />

//             <TouchableHighlight style={{
//               marginTop: 8,
//               alignItems: "center",
//               justifyContent: "center",
//               paddingVertical: 12,
//               paddingHorizontal: 32,
//               borderRadius: 20,
//               elevation: 3,
//               backgroundColor: "#7C7C7C"
//             }}
//               onPress={() => handleUpdateNotAttended()}
//             >
//               <Text style={{
//                 fontSize: 16,
//                 lineHeight: 20,
//                 fontWeight: "bold",
//                 letterSpacing: 0.25,
//                 color: "white",
//                 textAlign: "center",
//               }}>NÃO ATENDIDO</Text>
//             </TouchableHighlight>
//           </View>

//           <View />
//         </View>
//       </Layout>
//     </OrbitalBackground>
//   );
// };

// export default StepStartAttendance;
