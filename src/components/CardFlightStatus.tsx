import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { Text, View } from "react-native";
import AirplaneStatus from "../assets/icons/airplane-status.svg";

const brazilianAirports: Record<string, string> = {
  AJU: "Aeroporto Internacional de Aracaju-Santa Maria",
  ARA: "Aeroporto de Araracaju-Santa Maria",
  BEL: "Aeroporto Internacional de Belém-Val-de-Cans",
  BSB: "Aeroporto Internacional de Brasília-Juscelino Kubitschek",
  CGB: "Aeroporto Internacional de Cuiabá-Marechal Rondon",
  CNF: "Aeroporto Internacional de Belo Horizonte-Confins-Tancredo Neves",
  CPV: "Aeroporto de Campina Grande-Presidente João Suassuna",
  CWB: "Aeroporto Internacional de Curitiba-Afonso Pena",
  FLN: "Aeroporto Internacional de Florianópolis-Hercílio Luz",
  FOR: "Aeroporto Internacional de Fortaleza-Pinto Martins",
  GIG: "Aeroporto Internacional do Rio de Janeiro-Galeão",
  GRU: "Aeroporto Internacional de São Paulo-Guarulhos",
  IGR: "Aeroporto Internacional de Cataratas del Iguazú",
  ILH: "Aeroporto Jorge Amado de Ilhéus",
  IMP: "Aeroporto Prefeito Renato Moreira de Imperatriz",
  IOS: "Aeroporto de Ilhéus",
  JDO: "Aeroporto de Juazeiro do Norte-Orlando Bezerra de Menezes",
  JJG: "Aeroporto Presidente João Batista Figueiredo",
  JPA: "Aeroporto Internacional de João Pessoa-Pres. Castro Pinto",
  JPR: "Aeroporto de Ji-Paraná",
  LDB: "Aeroporto Gov. José Richa de Londrina",
  MAB: "Aeroporto João Correa da Rocha de Marabá",
  MGF: "Aeroporto de Maringá",
  MIA: "Aeroporto de Miami",
  NAT: "Aeroporto Internacional de Natal-Aluízio Alves",
  NVT: "Aeroporto de Navegantes-Min. Victor Konder",
  OTZ: "Aeroporto de Kotzebue",
  PAI: "Aeroporto de Parintins-Júlio Belém",
  PET: "Aeroporto João Correa da Rocha de Pelotas",
  PHB: "Aeroporto de Parnaíba-Dr. João Silva Filho",
  POA: "Aeroporto Internacional de Porto Alegre-Salgado Filho",
  PPB: "Aeroporto de Presidente Prudente",
  QRF: "Aeroporto Internacional de Resende",
  RAJ: "Aeroporto de Rajkot",
  REC: "Aeroporto Internacional do Recife/Guararapes-Gilberto Freyre",
  SDU: "Aeroporto Santos Dumont do Rio de Janeiro",
  SSA: "Aeroporto Internacional de Salvador-Deputado Luís Eduardo Magalhães",
  STU: "Aeroporto João Batista Figueiredo de Santarém",
  THE: "Aeroporto de Teresina-Senador Petrônio Portella",
  UDI: "Aeroporto de Uberlândia-Ten. Cel. Aviador César Bombonato",
  VIX: "Aeroporto de Vitória-Goiabeiras",
  XAP: "Aeroporto de Chapecó-Serafin Enoss Bertaso",
  ZFM: "Aeroporto Internacional de Manaus-Eduardo Gomes",
  GYN: "Aeroporto Internacional Santa Genoveva",
  MCP: "Aeroporto de Amapá",
  APQ: "Aeroporto de Arapiraca",
  BAZ: "Aeroporto de Barcelos",
  PLU: "Aeroporto Carlos Drummond de Andrade",
  CFC: "Aeroporto Carlos Alberto da Costa Neves",
  VCP: "Aeroporto Internacional de Viracopos/Campinas",
  CPQ: "Aeroporto Campo dos Amarais",
  CAU: "Aeroporto de Caruaru",
  CAF: "Aeroporto de Carauari",
  CAC: "Aeroporto de Cascavel",
  CIZ: "Aeroporto Regional de Coari",
  CDJ: "Aeroporto de Conceição do Araguaia",
  CZS: "Aeroporto Internacional de Cruzeiro do Sul",
  BFH: "Aeroporto do Bacacheri",
  FEJ: "Aeroporto de Feijó",
  IGU: "Aeroporto Internacional Cataratas",
  IZA: "Aeroporto Presidente Itamar Franco",
  JJD: "Aeroporto Regional Comandante Ariston Pessoa",
  JOI: "Aeroporto de Joinville",
  JDF: "Aeroporto de Juiz de Fora",
  QDV: "Aeroporto de Jundiaí",
  MAO: "Aeroporto Internacional de Manaus",
  MCZ: "Aeroporto Internacional Zumbi dos Palmares",
  MVF: "Aeroporto Governador Dix-Sept Rosado",
  PGZ: "Comandante Antonio Amilton Beraldo",
  RAO: "Aeroporto de Ribeirão Preto",
  RBR: "Aeroporto Internacional de Rio Branco",
  ROO: "Aeroporto Municipal Maestro Marinho Franco",
  RIA: "Aeroporto de Santa Maria",
  SSZ: "Base Aérea de Santos",
  QSC: "Aeroporto Internacional de São Carlos",
  SLZ: "Aeroporto Internacional de São Luís",
  CGH: "Aeroporto de Congonhas",
  ZMD: "Aeroporto de Sena Madureira",
  SOD: "Aeroporto de Sorocaba",
  TBT: "Aeroporto Internacional de Tabatinga",
  TRQ: "Aeroporto de Tarauacá",
  TFF: "Aeroporto Regional de Tefé",
};

interface CardFlightStatusProps {
  STD: string;
  STA: string;
  prefix: string;
  origin: string;
  destiny: string;
  location: string;
  flightDate: string;
  ETD: string | null;
  ETA: string | null;
  flightNumber: number;
  actionType: "Arrival" | "Departure";
  isInternational: boolean | null;
}

export const CardFlightStatus: React.FC<CardFlightStatusProps> = ({
  ETD,
  ETA,
  STA,
  STD,
  origin,
  prefix,
  destiny,
  location,
  flightDate,
  actionType,
  flightNumber,
  isInternational,
}) => {
  return (
    <View
      className="rounded-lg bg-[#F2F9FF] px-5 py-4"
      style={{ elevation: 8 }}
    >
      <Text className="text-center text-lg font-medium text-regal-blue">
        VOO LA{flightNumber}
      </Text>
      <View className="flex-row justify-between">
        <View>
          <Text className="text-center text-2xl font-bold text-[#034881]">
            {origin}
          </Text>
          <Text className="max-w-[110px] text-center text-[10px] text-[#034881]">
            {brazilianAirports[origin]}
          </Text>
        </View>
        <View className="flex-row items-center justify-center">
          <Text className="text-xl text-[#034881]">-----</Text>
          <AirplaneStatus />
          <Text className="text-xl text-[#034881]">-----</Text>
        </View>
        <View>
          <Text className="text-center text-2xl font-bold text-[#034881]">
            {destiny}
          </Text>
          <Text className="max-w-[110px] text-center text-[10px] text-[#034881]">
            {brazilianAirports[destiny]}
          </Text>
        </View>
      </View>
      <View className="mt-4 flex-row space-x-12">
        <View className="flex-1 space-y-4">
          <View className="flex-row items-center space-x-1">
            <MaterialCommunityIcons
              name={
                actionType === "Arrival"
                  ? "airplane-landing"
                  : "airplane-takeoff"
              }
              size={24}
              color="#034881"
            />
            <Text className="text-xl font-medium text-[#034881]">
              {actionType === "Arrival" ? "Chegada" : "Saída"}
            </Text>
          </View>
          <View>
            <Text className="text-base font-medium text-[#034881]">
              Prefixo
            </Text>
            <Text className="text-base font-medium text-[#7C7C7C]">
              {prefix}
            </Text>
          </View>
          <View>
            <Text className="text-base font-medium text-[#034881]">STD</Text>
            <Text className="text-base font-medium text-[#7C7C7C]">
              {STD.substring(0, 5)} {dayjs(flightDate).format("DD/MM/YYYY")}
            </Text>
          </View>
          <View>
            <Text className="text-base font-medium text-[#034881]">ETD</Text>
            <Text className="text-base font-medium text-[#7C7C7C]">
              {ETD?.substring(0, 5) || "N/A"}{" "}
              {dayjs(flightDate).format("DD/MM/YYYY")}
            </Text>
          </View>
          {/* <View>
            <Text className="text-base font-medium text-[#034881]">
              Status do voo
            </Text>
            <Text className="text-base font-medium text-[#7C7C7C]">
              {statusFlight}
            </Text>
          </View> */}
        </View>

        <View className="flex-1 space-y-4">
          <View className="flex-row items-center space-x-1">
            <Ionicons name="airplane-outline" size={24} color="#034881" />
            <Text className="text-xl font-medium text-[#034881]">
              {isInternational ? "Internacional" : "Nacional"}
            </Text>
          </View>
          <View>
            <Text className="text-base font-medium text-[#034881]">
              Localização
            </Text>
            <Text className="text-base font-medium text-[#7C7C7C]">
              {location || "N/A"}
            </Text>
          </View>
          <View>
            <Text className="text-base font-medium text-[#034881]">STA</Text>
            <Text className="text-base font-medium text-[#7C7C7C]">
              {STA.substring(0, 5)} {dayjs(flightDate).format("DD/MM/YYYY")}
            </Text>
          </View>
          <View>
            <Text className="text-base font-medium text-[#034881]">ETA</Text>
            <Text className="text-base font-medium text-[#7C7C7C]">
              {ETA?.substring(0, 5) || "N/A"}{" "}
              {dayjs(flightDate).format("DD/MM/YYYY")}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
