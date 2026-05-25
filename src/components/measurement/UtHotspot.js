import React from "react";
import { Pressable } from "react-native";

import { styles } from "./UtHotspot.styles";

export function UtHotspot({ onPress }) {
  const shouldEnableHotspot =
    (typeof __DEV__ !== "undefined" && __DEV__) ||
    getPublicEnv("EXPO_PUBLIC_ENABLE_UT_HOTSPOT") === "true";

  if (!shouldEnableHotspot) {
    return null;
  }

  return (
    <Pressable
      accessibilityLabel="UT state shortcut"
      accessibilityRole="button"
      onPress={onPress}
      style={styles.hotspot}
    />
  );
}
