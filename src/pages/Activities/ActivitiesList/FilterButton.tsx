import classNames from "classnames";
import { Text, TouchableOpacity } from "react-native";

interface FilterButtonProps {
  isActive: boolean;
  icon?: React.ReactNode;
  onSelect: () => void;
  label: React.ReactNode;
  hasLeftMargin?: boolean;
}

export const FilterButton: React.FC<FilterButtonProps> = ({
  icon,
  label,
  isActive,
  onSelect,
  hasLeftMargin,
}) => (
  <TouchableOpacity
    onPress={onSelect}
    activeOpacity={0.7}
    className="flex-1 flex-row items-center justify-center space-x-1 px-4 py-1.5"
    style={{
      borderRadius: 10,
      marginLeft: hasLeftMargin ? 6 : 0,
      backgroundColor: isActive ? "#034881" : "#F2F9FF",
    }}
  >
    {icon}

    <Text
      className={classNames(
        "text-sm",
        isActive ? "text-white" : "text-regal-blue",
      )}
    >
      {label}
    </Text>
  </TouchableOpacity>
);
