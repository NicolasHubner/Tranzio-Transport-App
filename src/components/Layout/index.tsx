import { Fragment, ReactNode, useRef } from "react";
import {
  Animated,
  Image,
  StatusBarStyle,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Logo from "~/assets/logo.svg";
import { useInternetConnectionContext } from "~/contexts/InternetConnectionContext";
import { useUpdateEffect } from "~/hooks/useUpdateEffect";
import { useDrawerMenuContext } from "../../contexts/DrawerMenuContext";
import { useAuth } from "../../hooks/useAuth";
import { backIcon, menuIcon } from "../../images";
import Avatar from "../Avatar";
import { DrawerMenu } from "../DrawerMenu";
import { NoInternetIcon } from "./NoInternetIcon";
import { styles } from "./style";

const HeaderMiddle: React.FC<{ children: ReactNode }> = ({ children }) => (
  <View className="items-center space-y-1">
    {children}
    <Text className="text-xs font-medium text-regal-blue">
      v{process.env.APP_VERSION}
    </Text>
  </View>
);

interface LayoutProps {
  back?: () => void;
  children: ReactNode;
  headerMiddleComponent?: ReactNode;
  statusBarStyle?: StatusBarStyle | null;
}

const Layout: React.FC<LayoutProps> = ({
  back,
  children,
  headerMiddleComponent = <Logo />,
}) => {
  const { user } = useAuth();
  const { open, isOpen } = useDrawerMenuContext();
  const xAnimationRef = useRef(new Animated.Value(0));
  const { isConnected } = useInternetConnectionContext();
  const scaleAnimationRef = useRef(new Animated.Value(1));

  useUpdateEffect(() => {
    let x = 0;
    let scale = 1;

    if (isOpen) {
      x = 200;
      scale = 0.82;
    }

    Animated.spring(xAnimationRef.current, {
      toValue: x,
      useNativeDriver: true,
    }).start();

    Animated.spring(scaleAnimationRef.current, {
      toValue: scale,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  return (
    <Fragment>
      <DrawerMenu />

      <Animated.View
        style={[
          {
            flex: 1,
            transform: [
              { translateX: xAnimationRef.current },
              { scale: scaleAnimationRef.current },
            ],
          },
          isOpen
            ? {
                backgroundColor: "#F2F9FF",
                borderRadius: 24,
              }
            : undefined,
        ]}
      >
        <View style={styles.container}>
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={back ?? open}
              style={{
                padding: 16,
                borderRadius: 9999,
              }}
            >
              <Image
                source={back ? backIcon : menuIcon}
                style={back ? styles.icon : { width: 14, height: 14 }}
              />
            </TouchableOpacity>

            {!isConnected && <NoInternetIcon />}
          </View>

          <HeaderMiddle>{headerMiddleComponent}</HeaderMiddle>
          {user ? <Avatar size={50} user={user} /> : null}
        </View>

        {children}
      </Animated.View>
    </Fragment>
  );
};

export default Layout;
