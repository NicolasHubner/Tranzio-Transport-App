import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Input, InputProps } from "../Input";

export const InputPassword: React.FC<InputProps> = ({ ...props }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  return (
    <View className="relative">
      <Input
        placeholder="********"
        autoCapitalize="none"
        {...props}
        style={{
          backgroundColor: "#F2F9FF",
          padding: 10,
          marginVertical: 10,
          height: 60,
          paddingRight: 40,
        }}
        secureTextEntry={!passwordVisible}
      />
      <View className="absolute right-2 top-7">
        <TouchableOpacity onPress={() => setPasswordVisible(prev => !prev)}>
          <Feather
            name={passwordVisible ? "eye-off" : "eye"}
            size={24}
            color="#034881"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
