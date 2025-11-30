// import { useNavigation, useRoute } from "@react-navigation/native";
// import dayjs from "dayjs";
// import React, { Fragment, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { landIcon, locationIcon } from "../../../images";

// import { ScrollView } from "react-native-gesture-handler";
// import { Input } from "~/components/Input";
// import Layout from "~/components/Layout";
// import OrbitalBackground from "~/components/OrbitallBackground";
// import { useEndIssueMutation } from "~/hooks/useEndIssueMutation";
// import { useIssueQuery } from "~/hooks/useIssueQuery";
// import { airlineDigitalGateIcon, clockIcon } from "~/images";
// import type { ActivityRouteParams } from "~/pages/Activity";
// import { Timer } from "./Timer";
// import { styles } from "./style";

// interface StepCloseAttendanceProps { }

// const StepCloseAttendance: React.FC<StepCloseAttendanceProps> = () => {
//   const { params } = useRoute();
//   const { navigate } = useNavigation();
//   const [endIssue] = useEndIssueMutation();
//   const { issueId } = params as ActivityRouteParams;
//   const [idLiveIssue, setIdLiveIssue] = useState("");
//   const [isEndingIssue, setIsEndingIssue] = useState(false);
//   const [descriptionEvidence, setDescriptionEvidence] = useState("");

//   const { data } = useIssueQuery({
//     variables: {
//       id: issueId,
//     },
//   });

//   async function handleEndIssue(id: string, descriptionEvidence: string) {
//     setIsEndingIssue(true);
//     setIdLiveIssue(id);

//     try {
//       await endIssue({
//         variables: {
//           id: id,
//           dtEnd: new Date().toISOString(),
//           evidenceDescription: descriptionEvidence,
//         },
//       });

//       Alert.alert(
//         "Finalizar atendimento",
//         "Atendimento finalizado com sucesso.",
//       );
//       navigate("Pnae");
//     } catch (error) {
//       console.error(error);
//       Alert.alert(
//         "Finalizar atendimento",
//         "Não foi possível finalizar o atendimento.",
//       );
//     } finally {
//       setIsEndingIssue(false);
//     }
//   }

//   function handleGoBack() {
//     navigate("Pnae");
//   }

//   const flightDate = data?.issue.data.attributes.flight.data.attributes.flightDate;
//   const STA = data?.issue.data.attributes.flight.data.attributes.STA;
//   const formattedDateTime = dayjs(flightDate + ' ' + STA).format('DD/MM/YYYY HH:mm');
//   const isConnection = data?.issue.data.attributes.flight.data.attributes.route === "Connection";

//   return (
//     <OrbitalBackground>
//       <Layout back={handleGoBack}>
//         <ScrollView>
//           <View style={styles.container}>
//             <View style={{ width: "100%" }}>
//               <Text style={[styles.text, styles.title]}>
//                 Atividades em andamento
//               </Text>
//             </View>

//             <View style={{ width: "100%" }}>
//               {data ? (
//                 <Fragment>
//                   {!data.issue.data.attributes.dtEnd && (
//                     <Timer
//                       sta={
//                         data.issue.data.attributes.flight.data.attributes.STA
//                       }
//                       isInternational={
//                         data.issue.data.attributes.flight.data.attributes
//                           .isInternational
//                       }
//                     />
//                   )}

//                   <View
//                     style={{
//                       marginTop: 10,
//                       justifyContent: "space-around",
//                       backgroundColor: "#F2F9FF",
//                       borderRadius: 16,
//                       padding: 24,
//                       width: "100%",
//                     }}
//                   >
//                     <Text
//                       style={{
//                         fontSize: 16,
//                         color: "#2C5484",
//                         fontWeight: "600",
//                       }}
//                     >
//                       Vôo{" "}
//                       {
//                         data.issue.data.attributes.flight.data.attributes
//                           .flightNumber
//                       }
//                     </Text>

//                     <View style={{ flexDirection: "row", marginTop: 8 }}>
//                       <Image
//                         source={airlineDigitalGateIcon}
//                         style={{ height: 16, width: 16 }}
//                       />

//                       <Text style={{ marginLeft: 4, color: "#2C5484" }}>
//                         {data.issue.data.attributes.passengerName}
//                       </Text>
//                     </View>

//                     <View style={{ flexDirection: "row", marginTop: 8 }}>
//                       <Image
//                         source={landIcon}
//                         style={{ height: 16, width: 16 }}
//                       />

//                       <Text style={{ marginLeft: 4, color: "#2C5484" }}>
//                         STA{" "}
//                         {data.issue.data.attributes.flight.data.attributes.STA.substring(
//                           0,
//                           5,
//                         )}
//                         h
//                       </Text>
//                     </View>

//                     <View>
//                       <View style={{ flexDirection: "row", marginTop: 8 }}>
//                         <Image
//                           source={locationIcon}
//                           style={{ height: 16, width: 16 }}
//                         />

//                         <Text style={{ marginLeft: 4, color: "#2C5484" }}>
//                           {
//                             data.issue.data.attributes.origin.data.attributes
//                               .name
//                           }
//                         </Text>
//                       </View>
//                       {/* VOO CONEXAO */}
//                       {isConnection ? (
//                         <>
//                           <View style={{ flexDirection: "row", marginTop: 8 }}>
//                             <Image
//                               source={landIcon}
//                               style={{ height: 16, width: 16 }}
//                             />
//                             <Text style={{ marginLeft: 4, color: "#2C5484", fontWeight: "600" }}>
//                               VOO CNX: {data.issue.data.attributes.flight.data.attributes.prefix + data.issue.data.attributes.flight.data.attributes.flightNumber}
//                             </Text>
//                           </View>

//                           <View style={{ flexDirection: "row", marginTop: 8 }}>
//                             <Image
//                               source={locationIcon}
//                               style={{ height: 16, width: 16 }}
//                             />
//                             <Text style={{ marginLeft: 4, color: "#2C5484" }}>
//                               {data.issue.data.attributes.origin.data.attributes.name}
//                             </Text>
//                           </View>

//                           <View style={{ flexDirection: "row", marginTop: 8 }}>
//                             <Image
//                               source={clockIcon}
//                               style={{ height: 16, width: 16 }}
//                             />
//                             <Text style={{ marginLeft: 4, color: "#2C5484" }}>
//                               Data e Hora: {formattedDateTime}h
//                             </Text>
//                           </View>
//                         </>
//                       ) : null}
//                       {/* INPUT */}
//                       <Input
//                         style={{
//                           backgroundColor: "white",
//                           padding: 10,
//                           marginVertical: 10,
//                         }}
//                         value={descriptionEvidence}
//                         onChangeText={setDescriptionEvidence}
//                         placeholder="Insira um comentário..."
//                       />
//                     </View>

//                     <View style={{ width: "100%", marginTop: 8 }}>
//                       <TouchableOpacity
//                         activeOpacity={0.7}
//                         style={[
//                           styles.endButton,
//                           data.issue.data.attributes.dtEnd
//                             ? { opacity: 0.85 }
//                             : undefined,
//                         ]}
//                         disabled={
//                           isEndingIssue ||
//                           Boolean(data.issue.data.attributes.dtEnd)
//                         }
//                         onPress={() =>
//                           handleEndIssue(issueId, descriptionEvidence)
//                         }
//                       >
//                         {isEndingIssue && idLiveIssue === issueId ? (
//                           <ActivityIndicator color="white" size={20} />
//                         ) : (
//                           <Text style={styles.endButtonText}>Finalizar</Text>
//                         )}
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 </Fragment>
//               ) : (
//                 <ActivityIndicator size={36} color="#2C5484" />
//               )}
//             </View>
//             <View className="flex flex-col space-y-3 py-10">


//               <TouchableOpacity
//                 className="items-center"
//                 onPress={() => navigate("Pnae")}
//                 style={{ backgroundColor: "#7C7C7C", borderRadius: 6 }}
//               >
//                 <Text
//                   className="text-14 px-10  py-3"
//                   style={{ color: "white", fontSize: 20 }}
//                 >
//                   IR PARA HOME
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </ScrollView>
//       </Layout>
//     </OrbitalBackground>
//   );
// };

// export default StepCloseAttendance;
