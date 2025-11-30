import * as Location from "expo-location";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import {
  CreateUserCoordinatesMutationResponse,
  CreateUserCoordinatesMutationVariables,
  createUserCoordinatesMutation,
} from "~/graphql/mutations/create-user-coordinates";
import {
  UpdateUserCoordinatesMutationResponse,
  UpdateUserCoordinatesMutationVariables,
  updateUserCoordinatesMutation,
} from "~/graphql/mutations/update-user-coordinates";
import { useAuth } from "~/hooks/useAuth";
import { apolloClient } from "~/lib/apollo";
import type { Coordinates } from "~/types/Coordinates";
import { getCoordinatesId, setCoordinatesId } from "~/utils/coordinatesId";
import { useInternetConnectionContext } from "./InternetConnectionContext";

interface LocationContextData {
  coordinates: Coordinates | null;
}

const LocationContext = createContext({} as LocationContextData);

export const useLocationContext = () => useContext(LocationContext);

interface LocationContextProviderProps {
  children: React.ReactNode;
}

export const LocationContextProvider: React.FC<
  LocationContextProviderProps
> = ({ children }) => {
  const { user } = useAuth();
  const hasPermissionRef = useRef(false);
  const [hasError, setHasError] = useState(false);
  const { isConnected } = useInternetConnectionContext();
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);

  const userId = user?.id;

  useEffect(() => {
    if (!userId || !isConnected || hasError) return;

    async function updateCoordinates() {
      const location = await Location.getCurrentPositionAsync();

      const coordinates: Coordinates = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setCoordinates(coordinates);
      const coordinatesId = getCoordinatesId();

      if (coordinatesId) {
        return apolloClient.mutate<
          UpdateUserCoordinatesMutationResponse,
          UpdateUserCoordinatesMutationVariables
        >({
          fetchPolicy: "no-cache",
          mutation: updateUserCoordinatesMutation,
          variables: {
            id: coordinatesId,
            data: coordinates,
          },
        });
      }

      const { data } = await apolloClient.mutate<
        CreateUserCoordinatesMutationResponse,
        CreateUserCoordinatesMutationVariables
      >({
        fetchPolicy: "no-cache",
        mutation: createUserCoordinatesMutation,
        variables: {
          data: {
            ...coordinates,
            publishedAt: new Date().toISOString(),
            user: userId!,
          },
        },
      });

      setCoordinatesId(data?.createUserCoordinate.data.id);
    }

    function fetchAndUpdateCoordinates() {
      if (!hasPermissionRef.current) {
        return Location.requestForegroundPermissionsAsync()
          .then(async ({ status }) => {
            hasPermissionRef.current = status === "granted";

            if (status !== "granted") {
              setHasError(true);
              return Alert.alert(
                "Localização",
                "Permissão para localização negada.",
              );
            }

            await updateCoordinates();
          })
          .catch(error => {
            setHasError(true);
            console.error(error);
          });
      }

      return updateCoordinates().catch(error => {
        setHasError(true);
        console.error(error);
      });
    }

    fetchAndUpdateCoordinates();
    const interval = setInterval(fetchAndUpdateCoordinates, 1000 * 2.5); // 2.5 segundos

    return () => {
      clearInterval(interval);
    };
  }, [userId, isConnected, hasError]);

  return (
    <LocationContext.Provider value={{ coordinates }}>
      {children}
    </LocationContext.Provider>
  );
};
