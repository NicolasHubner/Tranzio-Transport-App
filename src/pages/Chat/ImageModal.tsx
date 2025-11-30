import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Dispatch, SetStateAction } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import PaperPlaneAltIcon from "~/assets/icons/paper-plane-alt.svg";

interface ImageModalProps {
  inputMessage: string;
  onUploadImage: () => void;
  isUploadingImage: boolean;
  asset: ImagePicker.ImagePickerAsset | undefined;
  setInputMessage: Dispatch<SetStateAction<string>>;
  setAsset: Dispatch<SetStateAction<ImagePicker.ImagePickerAsset | undefined>>;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  asset,
  setAsset,
  inputMessage,
  onUploadImage,
  setInputMessage,
  isUploadingImage,
}) => {
  return (
    <Modal
      transparent
      statusBarTranslucent
      animationType="slide"
      visible={Boolean(asset)}
    >
      <KeyboardAvoidingView
        behavior="padding"
        className="flex-1 items-center justify-between bg-white"
      >
        <TouchableOpacity
          className="mr-4 mt-12 self-end"
          disabled={isUploadingImage}
          onPress={() => setAsset(undefined)}
        >
          <AntDesign name="closecircle" size={34} color="gray" />
        </TouchableOpacity>

        {asset && (
          <ImageViewer
            backgroundColor="white"
            style={{ width: "100%" }}
            imageUrls={[
              {
                url: asset.uri,
              },
            ]}
          />
        )}

        <View className="flex-row space-x-2 px-4 pb-4">
          <TextInput
            multiline
            maxLength={500}
            value={inputMessage}
            returnKeyType="send"
            onChangeText={setInputMessage}
            placeholderTextColor="#034881"
            onSubmitEditing={onUploadImage}
            placeholder="Digite sua mensagem..."
            className="h-full max-h-full flex-1 rounded-lg bg-[#F0F4F8] px-4 text-sm font-normal text-[#034881]"
          />
          <TouchableOpacity
            onPress={onUploadImage}
            disabled={isUploadingImage}
            className="self-end rounded-xl border border-[#034881] bg-[#F0F4F8] px-3 py-2"
          >
            {isUploadingImage ? (
              <ActivityIndicator size={32} color="#034881" />
            ) : (
              <PaperPlaneAltIcon width={32} height={32} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
