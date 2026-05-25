import React from "react";
import { Pressable, Text, View } from "react-native";

import { sharedStyles } from "../../styles/sharedStyles";
import { styles } from "./ScoreStateButtons.styles";

export function ScoreStateButtons({ buttons, selectedStatus, onSelectScore }) {
  return (
    <View style={styles.buttonList}>
      {buttons.map((item) => (
        <Pressable
          key={item.id}
          onPress={() => onSelectScore(item.score)}
          style={({ pressed }) => [
            styles.stateButton,
            { backgroundColor: item.color },
            selectedStatus === item.id && styles.selectedButton,
            pressed && sharedStyles.pressed
          ]}
          accessibilityRole="button"
        >
          <Text style={styles.stateButtonText}>{item.id}</Text>
        </Pressable>
      ))}
    </View>
  );
}
