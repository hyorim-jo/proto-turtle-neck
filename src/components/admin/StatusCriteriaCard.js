import React from "react";
import { Text, View } from "react-native";

import { styles } from "./StatusCriteriaCard.styles";

export function StatusCriteriaCard() {
  return (
    <View style={styles.infoCard}>
      <Text style={styles.infoTitle}>상태 기준</Text>
      <Text style={styles.infoText}>0 ~ 50점: bad</Text>
      <Text style={styles.infoText}>51 ~ 80점: soso</Text>
      <Text style={styles.infoText}>81 ~ 100점: good</Text>
    </View>
  );
}
