import React, { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";

import { styles } from "./PostureTimeInputs.styles";

export function PostureTimeInputs({
  goodPostureMinutes,
  averagePostureMinutes,
  onChangeGoodPostureMinutes,
  onChangeAveragePostureMinutes
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>바른 자세 유지 시간</Text>
      <NumberField
        label="현재"
        value={goodPostureMinutes}
        onChangeNumber={onChangeGoodPostureMinutes}
      />
      <NumberField
        label="평균"
        value={averagePostureMinutes}
        onChangeNumber={onChangeAveragePostureMinutes}
      />
    </View>
  );
}

function NumberField({ label, value, onChangeNumber }) {
  const [text, setText] = useState(String(value));

  useEffect(() => {
    setText(String(value));
  }, [value]);

  const handleChangeText = (nextText) => {
    if (!/^\d*$/.test(nextText)) return;

    setText(nextText);
    if (nextText === "") return;

    onChangeNumber(Number(nextText));
  };

  const handleBlur = () => {
    if (text === "") {
      setText(String(value));
    }
  };

  return (
    <View style={styles.fieldRow}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={`${label} 바른 자세 유지 시간`}
        keyboardType="number-pad"
        value={text}
        onBlur={handleBlur}
        onChangeText={handleChangeText}
        selectTextOnFocus
        style={styles.input}
      />
      <Text style={styles.unit}>분</Text>
    </View>
  );
}
