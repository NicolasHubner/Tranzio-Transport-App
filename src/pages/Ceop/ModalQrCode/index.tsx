import { AntDesign } from "@expo/vector-icons";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";

interface ModalQrCodeProps {
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setDataQrCode: (e: string) => void;
}

export const ModalQrCode = ({
  setModalVisible,
  setDataQrCode,
}: ModalQrCodeProps) => {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-black/[.7] blur-md">
      <View className="h-108 w-96 items-center justify-center rounded-2xl bg-white">
        <View className="absolute right-0 top-0 my-8 mr-8">
          <Pressable onPress={() => setModalVisible(false)}>
            <AntDesign name="close" size={24} color="black" />
          </Pressable>
        </View>
        <BarCodeScanner
          onBarCodeScanned={({ type, data }) => {
            setDataQrCode(data);
            setModalVisible(false);
          }}
          className="rounded-md"
          style={{
            width: "80%",
            height: "80%",
          }}
        />
      </View>
    </View>
  );
};
