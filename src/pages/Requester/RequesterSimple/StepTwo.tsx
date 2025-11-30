import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import CardProduct from "~/components/CardProduct";
import { Input } from "~/components/Input";
import { ProductsData } from "~/graphql/queries/products";
import { useMaterialRequestsItemByInternalCodeQtd } from "~/hooks/useMaterialRequestsByInternalCodeQtd";
import { RequestConfirmed } from ".";

interface StepTwoProps {
  osText: string;
  ptmText: string;
  productLoading: boolean;
  products: ProductsData[];
  onDelete: (index: number) => void;
  onAddProduct: (count: number) => void;
  productsConfirmed: RequestConfirmed[];
  selectedProduct: ProductsData | undefined;
  setOsText: React.Dispatch<React.SetStateAction<string>>;
  setPtmText: React.Dispatch<React.SetStateAction<string>>;
  setSelectedStep: React.Dispatch<React.SetStateAction<number>>;
  setSelectedProductId: (id: string | undefined) => void;
  setSearchProduct: React.Dispatch<React.SetStateAction<string>>;
}

export const StepTwo: React.FC<StepTwoProps> = ({
  osText,
  ptmText,
  products,
  onDelete,
  setOsText,
  setPtmText,
  onAddProduct,
  productLoading,
  setSelectedStep,
  selectedProduct,
  productsConfirmed,
  setSelectedProductId,
  setSearchProduct,
}) => {
  const [count, setCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [duplicateProduct, setDuplicateProduct] = useState(false);

  const { data: dataMaterialRequestItem } =
    useMaterialRequestsItemByInternalCodeQtd({
      skip: !selectedProduct?.attributes.internalCode,
      variables: {
        internalCode: selectedProduct?.attributes.internalCode as string,
      },
    });

  const reservedAmount =
    dataMaterialRequestItem?.materialRequestItems.data.reduce((total, item) => {
      return total + item.attributes.qtty;
    }, 0);

  useEffect(() => {
    setSelectedStep(currentSelectedStep => {
      if (currentSelectedStep === 2 && productsConfirmed.length === 0) {
        return currentSelectedStep - 1;
      }

      return currentSelectedStep;
    });
  }, [productsConfirmed, setSelectedStep]);

  function handleDecrement() {
    setCount(Math.max(count - 1, 0));
  }

  function handleIncrement() {
    setCount(count + 1);
  }

  function closeModal() {
    setSelectedProductId(undefined);
    setModalVisible(false);
    setCount(0);
  }

  return (
    <View className="flex flex-1 flex-col space-y-7 px-5">
      <View className="mt-5 w-full">
        <Text className="mb-1 text-sm">Produto</Text>

        <AutocompleteDropdown
          onClear={() => {
            setSelectedProductId(undefined);
            setSearchProduct("");
          }}
          useFilter={false}
          closeOnBlur={false}
          loading={productLoading}
          onChangeText={text => setSearchProduct(text.toUpperCase())}
          inputContainerStyle={{ backgroundColor: "white" }}
          emptyResultText="Informe o número OTK ou nome do item"
          dataSet={products.map(product => {
            return {
              id: product.id,
              title: `${product.attributes.internalCode} - ${product.attributes.productDescription}`,
            };
          })}
          onSelectItem={item => {
            setSelectedProductId(item?.id);
            setModalVisible(Boolean(item));
          }}
        />
      </View>

      {productsConfirmed.length > 0 && (
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            marginBottom: 36,
            width: "90%",
          }}
        >
          <TouchableOpacity
            onPress={() => setSelectedStep(2)}
            className="rounded-bl-lg rounded-tl-lg"
            style={{ backgroundColor: "#034881" }}
          >
            <Text
              className="text-14 px-9 py-3"
              style={{ color: "white", fontSize: 20 }}
            >
              Avançar
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal transparent statusBarTranslucent visible={modalVisible}>
        <TouchableWithoutFeedback>
          <View
            className="flex-1 items-center justify-center"
            style={{ backgroundColor: "#333333" }}
          >
            <View
              className="max-h-4/5 w-4/5 rounded-lg"
              style={{ backgroundColor: "#F2F9FF" }}
            >
              {selectedProduct && (
                <CardProduct
                  title={selectedProduct.attributes.productDescription}
                  code={selectedProduct.attributes.internalCode}
                  isSelected={false}
                  qtdDisp={selectedProduct.attributes.quantityInStock}
                  onDelete={() => onDelete(0)}
                  id={selectedProduct.id}
                  count={0}
                  idProd={selectedProduct.attributes.idProd}
                  ptm={ptmText}
                  os={osText}
                />
              )}

              <View className="px-5">
                <Input
                  style={{
                    backgroundColor: "white",
                    padding: 10,
                    marginVertical: 10,
                  }}
                  value={osText}
                  onChangeText={setOsText}
                  placeholder="OS"
                />
              </View>

              <View className="px-5">
                <Input
                  style={{
                    backgroundColor: "white",
                    padding: 10,
                    marginVertical: 10,
                  }}
                  value={ptmText}
                  onChangeText={setPtmText}
                  placeholder="PTM"
                />
              </View>

              <View className="flex flex-row justify-center pb-10 pt-5">
                <TouchableOpacity
                  onPress={handleDecrement}
                  className="rounded-bl-lg rounded-tl-lg"
                  style={{ backgroundColor: "#034881" }}
                >
                  <Text
                    className="text-14 px-9 py-3"
                    style={{ color: "white", fontSize: 20 }}
                  >
                    -
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity>
                  <TextInput
                    className="text-14 px-9 py-3"
                    style={{ color: "#034881", fontSize: 20 }}
                    value={String(count)}
                    onChangeText={text => setCount(Number(text))}
                    editable={false}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleIncrement}
                  className="rounded-br-lg rounded-tr-lg"
                  style={{ backgroundColor: "#034881" }}
                >
                  <Text
                    className="text-14 px-9 py-3"
                    style={{ color: "white", fontSize: 20 }}
                  >
                    +
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="flex flex-row justify-around pb-5">
                <TouchableOpacity
                  onPress={closeModal}
                  style={{ backgroundColor: "#7C7C7C", borderRadius: 6 }}
                >
                  <Text
                    className="text-14 p-2 px-4"
                    style={{ color: "white", fontSize: 20 }}
                  >
                    Cancelar
                  </Text>
                </TouchableOpacity>

                {count > 0 ? (
                  <TouchableOpacity
                    className="rounded-md bg-[#034881]"
                    onPress={() => {
                      if (!osText || !ptmText) {
                        Alert.alert("Preencha todos os campos");
                        return;
                      }
                      onAddProduct(count);
                      setCount(0);
                      // setOsText("");
                      // setPtmText("");
                      closeModal();
                    }}
                  >
                    <Text className="p-2 px-4 text-xl text-white">
                      Confirmar
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        visible={duplicateProduct}
        transparent={true}
        style={{ backgroundColor: "white" }}
      >
        <View className="flex-1 items-center justify-center ">
          <View className="rounded-md bg-white p-4">
            <View className="mb-2 flex-row items-center">
              <Text className="mb-4 text-center text-lg">
                O produto encontra-se adicionado!
              </Text>
              <TouchableOpacity
                onPress={() => setDuplicateProduct(false)}
                className="mt-4 rounded-md bg-blue-500 p-2"
              >
                <Text className="text-center text-white">Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
