import { StyleSheet } from "react-native";
import { scale } from "../../constants/theme";

export const styles = StyleSheet.create({
  wsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8 * scale,
    marginTop: 12 * scale,
    marginBottom: 16 * scale
  },
  wsDot: {
    width: 10 * scale,
    height: 10 * scale,
    borderRadius: 5 * scale
  },
  wsLabel: {
    fontSize: 13 * scale,
    color: "#6B7280"
  }
});
