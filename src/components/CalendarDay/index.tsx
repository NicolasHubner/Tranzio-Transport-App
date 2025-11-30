import React from "react";
import { Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { styles } from "./styles";

interface CalendarDayProps {
  day: number;
  label: string;
  isSelected: boolean;
  onSelect: () => void;
}

export const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  label,
  onSelect,
  isSelected,
}) => (
  <TouchableOpacity
    onPress={onSelect}
    activeOpacity={0.6}
    style={{
      ...styles.container,
      backgroundColor: isSelected ? "#2C5484" : "transparent",
    }}
  >
    <Text
      style={{
        color: isSelected ? "#fff" : "#BCC1CD",
        marginBottom: 6,
      }}
    >
      {label}
    </Text>
    <Text
      style={{
        color: isSelected ? "#fff" : "#2C5484",
        fontWeight: "600",
      }}
    >
      {day}
    </Text>
  </TouchableOpacity>
);
