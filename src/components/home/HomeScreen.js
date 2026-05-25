import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, scale } from "../../constants/theme";
import { AssetVideo } from "../common/AssetVideo";
import { sharedStyles } from "../../styles/sharedStyles";
import { styles } from "./HomeScreen.styles";

export function HomeScreen({
  onStart,
  onAdminOpen,
  microphonePermissionStatus,
  onRequestMicrophonePermission
}) {
  const isMicrophoneDenied = microphonePermissionStatus === "denied";

  return (
    <View style={[sharedStyles.appScreen, styles.screen]}>
      <View style={styles.header}>
        <Pressable
          onPress={onAdminOpen}
          style={sharedStyles.iconButton}
          accessibilityRole="button"
          accessibilityLabel="관리자 설정 열기"
          hitSlop={8}
        >
          <Ionicons name="settings-outline" size={22 * scale} color={colors.deepGreen} />
        </Pressable>
      </View>

      <View style={styles.heroArea}>
        <AssetVideo
          source={require("../../../turtle/turtle_walk.mp4")}
          style={styles.turtleVideo}
          resizeMode="contain"
          shouldPlay
          isLooping
          isMuted
          useNativeControls={false}
        />
        <Text style={styles.appTitle}>Necklife</Text>
        <Text style={styles.heroSubtitle}>목과 자세를 편안하게 지켜볼게요</Text>
      </View>

      {isMicrophoneDenied && (
        <View style={styles.permissionBox}>
          <Ionicons name="mic-off-outline" size={20 * scale} color={colors.danger} />
          <Text style={styles.permissionText}>
            마이크 권한이 필요합니다. 권한을 허용해야 앱을 사용할 수 있어요.
          </Text>
          <Pressable
            onPress={onRequestMicrophonePermission}
            accessibilityRole="button"
            accessibilityLabel="마이크 권한 다시 요청"
            style={({ pressed }) => [
              styles.permissionButton,
              pressed && styles.permissionButtonPressed
            ]}
          >
            <Text style={styles.permissionButtonText}>권한 다시 요청</Text>
          </Pressable>
        </View>
      )}

      <Pressable
        onPress={onStart}
        accessibilityRole="button"
        accessibilityLabel="측정 시작"
        disabled={isMicrophoneDenied}
        style={({ pressed }) => [
          styles.startBtn,
          isMicrophoneDenied && styles.startBtnDisabled,
          pressed && !isMicrophoneDenied && styles.startBtnPressed
        ]}
      >
        <Text style={styles.startBtnText}>측정 시작</Text>
      </Pressable>
    </View>
  );
}
