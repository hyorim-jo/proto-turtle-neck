import { StyleSheet } from "react-native";

import { colors, scale } from "../../constants/theme";

export const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 24 * scale
  },
  card: {
    width: "100%",
    height: 95 * scale,
    borderRadius: 24 * scale,
    paddingHorizontal: 16 * scale,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFEFF1",
    shadowColor: "#D7D7DC",
    shadowOpacity: 1,
    shadowRadius: 2 * scale,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2
  },
  title: {
    fontSize: 20 * scale,
    lineHeight: 24 * scale,
    fontWeight: "700",
    color: colors.black
  }
});
