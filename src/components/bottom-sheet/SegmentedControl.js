import React from "react";
import { Animated, Pressable, Text, View } from "react-native";

import { device, scale } from "../../constants/theme";
import { styles } from "./SegmentedControl.styles";

const segmentWidth = device.width - 80 * scale;

export function SegmentedControl({ options, selectedValue, thumbX, onSelect }) {
  const thumbWidth = segmentWidth / options.length;

  return (
    <View style={styles.segment}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.segmentThumb,
          {
            width: thumbWidth,
            transform: [{ translateX: thumbX }]
          }
        ]}
      />
      {options.map((label) => {
        const isSelected = selectedValue === label;

        return (
          <Pressable
            key={label}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onSelect(label)}
            style={styles.segmentItem}
          >
            <Text style={[styles.segmentText, isSelected && styles.segmentTextActive]}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function getSegmentThumbWidth(optionCount) {
  return segmentWidth / optionCount;
}
