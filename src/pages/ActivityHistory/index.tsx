import { useNavigation } from "@react-navigation/core";
import { useState } from "react";
import { Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Layout from "~/components/Layout";
import OrbitalBackground from "~/components/OrbitalBackground";
import { QueryFailed } from "~/components/QueryFailed";
import { Spinner } from "~/components/Spinner";
import { useInternetConnectionContext } from "~/contexts/InternetConnectionContext";
import { AttendanceSpecType } from "~/graphql/queries/attendanceLives";
import { useAttendanceLivesHistory } from "~/hooks/useAttendanceLivesHistory";
import { useAuth } from "~/hooks/useAuth";
import { useLoggedUserDepartmentIds } from "~/hooks/useLoggedUserDepartmentIds";
import { useQueryPolling } from "~/hooks/useQueryPolling";
import { FilterButton } from "../Activities/ActivitiesList/FilterButton";
import { ActivityHistoryCard } from "./ActivityHistoryCard";

type Filter = "all" | AttendanceSpecType;

export const ActivityHistory: React.FC = () => {
  const { user } = useAuth();
  const { goBack } = useNavigation();
  const { departmentIds, isLoading } = useLoggedUserDepartmentIds();
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const { isConnected } = useInternetConnectionContext();
  const userId = user?.id;

  const { data, loading, error, refetch, startPolling, stopPolling } =
    useAttendanceLivesHistory({
      skip: isLoading || !isConnected,
      variables: {
        userId,
        departmentIds,
        attendanceSpecType: activeFilter === "all" ? undefined : activeFilter,
      },
    });

  useQueryPolling(10000, startPolling, stopPolling);

  return (
    <OrbitalBackground>
      <Layout back={goBack}>
        <View className="px-4">
          <Text className="mt-3 text-lg font-medium text-regal-blue">
            Histórico
          </Text>
        </View>
        <View className="mt-8 flex-row items-center px-4">
          <FilterButton
            label="Todos"
            isActive={activeFilter === "all"}
            onSelect={() => setActiveFilter("all")}
          />

          <FilterButton
            hasLeftMargin
            label="Nacional"
            isActive={activeFilter === "National"}
            onSelect={() => setActiveFilter("National")}
          />

          <FilterButton
            hasLeftMargin
            label="Internacional"
            isActive={activeFilter === "International"}
            onSelect={() => setActiveFilter("International")}
          />
        </View>
        <View className="mt-4 flex-1 px-4">
          {isLoading || loading ? (
            <Spinner />
          ) : error || !data ? (
            <QueryFailed refetch={refetch} />
          ) : (
            <FlatList
              data={data.attendanceLives.data}
              keyExtractor={attendanceLive => attendanceLive.id}
              contentContainerStyle={{
                paddingTop: 4,
                paddingBottom: 32,
                paddingHorizontal: 16,
              }}
              ItemSeparatorComponent={() => <View className="my-1.5" />}
              ListEmptyComponent={() => (
                <Text className="text-center text-sm text-gray-neutral">
                  Não há atividades aqui...{"\n"}Que tal procurar algumas?
                </Text>
              )}
              renderItem={({ item: attendanceLive }) => {
                return <ActivityHistoryCard attendanceLive={attendanceLive} />;
              }}
            />
          )}
        </View>
      </Layout>
    </OrbitalBackground>
  );
};
