import React from "react";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, scale } from "../../constants/theme";
import { styles } from "./BackBar.styles";

export function BackBar({ onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.backBar}
      accessibilityRole="button"
      accessibilityLabel="뒤로가기"
      hitSlop={8}
    >
      <Ionicons name="chevron-back" size={25 * scale} color={colors.black} />
    </Pressable>
  );
}
