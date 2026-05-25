import React from "react";
import { Text, View } from "react-native";

import { scaleY } from "../../constants/theme";
import { sharedStyles } from "../../styles/sharedStyles";
import { styles } from "./PausedCard.styles";

export function PausedCard({ top }) {
  return (
    <View
      style={[
        styles.wrap,
        top == null ? sharedStyles.flowFullWidth : [sharedStyles.floatingFullWidth, { top: scaleY(top) }]
      ]}
    >
      <View style={styles.card}>
        <Text adjustsFontSizeToFit numberOfLines={1} style={styles.title}>
          측정 대기 중
        </Text>
      </View>
    </View>
  );
}
