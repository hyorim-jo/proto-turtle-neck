import { StyleSheet } from "react-native";
import { scale } from "../../constants/theme";

export const styles = StyleSheet.create({
  controls: {
    height: 64 * scale,
    paddingHorizontal: 24 * scale,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 40 * scale,
    transform: [{ translateY: -6 * scale }]
  },
  touchTarget: {
    width: 64 * scale,
    height: 64 * scale,
    borderRadius: 32 * scale
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.96 }]
  },
  roundAction: {
    width: 64 * scale,
    height: 64 * scale,
    borderRadius: 32 * scale,
    alignItems: "center",
    justifyContent: "center",
    padding: 12 * scale,
    backgroundColor: "#F9F9FB",
    borderWidth: 1 * scale,
    borderColor: "#D1D1D6",
    shadowColor: "#D1D1D6",
    shadowOpacity: 1,
    shadowRadius: 0.5 * scale,
    shadowOffset: { width: 0, height: 0 },
    elevation: 1
  },
  label: {
    marginTop: 2 * scale,
    fontSize: 10 * scale,
    lineHeight: 16 * scale,
    fontWeight: "500",
    color: "#3A3A3C",
    textAlign: "center"
  }
});
