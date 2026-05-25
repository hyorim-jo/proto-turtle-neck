import React from "react";
import { Text, View } from "react-native";

import { colors } from "../../constants/theme";
import { weeklyReportDays } from "../../data/bottomSheetOptions";
import { styles } from "./WeeklyReportCard.styles";

export function WeeklyReportCard() {
  return (
    <View style={styles.reportCard}>
      <Text style={styles.title}>Report</Text>
      <Text style={styles.reportCopy}>
        이번주 바른 자세 유지 비율이 저번주보다 <Text style={styles.reportStrong}>15%</Text>{" "}
        상승했어요
      </Text>
      <View style={styles.days}>
        {weeklyReportDays.map(({ day, backgroundColor, textColor, isToday }) => (
          <View
            key={day}
            style={[
              styles.day,
              {
                backgroundColor,
                borderColor: isToday ? colors.blueBorder : "transparent"
              }
            ]}
          >
            <Text style={[styles.dayText, { color: textColor }]}>{day}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
