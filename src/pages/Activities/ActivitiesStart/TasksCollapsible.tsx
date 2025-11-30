import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { ActivityTimeForecast } from "~/components/ActivityTimeForecast";
import type { AttendanceLiveByIdQueryResponse } from "~/graphql/queries/attendanceLiveById";

interface TasksCollapsibleProps {
  data: AttendanceLiveByIdQueryResponse;
}

export const TasksCollapsible: React.FC<TasksCollapsibleProps> = ({ data }) => {
  const [, setIsOpen] = useState(false);

  function handleToggleOpen() {
    setIsOpen(currentIsOpen => !currentIsOpen);
  }

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={handleToggleOpen}
        className="space-y-2 rounded-lg bg-regal-blue px-7 py-2.5"
      >
        <ActivityTimeForecast
          attendanceLive={data.attendanceLive.data.attributes}
        />
      </TouchableOpacity>
    </View>
  );
};
