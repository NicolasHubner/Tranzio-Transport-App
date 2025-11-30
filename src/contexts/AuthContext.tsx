import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Alert } from "react-native";
import { useMMKVObject } from "react-native-mmkv";
import OneSignal from "react-native-onesignal";
import type { ILogin } from "~/apis/AuthAPI/props";
import {
  loginMutation,
  LoginMutationResponse,
  LoginMutationVariables,
} from "~/graphql/mutations/login";
import {
  updateShiftMutation,
  UpdateShiftMutationVariables,
} from "~/graphql/mutations/update-shift";
import { meQuery, MeQueryResponse } from "~/graphql/queries/me";
import { apolloClient } from "~/lib/apollo";
import { storage } from "~/lib/mmkv";
import { User } from "~/types/User";
import { setAccessToken } from "~/utils/accessToken";
import { setCoordinatesId } from "~/utils/coordinatesId";
import { useInternetConnectionContext } from "./InternetConnectionContext";

interface AuthContextData {
  isAuthenticated: boolean;
  user: User | undefined;
  setUser: Dispatch<SetStateAction<User | undefined>>;
  login: (data: ILogin) => void | Promise<void>;
  logout: () => void | Promise<void>;
  loading: boolean;
  isInitialLoad: boolean;
  isFirstLogin: boolean;
  fetchUser: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextData);

const storageTokenKey = "@cfs/accessToken";
const userStorageKey = "@cfs/user";
const lastUserIdStorageKey = "@cfs/lastUserId";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isConnected } = useInternetConnectionContext();
  const [isInitialLoad, setIsInitialLoad] = useState(isConnected);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [user, _setUser] = useMMKVObject<User>(userStorageKey, storage);

  const userId = user?.id;

  const setUser: AuthContextData["setUser"] = useCallback(
    value => {
      if (typeof value === "function") {
        const existingUser = storage.getString(userStorageKey);

        return _setUser(
          value(existingUser ? JSON.parse(existingUser) : undefined),
        );
      }

      return _setUser(value);
    },
    [_setUser],
  );

  const fetchUser = useCallback(async () => {
    const { data } = await apolloClient.query<MeQueryResponse>({
      query: meQuery,
      fetchPolicy: "network-only",
    });

    if (!data.me.department.data) {
      return Alert.alert(
        "SEU USUÁRIO NÃO POSSUI DEPARTAMENTO",
        "Favor comunicar a central",
      );
    }

    const isFirstLogin = data.me.isFirstLogin;

    setCoordinatesId(data.me.coordinates?.data?.id);
    setUser({
      id: data.me.id,
      email: data.me.email,
      username: data.me.username,
      name: data.me.name,
      role: data.me.role,
      isShiftOpen: data.me.isShiftOpen,
      isFirstLogin: data.me.isFirstLogin,
    });
    setIsFirstLogin(isFirstLogin);
  }, [setUser, setIsFirstLogin]);

  useEffect(() => {
    if (!isConnected) return;

    AsyncStorage.getItem(storageTokenKey)
      .then(async accessToken => {
        if (!accessToken) return;
        setAccessToken(accessToken);
        await fetchUser();
      })
      .catch(error => {
        console.error("error", error);
        setAccessToken(null);
        OneSignal.deleteTag("user_email");
        // Alert.alert("Login", "Ocorreu um erro ao buscar o token.");
      })
      .finally(() => setIsInitialLoad(false));
  }, [isConnected, fetchUser]);

  const login = useCallback(
    async (input: ILogin) => {
      setIsLoading(true);

      const { data } = await apolloClient.mutate<
        LoginMutationResponse,
        LoginMutationVariables
      >({
        fetchPolicy: "no-cache",
        mutation: loginMutation,
        variables: { input },
      });

      if (data) {
        await AsyncStorage.setItem(storageTokenKey, data.login.jwt).catch(
          console.error,
        );

        setAccessToken(data.login.jwt);
      }

      const lastUserId = storage.getString(lastUserIdStorageKey);

      if (!lastUserId || lastUserId !== data?.login.user.id) {
        storage.clearAll();
      }

      setIsLoading(false);
      return fetchUser();
    },
    [fetchUser],
  );

  const logout = useCallback(async () => {
    storage.set(lastUserIdStorageKey, userId!);
    storage.delete(userStorageKey);
    OneSignal.deleteTag("user_email");

    await Promise.all([
      apolloClient.clearStore(),
      AsyncStorage.removeItem(storageTokenKey),
      apolloClient.mutate<{}, UpdateShiftMutationVariables>({
        mutation: updateShiftMutation,
        variables: {
          userId: userId!,
          isShiftOpen: false,
        },
      }),
    ]).catch(console.error);

    setAccessToken(null);
  }, [userId]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        setUser,
        fetchUser,
        isFirstLogin,
        isInitialLoad,
        loading: isLoading,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
