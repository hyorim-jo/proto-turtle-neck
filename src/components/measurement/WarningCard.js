import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, scale, scaleY } from "../../constants/theme";
import { sharedStyles } from "../../styles/sharedStyles";
import { styles } from "./WarningCard.styles";

export function WarningCard({ top, variant, warningSeconds }) {
  return (
    <View style={[styles.wrap, topStyle(top)]}>
      <View style={styles.card}>
        <View style={styles.titleRow}>
          <Ionicons name="warning-outline" size={24 * scale} color={colors.danger} />
          <Text adjustsFontSizeToFit numberOfLines={1} style={styles.title}>
            {variant.warningTitle}
          </Text>
        </View>
        <Text style={styles.time}>{formatWarningTime(warningSeconds, variant.warningTime)}</Text>
        <Text adjustsFontSizeToFit numberOfLines={1} style={styles.body}>
          {variant.warningBody}
        </Text>
      </View>
    </View>
  );
}

function formatWarningTime(seconds, fallback) {
  if (typeof seconds !== "number") return fallback;
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}분 ${String(remainingSeconds).padStart(2, "0")}초`;
}

function topStyle(top) {
  if (top == null) {
    return sharedStyles.flowFullWidth;
  }
  return [sharedStyles.floatingFullWidth, { top: scaleY(top) }];
}
