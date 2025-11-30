import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import tw from "tailwind-react-native-classnames";

type PopupModalProps = {
  visible: boolean;
  popUpMessage: string;
  onClose: () => void;
};

const PopupModal: React.FC<PopupModalProps> = ({
  visible,
  popUpMessage,
  onClose,
}) => {
  return (
    <Modal
      statusBarTranslucent
      visible={visible}
      transparent={false}
      style={{ opacity: 10 }}
    >
      <View
        style={{ backgroundColor: "#333333" }}
        className={`flex-1 items-center justify-center`}
      >
        <View className={`rounded-md bg-white p-4`}>
          <View className={`mb-2 flex-row items-center`}>
            <Text className={`text-lg font-semibold`}>
              {popUpMessage.includes("Sucesso")
                ? "Sucesso!"
                : popUpMessage.includes("Requisição")
                ? "Notificação"
                : "Erro!"}
            </Text>
          </View>
          <Text>{popUpMessage}</Text>
          <TouchableOpacity
            onPress={onClose}
            style={tw`mt-4 bg-blue-500 p-2 rounded-md`}
          >
            <Text style={tw`text-white text-center`}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PopupModal;
