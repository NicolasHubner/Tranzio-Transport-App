import { useMemo } from "react";
import { Text, View } from "react-native";
import {
  AutocompleteDropdown,
  TAutocompleteDropdownItem,
} from "react-native-autocomplete-dropdown";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useAirports } from "~/hooks/useAirports";
import { useDepartments } from "~/hooks/useDepartments";

const priorityOptions: TAutocompleteDropdownItem[] = [
  { id: "critic", title: "Crítico" },
  { id: "important", title: "Importante" },
  { id: "routine", title: "Rotina" },
];

interface StepOneProps {
  onNextStep: () => void;
  setPriority: React.Dispatch<React.SetStateAction<string>>;
  setSelectedAirportId: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedDepartmentId: React.Dispatch<React.SetStateAction<string | null>>;
}

export const StepOne: React.FC<StepOneProps> = ({
  onNextStep,
  setPriority,
  setSelectedAirportId,
  setSelectedDepartmentId,
}) => {
  const { data: airportsData, loading: loadingAirports } = useAirports();
  const { data: departmentsData, loading: loadingDepartments } =
    useDepartments();

  const departments = departmentsData?.departments?.data;
  const airports = airportsData?.airports.data;

  const departmentOptions = useMemo((): TAutocompleteDropdownItem[] => {
    if (!departments) {
      return [];
    }

    return departments
      .filter(department => department.attributes.name === "MANUTENÇÃO")
      .map(department => {
        return {
          id: department.id,
          title: department.attributes.name,
        };
      });
  }, [departments]);

  const airportOptions = useMemo((): TAutocompleteDropdownItem[] => {
    if (!airports) {
      return [];
    }

    return airports
      .filter(airport => airport.attributes.IATA === "GRU")
      .map(airport => {
        return {
          id: airport.id,
          title: airport.attributes.IATA,
        };
      });
  }, [airports]);

  return (
    <View className="flex-1 flex-col space-y-7 px-5 py-5">
      <View>
        <Text className="mb-1 text-sm">Departamento</Text>

        <AutocompleteDropdown
          closeOnSubmit
          debounce={600}
          useFilter={false}
          closeOnBlur={false}
          dataSet={departmentOptions}
          loading={loadingDepartments}
          emptyResultText="Sem opções de departamento"
          inputContainerStyle={{ backgroundColor: "white" }}
          onSelectItem={item => setSelectedDepartmentId(item?.id ?? null)}
        />
      </View>

      <View>
        <Text className="mb-1 text-sm">Aeroporto</Text>

        <AutocompleteDropdown
          closeOnSubmit
          debounce={600}
          useFilter={false}
          closeOnBlur={false}
          dataSet={airportOptions}
          loading={loadingAirports}
          emptyResultText="Sem opções de aeroporto"
          inputContainerStyle={{ backgroundColor: "white" }}
          onSelectItem={item => setSelectedAirportId(item?.id ?? null)}
        />
      </View>

      <View className="flex-1 pb-5">
        <View>
          <Text className="mb-1 text-sm">Prioridade</Text>

          <AutocompleteDropdown
            closeOnSubmit
            debounce={600}
            useFilter={false}
            closeOnBlur={false}
            dataSet={priorityOptions}
            onChangeText={setPriority}
            inputContainerStyle={{ backgroundColor: "white" }}
            onSelectItem={item => setPriority(item?.id ?? null)}
          />
        </View>

        <View className="flex-1">
          <TouchableOpacity
            onPress={onNextStep}
            className="mt-14 h-16 flex-row items-center justify-center rounded-lg bg-[#034881]"
          >
            <Text className="text-center text-sm uppercase text-[#F2F9FF]">
              Continuar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
