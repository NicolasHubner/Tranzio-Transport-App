import { useNavigation } from "@react-navigation/native";
import { FlatList, Text, View } from "react-native";
import { ChatCard } from "~/components/ChatCard";
import { Spinner } from "~/components/Spinner";
import { useAuth } from "~/hooks/useAuth";
import { Chat } from "~/hooks/useChatListData";
import { formatChatMessage } from "~/utils/formatChatMessage";
import { ActiveTab } from ".";

interface ChatGroupsProps {
  chats: Chat[];
  hasMore: boolean;
  activeTab: ActiveTab;
  isFetchingMore: boolean;
  fetchMoreChats: () => void;
  onNavigateToChat?: () => void;
}

export const ChatGroups: React.FC<ChatGroupsProps> = ({
  chats,
  hasMore,
  activeTab,
  fetchMoreChats,
  isFetchingMore,
  onNavigateToChat,
}) => {
  const { navigate } = useNavigation();
  const { user: loggedUser } = useAuth();

  return (
    <FlatList
      data={chats}
      onEndReachedThreshold={0.25}
      keyExtractor={chat => chat.id.toString()}
      onEndReached={hasMore ? fetchMoreChats : undefined}
      contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}
      ListFooterComponent={isFetchingMore ? <Spinner size={32} /> : undefined}
      ItemSeparatorComponent={() => (
        <View className="mb-1 mt-3 h-0.5 w-full bg-[#EDEDED]" />
      )}
      ListEmptyComponent={() => (
        <Text className="text-center text-sm font-medium text-[#034881]">
          {`Nenhum chat ${
            activeTab === "leaders" ? "direto" : "de grupo"
          } aberto...`}
        </Text>
      )}
      renderItem={({ item: chat }) => {
        const lastMessage = chat.chatMessages.at(0);

        return (
          <ChatCard
            onPress={() => {
              navigate("Chat", { chatId: chat.id.toString() });
              onNavigateToChat?.();
            }}
            lastMessage={
              lastMessage?.imageUrl
                ? "Uma imagem..."
                : lastMessage?.message
                ? formatChatMessage(lastMessage.message, {
                    users: chat.users,
                    loggedUserId: loggedUser?.id,
                  })
                : undefined
            }
            lastMessageAt={lastMessage?.createdAt}
            name={
              chat.name ||
              chat.users.find(({ id }) => id.toString() !== loggedUser?.id)
                ?.name ||
              "Default"
            }
            hasPriority={chat.chatMessages.some(chatMessage => {
              return (
                chatMessage.hasPriority &&
                chatMessage.chatMessageStates.some(state => {
                  return (
                    state.state === "pending" &&
                    state.receiver?.id.toString() === loggedUser?.id
                  );
                })
              );
            })}
            isMentioned={chat.chatMessages.some(chatMessage => {
              return (
                chatMessage.message &&
                new RegExp(`@\\[[^\\]]*\\]\\(${loggedUser?.id}\\)`, "gm").test(
                  chatMessage.message,
                ) &&
                chatMessage.chatMessageStates.some(state => {
                  return (
                    state.state === "pending" &&
                    state.receiver?.id.toString() === loggedUser?.id
                  );
                })
              );
            })}
            notificationCount={chat.chatMessages.reduce(
              (count, chatMessage) => {
                chatMessage.chatMessageStates.forEach(state => {
                  if (
                    state.state === "pending" &&
                    state.receiver?.id.toString() === loggedUser?.id
                  ) {
                    count++;
                  }
                });

                return count;
              },
              0,
            )}
          />
        );
      }}
    />
  );
};
