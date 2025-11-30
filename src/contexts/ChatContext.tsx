import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import type { ChatFiltersFormInput } from "~/validation/chat-filters";

type ActiveTab = "leaders" | "groups";

interface ChatContextData {
  activeTab: ActiveTab;
  selectedChatId: string | null;
  filters: ChatFiltersFormInput;
  setActiveTab: Dispatch<SetStateAction<ActiveTab>>;
  setFilters: Dispatch<SetStateAction<ChatFiltersFormInput>>;
  setSelectedChatId: Dispatch<SetStateAction<string | null>>;
}

const ChatContext = createContext({} as ChatContextData);

export const useChatContext = () => useContext(ChatContext);

interface ChatContextProviderProps {
  children: React.ReactNode;
}

export const ChatContextProvider: React.FC<ChatContextProviderProps> = ({
  children,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("leaders");
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [filters, setFilters] = useState<ChatFiltersFormInput>({
    leaderIds: [],
    groupIds: [],
  });

  return (
    <ChatContext.Provider
      value={{
        filters,
        activeTab,
        selectedChatId,
        setFilters,
        setActiveTab,
        setSelectedChatId,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
