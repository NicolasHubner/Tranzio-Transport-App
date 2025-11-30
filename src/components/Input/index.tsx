import { TextInput, TextInputProps } from "react-native";
import { styles } from "./styles";

export interface InputProps extends TextInputProps {}

export const Input: React.FC<InputProps> = props => (
  <TextInput style={styles.input} {...props} />
);
