import { StyleSheet } from "react-native";
import { colors, device, scale } from "../../constants/theme";

export const styles = StyleSheet.create({
  screen: {
    width: device.width,
    height: device.height,
    backgroundColor: colors.white
  },
  content: {
    paddingHorizontal: 20 * scale,
    paddingTop: 8 * scale,
    paddingBottom: 28 * scale
  },
  divider: {
    height: 1,
    backgroundColor: "#E8E8E8",
    marginVertical: 20 * scale
  }
});
