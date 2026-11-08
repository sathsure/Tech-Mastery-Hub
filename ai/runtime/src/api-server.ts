import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, isAbsolute, relative as relativePosix, resolve as resolvePath } from "node:path";
import { executeConversation } from "./conversation-service.js";
import { ValidationError, validateActionRequirements, validateTutorRequest } from "./request-validation.js";
import { API_VERSION, type ApiError, type ApiResponse } from "./api-contracts.js";
import { searchQuestions } from "./question-search.js";
import { runChat } from "./chat-service.js";
import { handleWebRoute } from "./web-routes.js";
import type { ChatEvent, ChatRequest, ChatTurn } from "./chat-contracts.js";
import { REPOSITORY_ROOT } from "./question-indexer.js";

const HOST = process.env.TUTOR_HOST ?? "127.0.0.1";
const PORT = Number(process.env.TUTOR_PORT ?? process.env.PORT ?? "8787");
/** Public deployments (TUTOR_PUBLIC=1) turn off /tutor, which writes a session file per session id. */
const PUBLIC_MODE = process.env.TUTOR_PUBLIC === "1";
const MAX_BODY = 1024 * 1024;
const INTERNAL_MESSAGE = "Something went wrong on the server. Please try again.";

// ---------- Client identity (for rate limits) ----------

/**
 * How many proxies in front of this server append to X-Forwarded-For (TUTOR_TRUST_PROXY, default 0).
 * The client address is read that many entries from the right: entries further left were sent by the
 * client and can be forged.
 */
const TRUSTED_HOPS = Math.max(0, Math.floor(Number(process.env.TUTOR_TRUST_PROXY ?? "0")) || 0);
/**
 * Headers an edge proxy sets itself and overwrites, e.g. Cloudflare's "true-client-ip,cf-connecting-ip"
 * (TUTOR_CLIENT_IP_HEADER). Only set this when every request passes through that proxy.
 */
const CLIENT_IP_HEADERS = (process.env.TUTOR_CLIENT_IP_HEADER ?? "")
  .split(",")
  .map(name => name.trim().toLowerCase())
  .filter(Boolean);

function headerValue(request: IncomingMessage, name: string): string | undefined {
  const value = request.headers[name];
  return (Array.isArray(value) ? value[0] : value)?.trim() || undefined;
}

export function clientAddress(
  request: IncomingMessage,
  trustedHops = TRUSTED_HOPS,
  clientIpHeaders = CLIENT_IP_HEADERS,
): string {
  for (const name of clientIpHeaders) {
    const value = headerValue(request, name);
    if (value) return value;
  }
  const socketAddress = request.socket.remoteAddress || "unknown";
  if (trustedHops <= 0) return socketAddress;
  const chain = (headerValue(request, "x-forwarded-for") ?? "")
    .split(",")
    .map(part => part.trim())
    .filter(Boolean);
  return chain[chain.length - trustedHops] ?? socketAddress;
}

// ---------- Host and CORS checks ----------

/** Cross-origin access is off unless TUTOR_CORS_ORIGIN names an origin: an open /chat would let any website spend the API key. */
const CORS_ORIGIN = process.env.TUTOR_CORS_ORIGIN?.trim() ?? "";
const corsHeaders = (): Record<string, string> =>
  CORS_ORIGIN
    ? {
        "access-control-allow-origin": CORS_ORIGIN,
        "access-control-allow-methods": "GET,POST,OPTIONS",
        "access-control-allow-headers": "content-type",
      }
    : {};

/** When bound to this machine only, answer only requests addressed to it (blocks DNS-rebinding pages). Extra names: TUTOR_ALLOWED_HOSTS=a.example,b.example */
const LOOPBACK_BIND = /^(?:127\.\d+\.\d+\.\d+|localhost|::1)$/i.test(HOST);
const ALLOWED_HOSTS = new Set([
  "127.0.0.1",
  "localhost",
  "[::1]",
  ...(process.env.TUTOR_ALLOWED_HOSTS ?? "")
    .split(",")
    .map(item => item.trim().toLowerCase())
    .filter(Boolean),
]);

export function hostAllowed(hostHeader: string | undefined): boolean {
  if (!LOOPBACK_BIND) return true;
  const host = (hostHeader ?? "").toLowerCase().replace(/:\d+$/, "");
  return ALLOWED_HOSTS.has(host);
}

// ---------- Rate limit ----------

/** /chat requests per client per minute (TUTOR_CHAT_RATE_LIMIT, 0 = no limit). Each answer can cost API tokens. */
const CHAT_LIMIT = Number(process.env.TUTOR_CHAT_RATE_LIMIT ?? "20");
const WINDOW_MS = 60_000;
const MAX_TRACKED_CLIENTS = 5000;
const chatHits = new Map<string, number[]>();

/** Drop clients with no requests in the current window; never reset clients that are still active. */
function pruneChatHits(now: number): void {
  for (const [client, times] of chatHits) {
    if (times.every(time => now - time >= WINDOW_MS)) chatHits.delete(client);
  }
}

export function chatAllowed(client: string, now = Date.now()): boolean {
  if (CHAT_LIMIT <= 0 || Number.isNaN(CHAT_LIMIT)) return true;
  const recent = (chatHits.get(client) ?? []).filter(time => now - time < WINDOW_MS);
  if (recent.length >= CHAT_LIMIT) {
    chatHits.set(client, recent);
    return false;
  }
  recent.push(now);
  chatHits.set(client, recent);
  if (chatHits.size > MAX_TRACKED_CLIENTS) pruneChatHits(now);
  return true;
}

// ---------- Responses ----------

let ready = false;

function send<T>(response: ServerResponse, status: number, payload: T): void {
  response.statusCode = status;
  response.setHeader("content-type", "application/json; charset=utf-8");
  for (const [name, value] of Object.entries(corsHeaders())) response.setHeader(name, value);
  response.setHeader("x-tutor-api-version", API_VERSION);
  response.end(JSON.stringify(payload) + "\n");
}

function error(response: ServerResponse, status: number, code: string, message: string): void {
  const payload: ApiError = { version: API_VERSION, error: { code, message } };
  send(response, status, payload);
}

/** Log the details for the operator; give the client a message that reveals nothing about the server. */
function reportInternalError(context: string, exception: unknown): void {
  const detail = exception instanceof Error ? (exception.stack ?? exception.message) : String(exception);
  process.stderr.write(`[tutor] ${context}: ${detail}\n`);
}

async function readBody(request: IncomingMessage): Promise<string> {
  return await new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    request.on("data", (chunk: Buffer) => {
      size += chunk.length;
      if (size > MAX_BODY) {
        reject(new ValidationError("Request body is too large."));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    request.on("error", reject);
  });
}

const isJson = (request: IncomingMessage) =>
  (request.headers["content-type"] ?? "").toLowerCase().includes("application/json");

/** Parses a JSON body; replies with an error and returns undefined when it cannot. */
async function readJsonBody(request: IncomingMessage, response: ServerResponse): Promise<unknown> {
  if (!isJson(request)) {
    error(response, 415, "UNSUPPORTED_MEDIA_TYPE", "Content-Type must be application/json.");
    return undefined;
  }
  const raw = await readBody(request);
  try {
    return JSON.parse(raw || "{}") as unknown;
  } catch {
    error(response, 400, "INVALID_JSON", "Request body is not valid JSON.");
    return undefined;
  }
}

// ---------- /search ----------

function searchInput(request: IncomingMessage): Record<string, unknown> {
  const params = new URL(request.url ?? "/search", "http://localhost").searchParams;
  return {
    query: params.get("q") ?? "",
    limit: params.has("limit") ? Number(params.get("limit")) : undefined,
    topic: params.get("topic") ?? undefined,
  };
}

/** Returns an error message for invalid search input, or null. */
function searchInputError({ query, limit, topic }: Record<string, unknown>): string | null {
  if (typeof query !== "string" || !query.trim()) return "query is required.";
  if (query.length > 300) return "query must be 300 characters or fewer.";
  if (limit !== undefined && (typeof limit !== "number" || !Number.isInteger(limit) || limit < 1 || limit > 50))
    return "limit must be a whole number from 1 to 50.";
  if (topic !== undefined && (typeof topic !== "string" || topic.length > 100))
    return "topic must be a string of 100 characters or fewer.";
  return null;
}

/** GET /search?q=...&limit=8&topic=java  or  POST /search {"query":"...","limit":8,"topic":"java"} */
async function handleSearch(request: IncomingMessage, response: ServerResponse): Promise<void> {
  let input: Record<string, unknown>;
  if (request.method === "GET") {
    input = searchInput(request);
  } else if (request.method === "POST") {
    const parsed = await readJsonBody(request, response);
    if (parsed === undefined) return;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      error(response, 400, "INVALID_REQUEST", "Request body must be a JSON object.");
      return;
    }
    input = parsed as Record<string, unknown>;
  } else {
    error(response, 405, "METHOD_NOT_ALLOWED", "Use GET or POST for /search.");
    return;
  }
  const problem = searchInputError(input);
  if (problem) {
    error(response, 400, "INVALID_REQUEST", problem);
    return;
  }
  const payload: ApiResponse<ReturnType<typeof searchQuestions>> = {
    version: API_VERSION,
    data: searchQuestions(input.query as string, {
      limit: input.limit as number | undefined,
      topic: input.topic as string | undefined,
    }),
  };
  send(response, 200, payload);
}

// ---------- /chat ----------

function historyError(history: unknown): string | null {
  if (history === undefined) return null;
  if (!Array.isArray(history) || history.length > 40) return "history must be a list of at most 40 turns.";
  let total = 0;
  for (const turn of history) {
    const item = turn as Record<string, unknown> | null;
    const validRole = item?.role === "user" || item?.role === "assistant";
    const content = item?.content;
    if (!validRole || typeof content !== "string" || !content.trim() || content.length > 12000)
      return "each history turn needs role user|assistant and content up to 12000 characters.";
    total += content.length;
  }
  return total > 60000 ? "history must be 60000 characters or fewer in total." : null;
}

type Checked<T> = { ok: true; value: T } | { ok: false; error: string };
const invalid = (error: string): { ok: false; error: string } => ({ ok: false, error });

/** The checked plan, or why it is invalid. */
function checkPlan(plan: unknown): Checked<ChatRequest["plan"]> {
  if (plan === undefined) return { ok: true, value: undefined };
  const input = plan as Record<string, unknown> | null;
  const items = input?.items;
  if (
    typeof input?.title !== "string" ||
    input.title.length > 200 ||
    !Array.isArray(items) ||
    items.length === 0 ||
    items.length > 60
  )
    return invalid("plan needs a title and 1-60 items.");
  const checked: NonNullable<ChatRequest["plan"]>["items"] = [];
  for (const raw of items) {
    const item = raw as Record<string, unknown> | null;
    const label = item?.label;
    const topic = item?.topic;
    const topicValid = topic === undefined || (typeof topic === "string" && topic.length <= 60);
    if (typeof label !== "string" || !label.trim() || label.length > 200 || !topicValid)
      return invalid("each plan item needs a label of up to 200 characters and an optional topic.");
    checked.push({ label: label.trim(), topic: topic as string | undefined });
  }
  const kind = input.kind;
  if (kind !== undefined && kind !== "learning" && kind !== "interview") return invalid("plan kind must be learning or interview.");
  return { ok: true, value: { title: input.title.trim(), items: checked, ...(kind ? { kind } : {}) } };
}

const optionalString = (value: unknown, max: number) =>
  value === undefined || (typeof value === "string" && value.length <= max);

/** Validates a /chat body: the request, or why it is invalid. */
export function validateChatRequest(value: unknown): Checked<ChatRequest> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return invalid("Request body must be a JSON object.");
  const { message, history, topic, plan, overview } = value as Record<string, unknown>;
  if (!optionalString(overview, 100)) return invalid("overview must be a topic id of 100 characters or fewer.");
  if (typeof message !== "string" || !message.trim()) return invalid("message is required.");
  if (message.length > 2000) return invalid("message must be 2000 characters or fewer.");
  if (!optionalString(topic, 100)) return invalid("topic must be a string of 100 characters or fewer.");
  const historyProblem = historyError(history);
  if (historyProblem) return invalid(historyProblem);
  const checkedPlan = checkPlan(plan);
  if (!checkedPlan.ok) return checkedPlan;
  return {
    ok: true,
    value: {
      message: message.trim(),
      history: (history as ChatTurn[] | undefined)?.map(turn => ({ role: turn.role, content: turn.content })),
      topic: topic as string | undefined,
      plan: checkedPlan.value,
      overview: overview as string | undefined,
    },
  };
}

async function answerAsJson(response: ServerResponse, request: ChatRequest, signal: AbortSignal): Promise<void> {
  const events: ChatEvent[] = [];
  for await (const event of runChat(request, { signal })) events.push(event);
  const answer = events.flatMap(event => (event.type === "delta" ? [event.text] : [])).join("");
  send(response, 200, {
    version: API_VERSION,
    data: {
      meta: events.find(event => event.type === "meta") ?? null,
      answer,
      done: events.find(event => event.type === "done") ?? null,
    },
  });
}

async function answerAsStream(response: ServerResponse, request: ChatRequest, signal: AbortSignal): Promise<void> {
  response.writeHead(200, {
    "content-type": "text/event-stream; charset=utf-8",
    "cache-control": "no-cache, no-transform",
    connection: "keep-alive",
    "x-accel-buffering": "no",
    ...corsHeaders(),
    "x-tutor-api-version": API_VERSION,
  });
  const write = (event: ChatEvent) => {
    if (!response.writableEnded) response.write(`event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`);
  };
  try {
    for await (const event of runChat(request, { signal })) write(event);
  } catch (exception) {
    reportInternalError("chat stream", exception);
    write({ type: "error", code: "INTERNAL_ERROR", message: INTERNAL_MESSAGE });
  }
  response.end();
}

/** POST /chat {message, history?, topic?, stream?}: Server-Sent Events by default; {"stream":false} returns one JSON object. */
async function handleChat(request: IncomingMessage, response: ServerResponse): Promise<void> {
  if (request.method !== "POST") {
    error(response, 405, "METHOD_NOT_ALLOWED", "Use POST for /chat.");
    return;
  }
  if (!chatAllowed(clientAddress(request))) {
    response.setHeader("retry-after", "60");
    error(response, 429, "RATE_LIMITED", "Too many chat requests. Try again in a minute.");
    return;
  }
  const parsed = await readJsonBody(request, response);
  if (parsed === undefined) return;
  const checked = validateChatRequest(parsed);
  if (!checked.ok) {
    error(response, 400, "INVALID_REQUEST", checked.error);
    return;
  }
  const validated = checked.value;
  const abort = new AbortController();
  // The browser closed the connection before the answer finished: stop the model call.
  response.on("close", () => {
    if (!response.writableEnded) abort.abort();
  });
  if ((parsed as Record<string, unknown>).stream === false) await answerAsJson(response, validated, abort.signal);
  else await answerAsStream(response, validated, abort.signal);
}

// ---------- /visuals ----------

const VISUAL_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

/** GET /visuals/<path>: images from knowledge/visual-notes only. */
async function handleVisual(request: IncomingMessage, response: ServerResponse): Promise<void> {
  const root = resolvePath(REPOSITORY_ROOT, "knowledge/visual-notes");
  let relativePath: string;
  try {
    relativePath = decodeURIComponent((request.url ?? "").slice("/visuals/".length).split("?")[0]);
  } catch {
    error(response, 400, "INVALID_REQUEST", "Bad image path.");
    return;
  }
  const target = resolvePath(root, relativePath);
  const inside = relativePosix(root, target);
  const type = VISUAL_TYPES[extname(target).toLowerCase()];
  if (!relativePath || inside.startsWith("..") || isAbsolute(inside) || !type) {
    error(response, 404, "NOT_FOUND", "Image not found.");
    return;
  }
  let data: Buffer;
  try {
    data = await readFile(target);
  } catch {
    error(response, 404, "NOT_FOUND", "Image not found.");
    return;
  }
  response.writeHead(200, {
    "content-type": type,
    "cache-control": "public, max-age=3600",
    "x-content-type-options": "nosniff",
    "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'",
    ...corsHeaders(),
  });
  response.end(data);
}

// ---------- /tutor (older session API) ----------

async function handleTutor(request: IncomingMessage, response: ServerResponse): Promise<void> {
  const parsed = await readJsonBody(request, response);
  if (parsed === undefined) return;
  const validated = validateTutorRequest(parsed);
  validateActionRequirements(validated);
  const result = await executeConversation(validated);
  const payload: ApiResponse<typeof result> = { version: API_VERSION, data: result };
  send(response, 200, payload);
}

// ---------- Routing ----------

type Handler = (request: IncomingMessage, response: ServerResponse) => Promise<void> | void;

/** Matches a request to its handler; null means 404. */
function route(request: IncomingMessage): Handler | null {
  const url = request.url ?? "";
  const method = request.method ?? "";
  if (method === "GET" && url === "/health")
    return (_, response) => send(response, 200, { version: API_VERSION, status: "ok", service: "tech-mastery-hub-ai-tutor" });
  if (method === "GET" && url === "/ready")
    return (_, response) =>
      send(response, ready ? 200 : 503, { version: API_VERSION, ready, service: "tech-mastery-hub-ai-tutor" });
  if (url === "/search" || url.startsWith("/search?")) return handleSearch;
  if (url === "/chat") return handleChat;
  if (method === "GET" && url.startsWith("/visuals/")) return handleVisual;
  if (!PUBLIC_MODE && method === "POST" && url === "/tutor") return handleTutor;
  return null;
}

async function handleRequest(request: IncomingMessage, response: ServerResponse): Promise<void> {
  if (!hostAllowed(request.headers.host)) {
    error(response, 403, "FORBIDDEN_HOST", "This server only answers requests addressed to it directly.");
    return;
  }
  if (request.method === "OPTIONS") {
    response.writeHead(204, corsHeaders()).end();
    return;
  }
  if (await handleWebRoute(request, response)) return;
  const handler = route(request);
  if (handler) await handler(request, response);
  else error(response, 404, "NOT_FOUND", "Route not found.");
}

/** Turns a failed request into a response; never throws, so one bad request cannot stop the server. */
function handleFailure(response: ServerResponse, exception: unknown): void {
  if (response.headersSent) {
    // Part of the answer is already out: the only safe thing left is to close the connection.
    reportInternalError("request failed after the response started", exception);
    response.destroy();
    return;
  }
  if (exception instanceof ValidationError) {
    error(response, 400, "INVALID_REQUEST", exception.message);
    return;
  }
  reportInternalError("request failed", exception);
  error(response, 500, "INTERNAL_ERROR", INTERNAL_MESSAGE);
}

export function createTutorApiServer() {
  const server = createServer((request, response) => {
    handleRequest(request, response).catch(exception => {
      try {
        handleFailure(response, exception);
      } catch (secondary) {
        reportInternalError("could not send the error response", secondary);
        response.destroy();
      }
    });
  });
  server.once("listening", () => {
    ready = true;
  });
  return server;
}

export function startTutorApi() {
  const server = createTutorApiServer();
  server.listen(PORT, HOST, () => {
    process.stdout.write(`AI Tutor API listening on http://${HOST}:${PORT}\n`);
  });
  const shutdown = () => {
    ready = false;
    server.close(() => process.exit(0));
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
  return server;
}

if (process.argv.includes("--serve")) startTutorApi();
