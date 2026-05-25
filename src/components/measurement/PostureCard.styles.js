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
    paddingVertical: 12 * scale,
    alignItems: "center",
    justifyContent: "center",
    gap: 16 * scale,
    shadowOpacity: 1,
    shadowRadius: 2 * scale,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2
  },
  topRow: {
    width: "100%",
    paddingRight: 4 * scale,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  title: {
    flex: 1,
    marginRight: 10 * scale,
    fontSize: 20 * scale,
    lineHeight: 24 * scale,
    fontWeight: "700",
    color: colors.black
  },
  minuteRow: {
    minWidth: 45 * scale,
    height: 26 * scale,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    gap: 4 * scale
  },
  minuteNumber: {
    fontSize: 24 * scale,
    lineHeight: 26 * scale,
    fontWeight: "800"
  },
  minuteUnit: {
    fontSize: 16 * scale,
    lineHeight: 18 * scale,
    fontWeight: "500",
    color: colors.black
  },
  progressBlock: {
    width: "100%",
    alignItems: "center",
    gap: 8 * scale
  },
  track: {
    width: "100%",
    height: 7 * scale,
    borderRadius: 50 * scale,
    backgroundColor: "#DDE5DF"
  },
  fill: {
    position: "absolute",
    left: 0,
    top: 0,
    height: 7 * scale,
    borderRadius: 20 * scale
  },
  averageTick: {
    position: "absolute",
    left: "50%",
    top: -4 * scale,
    width: 4 * scale,
    height: 16 * scale,
    borderRadius: 50 * scale
  },
  handle: {
    position: "absolute",
    top: -4 * scale,
    width: 16 * scale,
    height: 16 * scale,
    borderRadius: 8 * scale,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.5,
    shadowRadius: 4 * scale,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4
  },
  handleCore: {
    width: 8 * scale,
    height: 8 * scale,
    borderRadius: 4 * scale,
    backgroundColor: colors.white
  },
  averageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2 * scale
  },
  averageLabel: {
    fontSize: 12 * scale,
    lineHeight: 18 * scale,
    color: colors.black
  },
  averageValue: {
    fontSize: 12 * scale,
    lineHeight: 18 * scale,
    fontWeight: "500"
  }
});
