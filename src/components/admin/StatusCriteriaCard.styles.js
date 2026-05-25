import { StyleSheet } from "react-native";
import { scale } from "../../constants/theme";

export const styles = StyleSheet.create({
  infoCard: {
    marginTop: 20 * scale,
    backgroundColor: "#F7F8F4",
    borderRadius: 16 * scale,
    padding: 18 * scale,
    gap: 8 * scale
  },
  infoTitle: {
    fontSize: 13 * scale,
    fontWeight: "700",
    color: "#000000"
  },
  infoText: {
    fontSize: 12 * scale,
    color: "#4B5563"
  }
});
