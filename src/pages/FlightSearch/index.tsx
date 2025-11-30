import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import MagnifyingGlassIcon from "~/assets/icons/magnifying-glass.svg";
import { FlightSearchCard } from "~/components/FlightSearchCard";
import Layout from "~/components/Layout";
import OrbitalBackground from "~/components/OrbitalBackground";
import { QueryFailed } from "~/components/QueryFailed";
import { Spinner } from "~/components/Spinner";
import { FlightsSearchQueryVariables } from "~/graphql/queries/flights-search";
import { useDebouncedValue } from "~/hooks/useDebouncedValue";
import { useFlightsSearchQuery } from "~/hooks/useFlightsSearch";

export const FlightSearch: React.FC = () => {
  const { goBack } = useNavigation();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const debouncedSearch = useDebouncedValue(search, 700);
  const variables: FlightsSearchQueryVariables = {
    query: debouncedSearch ? Number(debouncedSearch) : undefined,
    page: 1,
    pageSize: 10,
  };

  const { data, loading, error, refetch, fetchMore } = useFlightsSearchQuery({
    variables,
  });

  async function handleFetchMore() {
    setIsFetchingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    try {
      await fetchMore({
        variables: {
          ...variables,
          page: nextPage,
        },
        updateQuery(previousQueryResult, { fetchMoreResult }) {
          const newFlights: typeof previousQueryResult.flights.data = [];
          const flightIds = new Set<string>();
          previousQueryResult.flights.data.forEach(flight => {
            flightIds.add(flight.id);
            newFlights.push(flight);
          });
          fetchMoreResult.flights.data.forEach(flight => {
            if (!flightIds.has(flight.id)) {
              flightIds.add(flight.id);
              newFlights.push(flight);
            }
          });
          return {
            ...previousQueryResult,
            flights: {
              ...previousQueryResult.flights,
              data: newFlights,
            },
          };
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetchingMore(false);
    }
  }

  return (
    <OrbitalBackground>
      <Layout back={goBack}>
        <View className="px-4">
          <Text className="text-lg font-medium text-regal-blue">
            Pesquisar voos
          </Text>
          <View
            className="mt-4 w-full flex-row items-center rounded-lg bg-[#F2F9FF] pl-2"
            style={{ elevation: 2 }}
          >
            <MagnifyingGlassIcon width={24} height={24} fill="#ADB5BD" />
            <TextInput
              value={search}
              returnKeyType="search"
              keyboardType="numeric"
              aria-disabled={loading}
              placeholder="Buscar voos"
              placeholderTextColor="#ADB5BD"
              onChangeText={setSearch}
              className="flex-1 py-3 pl-2 pr-4 text-sm font-semibold text-[#034881]"
            />
          </View>
        </View>
        <View className="mt-4 flex-1">
          {loading ? (
            <View className="items-center">
              <Spinner size={40} />
            </View>
          ) : error || !data ? (
            <QueryFailed refetch={refetch} />
          ) : (
            <FlatList
              data={data.flights.data}
              onEndReached={
                page === data.flights.meta.pagination.pageCount ||
                isFetchingMore
                  ? undefined
                  : handleFetchMore
              }
              ListFooterComponent={
                isFetchingMore ? <Spinner size={32} /> : undefined
              }
              onEndReachedThreshold={0.25}
              keyExtractor={flight => flight.id}
              contentContainerStyle={{
                paddingTop: 4,
                paddingBottom: 32,
                gap: 10,
                paddingHorizontal: 16,
              }}
              ListEmptyComponent={() => (
                <Text className="text-center text-sm text-gray-neutral">
                  Não há voos aqui...
                </Text>
              )}
              renderItem={({ item: flight }) => {
                return (
                  <View
                    style={{ elevation: 8 }}
                    className="space-y-4 rounded-2xl bg-blue-light p-3.5"
                  >
                    <FlightSearchCard
                      id={flight.id}
                      actionType={flight.attributes.actionType}
                      box={flight.attributes.BOX}
                      flightNumber={flight.attributes.flightNumber}
                      sta={flight.attributes.STA}
                      std={flight.attributes.STD}
                      flightDate={flight.attributes.flightDate}
                    />
                  </View>
                );
              }}
            />
          )}
        </View>
      </Layout>
    </OrbitalBackground>
  );
};
