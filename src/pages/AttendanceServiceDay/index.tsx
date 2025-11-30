import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Apresentation from "~/components/Apresentation";
import Layout from "~/components/Layout";
import OrbitalBackground from "~/components/OrbitalBackground";
import {
  CreateAttendanceServiceDayMutationResponse,
  CreateAttendanceServiceDayMutationVariables,
  createAttendanceServiceDayMutation,
  getAttenceServiceDayByUserId,
} from "~/graphql/mutations/create-attendance-service-day";
import {
  UserByIdQueryResponse,
  UserByIdQueryVariables,
  userByIdQuery,
} from "~/graphql/queries/user";
import { useAuth } from "~/hooks/useAuth";
import { useLoggedUserDepartmentIds } from "~/hooks/useLoggedUserDepartmentIds";
import { apolloClient } from "~/lib/apollo";

export const AttendanceServiceDay: React.FC = () => {
  const { user } = useAuth();
  const { navigate } = useNavigation();
  const [isOpeningShift, setIsOpeningShift] = useState(false);
  const [count, setCount] = useState(0);
  const { departmentIds, isLoading } = useLoggedUserDepartmentIds();

  function handleGoBack() {
    navigate("Home");
  }

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  async function handleOpenShift() {
    setIsOpeningShift(true);

    try {
      //Gambiarra pesada para não precsiar de mexer no banco de dados
      //Puxo os voos anteriores para que o turno aberto tenha os mesmos voos do turno anterior
      // Para funcionar é necessário que já tenha feito um turno aberto antes
      const { data: userAttendencePast } = await apolloClient.query({
        fetchPolicy: "no-cache",
        query: getAttenceServiceDayByUserId,
        variables: {
          userId: Number(user?.id),
        },
      });

      let arrayWithOldFlights: string[] = [];

      if (!userAttendencePast?.attendanceServiceDays?.data[0]) {
        arrayWithOldFlights = [];
      } else {
        arrayWithOldFlights =
          userAttendencePast.attendanceServiceDays?.data[0].attributes.flights.data.map(
            (flight: { id: any }) => String(flight.id),
          );
      }

      const { data } = await apolloClient.mutate<
        CreateAttendanceServiceDayMutationResponse,
        CreateAttendanceServiceDayMutationVariables
      >({
        mutation: createAttendanceServiceDayMutation,
        variables: {
          input: {
            departments: departmentIds,
            userLeader: user!.id,
            publishedAt: new Date().toISOString(),
            dtStart: new Date().toISOString(),
            qtdUsers: count,
            flights: arrayWithOldFlights,
          },
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

      if (data && userByIdData) {
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
                  attendanceServiceDay: data.createAttendanceServiceDay,
                },
              },
            },
          },
        });
      }

      Alert.alert("Sucesso", "Turno aberto com sucesso!");
      navigate("ActivitiesList");
    } catch (error) {
      setIsOpeningShift(false);
      console.error(error);
      Alert.alert("Erro", "Não foi possível abrir o turno.");
    }
  }

  return (
    <OrbitalBackground>
      <Layout back={handleGoBack}>
        <View className="flex-1 px-5 pb-5">
          <View>
            <Apresentation />
          </View>
          <Text className="mt-6 text-sm font-normal text-[#034881]">
            Adicionar colaboradores
          </Text>

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
            onPress={handleOpenShift}
            disabled={isOpeningShift || isLoading}
            className="mt-auto items-center rounded-md bg-[#034881] px-3 py-4"
          >
            {isOpeningShift || isLoading ? (
              <ActivityIndicator size={24} color="white" />
            ) : (
              <Text className="text-base font-semibold uppercase text-white">
                Abrir Turnos
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </Layout>
    </OrbitalBackground>
  );
};
