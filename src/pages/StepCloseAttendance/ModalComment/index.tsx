import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ModalCommentProps {
  setComentModalVisible: (value: boolean) => void;
  handleAddComent: (passengerId: string, description: string) => void;
  passenger: any;
  descriptions: string;
  setDescriptionComment: (value: string) => void;
  loadingModal: boolean;
}

export const ModalComment: React.FC<ModalCommentProps> = ({
  setComentModalVisible,
  handleAddComent,
  passenger,
  descriptions,
  setDescriptionComment,
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
          width: "90%",
          backgroundColor: "#F2F9FF",
          borderRadius: 10,
          padding: 20,
          height: 250,
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 10,
          }}
        >
          Adicione uma descrição:
        </Text>
        <TextInput
          style={{
            backgroundColor: "white",
            padding: 10,
            marginBottom: 20,
            borderRadius: 5,
          }}
          value={descriptions}
          onChangeText={setDescriptionComment}
          placeholder="Descrição..."
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setComentModalVisible(false);
              setDescriptionComment("");
            }}
            disabled={loadingModal}
            style={{
              flex: 1,
              backgroundColor: "#7C7C7C",
              paddingVertical: 12,
              borderRadius: 10,
              alignItems: "center",
              marginRight: 10,
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
            disabled={loadingModal}
            onPress={() => handleAddComent(passenger?.id, descriptions)}
            style={{
              flex: 1,
              backgroundColor: "#034881",
              paddingVertical: 12,
              borderRadius: 10,
              alignItems: "center",
              marginRight: 10,
            }}
          >
            {loadingModal ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text
                style={{
                  fontSize: 16,
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Adicionar
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
