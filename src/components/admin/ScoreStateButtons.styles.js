import { StyleSheet } from "react-native";
import { scale } from "../../constants/theme";

export const styles = StyleSheet.create({
  buttonList: {
    gap: 10 * scale
  },
  stateButton: {
    height: 56 * scale,
    borderRadius: 14 * scale,
    alignItems: "center",
    justifyContent: "center"
  },
  selectedButton: {
    borderWidth: 4 * scale,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  stateButtonText: {
    fontSize: 18 * scale,
    fontWeight: "700",
    color: "#FFFFFF"
  }
});
