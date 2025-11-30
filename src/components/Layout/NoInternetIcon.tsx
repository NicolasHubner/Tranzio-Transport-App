import { useEffect } from "react";
import { Animated, useAnimatedValue } from "react-native";
import WifiSlashIcon from "~/assets/icons/wifi-slash.svg";

interface NoInternetIconProps {}

export const NoInternetIcon: React.FC<NoInternetIconProps> = () => {
  const opacityAnimation = useAnimatedValue(1);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnimation, {
          toValue: 0.25,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [opacityAnimation]);

  return (
    <Animated.View className="mr-2" style={{ opacity: opacityAnimation }}>
      <WifiSlashIcon width={24} height={24} />
    </Animated.View>
  );
};
