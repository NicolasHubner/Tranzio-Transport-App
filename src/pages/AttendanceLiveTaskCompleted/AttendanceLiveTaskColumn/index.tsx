import React from "react";
import { View } from "react-native";
import CardAttendanceLiveTaskItem from "~/components/CardAttendanceLiveTaskItem";
interface AttendanceLiveTaskColumn {
  data: Array<Tasks>
}
export type Tasks = {
  title: string,
}
const AttendanceLiveTaskColumn: React.FC<AttendanceLiveTaskColumn> = ({ data }) => {
  return (
    <View className="flex-col px-5">
      {data.map((intem, index) =>
        < CardAttendanceLiveTaskItem key={index} title={intem.title} />
      )}
    </View>
  );
};

export default AttendanceLiveTaskColumn;