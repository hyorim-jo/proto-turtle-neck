import { useCallback, useEffect, useState } from "react";

export function useRealtimePostureCoach() {
  const [status] = useState("disabled");
  const [transcript] = useState("");
  const [assistantText] = useState("");

  const startSession = useCallback(() => {
    console.info("Realtime posture coach is available only in the native dev build.");
  }, []);

  const stopSession = useCallback(() => {}, []);

  useEffect(() => stopSession, [stopSession]);

  return {
    realtimeStatus: status,
    transcript,
    assistantText,
    startSession,
    stopSession
  };
}
