import React from "react";

import { PausedCard } from "./PausedCard";
import { PostureCard } from "./PostureCard";
import { WarningCard } from "./WarningCard";

export function MeasurementStatusCard({
  variant,
  goodPostureMinutes,
  warningPostureSeconds,
  averagePostureMinutes,
  isPaused = false
}) {
  if (isPaused) {
    return <PausedCard />;
  }

  if (variant.status === "good") {
    return (
      <PostureCard
        currentMinutes={goodPostureMinutes}
        averageMinutes={averagePostureMinutes}
      />
    );
  }

  return <WarningCard variant={variant} warningSeconds={warningPostureSeconds} />;
}
