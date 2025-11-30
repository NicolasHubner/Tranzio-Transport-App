import React from 'react';
import { Text } from 'react-native';
import tw from 'tailwind-react-native-classnames';

type TruncateStringProps = {
  text: string;
  maxLength: number;
};

const TruncateString: React.FC<TruncateStringProps> = ({ text, maxLength }) => {
  if (text.length <= maxLength) {
    return <Text style={tw`text-black`}>{text}</Text>;
  }

  const truncatedText = `${text.substring(0, maxLength)}...`;
  return <Text style={{ color: 'black', fontSize: 14 }}> {truncatedText}</Text >;
};

export default TruncateString;
