import { useNavigation } from "@react-navigation/native";
import { Text, View } from "react-native";
import Apresentation from "~/components/Apresentation";
import Layout from "~/components/Layout";
import OrbitalBackground from "~/components/OrbitalBackground";
import { QueryFailed } from "~/components/QueryFailed";
import { Spinner } from "~/components/Spinner";
import { useAuth } from "~/hooks/useAuth";
import { useUserById } from "~/hooks/useUserById";
import { UpdatedAttendanceServiceDayForm } from "./UpdateAttendanceServiceDayForm";

export const UpdateShiftUserCount: React.FC = () => {
  const { goBack } = useNavigation();
  const { user } = useAuth();
  const { data, loading, refetch, error } = useUserById({
    variables: {
      id: user?.id,
    },
  });

  return (
    <OrbitalBackground>
      <Layout back={goBack}>
        <View className="px-5 pb-5">
          <View>
            <Apresentation />
          </View>
          <Text className="mt-6 text-sm font-normal text-[#034881]">
            Alterar colaboradores
          </Text>
        </View>
        {loading ? (
          <Spinner size={40} />
        ) : error || !data ? (
          <QueryFailed refetch={refetch} />
        ) : !data.usersPermissionsUser.data.attributes.attendanceServiceDay
            .data ||
          data.usersPermissionsUser.data.attributes.attendanceServiceDay.data
            .attributes.dtEnd ? (
          <Text className="text-center text-sm font-medium text-gray-neutral">
            Você não possui um turno aberto. 😢
          </Text>
        ) : (
          <UpdatedAttendanceServiceDayForm
            qtdUsers={
              data.usersPermissionsUser.data.attributes.attendanceServiceDay
                .data.attributes.qtdUsers
            }
            id={
              data.usersPermissionsUser.data.attributes.attendanceServiceDay
                .data.id
            }
          />
        )}
      </Layout>
    </OrbitalBackground>
  );
};
