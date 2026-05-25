import Constants from "expo-constants";

const DEFAULT_UT_PORT = "8787";

export function getUtWebSocketUrl() {
  const runtimeHost = getRuntimeHost();
  if (runtimeHost) {
    return `ws://${runtimeHost}:${getUtPort()}`;
  }

  return getPublicEnv("EXPO_PUBLIC_UT_WS_URL");
}

export function getRealtimeSessionUrl() {
  const runtimeHost = getRuntimeHost();
  if (runtimeHost) {
    return `http://${runtimeHost}:${getUtPort()}/realtime/session`;
  }

  return getPublicEnv("EXPO_PUBLIC_REALTIME_SESSION_URL");
}

function getRuntimeHost() {
  const webHost = getWebHost();
  if (webHost) return webHost;

  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoClient?.hostUri ||
    Constants.manifest?.debuggerHost ||
    Constants.manifest?.hostUri;

  return parseHost(hostUri);
}

function getWebHost() {
  if (typeof window === "undefined") return null;
  return parseHost(window.location?.host);
}

function parseHost(value) {
  if (!value || typeof value !== "string") return null;
  const withoutProtocol = value.replace(/^[a-z]+:\/\//i, "");
  const hostWithPort = withoutProtocol.split("/")[0];
  const host = hostWithPort.split(":")[0];
  return host || null;
}

function getUtPort() {
  return getPublicEnv("EXPO_PUBLIC_UT_PORT") || DEFAULT_UT_PORT;
}

function getPublicEnv(name) {
  if (typeof process !== "undefined" && process.env) {
    return process.env[name];
  }
  return undefined;
}
