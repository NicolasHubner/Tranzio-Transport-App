import React from 'react';
import { Text, View } from 'react-native';

interface AttendanceLiveTaskItemProps {
  titleTaskLive: string
  subtasksLive: Array<string>
}
const AttendanceLiveTaskItem: React.FC<AttendanceLiveTaskItemProps> = ({ titleTaskLive, subtasksLive }) => {

  return (
    <View className="px-5 py-5 rounded mt-4">
      <View className="flex-row items-center">
        <View className="w-6 h-6 bg-gray-300 rounded-full mr-2" />
        <Text className="font-bold" style={{ color: '#034881' }}>{titleTaskLive}</Text>
      </View>
      {subtasksLive.map((item, idex) =>
        < Text key={idex} className="mt-2 pl-7" style={{ color: '#034881' }}> {item}</Text>
      )
      }
    </View >
  );
};

export default AttendanceLiveTaskItem;
