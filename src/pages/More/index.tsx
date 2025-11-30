import { Octicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import { Fragment, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Avatar from "~/components/Avatar";
import { PrivacyPolicyModal } from "~/components/PrivacyPolicyModal";
import {
  CloseAttendanceServiceDayMutationResponse,
  CloseAttendanceServiceDayMutationVariables,
  closeAttendanceServiceDayMutation,
} from "~/graphql/mutations/close-attendance-service-day";
import {
  UpdateShiftMutationVariables,
  updateShiftMutation,
} from "~/graphql/mutations/update-shift";
import {
  UserByIdQueryResponse,
  UserByIdQueryVariables,
  userByIdQuery,
} from "~/graphql/queries/user";
import { useAuth } from "~/hooks/useAuth";
import { useQueryPolling } from "~/hooks/useQueryPolling";
import { useUserById } from "~/hooks/useUserById";
import { apolloClient } from "~/lib/apollo";
import { pnaeTask, shiftTask } from "../Activity/SendLocation/BackGroundTask";
import { MoreCard } from "./MoreCard";

interface Card {
  id: string;
  title: string;
  description: string;
  onPress?: () => void;
}

export const More: React.FC = () => {
  const navigation = useNavigation();
  const { user, setUser } = useAuth();
  const [isClosingShift, setIsClosingShift] = useState(false);
  const [isPrivacyPolicyModalOpen, setIsPrivacyPolicyModalOpen] =
    useState(false);

  const userId = user?.id;
  const { data, startPolling, stopPolling } = useUserById({
    skip: !userId,
    variables: {
      id: userId,
    },
  });

  async function handleToggleShift() {
    const newIsShiftOpen = !user?.isShiftOpen;

    try {
      await apolloClient.mutate<{}, UpdateShiftMutationVariables>({
        mutation: updateShiftMutation,
        variables: {
          userId: user!.id,
          isShiftOpen: newIsShiftOpen,
        },
      });

      setUser(currentUser => {
        if (!currentUser) {
          return currentUser;
        }

        return {
          ...currentUser,
          isShiftOpen: newIsShiftOpen,
        };
      });

      // Stop all the background tasks when the shift is closed

      await shiftTask.stopLocationTracking();
      await pnaeTask.stopLocationTracking();
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Erro",
        `Não foi possível ${newIsShiftOpen ? "abrir" : "fechar"} o turno.`,
      );
    }
  }

  const cards: Card[] = [
    {
      id: "1",
      title: "Histórico",
      description: "Histórico de atividades",
      onPress: () => {
        navigation.navigate("ActivityHistory");
      },
    },
    {
      id: "2",
      title: "Atualizar equipe",
      description: "Atualizar equipe escalada",
      onPress: () => {
        navigation.navigate("UpdateShiftUserCount");
      },
    },
    {
      id: "3",
      title: "Sincronizar dados",
      description: "10/20 dados sincronizados",
    },
    {
      id: "4",
      title: "Alterações dos voos",
      description: "Visualize as mudanças dos voos",
      onPress: () => {
        navigation.navigate("FlightHistory");
      },
    },
    {
      id: "5",
      title: "Detalhes dos voos",
      description: "Visualize os detalhes dos voos",
      onPress: () => {
        navigation.navigate("Flights");
      },
    },
    {
      id: "6",
      title: "Política de Privacidade",
      description: "Nossa política de privacidade",
      onPress: () => {
        setIsPrivacyPolicyModalOpen(true);
      },
    },
  ];

  useQueryPolling(10000, startPolling, stopPolling);

  async function handleCloseShift() {
    setIsClosingShift(true);

    try {
      const response = await apolloClient.mutate<
        CloseAttendanceServiceDayMutationResponse,
        CloseAttendanceServiceDayMutationVariables
      >({
        mutation: closeAttendanceServiceDayMutation,
        variables: {
          dtEnd: new Date().toISOString(),
          id: data!.usersPermissionsUser.data.attributes.attendanceServiceDay
            .data!.id,
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

      if (response.data && userByIdData) {
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
                  attendanceServiceDay:
                    response.data.updateAttendanceServiceDay,
                },
              },
            },
          },
        });
      }

      Alert.alert("Sucesso", "Turno fechado com sucesso!");
      navigation.reset({
        index: 0,
        routes: [{ name: "HomeStack" }],
      });
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
      Alert.alert("Erro", "Não foi possível fechar o turno.");
    } finally {
      setIsClosingShift(false);
    }
  }

  const hasTodayServiceDay = Boolean(
    data &&
      data.usersPermissionsUser.data.attributes.attendanceServiceDay.data &&
      !data.usersPermissionsUser.data.attributes.attendanceServiceDay.data
        .attributes.dtEnd &&
      dayjs().isSame(
        data.usersPermissionsUser.data.attributes.attendanceServiceDay.data
          .attributes.createdAt,
        "day",
      ),
  );

  function handleClosePrivacyPolicyModal() {
    setIsPrivacyPolicyModalOpen(false);
  }

  return (
    <Fragment>
      <StatusBar
        translucent
        barStyle="light-content"
        backgroundColor="transparent"
      />

      <SafeAreaView className="flex-1 bg-[#2C5484] pt-4">
        <View className="items-center px-10">
          <View className="relative">
            <Avatar size={100} user={user!} />

            <TouchableOpacity
              activeOpacity={0.6}
              className="absolute -bottom-2 -right-2 aspect-square w-9 items-center justify-center rounded-full bg-white"
            >
              <Octicons name="pencil" color="#2C5484" size={24} />
            </TouchableOpacity>
          </View>

          <View className="mt-6 w-full px-2.5 py-2">
            <Text className="text-sm font-light text-[#F2F9FF]">Nome</Text>

            <Text className="text-lg font-normal text-[#F2F9FF]">
              {user?.name}
            </Text>
          </View>
        </View>

        <FlatList
          data={cards}
          keyExtractor={card => card.id}
          contentContainerStyle={{ paddingVertical: 24 }}
          ItemSeparatorComponent={() => <View className="my-1" />}
          renderItem={({ item }) => (
            <MoreCard
              title={item.title}
              onPress={item.onPress}
              description={item.description}
            />
          )}
        />

        {user?.isShiftOpen && (
          <TouchableOpacity
            onPress={handleToggleShift}
            disabled={isClosingShift}
            activeOpacity={0.6}
            className="mx-6 mb-3 mt-auto items-center justify-center rounded-xl bg-[#FF0000] p-6"
          >
            {isClosingShift ? (
              <ActivityIndicator size={24} color="white" />
            ) : (
              <Text className="text-base font-bold uppercase text-white">
                Fechar Turno
              </Text>
            )}
          </TouchableOpacity>
        )}

        {hasTodayServiceDay && (
          <TouchableOpacity
            onPress={handleCloseShift}
            disabled={isClosingShift}
            activeOpacity={0.6}
            className="mx-6 mb-3 mt-auto items-center justify-center rounded-xl bg-[#FF0000] p-6"
          >
            {isClosingShift ? (
              <ActivityIndicator size={24} color="white" />
            ) : (
              <Text className="text-base font-bold uppercase text-white">
                Fechar Turno
              </Text>
            )}
          </TouchableOpacity>
        )}
      </SafeAreaView>

      <PrivacyPolicyModal
        isOpen={isPrivacyPolicyModalOpen}
        onClose={handleClosePrivacyPolicyModal}
      />
    </Fragment>
  );
};
