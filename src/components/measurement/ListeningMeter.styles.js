import { StyleSheet } from "react-native";
import { colors, scale } from "../../constants/theme";

export const styles = StyleSheet.create({
  listening: {
    height: 82 * scale,
    alignItems: "center"
  },
  waveRow: {
    width: "100%",
    height: 60 * scale,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4 * scale
  },
  waveBar: {
    borderRadius: 50 * scale
  },
  listeningText: {
    width: "100%",
    fontSize: 12 * scale,
    lineHeight: 18 * scale,
    textAlign: "center",
    fontWeight: "500",
    color: colors.green
  }
});
