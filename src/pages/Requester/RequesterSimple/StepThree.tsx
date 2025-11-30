import classNames from "classnames";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CardProduct from "~/components/CardProduct";
import { RequestConfirmed } from ".";

interface StepThreeProps {
  onDelete: (index: number) => void;
  onCreateRequest: () => Promise<void>;
  productsConfirmed: RequestConfirmed[];
  setSelectedStep: React.Dispatch<React.SetStateAction<number>>;
}

export const StepThree: React.FC<StepThreeProps> = ({
  onDelete,
  onCreateRequest,
  setSelectedStep,
  productsConfirmed,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <View className="mt-2 flex-1">
      <FlatList
        data={productsConfirmed}
        keyExtractor={product => product.id}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        ItemSeparatorComponent={() => <View className="my-4" />}
        ListEmptyComponent={() => (
          <View className="flex justify-center">
            <Text className="text-14 p-3 px-9 text-xl text-[#034881]">
              Não há produtos a adicionados!{" "}
            </Text>
          </View>
        )}
        renderItem={({ item: product, index }) => (
          <View className="rounded-lg bg-[#F2F9FF]">
            <CardProduct
              key={index}
              {...product}
              onDelete={() => onDelete(index)}
            />
          </View>
        )}
      />

      <View className="my-4 flex flex-row justify-around">
        <TouchableOpacity
          onPress={() => setSelectedStep(selectedStep => selectedStep - 1)}
        >
          <View
            className="px-5"
            style={{
              backgroundColor: "#7C7C7C",
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 8,
              height: 50,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                padding: 5,
                color: "#F2F9FF",
                textAlign: "center",
                fontSize: 14,
              }}
            >
              ADICIONAR
            </Text>
          </View>
        </TouchableOpacity>

        {productsConfirmed.length > 0 && (
          <TouchableOpacity
            disabled={isSubmitting}
            onPress={async () => {
              setIsSubmitting(true);
              await onCreateRequest();
              setIsSubmitting(false);
            }}
            className={classNames(
              "h-[50px] flex-row items-center justify-center rounded-lg px-5",
              isSubmitting ? "bg-[#7C7C7C]" : "bg-[#034881]",
            )}
          >
            {isSubmitting ? (
              <View className="items-center">
                <ActivityIndicator size={20} color="white" />
              </View>
            ) : (
              <Text
                style={{
                  padding: 5,
                  color: "#F2F9FF",
                  textAlign: "center",
                  fontSize: 14,
                }}
              >
                FINALIZAR
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
