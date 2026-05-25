import { StyleSheet } from "react-native";
import { colors, scale } from "../../constants/theme";

export const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: 96 * scale,
    borderRadius: 20 * scale,
    paddingHorizontal: 20 * scale,
    paddingVertical: 16 * scale,
    gap: 12 * scale,
    backgroundColor: colors.card,
    justifyContent: "center"
  },
  title: {
    fontSize: 20 * scale,
    lineHeight: 22 * scale,
    fontWeight: "500",
    color: colors.black
  }
});
