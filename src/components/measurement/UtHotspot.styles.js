import { StyleSheet } from "react-native";
import { scale } from "../../constants/theme";

export const styles = StyleSheet.create({
  hotspot: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 44 * scale,
    height: 44 * scale,
    zIndex: 20
  }
});
