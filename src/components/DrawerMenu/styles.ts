import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99999,
    position: "absolute",
    backgroundColor: "transparent",
  },
  container: {
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 99999,
    position: "absolute",
    backgroundColor: "transparent",
    paddingHorizontal: 24,
    paddingVertical: 80,
  },
  logoutButton: {
    flexDirection: "row",
    width: "100%",
    paddingVertical: 8,
    marginTop: 24,
  },
  logoutButtonText: {
    color: "#FF0000",
    fontSize: 16,
    fontWeight: "300",
    marginLeft: 10,
  },
  userName: {
    fontWeight: "700",
    fontSize: 16,
    color: "#034881",
    marginTop: 24,
  },
  userRole: {
    fontWeight: "400",
    fontSize: 14,
    color: "#034881",
    marginTop: 6,
  },
  linkWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  linkText: {
    marginLeft: 16,
    fontSize: 16,
    fontWeight: "500",
    color: "#034881",
  },
  linkIconWrapper: {
    backgroundColor: "#034881",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 8,
  },
});
