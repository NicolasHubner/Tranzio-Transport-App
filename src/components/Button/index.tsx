import {
  ActivityIndicator,
  Text,
  TouchableHighlight,
  TouchableHighlightProps,
} from "react-native";
import { styles } from "./styles";

interface ButtonProps extends TouchableHighlightProps {
  title?: string;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title = "Entrar",
  isLoading,
  disabled,
}) => {
  return (
    <TouchableHighlight
      onPress={onPress}
      style={styles.button}
      underlayColor="#1a4a7a"
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <ActivityIndicator size={20} color="white" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableHighlight>
  );
};
