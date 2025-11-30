import { AntDesign } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { Controller, useForm } from "react-hook-form";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { z } from "zod";
import Logo from "~/assets/logo.svg";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import {
  SendResetPasswordTokenResponse,
  SendResetPasswordTokenVariables,
  sendResetPasswordTokenMutation,
} from "~/graphql/mutations/send-reset-password-token";
import { apolloClient } from "~/lib/apollo";
import { styles } from "./styles";

const formSchema = z.object({
  email: z.string().email("Email inválido"),
});

export const ForgotPassword: React.FC = () => {
  const { goBack } = useNavigation();
  const { navigate } = useNavigation();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSendEmail = handleSubmit(async ({ email }) => {
    try {
      const { data } = await apolloClient.mutate<
        SendResetPasswordTokenResponse,
        SendResetPasswordTokenVariables
      >({
        mutation: sendResetPasswordTokenMutation,
        variables: { email },
      });
      if (data?.sendResetPasswordToken.status === 404) {
        return Alert.alert("Erro", "Email não encontrado.");
      }
      if (!data?.sendResetPasswordToken.success) {
        throw data;
      }
      Alert.alert(
        "Sucesso",
        "Foi enviado um código de recuperação no seu email. 😉",
      );
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 40,
          paddingTop: 170,
          paddingBottom: 24,
        }}
      >
        <AntDesign
          name="arrowleft"
          size={24}
          color="#2C5484"
          onPress={goBack}
        />

        <View className="mb-20 items-center space-y-2">
          <Logo width={136} height={50} />

          <Text className="text-sm font-medium text-regal-blue">
            v{process.env.APP_VERSION}
          </Text>
        </View>

        <Text className="text-base font-medium text-[#2C5484]">
          Digite seu email para enviarmos seu código de recuperação.
        </Text>
        <View className="mt-5">
          <Controller
            control={control}
            name="email"
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => {
              return (
                <>
                  <Input
                    style={{
                      backgroundColor: "#F2F9FF",
                      padding: 10,
                      marginVertical: 10,
                      height: 60,
                    }}
                    placeholder="example@mail.com"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onBlur={onBlur}
                  />
                  {error?.message && (
                    <Text className="font-medium text-red-600">
                      {error.message}
                    </Text>
                  )}
                </>
              );
            }}
          />

          <TouchableOpacity
            className="mb-4 mt-3"
            onPress={() => navigate("ResetPassword", {})}
          >
            <Text className="text-sm font-semibold text-[#2C5484] underline">
              Já possui o código ?
            </Text>
          </TouchableOpacity>

          <Button
            style={{ height: 70 }}
            title="Enviar"
            isLoading={isSubmitting}
            onPress={handleSendEmail}
          />
        </View>
      </ScrollView>
    </View>
  );
};
