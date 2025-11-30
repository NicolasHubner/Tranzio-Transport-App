import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import MagnifyingGlassIcon from "~/assets/icons/magnifying-glass.svg";
import Layout from "~/components/Layout";
import OrbitalBackground from "~/components/OrbitalBackground";
import { QueryFailed } from "~/components/QueryFailed";
import { Spinner } from "~/components/Spinner";
import { useChatListData } from "~/hooks/useChatListData";
import { useDebouncedValue } from "~/hooks/useDebouncedValue";
import { useUsersForChat } from "~/hooks/useUsersForChat";
import { getInitials } from "~/utils/getInitials";

export const CreateChat: React.FC = () => {
  const { goBack, navigate } = useNavigation();
  const [userQuery, setUserQuery] = useState("");
  const { chats, addDirectChat } = useChatListData();
  const debouncedUserQuery = useDebouncedValue(userQuery, 400);
  const { data, loading, error, refetch } = useUsersForChat({
    variables: {
      query: debouncedUserQuery,
    },
  });

  function handleCreateChat(userId: string) {
    return async () => {
      const existingChatId = chats.find(chat => {
        return (
          chat.type === "direct" &&
          chat.users.some(user => user.id.toString() === userId)
        );
      })?.id;

      if (existingChatId) {
        return navigate("Chat", { chatId: existingChatId.toString() });
      }

      addDirectChat(userId);
    };
  }

  return (
    <OrbitalBackground>
      <Layout back={goBack}>
        <Text className="ml-6 mt-2 text-lg font-semibold text-[#034881]">
          Usuários
        </Text>

        <View className="my-4 h-0.5 w-full bg-[#EDEDED]" />

        <View className="mb-4 px-6">
          <View className="w-full flex-row items-center rounded-lg bg-[#F2F9FF] pl-4">
            <MagnifyingGlassIcon width={24} height={24} fill="#ADB5BD" />

            <TextInput
              value={userQuery}
              returnKeyType="send"
              aria-disabled={loading}
              onChangeText={setUserQuery}
              placeholder="Buscar usuário"
              placeholderTextColor="#ADB5BD"
              className="flex-1 py-3 pl-2 pr-4 text-sm font-semibold text-[#034881]"
            />
          </View>
        </View>

        {loading ? (
          <Spinner size={40} />
        ) : error || !data ? (
          <QueryFailed refetch={refetch} />
        ) : (
          <FlatList
            data={data.usersPermissionsUsers.data}
            keyExtractor={user => user.id}
            contentContainerStyle={{ paddingHorizontal: 24 }}
            ItemSeparatorComponent={() => (
              <View className="mb-1 mt-3 h-0.5 w-full bg-[#EDEDED]" />
            )}
            ListEmptyComponent={() => (
              <Text className="text-center text-sm font-medium text-[#034881]">
                {userQuery
                  ? "Não encontramos nenhum resultado..."
                  : "Sem usuários cadastrados..."}
              </Text>
            )}
            renderItem={({ item: user }) => (
              <TouchableOpacity
                onPress={handleCreateChat(user.id)}
                className="flex-row items-center space-x-4 rounded-2xl bg-[#F0F4F8]"
              >
                <View className="aspect-square w-12 items-center justify-center rounded-2xl bg-[#166FF6]">
                  <Text className="text-sm font-bold text-white">
                    {getInitials(user.attributes.name)}
                  </Text>
                </View>

                <View className="flex-1 items-start space-y-2 py-1">
                  <Text
                    numberOfLines={1}
                    className="text-sm font-medium text-[#034881]"
                  >
                    {user.attributes.name}
                  </Text>

                  <Text
                    numberOfLines={1}
                    className="mt-auto text-xs text-[#034881]"
                  >
                    (RE: {user.attributes.username})
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </Layout>
    </OrbitalBackground>
  );
};
