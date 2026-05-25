import { useCallback, useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import {
  mediaDevices,
  RTCPeerConnection,
  RTCSessionDescription
} from "react-native-webrtc";
import InCallManager from "react-native-incall-manager";

import { getRealtimeSessionUrl } from "../utils/utServerUrl";

const warningStatuses = new Set(["soso", "bad"]);
const END_SESSION_TOKEN = "[[END_SESSION]]";
const MAX_SESSION_MS = 60 * 1000;
const USER_REPLY_IDLE_MS = 12 * 1000;
const RESPONSE_DRAIN_BEFORE_STOP_MS = 1800;
const WARNING_DURATION_BEFORE_INTERVENTION_MS = 15 * 1000;
const BEEP_SOUND_URI =
  "data:audio/wav;base64,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";

export function useRealtimePostureCoach(
  variant,
  isPaused = false,
  coachMode = "correction",
  interventionMode = "voice",
  onLogEvent
) {
  const connectionRef = useRef(null);
  const dataChannelRef = useRef(null);
  const localStreamRef = useRef(null);
  const hasStartedForStatusRef = useRef(null);
  const maxSessionTimerRef = useRef(null);
  const idleSessionTimerRef = useRef(null);
  const deferredStopTimerRef = useRef(null);
  const warningDurationTimerRef = useRef(null);
  const openingSpeechTimerRef = useRef(null);
  const openingSpeechPollStartTimerRef = useRef(null);
  const openingSpeechPollIntervalRef = useRef(null);
  const openingSpeechCompletedRef = useRef(false);
  const openingSpeechCancelledRef = useRef(false);
  const openingSpeechTokenRef = useRef(null);
  const pendingStopAfterResponseRef = useRef(false);
  const responseInProgressRef = useRef(false);
  const [status, setStatus] = useState("idle");
  const [transcript, setTranscript] = useState("");
  const [assistantText, setAssistantText] = useState("");
  const [readySessionKey, setReadySessionKey] = useState(null);

  const stopSession = useCallback(() => {
    clearTimer(maxSessionTimerRef);
    clearTimer(idleSessionTimerRef);
    clearTimer(deferredStopTimerRef);
    clearTimer(warningDurationTimerRef);
    clearTimer(openingSpeechTimerRef);
    clearTimer(openingSpeechPollStartTimerRef);
    clearIntervalRef(openingSpeechPollIntervalRef);
    openingSpeechCancelledRef.current = true;
    openingSpeechTokenRef.current = null;
    Speech.stop();
    openingSpeechCompletedRef.current = false;

    dataChannelRef.current?.close();
    dataChannelRef.current = null;

    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;

    connectionRef.current?.close();
    connectionRef.current = null;
    pendingStopAfterResponseRef.current = false;
    responseInProgressRef.current = false;

    stopSpeakerRoute();

    setStatus("idle");
  }, []);

  const scheduleDeferredSessionStop = useCallback(() => {
    clearTimer(deferredStopTimerRef);
    deferredStopTimerRef.current = setTimeout(() => {
      onLogEvent?.("realtime_coach_deferred_stop_after_response", {
        postureStatus: variant.status,
        coachMode
      });
      stopSession();
    }, RESPONSE_DRAIN_BEFORE_STOP_MS);
  }, [coachMode, onLogEvent, stopSession, variant.status]);

  const stopSessionWhenSafe = useCallback(() => {
    if (responseInProgressRef.current) {
      pendingStopAfterResponseRef.current = true;
      clearTimer(idleSessionTimerRef);
      onLogEvent?.("realtime_coach_stop_deferred_until_response_done", {
        postureStatus: variant.status,
        coachMode
      });
      return;
    }

    stopSession();
  }, [coachMode, onLogEvent, stopSession, variant.status]);

  const scheduleIdleTimeout = useCallback(() => {
    if (responseInProgressRef.current) return;

    clearTimer(idleSessionTimerRef);
    idleSessionTimerRef.current = setTimeout(() => {
      onLogEvent?.("realtime_coach_idle_timeout", {
        postureStatus: variant.status,
        coachMode
      });
      stopSession();
    }, USER_REPLY_IDLE_MS);
  }, [coachMode, onLogEvent, stopSession, variant.status]);

  const clearIdleTimeout = useCallback(() => {
    clearTimer(idleSessionTimerRef);
  }, []);

  const sendEvent = useCallback((event) => {
    const channel = dataChannelRef.current;
    if (!channel || channel.readyState !== "open") return false;
    channel.send(JSON.stringify(event));
    return true;
  }, []);

  const startSession = useCallback(async () => {
    const sessionUrl = getRealtimeSessionUrl();
    if (!sessionUrl) {
      setStatus("disabled");
      return;
    }

    clearTimer(maxSessionTimerRef);
    clearTimer(idleSessionTimerRef);
    clearTimer(deferredStopTimerRef);
    dataChannelRef.current?.close();
    dataChannelRef.current = null;
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
    connectionRef.current?.close();
    connectionRef.current = null;
    pendingStopAfterResponseRef.current = false;
    responseInProgressRef.current = false;

    setStatus("connecting");
    setTranscript("");
    setAssistantText("");
    onLogEvent?.("realtime_coach_starting", {
      postureStatus: variant.status,
      coachMode
    });

    try {
      startSpeakerRoute();
      const stream = await mediaDevices.getUserMedia({ audio: true, video: false });
      localStreamRef.current = stream;

      const peerConnection = new RTCPeerConnection();
      connectionRef.current = peerConnection;
      peerConnection.ontrack = () => {
        startSpeakerRoute();
        onLogEvent?.("realtime_remote_audio_track_received", {
          postureStatus: variant.status,
          coachMode
        });
      };

      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      const dataChannel = peerConnection.createDataChannel("oai-events");
      dataChannelRef.current = dataChannel;
      dataChannel.onopen = () => {
        setStatus("connected");
        onLogEvent?.("realtime_datachannel_opened", {
          postureStatus: variant.status,
          coachMode
        });
        maxSessionTimerRef.current = setTimeout(() => {
          onLogEvent?.("realtime_coach_max_duration_reached", {
            postureStatus: variant.status,
            coachMode
          });
          stopSession();
        }, MAX_SESSION_MS);
        sendOpeningContext(sendEvent, variant, coachMode, onLogEvent);
      };
      dataChannel.onmessage = (event) => {
        const shouldEndSession = handleRealtimeEvent(
          event.data,
          setTranscript,
          setAssistantText,
          scheduleIdleTimeout,
          clearIdleTimeout,
          responseInProgressRef,
          pendingStopAfterResponseRef,
          scheduleDeferredSessionStop,
          onLogEvent
        );
        if (shouldEndSession) {
          stopSession();
        }
      };
      dataChannel.onerror = () => {
        onLogEvent?.("realtime_datachannel_error", {
          postureStatus: variant.status,
          coachMode
        });
        setStatus("error");
      };
      dataChannel.onclose = () => {
        setStatus("idle");
      };

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      const response = await fetch(sessionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/sdp"
        },
        body: offer.sdp
      });

      const answerSdp = await response.text();
      if (!response.ok) {
        throw new Error(answerSdp);
      }

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription({ type: "answer", sdp: answerSdp })
      );
      onLogEvent?.("realtime_remote_description_set", {
        postureStatus: variant.status,
        coachMode
      });
      sendOpeningContext(sendEvent, variant, coachMode, onLogEvent);
    } catch (error) {
      console.warn("Failed to start realtime posture coach", error);
      onLogEvent?.("realtime_coach_error", {
        postureStatus: variant.status,
        coachMode,
        message: error.message
      });
      stopSession();
      setStatus("error");
    }
  }, [
    clearIdleTimeout,
    coachMode,
    onLogEvent,
    scheduleDeferredSessionStop,
    scheduleIdleTimeout,
    sendEvent,
    stopSession,
    variant
  ]);

  const runIntervention = useCallback(() => {
    if (interventionMode === "silent") {
      setStatus("idle");
      setAssistantText("");
      onLogEvent?.("silent_intervention_triggered", {
        postureStatus: variant.status,
        coachMode
      });
      return;
    }

    if (interventionMode === "beep") {
      setStatus("beep");
      setAssistantText("");
      onLogEvent?.("beep_intervention_started", {
        postureStatus: variant.status,
        coachMode
      });
      playBeep()
        .then(() => {
          onLogEvent?.("beep_intervention_finished", {
            postureStatus: variant.status,
            coachMode
          });
          setStatus("idle");
        })
        .catch((error) => {
          onLogEvent?.("beep_intervention_error", {
            postureStatus: variant.status,
            coachMode,
            message: error.message
          });
          setStatus("idle");
        });
      return;
    }

    const openingLine = buildOpeningLine(variant, coachMode);
    clearTimer(openingSpeechTimerRef);
    clearTimer(openingSpeechPollStartTimerRef);
    clearIntervalRef(openingSpeechPollIntervalRef);
    openingSpeechCancelledRef.current = true;
    openingSpeechTokenRef.current = null;
    Speech.stop();

    const speechToken = Symbol("openingSpeech");
    const speechState = { hasStarted: false };
    openingSpeechTokenRef.current = speechToken;
    openingSpeechCancelledRef.current = false;
    openingSpeechCompletedRef.current = false;
    setStatus("speaking");
    setAssistantText(openingLine);
    onLogEvent?.("tts_opening_started", {
      postureStatus: variant.status,
      coachMode,
      text: openingLine
    });

    const finishSpeech = (reason) => {
      if (
        openingSpeechCompletedRef.current ||
        openingSpeechCancelledRef.current ||
        openingSpeechTokenRef.current !== speechToken
      ) {
        return;
      }

      openingSpeechCompletedRef.current = true;
      clearTimer(openingSpeechTimerRef);
      clearTimer(openingSpeechPollStartTimerRef);
      clearIntervalRef(openingSpeechPollIntervalRef);
      onLogEvent?.("tts_opening_finished", {
        postureStatus: variant.status,
        coachMode,
        reason
      });
      startSession();
    };

    const startPollingSpeechState = () => {
      if (
        openingSpeechCancelledRef.current ||
        openingSpeechTokenRef.current !== speechToken ||
        openingSpeechPollIntervalRef.current != null
      ) {
        return;
      }

      openingSpeechPollIntervalRef.current = setInterval(async () => {
        if (
          openingSpeechCancelledRef.current ||
          openingSpeechTokenRef.current !== speechToken
        ) {
          clearIntervalRef(openingSpeechPollIntervalRef);
          return;
        }

        try {
          const isSpeaking = await Speech.isSpeakingAsync();
          if (isSpeaking) {
            speechState.hasStarted = true;
            return;
          }

          if (speechState.hasStarted) {
            finishSpeech("speech_state_idle");
          }
        } catch (error) {
          console.warn("Failed to check TTS speaking state", error);
        }
      }, 250);
    };

    openingSpeechPollStartTimerRef.current = setTimeout(startPollingSpeechState, 700);
    openingSpeechTimerRef.current = setTimeout(
      () => finishSpeech("max_wait"),
      estimateSpeechDuration(openingLine) + 5000
    );
    Speech.speak(openingLine, {
      language: "ko-KR",
      pitch: 1,
      rate: 0.95,
      onStart: () => {
        speechState.hasStarted = true;
        startPollingSpeechState();
      },
      onDone: () => finishSpeech("done"),
      onStopped: () => {
        if (!openingSpeechCancelledRef.current) {
          finishSpeech("stopped");
        }
      },
      onError: () => {
        onLogEvent?.("tts_opening_error", {
          postureStatus: variant.status,
          coachMode
        });
        finishSpeech("error");
      }
    });
  }, [coachMode, interventionMode, onLogEvent, startSession, variant]);

  useEffect(() => {
    const sessionKey = `${coachMode}:${interventionMode}`;

    if (isPaused || !warningStatuses.has(variant.status)) {
      hasStartedForStatusRef.current = null;
      setReadySessionKey(null);
      clearTimer(warningDurationTimerRef);
      stopSessionWhenSafe();
      return undefined;
    }

    if (hasStartedForStatusRef.current === sessionKey) {
      return undefined;
    }

    if (readySessionKey !== sessionKey) {
      if (warningDurationTimerRef.current == null) {
        onLogEvent?.("posture_warning_duration_timer_started", {
          postureStatus: variant.status,
          coachMode,
          durationMs: WARNING_DURATION_BEFORE_INTERVENTION_MS
        });
        warningDurationTimerRef.current = setTimeout(() => {
          warningDurationTimerRef.current = null;
          setReadySessionKey(sessionKey);
        }, WARNING_DURATION_BEFORE_INTERVENTION_MS);
      }
      return undefined;
    }

    clearTimer(warningDurationTimerRef);
    hasStartedForStatusRef.current = sessionKey;
    setReadySessionKey(null);
    runIntervention();

    return undefined;
  }, [
    coachMode,
    interventionMode,
    isPaused,
    onLogEvent,
    readySessionKey,
    runIntervention,
    stopSessionWhenSafe,
    variant.status
  ]);

  useEffect(() => stopSession, [stopSession]);

  return {
    realtimeStatus: status,
    transcript,
    assistantText,
    startSession,
    stopSession
  };
}

function startSpeakerRoute() {
  try {
    InCallManager.start({ media: "audio" });
    InCallManager.setForceSpeakerphoneOn(true);
    InCallManager.setSpeakerphoneOn(true);
  } catch (error) {
    console.warn("Failed to route realtime audio to speaker", error);
  }
}

function stopSpeakerRoute() {
  try {
    InCallManager.setForceSpeakerphoneOn(false);
    InCallManager.stop();
  } catch (error) {
    console.warn("Failed to reset realtime audio route", error);
  }
}

function clearTimer(timerRef) {
  if (timerRef.current == null) return;
  clearTimeout(timerRef.current);
  timerRef.current = null;
}

function clearIntervalRef(intervalRef) {
  if (intervalRef.current == null) return;
  clearInterval(intervalRef.current);
  intervalRef.current = null;
}

function sendOpeningContext(sendEvent, variant, coachMode, onLogEvent) {
  const didSend = sendEvent({
    type: "conversation.item.create",
    item: {
      type: "message",
      role: "user",
      content: [
        {
          type: "input_text",
          text: buildOpeningContextText(variant, coachMode)
        }
      ]
    }
  });

  if (didSend) {
    onLogEvent?.("realtime_opening_context_sent", {
      postureStatus: variant.status,
      coachMode
    });
  }
}

function buildOpeningContextText(variant, coachMode) {
  const statusText = variant.status === "bad" ? "bad" : "soso";
  const openingLine = buildOpeningLine(variant, coachMode);
  if (coachMode === "stretch") {
    return `앱이 이미 사용자에게 "${openingLine}"라고 말했습니다. 최근 10분 안에 bad 자세가 3번 이상 반복됐고 현재 상태는 ${statusText}입니다. 사용자의 다음 답변에 자연스럽게 응답하세요.`;
  }
  return `앱이 이미 사용자에게 "${openingLine}"라고 말했습니다. 자세 점수가 낮아졌고 현재 상태는 ${statusText}입니다. 사용자의 다음 답변에 자연스럽게 응답하세요.`;
}

function buildOpeningLine(variant, coachMode) {
  if (coachMode === "stretch") {
    return "거북목 자세가 10분 안에 여러 번 반복됐어요. 이번에는 목과 어깨를 짧게 풀어볼까요?";
  }
  if (variant.status === "bad") {
    return "거북목 자세가 꽤 심해 보여요. 지금 잠깐 자세를 바로잡고 목과 어깨를 풀어볼까요?";
  }
  return "거북목 자세가 감지됐어요. 지금 자세를 바르게 해볼까요?";
}

function estimateSpeechDuration(text) {
  return Math.max(2200, Math.min(6500, text.length * 115));
}

async function playBeep() {
  await Audio.setAudioModeAsync({
    playsInSilentModeIOS: true,
    staysActiveInBackground: false,
    shouldDuckAndroid: true
  });

  const { sound } = await Audio.Sound.createAsync(
    { uri: BEEP_SOUND_URI },
    { shouldPlay: true, volume: 1 }
  );

  return new Promise((resolve) => {
    const fallback = setTimeout(async () => {
      sound.setOnPlaybackStatusUpdate(null);
      await sound.unloadAsync();
      resolve();
    }, 650);

    sound.setOnPlaybackStatusUpdate(async (status) => {
      if (!status.isLoaded || !status.didJustFinish) return;
      clearTimeout(fallback);
      sound.setOnPlaybackStatusUpdate(null);
      await sound.unloadAsync();
      resolve();
    });
  });
}

function handleRealtimeEvent(
  rawData,
  setTranscript,
  setAssistantText,
  scheduleIdleTimeout,
  clearIdleTimeout,
  responseInProgressRef,
  pendingStopAfterResponseRef,
  scheduleDeferredSessionStop,
  onLogEvent
) {
  let event;
  try {
    event = JSON.parse(rawData);
  } catch {
    return false;
  }
  let shouldEndSession = false;

  if (event.type === "response.created") {
    responseInProgressRef.current = true;
  }

  if (
    event.type === "input_audio_buffer.speech_started" ||
    event.type === "input_audio_buffer.speech_stopped"
  ) {
    clearIdleTimeout();
  }

  if (
    event.type === "conversation.item.input_audio_transcription.completed" &&
    typeof event.transcript === "string"
  ) {
    setTranscript(event.transcript);
    onLogEvent?.("realtime_user_transcript", {
      transcript: event.transcript
    });
  }

  if (isResponseDeltaEvent(event.type)) {
    responseInProgressRef.current = true;
  }

  if (
    (
      event.type === "response.output_text.delta" ||
      event.type === "response.text.delta" ||
      event.type === "response.audio_transcript.delta" ||
      event.type === "response.output_audio_transcript.delta"
    ) &&
    typeof event.delta === "string"
  ) {
    shouldEndSession = event.delta.includes(END_SESSION_TOKEN);
    setAssistantText((current) => stripEndSessionToken(current + event.delta));
  }

  if (
    event.type === "response.output_text.done" ||
    event.type === "response.text.done" ||
    event.type === "response.audio_transcript.done" ||
    event.type === "response.output_audio_transcript.done"
  ) {
    const doneText = event.text || event.transcript;
    if (typeof doneText === "string") {
      shouldEndSession = doneText.includes(END_SESSION_TOKEN);
      const cleanText = stripEndSessionToken(doneText);
      setAssistantText(cleanText);
      onLogEvent?.("realtime_assistant_text_done", {
        text: cleanText,
        shouldEndSession
      });
    }
  }

  if (isResponseDoneEvent(event.type)) {
    responseInProgressRef.current = false;
    onLogEvent?.("realtime_response_done", { eventType: event.type });
    if (pendingStopAfterResponseRef.current) {
      pendingStopAfterResponseRef.current = false;
      clearIdleTimeout();
      scheduleDeferredSessionStop();
      return shouldEndSession;
    }
    scheduleIdleTimeout();
  }

  return shouldEndSession;
}

function isResponseDeltaEvent(type) {
  return (
    type === "response.audio.delta" ||
    type === "response.output_audio.delta" ||
    type === "response.output_text.delta" ||
    type === "response.text.delta" ||
    type === "response.audio_transcript.delta" ||
    type === "response.output_audio_transcript.delta"
  );
}

function isResponseDoneEvent(type) {
  return (
    type === "response.done" ||
    type === "response.audio.done" ||
    type === "response.output_audio.done" ||
    type === "response.output_item.done"
  );
}

function stripEndSessionToken(text) {
  return text.replaceAll(END_SESSION_TOKEN, "").trim();
}
