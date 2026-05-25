import React from "react";
import { ScrollView, View } from "react-native";

import { AdminHeader } from "./AdminHeader";
import { ConnectionStatus } from "./ConnectionStatus";
import { PostureTimeInputs } from "./PostureTimeInputs";
import { ScoreStateButtons } from "./ScoreStateButtons";
import { ScoreStatusPanel } from "./ScoreStatusPanel";
import { StatusCriteriaCard } from "./StatusCriteriaCard";
import { useAdminSocket } from "../../hooks/useAdminSocket";
import { getPostureStatus, postureStatusButtons } from "../../utils/postureStatus";
import { styles } from "./AdminScreen.styles";

export function AdminScreen({
  score,
  goodPostureMinutes,
  averagePostureMinutes,
  onChangeScore,
  onChangeGoodPostureMinutes,
  onChangeAveragePostureMinutes,
  onChangeMetrics,
  onBack
}) {
  const scoreStatus = getPostureStatus(score);
  const {
    status: wsStatus,
    sendScore: sendSocketScore,
    sendMetrics
  } = useAdminSocket(onChangeScore, onChangeMetrics);

  const sendScore = (nextScore) => {
    const roundedScore = Math.round(nextScore);
    onChangeScore(roundedScore);
    sendSocketScore(roundedScore);
  };

  const updateGoodPostureMinutes = (minutes) => {
    onChangeGoodPostureMinutes(minutes);
    sendMetrics({ currentGoodPostureMinutes: minutes, averagePostureMinutes });
  };

  const updateAveragePostureMinutes = (minutes) => {
    onChangeAveragePostureMinutes(minutes);
    sendMetrics({ currentGoodPostureMinutes: goodPostureMinutes, averagePostureMinutes: minutes });
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <AdminHeader onBack={onBack} />
      <ConnectionStatus status={wsStatus} />
      <ScoreStateButtons
        buttons={postureStatusButtons}
        selectedStatus={scoreStatus.id}
        onSelectScore={sendScore}
      />

      <View style={styles.divider} />

      <ScoreStatusPanel score={score} status={scoreStatus} onSelectScore={sendScore} />
      <PostureTimeInputs
        goodPostureMinutes={goodPostureMinutes}
        averagePostureMinutes={averagePostureMinutes}
        onChangeGoodPostureMinutes={updateGoodPostureMinutes}
        onChangeAveragePostureMinutes={updateAveragePostureMinutes}
      />
      <StatusCriteriaCard />
    </ScrollView>
  );
}
