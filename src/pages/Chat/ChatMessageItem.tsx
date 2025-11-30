import dayjs from "dayjs";
import {
  Dispatch,
  Fragment,
  MutableRefObject,
  SetStateAction,
  memo,
} from "react";
import type { ChatType } from "~/graphql/queries/chats";
import type { ChatUser, Message } from "~/hooks/useChatData";
import { ChatDateGroup } from "./ChatDateGroup";
import { ChatMessage, ChatMessageRef } from "./ChatMessage";

interface ChatMessageItemProps {
  index: number;
  message: Message;
  chatType?: ChatType;
  messages: Message[];
  chatUsers: ChatUser[];
  searchMessage?: string;
  chatMessagesRef: MutableRefObject<ChatMessageRef[]>;
  setMessageToReplyId: Dispatch<SetStateAction<string | null>>;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = memo(
  ({
    index,
    message,
    messages,
    chatType,
    chatUsers,
    searchMessage,
    chatMessagesRef,
    setMessageToReplyId,
  }) => {
    const nextMessage = messages.at(index + 1);
    const createdAt = dayjs(message.createdAt);
    const date = createdAt.format("YYYY-MM-DD");

    const shouldRenderDate =
      !nextMessage || !createdAt.isSame(nextMessage.createdAt, "day");

    return (
      <Fragment key={message.id}>
        <ChatMessage
          chatUsers={chatUsers}
          chatType={chatType}
          chatMessage={message}
          search={searchMessage}
          setMessageToReplyId={setMessageToReplyId}
          ref={ref => {
            if (ref) {
              chatMessagesRef.current[index] = ref;
            }
          }}
        />

        {shouldRenderDate && <ChatDateGroup date={date} />}
      </Fragment>
    );
  },
);
