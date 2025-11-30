import { Entypo, Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import React, { Fragment, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MentionInput } from "react-native-controlled-mentions";
import colors from "tailwindcss/colors";
import MagnifyingGlassIcon from "~/assets/icons/magnifying-glass.svg";
import PaperPlaneAltIcon from "~/assets/icons/paper-plane-alt.svg";
import Siren from "~/assets/icons/siren.svg";
import Layout from "~/components/Layout";
import OrbitalBackground from "~/components/OrbitalBackground";
import { Spinner } from "~/components/Spinner";
import { useChatData } from "~/hooks/useChatData";
import { useTodayFlightsQuery } from "~/hooks/useTodayFlights";
import { getAccessToken } from "~/utils/accessToken";
import { imageMimeTypes } from "~/utils/constants";
import { normalizeText } from "~/utils/normalizeText";
import { sleep } from "~/utils/sleep";
import { API_BASE_URL } from "../../utils/constants";
import { ChatMessageRef } from "./ChatMessage";
import { ChatMessages } from "./ChatMessages";
import { ImageModal } from "./ImageModal";
import { MessageToReply } from "./MessageToReply";

export interface ChatParams {
  chatId: string;
}

interface UploadResponse {
  uploadedFileUrl: string;
  fileName: string;
}

export const Chat: React.FC = () => {
  const { params } = useRoute();
  const { goBack } = useNavigation();
  const selectedMessageIndexRef = useRef(-1);
  const messagesInViewRef = useRef<number[]>([]);
  const inputMessageRef = useRef<TextInput>(null);
  const messagesFlatlistRef = useRef<FlatList>(null);
  const [isPriority, setIsPriority] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const chatMessagesRef = useRef<ChatMessageRef[]>([]);
  const { data: flightsData } = useTodayFlightsQuery();
  const [searchMessage, setSearchMessage] = useState("");
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [messageToReplyId, setMessageToReplyId] = useState<string | null>(null);
  const [isShowingScrollToStartButton, setIsShowingScrollToStartButton] =
    useState<boolean>(false);
  const [asset, setAsset] = useState<
    ImagePicker.ImagePickerAsset | undefined
  >();

  const { chatId } = params as ChatParams;
  const {
    hasMore,
    messages,
    chatData,
    isLoading,
    addMessage,
    isFetchingMore,
    fetchMoreMessages,
  } = useChatData(chatId);

  const messageToReply = messages.find(message => {
    return message.id?.toString() === messageToReplyId;
  });

  async function sendMessage() {
    try {
      addMessage({
        imageUrl: null,
        message: inputMessage,
        hasPriority: isPriority,
        rootMessage: messageToReply
          ? {
              id: messageToReply.id!,
              createdAt: messageToReply.createdAt,
              hasPriority: messageToReply.hasPriority,
              message: messageToReply.message,
              owner: messageToReply.owner,
              imageUrl: messageToReply.imageUrl,
            }
          : undefined,
      });

      setInputMessage("");
      setIsPriority(false);
      setMessageToReplyId(null);
      messagesFlatlistRef.current?.scrollToOffset({
        offset: 0,
        animated: true,
      });
    } catch (error) {
      console.error(error);
    }
  }

  const handlePress = () => {
    setIsPriority(currentIsPriority => !currentIsPriority);
  };

  const chatName = chatData?.name?.trim() || "Default";

  async function scrollToMessage(index: number) {
    const firstIndexInView = messagesInViewRef.current.at(0) ?? 0;
    const difference = index - firstIndexInView;
    const steps = 10;
    const isNegative = difference < 0;

    for (
      let slice = firstIndexInView;
      slice <= Math.abs(difference);
      slice += steps
    ) {
      const targetIndex = isNegative
        ? Math.max(slice - steps, difference)
        : Math.min(slice + steps, difference);
      messagesFlatlistRef.current?.scrollToIndex({
        animated: false,
        index: targetIndex,
      });
      await sleep(50);
    }
    setTimeout(() => {
      chatMessagesRef.current.at(index)?.animateHighlight();
    }, 50);
  }

  function handleSearchMessage() {
    const index = messages.findIndex(({ message }) => {
      return normalizeText(message).includes(normalizeText(searchMessage));
    });

    if (index >= 0) {
      scrollToMessage(index);
    } else {
      Alert.alert("Erro", "Mensagem não encontrada.");
    }
  }

  function handleSelectPreviousMessage() {
    const selectedMessageIndex = selectedMessageIndexRef.current;

    if (selectedMessageIndex < 0) {
      return Alert.alert("Busca", "Não encontramos mais mensagens.");
    }

    let newIndex = selectedMessageIndex - 1;

    while (newIndex >= 0) {
      const message = messages[newIndex];

      if (
        normalizeText(message.message).includes(normalizeText(searchMessage))
      ) {
        selectedMessageIndexRef.current = newIndex;
        return scrollToMessage(newIndex);
      }

      newIndex--;
    }

    Alert.alert("Busca", "Não encontramos mais mensagens.");
  }

  function handleSelectNextMessage() {
    const selectedMessageIndex = selectedMessageIndexRef.current;

    if (selectedMessageIndex <= messages.length - 1) {
      let newIndex = selectedMessageIndex + 1;

      while (newIndex < messages.length) {
        const message = messages[newIndex];

        if (
          normalizeText(message.message).includes(normalizeText(searchMessage))
        ) {
          selectedMessageIndexRef.current = newIndex;
          return scrollToMessage(newIndex);
        }

        newIndex++;
      }

      Alert.alert("Busca", "Não encontramos mais mensagens.");
    } else {
      Alert.alert("Busca", "Não encontramos mais mensagens.");
    }
  }

  async function handleTakePhoto() {
    setIsLoadingImage(true);

    try {
      const takenPhoto = await ImagePicker.launchCameraAsync({
        quality: 0.5,
        allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (takenPhoto.canceled) return;
      setAsset(takenPhoto.assets[0]);
    } catch {
      Alert.alert("Erro.", "Não foi possível tirar a foto.");
    } finally {
      setIsLoadingImage(false);
    }
  }

  async function handleUploadImage() {
    setIsUploadingImage(true);

    try {
      const extension = asset!.uri.split(".").pop()!;
      const formData = new FormData();
      formData.append("file", {
        uri: asset!.uri,
        name: `${Date.now()}-${asset!.fileName || "file"}.${extension}`,
        type: imageMimeTypes[extension as keyof typeof imageMimeTypes],
      } as any);

      const response = await fetch(`${API_BASE_URL}/api/upload-blob`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getAccessToken()}`,
        },
      });

      if (!response.ok) {
        throw response;
      }

      const { uploadedFileUrl } = (await response.json()) as UploadResponse;

      setAsset(undefined);
      setInputMessage("");
      addMessage({
        hasPriority: isPriority,
        message: inputMessage,
        imageUrl: uploadedFileUrl,
      });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível realizar o upload da imagem. :(");
    } finally {
      setIsUploadingImage(false);
    }
  }

  function handleScrollToStart() {
    messagesFlatlistRef.current?.scrollToOffset({
      offset: 0,
      animated: true,
    });
  }

  return (
    <OrbitalBackground>
      <Layout back={goBack}>
        {isLoading && messages.length === 0 ? (
          <Spinner size={40} />
        ) : (
          <Fragment>
            <View className="flex-row px-4">
              <Text
                numberOfLines={1}
                className="flex-1 text-lg font-semibold text-[#034881]"
              >
                {chatName}
              </Text>
            </View>

            <View className="mb-4 mt-2 px-6">
              <View className="w-full flex-row items-center rounded-lg bg-[#F2F9FF] pl-4">
                <MagnifyingGlassIcon width={24} height={24} fill="#ADB5BD" />

                <TextInput
                  value={searchMessage}
                  returnKeyType="search"
                  aria-disabled={isLoading}
                  placeholder="Buscar mensagem"
                  placeholderTextColor="#ADB5BD"
                  onChangeText={setSearchMessage}
                  onSubmitEditing={handleSearchMessage}
                  className="flex-1 py-3 pl-2 pr-4 text-sm font-semibold text-[#034881]"
                />

                <View className="flex-row gap-2 p-4">
                  <TouchableOpacity onPress={handleSelectPreviousMessage}>
                    <Entypo name="chevron-thin-down" size={18} color="black" />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handleSelectNextMessage}>
                    <Entypo name="chevron-thin-up" size={18} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View className="mt-2 h-0.5 w-full bg-[#EDEDED]" />

            <View className="relative flex-1">
              <ChatMessages
                ref={messagesFlatlistRef}
                hasMore={hasMore}
                messages={messages}
                isLoading={isLoading}
                chatType={chatData?.type}
                searchMessage={searchMessage}
                isFetchingMore={isFetchingMore}
                chatMessagesRef={chatMessagesRef}
                chatUsers={chatData?.users ?? []}
                messagesInViewRef={messagesInViewRef}
                fetchMoreMessages={fetchMoreMessages}
                setMessageToReplyId={setMessageToReplyId}
                setIsShowingScrollToStartButton={
                  setIsShowingScrollToStartButton
                }
              />

              {isShowingScrollToStartButton && (
                <TouchableOpacity
                  onPress={handleScrollToStart}
                  className="absolute bottom-2 right-2 flex aspect-square w-8 items-center justify-center rounded-full bg-[#034881]"
                >
                  <Feather name="arrow-down" size={20} color="white" />
                </TouchableOpacity>
              )}
            </View>

            {!messageToReply ? null : (
              <MessageToReply
                chatUsers={chatData?.users}
                messageToReply={messageToReply}
                setMessageToReplyId={setMessageToReplyId}
              />
            )}

            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              className="w-full flex-row items-center space-x-2 bg-[#2C5484] p-2.5"
            >
              <MentionInput
                inputRef={inputMessageRef}
                value={inputMessage}
                className="h-full max-h-full flex-1 rounded-lg bg-[#F0F4F8] px-4 text-sm font-normal text-[#034881]"
                onChange={setInputMessage}
                multiline
                containerStyle={{ flex: 1 }}
                maxLength={500}
                returnKeyType="send"
                onSubmitEditing={sendMessage}
                placeholderTextColor="#034881"
                placeholder="Digite sua mensagem..."
                partTypes={[
                  {
                    trigger: "@",
                    renderSuggestions: ({ keyword, onSuggestionPress }) => {
                      if (keyword == null) {
                        return null;
                      }

                      return (
                        <View className="absolute bottom-[60px] left-0 right-0 max-h-[200px] bg-white">
                          <FlatList
                            data={chatData?.users.filter(user =>
                              normalizeText(user.name).includes(
                                normalizeText(keyword),
                              ),
                            )}
                            renderItem={({ item: user }) => (
                              <TouchableOpacity
                                key={user.id}
                                onPress={() =>
                                  onSuggestionPress({
                                    id: user.id.toString(),
                                    name: user.name,
                                  })
                                }
                                style={{ padding: 12 }}
                              >
                                <Text>{user.name}</Text>
                              </TouchableOpacity>
                            )}
                          />
                        </View>
                      );
                    },
                    textStyle: { fontWeight: "bold", color: "#034881" },
                  },
                  {
                    trigger: "#",
                    renderSuggestions: ({ keyword, onSuggestionPress }) => {
                      if (keyword == null) {
                        return null;
                      }

                      return (
                        <View className="absolute bottom-[60px] left-0 right-0 max-h-[200px] bg-white">
                          <FlatList
                            data={flightsData?.flights.data.filter(flight =>
                              flight.attributes.flightNumber
                                .toString()
                                .includes(keyword),
                            )}
                            renderItem={({ item: flight }) => (
                              <TouchableOpacity
                                key={flight.id}
                                onPress={() =>
                                  onSuggestionPress({
                                    id: flight.id.toString(),
                                    name: flight.attributes.flightNumber.toString(),
                                  })
                                }
                                style={{ padding: 12 }}
                              >
                                <Text>{flight.attributes.flightNumber}</Text>
                              </TouchableOpacity>
                            )}
                          />
                        </View>
                      );
                    },
                    textStyle: { fontWeight: "bold", color: colors.red[700] }, // The mention style in the input
                  },
                ]}
              />

              <TouchableOpacity
                onPress={handlePress}
                style={{
                  borderRadius: 8,
                  backgroundColor: isPriority ? "red" : "#F0F4F8",
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Siren
                  width={32}
                  height={32}
                  fill={isPriority ? "white" : "red"}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleTakePhoto}
                className="rounded-xl bg-[#F0F4F8] px-3 py-2"
                disabled={isLoadingImage}
              >
                {isLoadingImage ? (
                  <ActivityIndicator size={32} color="#034881" />
                ) : (
                  <Entypo name="attachment" size={32} color="#034881" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={sendMessage}
                disabled={!inputMessage}
                className="rounded-xl bg-[#F0F4F8] px-3 py-2"
              >
                <PaperPlaneAltIcon width={32} height={32} />
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </Fragment>
        )}

        <ImageModal
          asset={asset}
          setAsset={setAsset}
          inputMessage={inputMessage}
          onUploadImage={handleUploadImage}
          setInputMessage={setInputMessage}
          isUploadingImage={isUploadingImage}
        />
      </Layout>
    </OrbitalBackground>
  );
};
