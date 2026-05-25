import React from "react";
import { View } from "react-native";

import { ActionButtons } from "./ActionButtons";
import { BottomSheet } from "../bottom-sheet/BottomSheet";
import { MeasurementHeader } from "./MeasurementHeader";
import { MeasurementStatusCard } from "./MeasurementStatusCard";
import { ScoreSummary } from "./ScoreSummary";
import { TurtlePanel } from "./TurtlePanel";
import { VoiceAssistantBlock } from "./VoiceAssistantBlock";
import { usePromptPages } from "../../hooks/usePromptPages";
import { useRealtimePostureCoach } from "../../hooks/useRealtimePostureCoach";
import { styles } from "./MeasurementScreen.styles";

export function MeasurementScreen({
  variant,
  score,
  isSheetOpen,
  onSetSheetOpen,
  goodPostureMinutes,
  warningPostureSeconds,
  averagePostureMinutes,
  coachMode,
  interventionMode,
  isPaused,
  onLogEvent,
  onTogglePause,
  onBack
}) {
  const { pages: promptPages, pageIndex: promptPageIndex, setPageIndex: setPromptPageIndex } =
    usePromptPages(variant.status);
  const { realtimeStatus, transcript, assistantText, startSession, stopSession } =
    useRealtimePostureCoach(variant, isPaused, coachMode, interventionMode, onLogEvent);

  return (
    <View style={styles.screen}>
      <View style={styles.statusSpacer} />

      <View style={styles.content}>
        <MeasurementHeader onBack={onBack} />

        <View style={styles.topBlock}>
          <ScoreSummary
            title={isPaused ? "일시 정지 되었습니다." : variant.title}
            score={score}
            status={variant.status}
            isPaused={isPaused}
          />
          <MeasurementStatusCard
            variant={variant}
            goodPostureMinutes={goodPostureMinutes}
            warningPostureSeconds={warningPostureSeconds}
            averagePostureMinutes={averagePostureMinutes}
            isPaused={isPaused}
          />
        </View>

        <TurtlePanel status={variant.status} />

        <VoiceAssistantBlock
          isRecording={false}
          permissionDenied={false}
          promptPages={promptPages}
          promptPageIndex={promptPageIndex}
          onSetPromptPageIndex={setPromptPageIndex}
          realtimeStatus={realtimeStatus}
          transcript={transcript}
          assistantText={assistantText}
          isPaused={isPaused}
          onToggleRecording={
            isPaused ? undefined : realtimeStatus === "connected" ? stopSession : startSession
          }
        />

        <ActionButtons isPaused={isPaused} onTogglePause={onTogglePause} />
      </View>

      <BottomSheet isOpen={isSheetOpen} onSetOpen={onSetSheetOpen} />
    </View>
  );
}
