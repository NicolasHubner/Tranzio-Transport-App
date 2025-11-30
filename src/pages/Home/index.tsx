import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import { Dimensions, FlatList, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import type { SvgProps } from "react-native-svg";
import AccessibilityIcon from "~/assets/icons/home/accessibility.svg";
import StockIcon from "~/assets/icons/home/stock.svg";
import TruckLoadingIcon from "~/assets/icons/home/truck-loading.svg";
import Apresentation from "~/components/Apresentation";
import Layout from "~/components/Layout";
import OrbitalBackground from "~/components/OrbitalBackground";
import { PnaeOpenShift } from "~/components/PnaeOpenShift";
import { Spinner } from "~/components/Spinner";
import { useAuth } from "~/hooks/useAuth";
import { useHasPermission } from "~/hooks/useHasPermission";
import { useQueryPolling } from "~/hooks/useQueryPolling";
import { useUserById } from "~/hooks/useUserById";
import { styles } from "./styles";

const cardWidth = (Dimensions.get("window").width - (48 + 24)) / 2;

const allowedRoles = {
  gse: ["GLOBALDYNE", "GSE_ADMIN", "MECANICO", "ALMOXARIFADO", "AUTHENTICATED"],
  pnae: ["GLOBALDYNE", "PNAE_AAP", "PNAE_LIDER", "PNAE_ADMIN", "AUTHENTICATED"],
  ramp: ["GLOBALDYNE", "AUTHENTICATED", "LIDER_DE_RAMPA", "LIDER_LIMP"],
  ceop: ["GLOBALDYNE", "AUTHENTICATED", "CEOP", "CEOP_LIDER", "CEOP_ADMIN"],
};

interface Route {
  Icon: React.FC<SvgProps>;
  label: string;
  name: keyof Pick<
    ReactNavigation.RootParamList,
    | "Pnae"
    | "HandleGse"
    | "ActivitiesList"
    | "Chats"
    | "RampOpenShift"
    | "StepOneCeop"
  >;
}

export const Home: React.FC = () => {
  const { user } = useAuth();
  const { navigate } = useNavigation();
  const rule = useHasPermission({ ruleName: "OnlyOpenShift" });
  function handleNavigateToRoute(routeName: Route["name"]) {
    return () => {
      navigate(routeName);
    };
  }

  const { data, loading, startPolling, stopPolling } = useUserById({
    skip: !user?.id,
    variables: {
      id: user?.id,
    },
  });

  useQueryPolling(10000, startPolling, stopPolling);

  const hasTodayServiceDay = Boolean(
    data &&
      data.usersPermissionsUser.data.attributes.attendanceServiceDay.data &&
      !data.usersPermissionsUser.data.attributes.attendanceServiceDay.data
        .attributes.dtEnd &&
      dayjs().isSame(
        data.usersPermissionsUser.data.attributes.attendanceServiceDay.data
          .attributes.createdAt,
        "day",
      ),
  );

  const role = user?.role?.name.toUpperCase();
  const routes: Route[] = [];

  if (role) {
    if (allowedRoles.gse.includes(role)) {
      routes.unshift({
        Icon: StockIcon,
        name: "HandleGse",
        label: "Almoxarifado",
      });
    }

    if (allowedRoles.pnae.includes(role)) {
      routes.unshift({
        name: "Pnae",
        label: "PNAE",
        Icon: AccessibilityIcon,
      });
    }

    if (allowedRoles.ramp.includes(role)) {
      routes.unshift({
        label: "Rampa",
        Icon: TruckLoadingIcon,
        name: !hasTodayServiceDay && rule ? "RampOpenShift" : "ActivitiesList",
      });
    }

    if (allowedRoles.ceop.includes(role)) {
      routes.unshift({
        Icon: StockIcon,
        name: "StepOneCeop",
        label: "Ceop",
      });
    }
  }

  return (
    <OrbitalBackground>
      <Layout>
        <View style={styles.apresentation}>
          <Apresentation />
        </View>

        {role === "PNAE_AAP" && <PnaeOpenShift />}

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <Spinner size={48} />
          </View>
        ) : (
          <FlatList
            data={routes}
            numColumns={2}
            keyExtractor={route => route.name}
            contentContainerStyle={{
              paddingTop: 40,
              paddingBottom: 16,
              paddingHorizontal: 24,
            }}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={handleNavigateToRoute(item.name)}
                className="items-center justify-center space-y-2 rounded-lg px-2 py-10"
                style={{
                  elevation: 8,
                  width: cardWidth,
                  backgroundColor: "#F2F9FF",
                  marginTop: index > 1 ? 16 : 0,
                  marginLeft: (index + 1) % 2 === 0 ? 24 : 0,
                }}
              >
                <Text className="text-base font-bold uppercase text-regal-blue">
                  {item.label}
                </Text>

                <item.Icon width={36} height={36} />
              </TouchableOpacity>
            )}
          />
        )}
      </Layout>
    </OrbitalBackground>
  );
};
