import { styled } from "nativewind";
import React, { useRef } from "react";
import { AppRegistry, Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import SignatureCapture from "react-native-signature-capture";

interface Result {
  encoded: string;
  pathName: string;
}

export interface SignatureProps {
  setSignatureImage: React.Dispatch<React.SetStateAction<string | null>>;
  setSignatureModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const StyledRectButton = styled(
  RectButton,
  "rounded-md bg-gray-200 px-4 py-2 text-center transition-colors",
);
export const Signature: React.FC<SignatureProps> = ({
  setSignatureImage,
  setSignatureModalVisible,
}) => {
  const signatureRef = useRef<SignatureCapture>(null);

  function saveSign() {
    signatureRef.current?.saveImage();
    setTimeout(() => {
      setSignatureModalVisible(false);
    }, 100);
  }

  function resetSign() {
    signatureRef.current?.resetImage();
  }

  function _onSaveEvent(result: Result) {
    setSignatureImage(result.encoded);
  }

  return (
    <View style={{ flex: 1, width: "100%" }}>
      <SignatureCapture
        style={{ flex: 1 }}
        ref={signatureRef}
        onSaveEvent={_onSaveEvent}
        saveImageFileInExtStorage={false}
        showNativeButtons={false}
        showTitleLabel={false}
        viewMode={"portrait"}
      />
      <View className="my-4 flex flex-row justify-center space-x-4 ">
        <StyledRectButton onPress={resetSign} style={{ borderRadius: 12 }}>
          <Text className="text-base font-semibold text-regal-blue">
            Limpar
          </Text>
        </StyledRectButton>
        <StyledRectButton onPress={saveSign} style={{ borderRadius: 12 }}>
          <Text className="text-base font-semibold text-regal-blue">
            Salvar
          </Text>
        </StyledRectButton>
      </View>
    </View>
  );
};

AppRegistry.registerComponent("RNSignatureExample", () => Signature);
