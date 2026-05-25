import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { scale, scaleY } from "../../constants/theme";
import { sharedStyles } from "../../styles/sharedStyles";
import { styles } from "./ActionButtons.styles";

export function ActionButtons({ top, isPaused = false, onTogglePause }) {
  const [isZeroAdjusted, setIsZeroAdjusted] = useState(false);

  const handleZeroAdjust = () => {
    setIsZeroAdjusted(true);
  };

  useEffect(() => {
    if (!isZeroAdjusted) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setIsZeroAdjusted(false);
    }, 900);

    return () => clearTimeout(timer);
  }, [isZeroAdjusted]);

  return (
    <View
      style={[
        styles.controls,
        top == null ? sharedStyles.flowFullWidth : [sharedStyles.floatingFullWidth, { top: scaleY(top) }]
      ]}
    >
      <RoundAction
        icon={isZeroAdjusted ? "checkmark" : "refresh"}
        label={isZeroAdjusted ? "조절 완료" : "영점 조절"}
        onPress={handleZeroAdjust}
      />
      <RoundAction
        icon={isPaused ? "play-circle-outline" : "pause-circle-outline"}
        label={isPaused ? "시작하기" : "일시정지"}
        onPress={onTogglePause}
      />
    </View>
  );
}

function RoundAction({ icon, label, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.touchTarget, pressed && styles.pressed]}
    >
      <View style={styles.roundAction}>
        <Ionicons name={icon} size={20 * scale} color="#2F2F2F" />
        <Text
          adjustsFontSizeToFit
          minimumFontScale={0.82}
          numberOfLines={1}
          style={styles.label}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
