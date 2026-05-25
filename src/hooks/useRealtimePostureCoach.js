import { useCallback, useEffect, useRef, useState } from "react";
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

export function useRealtimePostureCoach(
  variant,
  isPaused = false,
  coachMode = "correction",
  onLogEvent
) {
  const connectionRef = useRef(null);
  const dataChannelRef = useRef(null);
  const localStreamRef = useRef(null);
  const hasStartedForStatusRef = useRef(null);
  const maxSessionTimerRef = useRef(null);
  const idleSessionTimerRef = useRef(null);
  const responseInProgressRef = useRef(false);
  const openingRequestedRef = useRef(false);
  const [status, setStatus] = useState("idle");
  const [transcript, setTranscript] = useState("");
  const [assistantText, setAssistantText] = useState("");

  const stopSession = useCallback(() => {
    clearTimer(maxSessionTimerRef);
    clearTimer(idleSessionTimerRef);

    dataChannelRef.current?.close();
    dataChannelRef.current = null;

    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;

    connectionRef.current?.close();
    connectionRef.current = null;
    responseInProgressRef.current = false;
    openingRequestedRef.current = false;

    stopSpeakerRoute();

    setStatus("idle");
  }, []);

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

    stopSession();
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
        requestOpeningResponse(
          sendEvent,
          variant,
          coachMode,
          responseInProgressRef,
          openingRequestedRef,
          onLogEvent
        );
      };
      dataChannel.onmessage = (event) => {
        const shouldEndSession = handleRealtimeEvent(
          event.data,
          setTranscript,
          setAssistantText,
          scheduleIdleTimeout,
          clearIdleTimeout,
          responseInProgressRef,
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
      requestOpeningResponse(
        sendEvent,
        variant,
        coachMode,
        responseInProgressRef,
        openingRequestedRef,
        onLogEvent
      );
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
  }, [clearIdleTimeout, coachMode, onLogEvent, scheduleIdleTimeout, sendEvent, stopSession, variant]);

  useEffect(() => {
    if (isPaused || !warningStatuses.has(variant.status)) {
      hasStartedForStatusRef.current = null;
      stopSession();
      return undefined;
    }

    const sessionKey = `${variant.status}:${coachMode}`;
    if (hasStartedForStatusRef.current === sessionKey) {
      return undefined;
    }

    hasStartedForStatusRef.current = sessionKey;
    startSession();

    return undefined;
  }, [coachMode, isPaused, startSession, stopSession, variant.status]);

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

function requestOpeningResponse(
  sendEvent,
  variant,
  coachMode,
  responseInProgressRef,
  openingRequestedRef,
  onLogEvent
) {
  if (openingRequestedRef.current) return;

  const didSend = sendEvent({
    type: "conversation.item.create",
    item: {
      type: "message",
      role: "user",
      content: [
        {
          type: "input_text",
          text: buildOpeningTriggerText(variant, coachMode)
        }
      ]
    }
  });

  if (!didSend) return;

  const didRequestResponse = sendEvent({
    type: "response.create",
    response: {
      instructions: `${buildOpeningPrompt(variant, coachMode)}

지금 즉시 음성으로 사용자에게 먼저 말을 걸어라. 사용자의 추가 발화를 기다리지 말고 첫 문장을 말한다.`,
      modalities: ["audio", "text"]
    }
  });

  if (didRequestResponse) {
    openingRequestedRef.current = true;
    responseInProgressRef.current = true;
    onLogEvent?.("realtime_opening_requested", {
      postureStatus: variant.status,
      coachMode
    });
  }
}

function buildOpeningTriggerText(variant, coachMode) {
  const statusText = variant.status === "bad" ? "bad" : "soso";
  if (coachMode === "stretch") {
    return `앱이 최근 10분 안에 bad 자세가 3번 이상 반복된 것을 감지했습니다. 현재 상태는 ${statusText}입니다. 사용자에게 먼저 스트레칭을 제안하세요.`;
  }
  return `앱이 사용자의 자세 점수가 낮아진 것을 감지했습니다. 현재 상태는 ${statusText}입니다. 사용자에게 먼저 자세 교정과 스트레칭을 제안하세요.`;
}

function buildOpeningPrompt(variant, coachMode = "correction") {
  const postureLevel = variant.status === "bad" ? "bad" : "soso";
  const openingLine =
    coachMode === "stretch"
      ? "거북목 자세가 10분 안에 여러 번 반복됐어요. 이번에는 목과 어깨를 짧게 풀어볼까요?"
      : postureLevel === "bad"
        ? "거북목 자세가 꽤 심해 보여요. 지금 잠깐 자세를 바로잡고 목과 어깨를 풀어볼까요?"
        : "거북목 자세가 감지됐어요. 지금 자세를 바르게 해볼까요?";
  const modeInstruction =
    coachMode === "stretch"
      ? "이번 대화의 목표는 자세 교정보다 스트레칭 제안이다. 사용자가 동의하면 바로 따라 할 수 있는 목, 어깨, 등 스트레칭 중 하나를 1단계로 안내한다."
      : "이번 대화의 목표는 먼저 자세를 고치도록 확인하고, 필요할 때만 스트레칭을 제안하는 것이다.";

  return `너는 Necklife 앱의 한국어 음성 자세 코치다.
현재 자세 상태는 ${postureLevel}이고, 코치 모드는 ${coachMode}다.
${modeInstruction}

반드시 첫 응답은 아래 한 문장으로 시작한다:
"${openingLine}"

대화 시나리오:
1. 사용자가 자세를 고쳤다고 말하면 짧게 칭찬한다. 예: "좋아요. 바른 자세 잘 유지하고 있어요."
2. 사용자가 고쳤다고 했지만 다시 불편함을 말하거나 아직 어렵다고 하면 "아직 목이 기울어져 있어요. 지금 자세를 바꾸기 어렵나요?"처럼 의도를 확인한다.
3. 사용자가 어렵다거나 나중에 하겠다고 하면 "알겠어요. 잠시 후 다시 확인할게요."라고 말하고 대화를 마무리한다.
4. 코치 모드가 stretch이면 등, 목, 어깨 스트레칭을 부드럽게 제안한다.
5. 사용자가 아무 말도 하지 않으면 재촉하지 말고 짧게 기다린다.

항상 1~2문장으로 짧고 자연스럽게 말한다. 사용자가 스트레칭을 하겠다고 하면 구체적인 스트레칭 1개만 안내한다.
대화가 자연스럽게 끝나면 마지막 텍스트에 ${END_SESSION_TOKEN}을 포함한다.`;
}

function handleRealtimeEvent(
  rawData,
  setTranscript,
  setAssistantText,
  scheduleIdleTimeout,
  clearIdleTimeout,
  responseInProgressRef,
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
