import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { useDebouncedValue } from "~/hooks/useDebouncedValue";
import { useMaterialRequestStatus } from "~/hooks/useMaterialRequestStatus";
import { useQueryPolling } from "~/hooks/useQueryPolling";
import type { MaterialRequestStatus } from "~/types/MaterialRequest";
import statusIcon from "../../images/statusIcon.png";
import statusIconAverage from "../../images/statusIconAverage.png";
import statusIconHigh from "../../images/statusIconHigh.png";
import { Input } from "../Input";
import { QueryFailed } from "../QueryFailed";
import { Spinner } from "../Spinner";

const pageSize = 5;

interface CardAccompanyProps {
  status: MaterialRequestStatus | "operator";
}

export const CardAccompany: React.FC<CardAccompanyProps> = ({ status }) => {
  const [page, setPage] = useState(1);
  const { navigate } = useNavigation();
  const [hasMore, setHasMore] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const debouncedSearchValue = useDebouncedValue(searchValue, 700);
  const {
    data,
    error,
    loading,
    refetch,
    fetchMore,
    variables,
    stopPolling,
    startPolling,
  } = useMaterialRequestStatus({
    fetchPolicy: "cache-and-network",
    variables: {
      page: 1,
      pageSize,
      search: debouncedSearchValue,
      status: status === "operator" ? undefined : status,
    },
  });

  useQueryPolling(10000, startPolling, stopPolling);

  async function handleFetchMore() {
    if (!hasMore || isFetchingMore) return;
    setIsFetchingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);

    try {
      await fetchMore({
        variables: {
          ...variables,
          page: nextPage,
        },
        updateQuery(currentQueryResult, { fetchMoreResult }) {
          setHasMore(fetchMoreResult.materialRequests.data.length === pageSize);

          const ids = new Set<string>();
          const newMaterialRequests: typeof currentQueryResult.materialRequests.data =
            [];

          currentQueryResult.materialRequests.data.forEach(materialRequest => {
            ids.add(materialRequest.id);
            newMaterialRequests.push(materialRequest);
          });

          fetchMoreResult.materialRequests.data.forEach(materialRequest => {
            if (!ids.has(materialRequest.id)) {
              ids.add(materialRequest.id);
              newMaterialRequests.push(materialRequest);
            }
          });

          return {
            ...currentQueryResult,
            materialRequests: {
              ...currentQueryResult,
              data: newMaterialRequests,
            },
          };
        },
      });
    } finally {
      setIsFetchingMore(false);
    }
  }

  return (
    <View className="flex-1">
      <View className="mb-2.5 px-5">
        <Input
          value={searchValue}
          onChangeText={setSearchValue}
          placeholder="Buscar por código de requisição..."
        />
      </View>

      {loading ? (
        <View className="justify-center">
          <Spinner size={40} />
        </View>
      ) : error || !data ? (
        <QueryFailed refetch={refetch} />
      ) : (
        <FlatList
          onEndReachedThreshold={0.25}
          onEndReached={handleFetchMore}
          keyExtractor={item => item.id}
          data={data.materialRequests.data}
          ItemSeparatorComponent={() => <View className="my-2.5" />}
          contentContainerStyle={{ paddingBottom: 24, paddingHorizontal: 20 }}
          ListEmptyComponent={() => (
            <Text className="text-center text-sm text-[#2C5484]">
              Não há requisições para acompanhar!
            </Text>
          )}
          ListFooterComponent={
            isFetchingMore
              ? () => (
                  <View className="mt-2 justify-center">
                    <Spinner size={32} />
                  </View>
                )
              : undefined
          }
          renderItem={({ item }) => (
            <View className="flex h-28 flex-row justify-around rounded-md bg-blue-100/50 shadow-lg">
              <View className="flex flex-col space-y-2 px-4 py-5">
                <View className="flex flex-row items-center">
                  <Text className="text-sm text-[#2C5484]">Cod. Req. :</Text>

                  <Text className="pr-5 text-sm font-bold text-[#2C5484]">
                    {" "}
                    {item.attributes.requestCode}
                  </Text>
                </View>

                <View className="flex flex-row items-center">
                  <Text className="text-sm text-[#2C5484]">Status:</Text>

                  <Text className="pr-5 text-sm font-bold text-[#2C5484]">
                    {" "}
                    {item.attributes.status == "serviced"
                      ? "Notificado"
                      : item.attributes.status == "inOpen"
                      ? " Em aberto"
                      : item.attributes.status == "pending"
                      ? "Pendente"
                      : item.attributes.status == "delivered"
                      ? "Atendido"
                      : "Rejeitado"}
                  </Text>
                </View>

                <View className="flex flex-row items-center">
                  <Text className="text-sm text-[#2C5484]">
                    Prioridade:
                    {item.attributes.priority == "important"
                      ? " Importante "
                      : item.attributes.priority == "critic"
                      ? " Crítico "
                      : item.attributes.priority == "routine"
                      ? " Rotina "
                      : "N/A"}
                  </Text>

                  {item.attributes.priority == "critic" ? (
                    <Image className="h-5 w-5 pr-5" source={statusIconHigh} />
                  ) : item.attributes.priority == "important" ? (
                    <Image
                      className="h-5 w-5 pr-5"
                      source={statusIconAverage}
                    />
                  ) : (
                    <Image className="h-5 w-5 pr-5" source={statusIcon} />
                  )}
                </View>
              </View>

              <View className="items-center justify-center">
                <TouchableOpacity
                  className="rounded-lg bg-[#034881] p-2.5"
                  onPress={() => {
                    navigate("TrackingDetails", {
                      materialRequestId: item.id,
                      materialRequestStatus: item.attributes.status,
                    });
                  }}
                >
                  <Text className="text-sm text-white">Detalhes</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};
