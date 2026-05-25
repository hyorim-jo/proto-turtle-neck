import { StyleSheet } from "react-native";
import { colors, scale } from "../../constants/theme";

export const styles = StyleSheet.create({
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  scoreCaption: {
    fontSize: 12 * scale,
    color: "#6B7280",
    marginBottom: 2 * scale
  },
  scoreValue: {
    fontSize: 48 * scale,
    fontWeight: "800",
    lineHeight: 52 * scale
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6 * scale,
    paddingHorizontal: 12 * scale,
    paddingVertical: 6 * scale,
    borderRadius: 20 * scale,
    borderWidth: 1.5 * scale
  },
  statusDot: {
    width: 8 * scale,
    height: 8 * scale,
    borderRadius: 4 * scale
  },
  statusLabel: {
    fontSize: 13 * scale,
    fontWeight: "600"
  },
  quickScores: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8 * scale,
    marginTop: 18 * scale
  },
  scoreChip: {
    minWidth: 48 * scale,
    height: 38 * scale,
    borderRadius: 19 * scale,
    borderWidth: 1.5 * scale,
    borderColor: "#D9D9D9",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white
  },
  scoreChipText: {
    fontSize: 14 * scale,
    fontWeight: "600",
    color: colors.black
  }
});
