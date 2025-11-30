import ImageResizer from "@bam.tech/react-native-image-resizer";
import { AntDesign } from "@expo/vector-icons";
import classNames from "classnames";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect, useMemo, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GestureHandlerRootView,
  PinchGestureHandler,
  State,
} from "react-native-gesture-handler";
import Pdf from "react-native-pdf";
import { Spinner } from "./Spinner";

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

interface ActivityCpmLirButtonProps {
  actionType: "Arrival" | "Departure";
  cpm: string | null;
  lir: string | null;
}

export const ActivityCpmLirButton: React.FC<ActivityCpmLirButtonProps> = ({
  actionType,
  cpm,
  lir,
}) => {
  const [isCpmModalVisible, setCpmModalVisible] = useState(false);

  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState<string | null>(null);

  const toggleCpmModal = () => {
    setCpmModalVisible(!isCpmModalVisible);
  };

  const [baseScale, setBaseScale] = useState(new Animated.Value(1));
  const [pinchScale, setPinchScale] = useState(new Animated.Value(1));

  const [lastScale, setLastScale] = useState(1);

  const onPinchGestureEvent = Animated.event(
    [{ nativeEvent: { scale: pinchScale } }],
    { useNativeDriver: true },
  );

  const onPinchHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      setLastScale(lastScale * event.nativeEvent.scale);
      setBaseScale(new Animated.Value(lastScale * event.nativeEvent.scale));
      setPinchScale(new Animated.Value(1));
    }
  };

  useEffect(() => {
    if (isCpmModalVisible) {
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
  }, [isCpmModalVisible]);

  // const type =
  //   actionType === "Arrival"
  //     ? cpm?.includes("jpg") || cpm?.includes("png") || cpm?.includes("jpeg")
  //       ? "image"
  //       : "pdf"
  //     : lir?.includes("pdf") || lir?.includes("PDF") || lir?.includes("Pdf")
  //     ? "image"
  //     : "pdf";

  const type = useMemo(() => {
    if (actionType === "Arrival") {
      return cpm?.includes(".png") ||
        cpm?.includes(".jpeg") ||
        cpm?.includes(".jpg")
        ? "image"
        : "pdf";
    } else {
      return lir?.includes(".png") ||
        lir?.includes(".jpeg") ||
        lir?.includes(".jpg")
        ? "image"
        : "pdf";
    }
  }, [actionType, cpm, lir]);
  useEffect(() => {
    if (!cpm && !lir) return;

    if (type === "pdf") {
      setLoading(false);
      return;
    }

    const resizeImage = async (uri: string) => {
      const resizedImageUri = await ImageResizer.createResizedImage(
        uri,
        800,
        600,
        "JPEG",
        100,
        90,
        undefined,
        false,
        { mode: "contain", onlyScaleDown: true },
      );
      setImage(resizedImageUri.uri);
      setLoading(false);
    };

    resizeImage(actionType === "Arrival" ? cpm! : lir!);
  }, [actionType, cpm, lir, type]);

  return (
    <>
      <View>
        {(actionType === "Arrival" && cpm) ||
        (actionType === "Departure" && lir) ? (
          <TouchableOpacity
            className={classNames("rounded-md  bg-regal-blue p-4")}
            onPress={toggleCpmModal}
          >
            <Text className="text-center text-sm font-bold uppercase text-white">
              Ver {actionType === "Arrival" ? "CPM" : "LIR"}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <Modal
        visible={isCpmModalVisible}
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
          {(actionType === "Arrival" && !cpm) ||
            (actionType === "Departure" && !lir && (
              <Text className="text-center text-sm text-gray-neutral">
                Não há nada para ver por aqui...
              </Text>
            ))}
          {type === "image" && !loading && (
            <PinchGestureHandler
              onGestureEvent={onPinchGestureEvent}
              onHandlerStateChange={onPinchHandlerStateChange}
            >
              <Animated.Image
                source={{ uri: image! }}
                style={{
                  width: "100%",
                  height: "100%",
                  transform: [
                    { scale: Animated.multiply(baseScale, pinchScale) },
                  ],
                }}
                resizeMode="contain"
              />
            </PinchGestureHandler>
          )}

          {type === "image" && loading && <Spinner />}

          {type === "pdf" && (
            <View style={styles.container}>
              <Pdf
                source={{
                  uri: actionType === "Arrival" ? cpm! : lir!,
                  cache: false,
                }}
                // onLoadComplete={numberOfPages => {
                //   console.log(`Number of pages: ${numberOfPages}`);
                // }}
                onError={error => {
                  console.error(error);
                }}
                // onPressLink={uri => {
                //   console.log(`Link pressed: ${uri}`);
                // }}
                style={styles.pdf}
              />
            </View>
          )}

          <TouchableOpacity
            style={{
              position: "absolute",
              bottom: 0,
              zIndex: 999,
              width: "100%",
              alignItems: "center",
            }}
            onPress={toggleCpmModal}
            className="mb-4"
          >
            <AntDesign name="closecircle" size={34} color="gray" />
          </TouchableOpacity>
        </GestureHandlerRootView>
      </Modal>
    </>
  );
};
