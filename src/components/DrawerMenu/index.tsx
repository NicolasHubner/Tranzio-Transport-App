import { useNavigation } from "@react-navigation/native";
import { Fragment, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  ImageSourcePropType,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useUpdateEffect } from "~/hooks/useUpdateEffect";
import { useDrawerMenuContext } from "../../contexts/DrawerMenuContext";
import { useAuth } from "../../hooks/useAuth";
import userIcon from "../../images/bytesize_user.png";
import logoutIcon from "../../images/logout.png";
import Avatar from "../Avatar";
import { styles } from "./styles";

interface Link {
  label: string;
  image: ImageSourcePropType;
}

const links: Link[] = [
  {
    label: "Meu Perfil",
    image: userIcon,
  },
];

const DRAWER_WIDTH = 230;

interface DrawerMenuProps {}

export const DrawerMenu: React.FC<DrawerMenuProps> = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const { isOpen, close } = useDrawerMenuContext();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(isOpen);
  const xAnimationRef = useRef(new Animated.Value(-DRAWER_WIDTH));

  useUpdateEffect(() => {
    let x = -DRAWER_WIDTH;
    let callback: Animated.EndCallback | undefined = undefined;

    if (isOpen) {
      x = 0;
      setIsDrawerOpen(true);
    } else {
      callback = () => {
        setIsDrawerOpen(false);
      };
    }

    Animated.spring(xAnimationRef.current, {
      toValue: x,
      useNativeDriver: true,
    }).start(callback);
  }, [isOpen]);

  async function handleLogout() {
    setIsLoggingOut(true);
    await logout();
    close();
  }

  return (
    <Modal transparent visible={isOpen || isDrawerOpen} statusBarTranslucent>
      <Pressable onPress={close} style={styles.overlay} />

      <Animated.View
        style={[
          styles.container,
          {
            width: DRAWER_WIDTH,
            transform: [{ translateX: xAnimationRef.current }],
          },
        ]}
      >
        {user ? (
          <Fragment>
            <Avatar size={50} user={user} />
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userRole}>{user.role?.name}</Text>
            <Text style={styles.userRole}>
              {"Version: " + process.env.APP_VERSION}
            </Text>
          </Fragment>
        ) : null}

        <ScrollView contentContainerStyle={{ flex: 1, marginTop: 50 }}>
          {links.map(({ image, label }) => (
            <TouchableOpacity
              key={label}
              activeOpacity={0.5}
              style={styles.linkWrapper}
              onPress={() => {
                switch (label) {
                  case "Meu Perfil":
                    navigation.navigate("Home");
                    break;
                  case "Atividades":
                    navigation.navigate("AttendanceLive");
                    break;
                }
              }}
            >
              <View style={styles.linkIconWrapper}>
                <Image source={image} />
              </View>

              <Text style={styles.linkText}>{label}</Text>
            </TouchableOpacity>
          ))}

          <View style={{ marginTop: "auto" }}>
            <TouchableOpacity
              activeOpacity={0.5}
              disabled={isLoggingOut}
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              {isLoggingOut ? (
                <ActivityIndicator size={24} color="#FF0000" />
              ) : (
                <Image source={logoutIcon} />
              )}

              <Text style={styles.logoutButtonText}>Sair</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};
