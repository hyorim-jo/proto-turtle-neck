import { useCallback, useEffect, useRef, useState } from "react";

import { getUtWebSocketUrl } from "../utils/utServerUrl";

const reconnectDelay = 1200;

export function useScoreSocket(onScoreMessage, onMetricsMessage) {
  const scoreCallbackRef = useRef(onScoreMessage);
  const metricsCallbackRef = useRef(onMetricsMessage);
  const socketRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    scoreCallbackRef.current = onScoreMessage;
  }, [onScoreMessage]);

  useEffect(() => {
    metricsCallbackRef.current = onMetricsMessage;
  }, [onMetricsMessage]);

  useEffect(() => {
    const url = getUtWebSocketUrl();
    let isClosed = false;

    if (!url || typeof WebSocket === "undefined") {
      setStatus("disabled");
      return undefined;
    }

    const connect = () => {
      setStatus("connecting");

      let socket;
      try {
        socket = new WebSocket(url);
      } catch {
        setStatus("error");
        reconnectTimerRef.current = setTimeout(connect, reconnectDelay);
        return;
      }

      socketRef.current = socket;

      socket.onopen = () => {
        setStatus("connected");
      };

      socket.onmessage = (event) => {
        const message = parseMessage(event.data);
        if (message?.type === "score" && typeof message.score === "number") {
          scoreCallbackRef.current(Math.round(message.score));
        }
        if (message?.type === "metrics") {
          metricsCallbackRef.current?.({
            currentGoodPostureMinutes: readNumber(message.currentGoodPostureMinutes),
            averagePostureMinutes: readNumber(message.averagePostureMinutes)
          });
        }
      };

      socket.onerror = () => {
        setStatus("error");
      };

      socket.onclose = () => {
        if (isClosed) return;
        setStatus("disconnected");
        reconnectTimerRef.current = setTimeout(connect, reconnectDelay);
      };
    };

    connect();

    return () => {
      isClosed = true;
      clearTimeout(reconnectTimerRef.current);
      socketRef.current?.close();
    };
  }, []);

  const sendScore = useCallback((score) => {
    const socket = socketRef.current;
    const openState = typeof WebSocket !== "undefined" ? WebSocket.OPEN : 1;

    if (socket?.readyState !== openState) {
      return false;
    }

    socket.send(JSON.stringify({ type: "set-score", score: Math.round(score) }));
    return true;
  }, []);

  const sendMetrics = useCallback((metrics) => {
    const socket = socketRef.current;
    const openState = typeof WebSocket !== "undefined" ? WebSocket.OPEN : 1;
    const currentGoodPostureMinutes = readOutgoingNumber(metrics.currentGoodPostureMinutes);
    const averagePostureMinutes = readOutgoingNumber(metrics.averagePostureMinutes);

    if (currentGoodPostureMinutes == null || averagePostureMinutes == null) {
      return false;
    }

    if (socket?.readyState !== openState) {
      return false;
    }

    socket.send(
      JSON.stringify({
        type: "set-metrics",
        currentGoodPostureMinutes,
        averagePostureMinutes
      })
    );
    return true;
  }, []);

  const logEvent = useCallback((eventName, payload = {}) => {
    const socket = socketRef.current;
    const openState = typeof WebSocket !== "undefined" ? WebSocket.OPEN : 1;

    if (socket?.readyState !== openState || !eventName) {
      return false;
    }

    socket.send(
      JSON.stringify({
        type: "log-event",
        event: eventName,
        payload
      })
    );
    return true;
  }, []);

  return { status, sendScore, sendMetrics, logEvent };
}

function parseMessage(data) {
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

function readNumber(value) {
  return typeof value === "number" && !Number.isNaN(value) ? Math.round(value) : undefined;
}

function readOutgoingNumber(value) {
  const number = Math.round(Number(value));
  if (Number.isNaN(number)) return null;
  return Math.max(0, Math.min(999, number));
}
