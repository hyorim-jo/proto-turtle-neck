import { useCallback, useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";

export function useMicrophoneInput() {
  const recordingRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const stopRecording = useCallback(async () => {
    const recording = recordingRef.current;
    if (!recording) {
      setIsRecording(false);
      return;
    }

    recordingRef.current = null;
    try {
      await recording.stopAndUnloadAsync();
    } catch (error) {
      console.warn("Failed to stop microphone input", error);
    } finally {
      setIsRecording(false);
    }
  }, []);

  const startRecording = useCallback(async () => {
    setPermissionDenied(false);

    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        setPermissionDenied(true);
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingRef.current = recording;
      setIsRecording(true);
    } catch (error) {
      console.warn("Failed to start microphone input", error);
      setIsRecording(false);
    }
  }, []);

  const toggleRecording = useCallback(async () => {
    if (recordingRef.current) {
      await stopRecording();
      return;
    }

    await startRecording();
  }, [startRecording, stopRecording]);

  useEffect(
    () => () => {
      stopRecording();
    },
    [stopRecording]
  );

  return {
    isRecording,
    permissionDenied,
    startRecording,
    stopRecording,
    toggleRecording
  };
}
