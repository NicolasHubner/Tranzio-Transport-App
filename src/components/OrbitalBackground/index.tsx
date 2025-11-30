import React from "react";
import { ImageBackground } from "react-native";
import { background } from "../../images";

interface OrbitalBackgroundProps {
  children?: React.ReactNode;
}

const OrbitalBackground: React.FC<OrbitalBackgroundProps> = ({ children }) => {
  return (
    <ImageBackground
      resizeMode="cover"
      source={background}
      style={{ height: "100%" }}
    >
      {children}
    </ImageBackground>
  );
};

export default OrbitalBackground;
