import { StyleSheet } from "react-native";
import { colors, scale } from "../../constants/theme";

export const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#F3F3F3",
    paddingHorizontal: 20 * scale,
    paddingTop: 8 * scale,
    paddingBottom: 36 * scale
  },
  header: {
    height: 52 * scale,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end"
  },
  appTitle: {
    fontSize: 48 * scale,
    fontWeight: "800",
    color: colors.deepGreen,
    letterSpacing: 0
  },
  turtleVideo: {
    width: 270 * scale,
    height: 196 * scale,
    marginBottom: 4 * scale
  },
  heroArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12 * scale
  },
  heroSubtitle: {
    fontSize: 15 * scale,
    fontWeight: "500",
    color: colors.deepGreen,
    opacity: 0.65
  },
  permissionBox: {
    width: "100%",
    minHeight: 92 * scale,
    marginBottom: 12 * scale,
    paddingHorizontal: 14 * scale,
    paddingVertical: 12 * scale,
    borderRadius: 14 * scale,
    backgroundColor: colors.dangerSoft,
    alignItems: "center",
    gap: 8 * scale
  },
  permissionText: {
    fontSize: 13 * scale,
    fontWeight: "600",
    color: colors.danger,
    lineHeight: 18 * scale,
    textAlign: "center"
  },
  permissionButton: {
    minWidth: 128 * scale,
    height: 34 * scale,
    paddingHorizontal: 14 * scale,
    borderRadius: 17 * scale,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center"
  },
  permissionButtonPressed: {
    opacity: 0.82
  },
  permissionButtonText: {
    fontSize: 13 * scale,
    fontWeight: "700",
    color: colors.danger
  },
  startBtn: {
    width: "100%",
    height: 60 * scale,
    backgroundColor: colors.green,
    borderRadius: 20 * scale,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.green,
    shadowOpacity: 0.4,
    shadowRadius: 8 * scale,
    shadowOffset: { width: 0, height: 4 * scale },
    elevation: 6
  },
  startBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }]
  },
  startBtnDisabled: {
    opacity: 0.42
  },
  startBtnText: {
    fontSize: 18 * scale,
    fontWeight: "700",
    color: colors.white,
    letterSpacing: 0
  }
});
