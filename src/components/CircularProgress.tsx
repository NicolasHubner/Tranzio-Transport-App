import { View } from "react-native";
import Animated, {
  useAnimatedProps,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { Circle, Text as SVGText, Svg } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularProgressProps {
  size: number;
  strokeWidth: number;
  progress: number;
  backgroundColor: string;
  ringColor: string;
  text?: string;
  textColor?: string;
  animationDelay?: number;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  size,
  strokeWidth,
  progress,
  backgroundColor,
  ringColor,
  text,
  textColor,
  animationDelay = 0,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const svgProgress = 100 - progress;
  const ringProps = useAnimatedProps((): React.ComponentPropsWithoutRef<
    typeof AnimatedCircle
  > => {
    return {
      strokeDashoffset: withDelay(
        animationDelay,
        withTiming(radius * Math.PI * 2 * (svgProgress / 100), {
          duration: 300,
        }),
      ),
    };
  }, [svgProgress, radius]);

  return (
    <View>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          stroke={backgroundColor}
        />

        <AnimatedCircle
          animatedProps={ringProps}
          stroke={ringColor}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        />

        <SVGText
          fontSize={12}
          x={size / 2}
          y={size / 2 + 5}
          textAnchor="middle"
          fill={textColor ? textColor : "#333333"}
        >
          {text}
        </SVGText>
      </Svg>
    </View>
  );
};
