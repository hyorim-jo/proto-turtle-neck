import { StyleSheet } from "react-native";

import { colors, scale } from "../../constants/theme";

export const styles = StyleSheet.create({
  card: {
    marginTop: 14 * scale,
    padding: 16 * scale,
    borderRadius: 16 * scale,
    backgroundColor: "#F5F5F5",
    gap: 12 * scale
  },
  title: {
    fontSize: 16 * scale,
    lineHeight: 22 * scale,
    fontWeight: "700",
    color: colors.black
  },
  segmentRow: {
    flexDirection: "row",
    gap: 8 * scale
  },
  segment: {
    flex: 1,
    height: 42 * scale,
    borderRadius: 12 * scale,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "#DDDDDD"
  },
  selectedSegment: {
    backgroundColor: colors.black,
    borderColor: colors.black
  },
  segmentText: {
    fontSize: 13 * scale,
    lineHeight: 17 * scale,
    fontWeight: "700",
    color: colors.black
  },
  selectedSegmentText: {
    color: colors.white
  }
});
