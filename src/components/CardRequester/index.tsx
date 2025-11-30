import { View, Text } from "react-native";

interface CardProps {
    title: string;
}

export const CardRequester: React.FC<CardProps> = ({ title }) => {
    return (
        <View className='bg-regal-blue justify-center rounded-md h-32 mb-8'>
            <Text className='text-white text-center text-14'>{title}</Text>
        </View>
    );
};