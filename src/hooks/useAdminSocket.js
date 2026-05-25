import { useScoreSocket } from "./useScoreSocket";

export function useAdminSocket(onScoreMessage, onMetricsMessage) {
  return useScoreSocket(onScoreMessage, onMetricsMessage);
}
