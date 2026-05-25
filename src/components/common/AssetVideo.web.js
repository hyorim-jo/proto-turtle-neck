import React, { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { Asset } from "expo-asset";
import { StyleSheet } from "react-native";

export const AssetVideo = forwardRef(function AssetVideo(
  {
    source,
    style,
    resizeMode = "contain",
    shouldPlay = false,
    isLooping = false,
    isMuted = false,
    progressUpdateIntervalMillis = 500,
    onLoad,
    onReadyForDisplay,
    onPlaybackStatusUpdate
  },
  ref
) {
  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  const uri = useMemo(() => Asset.fromModule(source).uri, [source]);
  const flattenedStyle = StyleSheet.flatten(style);

  useImperativeHandle(ref, () => ({
    async getStatusAsync() {
      return getStatus(videoRef.current);
    },
    async setStatusAsync(status) {
      const video = videoRef.current;
      if (!video) return getStatus(video);

      if (typeof status.positionMillis === "number") {
        video.currentTime = status.positionMillis / 1000;
      }
      if (typeof status.shouldPlay === "boolean") {
        if (status.shouldPlay) {
          await video.play();
        } else {
          video.pause();
        }
      }
      return getStatus(video);
    },
    async playAsync() {
      const video = videoRef.current;
      if (video) await video.play();
      return getStatus(video);
    },
    async pauseAsync() {
      videoRef.current?.pause();
      return getStatus(videoRef.current);
    }
  }));

  function emitStatus() {
    onPlaybackStatusUpdate?.(getStatus(videoRef.current));
  }

  function startStatusTimer() {
    stopStatusTimer();
    intervalRef.current = window.setInterval(emitStatus, progressUpdateIntervalMillis);
  }

  function stopStatusTimer() {
    if (intervalRef.current == null) return;
    window.clearInterval(intervalRef.current);
    intervalRef.current = null;
  }

  return React.createElement("video", {
    ref: videoRef,
    src: uri,
    style: {
      ...flattenedStyle,
      objectFit: resizeMode,
      display: "block",
      backgroundColor: "transparent"
    },
    muted: isMuted,
    loop: isLooping,
    autoPlay: shouldPlay,
    playsInline: true,
    controls: false,
    onLoadedData: (event) => {
      const status = getStatus(event.currentTarget);
      onLoad?.(status);
      onReadyForDisplay?.({ status });
      emitStatus();
      if (shouldPlay) event.currentTarget.play().catch(() => {});
    },
    onPlay: () => {
      startStatusTimer();
      emitStatus();
    },
    onPause: () => {
      stopStatusTimer();
      emitStatus();
    },
    onEnded: () => {
      stopStatusTimer();
      emitStatus();
    },
    onTimeUpdate: emitStatus,
    onError: emitStatus
  });
});

function getStatus(video) {
  if (!video || Number.isNaN(video.duration)) {
    return { isLoaded: false };
  }

  return {
    isLoaded: true,
    isPlaying: !video.paused && !video.ended,
    didJustFinish: video.ended,
    positionMillis: Math.round(video.currentTime * 1000),
    durationMillis: Math.round(video.duration * 1000)
  };
}
