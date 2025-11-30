import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CameraPlusIcon from "~/assets/icons/camera-plus.svg";
import Apresentation from "~/components/Apresentation";
import { Button, Button as CustomButton } from "~/components/Button";
import Layout from "~/components/Layout";
import OrbitalBackground from "~/components/OrbitalBackground";
import { Spinner } from "~/components/Spinner";
import { useAuth } from "~/hooks/useAuth";
import { restApi } from "~/services";
import { getAccessToken } from "~/utils/accessToken";
import { API_BASE_URL, imageMimeTypes } from "~/utils/constants";
import { ModalQrCode } from "./ModalQrCode";
import {
  AllocatedDetails,
  DataColaborator,
  DataEquipament,
  DataEquipamentIdentification,
  DevolutionDetails,
  UploadResponse,
} from "./utils/interfaces";

const DATE_FORMAT = "YYYY-MM-DDTHH:mm:ssZ";

export interface CeopRouteParams {
  type: string;
}

export default function Ceop() {
  function handleBack() {
    navigate("Home");
  }
  const { user } = useAuth();

  const { navigate } = useNavigation();
  const route = useRoute();
  const { type } = route.params as CeopRouteParams;
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleChose, setModalVisibleChose] = useState(true);
  const [code, setCode] = useState("");

  const [observation, setObservation] = useState("");

  const [loading, setLoading] = useState(false);
  const [modalVisibleEquipments, setModalVisibleEquipments] = useState(false);

  const [dataEquipamentCategory, setDataEquipament] = useState<
    DataEquipament[]
  >([
    {
      title: "",
      idEquipament: "",
      equipmentTypeID: "",
      allocation_id: null,
    },
  ]);

  const [dataEquipamentIdentificador, setIdentificador] = useState<
    DataEquipamentIdentification[]
  >([
    {
      id: "",
    },
  ]);

  const [dataColaborator, setColaborator] = useState<DataColaborator[]>([
    {
      title: "",
      id: "",
      username: "",
      allocations: [],
    },
  ]);

  const [asset, setAsset] = useState<
    ImagePicker.ImagePickerAsset | undefined
  >();

  async function resetFields() {
    setModalVisibleChose(true);
    setColaborator([
      {
        title: "",
        id: "",
        username: "",
        allocations: [],
      },
    ]);

    setDataEquipament([
      {
        title: "",
        idEquipament: "",
        equipmentTypeID: "",
        allocation_id: null,
      },
    ]);

    setIdentificador([
      {
        id: "",
      },
    ]);

    setAsset(undefined);
    setObservation("");
    setCode("");
    navigate("StepOneCeop");
  }

  async function handleTakePhoto() {
    try {
      const takenPhoto = await ImagePicker.launchCameraAsync({
        quality: 0.5,
        allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (takenPhoto.canceled) return;
      setAsset(takenPhoto.assets![0]);
    } catch {
      Alert.alert("Erro.", "Não foi possível tirar a foto.");
    }
  }

  const checkEquipmentCode = async (data: string) => {
    try {
      const { data: equipmentData } = await restApi.get(
        `/equipments/logical_number/${data}`,
      );
      const typeId = type === "entrega" ? 1 : 2;
      const statusId = Number(equipmentData.status_id);
      if (statusId !== typeId) {
        Alert.alert(
          "Erro",
          type === "entrega"
            ? "Equipamento não disponível para retirada."
            : "Equipamento não disponível para devolução.",
        );
        return;
      }
      setDataEquipament([
        {
          title: equipmentData.equipment_type.name,
          idEquipament: equipmentData.id,
          allocation_id: equipmentData.allocation_id,
          equipmentTypeID: equipmentData.equipment_type.id,
        },
      ]);

      setIdentificador([
        {
          id: equipmentData.logical_number,
        },
      ]);
    } catch (error: any) {
      console.error(error);
      if (error?.response?.status === 404) {
        return Alert.alert("Erro", "Equipamento não encontrado.");
      }
      Alert.alert("Erro", "Equipamento não encontrado.");
    }
  };

  const checkUser = async (data: string, retry?: boolean) => {
    try {
      const { data: userData } = await restApi.get(`/users/${data}`);
      setColaborator([
        {
          title: userData.name,
          id: userData.id,
          username: userData.username,
          allocations: userData.allocations,
        },
      ]);

      if (userData.allocations.length > 0) {
        setModalVisibleEquipments(true);
      }
    } catch (error: any) {
      if (error?.response?.status === 404) {
        if (data.startsWith("0") && !retry) {
          const newId = data.substring(1);
          getInfoFromQrCode(newId, true);
        } else {
          Alert.alert("Colaborador não encontrado");
          return;
        }
      }
    }
  };

  useEffect(() => {
    if (code) {
      getInfoFromQrCode(code);
    }
  }, [code]);

  const getInfoFromQrCode = async (data: string, retry?: boolean) => {
    const regexNumber = /^\d{4,}$/;
    if (data.match(regexNumber)) {
      await checkUser(data, retry);
    } else {
      await checkEquipmentCode(data);
    }
  };

  const createUrlFromBlob = async () => {
    if (!asset) return null;

    try {
      const extension = asset.uri.split(".").pop()!;
      const formData = new FormData();
      formData.append("file", {
        uri: asset.uri,
        name: `${Date.now()}-${asset.fileName || "file"}.${extension}`,
        type: imageMimeTypes[extension as keyof typeof imageMimeTypes],
      } as any);
      const response = await fetch(
        `${API_BASE_URL}/api/upload-activity-evidence-image`,
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${getAccessToken()}`,
          },
        },
      );
      const { uploadedFileUrl } = (await response.json()) as UploadResponse;
      return uploadedFileUrl;
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitAllocated = async () => {
    const payload: AllocatedDetails = {
      allocated_at: moment().format(DATE_FORMAT),
      allocated_details: observation, // observação
      device_number: dataEquipamentIdentificador[0].id || "",
      equipment_type: dataEquipamentCategory[0].equipmentTypeID || "",
      id: dataEquipamentCategory[0].idEquipament,
      id_colaborador_ceop: user?.username || "",
      id_pegador: dataColaborator[0].username || "",
      nome_colaborador_ceop: user?.name || "",
      nome_pegador: dataColaborator[0].title || "",
      ref_colaborador: "",
      allocated_image: (await createUrlFromBlob()) || "", // imagem
    };

    try {
      await restApi.post("/allocations", payload);
      resetFields();
      Alert.alert("Sucesso", "Equipamento alocado com sucesso.");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível realizar a alocação.");
    }
  };

  const handleSubmitUnallocated = async () => {
    const payload: DevolutionDetails = {
      returned_at: moment().format(DATE_FORMAT),
      returned_details: observation, // observação
      allocation_id: dataEquipamentCategory[0].allocation_id || "",
      equipmentId: dataEquipamentCategory[0].idEquipament,
      id_devolvedor: dataColaborator[0].username || "",
      nome_devolvedor: dataColaborator[0].title || "",
      id_devolvedor_ceop: user?.username as unknown as number,
      nome_devolvedor_ceop: user?.name as string,
      returned_image: (await createUrlFromBlob()) || "",
    };

    try {
      await restApi.put(
        `/allocations/${dataEquipamentCategory[0].allocation_id}`,
        payload,
      );
      resetFields();
      Alert.alert("Sucesso", "Equipamento devolvido com sucesso.");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível realizar a devolução.");
    }
  };

  const handleSubmitEquipment = async () => {
    setLoading(true);
    // const urlImage = await createUrlFromBlob();

    if (dataEquipamentCategory[0].allocation_id === null) {
      handleSubmitAllocated();
    }

    if (dataEquipamentCategory[0].allocation_id !== null) {
      handleSubmitUnallocated();
    }
  };

  const disabledSubmit =
    !dataColaborator[0].title ||
    !dataEquipamentCategory[0].title ||
    !dataEquipamentIdentificador[0].id;

  const inputRef = useRef(null);

  const retirarFocoInput = () => {
    if (inputRef.current) {
      // @ts-ignore
      inputRef.current.blur();
    }
  };

  useEffect(() => {
    retirarFocoInput();
  }, [modalVisibleChose, modalVisibleEquipments, code, asset]);

  return (
    <>
      <OrbitalBackground>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
          >
            <Layout back={handleBack}>
              <View className="pl-16">
                <Apresentation />
              </View>

              <View className="flex-1 px-5 py-5">
                <CustomButton
                  title="Abrir Câmera"
                  onPress={() => setModalVisible(true)}
                  className="w-full"
                />

                <Text
                  style={{
                    color: "#034881",
                    fontSize: 16,
                    fontWeight: "bold",
                    marginTop: 16,
                  }}
                >
                  Nome Colaborador
                </Text>

                <View className="w-{100%}  mt-2 h-12 justify-center rounded-3xl bg-white pl-4 align-middle text-base font-bold uppercase">
                  <Text className="w-{100%} text-base font-bold uppercase text-regal-blue">
                    {dataColaborator[0].title}
                  </Text>
                </View>

                <Text
                  style={{
                    color: "#034881",
                    fontSize: 16,
                    fontWeight: "bold",
                    marginTop: 16,
                  }}
                >
                  Categoria Equipamento
                </Text>

                <View className="w-{100%}  mt-2 h-12 justify-center rounded-3xl bg-white pl-4 align-middle text-base font-bold uppercase">
                  <Text className="w-{100%} text-base font-bold uppercase text-regal-blue">
                    {dataEquipamentCategory[0].title}
                  </Text>
                </View>

                <Text
                  style={{
                    color: "#034881",
                    fontSize: 16,
                    fontWeight: "bold",
                    marginTop: 16,
                  }}
                >
                  Identificador do equipamento
                </Text>

                <View className="w-{100%}  mt-2 h-12 justify-center rounded-3xl bg-white pl-4 align-middle text-base font-bold uppercase">
                  <Text className="w-{100%} text-base font-bold uppercase text-regal-blue">
                    {dataEquipamentIdentificador[0].id}
                  </Text>
                </View>

                <Text
                  style={{
                    color: "#034881",
                    fontSize: 16,
                    fontWeight: "bold",
                    marginTop: 16,
                  }}
                >
                  Observação (opcional)
                </Text>
                <TextInput
                  style={{
                    width: "100%",
                    height: 150,
                    backgroundColor: "white",
                    borderRadius: 8,
                    padding: 16,
                    marginTop: 8,
                    textAlignVertical: "top",
                  }}
                  multiline
                  numberOfLines={4}
                  onChangeText={text => setObservation(text)}
                  value={observation}
                  ref={inputRef}
                />

                <TouchableOpacity
                  className="item-center mt-8 h-64 w-full items-center justify-center self-end rounded-2xl border-2 border-[#034881]"
                  onPress={handleTakePhoto}
                >
                  {!asset && <CameraPlusIcon width={24} height={24} />}

                  {asset && (
                    <Image
                      source={{ uri: asset.uri }}
                      style={{ width: 300, height: 200 }}
                      className="rounded-2xl"
                    />
                  )}
                </TouchableOpacity>
              </View>
            </Layout>
          </KeyboardAvoidingView>
        </ScrollView>
        <TouchableOpacity
          className={`w-{100%} fixed mx-2 mb-2 mt-4 h-12 items-center justify-center rounded-xl ${
            !disabledSubmit || loading ? "bg-[#034881]" : "bg-[#7f7f7f]"
          }`}
          onPress={handleSubmitEquipment}
          disabled={disabledSubmit || loading}
        >
          {loading ? (
            <Spinner />
          ) : (
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              {type === "entrega" ? "RETIRADA" : "DEVOLUÇÃO"}
            </Text>
          )}
        </TouchableOpacity>
      </OrbitalBackground>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <ModalQrCode
          setModalVisible={setModalVisible}
          setDataQrCode={e => setCode(e)}
        />
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleEquipments}
      >
        <View className="m-5 flex-1 bg-white p-5">
          <View className="flex-row items-center justify-between">
            <Text
              style={{
                color: "#034881",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              {dataColaborator[0].username} Equipamentos
            </Text>
            <Button
              title="fechar"
              onPress={() => {
                setModalVisibleEquipments(false);
              }}
            />
          </View>

          <View>
            {dataColaborator[0].allocations.map(({ device_number }) => {
              return (
                <View className="flex-row" key={device_number}>
                  <Text
                    style={{
                      color: "black",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    - {device_number}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </Modal>
    </>
  );
}
