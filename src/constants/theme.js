import { Dimensions } from "react-native";

export const BASE_WIDTH = 390;
export const BASE_HEIGHT = 844;
export const MOCK_STATUS_BAR_HEIGHT = 42;
export const SHEET_HEIGHT = 311;
export const SHEET_PEEK_HEIGHT = 80;
export const layout = {
  turtleY: y(303),
  turtleBadY: y(304),
  turtleSheetOpenY: y(300),
  audioY: y(532),
  audioSheetOpenY: y(560),
  chipsY: y(624),
  chipsSheetOpenY: y(642),
  controlsY: y(670),
  controlsSheetOpenY: y(680)
};

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

export const scale = Math.min(1, windowWidth / BASE_WIDTH, windowHeight / BASE_HEIGHT);

export const device = {
  width: windowWidth,
  height: windowHeight
};

export const sheetHeight = SHEET_HEIGHT * scale;
export const sheetPeekHeight = SHEET_PEEK_HEIGHT * scale;
export const sheetClosedOffset = sheetHeight - sheetPeekHeight;

export const colors = {
  black: "#000000",
  white: "#FFFFFF",
  appBackground: "#F9FAF9",
  green: "#2EA965",
  meterGreen: "#2FA866",
  deepGreen: "#034520",
  softGreen: "#E6F3EC",
  paleGreen: "#F0FFF7",
  sheet: "#EEF2EF",
  sheetHandle: "#AEB8B2",
  chip: "#E5E5EA",
  chipText: "#3A3A3C",
  orange: "#FF9900",
  blue: "#0049BE",
  blueBorder: "#D6F9E6",
  gray: "#D9D9D9",
  card: "#FFFFFF",
  warningBg: "#FFF1F0",
  dangerSoft: "#FFF1F0",
  dangerBg: "#FFF1F0",
  danger: "#D92D20"
};

export const font = {
  regular: "System",
  medium: "System",
  semiBold: "System",
  bold: "System"
};

export function y(value) {
  return value - MOCK_STATUS_BAR_HEIGHT;
}

export function scaleY(value) {
  return value * scale;
}

export function fade(hex) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, 0.5)`;
}
