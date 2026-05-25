const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { WebSocketServer } = require("ws");

loadDotEnv(path.join(__dirname, ".env"));

const PORT = Number(process.env.UT_PORT || 8787);
const adminPath = path.join(__dirname, "admin.html");
const eventLogDir = path.join(__dirname, "ut-logs");
const eventLogPath = path.join(eventLogDir, "ut-events.jsonl");
const REALTIME_MODEL = process.env.OPENAI_REALTIME_MODEL || "gpt-realtime";
const REALTIME_VOICE = getRealtimeVoice();

let currentScore = 85;
let currentGoodPostureMinutes = 0;
let averagePostureMinutes = 8;
let interventionMode = "voice";

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/realtime/session") {
    handleRealtimeSession(req, res);
    return;
  }

  if (req.url === "/" || req.url === "/admin.html") {
    fs.readFile(adminPath, "utf8", (error, html) => {
      if (error) {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("admin.html could not be read.");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
    });
    return;
  }

  if (req.url === "/score") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ score: currentScore }));
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not found");
});

const wss = new WebSocketServer({ server });

wss.on("connection", (socket) => {
  console.log(`[UT server] client connected. currentScore=${currentScore}`);
  send(socket, { type: "score", score: currentScore });
  sendMetrics(socket);

  socket.on("message", (rawMessage) => {
    const message = parseMessage(rawMessage);
    console.log("[UT server] received", message);

    if (!message || !["set-score", "set-metrics", "log-event"].includes(message.type)) {
      send(socket, {
        type: "error",
        message:
          "Send { type: 'set-score', score: 0~100 }, { type: 'set-metrics', currentGoodPostureMinutes, averagePostureMinutes }, or { type: 'log-event', event, payload }"
      });
      return;
    }

    if (message.type === "log-event") {
      writeUtEvent("app", message.event || "unknown", sanitizePayload(message.payload));
      return;
    }

    if (message.type === "set-metrics") {
      const nextCurrent = readMinutes(message.currentGoodPostureMinutes);
      const nextAverage = readMinutes(message.averagePostureMinutes);
      const nextInterventionMode = readInterventionMode(message.interventionMode) || interventionMode;

      if (nextCurrent == null || nextAverage == null) {
        send(socket, {
          type: "error",
          message: "currentGoodPostureMinutes and averagePostureMinutes must be integers from 0 to 999"
        });
        return;
      }

      currentGoodPostureMinutes = nextCurrent;
      averagePostureMinutes = nextAverage;
      interventionMode = nextInterventionMode;
      console.log(
        `[UT server] broadcast metrics current=${currentGoodPostureMinutes} average=${averagePostureMinutes} interventionMode=${interventionMode}`
      );
      writeUtEvent("admin", "metrics_changed", {
        currentGoodPostureMinutes,
        averagePostureMinutes,
        interventionMode
      });
      broadcastMetrics();
      return;
    }

    const score = Math.round(Number(message.score));
    if (Number.isNaN(score) || score < 0 || score > 100) {
      send(socket, { type: "error", message: "score must be an integer from 0 to 100" });
      return;
    }

    currentScore = score;
    console.log(`[UT server] broadcast score=${currentScore}`);
    writeUtEvent("admin", "score_changed", { score: currentScore });
    broadcast({ type: "score", score: currentScore });
  });

  socket.on("close", () => {
    console.log("[UT server] client disconnected");
  });
});

server.listen(PORT, "0.0.0.0", () => {
  const addresses = getLanAddresses();
  console.log(`UT admin: http://localhost:${PORT}`);
  addresses.forEach((address) => {
    console.log(`UT admin LAN: http://${address}:${PORT}`);
    console.log(`App WebSocket: ws://${address}:${PORT}`);
  });
  console.log(`UT event log: ${eventLogPath}`);
});

function broadcast(payload) {
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      send(client, payload);
    }
  });
}

function broadcastMetrics() {
  broadcast({
    type: "metrics",
    currentGoodPostureMinutes,
    averagePostureMinutes,
    interventionMode
  });
}

function send(socket, payload) {
  console.log("[UT server] send", payload);
  socket.send(JSON.stringify(payload));
}

function sendMetrics(socket) {
  send(socket, {
    type: "metrics",
    currentGoodPostureMinutes,
    averagePostureMinutes
  });
}

function parseMessage(rawMessage) {
  try {
    return JSON.parse(rawMessage.toString());
  } catch {
    return null;
  }
}

function readMinutes(value) {
  const minutes = Math.round(Number(value));
  if (Number.isNaN(minutes) || minutes < 0 || minutes > 999) {
    return null;
  }
  return minutes;
}

function readInterventionMode(value) {
  return ["voice", "beep", "silent"].includes(value) ? value : null;
}

function writeUtEvent(source, event, payload = {}) {
  const record = {
    timestamp: new Date().toISOString(),
    source,
    event,
    payload
  };

  try {
    fs.mkdirSync(eventLogDir, { recursive: true });
    fs.appendFileSync(eventLogPath, `${JSON.stringify(record)}\n`, "utf8");
  } catch (error) {
    console.error("[UT server] failed to write event log", error);
  }
}

function sanitizePayload(payload) {
  if (payload == null || typeof payload !== "object") {
    return {};
  }

  return JSON.parse(JSON.stringify(payload));
}

function getRealtimeVoice() {
  const voices = new Set(["alloy", "ash", "ballad", "coral", "echo", "sage", "shimmer", "verse"]);
  const configuredVoice = process.env.OPENAI_REALTIME_VOICE || "coral";

  if (voices.has(configuredVoice)) {
    return configuredVoice;
  }

  console.warn(
    `[Realtime] OPENAI_REALTIME_VOICE="${configuredVoice}" is not supported. Falling back to "coral".`
  );
  return "coral";
}

function createRealtimeSessionConfig() {
  return {
    type: "realtime",
    model: REALTIME_MODEL,
    instructions:
      "너는 Necklife 앱의 한국어 음성 자세 코치다. 사용자의 자세 점수가 낮아져 먼저 말을 거는 상황이다. 사용자가 자세를 고쳤다고 말하면 짧게 칭찬하고, 여전히 어렵다고 하거나 스트레칭 의사를 보이면 목, 어깨, 등 스트레칭 중 하나를 부드럽게 안내한다. 사용자가 거절하거나 나중에 하겠다고 하면 부담 없이 마무리한다. 항상 1~2문장으로 짧고 자연스럽게 말한다.",
    audio: {
      input: {
        transcription: {
          model: "gpt-4o-mini-transcribe",
          language: "ko"
        },
        turn_detection: {
          type: "server_vad",
          create_response: true,
          interrupt_response: true
        }
      },
      output: {
        voice: REALTIME_VOICE
      }
    }
  };
}

async function handleRealtimeSession(req, res) {
  if (!process.env.OPENAI_API_KEY) {
    writeUtEvent("server", "realtime_session_missing_api_key");
    res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: "OPENAI_API_KEY is required" }));
    return;
  }

  try {
    const sdp = await readRequestBody(req);
    const form = new FormData();
    form.set("sdp", sdp);
    form.set("session", JSON.stringify(createRealtimeSessionConfig()));
    writeUtEvent("server", "realtime_session_requested", {
      model: REALTIME_MODEL,
      voice: REALTIME_VOICE
    });

    const response = await fetch("https://api.openai.com/v1/realtime/calls", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: form
    });

    const answerSdp = await response.text();
    if (!response.ok) {
      console.error("[Realtime] session failed", response.status, answerSdp);
      writeUtEvent("server", "realtime_session_failed", {
        status: response.status,
        message: answerSdp.slice(0, 500)
      });
      res.writeHead(response.status, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(answerSdp);
      return;
    }

    writeUtEvent("server", "realtime_session_created", {
      model: REALTIME_MODEL,
      voice: REALTIME_VOICE
    });
    res.writeHead(200, { "Content-Type": "application/sdp; charset=utf-8" });
    res.end(answerSdp);
  } catch (error) {
    console.error("[Realtime] session error", error);
    writeUtEvent("server", "realtime_session_error", { message: error.message });
    res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: "Failed to create realtime session" }));
  }
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function getLanAddresses() {
  return Object.values(os.networkInterfaces())
    .flat()
    .filter((item) => item && item.family === "IPv4" && !item.internal)
    .map((item) => item.address);
}

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex < 0) return;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    if (!key || process.env[key] != null) return;

    process.env[key] = value.replace(/^["']|["']$/g, "");
  });
}
