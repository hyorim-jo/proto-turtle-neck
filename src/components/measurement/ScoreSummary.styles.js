import { StyleSheet } from "react-native";
import { colors, font, scale } from "../../constants/theme";

export const styles = StyleSheet.create({
  textBlock: {
    width: "100%",
    gap: 12 * scale
  },
  title: {
    width: "100%",
    height: 34 * scale,
    fontFamily: font.semiBold,
    fontSize: 28 * scale,
    lineHeight: 34 * scale,
    fontWeight: "700",
    color: colors.black
  },
  scoreRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end"
  },
  score: {
    minWidth: 65 * scale,
    height: 42 * scale,
    fontFamily: font.bold,
    fontSize: 52 * scale,
    lineHeight: 52 * scale,
    fontWeight: "700",
    textAlign: "left"
  },
  scoreUnit: {
    width: 21 * scale,
    height: 24 * scale,
    fontFamily: font.regular,
    fontSize: 24 * scale,
    lineHeight: 24 * scale,
    fontWeight: "500",
    color: colors.black
  }
});
