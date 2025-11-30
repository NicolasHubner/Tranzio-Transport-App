import { useNavigation } from "@react-navigation/native";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useMMKVObject } from "react-native-mmkv";
import { io } from "socket.io-client";
import type { ChatMessageState } from "~/graphql/queries/chatMessagesByChatId";
import type { ChatType } from "~/graphql/queries/chats";
import { storage } from "~/lib/mmkv";
import { getAccessToken } from "~/utils/accessToken";
import { WEB_SOCKET_URL } from "~/utils/constants";
import { useAuth } from "./useAuth";

type Socket = ReturnType<typeof io>;

export interface MessageState {
  id: number | string;
  state: ChatMessageState;
  receiver?: {
    id: number | string;
  };
}

export interface Message {
  id: number | string;
  message: string | null;
  imageUrl: string | null;
  createdAt: string;
  hasPriority: boolean | null;
  chatMessageStates: MessageState[];
  owner: {
    id: number | string;
    name: string;
  };
}

export interface Chat {
  id: number | string;
  type: ChatType;
  name: string | null;
  chatMessages: Message[];
  users: Array<{
    id: number | string;
    name: string;
    department: {
      name: string;
    } | null;
    role: {
      name: string;
    } | null;
    team: {
      name: string;
      shift: string;
    } | null;
  }>;
}

interface InitialData {
  chats: Chat[];
  hasMore: boolean;
}

interface MoreChatsData {
  chats: Chat[];
  hasMore: boolean;
  isSearch: boolean;
}

interface DeleteMemberData {
  chatId: string | number;
  memberId: string | number;
}

interface UpdateMessageData {
  chatId: string;
  updatedMessage: Message;
}

interface UpdateMessageStateData {
  chatId: string;
  messageId: number;
  updatedMessageState: MessageState;
}

const CHAT_LIST_PER_PAGE = 10;

interface UseChatListData {
  chats: Chat[];
  hasMore: boolean;
  isLoading: boolean;
  hasMoreSearch: boolean;
  isFetchingMore: boolean;
  fetchMoreChats: () => void;
  addDirectChat: (userId: string) => void;
  setHasMoreSearch: Dispatch<SetStateAction<boolean>>;
}

export function useChatListData(chatType?: ChatType): UseChatListData {
  const socketRef = useRef<Socket>();
  const { navigate } = useNavigation();
  const { user: loggedUser } = useAuth();
  const [hasMore, setHasMore] = useState(false);
  const nextChatCursorRef = useRef<Chat["id"]>();
  const [isLoading, setIsLoading] = useState(true);
  const [hasMoreSearch, setHasMoreSearch] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const storageKey = `@cfs/chat-list-${chatType}`;
  const [chats, _setChats] = useMMKVObject<Chat[]>(storageKey, storage);

  const setChats = useCallback(
    (value: Chat[] | ((currentMessages: Chat[]) => Chat[])) => {
      if (typeof value === "function") {
        const existingChats = storage.getString(storageKey);

        return _setChats(
          value(existingChats ? JSON.parse(existingChats) : undefined),
        );
      }

      return _setChats(value);
    },
    [_setChats, storageKey],
  );

  const loggedUserId = loggedUser?.id;

  useEffect(() => {
    if (!loggedUserId) return;
    setIsLoading(!storage.getString(storageKey));

    const socket = io(WEB_SOCKET_URL, {
      query: {
        accessToken: getAccessToken(),
      },
    });

    socketRef.current = socket;
    socket.emit("chat-waiting-room:join", {
      type: chatType,
      perPage: CHAT_LIST_PER_PAGE,
    });

    socket.on(
      "chat-waiting-room:initial-data",
      ({ chats, hasMore }: InitialData) => {
        setIsLoading(false);
        setHasMore(hasMore);
        setChats(chats);
        nextChatCursorRef.current = chats.at(-1)?.id;
      },
    );

    socket.on(
      "chat-waiting-room:more-chats",
      ({ chats, hasMore, isSearch }: MoreChatsData) => {
        if (isSearch) {
          setHasMoreSearch(hasMore);
        } else {
          setHasMore(hasMore);
        }

        setIsFetchingMore(false);
        nextChatCursorRef.current = chats.at(-1)?.id;
        setChats(currentChats => {
          const currentChatIdsMap = new Map<string, number>();

          currentChats.forEach((chat, index) => {
            currentChatIdsMap.set(chat.id.toString(), index);
          });

          const newChats = [...currentChats];

          chats.forEach(chat => {
            if (chat.type !== chatType) return;
            const existingIndex = currentChatIdsMap.get(chat.id.toString());

            if (typeof existingIndex === "number") {
              newChats[existingIndex] = chat;
            } else {
              newChats.push(chat);
            }
          });

          return newChats;
        });
      },
    );

    socket.on(
      "chat-waiting-room:update-message",
      ({ chatId, updatedMessage }: UpdateMessageData) => {
        setChats(currentChats => {
          const targetChatIndex = currentChats.findIndex(
            chat => chat.id.toString() === chatId.toString(),
          );

          if (targetChatIndex < 0) {
            socketRef.current?.emit("chat-waiting-room:request-chat", chatId);
            return currentChats;
          }

          const targetMessageIndex = currentChats[
            targetChatIndex
          ].chatMessages.findIndex(
            message => message.id.toString() === updatedMessage.id.toString(),
          );

          if (targetMessageIndex < 0) {
            return currentChats.map(chat => {
              if (chat.id.toString() === chatId.toString()) {
                return {
                  ...chat,
                  chatMessages: [updatedMessage, ...chat.chatMessages],
                };
              }

              return chat;
            });
          }

          return currentChats.map(chat => {
            if (chat.id.toString() === chatId.toString()) {
              return {
                ...chat,
                chatMessages: chat.chatMessages.map(message => {
                  if (message.id.toString() === updatedMessage.id.toString()) {
                    return updatedMessage;
                  }

                  return message;
                }),
              };
            }

            return chat;
          });
        });
      },
    );

    socket.on(
      "chat-waiting-room:update-message-state",
      ({ chatId, messageId, updatedMessageState }: UpdateMessageStateData) => {
        setChats(currentChats => {
          const targetChatIndex = currentChats.findIndex(
            chat => chat.id.toString() === chatId.toString(),
          );

          if (targetChatIndex < 0) {
            socketRef.current?.emit("chat-waiting-room:request-chat", chatId);
            return currentChats;
          }

          const targetMessageIndex = currentChats[
            targetChatIndex
          ].chatMessages.findIndex(
            message => message.id.toString() === messageId.toString(),
          );

          if (targetMessageIndex < 0) {
            return currentChats;
          }

          const targetMessageStateIndex = currentChats[
            targetChatIndex
          ].chatMessages[targetMessageIndex].chatMessageStates.findIndex(
            state => {
              return state.id.toString() === updatedMessageState.id.toString();
            },
          );

          if (targetMessageStateIndex < 0) {
            return currentChats.map(chat => {
              if (chat.id.toString() === chatId.toString()) {
                return {
                  ...chat,
                  chatMessages: chat.chatMessages.map(message => {
                    if (message.id.toString() === messageId.toString()) {
                      return {
                        ...message,
                        chatMessageStates: [
                          ...message.chatMessageStates,
                          updatedMessageState,
                        ],
                      };
                    }

                    return message;
                  }),
                };
              }

              return chat;
            });
          }

          return currentChats.map(chat => {
            if (chat.id.toString() === chatId.toString()) {
              return {
                ...chat,
                chatMessages: chat.chatMessages.map(message => {
                  if (message.id.toString() === messageId.toString()) {
                    return {
                      ...message,
                      chatMessageStates: message.chatMessageStates.map(
                        state => {
                          if (
                            state.id.toString() ===
                            updatedMessageState.id.toString()
                          ) {
                            return updatedMessageState;
                          }

                          return state;
                        },
                      ),
                    };
                  }

                  return message;
                }),
              };
            }

            return chat;
          });
        });
      },
    );

    socket.on("chat-waiting-room:new-chat-ready", (chatId: number) => {
      navigate("Chat", { chatId: chatId.toString() });
    });

    socket.on(
      "chat-waiting-room:delete-member",
      ({ chatId, memberId }: DeleteMemberData) => {
        if (loggedUserId === memberId.toString()) {
          setChats(currentChats => {
            return currentChats.filter(
              chat => chat.id.toString() !== chatId.toString(),
            );
          });
        }
      },
    );

    socket.on("chat-waiting-room:new-chat", (newChat: Chat) => {
      setChats(currentChats => {
        if (
          newChat.type !== chatType ||
          currentChats.some(
            chat => chat.id.toString() === newChat.id.toString(),
          )
        ) {
          return currentChats;
        }

        return [...currentChats, newChat];
      });
    });

    socket.on(
      "chat:new-name-chat",
      ({ chatId, newChatName }: { chatId: string; newChatName: string }) => {
        setChats(currentChats => {
          return currentChats.map(chat => {
            if (chat.id.toString() === chatId.toString()) {
              return {
                ...chat,
                name: newChatName,
              };
            }

            return chat;
          });
        });
      },
    );

    return () => {
      socket.disconnect();
    };
  }, [loggedUserId, navigate, chatType, storageKey, setChats]);

  const sortedChats = useMemo((): Chat[] => {
    if (!chats) {
      return [];
    }

    return [...chats].sort((a, b) => {
      const aLastMessage = a.chatMessages.at(0);
      const bLastMessage = b.chatMessages.at(0);

      if (!aLastMessage && !bLastMessage) {
        return 0;
      }

      if (!aLastMessage) {
        return 1;
      }

      if (!bLastMessage) {
        return -1;
      }

      return (
        new Date(bLastMessage.createdAt).getTime() -
        new Date(aLastMessage.createdAt).getTime()
      );
    });
  }, [chats]);

  const addDirectChat: UseChatListData["addDirectChat"] = (userId: string) => {
    socketRef.current?.emit("chat-waiting-room:add-direct-chat", { userId });
  };

  const fetchMoreChats: UseChatListData["fetchMoreChats"] = (
    search?: string,
  ) => {
    setIsFetchingMore(true);
    let cursor: string | null = null;
    const lastChat = sortedChats.at(-1);

    if (lastChat) {
      const lastChatMessage = lastChat.chatMessages.at(0);

      if (lastChatMessage) {
        cursor = `message:${lastChatMessage.id}`;
      } else {
        cursor = `chat:${nextChatCursorRef.current ?? lastChat.id}:${sortedChats
          .filter(chat => chat.chatMessages.length === 0)
          .map(chat => chat.id)
          .join(",")}`;
      }
    }

    socketRef.current?.emit("chat-waiting-room:request-more-chats", {
      cursor,
      search,
      type: chatType,
      perPage: CHAT_LIST_PER_PAGE,
    });
  };

  return {
    hasMore,
    isLoading,
    hasMoreSearch,
    addDirectChat,
    fetchMoreChats,
    isFetchingMore,
    setHasMoreSearch,
    chats: sortedChats,
  };
}
