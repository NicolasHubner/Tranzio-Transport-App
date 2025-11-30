import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  UpdateAttendanceServiceDayMutationResponse,
  UpdateAttendanceServiceDayMutationVariables,
  updateAttendanceServiceDayMutation,
} from "~/graphql/mutations/update-attendance-service-day";
import {
  UserByIdQueryResponse,
  UserByIdQueryVariables,
  userByIdQuery,
} from "~/graphql/queries/user";
import { useAuth } from "~/hooks/useAuth";
import { apolloClient } from "~/lib/apollo";

interface UpdatedAttendanceServiceDayFormProps {
  qtdUsers: number;
  id: string;
}

export const UpdatedAttendanceServiceDayForm: React.FC<
  UpdatedAttendanceServiceDayFormProps
> = ({ qtdUsers, id }) => {
  const [isUpdatingShift, setIsUpdatingShift] = useState(false);
  const [count, setCount] = useState(qtdUsers);
  const { goBack } = useNavigation();
  const { user } = useAuth();

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  async function handleUpdateCount() {
    setIsUpdatingShift(true);
    try {
      const { data } = await apolloClient.mutate<
        UpdateAttendanceServiceDayMutationResponse,
        UpdateAttendanceServiceDayMutationVariables
      >({
        mutation: updateAttendanceServiceDayMutation,
        variables: {
          id: id,
          qtdUsers: count,
        },
      });

      const userByIdData = apolloClient.readQuery<
        UserByIdQueryResponse,
        UserByIdQueryVariables
      >({
        query: userByIdQuery,
        variables: {
          id: user?.id,
        },
      });

      if (userByIdData && data) {
        apolloClient.writeQuery<UserByIdQueryResponse, UserByIdQueryVariables>({
          query: userByIdQuery,
          variables: {
            id: user?.id,
          },
          data: {
            ...userByIdData,
            usersPermissionsUser: {
              ...userByIdData.usersPermissionsUser,
              data: {
                ...userByIdData.usersPermissionsUser.data,
                attributes: {
                  ...userByIdData.usersPermissionsUser.data.attributes,
                  attendanceServiceDay: data.updateAttendanceServiceDay,
                },
              },
            },
          },
        });
      }

      Alert.alert("Sucesso", "Equipe atualizada com sucesso!");
      goBack();
    } catch (error) {
      setIsUpdatingShift(false);
      Alert.alert("Erro", "Não foi possível atualizar a equipe.");
    }
  }
  return (
    <View className="flex-1 px-4 pb-7">
      <View className="flex-row space-x-2 px-1 py-5">
        <View className="flex w-full flex-row items-center justify-center">
          <TouchableOpacity
            onPress={decrement}
            className="h-[43px] flex-1 items-center justify-center rounded-l-lg bg-[#034881]"
          >
            <Text className="text-3xl font-medium text-white">-</Text>
          </TouchableOpacity>

          <TextInput
            className="h-full flex-1 bg-[#F2F9FF] px-3 py-1 text-center text-2xl font-medium text-[#2C5484]"
            value={count.toString()}
            onChangeText={text => setCount(parseInt(text) || 0)}
          />
          <TouchableOpacity
            onPress={increment}
            className="h-[43px] flex-1 items-center justify-center rounded-r-lg bg-[#034881]"
          >
            <Text className="text-3xl font-medium text-white">+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.6}
        onPress={handleUpdateCount}
        disabled={isUpdatingShift}
        className="mt-auto items-center rounded-md bg-[#034881] px-3 py-4"
      >
        {isUpdatingShift ? (
          <ActivityIndicator size={24} color="white" />
        ) : (
          <Text className="text-base font-semibold uppercase text-white">
            Atualizar equipe
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};
