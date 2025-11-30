// import { useNavigation, useRoute } from "@react-navigation/native";
// import { BarCodeEvent, BarCodeScanner } from "expo-barcode-scanner";
// import { useCallback, useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import {
//   WheelchairByCodeQueryResponse,
//   WheelchairByCodeQueryVariables,
//   wheelchairByCodeQuery,
// } from "../../../graphql/queries/wheelchair-by-code";
// import { useCreateCheckInMutation } from "../../../hooks/useCreateCheckInMutation";
// import { apolloClient } from "../../../lib/apollo";
// import { ActivityRouteParams } from "../../../pages/Activity";
// import { Button } from "../../Button";
// import Layout from "../../Layout";
// import OrbitalBackground from "../../OrbitallBackground";
// import { styles } from "./style";

// interface StepQRCodeProps {
//   setStep: React.Dispatch<React.SetStateAction<number>>;
// }

// const StepQRCode: React.FC<StepQRCodeProps> = ({ setStep }) => {
//   const { params } = useRoute();
//   const { goBack } = useNavigation();
//   const [scanned, setScanned] = useState(false);
//   const [createCheckin] = useCreateCheckInMutation();
//   const [isCheckingIn, setIsCheckingIn] = useState(false);
//   const [hasPermission, setHasPermission] = useState<boolean | null>(null);

//   const askForPermission = useCallback(async () => {
//     const { status } = await BarCodeScanner.requestPermissionsAsync();
//     setHasPermission(status === "granted");
//   }, []);

//   useEffect(() => {
//     askForPermission();
//   }, [askForPermission]);

//   function handleGoToInput() {
//     setStep(currentStep => currentStep + 1);
//   }

//   function handleGoToStart() {
//     setStep(currentStep => currentStep + 2);
//   }

//   async function handleBarCodeScanned({ type, data: code }: BarCodeEvent) {
//     setScanned(true);

//     if (type !== BarCodeScanner.Constants.BarCodeType.qr) {
//       return Alert.alert("Scan", "Formato inválido.");
//     }

//     setIsCheckingIn(true);

//     try {
//       const { data } = await apolloClient.query<
//         WheelchairByCodeQueryResponse,
//         WheelchairByCodeQueryVariables
//       >({
//         query: wheelchairByCodeQuery,
//         variables: { code },
//       });

//       const wheelchair = data.vehicles.data[0];

//       if (!wheelchair) {
//         setIsCheckingIn(false);
//         return Alert.alert("Check-in", "Não foi possível encontrar a cadeira.");
//       }

//       const { issueId } = params as ActivityRouteParams;
//       const today = new Date().toISOString();
//       await createCheckin({
//         variables: {
//           issueId: issueId!,
//           vehicleId: wheelchair.id,
//           dtStart: today,
//           publishedAt: today,
//         },
//       });

//       setStep(currentStep => currentStep + 2);
//     } catch (error) {
//       console.error(error);
//       setIsCheckingIn(false);
//       Alert.alert("Check-in", "Não foi possível fazer o check-in.");
//     }
//   }

//   return (
//     <OrbitalBackground>
//       <Layout back={goBack}>
//         <ScrollView contentContainerStyle={styles.container}>
//           <View>
//             <Text style={{ ...styles.text, ...styles.title }}>Check in</Text>
//             <Text style={styles.text}>Faça seu check-in na cadeira</Text>
//           </View>

//           <View style={{
//             marginTop: 40
//           }}>
//             <Text style={{ ...styles.text, ...styles.title }}>
//               Aproxime sua câmera{"\n"}
//               do QR Code:
//             </Text>
//           </View>

//           <View style={{
//             marginTop: 40
//           }}>
//             {hasPermission === null ? (
//               <ActivityIndicator size={40
//               } color="#2C5484" />
//             ) : hasPermission ? (
//               <View>
//                 <View style={[styles.box, { marginBottom: 16 }]}>
//                   <BarCodeScanner
//                     style={StyleSheet.absoluteFillObject}
//                     onBarCodeScanned={
//                       scanned ? undefined : handleBarCodeScanned
//                     }
//                   />
//                 </View>

//                 <Button
//                   isLoading={isCheckingIn}
//                   title="Escanear novamente"
//                   onPress={() => setScanned(false)}
//                 />
//               </View>
//             ) : (
//               <Button onPress={askForPermission} title="Permitir câmera" />
//             )}

//             <Button
//               isLoading={isCheckingIn}
//               title="Fazer check in sem cadeira"
//               onPress={handleGoToStart}
//             />
//             <TouchableOpacity
//               onPress={handleGoToInput}
//               style={{ marginTop: 40 }}
//             >
//               <Text style={styles.text}>Está com problema?</Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </Layout>
//     </OrbitalBackground>
//   );
// };

// export default StepQRCode;
