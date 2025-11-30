// import { useRoute } from "@react-navigation/native";
// import { useState } from "react";
// import { Alert, Text, TouchableOpacity, View } from "react-native";
// import {
//   WheelchairByCodeQueryResponse,
//   WheelchairByCodeQueryVariables,
//   wheelchairByCodeQuery,
// } from "../../../graphql/queries/wheelchair-by-code";
// import { useCreateCheckInMutation } from "../../../hooks/useCreateCheckInMutation";
// import { apolloClient } from "../../../lib/apollo";
// import type { ActivityRouteParams } from "../../../pages/Activity";
// import { Button } from "../../Button";
// import { Input } from "../../Input";
// import Layout from "../../Layout";
// import OrbitalBackground from "../../OrbitallBackground";
// import { styles } from "./style";

// interface StepInputProps {
//   setStep: React.Dispatch<React.SetStateAction<number>>;
// }

// export const StepInput: React.FC<StepInputProps> = ({ setStep }) => {
//   const { params } = useRoute();
//   const [vehicleCode, setVehicleCode] = useState("");
//   const [createCheckin] = useCreateCheckInMutation();
//   const [isCheckingIn, setIsCheckingIn] = useState(false);

//   function handleGoBack() {
//     setStep(currentStep => currentStep - 1);
//   }

//   async function handleCheckIn() {
//     const code = vehicleCode.trim();

//     if (!code) {
//       return Alert.alert("Check-in", "O código é obrigatório.");
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

//       setStep(currentStep => currentStep + 1);
//     } catch (error) {
//       console.error(error);
//       setIsCheckingIn(false);
//       Alert.alert("Check-in", "Não foi possível fazer o check-in.");
//     }
//   }

//   return (
//     <OrbitalBackground>
//       <Layout back={handleGoBack}>
//         <View style={styles.container}>
//           <View>
//             <Text style={styles.title}>Check in</Text>
//             <Text style={styles.text}>Faça seu check-in na cadeira</Text>
//           </View>

//           <View>
//             <Input
//               value={vehicleCode}
//               onChangeText={setVehicleCode}
//               onSubmitEditing={handleCheckIn}
//               placeholder="Insira aqui o código da cadeira"
//             />

//             <Button
//               title="Fazer check-in"
//               isLoading={isCheckingIn}
//               onPress={handleCheckIn}
//             />
//           </View>

//           <TouchableOpacity onPress={handleGoBack} activeOpacity={0.7}>
//             <Text style={styles.qrCodeText}>Voltar</Text>
//           </TouchableOpacity>
//         </View>
//       </Layout>
//     </OrbitalBackground>
//   );
// };
