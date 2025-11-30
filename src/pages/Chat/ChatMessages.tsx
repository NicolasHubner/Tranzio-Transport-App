import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  forwardRef,
  useRef,
} from "react";
import {
  Alert,
  FlatList,
  Text,
  View,
  ViewToken,
  ViewabilityConfigCallbackPairs,
} from "react-native";
import { Spinner } from "~/components/Spinner";
import { ChatType } from "~/graphql/queries/chats";
import { ChatUser, Message } from "~/hooks/useChatData";
import { ChatMessageRef } from "./ChatMessage";
import { ChatMessageItem } from "./ChatMessageItem";

interface ChatMessagesProps {
  hasMore: boolean;
  isLoading: boolean;
  messages: Message[];
  chatType?: ChatType;
  chatUsers: ChatUser[];
  searchMessage: string;
  isFetchingMore: boolean;
  fetchMoreMessages: () => void;
  setIsShowingScrollToStartButton: Dispatch<SetStateAction<boolean>>;
  messagesInViewRef: MutableRefObject<number[]>;
  chatMessagesRef: MutableRefObject<ChatMessageRef[]>;
  setMessageToReplyId: Dispatch<SetStateAction<string | null>>;
}

export const ChatMessages = forwardRef<FlatList, ChatMessagesProps>(
  (
    {
      hasMore,
      messages,
      chatType,
      chatUsers,
      isLoading,
      searchMessage,
      isFetchingMore,
      chatMessagesRef,
      fetchMoreMessages,
      messagesInViewRef,
      setMessageToReplyId,
      setIsShowingScrollToStartButton,
    },
    messagesFlatlistRef,
  ) => {
    const viewabilityConfigCallbackPairs =
      useRef<ViewabilityConfigCallbackPairs>([
        {
          viewabilityConfig: { itemVisiblePercentThreshold: 2.5 },
          onViewableItemsChanged: ({ changed }: { changed: ViewToken[] }) => {
            messagesInViewRef.current = changed.map(item => item.index!);
            setIsShowingScrollToStartButton(
              messagesInViewRef.current.some(index => index >= 4),
            );
          },
        },
      ]);

    return (
      <FlatList
        ref={messagesFlatlistRef}
        inverted
        data={messages}
        onEndReachedThreshold={0.25}
        onEndReached={hasMore ? fetchMoreMessages : undefined}
        ItemSeparatorComponent={() => <View className="my-2" />}
        ListHeaderComponent={isLoading ? <Spinner size={32} /> : undefined}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        keyExtractor={message => message.temporaryId || message.id!.toString()}
        ListFooterComponent={isFetchingMore ? <Spinner size={32} /> : undefined}
        onScrollToIndexFailed={() => {
          Alert.alert("Busca", "Não encontramos mais mensagens.");
        }}
        renderItem={({ item: message, index }) => (
          <ChatMessageItem
            index={index}
            message={message}
            messages={messages}
            chatType={chatType}
            chatUsers={chatUsers}
            searchMessage={searchMessage}
            chatMessagesRef={chatMessagesRef}
            setMessageToReplyId={setMessageToReplyId}
          />
        )}
        contentContainerStyle={{
          paddingVertical: 8,
          paddingHorizontal: 16,
        }}
        ListEmptyComponent={() => (
          <Text
            // para desfazer o inverted para o ListEmptyComponent
            style={{ transform: [{ scaleY: -1 }] }}
            className="mt-auto text-center text-sm font-medium text-[#034881]"
          >
            Sem mensagens aqui... Envie a primeira mensagem!
          </Text>
        )}
      />
    );
  },
);
