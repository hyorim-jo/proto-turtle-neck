import { StyleSheet } from "react-native";

import { colors, scale } from "../../constants/theme";

export const styles = StyleSheet.create({
  card: {
    marginTop: 20 * scale,
    backgroundColor: "#F7F8F4",
    borderRadius: 16 * scale,
    padding: 18 * scale,
    gap: 12 * scale
  },
  title: {
    fontSize: 13 * scale,
    fontWeight: "700",
    color: colors.black
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10 * scale
  },
  label: {
    width: 42 * scale,
    fontSize: 13 * scale,
    fontWeight: "600",
    color: "#4B5563"
  },
  input: {
    flex: 1,
    height: 40 * scale,
    borderRadius: 10 * scale,
    borderWidth: 1 * scale,
    borderColor: "#D9D9D9",
    backgroundColor: colors.white,
    paddingHorizontal: 12 * scale,
    fontSize: 16 * scale,
    fontWeight: "700",
    color: colors.black
  },
  unit: {
    width: 20 * scale,
    fontSize: 13 * scale,
    color: "#4B5563"
  }
});
