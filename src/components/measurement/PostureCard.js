import React from "react";
import { Text, View } from "react-native";

import { colors, scaleY } from "../../constants/theme";
import { sharedStyles } from "../../styles/sharedStyles";
import { styles } from "./PostureCard.styles";

export function PostureCard({ top, currentMinutes = 0, averageMinutes = 0 }) {
  const isBelowAverage = averageMinutes > 0 && currentMinutes < averageMinutes;
  const accentColor = isBelowAverage ? colors.danger : colors.green;
  const cardBackground = isBelowAverage ? colors.dangerSoft : "#F1FBF5";
  const shadowColor = isBelowAverage ? "#FFC9C5" : "#BFE8CF";
  const fillRatio =
    averageMinutes > 0 ? Math.max(0.02, Math.min(1, currentMinutes / averageMinutes / 2)) : 0.72;

  return (
    <View
      style={[
        styles.wrap,
        top == null ? sharedStyles.flowFullWidth : [sharedStyles.floatingFullWidth, { top: scaleY(top) }]
      ]}
    >
      <View style={[styles.card, { backgroundColor: cardBackground, shadowColor }]}>
        <View style={styles.topRow}>
          <Text adjustsFontSizeToFit numberOfLines={1} style={styles.title}>
            현재 바른 자세 유지 시간
          </Text>
          <View style={styles.minuteRow}>
            <Text style={[styles.minuteNumber, { color: accentColor }]}>
              {padMinutes(currentMinutes)}
            </Text>
            <Text style={styles.minuteUnit}>분</Text>
          </View>
        </View>

        <View style={styles.progressBlock}>
          <View style={styles.track}>
            <View
              style={[
                styles.fill,
                {
                  width: `${fillRatio * 100}%`,
                  backgroundColor: accentColor
                }
              ]}
            />
            <View
              style={[
                styles.averageTick,
                { backgroundColor: isBelowAverage ? colors.danger : "#16834B" }
              ]}
            />
            <View
              style={[
                styles.handle,
                {
                  left: `${Math.max(0, Math.min(96, fillRatio * 100 - 3))}%`,
                  backgroundColor: accentColor,
                  shadowColor: accentColor
                }
              ]}
            >
              <View style={styles.handleCore} />
            </View>
          </View>

          <View style={styles.averageRow}>
            <Text style={styles.averageLabel}>평균</Text>
            <Text style={[styles.averageValue, { color: colors.black }]}>
              {padMinutes(averageMinutes)}
            </Text>
            <Text style={[styles.averageValue, { color: colors.black }]}>분</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function padMinutes(value) {
  return String(value).padStart(2, "0");
}
