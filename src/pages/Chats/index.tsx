import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useMemo, useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import AirPlaneSearch from "~/assets/icons/airplane-search.svg";
import MessagePlusAltIcon from "~/assets/icons/message-plus-alt.svg";
import SealWarning from "~/assets/icons/seal-warning.svg";
import Layout from "~/components/Layout";
import OrbitalBackground from "~/components/OrbitalBackground";
import { Spinner } from "~/components/Spinner";
import { useChatListData } from "~/hooks/useChatListData";
import { usePendingChatMessageStatesData } from "~/hooks/usePendingChatMessageStatesData";
import { FilterButton } from "../Activities/ActivitiesList/FilterButton";
import { ChatGroups } from "./ChatGroups";
import { SearchChatsContent } from "./SearchChatsContent";

export type ActiveTab = "leaders" | "groups";

export const Chats: React.FC = () => {
  const { navigate } = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("leaders");
  const {
    chats,
    hasMore,
    isLoading,
    hasMoreSearch,
    fetchMoreChats,
    isFetchingMore,
    setHasMoreSearch,
  } = useChatListData(activeTab === "groups" ? "group" : "direct");

  const { pendingStates } = usePendingChatMessageStatesData(
    activeTab === "leaders" ? "group" : "direct",
  );

  function handleCreateChat() {
    navigate("CreateChat");
  }

  function handleSearchChat() {
    navigate("FlightSearch");
  }

  const shouldShowNotification = useMemo(() => {
    return pendingStates.some(pendingState => pendingState.messageHasPriority);
  }, [pendingStates]);

  function toggleModal() {
    setModalVisible(currentIsModalVisible => !currentIsModalVisible);
  }

  return (
    <OrbitalBackground>
      <Layout>
        <View className="mt-2 w-full flex-row items-center justify-between px-6">
          <Text className="text-lg font-semibold text-[#034881]">Chats</Text>

          <View className="flex-row space-x-1">
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={handleSearchChat}
              className="rounded-full p-1"
            >
              <AirPlaneSearch width={24} height={24} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={toggleModal}
              className="rounded-full p-1"
            >
              <Feather name="search" size={24} color="#034881" />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={handleCreateChat}
              className="rounded-full p-1"
            >
              <MessagePlusAltIcon />
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          transparent
          statusBarTranslucent
          animationType="slide"
          visible={isModalVisible}
        >
          <SearchChatsContent
            chats={chats}
            isLoading={isLoading}
            activeTab={activeTab}
            hasMore={hasMoreSearch}
            toggleModal={toggleModal}
            isFetchingMore={isFetchingMore}
            fetchMoreChats={fetchMoreChats}
            setHasMoreSearch={setHasMoreSearch}
          />
        </Modal>

        <View className="my-4 h-0.5 w-full bg-[#EDEDED]" />

        <View className="mb-4 flex-row items-center px-6">
          <FilterButton
            label="Individual"
            isActive={activeTab === "leaders"}
            onSelect={() => setActiveTab("leaders")}
            icon={
              shouldShowNotification && activeTab === "groups" ? (
                <SealWarning width={20} height={20} />
              ) : null
            }
          />

          <FilterButton
            hasLeftMargin
            label="Grupos"
            isActive={activeTab === "groups"}
            onSelect={() => setActiveTab("groups")}
            icon={
              shouldShowNotification && activeTab === "leaders" ? (
                <SealWarning width={20} height={20} />
              ) : null
            }
          />
        </View>

        {isLoading ? (
          <Spinner size={40} />
        ) : (
          <ChatGroups
            chats={chats}
            hasMore={hasMore}
            activeTab={activeTab}
            isFetchingMore={isFetchingMore}
            fetchMoreChats={() => fetchMoreChats()}
          />
        )}
      </Layout>
    </OrbitalBackground>
  );
};
