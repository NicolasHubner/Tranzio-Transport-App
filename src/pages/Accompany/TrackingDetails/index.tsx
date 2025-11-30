import { useNavigation, useRoute } from "@react-navigation/native";
import classNames from "classnames";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BellRinging from "~/assets/icons/bell-ringing.svg";
import Checks from "~/assets/icons/checks.svg";
import CloudWarning from "~/assets/icons/cloud-warning.svg";
import XCircle from "~/assets/icons/x-circle.svg";
import Layout from "~/components/Layout";
import OrbitalBackground from "~/components/OrbitalBackground";
import PopupModal from "~/components/PopupModal";
import { QueryFailed } from "~/components/QueryFailed";
import { Spinner } from "~/components/Spinner";
import {
  UpdateMaterialRequestPriorityMutation,
  UpdateMaterialRequestPriorityResponse,
  UpdateMaterialRequestPriorityVariables,
} from "~/graphql/mutations/update-priority-material-request";
import {
  UpdateMaterialRequestMutation,
  UpdateMaterialRequestResponse,
  UpdateMaterialRequestVariables,
} from "~/graphql/mutations/updateStatusMaterialRequest";
import { useAuth } from "~/hooks/useAuth";
import { useMaterialRequestItemsByMaterialId } from "~/hooks/useMaterialRequestItemsByMaterialId";
import { apolloClient } from "~/lib/apollo";
import type { MaterialRequestStatus } from "~/types/MaterialRequest";
import { MaterialRequestItemCard } from "./MaterialRequestItemCard";
import arrowBottomIcon from "/images/arrowBottomIcon.png";
import arrowUpIcon from "/images/arrowUpIcon.png";
import statusIcon from "/images/statusIcon.png";
import statusIconAverage from "/images/statusIconAverage.png";
import statusIconHigh from "/images/statusIconHigh.png";

const priorityTextMap = {
  routine: "Rotina",
  important: "Importante",
  critic: "Critico",
};

export interface TrackingDetailsParams {
  materialRequestId: string;
  materialRequestStatus: MaterialRequestStatus;
}

export const TrackingDetails: React.FC = () => {
  const route = useRoute();
  const { user } = useAuth();
  const { goBack } = useNavigation();
  const [showPopUp, setShowPopUp] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState("");
  const [selectedButton, setSelectedButton] = useState("");
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [isCardVisiblePriority, setIsCardVisiblePriority] = useState(false);
  const [statusUpdating, setUpdatingStatus] =
    useState<MaterialRequestStatus | null>(null);

  const role = user?.role?.name;
  const {
    materialRequestId,
    materialRequestStatus: initialMaterialRequestStatus,
  } = route.params as TrackingDetailsParams;

  const [materialRequestStatus, setMaterialRequestStatus] = useState(
    initialMaterialRequestStatus,
  );

  const { data, loading, error, refetch } = useMaterialRequestItemsByMaterialId(
    {
      variables: {
        materialRequestId,
      },
    },
  );

  function closePopUp() {
    setShowPopUp(false);
  }

  const renderQuantity =
    materialRequestStatus !== "delivered" &&
    (role === "GLOBALDYNE" || role === "ALMOXARIFADO" || role === "GSE_ADMIN");

  function handleToggleCard(text: string) {
    if (text === "Prioridade") {
      setIsCardVisiblePriority(!isCardVisiblePriority);
    }
  }

  async function handleUpdateMaterialRequest(status: MaterialRequestStatus) {
    setUpdatingStatus(status);

    try {
      await apolloClient.mutate<
        UpdateMaterialRequestResponse,
        UpdateMaterialRequestVariables
      >({
        mutation: UpdateMaterialRequestMutation,
        variables: {
          id: materialRequestId,
          status: status,
        },
      });

      setShouldRedirect(status !== "serviced");
      setPopUpMessage("Sucesso! Status do pedido atualizado !");
      setShowPopUp(true);
      setMaterialRequestStatus(status);
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
      setPopUpMessage("Erro ! ");
      setShowPopUp(true);
    } finally {
      setUpdatingStatus(null);
    }
  }

  async function handleUpdateMaterialRequestPriority(priority: string) {
    try {
      await apolloClient.mutate<
        UpdateMaterialRequestPriorityResponse,
        UpdateMaterialRequestPriorityVariables
      >({
        mutation: UpdateMaterialRequestPriorityMutation,
        variables: {
          id: materialRequestId,
          priority: priority,
        },
      });

      setPopUpMessage("Sucesso! Prioridade atualizada !");
      setShowPopUp(true);
    } catch (error) {
      console.error(error);
      setPopUpMessage("Erro ! ");
      setShowPopUp(true);
    }
  }

  return (
    <OrbitalBackground>
      <Layout back={goBack}>
        {loading ? (
          <View className="mt-4 justify-center">
            <Spinner size={40} />
          </View>
        ) : error || !data ? (
          <QueryFailed refetch={refetch} />
        ) : (
          <View className="flex-1 px-3">
            <PopupModal
              visible={showPopUp}
              popUpMessage={popUpMessage}
              onClose={shouldRedirect ? goBack : closePopUp}
            />

            {role === "GLOBALDYNE" || role === "GSE_ADMIN" ? (
              <TouchableOpacity onPress={() => handleToggleCard("Prioridade")}>
                <View className="h-16 flex-row items-center justify-between rounded-lg bg-[#F2F9FF] px-5">
                  <Text
                    style={{ color: "#034881", paddingLeft: 5, fontSize: 14 }}
                  >
                    Prioridade
                  </Text>
                  {isCardVisiblePriority ? (
                    <Image className="w-4" source={arrowUpIcon} />
                  ) : (
                    <Image source={arrowBottomIcon} />
                  )}
                </View>
              </TouchableOpacity>
            ) : null}

            {isCardVisiblePriority && (
              <View
                style={{
                  backgroundColor: "#F2F9FF",
                  padding: 16,
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                }}
              >
                <View className="flex-column flex pl-2">
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedButton("important");
                      handleUpdateMaterialRequestPriority("important");
                    }}
                  >
                    <View
                      className="flex flex-row justify-between rounded-lg p-3"
                      style={{
                        backgroundColor:
                          selectedButton === "important"
                            ? "#034881"
                            : "#F2F9FF",
                      }}
                    >
                      <Text
                        style={{
                          color:
                            selectedButton === "important"
                              ? "#F2F9FF"
                              : "#034881",
                          fontSize: 14,
                        }}
                      >
                        {priorityTextMap.important}{" "}
                      </Text>
                      <Image
                        className="pr-5"
                        style={{ height: 20, width: 20 }}
                        source={statusIconAverage}
                      />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedButton("critic");
                      handleUpdateMaterialRequestPriority("critic");
                    }}
                  >
                    <View
                      className="flex flex-row justify-between rounded-lg p-3"
                      style={{
                        backgroundColor:
                          selectedButton === "critic" ? "#034881" : "#F2F9FF",
                      }}
                    >
                      <Text
                        style={{
                          color:
                            selectedButton === "critic" ? "#F2F9FF" : "#034881",
                          fontSize: 14,
                        }}
                      >
                        {priorityTextMap.critic}{" "}
                      </Text>
                      <Image
                        className="pr-5"
                        style={{ height: 20, width: 20 }}
                        source={statusIconHigh}
                      />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedButton("routine");
                      handleUpdateMaterialRequestPriority("routine");
                    }}
                  >
                    <View
                      className="flex flex-row justify-between rounded-lg p-3"
                      style={{
                        backgroundColor:
                          selectedButton === "routine" ? "#034881" : "#F2F9FF",
                      }}
                    >
                      <Text
                        style={{
                          color:
                            selectedButton === "routine"
                              ? "#F2F9FF"
                              : "#034881",
                          fontSize: 14,
                        }}
                      >
                        {priorityTextMap.routine}{" "}
                      </Text>

                      <Image
                        className="pr-5"
                        style={{ height: 20, width: 20 }}
                        source={statusIcon}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <FlatList
              keyExtractor={item => item.id}
              data={data.materialRequestItems.data}
              ItemSeparatorComponent={() => <View className="my-2.5" />}
              ListEmptyComponent={() => (
                <Text className="text-center text-sm text-[#034881]">
                  Não há itens aqui...
                </Text>
              )}
              renderItem={({ item }) => (
                <MaterialRequestItemCard
                  item={item}
                  setShowPopUp={setShowPopUp}
                  renderQuantity={renderQuantity}
                  setPopUpMessage={setPopUpMessage}
                  materialRequestId={materialRequestId}
                  items={data.materialRequestItems.data}
                />
              )}
            />

            {/* BOTOES DE APROVAR E REPROVAR */}
            {renderQuantity ? (
              <View className="flex flex-row justify-center space-x-2 pb-4 pt-7">
                {data.materialRequestItems.data.every(
                  item => item.attributes.status === "rejected",
                ) && (
                  <TouchableOpacity
                    disabled={
                      materialRequestStatus === "rejected" ||
                      Boolean(statusUpdating)
                    }
                    onPress={() => handleUpdateMaterialRequest("rejected")}
                    className={classNames(
                      "items-center justify-center rounded-lg p-4 text-center",
                      materialRequestStatus === "rejected"
                        ? "bg-green-600"
                        : "bg-[#034881]",
                    )}
                  >
                    {statusUpdating === "rejected" ? (
                      <ActivityIndicator color="white" size={24} />
                    ) : (
                      <XCircle />
                    )}
                  </TouchableOpacity>
                )}

                {data.materialRequestItems.data.some(
                  item => item.attributes.status === "rejected",
                ) && (
                  <TouchableOpacity
                    disabled={
                      materialRequestStatus === "inOpen" ||
                      Boolean(statusUpdating)
                    }
                    onPress={() => handleUpdateMaterialRequest("inOpen")}
                    className={classNames(
                      "items-center justify-center rounded-lg p-4 text-center",
                      materialRequestStatus === "inOpen"
                        ? "bg-green-600"
                        : "bg-[#034881]",
                    )}
                  >
                    {statusUpdating === "inOpen" ? (
                      <ActivityIndicator color="white" size={24} />
                    ) : (
                      <CloudWarning />
                    )}
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  disabled={
                    materialRequestStatus === "serviced" ||
                    Boolean(statusUpdating)
                  }
                  onPress={() => handleUpdateMaterialRequest("serviced")}
                  className={classNames(
                    "items-center justify-center rounded-lg p-4 text-center",
                    materialRequestStatus === "serviced"
                      ? "bg-green-600"
                      : "bg-[#034881]",
                  )}
                >
                  {statusUpdating === "serviced" ? (
                    <ActivityIndicator color="white" size={24} />
                  ) : (
                    <BellRinging />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  disabled={Boolean(statusUpdating)}
                  onPress={() => handleUpdateMaterialRequest("delivered")}
                  className="items-center justify-center rounded-lg bg-[#034881] p-4 text-center"
                >
                  {statusUpdating === "delivered" ? (
                    <ActivityIndicator color="white" size={24} />
                  ) : (
                    <Checks />
                  )}
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        )}
      </Layout>
    </OrbitalBackground>
  );
};
