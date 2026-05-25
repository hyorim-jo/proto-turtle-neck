import React from "react";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, scale } from "../../constants/theme";
import { styles } from "./MeasurementHeader.styles";

export function MeasurementHeader({ onBack }) {
  return (
    <Pressable
      onPress={onBack}
      accessibilityRole="button"
      accessibilityLabel="뒤로가기"
      hitSlop={8}
      style={styles.backButton}
    >
      <Ionicons name="chevron-back" size={25 * scale} color={colors.black} />
    </Pressable>
  );
}
