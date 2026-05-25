import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, scale } from "../../constants/theme";
import { sharedStyles } from "../../styles/sharedStyles";
import { styles } from "./AdminHeader.styles";

export function AdminHeader({ onBack }) {
  return (
    <View style={styles.header}>
      <Pressable
        onPress={onBack}
        style={sharedStyles.iconButton}
        accessibilityRole="button"
        accessibilityLabel="뒤로가기"
        hitSlop={8}
      >
        <Ionicons name="chevron-back" size={24 * scale} color={colors.black} />
      </Pressable>
      <Text style={styles.headerTitle}>관리자 설정</Text>
      <View style={sharedStyles.iconButton} />
    </View>
  );
}
