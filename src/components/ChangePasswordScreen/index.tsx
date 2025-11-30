import React from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import Logo from "~/assets/logo.svg";
import {
  UpdateUserPasswordResponse,
  UpdateUserPasswordVariables,
  updateUserPasswordMutation,
} from "~/graphql/queries/updateUserPassword";
import { useAuth } from "~/hooks/useAuth";
import { apolloClient } from "~/lib/apollo";

const ChangePasswordScreen = () => {
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const { user, logout } = useAuth();

  const handleChangePassword = async () => {
    try {
      await apolloClient.mutate<
        UpdateUserPasswordResponse,
        UpdateUserPasswordVariables
      >({
        mutation: updateUserPasswordMutation,
        variables: {
          id: user!.id,
          input: {
            password: confirmPassword,
            isFirstLogin: false,
          },
        },
      });
      logout();
      Alert.alert("Sucesso", "Senha alterada com sucesso!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View className="mx-4 flex h-screen flex-col items-center justify-center">
      <View className="mb-24">
        <Logo width={136} height={50} />
      </View>
      <Text className="text-base font-bold text-[#1a4a7a]">Nova Senha</Text>
      <TextInput
        placeholder="Nova Senha"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        className="mt-4 w-full rounded-md border border-gray-300 p-2"
      />
      <TextInput
        placeholder="Confirmar Nova Senha"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        className="mb-4 mt-4 w-full rounded-md border border-gray-300 p-2"
      />
      <View className="flex flex-row gap-2">
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={handleChangePassword}
          className="items-center justify-center rounded-md bg-[#034881] px-8 py-4"
        >
          <Text className="text-base font-semibold  text-white">
            Alterar Senha
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.6}
          onPress={logout}
          className="items-center justify-center rounded-md bg-[#034881] px-12 py-4"
        >
          <Text className="text-base font-semibold  text-white">Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChangePasswordScreen;
