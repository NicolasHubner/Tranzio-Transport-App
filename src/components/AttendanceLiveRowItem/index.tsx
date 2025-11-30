import { Text, View } from "react-native";
import AttendanceLiveCard from "../AttendanceLiveCard";

interface AttendanceLiveRowItemProps {
  time: string
  flightCode: string
  timeLanding: string
  location: string
  aircraft: string
  buttonDisable: boolean
}

const AttendanceLiveRowItem: React.FC<AttendanceLiveRowItemProps> = ({
  time,
  flightCode,
  timeLanding,
  location,
  aircraft,
  buttonDisable
}) => {

  return (
    <View className='flex-row items-center justify-around pb-4'>
      <Text>{time}</Text>
      <AttendanceLiveCard
        flightCode={flightCode}
        timeLanding={timeLanding}
        location={location}
        aircraft={aircraft}
        buttonDisable={buttonDisable} />
    </View >
  );
}

export default AttendanceLiveRowItem;