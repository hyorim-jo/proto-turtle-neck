import React from "react";
import { View } from "react-native";

import { ListeningMeter } from "./ListeningMeter";
import { PromptChips } from "./PromptChips";
import { colors } from "../../constants/theme";
import { styles } from "./VoiceAssistantBlock.styles";

export function VoiceAssistantBlock({
  isRecording,
  permissionDenied,
  promptPages,
  promptPageIndex,
  onSetPromptPageIndex,
  realtimeStatus,
  transcript,
  assistantText,
  isPaused,
  onToggleRecording
}) {
  const isRealtimeListening = realtimeStatus === "connected" || realtimeStatus === "connecting";

  return (
    <View style={styles.voiceBlock}>
      <ListeningMeter
        color={colors.meterGreen}
        isActive={isRecording || isRealtimeListening}
        permissionDenied={permissionDenied}
        statusText={getStatusText({ realtimeStatus, transcript, assistantText, isPaused })}
        onToggle={onToggleRecording}
      />
      <PromptChips
        pages={promptPages}
        pageIndex={promptPageIndex}
        onSetPageIndex={onSetPromptPageIndex}
      />
    </View>
  );
}

function getStatusText({ realtimeStatus, transcript, assistantText, isPaused }) {
  if (isPaused) return "자세 측정이 일시 정지 되었습니다.";
  if (realtimeStatus === "beep") return "알림음으로 알려드렸어요";
  if (realtimeStatus === "speaking") return assistantText || "자세 안내 중이에요";
  if (realtimeStatus === "connecting") return "실시간 코치 연결 중이에요";
  if (assistantText) return assistantText;
  if (transcript) return transcript;
  if (realtimeStatus === "connected") return "대답을 듣고 있어요";
  if (realtimeStatus === "error") return "실시간 코치 연결을 확인해주세요";
  return undefined;
}
