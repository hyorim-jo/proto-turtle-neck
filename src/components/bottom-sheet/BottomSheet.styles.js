import { StyleSheet } from "react-native";
import { colors, scale } from "../../constants/theme";

export const styles = StyleSheet.create({
  bottomSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 20 * scale,
    borderTopRightRadius: 20 * scale,
    backgroundColor: colors.sheet,
    overflow: "hidden"
  },
  handleArea: {
    height: 32 * scale,
    alignItems: "center"
  },
  handle: {
    marginTop: 12 * scale,
    width: 90 * scale,
    height: 6 * scale,
    borderRadius: 999 * scale,
    backgroundColor: colors.sheetHandle
  },
  content: {
    paddingHorizontal: 20 * scale,
    gap: 28 * scale
  }
});
