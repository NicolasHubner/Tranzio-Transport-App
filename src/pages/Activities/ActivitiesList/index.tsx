import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { FlatList, Text, View } from "react-native";
import Apresentation from "~/components/Apresentation";
import Layout from "~/components/Layout";
import OrbitalBackground from "~/components/OrbitalBackground";
import { QueryFailed } from "~/components/QueryFailed";
import { Spinner } from "~/components/Spinner";
import { useInternetConnectionContext } from "~/contexts/InternetConnectionContext";
import {
  AttendanceLivesQueryResponse,
  AttendanceSpecType,
} from "~/graphql/queries/attendanceLives";
import { useAttendanceLives } from "~/hooks/useAttendanceLives";
import { useAuth } from "~/hooks/useAuth";
import { useLoggedUserDepartmentIds } from "~/hooks/useLoggedUserDepartmentIds";
import { useQueryPolling } from "~/hooks/useQueryPolling";
import { storage } from "~/lib/mmkv";
import { getQueryInitialData } from "~/utils/getQueryInitialData";
import { ActivityCard } from "./ActivityCard";
import { FilterButton } from "./FilterButton";

type Filter = "all" | AttendanceSpecType;
const attendanceLivesDataStorageKey = "@cfs/attendance-lives-data";

interface ActivitiesListProps {}

export const ActivitiesList: React.FC<ActivitiesListProps> = () => {
  const { user } = useAuth();
  const { navigate } = useNavigation();
  const { isConnected } = useInternetConnectionContext();
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const { departmentIds, isLoading } = useLoggedUserDepartmentIds();

  const userId = user?.id;

  const {
    data = getQueryInitialData<AttendanceLivesQueryResponse>(
      attendanceLivesDataStorageKey,
    ),
    loading,
    error,
    refetch,
    startPolling,
    stopPolling,
  } = useAttendanceLives({
    skip: isLoading || !isConnected,
    variables: {
      userId,
      departmentIds,
      attendanceSpecType: activeFilter === "all" ? undefined : activeFilter,
    },
    onCompleted(data) {
      storage.set(attendanceLivesDataStorageKey, JSON.stringify(data));
    },
  });

  // console.log("data", data?.attendanceLives.data[0].attributes.flight.data);

  useQueryPolling(10000, startPolling, stopPolling);

  function handleGoBack() {
    navigate("Home");
  }

  return (
    <OrbitalBackground>
      <Layout back={handleGoBack}>
        <View className="flex-1">
          <View className="px-4">
            <Apresentation />
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

          <View className="mt-8 flex-1">
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
                ListEmptyComponent={() => (
                  <Text className="text-center text-sm text-gray-neutral">
                    Não há atividades aqui...{"\n"}Que tal procurar algumas?
                  </Text>
                )}
                renderItem={({ item: attendanceLive, index }) => {
                  return (
                    <ActivityCard
                      id={attendanceLive.id}
                      flightDestiny={
                        attendanceLive.attributes.flight.data.attributes
                          .flightDestiny
                      }
                      flightOrigin={
                        attendanceLive.attributes.flight.data.attributes
                          .flightOrigin
                      }
                      actionType={
                        attendanceLive.attributes.flight.data.attributes
                          .actionType
                      }
                      className={index > 0 ? "mt-3.5" : undefined}
                      hasStarted={Boolean(attendanceLive.attributes.dtStart)}
                      hasStopped={Boolean(attendanceLive.attributes.dtStop)}
                      box={
                        attendanceLive.attributes.flight.data.attributes.BOX ||
                        "Não informado!"
                      }
                      description={
                        attendanceLive.attributes.flight.data.attributes
                          .description
                      }
                      flightPrefix={
                        attendanceLive.attributes.flight.data.attributes.prefix
                      }
                      landingTime={
                        attendanceLive.attributes.flight.data.attributes.ETA ||
                        attendanceLive.attributes.flight.data.attributes.STA
                      }
                      departureTime={
                        attendanceLive.attributes.flight.data.attributes.ETD ||
                        attendanceLive.attributes.flight.data.attributes.STD
                      }
                      aircraftName={
                        attendanceLive.attributes.flight.data.attributes
                          .aircraft.data.attributes.name
                      }
                      isTurnAround={
                        attendanceLive.attributes.flight.data.attributes
                          .isTurnAround
                      }
                      flightDate={
                        attendanceLive.attributes.flight.data.attributes
                          .flightDate
                      }
                    />
                  );
                }}
              />
            )}
          </View>
        </View>
      </Layout>
    </OrbitalBackground>
  );
};
