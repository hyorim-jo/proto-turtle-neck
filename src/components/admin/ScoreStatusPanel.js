import React from "react";
import { Pressable, Text, View } from "react-native";

import { sharedStyles } from "../../styles/sharedStyles";
import { styles } from "./ScoreStatusPanel.styles";

const quickScores = [0, 30, 50, 65, 80, 85, 100];

export function ScoreStatusPanel({ score, status, onSelectScore }) {
  return (
    <>
      <View style={styles.scoreRow}>
        <View>
          <Text style={styles.scoreCaption}>현재 점수</Text>
          <Text style={[styles.scoreValue, { color: status.color }]}>{score}</Text>
        </View>
        <View style={[styles.statusBadge, { borderColor: status.color }]}>
          <View style={[styles.statusDot, { backgroundColor: status.color }]} />
          <Text style={[styles.statusLabel, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>

      <View style={styles.quickScores}>
        {quickScores.map((value) => (
          <Pressable
            key={value}
            onPress={() => onSelectScore(value)}
            style={({ pressed }) => [
              styles.scoreChip,
              score === value && { borderColor: status.color },
              pressed && sharedStyles.pressed
            ]}
            accessibilityRole="button"
          >
            <Text style={styles.scoreChipText}>{value}</Text>
          </Pressable>
        ))}
      </View>
    </>
  );
}
