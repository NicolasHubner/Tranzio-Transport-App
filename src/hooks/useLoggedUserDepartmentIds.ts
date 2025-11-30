import { useInternetConnectionContext } from "~/contexts/InternetConnectionContext";
import { useAuth } from "./useAuth";
import { useDepartments } from "./useDepartments";
import { useUserDepartment } from "./useUserDepartment";

export function useLoggedUserDepartmentIds() {
  const { user: loggedUser } = useAuth();
  const { isConnected } = useInternetConnectionContext();
  const { data: departmentsData, loading: loadingDepartments } = useDepartments(
    {
      skip: !isConnected,
    },
  );

  const userId = loggedUser?.id;

  const { data: userData, loading: loadingUserDepartment } = useUserDepartment({
    skip: !userId || !isConnected,
    variables: {
      id: userId!,
    },
  });

  const departmentId =
    userData?.usersPermissionsUser.data.attributes.department.data?.id;

  const departmentIds = [departmentId!];

  const loadingDepartmentId = departmentsData?.departments.data.find(
    department => {
      return department.attributes.code === "CED";
    },
  )?.id;

  const unloadingDepartmentId = departmentsData?.departments.data.find(
    department => {
      return department.attributes.code === "DSC";
    },
  )?.id;

  if (departmentId === loadingDepartmentId && unloadingDepartmentId) {
    departmentIds.push(unloadingDepartmentId);
  } else if (departmentId === unloadingDepartmentId && loadingDepartmentId) {
    departmentIds.push(loadingDepartmentId);
  }

  return {
    departmentIds,
    isLoading: loadingDepartments || loadingUserDepartment,
  };
}
