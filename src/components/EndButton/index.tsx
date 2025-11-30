import React, { FC } from "react";
import {
  Text,
  TouchableHighlight,
  TouchableHighlightProps,
} from "react-native";
import { styles } from "./styles";

interface EndButtonProps extends TouchableHighlightProps {
  title: string;
}

export const EndButton: FC<EndButtonProps> = ({ title, ...props }) => {
  return (
    <TouchableHighlight
      style={styles.button}
      underlayColor="#fafafa"
      {...props}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableHighlight>
  );
};
