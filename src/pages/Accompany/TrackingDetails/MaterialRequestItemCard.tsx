import dayjs from "dayjs";
import { Dispatch, SetStateAction, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import empty from "~/assets/empty.jpeg";
import Counter from "~/components/CounterProps";
import {
  UpdateMaterialRequestItemMutation,
  UpdateMaterialRequestItemResponse,
  UpdateMaterialRequestItemVariables,
} from "~/graphql/mutations/update-status-material-request-item";
import {
  MaterialRequestItemStatus,
  MaterialRequestItemsByMaterialIdQueryResponse,
  MaterialRequestItemsByMaterialIdQueryVariables,
  materialRequestItemsByMaterialIdQuery,
} from "~/graphql/queries/materialRequestsItemsByMaterialId";
import checkIcon from "~/images/checkIcon.png";
import checkWhiteIcon from "~/images/checkWhiteIcon.png";
import removeIcon from "~/images/removeIcon.png";
import removeWhiteIcon from "~/images/removeWhiteIcon.png";
import { apolloClient } from "~/lib/apollo";

type MaterialRequestItem =
  MaterialRequestItemsByMaterialIdQueryResponse["materialRequestItems"]["data"][number];

function getProductValue(
  item: MaterialRequestItem,
  items: MaterialRequestItem[],
  field: keyof MaterialRequestItem["attributes"]["products"]["data"][number]["attributes"],
) {
  return (
    item.attributes.products.data.at(0)?.attributes[field]?.toString().trim() ||
    items[0].attributes.products.data
      .at(0)
      ?.attributes[field]?.toString()
      .trim() ||
    "Não informado!"
  );
}

interface MaterialRequestItemCardProps {
  renderQuantity: boolean;
  materialRequestId: string;
  item: MaterialRequestItem;
  items: MaterialRequestItem[];
  setShowPopUp: Dispatch<SetStateAction<boolean>>;
  setPopUpMessage: Dispatch<SetStateAction<string>>;
}

export const MaterialRequestItemCard: React.FC<
  MaterialRequestItemCardProps
> = ({
  item,
  items,
  setShowPopUp,
  renderQuantity,
  setPopUpMessage,
  materialRequestId,
}) => {
  const [statusUpdating, setStatusUpdating] =
    useState<MaterialRequestItemStatus | null>(null);

  async function handleUpdateMaterialRequestItem(
    id: string,
    newStatus: MaterialRequestItemStatus,
  ) {
    setStatusUpdating(newStatus);

    try {
      await apolloClient.mutate<
        UpdateMaterialRequestItemResponse,
        UpdateMaterialRequestItemVariables
      >({
        mutation: UpdateMaterialRequestItemMutation,
        variables: {
          id,
          status: newStatus,
        },
      });

      const data = apolloClient.readQuery<
        MaterialRequestItemsByMaterialIdQueryResponse,
        MaterialRequestItemsByMaterialIdQueryVariables
      >({
        query: materialRequestItemsByMaterialIdQuery,
        variables: { materialRequestId },
      });

      if (!data) return;

      apolloClient.writeQuery<
        MaterialRequestItemsByMaterialIdQueryResponse,
        MaterialRequestItemsByMaterialIdQueryVariables
      >({
        query: materialRequestItemsByMaterialIdQuery,
        data: {
          ...data,
          materialRequestItems: {
            ...data.materialRequestItems,
            data: data.materialRequestItems.data.map(item => {
              if (item.id === id) {
                return {
                  ...item,
                  attributes: {
                    ...item.attributes,
                    status: newStatus,
                  },
                };
              }

              return item;
            }),
          },
        },
      });
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
      setPopUpMessage("Erro ! ");
      setShowPopUp(true);
    } finally {
      setStatusUpdating(null);
    }
  }

  return (
    <View className="flex flex-col justify-around rounded-md bg-blue-100/50 p-5 shadow-lg">
      <View className="h-50 mb-5 flex flex-row justify-start rounded-md">
        <View className="flex flex-col space-y-2">
          <Text
            numberOfLines={1}
            className="text-base font-bold text-regal-blue"
          >
            {getProductValue(item, items, "productDescription")}
          </Text>
        </View>
      </View>

      {/* LISTA COM OS DADOS */}
      <View className="flex flex-row justify-between">
        <View>
          <Image
            source={empty}
            className="ml-2 rounded-full"
            style={{ height: 80, width: 80 }}
          />
        </View>

        <View className="flex flex-col">
          <View className="flex flex-row items-center">
            <Text className="text-sm text-[#2C5484]">PTM:</Text>

            <Text className="pr-5 text-sm font-bold text-[#2C5484]">
              {" "}
              {item.attributes.ptmOTK || "Não informado!"}
            </Text>
          </View>

          <View className="flex flex-row items-center">
            <Text style={{ fontSize: 14, color: "#2C5484" }}>OS:</Text>

            <Text
              className="pr-5"
              style={{
                fontSize: 14,
                color: "#2C5484",
                fontWeight: "bold",
              }}
            >
              {" "}
              {item.attributes.osOTK || "Não informado!"}
            </Text>
          </View>

          <Text className="text-regal-blue">
            Modelo:{" "}
            <Text className="font-bold">
              {getProductValue(item, items, "productModel")}
            </Text>
          </Text>

          <Text className="text-regal-blue">
            Ultima Atualização:{" "}
            <Text className="font-bold">
              {items.length &&
              item.attributes.products.data.at(0)?.attributes.lastUpdateDate
                ? dayjs(
                    item.attributes.products.data[0].attributes.lastUpdateDate,
                  ).format("DD/MM/YYYY")
                : "Não informado!"}
            </Text>
          </Text>

          <Text className="text-regal-blue">
            Quantidade em estoque:{" "}
            <Text className="font-bold">
              {getProductValue(item, items, "quantityInStock")}
            </Text>
          </Text>

          <Text className="text-regal-blue">
            Marca:{" "}
            <Text className="font-bold">
              {getProductValue(item, items, "productBrand")}
            </Text>
          </Text>

          <Text className="text-regal-blue">
            Cód. Seção:{" "}
            <Text className="font-bold" numberOfLines={1}>
              {getProductValue(item, items, "sectionCode")}
            </Text>
          </Text>

          <Text className="text-regal-blue">
            Desc. Seção:{" "}
            <Text className="font-bold" numberOfLines={1}>
              {getProductValue(item, items, "sectionDescription")}
            </Text>
          </Text>

          {!renderQuantity && (
            <Text className="text-regal-blue">
              Quantidade:{" "}
              <Text className="font-bold">
                {item.attributes.qtty || "Não informado!"}
              </Text>
            </Text>
          )}
        </View>
      </View>

      {/* QUANTIDADE */}
      {renderQuantity ? (
        <View className="flex flex-col pb-5 pt-5">
          <Text
            style={{
              textAlign: "center",
              fontSize: 14,
              color: "#2C5484",
            }}
          >
            Quantidade:
          </Text>

          <Counter
            idMaterialrequestItem={item.id}
            initialValue={Number(item.attributes.qtty)}
          />
        </View>
      ) : null}

      {renderQuantity ? (
        <View className="mt-8 flex flex-row justify-center gap-2">
          <TouchableOpacity
            disabled={
              item.attributes.status === "rejected" || Boolean(statusUpdating)
            }
            onPress={() => {
              handleUpdateMaterialRequestItem(item.id, "rejected");
            }}
            className="h-16 w-20 items-center justify-center rounded-lg"
            style={{
              backgroundColor:
                item.attributes.status === "rejected" ? "red" : "#034881",
            }}
          >
            {statusUpdating === "rejected" ? (
              <ActivityIndicator color="white" size={24} />
            ) : item.attributes.status === "rejected" ? (
              <Image source={removeWhiteIcon} />
            ) : (
              <Image source={removeIcon} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            disabled={
              item.attributes.status === "accepted" || Boolean(statusUpdating)
            }
            onPress={() => {
              handleUpdateMaterialRequestItem(item.id, "accepted");
            }}
            className="h-16 w-20 items-center justify-center rounded-lg"
            style={{
              backgroundColor:
                item.attributes.status === "accepted" ? "green" : "#034881",
            }}
          >
            {statusUpdating === "accepted" ? (
              <ActivityIndicator color="white" size={24} />
            ) : item.attributes.status === "accepted" ? (
              <Image source={checkWhiteIcon} />
            ) : (
              <Image source={checkIcon} />
            )}
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};
