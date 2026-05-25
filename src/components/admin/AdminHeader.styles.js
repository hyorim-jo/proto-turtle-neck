import { StyleSheet } from "react-native";
import { colors, scale } from "../../constants/theme";

export const styles = StyleSheet.create({
  header: {
    height: 52 * scale,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  headerTitle: {
    fontSize: 17 * scale,
    fontWeight: "600",
    color: colors.black
  }
});
