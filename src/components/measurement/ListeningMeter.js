import React, { useEffect, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";

import { fade, scale, scaleY } from "../../constants/theme";
import { sharedStyles } from "../../styles/sharedStyles";
import { styles } from "./ListeningMeter.styles";

const waveBars = [18, 26, 52, 20, 16, 20, 52, 26, 18];
const idleColor = "#CFCFCF";

export function ListeningMeter({ top, color, isActive, permissionDenied, statusText, onToggle }) {
  const animations = useRef(waveBars.map(() => new Animated.Value(1))).current;

  useEffect(() => {
    animations.forEach((animation) => {
      animation.stopAnimation();
      animation.setValue(1);
    });

    if (!isActive) {
      return undefined;
    }

    const loops = animations.map((animation, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 55),
          Animated.timing(animation, {
            toValue: index % 2 === 0 ? 0.55 : 1.35,
            duration: 260,
            useNativeDriver: true
          }),
          Animated.timing(animation, {
            toValue: index % 2 === 0 ? 1.28 : 0.65,
            duration: 260,
            useNativeDriver: true
          }),
          Animated.timing(animation, {
            toValue: 1,
            duration: 220,
            useNativeDriver: true
          })
        ])
      )
    );

    loops.forEach((loop) => loop.start());

    return () => {
      loops.forEach((loop) => loop.stop());
    };
  }, [animations, isActive]);

  const meterColor = isActive ? color : idleColor;
  const textColor = isActive ? fade(color) : "#A7A7A7";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      onPress={onToggle}
      style={[
        styles.listening,
        top == null ? sharedStyles.flowFullWidth : [sharedStyles.floatingFullWidth, { top: scaleY(top) }]
      ]}
    >
      <View style={styles.waveRow}>
        {waveBars.map((height, index) => (
          <Animated.View
            key={`${height}-${index}`}
            style={[
              styles.waveBar,
              {
                backgroundColor: meterColor,
                height: height * scale,
                width: getBarWidth(index) * scale,
                transform: [{ scaleY: animations[index] }]
              }
            ]}
          />
        ))}
      </View>
      <Text style={[styles.listeningText, { color: textColor }]}>
        {permissionDenied ? "마이크 권한이 필요해요" : statusText || "지금 듣고 있어요"}
      </Text>
    </Pressable>
  );
}

function getBarWidth(index) {
  if (index === 3 || index === 5) {
    return 4;
  }
  if (index === 0 || index === 8) {
    return 5;
  }
  return 6;
}
