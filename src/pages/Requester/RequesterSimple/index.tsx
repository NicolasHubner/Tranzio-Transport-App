import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Alert, LogBox, View } from "react-native";
import Steps from "react-native-steps";
import {
  CreateMaterialRequestMutation,
  CreateMaterialRequestResponse,
  CreateMaterialRequestVariables,
} from "~/graphql/mutations/createMaterialRequest";
import {
  CreateMaterialRequestItemMutation,
  CreateMaterialRequestItemResponse,
  CreateMaterialRequestItemVariables,
} from "~/graphql/mutations/createMaterialRequestItem";
import { useAuth } from "~/hooks/useAuth";
import { useDebouncedValue } from "~/hooks/useDebouncedValue";
import { useProducts } from "~/hooks/useProducts";
import { apolloClient } from "~/lib/apollo";
import { otkApiFunctions } from "~/services/otkApi/otkLogin";
import { StepOne } from "./StepOne";
import { StepThree } from "./StepThree";
import { StepTwo } from "./StepTwo";

LogBox.ignoreLogs([
  "Animated: `useNativeDriver` was not specified",
  "componentWillReceiveProps has been renamed",
]);

const configs = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: "#034881",
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: "#034881",
  stepStrokeUnFinishedColor: "#DADADA",
  separatorFinishedColor: "#034881",
  separatorUnFinishedColor: "#DADADA",
  stepIndicatorFinishedColor: "#034881",
  stepIndicatorUnFinishedColor: "#DADADA",
  stepIndicatorCurrentColor: "#034881",
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: "#DADADA",
  stepIndicatorLabelFinishedColor: "#DADADA",
  stepIndicatorLabelUnFinishedColor: "#034881",
  labelColor: "#034881",
  labelSize: 13,
  currentStepLabelColor: "#034881",
};

const labels = ["1", "2", "3"];

export interface RequestConfirmed {
  title: string;
  code: string;
  isSelected: boolean;
  qtdDisp: number | null;
  id: string;
  count: number;
  ptm: string;
  os: string;
  idProd: string;
}

const RequesterSimple: React.FC = () => {
  const { user } = useAuth();
  const [osText, setOsText] = useState("");
  const [ptmText, setPtmText] = useState("");
  const [priority, setPriority] = useState("");
  const [selectedStep, setSelectedStep] = useState(0);
  const [, setSelectedAirportId] = useState<string | null>(null);
  const [searchProduct, setSearchProduct] = useState("");
  const debouncedSearchValue = useDebouncedValue(searchProduct, 700);

  const { data: productsData, loading: productsLoading } = useProducts({
    variables: {
      search: debouncedSearchValue,
    },
  });

  const [productsConfirmed, setProductsConfirmed] = useState<
    RequestConfirmed[]
  >([]);

  const [selectedProduct, setSelectedProduct] = useState<any>(undefined);

  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    string | null
  >(null);

  useEffect(() => {
    setSelectedStep(currentSelectedStep => {
      if (currentSelectedStep === 2 && productsConfirmed.length === 0) {
        return currentSelectedStep - 1;
      }

      return currentSelectedStep;
    });
  }, [productsConfirmed.length]);

  function handleDeleteProduct(deleteIndex: number) {
    setProductsConfirmed(currentProducts => {
      return currentProducts.filter((_, index) => index !== deleteIndex);
    });
  }

  const products = productsData?.products?.data || [];

  const getProduct = async (id?: string) => {
    const product = products.find(product => product.id === id);

    if (!product) {
      setSelectedProduct(undefined);
      return;
    }

    const otkResponse = await otkApiFunctions.verificaEstoque(
      product.attributes.idProd,
    );

    if (otkResponse) {
      const productOtk = otkResponse.find(
        (item: any) => item.codigoDaFilial === 1,
      );

      const parse = {
        attributes: {
          productDescription: productOtk.descricaoDoProduto,
          internalCode: product.attributes.internalCode,
          quantityInStock: productOtk.quantidadeTotal,
          idProd: product.attributes.idProd,
        },
        id: product.id,
      };
      setSelectedProduct(parse);
    }
  };

  const handleAddProduct = (count: number) => {
    if (!selectedProduct) return;

    // Adiciona o produto à lista
    setProductsConfirmed(currentProducts => {
      const exists = currentProducts.some(
        product =>
          product.title === selectedProduct.attributes.productDescription,
      );

      if (exists) {
        return currentProducts;
      }

      return [
        ...currentProducts,
        {
          title: selectedProduct.attributes.productDescription,
          code: selectedProduct.attributes.internalCode!,
          isSelected: true,
          qtdDisp: selectedProduct.attributes.quantityInStock,
          id: selectedProduct.id,
          count: count,
          ptm: ptmText,
          os: osText,
          idProd: selectedProduct.attributes.idProd,
        },
      ];
    });

    setSelectedStep(selectedStep + 1);
  };

  function handleSeccondStep() {
    selectedDepartmentId === undefined ||
    selectedDepartmentId === null ||
    priority === ""
      ? Alert.alert("Erro!", "A requisição falhou!")
      : setSelectedStep(selectedStep + 1);
  }

  const getRandomCode = (): string => {
    const length = 6; // Comprimento do código gerado
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // Caracteres permitidos
    let code = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }

    return code;
  };

  //Criando requisicao (CAPA)
  async function handleCreateMaterialRequest() {
    const code = getRandomCode();

    try {
      const now = new Date().toISOString();
      const input: CreateMaterialRequestVariables["input"] = {
        publishedAt: now,
        requestCode: code,
        status: "pending",
        priority: priority,
        approver: user?.name || "admin",
        department_id: selectedDepartmentId!,
        user: user?.id || "default_user_id",
      };

      const response = await apolloClient.mutate<
        CreateMaterialRequestResponse,
        CreateMaterialRequestVariables
      >({
        mutation: CreateMaterialRequestMutation,
        variables: { input },
      });

      if (!response.data) {
        throw response;
      }

      await Promise.all(
        productsConfirmed.map(async product => {
          if (!product.code) return;

          await apolloClient.mutate<
            CreateMaterialRequestItemResponse,
            CreateMaterialRequestItemVariables
          >({
            mutation: CreateMaterialRequestItemMutation,
            variables: {
              input: {
                // codLocal: "0",
                // codSection: "0",
                // codWarehouse: 0,
                status: "pending",
                osOTK: product.os,
                qtty: product.count,
                ptmOTK: product.ptm,
                products: product.id,
                publishedAt: now,
                material_request: response.data!.createMaterialRequest.data.id,
              },
            },
          });
        }),
      );

      setSelectedStep(0);
      Alert.alert("Sucesso!", " Seu código de requisição é: " + code);
      navigate("HandleGse");
    } catch (error) {
      Alert.alert("Erro!", "A requisição falhou!");
    }
  }
  const { navigate } = useNavigation();

  return (
    <View className="flex flex-1 flex-col space-y-7 px-5 pt-2">
      <Steps
        count={3}
        labels={labels}
        reversed={false}
        configs={configs}
        current={selectedStep}
      />

      {selectedStep === 0 && (
        <StepOne
          setPriority={setPriority}
          onNextStep={handleSeccondStep}
          setSelectedAirportId={setSelectedAirportId}
          setSelectedDepartmentId={setSelectedDepartmentId}
        />
      )}

      {selectedStep === 1 && (
        <StepTwo
          osText={osText}
          ptmText={ptmText}
          products={products}
          setOsText={setOsText}
          setPtmText={setPtmText}
          onDelete={handleDeleteProduct}
          onAddProduct={handleAddProduct}
          productLoading={productsLoading}
          setSelectedStep={setSelectedStep}
          selectedProduct={selectedProduct}
          productsConfirmed={productsConfirmed}
          setSelectedProductId={e => getProduct(e)}
          setSearchProduct={setSearchProduct}
        />
      )}

      {selectedStep === 2 && (
        <StepThree
          onDelete={handleDeleteProduct}
          setSelectedStep={setSelectedStep}
          productsConfirmed={productsConfirmed}
          onCreateRequest={handleCreateMaterialRequest}
        />
      )}
    </View>
  );
};

export default RequesterSimple;
