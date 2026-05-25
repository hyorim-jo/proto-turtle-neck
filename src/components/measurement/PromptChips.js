import React, { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

import { colors, scaleY } from "../../constants/theme";
import { sharedStyles } from "../../styles/sharedStyles";
import { styles } from "./PromptChips.styles";

export function PromptChips({ top, pages, pageIndex, onSetPageIndex }) {
  const scrollRef = useRef(null);
  const [width, setWidth] = useState(0);
  const loopedPages = useMemo(() => {
    if (pages.length <= 1) return pages;
    return [pages[pages.length - 1], ...pages, pages[0]];
  }, [pages]);
  const scrollPageIndex = pages.length <= 1 ? pageIndex : pageIndex + 1;

  useEffect(() => {
    if (width <= 0) return;
    scrollRef.current?.scrollTo({ x: width * scrollPageIndex, animated: true });
  }, [scrollPageIndex, width]);

  const handleMomentumScrollEnd = (event) => {
    if (width <= 0) return;
    const nextScrollPageIndex = Math.round(event.nativeEvent.contentOffset.x / width);

    if (pages.length <= 1) {
      onSetPageIndex(nextScrollPageIndex);
      return;
    }

    if (nextScrollPageIndex === 0) {
      onSetPageIndex(pages.length - 1);
      scrollRef.current?.scrollTo({ x: width * pages.length, animated: false });
      return;
    }

    if (nextScrollPageIndex === pages.length + 1) {
      onSetPageIndex(0);
      scrollRef.current?.scrollTo({ x: width, animated: false });
      return;
    }

    onSetPageIndex(nextScrollPageIndex - 1);
  };

  return (
    <View
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      style={[
        styles.promptPager,
        top == null ? sharedStyles.flowFullWidth : [sharedStyles.floatingFullWidth, { top: scaleY(top) }]
      ]}
    >
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        bounces={false}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEnabled={width > 0}
      >
        {loopedPages.map((prompts, index) => (
          <View key={index} style={[styles.promptPage, { width }]}>
            {prompts.map((text) => (
              <View key={text} style={styles.promptChip}>
                <Text
                  adjustsFontSizeToFit
                  minimumFontScale={0.82}
                  numberOfLines={1}
                  style={styles.promptText}
                >
                  {text}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      <EdgeFade side="left" />
      <EdgeFade side="right" />
    </View>
  );
}

function EdgeFade({ side }) {
  const isLeft = side === "left";

  return (
    <Svg
      pointerEvents="none"
      style={[styles.edgeFade, isLeft ? styles.edgeFadeLeft : styles.edgeFadeRight]}
    >
      <Defs>
        <LinearGradient id={`prompt-fade-${side}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop
            offset="0%"
            stopColor={colors.appBackground}
            stopOpacity={isLeft ? 1 : 0}
          />
          <Stop
            offset="100%"
            stopColor={colors.appBackground}
            stopOpacity={isLeft ? 0 : 1}
          />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill={`url(#prompt-fade-${side})`} />
    </Svg>
  );
}
