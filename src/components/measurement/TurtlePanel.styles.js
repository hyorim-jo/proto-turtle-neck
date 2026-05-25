import { StyleSheet } from "react-native";
import { scale } from "../../constants/theme";

export const styles = StyleSheet.create({
  panel: {
    height: 194 * scale,
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible"
  },
  videoBox: {
    width: 302 * scale,
    height: 194 * scale,
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible"
  },
  videoLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center"
  },
  video: {
    width: 350 * scale,
    height: 224 * scale
  }
});
