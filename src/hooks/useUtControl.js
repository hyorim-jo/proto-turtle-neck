import { useScoreSocket } from "./useScoreSocket";

export function useUtControl(onScoreChange, onMetricsChange) {
  const { status } = useScoreSocket(onScoreChange, onMetricsChange);
  return status;
}
