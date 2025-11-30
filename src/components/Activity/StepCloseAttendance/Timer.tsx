import dayjs from "dayjs";
import { Text } from "react-native";
import { useCurrentTime } from "../../../hooks/useCurrentTime";
import { styles } from "../../../pages/StepCloseAttendance/style";
import { formatSeconds } from "../../../utils/formatSeconds";

interface TimerProps {
  sta: string;
  isInternational?: boolean | null;
  std?: string;
  etd?: string;
  eta?: string;
  actionType?: string;
}

export const Timer: React.FC<TimerProps> = ({
  sta,
  isInternational,
  eta,
  etd,
  std,
  actionType,
}) => {
  const { now } = useCurrentTime();

  const timeToUse = actionType === "Arrival" ? eta ?? sta : etd ?? std;

  const [hours, minutes, seconds] = timeToUse!.split(":").map(Number);

  const targetDate = dayjs()
    .set("hours", hours)
    .set("minutes", minutes)
    .set("seconds", seconds);

  const diff = dayjs(targetDate).diff(now, "seconds");

  return (
    <Text
      style={{
        ...styles.text,
        ...styles.title,
        fontSize: 48,
        marginBottom: 16,
      }}
    >
      {diff < 0 && "Atrasado\n"}
      {formatSeconds(Math.abs(diff))}
    </Text>
  );
};
