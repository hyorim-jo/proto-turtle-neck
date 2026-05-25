import { StyleSheet } from "react-native";

import { colors, device, scale } from "../constants/theme";

export const sharedStyles = StyleSheet.create({
  appScreen: {
    width: device.width,
    height: device.height
  },
  centeredScreen: {
    width: device.width,
    height: device.height,
    alignItems: "center",
    justifyContent: "center"
  },
  iconButton: {
    width: 40 * scale,
    height: 40 * scale,
    alignItems: "center",
    justifyContent: "center"
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.985 }]
  },
  floatingFullWidth: {
    position: "absolute",
    left: 0,
    width: device.width
  },
  flowFullWidth: {
    position: "relative",
    left: undefined,
    width: "100%",
    paddingHorizontal: 0
  },
  surfaceCard: {
    width: "100%",
    backgroundColor: colors.card
  }
});
