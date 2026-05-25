import { colors } from "../constants/theme";

export const soundOptions = ["소리", "진동", "무음"];

export const weeklyReportDays = [
  { day: "Mon", backgroundColor: "#F2A65A", textColor: colors.black },
  { day: "Tue", backgroundColor: colors.meterGreen, textColor: colors.white },
  { day: "Wed", backgroundColor: colors.meterGreen, textColor: colors.white },
  { day: "Thu", backgroundColor: "#E05A47", textColor: colors.white },
  { day: "Fri", backgroundColor: colors.meterGreen, textColor: colors.white, isToday: true },
  { day: "Sat", backgroundColor: colors.gray, textColor: "#3A3A3C" },
  { day: "Sun", backgroundColor: colors.gray, textColor: "#3A3A3C" }
];
