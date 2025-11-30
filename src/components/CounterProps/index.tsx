import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  UpdateMaterialRequestQtdMutation,
  UpdateMaterialRequestQtdResponse,
  UpdateMaterialRequestQtdVariables,
} from "~/graphql/mutations/update-qtd-material-items";
import { apolloClient } from "~/lib/apollo";

type CounterProps = {
  initialValue: number;
  idMaterialrequestItem: string;
};

const Counter: React.FC<CounterProps> = ({
  initialValue,
  idMaterialrequestItem,
}) => {
  const [count, setCount] = useState(initialValue);

  const decrement = () => {
    if (count > 0) {
      const newCount = count - 1;
      setCount(newCount);
      handleUpdateMaterialRequestQtd(newCount);
    }
  };

  const increment = () => {
    const newCount = count + 1;
    setCount(newCount);
    handleUpdateMaterialRequestQtd(newCount);
  };

  async function handleUpdateMaterialRequestQtd(newCount: number) {
    try {
      await apolloClient.mutate<
        UpdateMaterialRequestQtdResponse,
        UpdateMaterialRequestQtdVariables
      >({
        mutation: UpdateMaterialRequestQtdMutation,
        variables: {
          id: idMaterialrequestItem,
          qtd: newCount,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View className="flex flex-col space-y-3 ">
      <View className="flex flex-row justify-center pt-3">
        <TouchableOpacity
          onPress={decrement}
          className="rounded-bl-lg rounded-tl-lg"
          style={{ backgroundColor: "#034881" }}
        >
          <Text
            className="text-14 px-5 py-3"
            style={{ color: "white", fontSize: 20 }}
          >
            -
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text
            className="text-14 px-5 py-3"
            style={{ color: "#034881", fontSize: 20 }}
          >
            {count}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={increment}
          className="rounded-br-lg rounded-tr-lg"
          style={{ backgroundColor: "#034881" }}
        >
          <Text
            className="text-14 px-5 py-3"
            style={{ color: "white", fontSize: 20 }}
          >
            +
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Counter;
