import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    color: "#2C5484",
    textAlign: "center",
    textDecorationLine: "underline",
    marginTop: 8,
  },
  title: {
    fontWeight: "500",
    textAlign: "center",
    fontSize: 18,
    textDecorationLine: "underline",
    lineHeight: 24,
  },
  box: {
    backgroundColor: "black",
    width: 240,
    height: 240,
    borderRadius: 16,
    overflow: "hidden",
  },
});
