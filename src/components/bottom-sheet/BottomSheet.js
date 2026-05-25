import React, { useEffect, useRef, useState } from "react";
import { Animated, PanResponder, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { NotificationCard } from "./NotificationCard";
import { getSegmentThumbWidth } from "./SegmentedControl";
import { WeeklyReportCard } from "./WeeklyReportCard";
import { sheetClosedOffset, sheetHeight } from "../../constants/theme";
import { soundOptions } from "../../data/bottomSheetOptions";
import { styles } from "./BottomSheet.styles";

const segmentThumbWidth = getSegmentThumbWidth(soundOptions.length);

export function BottomSheet({ isOpen, onSetOpen }) {
  const insets = useSafeAreaInsets();
  const [selectedSound, setSelectedSound] = useState(soundOptions[0]);
  const selectedSoundIndex = soundOptions.indexOf(selectedSound);
  const translateY = useRef(new Animated.Value(isOpen ? 0 : sheetClosedOffset)).current;
  const soundThumbX = useRef(new Animated.Value(0)).current;
  const dragStartY = useRef(0);
  const onSetOpenRef = useRef(onSetOpen);

  useEffect(() => {
    onSetOpenRef.current = onSetOpen;
  }, [onSetOpen]);

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: isOpen ? 0 : sheetClosedOffset,
      useNativeDriver: true,
      stiffness: 300,
      damping: 38,
      mass: 1
    }).start();
  }, [isOpen, translateY]);

  useEffect(() => {
    Animated.spring(soundThumbX, {
      toValue: selectedSoundIndex * segmentThumbWidth,
      useNativeDriver: true,
      speed: 20,
      bounciness: 4
    }).start();
  }, [selectedSoundIndex, soundThumbX]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, { dy, dx }) =>
        Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 5,
      onPanResponderGrant: () => {
        translateY.stopAnimation((value) => {
          dragStartY.current = value;
        });
      },
      onPanResponderMove: (_, { dy }) => {
        let next = dragStartY.current + dy;
        if (next < 0) {
          next = -Math.sqrt(-next) * 3;
        } else {
          next = Math.min(sheetClosedOffset, next);
        }
        translateY.setValue(next);
      },
      onPanResponderRelease: (_, { vy }) => {
        translateY.stopAnimation((value) => {
          const shouldOpen =
            vy < -0.5 || (Math.abs(vy) <= 0.5 && value < sheetClosedOffset / 2);
          onSetOpenRef.current(shouldOpen);
        });
      },
      onPanResponderTerminate: () => {
        translateY.stopAnimation((value) => {
          onSetOpenRef.current(value < sheetClosedOffset / 2);
        });
      }
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.bottomSheet,
        {
          height: sheetHeight + insets.bottom,
          transform: [{ translateY }]
        }
      ]}
      {...panResponder.panHandlers}
    >
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel="바텀시트 핸들"
        style={styles.handleArea}
      >
        <View style={styles.handle} />
      </View>

      <View style={styles.content}>
        <NotificationCard
          options={soundOptions}
          selectedSound={selectedSound}
          thumbX={soundThumbX}
          onSelectSound={setSelectedSound}
        />
        <WeeklyReportCard />
      </View>
    </Animated.View>
  );
}
