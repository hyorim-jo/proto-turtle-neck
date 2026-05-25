import { StyleSheet } from "react-native";
import { colors, scale } from "../../constants/theme";

export const styles = StyleSheet.create({
  reportCard: {
    width: "100%",
    borderRadius: 20 * scale,
    paddingHorizontal: 20 * scale,
    paddingVertical: 16 * scale,
    gap: 12 * scale,
    backgroundColor: colors.card
  },
  title: {
    fontSize: 20 * scale,
    lineHeight: 22 * scale,
    fontWeight: "500",
    color: colors.black
  },
  reportCopy: {
    fontSize: 12 * scale,
    lineHeight: 18 * scale,
    color: colors.black
  },
  reportStrong: {
    fontWeight: "700"
  },
  days: {
    width: "100%",
    height: 43 * scale,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4 * scale
  },
  day: {
    width: 36 * scale,
    height: 36 * scale,
    borderRadius: 10 * scale,
    borderWidth: 2 * scale,
    alignItems: "center",
    justifyContent: "center"
  },
  dayText: {
    fontSize: 12 * scale,
    lineHeight: 18 * scale
  }
});
