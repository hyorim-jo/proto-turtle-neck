import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";

import { scaleY } from "../../constants/theme";
import { AssetVideo } from "../common/AssetVideo";
import { sharedStyles } from "../../styles/sharedStyles";
import { styles } from "./TurtlePanel.styles";

const turtleVideos = {
  good: require("../../../turtle/good.mp4"),
  soso: require("../../../turtle/soso.mp4"),
  bad: require("../../../turtle/bad.mp4")
};

export function TurtlePanel({ top, status }) {
  const videoStatus = turtleVideos[status] ? status : "good";
  const [activeLayer, setActiveLayer] = useState(0);
  const [pendingLayer, setPendingLayer] = useState(null);
  const [layerStatuses, setLayerStatuses] = useState([videoStatus, null]);

  useEffect(() => {
    if (layerStatuses[activeLayer] === videoStatus) return;

    const nextLayer = activeLayer === 0 ? 1 : 0;
    if (pendingLayer === nextLayer && layerStatuses[nextLayer] === videoStatus) return;

    setLayerStatuses((current) => {
      const next = [...current];
      next[nextLayer] = videoStatus;
      return next;
    });
    setPendingLayer(nextLayer);
  }, [activeLayer, layerStatuses, pendingLayer, videoStatus]);

  const layers = useMemo(
    () =>
      layerStatuses.map((layerStatus, index) => ({
        index,
        status: layerStatus,
        source: layerStatus ? turtleVideos[layerStatus] : null
      })),
    [layerStatuses]
  );

  const handleReadyForDisplay = (index) => {
    if (pendingLayer !== index) return;
    setActiveLayer(index);
    setPendingLayer(null);
  };

  return (
    <View
      style={[
        styles.panel,
        top == null ? sharedStyles.flowFullWidth : [sharedStyles.floatingFullWidth, { top: scaleY(top) }]
      ]}
    >
      <View style={styles.videoBox}>
        {layers.map(({ index, status: layerStatus, source }) => {
          if (!source) return null;

          const isActive = index === activeLayer;
          const isPending = index === pendingLayer;

          return (
            <View
              key={index}
              pointerEvents="none"
              style={[styles.videoLayer, { opacity: isActive ? 1 : 0 }]}
            >
              <AssetVideo
                source={source}
                style={styles.video}
                resizeMode="contain"
                shouldPlay={isActive || isPending}
                isLooping={layerStatus === "good"}
                isMuted
                useNativeControls={false}
                onReadyForDisplay={() => handleReadyForDisplay(index)}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}
