import { createContext, useCallback, useContext, useState } from "react";

interface DrawerMenuContextData {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const DrawerMenuContext = createContext({} as DrawerMenuContextData);

export const useDrawerMenuContext = () => useContext(DrawerMenuContext);

interface DrawerMenuContextProviderProps {
  children: React.ReactNode;
}

export const DrawerMenuContextProvider: React.FC<
  DrawerMenuContextProviderProps
> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <DrawerMenuContext.Provider
      value={{
        isOpen,
        open,
        close,
      }}
    >
      {children}
    </DrawerMenuContext.Provider>
  );
};
