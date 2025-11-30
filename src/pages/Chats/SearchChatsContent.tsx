import { AntDesign } from "@expo/vector-icons";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import {
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MagnifyingGlassIcon from "~/assets/icons/magnifying-glass.svg";
import OrbitalBackground from "~/components/OrbitalBackground";
import { Spinner } from "~/components/Spinner";
import { Chat } from "~/hooks/useChatListData";
import { useDebouncedValue } from "~/hooks/useDebouncedValue";
import { useUpdateEffect } from "~/hooks/useUpdateEffect";
import { normalizeText } from "~/utils/normalizeText";
import type { ActiveTab } from ".";
import { ChatGroups } from "./ChatGroups";

interface SearchChatsContentProps {
  chats: Chat[];
  hasMore: boolean;
  isLoading: boolean;
  activeTab: ActiveTab;
  toggleModal: () => void;
  isFetchingMore: boolean;
  fetchMoreChats: (search?: string) => void;
  setHasMoreSearch: Dispatch<SetStateAction<boolean>>;
}

export const SearchChatsContent: React.FC<SearchChatsContentProps> = ({
  chats,
  hasMore,
  isLoading,
  activeTab,
  toggleModal,
  isFetchingMore,
  fetchMoreChats,
  setHasMoreSearch,
}) => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 700);

  useUpdateEffect(() => {
    setHasMoreSearch(true);
  }, [debouncedQuery]);

  const filteredChats = useMemo(() => {
    if (!debouncedQuery) {
      return chats;
    }

    return chats.filter(chat => {
      return (
        normalizeText(chat.name).includes(normalizeText(debouncedQuery)) ||
        chat.users.some(user => {
          return normalizeText(user.name).includes(
            normalizeText(debouncedQuery),
          );
        })
      );
    });
  }, [chats, debouncedQuery]);

  function fetchMore() {
    fetchMoreChats(debouncedQuery);
  }

  return (
    <GestureHandlerRootView className="flex-1 bg-white">
      <OrbitalBackground>
        <SafeAreaView className="mt-12 flex-1 items-center">
          <View className="flex-1 self-start">
            <View className="w-full px-6">
              <View className="w-full flex-row items-center self-start rounded-lg bg-[#F2F9FF] pl-4">
                <MagnifyingGlassIcon width={24} height={24} fill="#ADB5BD" />

                <TextInput
                  value={query}
                  returnKeyType="send"
                  onChangeText={setQuery}
                  placeholder="Buscar chat"
                  placeholderTextColor="#ADB5BD"
                  aria-disabled={isLoading || isFetchingMore}
                  className="flex-1 py-3 pl-2 pr-4 text-sm font-semibold text-[#034881]"
                />
              </View>
            </View>

            <View className="mt-4">
              {!debouncedQuery ? (
                <View className="mt-8 items-center justify-center">
                  <Image
                    source={require("./assets/searching.gif")}
                    style={{ width: 120, height: 120 }}
                  />

                  <Text className="text-center font-semibold text-[#ADB5BD]">
                    Faça uma pesquisa...
                  </Text>
                </View>
              ) : isLoading ? (
                <Spinner size={30} />
              ) : !filteredChats.length ? (
                <View className="mt-8 items-center justify-center">
                  <Image
                    source={require("./assets/empty.gif")}
                    style={{ width: 100, height: 100 }}
                  />

                  <Text className="text-center font-semibold text-[#ADB5BD]">
                    Nenhum resultado encontrado...
                  </Text>
                </View>
              ) : (
                <ChatGroups
                  hasMore={hasMore}
                  chats={filteredChats}
                  activeTab={activeTab}
                  fetchMoreChats={fetchMore}
                  isFetchingMore={isFetchingMore}
                  onNavigateToChat={toggleModal}
                />
              )}
            </View>
          </View>

          <TouchableOpacity onPress={toggleModal} className="mb-4">
            <AntDesign name="closecircle" size={34} color="gray" />
          </TouchableOpacity>
        </SafeAreaView>
      </OrbitalBackground>
    </GestureHandlerRootView>
  );
};
