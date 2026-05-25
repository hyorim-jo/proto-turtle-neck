import React from "react";
import { Text, View } from "react-native";

import { SegmentedControl } from "./SegmentedControl";
import { styles } from "./NotificationCard.styles";

export function NotificationCard({ options, selectedSound, thumbX, onSelectSound }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Notification</Text>
      <SegmentedControl
        options={options}
        selectedValue={selectedSound}
        thumbX={thumbX}
        onSelect={onSelectSound}
      />
    </View>
  );
}
