import { Ionicons } from "@expo/vector-icons";
import {
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
}) => (
  <Modal transparent statusBarTranslucent visible={isOpen} animationType="fade">
    <Pressable
      android_disableSound
      className="absolute h-full w-full items-center justify-center bg-black/40"
      onPress={event => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <View className="relative h-[90%] w-[90%] rounded-lg bg-white">
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <TouchableOpacity
            onPress={onClose}
            className="absolute right-2 top-2"
          >
            <Ionicons name="close" size={24} color="#202024" />
          </TouchableOpacity>

          <Text className="text-center text-xl font-semibold text-[#202024]">
            Política de Privacidade do Aplicativo Tranzio
          </Text>

          <Text className="mt-3 text-lg font-medium text-[#202024]">
            Globaldyne Tecnologia Ltda
          </Text>

          <Text className="mt-1 text-lg font-medium text-[#202024]">
            CNPJ 14.942.117/0001-07
          </Text>

          <Text className="mt-1 text-lg font-medium text-[#202024]">
            Última atualização: 13/11/2023
          </Text>

          <Text className="mt-1 text-lg font-medium text-[#202024]">
            E-mail de contato:{" "}
            <Text
              className="text-blue-500 underline"
              onPress={() => {
                Linking.openURL("mailto:comercial@globaldyne.com.br");
              }}
            >
              comercial@globaldyne.com.br
            </Text>
          </Text>

          <Text className="mt-2 text-base font-normal text-[#202024]">
            Esta Política de Privacidade descreve como a Globaldyne Tecnologia
            Ltda ("nós" ou "nosso") coleta, usa, compartilha e protege as suas
            informações pessoais ao utilizar o aplicativo Tranzio (o "Aplicativo").
            Esta política está em conformidade com a Lei Geral de Proteção de
            Dados (Lei nº 13.709/2018) do Brasil, doravante denominada "LGPD."
          </Text>

          <Text className="mt-2 text-lg font-medium text-[#202024]">
            1. Informações que Coletamos
          </Text>

          <Text className="mt-2 text-base font-medium text-[#202024]">
            1.1. Dados de Identificação: Ao criar uma conta no Aplicativo Tranzio,
            poderemos coletar informações como nome, endereço de e-mail, número
            de telefone, nome de usuário e senha.
          </Text>

          <Text className="mt-2 text-base font-medium text-[#202024]">
            1.2. Dados de Uso: Coletamos informações sobre como você utiliza o
            Aplicativo, incluindo ações realizadas, tempo de utilização e
            estatísticas de uso.
          </Text>

          <Text className="mt-2 text-base font-medium text-[#202024]">
            1.3. Dados do Dispositivo: Podemos coletar informações sobre o
            dispositivo que você utiliza para acessar o Aplicativo, como modelo
            do dispositivo, sistema operacional, endereço IP e identificadores
            únicos.
          </Text>

          <Text className="mt-2 text-lg font-medium text-[#202024]">
            2. Uso das Informações Coletadas
          </Text>

          <Text className="mt-2 text-base font-medium text-[#202024]">
            2.1. Fins de Uso: Utilizamos as informações coletadas para:
          </Text>

          <View className="ml-4 mt-1 space-y-2">
            <Text className="text-[#202024]">
              {"\u2022"} Fornecer e aprimorar os serviços do Aplicativo;
            </Text>

            <Text className="text-[#202024]">
              {"\u2022"} Personalizar a sua experiência no Aplicativo;
            </Text>

            <Text className="text-[#202024]">
              {"\u2022"} Enviar atualizações, notificações e informações
              relevantes sobre o Aplicativo;
            </Text>

            <Text className="text-[#202024]">
              {"\u2022"} Cumprir obrigações legais e regulatórias conforme
              estabelecido pela LGPD.
            </Text>
          </View>

          <Text className="mt-2 text-lg font-medium text-[#202024]">
            3. Compartilhamento de Informações
          </Text>

          <Text className="mt-2 text-base font-medium text-[#202024]">
            3.1. Compartilhamento Limitado: Suas informações pessoais podem ser
            compartilhadas com terceiros apenas nas seguintes situações:
          </Text>

          <View className="ml-4 mt-1 space-y-2">
            <Text className="text-[#202024]">
              {"\u2022"} Com o seu consentimento expresso;
            </Text>

            <Text className="text-[#202024]">
              {"\u2022"} Para cumprir obrigações legais ou regulatórias
              previstas na LGPD;
            </Text>

            <Text className="text-[#202024]">
              {"\u2022"} Para proteger os nossos direitos, privacidade,
              segurança ou propriedade, ou de terceiros;
            </Text>

            <Text className="text-[#202024]">
              {"\u2022"} Em casos de fusões, aquisições, vendas de ativos ou
              eventos corporativos similares.
            </Text>
          </View>

          <Text className="mt-2 text-lg font-medium text-[#202024]">
            4. Segurança das Informações
          </Text>

          <Text className="mt-2 text-base font-medium text-[#202024]">
            4.1. Medidas de Segurança: Implementamos medidas técnicas e
            organizacionais adequadas para proteger as suas informações pessoais
            contra acesso não autorizado, uso indevido, divulgação ou
            destruição, de acordo com as exigências da LGPD e outras
            regulamentações aplicáveis.
          </Text>

          <Text className="mt-2 text-lg font-medium text-[#202024]">
            5. Seus Direitos de Privacidade
          </Text>

          <Text className="mt-2 text-base font-medium text-[#202024]">
            5.1. Direitos do Titular: De acordo com a LGPD, você possui os
            seguintes direitos:
          </Text>

          <View className="ml-4 mt-1 space-y-2">
            <Text className="text-[#202024]">
              {"\u2022"} Acesso aos seus dados pessoais;
            </Text>

            <Text className="text-[#202024]">
              {"\u2022"} Correção de dados incompletos, inexatos ou
              desatualizados;
            </Text>

            <Text className="text-[#202024]">
              {"\u2022"} Anonimização, bloqueio ou eliminação de dados
              desnecessários ou excessivos;
            </Text>

            <Text className="text-[#202024]">
              {"\u2022"} Portabilidade dos dados a outro fornecedor de serviço
              ou produto;
            </Text>

            <Text className="text-[#202024]">
              {"\u2022"} Eliminação dos dados pessoais tratados com o seu
              consentimento;
            </Text>

            <Text className="text-[#202024]">
              {"\u2022"} Informação sobre compartilhamento de dados;
            </Text>

            <Text className="text-[#202024]">
              {"\u2022"} Revogação do consentimento.
            </Text>
          </View>

          <Text className="mt-2 text-sm font-medium text-[#202024]">
            Para exercer esses direitos ou obter mais informações, entre em
            contato conosco pelo e-mail{" "}
            <Text
              className="text-blue-500 underline"
              onPress={() => {
                Linking.openURL("mailto:comercial@globaldyne.com.br");
              }}
            >
              comercial@globaldyne.com.br
            </Text>
            .
          </Text>

          <Text className="mt-2 text-lg font-medium text-[#202024]">
            6. Alterações nesta Política de Privacidade
          </Text>

          <Text className="mt-2 text-base font-medium text-[#202024]">
            6.1. Atualizações: Reservamo-nos o direito de atualizar esta
            Política de Privacidade periodicamente, em conformidade com a LGPD e
            outras regulamentações. A data da última atualização será sempre
            indicada no início desta política. Recomendamos que você reveja
            periodicamente esta Política de Privacidade para se manter informado
            sobre como protegemos suas informações pessoais.
          </Text>
        </ScrollView>
      </View>
    </Pressable>
  </Modal>
);
