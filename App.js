import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { Audio } from "expo-av";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { AdminScreen } from "./src/components/admin/AdminScreen";
import { HomeScreen } from "./src/components/home/HomeScreen";
import { MeasurementScreen } from "./src/components/measurement/MeasurementScreen";
import { UtHotspot } from "./src/components/measurement/UtHotspot";
import { colors, device } from "./src/constants/theme";
import { measurementVariants } from "./src/data/measurementVariants";
import { useUtControl } from "./src/hooks/useUtControl";
import { scoreToStatusId } from "./src/utils/postureStatus";

const BAD_REPEAT_WINDOW_MS = 10 * 60 * 1000;
const BAD_REPEAT_THRESHOLD = 3;
const STRETCH_COACH_COOLDOWN_MS = 10 * 60 * 1000;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("home");
  const [score, setScore] = useState(85);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [goodPostureSeconds, setGoodPostureSeconds] = useState(0);
  const [warningPostureSeconds, setWarningPostureSeconds] = useState(0);
  const [averagePostureMinutes, setAveragePostureMinutes] = useState(8);
  const [microphonePermissionStatus, setMicrophonePermissionStatus] = useState("checking");
  const [isMeasurementPaused, setIsMeasurementPaused] = useState(false);
  const [coachMode, setCoachMode] = useState("correction");
  const status = scoreToStatusId(score);
  const logEventRef = useRef(() => false);
  const badEntryTimestampsRef = useRef([]);
  const previousStatusRef = useRef(status);
  const lastStretchCoachAtRef = useRef(0);

  const activeVariant = useMemo(
    () => measurementVariants.find((v) => v.id === status) ?? measurementVariants[0],
    [status]
  );
  const logUtEvent = useCallback((eventName, payload) => {
    logEventRef.current?.(eventName, payload);
  }, []);

  useEffect(() => {
    if (currentScreen !== "measurement" || isMeasurementPaused || status !== "good") return undefined;
    const id = setInterval(() => setGoodPostureSeconds((seconds) => seconds + 1), 1000);
    return () => clearInterval(id);
  }, [currentScreen, isMeasurementPaused, status]);

  useEffect(() => {
    if (currentScreen !== "measurement" || isMeasurementPaused) {
      previousStatusRef.current = status;
      return;
    }

    const previousStatus = previousStatusRef.current;
    previousStatusRef.current = status;

    if (previousStatus !== status) {
      logUtEvent("posture_status_changed", {
        from: previousStatus,
        to: status,
        score
      });
    }

    if (status !== "bad" || previousStatus === "bad") {
      if (status !== "bad") setCoachMode("correction");
      return;
    }

    const now = Date.now();
    badEntryTimestampsRef.current = [...badEntryTimestampsRef.current, now].filter(
      (timestamp) => now - timestamp <= BAD_REPEAT_WINDOW_MS
    );
    logUtEvent("bad_posture_entered", {
      countInWindow: badEntryTimestampsRef.current.length,
      windowMinutes: BAD_REPEAT_WINDOW_MS / 1000 / 60,
      score
    });

    const shouldSuggestStretch =
      badEntryTimestampsRef.current.length >= BAD_REPEAT_THRESHOLD &&
      now - lastStretchCoachAtRef.current >= STRETCH_COACH_COOLDOWN_MS;

    if (shouldSuggestStretch) {
      lastStretchCoachAtRef.current = now;
      setCoachMode("stretch");
      logUtEvent("stretch_coach_triggered", {
        countInWindow: badEntryTimestampsRef.current.length,
        threshold: BAD_REPEAT_THRESHOLD
      });
      return;
    }

    setCoachMode("correction");
  }, [currentScreen, isMeasurementPaused, logUtEvent, score, status]);

  const requestMicrophonePermission = useCallback(async () => {
    setMicrophonePermissionStatus("checking");

    try {
      const permission = await Audio.requestPermissionsAsync();
      setMicrophonePermissionStatus(permission.granted ? "granted" : "denied");
      return permission.granted;
    } catch {
      setMicrophonePermissionStatus("denied");
      return false;
    }
  }, []);

  useEffect(() => {
    requestMicrophonePermission();
  }, [requestMicrophonePermission]);

  useEffect(() => {
    if (currentScreen !== "measurement") {
      setWarningPostureSeconds(0);
      return undefined;
    }

    if (isMeasurementPaused) {
      return undefined;
    }

    if (status === "good") {
      setWarningPostureSeconds(0);
      return undefined;
    }

    const id = setInterval(() => setWarningPostureSeconds((seconds) => seconds + 1), 1000);
    return () => clearInterval(id);
  }, [currentScreen, isMeasurementPaused, status]);

  const handleUtScoreChange = useCallback((newScore) => {
    setScore(newScore);
    setIsSheetOpen(false);
    logUtEvent("score_applied", {
      score: newScore,
      status: scoreToStatusId(newScore)
    });
  }, [logUtEvent]);

  const handleCycleVariant = useCallback(() => {
    setScore((currentScore) => (currentScore > 80 ? 62 : currentScore > 50 ? 27 : 85));
    setIsSheetOpen(false);
  }, []);

  const handleGoodPostureMinutesChange = useCallback((minutes) => {
    const nextMinutes = clampMinutes(minutes);
    setGoodPostureSeconds(nextMinutes * 60);
    logUtEvent("good_posture_minutes_applied", { minutes: nextMinutes });
  }, [logUtEvent]);

  const handleAveragePostureMinutesChange = useCallback((minutes) => {
    const nextMinutes = clampMinutes(minutes);
    setAveragePostureMinutes(nextMinutes);
    logUtEvent("average_posture_minutes_applied", { minutes: nextMinutes });
  }, [logUtEvent]);

  const handleMetricsChange = useCallback(
    ({ currentGoodPostureMinutes, averagePostureMinutes: nextAveragePostureMinutes }) => {
      if (typeof currentGoodPostureMinutes === "number") {
        handleGoodPostureMinutesChange(currentGoodPostureMinutes);
      }
      if (typeof nextAveragePostureMinutes === "number") {
        handleAveragePostureMinutesChange(nextAveragePostureMinutes);
      }
    },
    [handleAveragePostureMinutesChange, handleGoodPostureMinutesChange]
  );

  const { logEvent } = useUtControl(handleUtScoreChange, handleMetricsChange);

  useEffect(() => {
    logEventRef.current = logEvent;
  }, [logEvent]);

  const handleStartMeasurement = useCallback(async () => {
    if (microphonePermissionStatus !== "granted") {
      const isGranted = await requestMicrophonePermission();
      if (!isGranted) return;
    }

    setGoodPostureSeconds(0);
    setWarningPostureSeconds(0);
    setCoachMode("correction");
    badEntryTimestampsRef.current = [];
    previousStatusRef.current = status;
    lastStretchCoachAtRef.current = 0;
    setIsMeasurementPaused(false);
    setIsSheetOpen(false);
    setCurrentScreen("measurement");
    logUtEvent("measurement_started", { status });
  }, [logUtEvent, microphonePermissionStatus, requestMicrophonePermission, status]);

  const handleToggleMeasurementPause = useCallback(() => {
    setIsMeasurementPaused((current) => {
      const next = !current;
      logUtEvent(next ? "measurement_paused" : "measurement_resumed");
      return next;
    });
  }, [logUtEvent]);

  const goodPostureMinutes = Math.floor(goodPostureSeconds / 60);

  return (
    <SafeAreaProvider>
      <SafeAreaView edges={["top"]} style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
        <View style={styles.stage}>
          <View style={styles.phone}>
            {currentScreen === "home" && (
              <HomeScreen
                onStart={handleStartMeasurement}
                onAdminOpen={() => setCurrentScreen("admin")}
                microphonePermissionStatus={microphonePermissionStatus}
                onRequestMicrophonePermission={requestMicrophonePermission}
              />
            )}
            {currentScreen === "measurement" && (
              <>
                <MeasurementScreen
                  variant={activeVariant}
                  score={score}
                  isSheetOpen={isSheetOpen}
                  onSetSheetOpen={setIsSheetOpen}
                  goodPostureMinutes={goodPostureMinutes}
                  warningPostureSeconds={warningPostureSeconds}
                  averagePostureMinutes={averagePostureMinutes}
                  coachMode={coachMode}
                  isPaused={isMeasurementPaused}
                  onLogEvent={logUtEvent}
                  onTogglePause={handleToggleMeasurementPause}
                  onBack={() => {
                    setIsSheetOpen(false);
                    setIsMeasurementPaused(false);
                    logUtEvent("measurement_ended", { reason: "back" });
                    setCurrentScreen("home");
                  }}
                />
                <UtHotspot onPress={handleCycleVariant} />
              </>
            )}
            {currentScreen === "admin" && (
              <AdminScreen
                score={score}
                onChangeScore={handleUtScoreChange}
                goodPostureMinutes={goodPostureMinutes}
                averagePostureMinutes={averagePostureMinutes}
                onChangeGoodPostureMinutes={handleGoodPostureMinutesChange}
                onChangeAveragePostureMinutes={handleAveragePostureMinutesChange}
                onChangeMetrics={handleMetricsChange}
                onBack={() => setCurrentScreen("home")}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.appBackground
  },
  stage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.appBackground
  },
  phone: {
    width: device.width,
    height: device.height,
    backgroundColor: colors.appBackground,
    overflow: "hidden"
  }
});

function clampMinutes(value) {
  const number = Math.round(Number(value));
  if (Number.isNaN(number)) return 0;
  return Math.max(0, Math.min(999, number));
}
