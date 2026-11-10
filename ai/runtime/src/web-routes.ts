/**
 * Serves the chat web app (ai/web) and the small read-only endpoints it needs:
 *   GET /                 the app
 *   GET /app/<file>       app scripts and styles
 *   GET /vendor/<name>    browser libraries from node_modules (fixed list)
 *   GET /catalog          topics, Atlas sections and role families for the sidebar
 *   GET /entry?id=...     one full source entry for the source viewer
 *   GET /atlas/<file>     the IT Roles & Terminology Atlas (incl. the Role Readiness Test); /atlas → /#atlas,
 *                         where the tutor shows it over the chat
 */
import type { IncomingMessage, ServerResponse } from "node:http";
import { readFile } from "node:fs/promises";
import { dirname, extname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { rewriteImages, visualUrl } from "./chat-evidence.js";
import { createAnswerModel } from "./answer-model.js";
import { loadQuestionIndex } from "./question-index.js";
import { REPOSITORY_ROOT } from "./question-indexer.js";
import { TOPIC_DESCRIPTIONS, TOPIC_LABELS } from "./topic-labels.js";
import { needsProfile } from "./profile-gate.js";

const RUNTIME_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * GET /suggest?q=What is a clos → questions from the notes that start with the typed text
 * ("What is a closure?"), shortest first, for the composer's Tab-to-complete suggestion.
 */
async function completions(typed: string, profile: boolean): Promise<string[]> {
  const prefix = typed.trimStart().toLowerCase();
  if (prefix.trim().length < 3 || prefix.length > 200) return [];
  const { entries } = await loadQuestionIndex();
  const seen = new Set<string>();
  const found: string[] = [];
  for (const entry of entries) {
    const question = entry.question.trim();
    if (entry.kind === "roadmap" || question.length > 140 || !question.toLowerCase().startsWith(prefix) || seen.has(question)) continue;
    if (!profile && needsProfile(entry.source.path, question)) continue;
    seen.add(question);
    found.push(question);
  }
  return found.sort((a, b) => a.length - b.length).slice(0, 8);
}
const WEB_DIR = resolve(REPOSITORY_ROOT, "ai/web");
const ATLAS_DIR = resolve(REPOSITORY_ROOT, "IT_Roles_Terminology_Atlas");
export const ATLAS_HOME = "/#atlas";
const VENDOR: Record<string, string> = {
  "marked.js": "marked/lib/marked.esm.js",
  "purify.js": "dompurify/dist/purify.es.mjs",
  "highlight.js": "@highlightjs/cdn-assets/es/highlight.min.js",
  "mermaid.js": "mermaid/dist/mermaid.min.js",
};
const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webmanifest": "application/manifest+json",
};
/** Scripts only from this server; inline styles are needed by Mermaid's SVG output. */
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "connect-src 'self'",
  "font-src 'self' data:",
  "object-src 'none'",
  "base-uri 'none'",
  "frame-ancestors 'none'",
].join("; ");
/** The Atlas also reads live job and tech-news feeds from these public APIs, and opens inside the tutor page. */
const ATLAS_CSP = CSP.replace("connect-src 'self'", "connect-src 'self' https://www.arbeitnow.com https://remotive.com https://jobicy.com https://hn.algolia.com").replace("frame-ancestors 'none'", "frame-ancestors 'self'");

export { TOPIC_LABELS };
const ATLAS_TOPICS = ["roadmaps", "it-roles", "it-terminology", "tech-stack", "it-careers"];
/** Where "Sources" links point: the notes on GitHub (TUTOR_GITHUB_REPO = owner/name, TUTOR_GITHUB_BRANCH). */
const GITHUB_REPO = /^[\w.-]+\/[\w.-]+$/.test(process.env.TUTOR_GITHUB_REPO ?? "") ? process.env.TUTOR_GITHUB_REPO! : "sathsure/Tech-Mastery-Hub";
const GITHUB_BRANCH = /^[\w./-]+$/.test(process.env.TUTOR_GITHUB_BRANCH ?? "") ? process.env.TUTOR_GITHUB_BRANCH! : "main";

function sendFile(response: ServerResponse, status: number, body: Buffer | string, type: string, cache: string, csp = CSP): void {
  const headers: Record<string, string> = { "content-type": type, "cache-control": cache, "x-content-type-options": "nosniff", "referrer-policy": "no-referrer" };
  if (type.startsWith("text/html")) headers["content-security-policy"] = csp;
  response.writeHead(status, headers);
  response.end(body);
}

function sendJson(response: ServerResponse, status: number, payload: unknown): void {
  sendFile(response, status, JSON.stringify(payload), "application/json; charset=utf-8", "no-cache");
}

/** Resolves the URL-encoded `name` inside `root`, or null when it is malformed or would leave it. */
function inside(root: string, encodedName: string): string | null {
  let name: string;
  try {
    name = decodeURIComponent(encodedName);
  } catch {
    return null;
  }
  const target = resolve(root, name);
  const path = relative(root, target);
  return !path || path.startsWith("..") || isAbsolute(path) ? null : target;
}

async function serveStatic(response: ServerResponse, file: string | null, cache: string, csp = CSP): Promise<void> {
  const type = file ? TYPES[extname(file).toLowerCase()] : undefined;
  if (!file || !type) return sendJson(response, 404, { error: { code: "NOT_FOUND", message: "Not found." } });
  try {
    sendFile(response, 200, await readFile(file), type, cache, csp);
  } catch {
    sendJson(response, 404, { error: { code: "NOT_FOUND", message: "Not found." } });
  }
}

export async function buildCatalog() {
  const index = await loadQuestionIndex();
  const counts = new Map<string, number>();
  const samples = new Map<string, string[]>();
  for (const entry of index.entries) {
    for (const topic of entry.topics) {
      counts.set(topic, (counts.get(topic) ?? 0) + 1);
      if (entry.kind === "question" && (samples.get(topic)?.length ?? 0) < 3) samples.set(topic, [...(samples.get(topic) ?? []), entry.question]);
    }
  }
  const families = new Map<string, string[]>();
  for (const entry of index.entries) {
    if (entry.kind !== "role") continue;
    const family = entry.section[1] ?? "Other";
    families.set(family, [...(families.get(family) ?? []), entry.question.replace(/^What does an? /, "").replace(/ do\?$/, "")]);
  }
  const topic = (id: string) => ({ id, label: TOPIC_LABELS[id] ?? id, description: TOPIC_DESCRIPTIONS[id] ?? null, count: counts.get(id) ?? 0, samples: samples.get(id) ?? [] });
  const model = createAnswerModel();
  return {
    answerMode: model ? "claude" : "repository",
    model: model?.model ?? null,
    github: `https://github.com/${GITHUB_REPO}/blob/${GITHUB_BRANCH}/`,
    stats: {
      entries: index.stats.entries,
      questions: index.stats.questions + index.stats.followUps,
      roles: index.stats.roles,
      terms: index.stats.terms,
      codeBlocks: index.stats.codeBlocks,
      visuals: index.stats.visuals,
    },
    topics: [...counts.keys()].filter(id => !ATLAS_TOPICS.includes(id)).map(topic).sort((a, b) => b.count - a.count),
    atlas: ATLAS_TOPICS.filter(id => counts.has(id)).map(topic),
    roleFamilies: [...families.entries()].map(([family, roles]) => ({ family, roles })),
  };
}

async function entryPayload(id: string) {
  const index = await loadQuestionIndex();
  const entry = index.entries.find(item => item.id === id);
  if (!entry) return null;
  return {
    id: entry.id,
    kind: entry.kind,
    question: entry.question,
    prompt: entry.prompt ? rewriteImages(entry.prompt, entry) : null,
    answer: rewriteImages(entry.answer, entry),
    section: entry.section,
    topics: entry.topics,
    relatedTopics: entry.relatedTopics ?? [],
    path: entry.source.path,
    startLine: entry.source.startLine,
    endLine: entry.source.endLine,
    visuals: entry.visuals.flatMap(visual => {
      const url = visualUrl(visual);
      return url ? [{ url, alt: visual.alt }] : [];
    }),
    parent: entry.parentId ? { id: entry.parentId, question: index.entries.find(item => item.id === entry.parentId)?.question ?? "" } : null,
    followUps: index.entries.filter(item => item.parentId === entry.id).map(item => ({ id: item.id, question: item.question })),
  };
}

/** Handles web-app routes; returns false when the request is not one of them. */
export async function handleWebRoute(request: IncomingMessage, response: ServerResponse): Promise<boolean> {
  if (request.method !== "GET") return false;
  const url = new URL(request.url ?? "/", "http://localhost");
  const path = url.pathname;
  if (path === "/" || path === "/index.html") {
    await serveStatic(response, resolve(WEB_DIR, "index.html"), "no-cache");
    return true;
  }
  if (path.startsWith("/app/")) {
    await serveStatic(response, inside(WEB_DIR, path.slice("/app/".length)), "no-cache");
    return true;
  }
  if (path.startsWith("/vendor/")) {
    const target = VENDOR[path.slice("/vendor/".length)];
    await serveStatic(response, target ? resolve(RUNTIME_DIR, "node_modules", target) : null, "public, max-age=86400");
    return true;
  }
  if (path === "/atlas" || path === "/atlas/") {
    response.writeHead(302, { location: ATLAS_HOME, "cache-control": "no-cache" });
    response.end();
    return true;
  }
  if (path.startsWith("/atlas/")) {
    // Test files stay private; everything else is the static Atlas page and its scripts.
    // Checked after decoding, so "pay-tax.test%2Ejs" can't slip past.
    const resolved = inside(ATLAS_DIR, path.slice("/atlas/".length));
    const file = resolved && !/\.test\.js$/i.test(resolved) ? resolved : null;
    await serveStatic(response, file, "no-cache", ATLAS_CSP);
    return true;
  }
  if (path === "/catalog") {
    sendJson(response, 200, { data: await buildCatalog() });
    return true;
  }
  if (path === "/suggest") {
    sendJson(response, 200, { data: await completions(url.searchParams.get("q") ?? "", url.searchParams.get("profile") === "1") });
    return true;
  }
  if (path === "/entry") {
    const id = url.searchParams.get("id") ?? "";
    let payload = id.length > 0 && id.length <= 400 ? await entryPayload(id) : null;
    // Salary and work-abroad notes need the profile, as everywhere else.
    if (payload && url.searchParams.get("profile") !== "1" && needsProfile(payload.path, payload.question)) payload = null;
    sendJson(response, payload ? 200 : 404, payload ? { data: payload } : { error: { code: "NOT_FOUND", message: "Entry not found." } });
    return true;
  }
  return false;
}
