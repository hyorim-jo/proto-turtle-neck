import { colors } from "../constants/theme";

export const postureStatusMeta = {
  bad: {
    id: "bad",
    label: "위험 자세 (bad)",
    color: colors.danger,
    score: 27
  },
  soso: {
    id: "soso",
    label: "보통 자세 (soso)",
    color: colors.orange,
    score: 62
  },
  good: {
    id: "good",
    label: "바른 자세 (good)",
    color: colors.green,
    score: 85
  }
};

export const postureStatusButtons = [
  postureStatusMeta.good,
  postureStatusMeta.soso,
  postureStatusMeta.bad
];

export function scoreToStatusId(score) {
  if (score <= 50) return "bad";
  if (score <= 80) return "soso";
  return "good";
}

export function getPostureStatus(score) {
  return postureStatusMeta[scoreToStatusId(score)];
}
