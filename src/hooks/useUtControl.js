import { useScoreSocket } from "./useScoreSocket";

export function useUtControl(onScoreChange, onMetricsChange) {
  return useScoreSocket(onScoreChange, onMetricsChange);
}
