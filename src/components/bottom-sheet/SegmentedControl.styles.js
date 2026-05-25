import { StyleSheet } from "react-native";
import { colors, scale } from "../../constants/theme";

export const styles = StyleSheet.create({
  segment: {
    width: "100%",
    height: 30 * scale,
    borderRadius: 20 * scale,
    backgroundColor: "#E3E3E3",
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: colors.black,
    shadowOpacity: 0.25,
    shadowRadius: 4 * scale,
    shadowOffset: { width: 0, height: 0 },
    elevation: 1
  },
  segmentThumb: {
    position: "absolute",
    left: 0,
    top: 0,
    height: 30 * scale,
    borderRadius: 20 * scale,
    backgroundColor: "#5FAF86",
    shadowColor: colors.black,
    shadowOpacity: 0.25,
    shadowRadius: 2 * scale,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2
  },
  segmentItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20 * scale,
    zIndex: 1
  },
  segmentText: {
    fontSize: 12 * scale,
    lineHeight: 18 * scale,
    fontWeight: "500",
    color: colors.black
  },
  segmentTextActive: {
    color: colors.white
  }
});
