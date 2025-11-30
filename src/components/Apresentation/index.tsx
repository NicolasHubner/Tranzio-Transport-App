import React from "react";
import { Text, View } from "react-native";
import { useAuth } from "../../hooks/useAuth";

const Apresentation: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <View>
      <Text className="text-base font-medium text-regal-blue">
        Olá {user.name}!
      </Text>

      <Text className="text-sm font-normal text-regal-blue">
        Matrícula: {user.username}
      </Text>
    </View>
  );
};

export default Apresentation;
