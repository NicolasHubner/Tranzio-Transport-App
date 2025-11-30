import { useLayoutEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import type { ChatType } from "~/graphql/queries/chats";
import { getAccessToken } from "~/utils/accessToken";
import { WEB_SOCKET_URL } from "~/utils/constants";
import { useAuth } from "./useAuth";
import { Message, MessageState } from "./useChatListData";

type Socket = ReturnType<typeof io>;

interface PendingState {
  stateId: number | string;
  messageHasPriority: boolean | null;
}

export interface UpdateMessageData {
  updatedMessage: Message;
}

export interface UpdateMessageStateData {
  updatedMessageState: MessageState;
  messageHasPriority: boolean | null;
}

interface UseChatData {
  isLoading: boolean;
  pendingStates: PendingState[];
}

export function usePendingChatMessageStatesData(
  chatType?: ChatType,
): UseChatData {
  const socketRef = useRef<Socket>();
  const { user: loggedUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [pendingStates, setPendingStates] = useState<PendingState[]>([]);

  const loggedUserId = loggedUser?.id;

  useLayoutEffect(() => {
    if (!loggedUserId) return;
    setIsLoading(true);
    setPendingStates([]);

    const socket = io(WEB_SOCKET_URL, {
      query: {
        accessToken: getAccessToken(),
      },
    });

    socketRef.current = socket;
    socket.emit("chat-pending-message-states-room:join", { chatType });

    socket.on(
      "chat-pending-message-states-room:pending-states",
      (states: PendingState[]) => {
        setIsLoading(false);
        setPendingStates(states);
      },
    );

    socket.on(
      "chat-pending-message-states-room:update-message",
      ({ updatedMessage }: UpdateMessageData) => {
        updatedMessage.chatMessageStates.forEach(messageState => {
          if (
            messageState.receiver?.id.toString() === loggedUserId.toString()
          ) {
            setPendingStates(currentPendingStates => {
              const exists = currentPendingStates.some(
                state =>
                  state.stateId.toString() === messageState.id.toString(),
              );

              if (exists && messageState.state === "seen") {
                return currentPendingStates.filter(
                  state =>
                    state.stateId.toString() === messageState.id.toString(),
                );
              }

              if (!exists && messageState.state === "pending") {
                return [
                  ...currentPendingStates,
                  {
                    messageHasPriority: updatedMessage.hasPriority,
                    stateId: messageState.id,
                  },
                ];
              }

              return currentPendingStates;
            });
          }
        });
      },
    );

    socket.on(
      "chat-pending-message-states-room:update-message-state",
      ({ updatedMessageState, messageHasPriority }: UpdateMessageStateData) => {
        setPendingStates(currentPendingStates => {
          const exists = currentPendingStates.some(state => {
            return (
              state.stateId.toString() === updatedMessageState.id.toString()
            );
          });

          if (exists && updatedMessageState.state === "seen") {
            return currentPendingStates.filter(state => {
              return (
                state.stateId.toString() !== updatedMessageState.id.toString()
              );
            });
          }

          if (!exists && updatedMessageState.state === "pending") {
            return [
              ...currentPendingStates,
              {
                messageHasPriority,
                stateId: updatedMessageState.id,
              },
            ];
          }

          return currentPendingStates;
        });
      },
    );

    return () => {
      socket.disconnect();
    };
  }, [loggedUserId, chatType]);

  return {
    isLoading,
    pendingStates,
  };
}
