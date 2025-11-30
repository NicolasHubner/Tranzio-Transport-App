import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ModalCancelProps {
  setModal: (value: boolean) => void;
  handleClearItem: (passengerId: string, description: string) => void;
  passenger: any;
  description: string;
  setDescription: (value: string) => void;
  loadingModal: boolean;
}

export const ModalCancel: React.FC<ModalCancelProps> = ({
  setModal,
  handleClearItem,
  passenger,
  description,
  setDescription,
  loadingModal,
}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <View
        style={{
          width: "80%",
          backgroundColor: "#F2F9FF",
          borderRadius: 10,
          padding: 20,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 10,
          }}
        >
          Descreva o motivo do cancelamento:
        </Text>
        <TextInput
          style={{
            backgroundColor: "white",
            padding: 10,
            marginBottom: 20,
            borderRadius: 5,
          }}
          value={description}
          onChangeText={setDescription}
          placeholder="Descrição..."
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            gap: 8,
          }}
        >
          <TouchableOpacity
            onPress={() => setModal(false)}
            disabled={loadingModal}
            style={{
              flex: 1,
              backgroundColor: "#7C7C7C",
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "white",
                fontWeight: "bold",
              }}
            >
              Cancelar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleClearItem(passenger?.id, description);
            }}
            style={{
              flex: 1,
              backgroundColor: "#034881",
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: "center",
            }}
            disabled={loadingModal}
          >
            {loadingModal ? (
              <ActivityIndicator size={24} color="white" />
            ) : (
              <Text
                style={{
                  fontSize: 16,
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Finalizar
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
