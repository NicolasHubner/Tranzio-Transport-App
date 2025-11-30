import { createContext, useContext } from "react";

interface InternetConnectionContextData {
  isConnected: boolean;
}

const InternetConnectionContext = createContext(
  {} as InternetConnectionContextData,
);

export const useInternetConnectionContext = () =>
  useContext(InternetConnectionContext);

interface InternetConnectionContextProviderProps
  extends InternetConnectionContextData {
  children: React.ReactNode;
}

export const InternetConnectionContextProvider: React.FC<
  InternetConnectionContextProviderProps
> = ({ children, isConnected }) => (
  <InternetConnectionContext.Provider value={{ isConnected }}>
    {children}
  </InternetConnectionContext.Provider>
);
