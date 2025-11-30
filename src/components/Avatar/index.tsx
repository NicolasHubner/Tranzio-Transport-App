import React from "react";
import { Text, View } from "react-native";
import { User } from "../../types/User";

interface AvatarProps {
  user: User;
  size: number;
}

const Avatar: React.FC<AvatarProps> = ({ user, size }) => {
  const names = user.name.split(" ");
  const firstName = names.at(0);
  const lastName = names.at(-1);

  return (
    <View
      className="items-center justify-center rounded-full bg-[#2C5484]"
      style={{
        width: size,
        height: size,
      }}
    >
      <Text
        className="font-medium uppercase text-white"
        style={{ fontSize: size / 3.125 }}
      >
        {firstName?.at(0)}
        {lastName?.at(0)}
      </Text>
    </View>
  );
};

export default Avatar;
