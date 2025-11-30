import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import classNames from "classnames";
import dayjs from "dayjs";
import * as ScreenOrientation from "expo-screen-orientation";
import {
  Fragment,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useAnimatedValue,
} from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import ImageViewer from "react-native-image-zoom-viewer";
import colors from "tailwindcss/colors";

import Pdf from "react-native-pdf";
import Reanimated, {
  Easing,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useAuth } from "~/hooks/useAuth";
import type { ChatUser, Message } from "~/hooks/useChatData";
import {
  CHAT_FLIGHT_MENTION_REGEX,
  CHAT_USER_MENTION_REGEX,
} from "~/utils/constants";

const urlRegex = /(https?:\/\/[^\s]+)/g;
const combinedRegex =
  /(https?:\/\/[^\s]+)|(@\[[^\]]*\]\(\d+\))|(#\[[^\]]*\]\(\d+\))/g;

export interface ChatMessageRef {
  animateHighlight: () => void;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

interface ChatMessageProps {
  search?: string;
  chatUsers: ChatUser[];
  chatMessage: Message;
  chatType?: "direct" | "group";
  setMessageToReplyId: React.Dispatch<React.SetStateAction<string | null>>;
}

async function handleOnPressURL(part: string) {
  try {
    await Linking.openURL(part);
  } catch (error) {
    console.error(error);
    Alert.alert("Erro", "Link inválido.");
  }
}

export const ChatMessage = forwardRef<ChatMessageRef, ChatMessageProps>(
  ({ chatMessage, setMessageToReplyId, chatType, search, chatUsers }, ref) => {
    const posX = useSharedValue(0);
    const { navigate } = useNavigation();
    const { user: loggedUser } = useAuth();
    const wrapperOpacity = useAnimatedValue(0);
    const [isModalVisible, setModalVisible] = useState(false);
    const onGestureEvent = useAnimatedGestureHandler({
      onStart() {},
      onActive(event) {
        posX.value = event.translationX;
        if (Math.abs(event.translationX) > 100 && chatMessage.id) {
          runOnJS(setMessageToReplyId)(chatMessage.id.toString());
        }
      },
      onEnd() {
        posX.value = withSpring(0);
      },
    });

    useImperativeHandle(ref, () => {
      return {
        animateHighlight() {
          Animated.sequence([
            Animated.timing(wrapperOpacity, {
              toValue: 1,
              duration: 100,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.timing(wrapperOpacity, {
              toValue: 0,
              duration: 2000,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ]).start();
        },
      };
    });

    const positionStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: posX.value }, { translateY: 0 }],
        zIndex: -1,
      };
    });

    function toggleModal() {
      setModalVisible(currentIsModalVisible => !currentIsModalVisible);
    }

    useEffect(() => {
      if (isModalVisible) {
        ScreenOrientation.unlockAsync().catch(console.error);
      } else {
        ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP,
        ).catch(console.error);
      }

      return () => {
        ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP,
        ).catch(console.error);
      };
    }, [isModalVisible]);

    const isSelfMessage = chatMessage.owner.id.toString() === loggedUser?.id;
    const isSeen =
      chatMessage.chatMessageStates.length > 0 &&
      chatMessage.chatMessageStates.every(messageState => {
        return (
          messageState.receiver?.id.toString() === loggedUser?.id ||
          messageState.state === "seen"
        );
      });

    return (
      <View className="relative p-2">
        <Animated.View
          className="absolute bottom-0 left-0 right-0 top-0 -z-10 rounded-[12px] bg-[#d1d5db]"
          style={{ opacity: wrapperOpacity }}
        />

        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          activeOffsetX={[-10, 10]}
        >
          <Reanimated.View
            style={positionStyle}
            className={classNames(
              "min-w-[100px] max-w-[90%] space-y-1 rounded-t-2xl p-2.5",
              isSelfMessage
                ? "items-end self-end rounded-bl-2xl"
                : "items-start self-start rounded-br-2xl",
              chatMessage.hasPriority
                ? "bg-red-600"
                : isSelfMessage
                ? "bg-[#002DE3]"
                : "bg-[#E7E7E7]",
            )}
          >
            <View>
              {chatMessage.rootMessage ? (
                <View
                  className={classNames(
                    "flex min-w-[80px] rounded-md bg-[#ADB5BD] px-3 py-1",
                    chatMessage.hasPriority ? "bg-red-100" : "bg-[#E3F0FA]",
                    isSelfMessage
                      ? classNames(
                          "items-end border-r-4",
                          chatMessage.hasPriority
                            ? "border-[#002DE3]"
                            : "border-[#4d93e4]",
                        )
                      : "items-start border-l-4 border-[#002DE3]",
                  )}
                >
                  <Text
                    className={classNames(
                      "text-center font-medium",
                      isSelfMessage ? "text-[#034881]" : "text-[#002DE3]",
                    )}
                  >
                    {chatMessage.rootMessage.owner?.id.toString() ===
                    loggedUser?.id
                      ? "Você"
                      : chatMessage.rootMessage.owner?.name}
                  </Text>

                  <Text>
                    {chatMessage.rootMessage.message
                      .split(combinedRegex)
                      .map((part, partIndex) => {
                        if (urlRegex.test(part)) {
                          return (
                            <Text
                              key={partIndex}
                              onPress={() => handleOnPressURL(part)}
                              className="text-base font-medium leading-relaxed text-blue-400 underline"
                            >
                              {part}
                            </Text>
                          );
                        }

                        const userMatches = CHAT_USER_MENTION_REGEX.exec(part);

                        if (userMatches) {
                          const [, userName, userId] = userMatches;
                          const targetUser = chatUsers.find(
                            user => user.id.toString() === userId,
                          );

                          const name = targetUser?.name || userName;

                          return (
                            <Text
                              key={partIndex}
                              className={classNames(
                                "text-center text-base font-medium leading-relaxed",
                                loggedUser?.id === userId
                                  ? "text-red-400"
                                  : "text-blue-400",
                              )}
                            >
                              @{loggedUser?.id === userId ? "Você" : name}
                            </Text>
                          );
                        }

                        const flightMatches =
                          CHAT_FLIGHT_MENTION_REGEX.exec(part);

                        if (flightMatches) {
                          const [, flightNumber, flightId] = flightMatches;

                          return (
                            <Fragment key={partIndex}>
                              <MaterialCommunityIcons
                                name="airplane"
                                size={20}
                                color={colors.blue[400]}
                              />

                              <Text
                                onPress={() => {
                                  navigate("FlightStatus", { id: flightId });
                                }}
                                className="text-center text-base font-medium leading-relaxed text-blue-400 underline"
                              >
                                #{flightNumber}
                              </Text>
                            </Fragment>
                          );
                        }

                        return (
                          <Text
                            key={partIndex}
                            className="font-medium text-[#034881]"
                          >
                            {part}
                          </Text>
                        );
                      })}
                  </Text>
                </View>
              ) : null}
            </View>

            {chatType === "group" && !isSelfMessage ? (
              <View>
                <Text>{chatMessage.owner?.name}</Text>
              </View>
            ) : null}

            {chatMessage.imageUrl ? (
              <TouchableOpacity onPress={toggleModal}>
                {chatMessage.imageUrl.endsWith(".pdf") ? (
                  <AntDesign
                    name="pdffile1"
                    size={50}
                    color={isSelfMessage ? "white" : "black"}
                  />
                ) : (
                  <Image
                    source={{
                      uri: chatMessage.imageUrl,
                    }}
                    alt=""
                    className="h-[100] w-[100] rounded"
                    resizeMode="cover"
                  />
                )}
              </TouchableOpacity>
            ) : null}

            {chatMessage.message ? (
              <Text>
                {chatMessage.message
                  .split(combinedRegex)
                  .map((part, partIndex) => {
                    if (!part) {
                      return null;
                    }

                    if (urlRegex.test(part)) {
                      return (
                        <Text
                          key={partIndex}
                          onPress={() => handleOnPressURL(part)}
                          className="text-base font-medium leading-relaxed text-blue-400 underline"
                        >
                          {part}
                        </Text>
                      );
                    }

                    const userMatches = CHAT_USER_MENTION_REGEX.exec(part);

                    if (userMatches) {
                      const [, userName, userId] = userMatches;
                      const targetUser = chatUsers.find(
                        user => user.id.toString() === userId,
                      );

                      const name = targetUser?.name || userName;

                      return (
                        <Text
                          key={partIndex}
                          className={classNames(
                            "text-center text-base font-medium leading-relaxed",
                            loggedUser?.id === userId
                              ? "text-red-400"
                              : "text-blue-400",
                          )}
                        >
                          @{loggedUser?.id === userId ? "Você" : name}
                        </Text>
                      );
                    }

                    const flightMatches = CHAT_FLIGHT_MENTION_REGEX.exec(part);

                    if (flightMatches) {
                      const [, flightNumber, flightId] = flightMatches;

                      return (
                        <Fragment key={partIndex}>
                          <MaterialCommunityIcons
                            name="airplane"
                            size={20}
                            color={colors.blue[400]}
                          />

                          <Text
                            onPress={() => {
                              navigate("FlightStatus", { id: flightId });
                            }}
                            className="text-center text-base font-medium leading-relaxed text-blue-400 underline"
                          >
                            #{flightNumber}
                          </Text>
                        </Fragment>
                      );
                    }

                    if (search) {
                      const regex = new RegExp(`(${search})`, "ig");
                      return part
                        .split(regex)
                        .map((fragment, fragmentIndex) => {
                          if (regex.test(fragment)) {
                            return (
                              <Text
                                key={fragmentIndex}
                                className={classNames(
                                  "text-base font-medium leading-relaxed",
                                  chatMessage.hasPriority || isSelfMessage
                                    ? "bg-white text-black"
                                    : "bg-black text-white",
                                )}
                              >
                                {fragment}
                              </Text>
                            );
                          }
                          return (
                            <Text
                              key={fragmentIndex}
                              className={classNames(
                                "text-base font-normal leading-relaxed",
                                chatMessage.hasPriority || isSelfMessage
                                  ? "text-white"
                                  : "text-black",
                              )}
                            >
                              {fragment}
                            </Text>
                          );
                        });
                    }

                    return (
                      <Text
                        key={partIndex}
                        className={classNames(
                          "text-base font-normal leading-relaxed",
                          chatMessage.hasPriority || isSelfMessage
                            ? "text-white"
                            : "text-black",
                        )}
                      >
                        {part}
                      </Text>
                    );
                  })}
              </Text>
            ) : null}

            <Modal
              visible={isModalVisible}
              animationType="slide"
              transparent
              statusBarTranslucent
            >
              <GestureHandlerRootView
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                className="bg-white pt-8"
              >
                {chatMessage.imageUrl?.endsWith(".pdf") ? (
                  <Pdf
                    trustAllCerts={false}
                    source={{
                      uri: chatMessage.imageUrl!,
                      cache: false,
                    }}
                    onLoadComplete={numberOfPages => {
                      console.log(`Number of pages: ${numberOfPages}`);
                    }}
                    onError={error => {
                      console.error(error);
                    }}
                    onPressLink={uri => {
                      console.log(`Link pressed: ${uri}`);
                    }}
                    style={styles.pdf}
                  />
                ) : (
                  <ImageViewer
                    imageUrls={[
                      {
                        url: chatMessage.imageUrl!,
                      },
                    ]}
                    backgroundColor="white"
                    style={{ width: "100%" }}
                  />
                )}

                <TouchableOpacity onPress={toggleModal} className="mb-4">
                  <AntDesign name="closecircle" size={34} color="gray" />
                </TouchableOpacity>
              </GestureHandlerRootView>
            </Modal>

            <Text
              className={classNames(
                "text-sm font-normal",
                chatMessage.hasPriority
                  ? "text-white"
                  : isSelfMessage
                  ? "text-white"
                  : "text-black/50",
              )}
            >
              {dayjs(chatMessage.createdAt).format("HH:mm")}

              {isSelfMessage && isSeen && " · Lido"}
            </Text>
          </Reanimated.View>
        </PanGestureHandler>
      </View>
    );
  },
);
