import React from "react";
import { Pressable, Text, View } from "react-native";

import { styles } from "./InterventionModeControl.styles";

const modes = [
  { id: "voice", label: "AI 음성" },
  { id: "beep", label: "알림음만" },
  { id: "silent", label: "무음" }
];

export function InterventionModeControl({ selectedMode, onSelectMode }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>안내 방식</Text>
      <View style={styles.segmentRow}>
        {modes.map((mode) => {
          const isSelected = selectedMode === mode.id;
          return (
            <Pressable
              key={mode.id}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => onSelectMode(mode.id)}
              style={[styles.segment, isSelected && styles.selectedSegment]}
            >
              <Text style={[styles.segmentText, isSelected && styles.selectedSegmentText]}>
                {mode.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
