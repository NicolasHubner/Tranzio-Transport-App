import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Checkbox from "../CheckBox";
import camIcon from "/images/camIcon.png";
import comentIcon from "/images/comentIcon.png";

interface CardAttendanceLiveTaskItemProps {
  title: string
}
const CardAttendanceLiveTaskItem: React.FC<CardAttendanceLiveTaskItemProps> = ({ title }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (checked: boolean) => {
    setIsChecked(checked);
  };
  return (
    <View className="flex-row justify-around items-center rounded-lg p-5 my-3" style={{ backgroundColor: "#F2F9FF" }}>
      <Text className="mt-2" style={{ color: '#034881', fontSize: 14 }}>{title}</Text>
      <TouchableOpacity >
        <Image source={comentIcon} ></Image>
      </TouchableOpacity>
      <TouchableOpacity >
        <Image source={camIcon} ></Image>
      </TouchableOpacity>
      <Checkbox
        label=""
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
    </View >
  );
};
export default CardAttendanceLiveTaskItem