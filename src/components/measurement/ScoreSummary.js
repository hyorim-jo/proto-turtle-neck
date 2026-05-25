import React from "react";
import { Text, View } from "react-native";

import { colors } from "../../constants/theme";
import { postureStatusMeta } from "../../utils/postureStatus";
import { styles } from "./ScoreSummary.styles";

export function ScoreSummary({ title, score, status, isPaused = false }) {
  const scoreColor = isPaused ? "#8E8E93" : postureStatusMeta[status]?.color ?? colors.green;
  const displayScore = isPaused ? "--" : score;

  return (
    <View style={styles.textBlock}>
      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.title}>
        {title}
      </Text>
      <View style={styles.scoreRow}>
        <Text style={[styles.score, { color: scoreColor }]}>{displayScore}</Text>
        <Text style={styles.scoreUnit}>점</Text>
      </View>
    </View>
  );
}
