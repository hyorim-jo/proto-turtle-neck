import React from "react";
import { Text, View } from "react-native";

import { colors } from "../../constants/theme";
import { styles } from "./ConnectionStatus.styles";

const labels = {
  connected: "연결됨",
  connecting: "연결 중...",
  disconnected: "연결 끊김",
  disabled: "WebSocket URL 없음",
  error: "연결 오류",
  idle: "대기 중"
};

export function ConnectionStatus({ status }) {
  const dotColor =
    status === "connected"
      ? colors.green
      : status === "disconnected" || status === "error"
        ? colors.danger
        : "#BBBBBB";

  return (
    <View style={styles.wsRow}>
      <View style={[styles.wsDot, { backgroundColor: dotColor }]} />
      <Text style={styles.wsLabel}>{labels[status] ?? labels.idle}</Text>
    </View>
  );
}
