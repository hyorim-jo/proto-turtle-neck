import { StyleSheet } from "react-native";
import { colors, scale } from "../../constants/theme";

export const styles = StyleSheet.create({
  promptPager: {
    minHeight: 22 * scale,
    overflow: "hidden"
  },
  promptPage: {
    minHeight: 22 * scale,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16 * scale
  },
  promptChip: {
    height: 22 * scale,
    borderRadius: 20 * scale,
    paddingHorizontal: 8 * scale,
    paddingVertical: 2 * scale,
    backgroundColor: colors.chip,
    justifyContent: "center",
    maxWidth: 128 * scale
  },
  promptText: {
    fontSize: 12 * scale,
    lineHeight: 18 * scale,
    fontWeight: "500",
    color: colors.chipText,
    textAlign: "center"
  },
  edgeFade: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 34 * scale,
    height: 22 * scale,
    zIndex: 2
  },
  edgeFadeLeft: {
    left: 0
  },
  edgeFadeRight: {
    right: 0
  }
});
