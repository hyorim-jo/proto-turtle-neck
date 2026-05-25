import { StyleSheet } from "react-native";
import { colors, device, scale, sheetPeekHeight } from "../../constants/theme";

export const styles = StyleSheet.create({
  screen: {
    width: device.width,
    height: device.height,
    backgroundColor: colors.appBackground,
    position: "relative",
    overflow: "hidden"
  },
  statusSpacer: {
    height: 42 * scale
  },
  content: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 24 * scale,
    paddingBottom: sheetPeekHeight,
    gap: 24 * scale
  },
  topBlock: {
    width: "100%",
    gap: 20 * scale
  }
});
