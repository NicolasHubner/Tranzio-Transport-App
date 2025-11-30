import React, { FC } from "react";
import {
  Image,
  Text,
  TouchableHighlight,
  TouchableHighlightProps,
  View,
} from "react-native";
import { startIcon } from "../../images";
import { styles } from "./styles";

interface StartButtonProps extends TouchableHighlightProps {
  title: string;
}

export const StartButton: FC<StartButtonProps> = ({ title, ...props }) => {
  return (
    <TouchableHighlight
      style={styles.button}
      underlayColor="#fafafa"
      {...props}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.text}>{title}</Text>

        <Image
          style={{ marginLeft: 8, width: 16, height: 16 }}
          source={startIcon}
        />
      </View>
    </TouchableHighlight>
  );
};
