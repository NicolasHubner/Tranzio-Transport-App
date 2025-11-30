import { AntDesign } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, ScrollView, Text, View } from "react-native";
import { z } from "zod";
import Logo from "~/assets/logo.svg";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import { InputPassword } from "~/components/InputPassword";
import {
  ResetPasswordResponse,
  ResetPasswordToken,
  ResetPasswordVariables,
} from "~/graphql/mutations/reset-password";
import { apolloClient } from "~/lib/apollo";
import { APP_VERSION } from "~/utils/constants";
import { styles } from "./styles";

export interface ResetPasswordParams {
  token?: string;
}

const formSchema = z
  .object({
    token: z.string().nonempty("Campo obrigatório!"),
    password: z.string().nonempty("Campo obrigatório!"),
    passwordConfirmation: z.string().nonempty("Campo obrigatório!"),
  })
  .superRefine(({ password, passwordConfirmation }, context) => {
    if (password !== passwordConfirmation) {
      context.addIssue({
        code: "custom",
        message: "A confirmação está incorreta",
        path: ["passwordConfirmation"],
      });
    }
  });

export const ResetPassword: React.FC = () => {
  const { goBack, navigate } = useNavigation();
  const { params } = useRoute();
  const { token } = params as ResetPasswordParams;
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
      token: token || "",
    },
  });

  const handleResetPassword = handleSubmit(async ({ token, password }) => {
    try {
      const { data } = await apolloClient.mutate<
        ResetPasswordResponse,
        ResetPasswordVariables
      >({
        mutation: ResetPasswordToken,
        variables: {
          password,
          token,
        },
      });
      if (!data) {
        throw data;
      }
      if (!data.resetUserPassword.success) {
        return Alert.alert("Erro", data.resetUserPassword.message);
      }
      Alert.alert("Sucesso", "Faça login com sua nova senha. 😉");
      navigate("Login");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível alterar a senha.");
    }
  });

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 40,
          paddingTop: 90,
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
            v{APP_VERSION}
          </Text>
        </View>

        <Text className="text-base font-medium text-[#2C5484]">
          Digite o código recebido:
        </Text>
        <View>
          <Controller
            control={control}
            name="token"
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
                      marginBottom: 10,
                      height: 60,
                    }}
                    value={value}
                    placeholder="Digite seu código..."
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                  {error?.message && (
                    <Text className="text-xs font-medium text-red-600">
                      {error.message}
                    </Text>
                  )}
                </>
              );
            }}
          />

          <Text className="mt-4 text-base font-medium text-[#2C5484]">
            Escolha uma nova senha:
          </Text>
          <Controller
            name="password"
            control={control}
            render={({
              field: { onBlur, onChange, value },
              fieldState: { error },
            }) => {
              return (
                <>
                  <InputPassword
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                  {error?.message && (
                    <Text className="text-xs font-medium text-red-600">
                      {error.message}
                    </Text>
                  )}
                </>
              );
            }}
          />

          <Text className="mt-4 text-base font-medium text-[#2C5484]">
            Confirme a nova senha:
          </Text>
          <Controller
            name="passwordConfirmation"
            control={control}
            render={({
              field: { onBlur, onChange, value },
              fieldState: { error },
            }) => {
              return (
                <>
                  <InputPassword
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                  {error?.message && (
                    <Text className="text-xs font-medium text-red-600">
                      {error.message}
                    </Text>
                  )}
                </>
              );
            }}
          />
          <View className="mt-4">
            <Button
              title="Enviar"
              isLoading={isSubmitting}
              onPress={handleResetPassword}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
