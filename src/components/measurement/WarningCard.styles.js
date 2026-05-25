import { StyleSheet } from "react-native";
import { colors, scale } from "../../constants/theme";

export const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 24 * scale
  },
  card: {
    width: "100%",
    height: 95 * scale,
    borderRadius: 12 * scale,
    paddingHorizontal: 16 * scale,
    paddingVertical: 13 * scale,
    backgroundColor: colors.warningBg,
    shadowColor: "#FFC9C5",
    shadowOpacity: 1,
    shadowRadius: 2 * scale,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2
  },
  titleRow: {
    height: 24 * scale,
    flexDirection: "row",
    alignItems: "center",
    gap: 8 * scale
  },
  title: {
    flex: 1,
    fontSize: 20 * scale,
    lineHeight: 24 * scale,
    fontWeight: "600",
    color: colors.black
  },
  time: {
    marginTop: 4 * scale,
    fontSize: 16 * scale,
    lineHeight: 18 * scale,
    fontWeight: "600",
    color: colors.danger
  },
  body: {
    marginTop: 4 * scale,
    fontSize: 16 * scale,
    lineHeight: 18 * scale,
    fontWeight: "400",
    color: colors.black
  }
});
