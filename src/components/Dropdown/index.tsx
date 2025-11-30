import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import optionsIcon from "/images/optionsIcon.png";
interface DropdownMenuProps {
  onDelete: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [, setSelectedOption] = useState("");

  const options = ["Deletar"];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectOption = (option: string) => {
    if (option === "Deletar") {
      onDelete();
    }
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <View className="flex w-20" style={{ position: "relative" }}>
      <TouchableOpacity
        className="flex flex-row justify-end"
        onPress={toggleDropdown}
      >
        <View>
          <Image source={optionsIcon} />
        </View>
      </TouchableOpacity>
      {isOpen && (
        <View className="bg-white">
          {options.map(option => (
            <TouchableOpacity key={option} onPress={() => selectOption(option)}>
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 9999,
                }}
              >
                <View
                  className="p-3"
                  style={{
                    position: "absolute",
                    backgroundColor: "white",
                  }}
                >
                  <Text>{option}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default DropdownMenu;
