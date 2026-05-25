import { StyleSheet } from "react-native";
import { scale } from "../../constants/theme";

export const styles = StyleSheet.create({
  backBar: {
    position: "absolute",
    top: 22 * scale,
    left: 16 * scale,
    width: 40 * scale,
    height: 40 * scale,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3
  }
});
