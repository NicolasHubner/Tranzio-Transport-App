import { AntDesign } from "@expo/vector-icons";
import { Dispatch, SetStateAction } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useAuth } from "~/hooks/useAuth";
import { ChatUser, Message } from "~/hooks/useChatData";
import { formatChatMessage } from "~/utils/formatChatMessage";

interface MessageToReplyProps {
  chatUsers?: ChatUser[];
  messageToReply: Message;
  setMessageToReplyId: Dispatch<SetStateAction<string | null>>;
}

export const MessageToReply: React.FC<MessageToReplyProps> = ({
  chatUsers,
  messageToReply,
  setMessageToReplyId,
}) => {
  const { user: loggedUser } = useAuth();

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      className="flex w-full flex-row items-center justify-between space-x-2 bg-[#d7d7d7] px-3 py-3"
    >
      <View className="min-w-[80px] flex-1 flex-col items-start rounded-md border-l-4 border-[#002DE3] bg-gray-50 px-3 py-1">
        <Text>
          {messageToReply.owner.id.toString() === loggedUser?.id
            ? "Você"
            : messageToReply.owner.name}
        </Text>

        <Text className="text-sm font-semibold text-[#034881]">
          {formatChatMessage(messageToReply.message, {
            users: chatUsers,
            loggedUserId: loggedUser?.id,
          })}
        </Text>
      </View>

      <TouchableOpacity
        className="shrink-0"
        onPress={() => setMessageToReplyId(null)}
      >
        <AntDesign name="closecircle" size={24} color="red" />
      </TouchableOpacity>
    </Animated.View>
  );
};
