import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 48,
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  text: {
    color: "#2C5484",
    textAlign: "left",
  },
  title: {
    fontWeight: "500",
    textAlign: "center",
    fontSize: 16,
  },
  box: {
    backgroundColor: "#000",
    width: 240,
    height: 240,
  },
  endButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    elevation: 3,
    backgroundColor: "#2C5484",
    shadowColor: "black",
    shadowOffset: {
      height: 3,
      width: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
   cancelButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    elevation: 3,
    backgroundColor: "#717171",
    shadowColor: "black",
    shadowOffset: {
      height: 3,
      width: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  endButtonText: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "#fff",
  },
});
