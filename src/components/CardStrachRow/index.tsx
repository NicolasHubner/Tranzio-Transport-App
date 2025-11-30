import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import { DepartmentsData } from '~/graphql/queries/departments';
import { useDepartments } from '~/hooks/useDepartments';
import statusIcon from "../../images/statusIcon.png";
import statusIconAverage from "../../images/statusIconAverage.png";
import statusIconHigh from "../../images/statusIconHigh.png";
import arrowBottomIcon from "/images/arrowBottomIcon.png";

interface CardStrachRowProps {
  backgroundColor: string;
  textColor: string
  fontSize: number;
  text: string;
  hasArrowIcon?: boolean;
}
const priorityText = {
  routine: 'Rotina',
  important: 'Importante',
  critic: 'Critico'
}

const CardStrachRow: React.FC<CardStrachRowProps> = ({
  backgroundColor,
  textColor,
  fontSize,
  text,
  hasArrowIcon = false,
}) => {
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [isCardVisibleDepartment, setIsCardVisibleDepartment] = useState(false);

  const handleNavigate = () => {
  };
  const handleToggleCard = () => {
    text == "Prioridade" ?
      setIsCardVisible(!isCardVisible) :
      setIsCardVisibleDepartment(!isCardVisibleDepartment)
  };

  const [searchValue, setSearchValue] = useState("");

  const { data: DataDepartamentsResponse } = useDepartments({
    fetchPolicy: "cache-first",
  });
  const departaments = DataDepartamentsResponse?.departments?.data || [];

  const [, setSelectedDepartment] = useState<DepartmentsData | null>(null);

  const filterDepartment = (value: string) => {
    return departaments.filter((departament) =>
      departament.attributes.name.toLowerCase().includes(value.toLowerCase())
    );
  };
  const handleSelectDepartment = (department: DepartmentsData) => {
    setSelectedDepartment(department);
    setSearchValue(department.attributes.name); // Fixa o valor no campo de texto
  };

  return (
    <View>
      <TouchableOpacity onPress={hasArrowIcon ? handleToggleCard : handleNavigate}>
        <View
          style={{
            backgroundColor,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingStart: 20,
            paddingEnd: 20,
            alignItems: 'center',
            borderRadius: 8,
            height: 64,
          }}
        >
          <Text style={{ color: textColor, paddingLeft: 5, fontSize }}>
            {text}
          </Text>
          {hasArrowIcon && <Image source={arrowBottomIcon} />}
        </View>
      </TouchableOpacity>

      {
        isCardVisible && (
          <View
            style={{
              backgroundColor,
              padding: 16,
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
            }}
          >
            <View className='flex flex-column pl-2 space-y-7'>
              <View className='flex flex-row justify-between'>
                <Text style={{ color: textColor, fontSize }}>{priorityText.routine} </Text>
                <Image className="pr-5" style={{ height: 20, width: 20 }} source={statusIcon} />
              </View>
              <View className='flex flex-row justify-between'>
                <Text style={{ color: textColor, fontSize }}>{priorityText.important} </Text>
                <Image className="pr-5" style={{ height: 20, width: 20 }} source={statusIconAverage} />
              </View>
              <View className='flex flex-row justify-between'>
                <Text style={{ color: textColor, fontSize }}>{priorityText.critic} </Text>
                <Image className="pr-5" style={{ height: 20, width: 20 }} source={statusIconHigh} />
              </View>
            </View>
          </View>
        )
      }
      {
        isCardVisibleDepartment && (
          <View
            style={{
              backgroundColor,
              padding: 16,
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
            }}
          >

            <View className="flex px-2  h-10 justify-center rounded-md" >
              <Autocomplete
                placeholder="Buscar"
                data={searchValue ? filterDepartment(searchValue) : []}
                value={searchValue}
                onChangeText={(text) => setSearchValue(text)}
                flatListProps={{
                  ListEmptyComponent: () => <Text>Nenhum item encontrado.</Text>,
                  keyExtractor: (_, index) => index.toString(),
                  renderItem: ({ item }) => (
                    <View style={{ backgroundColor: 'white' }}>
                      <TouchableOpacity onPress={() => handleSelectDepartment(item)}>
                        <Text style={{ fontSize: 14 }}>{item.attributes.name}</Text>
                      </TouchableOpacity>
                    </View>
                  ),
                }}
              />
            </View>

          </View>

        )
      }
    </View >
  );
};

export default CardStrachRow;
