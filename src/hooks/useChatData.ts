import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMMKVObject } from "react-native-mmkv";
import { io } from "socket.io-client";
import { useInternetConnectionContext } from "~/contexts/InternetConnectionContext";
import type { ChatMessageState } from "~/graphql/queries/chatMessagesByChatId";
import { storage } from "~/lib/mmkv";
import { getAccessToken } from "~/utils/accessToken";
import { WEB_SOCKET_URL } from "~/utils/constants";
import { useAuth } from "./useAuth";

function mergeMessages(
  currentMessages: Message[],
  messages: Message[],
): Message[] {
  const currentMessageIdsMap = new Map<string, number>();

  currentMessages.forEach((message, index) => {
    if (message.id) {
      currentMessageIdsMap.set(message.id.toString(), index);
    }
  });

  const newMessages = [...currentMessages];

  messages.forEach(message => {
    const existingIndex = message.id
      ? currentMessageIdsMap.get(message.id.toString())
      : undefined;

    if (typeof existingIndex === "number") {
      newMessages[existingIndex] = message;
    } else {
      newMessages.push(message);
    }
  });

  return newMessages;
}

type Socket = ReturnType<typeof io>;

export interface Message {
  id?: number;
  temporaryId?: string;
  message: string;
  createdAt: string;
  hasPriority: boolean | null;
  imageUrl: string | null;
  owner: {
    id: number | string;
    name: string;
  };
  chatMessageStates: Array<{
    id: number | string;
    state: ChatMessageState;
    receiver?: {
      id: number | string;
    };
  }>;
  rootMessage?: {
    id: number | string;
    message: string;
    createdAt: string;
    hasPriority: boolean | null;
    imageUrl: string | null;
    owner: {
      id: number | string;
      name: string;
    };
  };
}

export interface ChatUser {
  id: number | string;
  name: string;
  username: string;
  companyRole: string | null;
  loginType: "App" | "Web" | null;
  department: { name: string } | null;
  team: { shift: string } | null;
  sector: { name: string } | null;
}

interface ChatData {
  name: string | null;
  type: "direct" | "group";
  users: ChatUser[];
}

interface InitialData {
  chat: ChatData;
  timestamp: string;
  messages: Message[];
}

interface MoreMessagesData {
  hasMore: boolean;
  timestamp: string;
  messages: Message[];
}

interface NewMessageData {
  timestamp: string;
  newMessage: Message;
}

interface UpdateMessageData {
  timestamp: string;
  updatedMessage: Message;
}

interface UpdateMessageStateData {
  messageId: number;
  timestamp: string;
  messageStateId: number;
  newState: ChatMessageState;
}

const CHAT_MESSAGES_PER_PAGE = 10;

interface UseChatData {
  hasMore: boolean;
  isLoading: boolean;
  messages: Message[];
  isFetchingMore: boolean;
  chatData: ChatData | undefined;
  fetchMoreMessages: () => void;
  addMessage: (
    messageData: Pick<
      Message,
      "message" | "hasPriority" | "rootMessage" | "imageUrl"
    >,
  ) => void;
}

export function useChatData(chatId: string): UseChatData {
  const socketRef = useRef<Socket>();
  const { goBack } = useNavigation();
  const { user: loggedUser } = useAuth();
  const [hasMore, setHasMore] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const { isConnected } = useInternetConnectionContext();

  const chatDataStorageKey = `@cfs/chat-data-${chatId}`;
  const [chatData, _setChatData] = useMMKVObject<ChatData>(
    chatDataStorageKey,
    storage,
  );

  const messagesStorageKey = `@cfs/chat-messages-${chatId}`;
  const [messages, _setMessages] = useMMKVObject<Message[]>(
    messagesStorageKey,
    storage,
  );

  const [isLoading, setIsLoading] = useState(typeof messages === "undefined");

  const setChatData = useCallback(
    (
      value:
        | ChatData
        | undefined
        | ((currentMessages: ChatData | undefined) => ChatData | undefined),
    ) => {
      if (typeof value === "function") {
        const existingChatData = storage.getString(messagesStorageKey);

        return _setChatData(
          value(existingChatData ? JSON.parse(existingChatData) : undefined),
        );
      }

      return _setChatData(value);
    },
    [_setChatData, messagesStorageKey],
  );

  const setMessages = useCallback(
    (value: Message[] | ((currentMessages: Message[]) => Message[])) => {
      if (typeof value === "function") {
        const existingMessages = storage.getString(messagesStorageKey);

        return _setMessages(
          value(existingMessages ? JSON.parse(existingMessages) : []),
        );
      }

      return _setMessages(value);
    },
    [_setMessages, messagesStorageKey],
  );

  const loggedUserId = loggedUser?.id;

  useEffect(() => {
    if (!loggedUserId) return;
    setIsLoading(!storage.getString(messagesStorageKey));

    const socket = io(WEB_SOCKET_URL, {
      query: {
        accessToken: getAccessToken(),
      },
      autoConnect: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 999,
    });

    socketRef.current = socket;

    const storageTimestampKey = `${messagesStorageKey}-timestamp`;
    const lastUpdateAt = storage.getString(storageTimestampKey);
    socket.emit("chat:join", {
      chatId,
      lastUpdateAt,
      perPage: CHAT_MESSAGES_PER_PAGE,
    });

    function markMessageAsSeen(message: Message) {
      message.chatMessageStates.forEach(messageState => {
        if (
          messageState.state === "pending" &&
          messageState.receiver?.id.toString() === loggedUserId
        ) {
          socket.emit("chat:update-message-state", {
            chatId,
            newState: "seen",
            messageId: message.id,
            messageStateId: messageState.id,
          });
        }
      });
    }

    socket.on(
      "chat:initial-data",
      ({ messages, chat, timestamp }: InitialData) => {
        setHasMore(true);
        setChatData(chat);
        setIsLoading(false);
        messages.forEach(markMessageAsSeen);
        storage.set(storageTimestampKey, timestamp);
        setMessages(currentMessages => {
          return mergeMessages(currentMessages, messages);
        });
      },
    );

    socket.on(
      "chat:more-messages",
      ({ messages, hasMore, timestamp }: MoreMessagesData) => {
        setHasMore(hasMore);
        setIsFetchingMore(false);
        messages.forEach(markMessageAsSeen);
        storage.set(storageTimestampKey, timestamp);
        setMessages(currentMessages => {
          return mergeMessages(currentMessages, messages);
        });
      },
    );

    socket.on(
      "chat:new-message",
      ({ newMessage, timestamp }: NewMessageData) => {
        storage.set(storageTimestampKey, timestamp);
        setMessages(currentMessages => [newMessage, ...currentMessages]);
      },
    );

    socket.on(
      "chat:update-message",
      ({ updatedMessage, timestamp }: UpdateMessageData) => {
        storage.set(storageTimestampKey, timestamp);
        setMessages(currentMessages => {
          return currentMessages.map(message => {
            if (message.temporaryId === updatedMessage.temporaryId) {
              return updatedMessage;
            }

            return message;
          });
        });

        markMessageAsSeen(updatedMessage);
      },
    );

    socket.on(
      "chat:update-message-state",
      ({
        newState,
        messageId,
        messageStateId,
        timestamp,
      }: UpdateMessageStateData) => {
        storage.set(storageTimestampKey, timestamp);
        setMessages(currentMessages => {
          return currentMessages.map(message => {
            if (message.id?.toString() === messageId?.toString()) {
              return {
                ...message,
                chatMessageStates: message.chatMessageStates.map(
                  messageState => {
                    if (
                      messageState.id.toString() === messageStateId.toString()
                    ) {
                      return {
                        ...messageState,
                        state: newState,
                      };
                    }

                    return messageState;
                  },
                ),
              };
            }

            return message;
          });
        });
      },
    );

    socket.on("chat-members:delete-member", (memberId: number) => {
      if (loggedUserId === memberId.toString()) {
        goBack();
      }
    });

    socket.on(
      "chat:new-name-chat",
      ({ newChatName }: { newChatName: string }) => {
        setChatData(currentChatData => {
          if (!currentChatData) {
            return undefined;
          }

          return {
            ...currentChatData,
            name: newChatName,
          };
        });
      },
    );

    return () => {
      socket.disconnect();
    };
  }, [
    chatId,
    loggedUserId,
    goBack,
    setMessages,
    messagesStorageKey,
    setChatData,
    isConnected,
  ]);

  const sortedMessages = useMemo((): Message[] => {
    if (!messages) {
      return [];
    }

    return [...messages].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [messages]);

  const addMessage: UseChatData["addMessage"] = ({
    message,
    hasPriority,
    rootMessage,
    imageUrl,
  }) => {
    const newMessage: Message = {
      message,
      hasPriority,
      rootMessage,
      imageUrl,
      chatMessageStates: [],
      temporaryId: Date.now().toString(),
      createdAt: new Date().toISOString(),
      owner: {
        id: loggedUser!.id,
        name: loggedUser!.name,
      },
    };

    socketRef.current?.emit("chat:send-message", {
      chatId,
      newMessage,
    });

    setMessages(currentMessages => [newMessage, ...currentMessages]);
  };

  const fetchMoreMessages: UseChatData["fetchMoreMessages"] = () => {
    if (isFetchingMore) return;
    setIsFetchingMore(true);
    socketRef.current?.emit("chat:request-more-messages", {
      chatId,
      cursor: messages?.at(-1)?.id,
      perPage: CHAT_MESSAGES_PER_PAGE,
    });
  };

  return {
    hasMore,
    chatData,
    isLoading,
    addMessage,
    isFetchingMore,
    fetchMoreMessages,
    messages: sortedMessages,
  };
}
