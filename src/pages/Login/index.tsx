import { ApolloError } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Logo from "~/assets/logo.svg";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import { InputPassword } from "~/components/InputPassword";
import { PrivacyPolicyModal } from "~/components/PrivacyPolicyModal";
import { useAuth } from "~/hooks/useAuth";
import { LoginFormInput, loginValidationSchema } from "~/validation/login";
import { styles } from "./styles";

const Login: React.FC = () => {
  const { login } = useAuth();
  const { navigate } = useNavigation();
  const [isPrivacyPolicyModalOpen, setIsPrivacyPolicyModalOpen] =
    useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormInput>({
    resolver: zodResolver(loginValidationSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const handleLogin = handleSubmit(async values => {
    try {
      await login(values);
    } catch (error) {
      let errorMessage = "Ocorreu um erro inesperado.";

      if (error instanceof ApolloError && error.message.includes("Invalid")) {
        errorMessage = "Credenciais inválidas.";
      }

      Alert.alert("Erro", errorMessage);

      console.error(error);
    }
  });

  function handleOpenPrivacyPolicyModal() {
    setIsPrivacyPolicyModalOpen(true);
  }

  function handleClosePrivacyPolicyModal() {
    setIsPrivacyPolicyModalOpen(false);
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 40,
          paddingTop: 110,
          paddingVertical: 24,
        }}
      >
        <View className="mb-20 items-center space-y-2">
          <Logo width={136} height={50} />

          <Text className="text-sm font-medium text-regal-blue">
            v{process.env.APP_VERSION}
          </Text>
        </View>

        <View>
          <Text style={styles.label}>Usuário</Text>

          <Controller
            name="identifier"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <View>
                <Input
                  style={{
                    backgroundColor: "#F2F9FF",
                    padding: 10,
                    marginVertical: 10,
                    marginBottom: 20,
                    height: 60,
                  }}
                  placeholder="Nome de usuário ou endereço de e-mail"
                  keyboardType="email-address"
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  autoCapitalize="none"
                  value={field.value}
                />

                {error?.message && (
                  <Text className="text-xs font-medium text-red-500">
                    {error.message}
                  </Text>
                )}
              </View>
            )}
          />

          <Text style={styles.label}>Senha</Text>

          <Controller
            name="password"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <View>
                <InputPassword
                  returnKeyType="send"
                  value={field.value}
                  onBlur={field.onBlur}
                  onChangeText={field.onChange}
                  onSubmitEditing={handleLogin}
                />

                {error?.message && (
                  <Text className="text-xs font-medium text-red-500">
                    {error.message}
                  </Text>
                )}
              </View>
            )}
          />

          <View className="mb-4 mt-2 w-full flex-row items-center justify-between">
            <TouchableOpacity onPress={() => navigate("ForgotPassword")}>
              <Text className="text-sm font-semibold text-[#2C5484] underline">
                Esqueceu a senha?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleOpenPrivacyPolicyModal}>
              <Text className="text-sm font-semibold text-[#2C5484] underline">
                Política de Privacidade
              </Text>
            </TouchableOpacity>
          </View>

          <Button
            title="Entrar"
            onPress={handleLogin}
            style={{ height: 70 }}
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>

      <PrivacyPolicyModal
        isOpen={isPrivacyPolicyModalOpen}
        onClose={handleClosePrivacyPolicyModal}
      />
    </View>
  );
};

export default Login;
