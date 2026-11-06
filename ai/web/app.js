import { fetchCatalog, fetchEntry, searchNotes, streamChat } from "./api.js";
import { connectionMap } from "./graph.js";
import { escapeHtml, icon, markdownToText, renderMarkdown } from "./render.js";
import { deleteConversation, getConversation, listConversations, newConversation, saveConversation } from "./store.js";

const $ = selector => document.querySelector(selector);
const thread = $("#thread");
const input = $("#input");
const sendButton = $("#send");
const topicFilter = $("#topic-filter");

const state = {
  catalog: null,
  labels: {},
  conversation: newConversation(),
  controller: null,
  /** Index of the assistant message whose sources are shown. */
  sourcesFor: -1,
};

const INTENT_LABELS = {
  explain: ["Explain", "book"], "interview-prep": ["Interview prep", "target"], roadmap: ["Roadmap", "compass"],
  role: ["Career", "briefcase"], code: ["Code", "code"], visual: ["Visual", "image"], compare: ["Compare", "layers"],
  debug: ["Debug · RCA", "alert"], quiz: ["Quiz", "zap"],
};
const KIND_LABELS = { question: "Interview Q", "follow-up": "Follow-up", note: "Note", role: "Role", term: "Term", roadmap: "Roadmap" };
const KIND_CLASS = { question: "k-question", "follow-up": "k-follow", note: "k-note", role: "k-role", term: "k-term", roadmap: "k-roadmap" };

const COMMANDS = [
  { name: "interview", hint: "topic", text: "Prepare me for a {} interview", desc: "Drill interview questions on a topic" },
  { name: "quiz", hint: "topic", text: "Quiz me on {}", desc: "One question at a time" },
  { name: "explain", hint: "concept", text: "Explain {}", desc: "Clear explanation with key points" },
  { name: "code", hint: "concept", text: "Show a code example for {}", desc: "Working code with notes" },
  { name: "diagram", hint: "concept", text: "Show a diagram of {}", desc: "Visual: how it works and connects" },
  { name: "compare", hint: "A vs B", text: "Compare {}", desc: "Side-by-side table" },
  { name: "debug", hint: "problem", text: "Help me debug: {}", desc: "Root-cause checklist" },
  { name: "roadmap", hint: "role or topic", text: "Roadmap to become a {}", desc: "Step-by-step checklist" },
  { name: "role", hint: "role", text: "What does a {} do?", desc: "Role, skills, salary, next moves" },
];

// ---------- Small helpers ----------

function toast(message, tone = "info") {
  const element = document.createElement("div");
  element.className = `toast ${tone}`;
  element.innerHTML = `${icon(tone === "error" ? "alert" : "check")}<span>${escapeHtml(message)}</span>`;
  $("#toasts").append(element);
  setTimeout(() => element.classList.add("leaving"), 2600);
  setTimeout(() => element.remove(), 3000);
}

async function copyText(text, label = "Copied") {
  try {
    await navigator.clipboard.writeText(text);
    toast(label);
  } catch {
    toast("Copy is not available here", "error");
  }
}

function prettyModel(id) {
  if (!id) return "Claude";
  const [family, ...version] = id.replace(/^claude-/, "").split("-");
  return `Claude ${family.charAt(0).toUpperCase()}${family.slice(1)} ${version.join(".")}`.trim();
}

function topicLabel(id) {
  return state.labels[id] ?? id;
}

function nearBottom() {
  return thread.scrollHeight - thread.scrollTop - thread.clientHeight < 160;
}

function scrollToBottom(force = false) {
  if (force || nearBottom()) thread.scrollTo({ top: thread.scrollHeight, behavior: force ? "smooth" : "auto" });
}

function setStreaming(active) {
  document.body.classList.toggle("is-streaming", active);
  sendButton.innerHTML = icon(active ? "stop" : "send");
  sendButton.setAttribute("aria-label", active ? "Stop" : "Send");
  sendButton.classList.toggle("stop", active);
}

function autosize() {
  input.style.height = "auto";
  input.style.height = `${Math.min(input.scrollHeight, 220)}px`;
}

// ---------- Sidebar ----------

function renderSidebar() {
  const { topics, atlas } = state.catalog;
  const max = Math.max(...topics.map(topic => topic.count), 1);
  $("#topic-list").innerHTML = topics
    .map((topic, i) => `<li><button type="button" class="topic-item" data-ask="Explore ${escapeHtml(topic.label)}" style="--i:${i}">
      <span class="topic-dot" style="--hue:${(i * 37) % 360}"></span><span class="topic-name">${escapeHtml(topic.label)}</span>
      <span class="topic-count">${topic.count}</span><span class="topic-bar"><i style="width:${Math.round((topic.count / max) * 100)}%"></i></span></button></li>`)
    .join("");
  const atlasPrompts = { roadmaps: "Where do I start?", "it-roles": "What roles are there in IT?", "it-terminology": "What is SDLC?", "tech-stack": "What is Kafka used for?", "it-careers": "Career ladder" };
  const atlasIcons = { roadmaps: "compass", "it-roles": "briefcase", "it-terminology": "book", "tech-stack": "layers", "it-careers": "target" };
  $("#atlas-list").innerHTML = atlas
    .map(item => `<li><button type="button" class="topic-item atlas" data-ask="${escapeHtml(atlasPrompts[item.id] ?? item.label)}">${icon(atlasIcons[item.id] ?? "book")}<span class="topic-name">${escapeHtml(item.label)}</span><span class="topic-count">${item.count}</span></button></li>`)
    .join("");
  topicFilter.innerHTML = `<option value="">All notes</option>` + [...topics, ...atlas].map(topic => `<option value="${escapeHtml(topic.id)}">${escapeHtml(topic.label)}</option>`).join("");
  topicFilter.value = state.conversation.topic ?? "";
  const engine = $("#engine");
  const claude = state.catalog.answerMode === "claude";
  engine.className = `engine ${claude ? "on" : "notes"}`;
  engine.innerHTML = `<i class="dot"></i><span>${claude ? `${escapeHtml(prettyModel(state.catalog.model))} · grounded` : "Notes-only mode"}</span>`;
  engine.title = claude ? "Answers are written by Claude from your notes, with citations." : "No AI model configured: answers are assembled directly from your notes.";
  renderRecent();
}

function renderRecent() {
  const list = listConversations();
  $("#recent-list").innerHTML = list.length
    ? list
        .map(item => `<li class="${item.id === state.conversation.id ? "active" : ""}"><button type="button" class="recent-item" data-open="${item.id}">${icon("message")}<span>${escapeHtml(item.title)}</span></button><button type="button" class="recent-del" data-delete="${item.id}" aria-label="Delete chat">${icon("trash")}</button></li>`)
        .join("")
    : `<li class="recent-empty">Your chats are saved in this browser.</li>`;
}

// ---------- Welcome ----------

function renderWelcome() {
  const { stats, topics } = state.catalog;
  const top = topics.slice(0, 8);
  const samples = topics.flatMap(topic => topic.samples.slice(0, 1)).slice(0, 6);
  thread.innerHTML = `<div class="welcome">
    <div class="hero">
      <div class="hero-badge">${icon("shield")}<span>Grounded in your Tech-Mastery-Hub notes</span></div>
      <h2>What do you want to <span class="gradient-text">master</span> today?</h2>
      <p>Ask a question, prepare for an interview or plan your next role. Every answer shows the notes it came from.</p>
      <div class="stats">
        <div><strong data-count="${stats.questions}">0</strong><span>interview Q&amp;As</span></div>
        <div><strong data-count="${stats.codeBlocks}">0</strong><span>code examples</span></div>
        <div><strong data-count="${stats.visuals}">0</strong><span>diagrams</span></div>
        <div><strong data-count="${stats.roles}">0</strong><span>IT roles</span></div>
        <div><strong data-count="${stats.terms}">0</strong><span>terms</span></div>
      </div>
    </div>
    <div class="paths">
      <article class="path" style="--accent:#22d3ee">
        <div class="path-icon">${icon("target")}</div><h3>Interview prep</h3><p>Pick a topic and drill real questions with model answers.</p>
        <div class="path-chips">${top.slice(0, 6).map(topic => `<button type="button" class="chip" data-ask="Prepare me for a ${escapeHtml(topic.label)} interview">${escapeHtml(topic.label)}</button>`).join("")}</div>
      </article>
      <article class="path" style="--accent:#818cf8">
        <div class="path-icon">${icon("book")}</div><h3>Understand a concept</h3><p>Explanations with code, diagrams and how ideas connect.</p>
        <div class="path-chips">${["How does the event loop work?", "Explain closures with an example", "Show a diagram of the Angular lifecycle"].map(q => `<button type="button" class="chip" data-ask="${escapeHtml(q)}">${escapeHtml(q)}</button>`).join("")}</div>
      </article>
      <article class="path" style="--accent:#e879f9">
        <div class="path-icon">${icon("briefcase")}</div><h3>Careers &amp; roles</h3><p>${stats.roles} roles with skills, salary bands and next moves.</p>
        <div class="path-chips">${["What roles are there in IT?", "What does a DevOps engineer do?", "Data engineer salary"].map(q => `<button type="button" class="chip" data-ask="${escapeHtml(q)}">${escapeHtml(q)}</button>`).join("")}</div>
      </article>
      <article class="path" style="--accent:#34d399">
        <div class="path-icon">${icon("layers")}</div><h3>Decode the jargon</h3><p>${stats.terms} terms and tools explained in one line each.</p>
        <div class="path-chips">${["What is SDLC?", "Full form of CI/CD", "What is Kafka used for?"].map(q => `<button type="button" class="chip" data-ask="${escapeHtml(q)}">${escapeHtml(q)}</button>`).join("")}</div>
      </article>
    </div>
    <div class="try">
      <div class="try-head"><span>${icon("sparkles")} Not sure where to start? Try one of these</span><span class="try-actions"><button type="button" class="ghost-btn" data-ask="Where do I start?">${icon("compass")}<span>Show me where to start</span></button><button type="button" class="ghost-btn" data-action="surprise">${icon("shuffle")}<span>Surprise me</span></button></span></div>
      <div class="try-grid">${samples.map(q => `<button type="button" class="try-item" data-ask="${escapeHtml(q)}"><span>${escapeHtml(q)}</span>${icon("arrow")}</button>`).join("")}</div>
    </div>
  </div>`;
  animateCounters();
}

function animateCounters() {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  for (const element of thread.querySelectorAll("[data-count]")) {
    const target = Number(element.dataset.count);
    if (reduce) {
      element.textContent = target.toLocaleString();
      continue;
    }
    const start = performance.now();
    const step = now => {
      const progress = Math.min((now - start) / 900, 1);
      element.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3))).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
}

// ---------- Messages ----------

function userView(message) {
  const element = document.createElement("article");
  element.className = "msg user";
  element.innerHTML = `<div class="bubble"><p></p></div><div class="avatar user-avatar">${icon("user")}</div>`;
  element.querySelector("p").textContent = message.content;
  return element;
}

function confidenceHtml(rawLevel) {
  const level = ["none", "low", "medium", "high"].includes(rawLevel) ? rawLevel : "none";
  const bars = { none: 0, low: 1, medium: 2, high: 3 }[level] ?? 0;
  const label = { none: "no match", low: "weak match", medium: "good match", high: "strong match" }[level] ?? level;
  return `<span class="confidence c-${level}" title="How well your notes match the question">${[1, 2, 3].map(i => `<i class="${i <= bars ? "on" : ""}"></i>`).join("")}<span>${label}</span></span>`;
}

function groundingHtml(message) {
  const done = message.done;
  if (!done) return "";
  const g = done.grounding;
  const sources = message.meta?.evidence.length ?? 0;
  if (g.invalid.length) return `<span class="grounding warn">${icon("alert")}Cites missing source ${g.invalid.map(n => `[${n}]`).join(" ")}</span>`;
  if (!sources) return `<span class="grounding none">${icon("search")}Not found in your notes</span>`;
  if (g.generatedSection) return `<span class="grounding mixed">${icon("sparkles")}Notes + AI content (marked below)</span>`;
  if (g.uncited) return `<span class="grounding warn">${icon("alert")}No citations: check the sources</span>`;
  return `<span class="grounding ok">${icon("shield")}${done.answerMode === "claude" ? "Grounded in" : "Straight from"} your notes · ${g.cited.length} cited</span>`;
}

function assistantHead(message) {
  const meta = message.meta;
  if (!meta) return "";
  const done = message.done;
  const mode = done?.answerMode ?? meta.answerMode;
  const modeBadge = mode === "claude"
    ? `<span class="badge mode-claude">${icon("cpu")}${escapeHtml(prettyModel(done?.model ?? state.catalog?.model))}</span>`
    : `<span class="badge mode-notes">${icon("book")}Your notes</span>`;
  const intents = meta.intents.map(intent => {
    const [label, name] = INTENT_LABELS[intent] ?? [intent, "sparkles"];
    return `<span class="intent">${icon(name)}${escapeHtml(label)}</span>`;
  }).join("");
  const sources = meta.evidence.length ? `<button type="button" class="src-btn" data-sources>${icon("file")}${meta.evidence.length} source${meta.evidence.length === 1 ? "" : "s"}</button>` : "";
  return `${modeBadge}${intents}${confidenceHtml(meta.confidence)}${sources}`;
}

function assistantView(message, index) {
  const element = document.createElement("article");
  element.className = "msg assistant";
  element.dataset.index = String(index);
  element.innerHTML = `<div class="avatar bot-avatar"><svg aria-hidden="true"><use href="#i-logo"></use></svg></div>
    <div class="bubble">
      <header class="msg-head"></header>
      <div class="status-line" aria-live="polite"><span class="scanner"></span><span class="status-text">Searching your notes…</span></div>
      <div class="md"></div>
      <div class="notice" hidden></div>
      <footer class="msg-foot" hidden></footer>
      <div class="followups"></div>
    </div>`;
  updateAssistant(element, message, { final: Boolean(message.done || message.error) });
  return element;
}

function updateAssistant(element, message, { final, status } = {}) {
  const index = Number(element.dataset.index);
  element.querySelector(".msg-head").innerHTML = assistantHead(message);
  const statusLine = element.querySelector(".status-line");
  statusLine.hidden = final || (Boolean(message.content) && !status);
  if (status) statusLine.querySelector(".status-text").textContent = status;
  const body = element.querySelector(".md");
  renderMarkdown(body, message.content, { evidenceCount: message.meta?.evidence.length ?? 0, final, checks: message.checks ?? {} });
  element.classList.toggle("streaming", !final);
  if (!final && message.content) body.insertAdjacentHTML("beforeend", `<span class="caret"></span>`);

  const notice = element.querySelector(".notice");
  const noticeText = message.error ?? message.done?.notice;
  notice.hidden = !noticeText;
  if (noticeText) notice.innerHTML = `${icon("alert")}<span>${escapeHtml(noticeText)}</span>${message.error ? `<button type="button" class="ghost-btn" data-retry="${index}">${icon("refresh")}<span>Try again</span></button>` : ""}`;

  const foot = element.querySelector(".msg-foot");
  foot.hidden = !final || !message.done;
  if (final && message.done) {
    const usage = message.done.usage;
    foot.innerHTML = `${groundingHtml(message)}<span class="foot-actions">
      ${usage ? `<span class="usage" title="Tokens: input ${usage.inputTokens}, cached ${usage.cacheReadTokens}, output ${usage.outputTokens}">${icon("cpu")}${(usage.inputTokens + usage.cacheReadTokens + usage.outputTokens).toLocaleString()} tokens</span>` : ""}
      <button type="button" class="ghost-btn" data-copy-answer="${index}">${icon("copy")}<span>Copy</span></button>
      ${index === state.conversation.messages.length - 1 ? `<button type="button" class="ghost-btn" data-retry="${index}">${icon("refresh")}<span>Regenerate</span></button>` : ""}</span>`;
  }
  const followUps = element.querySelector(".followups");
  const chips = final && message.done ? message.done.followUps : [];
  followUps.innerHTML = chips.length ? `<span class="followups-label">${icon("sparkles")}Keep going</span>${chips.map(text => `<button type="button" class="chip followup" data-ask="${escapeHtml(text)}">${escapeHtml(text)}</button>`).join("")}` : "";
}

function renderThread() {
  const messages = state.conversation.messages;
  $("#chat-title").textContent = state.conversation.title;
  if (!messages.length) {
    renderWelcome();
    showSources(-1);
    return;
  }
  thread.innerHTML = "";
  messages.forEach((message, index) => thread.append(message.role === "user" ? userView(message) : assistantView(message, index)));
  const lastAssistant = messages.map((message, index) => (message.role === "assistant" ? index : -1)).filter(index => index >= 0).pop() ?? -1;
  showSources(lastAssistant);
  requestAnimationFrame(() => thread.scrollTo({ top: thread.scrollHeight }));
}

// ---------- Sources panel ----------

function showSources(index) {
  state.sourcesFor = index;
  const message = state.conversation.messages[index];
  const cards = $("#source-cards");
  const mapCard = $("#map-card");
  if (!message?.meta) {
    $("#sources-sub").textContent = "Ask a question to see where the answer comes from";
    mapCard.hidden = true;
    cards.innerHTML = `<div class="sources-empty">${icon("shield")}<p>Every answer lists the notes it used. Click a source to read it in full.</p></div>`;
    return;
  }
  const { evidence, confidence, searchedFor, query } = message.meta;
  $("#sources-sub").innerHTML = evidence.length
    ? `${evidence.length} found for “${escapeHtml(searchedFor)}”${searchedFor !== query ? ` <span class="ctx-tag" title="Your message was combined with the previous question">+ context</span>` : ""}`
    : "Nothing in your notes matched";
  mapCard.hidden = evidence.length < 2;
  $("#map").innerHTML = connectionMap(evidence, state.labels);
  const cited = new Set(message.done?.grounding.cited ?? []);
  cards.innerHTML = evidence.length
    ? evidence.map(item => `<article class="source-card ${KIND_CLASS[item.kind] ?? ""} ${cited.has(item.n) ? "is-cited" : ""}" data-n="${item.n}" data-entry="${escapeHtml(item.id)}" tabindex="0">
        <header><span class="source-n">${item.n}</span><span class="kind">${KIND_LABELS[item.kind] ?? escapeHtml(item.kind)}</span>${item.matchedBy === "name" ? `<span class="exact">exact match</span>` : ""}${cited.has(item.n) ? `<span class="cited-tag">${icon("check")}cited</span>` : ""}</header>
        <h3>${escapeHtml(item.question)}</h3>
        ${item.summary ? `<p>${escapeHtml(item.summary)}</p>` : ""}
        ${item.visuals[0] ? `<img class="source-thumb" src="${escapeHtml(item.visuals[0].url)}" alt="${escapeHtml(item.visuals[0].alt || item.question)}" loading="lazy">` : ""}
        <div class="source-tags">${item.topics.map(topic => `<span class="tag">${escapeHtml(topicLabel(topic))}</span>`).join("")}${item.codeLanguages.slice(0, 3).map(language => `<span class="tag code">${icon("code")}${escapeHtml(language)}</span>`).join("")}${item.visuals.length ? `<span class="tag">${icon("image")}${item.visuals.length}</span>` : ""}</div>
        ${item.relatedTopics?.length ? `<div class="skills"><span>${item.kind === "role" ? "Skills in your notes" : "Related topics"}</span>${item.relatedTopics.slice(0, 6).map(topic => `<button type="button" class="chip mini" data-ask="Prepare me for a ${escapeHtml(topicLabel(topic))} interview">${escapeHtml(topicLabel(topic))}</button>`).join("")}</div>` : ""}
        <footer><code title="${escapeHtml(item.path)}">${escapeHtml(item.path.split("/").pop())}:${item.startLine}${item.endLine > item.startLine ? `–${item.endLine}` : ""}</code><span class="open">${icon("eye")}Read</span></footer>
      </article>`).join("")
    : `<div class="sources-empty">${icon("search")}<p>No notes matched (${escapeHtml(confidence)} confidence). Try a topic from the sidebar.</p></div>`;
}

function highlightSource(n, scroll = true) {
  for (const element of document.querySelectorAll(".source-card.flash, .node-source.flash")) element.classList.remove("flash");
  const card = document.querySelector(`.source-card[data-n="${n}"]`);
  if (!card) return;
  card.classList.add("flash");
  document.querySelector(`.node-source[data-n="${n}"]`)?.classList.add("flash");
  if (scroll) card.scrollIntoView({ block: "nearest", behavior: "smooth" });
  setTimeout(() => card.classList.remove("flash"), 1600);
}

// ---------- Overlays ----------

function openOverlay(id) {
  for (const overlay of document.querySelectorAll(".overlay")) overlay.hidden = overlay.id !== id;
  document.body.classList.add("has-overlay");
}

function closeOverlays() {
  for (const overlay of document.querySelectorAll(".overlay")) overlay.hidden = true;
  document.body.classList.remove("has-overlay");
}

async function openEntry(id) {
  openOverlay("viewer");
  $("#viewer-title").textContent = "Loading…";
  $("#viewer-body").innerHTML = `<div class="skeleton-block"></div><div class="skeleton-block short"></div>`;
  $("#viewer-meta").innerHTML = "";
  $("#viewer-foot").innerHTML = "";
  try {
    const entry = await fetchEntry(id);
    $("#viewer-title").textContent = entry.question;
    $("#viewer-meta").innerHTML = `<span class="kind ${KIND_CLASS[entry.kind] ?? ""}">${KIND_LABELS[entry.kind] ?? escapeHtml(entry.kind)}</span>${entry.topics.map(topic => `<span class="tag">${escapeHtml(topicLabel(topic))}</span>`).join("")}<code>${escapeHtml(entry.path)}:${entry.startLine}–${entry.endLine}</code>`;
    const markdown = [entry.parent ? `> Follow-up to: **${entry.parent.question}**` : "", entry.section.length ? `_${entry.section.join(" › ")}_` : "", entry.prompt ?? "", entry.answer].filter(Boolean).join("\n\n");
    renderMarkdown($("#viewer-body"), markdown, { final: true });
    $("#viewer-foot").innerHTML = `${entry.followUps.length ? `<div class="viewer-follow"><span>Follow-ups</span>${entry.followUps.map(item => `<button type="button" class="chip" data-entry-open="${escapeHtml(item.id)}">${escapeHtml(item.question)}</button>`).join("")}</div>` : ""}
      <div class="viewer-actions"><button type="button" class="ghost-btn" data-copy-path="${escapeHtml(`${entry.path}:${entry.startLine}`)}">${icon("copy")}<span>Copy path</span></button><button type="button" class="primary-btn" data-ask="${escapeHtml(entry.question)}">${icon("message")}<span>Ask the tutor about this</span></button></div>`;
  } catch (error) {
    $("#viewer-title").textContent = "Could not open this source";
    $("#viewer-body").innerHTML = `<p>${escapeHtml(error.message)}</p>`;
  }
}

let paletteTimer = 0;
let paletteHits = [];
let paletteActive = 0;

function openPalette() {
  openOverlay("palette");
  const field = $("#palette-input");
  field.value = "";
  renderPaletteResults([], null);
  field.focus();
}

function renderPaletteResults(hits, result) {
  paletteHits = hits;
  paletteActive = 0;
  $("#palette-meta").innerHTML = result
    ? `${result.intents.map(intent => `<span class="intent">${escapeHtml(INTENT_LABELS[intent]?.[0] ?? intent)}</span>`).join("")}${confidenceHtml(result.confidence)}${result.corrections.length ? `<span class="tag">did you mean “${escapeHtml(result.corrections.map(c => c.to).join(" "))}”</span>` : ""}`
    : `<span class="palette-tip">Type a concept, a role or a term. Try “useEffect”, “SRE” or “kafka”.</span>`;
  $("#palette-results").innerHTML = hits.length
    ? hits.map((hit, i) => `<li class="palette-item ${i === 0 ? "active" : ""}" data-i="${i}" role="option"><span class="kind ${KIND_CLASS[hit.kind] ?? ""}">${KIND_LABELS[hit.kind] ?? escapeHtml(hit.kind)}</span><span class="palette-q">${escapeHtml(hit.question)}</span><span class="palette-topic">${escapeHtml(hit.topics.map(topicLabel).join(", "))}</span><button type="button" class="icon-btn" data-entry-open="${escapeHtml(hit.id)}" aria-label="Read source">${icon("eye")}</button></li>`).join("")
    : result ? `<li class="palette-empty">Nothing matched. Press Enter to ask the tutor anyway.</li>` : "";
}

function movePalette(delta) {
  if (!paletteHits.length) return;
  paletteActive = (paletteActive + delta + paletteHits.length) % paletteHits.length;
  for (const item of document.querySelectorAll(".palette-item")) item.classList.toggle("active", Number(item.dataset.i) === paletteActive);
  document.querySelector(".palette-item.active")?.scrollIntoView({ block: "nearest" });
}

// ---------- Slash commands ----------

function slashMatches() {
  const match = /^\/(\w*)$/.exec(input.value);
  return match ? COMMANDS.filter(command => command.name.startsWith(match[1].toLowerCase())) : [];
}

let slashActive = 0;
function renderSlashMenu() {
  const menu = $("#slash-menu");
  const matches = slashMatches();
  menu.hidden = !matches.length;
  slashActive = Math.min(slashActive, Math.max(matches.length - 1, 0));
  menu.innerHTML = matches.map((command, i) => `<button type="button" class="slash-item ${i === slashActive ? "active" : ""}" data-command="${command.name}" role="option"><code>/${command.name}</code><span class="slash-hint">${escapeHtml(command.hint)}</span><span class="slash-desc">${escapeHtml(command.desc)}</span></button>`).join("");
}

function completeSlash(name) {
  input.value = `/${name} `;
  $("#slash-menu").hidden = true;
  input.focus();
  autosize();
}

/** "/quiz java" → "Quiz me on java". Plain text passes through. */
function expandCommand(text) {
  const match = /^\/(\w+)\s*(.*)$/s.exec(text.trim());
  if (!match) return text.trim();
  const command = COMMANDS.find(item => item.name === match[1].toLowerCase());
  if (!command) return text.trim();
  const argument = match[2].trim() || (state.conversation.topic ? topicLabel(state.conversation.topic) : "");
  return argument ? command.text.replace("{}", argument) : command.text.replace(" {}", "").replace("{}", "this");
}

// ---------- Sending ----------

function historyFor(messages) {
  return messages
    .filter(message => message.content?.trim() && !message.error)
    .slice(-8)
    .map(message => ({ role: message.role, content: message.content.length > 6000 ? `${message.content.slice(0, 6000)}\n…` : message.content }));
}

async function send(rawText, { replaceFrom } = {}) {
  const text = expandCommand(rawText);
  if (!text || state.controller) return;
  const conversation = state.conversation;
  if (replaceFrom !== undefined) conversation.messages.splice(replaceFrom);
  const turns = historyFor(conversation.messages);
  if (!conversation.messages.length) {
    conversation.title = text.length > 60 ? `${text.slice(0, 57)}…` : text;
    thread.innerHTML = "";
  }
  $("#chat-title").textContent = conversation.title;
  const user = { role: "user", content: text };
  const assistant = { role: "assistant", content: "", meta: null, done: null, checks: {} };
  conversation.messages.push(user, assistant);
  const index = conversation.messages.length - 1;
  thread.append(userView(user));
  const view = assistantView(assistant, index);
  thread.append(view);
  input.value = "";
  autosize();
  scrollToBottom(true);

  const controller = new AbortController();
  state.controller = controller;
  setStreaming(true);
  let frame = 0;
  let status = "Searching your notes…";
  const paint = (final = false) => {
    frame = 0;
    updateAssistant(view, assistant, { final, status });
    scrollToBottom();
  };
  const schedule = () => {
    frame ||= requestAnimationFrame(() => paint());
  };

  try {
    await streamChat({ message: text, history: turns, topic: conversation.topic }, event => {
      if (event.type === "meta") {
        assistant.meta = event;
        const count = event.evidence.length;
        status = count ? `Found ${count} source${count === 1 ? "" : "s"} · ${event.answerMode === "claude" ? "writing a grounded answer…" : "assembling from your notes…"}` : "Nothing matched in your notes…";
        showSources(index);
        schedule();
      } else if (event.type === "status") {
        status = event.stage === "thinking" ? "Thinking it through…" : event.stage === "fallback" ? (event.message ?? "Switching to your notes…") : "Writing…";
        if (event.stage === "writing") status = "";
        schedule();
      } else if (event.type === "delta") {
        assistant.content += event.text;
        status = "";
        schedule();
      } else if (event.type === "done") {
        assistant.done = event;
      } else if (event.type === "error") {
        assistant.error = event.message;
      }
    }, controller.signal);
  } catch (error) {
    if (error.name === "AbortError") {
      assistant.error = assistant.content ? "Stopped." : "Stopped before an answer was written.";
    } else {
      assistant.error = error.message || "Something went wrong.";
    }
  } finally {
    if (frame) cancelAnimationFrame(frame);
    state.controller = null;
    setStreaming(false);
    if (!assistant.done && !assistant.error) assistant.error = "The answer ended unexpectedly.";
    paint(true);
    showSources(index);
    saveConversation(conversation);
    renderRecent();
    history.replaceState(null, "", `?c=${conversation.id}`);
  }
}

function loadConversation(id) {
  const stored = id ? getConversation(id) : null;
  state.conversation = stored ?? newConversation();
  topicFilter.value = state.conversation.topic ?? "";
  renderThread();
  renderRecent();
  history.replaceState(null, "", stored ? `?c=${stored.id}` : location.pathname);
}

function exportConversation() {
  const conversation = state.conversation;
  if (!conversation.messages.length) return toast("Nothing to download yet", "error");
  const lines = [`# ${conversation.title}`, ""];
  for (const message of conversation.messages) {
    if (message.role === "user") lines.push(`## You`, "", message.content, "");
    else {
      lines.push(`## Tutor`, "", message.content, "");
      if (message.meta?.evidence.length) lines.push("**Sources**", "", ...message.meta.evidence.map(item => `${item.n}. ${item.question} — \`${item.path}:${item.startLine}\``), "");
    }
  }
  const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${conversation.title.replace(/[^\w-]+/g, "-").slice(0, 50) || "chat"}.md`;
  link.click();
  URL.revokeObjectURL(link.href);
}

// ---------- Events ----------

document.addEventListener("click", event => {
  const target = event.target.closest("button, [data-entry], .node-source, img.md-img, .overlay");
  if (!target) return;

  if (target.classList.contains("overlay") && event.target === target) return closeOverlays();
  if (target.matches("img.md-img")) {
    $("#lightbox-img").src = target.src;
    $("#lightbox-img").alt = target.alt;
    return openOverlay("lightbox");
  }
  const action = target.dataset.action;
  if (action === "new-chat") return loadConversation(null), document.body.classList.remove("sidebar-open"), input.focus();
  if (action === "palette") return openPalette();
  if (action === "toggle-sources") return document.body.classList.toggle("sources-hidden");
  if (action === "open-sidebar") return document.body.classList.add("sidebar-open");
  if (action === "close-sidebar") return document.body.classList.remove("sidebar-open");
  if (action === "close-overlay") return closeOverlays();
  if (action === "export") return exportConversation();
  if (action === "slash") {
    input.value = "/";
    input.focus();
    return renderSlashMenu();
  }
  if (action === "surprise") {
    const pool = state.catalog.topics.flatMap(topic => topic.samples);
    return send(pool[Math.floor(Math.random() * pool.length)]);
  }
  if (target.dataset.ask) {
    closeOverlays();
    document.body.classList.remove("sidebar-open");
    return send(target.dataset.ask);
  }
  if (target.dataset.command) return completeSlash(target.dataset.command);
  if (target.dataset.open) return loadConversation(target.dataset.open), document.body.classList.remove("sidebar-open");
  if (target.dataset.delete) {
    deleteConversation(target.dataset.delete);
    if (target.dataset.delete === state.conversation.id) loadConversation(null);
    return renderRecent();
  }
  if (target.dataset.entryOpen) return openEntry(target.dataset.entryOpen);
  if (target.dataset.copyPath) return copyText(target.dataset.copyPath, "Path copied");
  if (target.matches("[data-copy]")) return copyText(target.closest(".code-block")?.querySelector("pre")?.innerText ?? "", "Code copied");
  if (target.dataset.copyAnswer) return copyText(markdownToText(state.conversation.messages[Number(target.dataset.copyAnswer)].content), "Answer copied");
  if (target.dataset.retry) {
    const at = Number(target.dataset.retry);
    const question = state.conversation.messages[at - 1]?.content;
    if (question) return send(question, { replaceFrom: at - 1 });
  }
  if (target.matches("[data-sources]")) {
    const index = Number(target.closest(".msg").dataset.index);
    showSources(index);
    return document.body.classList.remove("sources-hidden");
  }
  if (target.classList.contains("cite")) {
    const index = Number(target.closest(".msg")?.dataset.index);
    if (state.sourcesFor !== index) showSources(index);
    document.body.classList.remove("sources-hidden");
    return highlightSource(target.dataset.n);
  }
  if (target.classList.contains("node-source")) return highlightSource(target.dataset.n);
  if (target.dataset.entry && !event.target.closest("button")) return openEntry(target.dataset.entry);
});

document.addEventListener("change", event => {
  const box = event.target.closest("input[data-check]");
  if (!box) return;
  const view = box.closest(".msg");
  const index = Number(view?.dataset.index);
  const message = state.conversation.messages[index];
  if (!message) return;
  message.checks = { ...(message.checks ?? {}), [box.dataset.check]: box.checked };
  saveConversation(state.conversation);
  updateAssistant(view, message, { final: true });
});

document.addEventListener("mouseover", event => {
  const cite = event.target.closest(".cite");
  const node = event.target.closest(".node-source");
  if (cite || node) {
    const n = (cite ?? node).dataset.n;
    const index = Number(cite?.closest(".msg")?.dataset.index);
    if (!cite || index === state.sourcesFor) {
      document.querySelectorAll(".source-card").forEach(card => card.classList.toggle("hover", card.dataset.n === n));
      document.querySelectorAll(".node-source, .edge").forEach(item => item.classList.toggle("hover", item.dataset.n === n));
    }
  }
});
document.addEventListener("mouseout", event => {
  if (event.target.closest(".cite, .node-source")) document.querySelectorAll(".hover").forEach(item => item.classList.remove("hover"));
});

$("#composer").addEventListener("submit", event => {
  event.preventDefault();
  if (state.controller) return state.controller.abort();
  void send(input.value);
});

input.addEventListener("input", () => {
  autosize();
  slashActive = 0;
  renderSlashMenu();
});

input.addEventListener("keydown", event => {
  const menuOpen = !$("#slash-menu").hidden;
  if (menuOpen && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
    event.preventDefault();
    const count = slashMatches().length;
    slashActive = (slashActive + (event.key === "ArrowDown" ? 1 : -1) + count) % count;
    return renderSlashMenu();
  }
  if (menuOpen && (event.key === "Tab" || event.key === "Enter")) {
    event.preventDefault();
    return completeSlash(slashMatches()[slashActive].name);
  }
  if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
    event.preventDefault();
    $("#composer").requestSubmit();
  }
});

topicFilter.addEventListener("change", () => {
  state.conversation.topic = topicFilter.value || null;
  topicFilter.closest(".topic-filter").classList.toggle("active", Boolean(topicFilter.value));
  if (topicFilter.value) toast(`Answers limited to ${topicLabel(topicFilter.value)}`);
});

$("#palette-input").addEventListener("input", event => {
  clearTimeout(paletteTimer);
  const query = event.target.value.trim();
  if (!query) return renderPaletteResults([], null);
  paletteTimer = setTimeout(async () => {
    try {
      const result = await searchNotes(query, 10);
      if ($("#palette-input").value.trim() === query) renderPaletteResults(result.hits, result);
    } catch (error) {
      toast(error.message, "error");
    }
  }, 120);
});

$("#palette-input").addEventListener("keydown", event => {
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    return movePalette(event.key === "ArrowDown" ? 1 : -1);
  }
  if (event.key === "Enter") {
    event.preventDefault();
    const hit = paletteHits[paletteActive];
    if ((event.ctrlKey || event.metaKey) && hit) return openEntry(hit.id);
    const text = hit?.question ?? event.target.value.trim();
    if (!text) return;
    closeOverlays();
    void send(text);
  }
});

document.addEventListener("keydown", event => {
  const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName ?? "");
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    return openPalette();
  }
  if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === "o") {
    event.preventDefault();
    return loadConversation(null);
  }
  if (event.key === "Escape") {
    if (!$("#slash-menu").hidden) return ($("#slash-menu").hidden = true);
    if (document.body.classList.contains("has-overlay")) return closeOverlays();
    if (state.controller) return state.controller.abort();
  }
  if (event.key === "/" && !typing && !document.body.classList.contains("has-overlay")) {
    event.preventDefault();
    input.focus();
    input.value = "/";
    renderSlashMenu();
  }
  const card = document.activeElement?.closest?.(".source-card");
  if (event.key === "Enter" && card && !typing) openEntry(card.dataset.entry);
});

// ---------- Start ----------

async function start() {
  try {
    state.catalog = await fetchCatalog();
  } catch (error) {
    thread.innerHTML = `<div class="boot-error">${icon("alert")}<h2>Can't reach the tutor</h2><p>${escapeHtml(error.message)}</p><p>Start it with <code>npm run api</code> in <code>ai/runtime</code>.</p></div>`;
    $("#engine").innerHTML = `<i class="dot"></i><span>Offline</span>`;
    return;
  }
  state.labels = Object.fromEntries([...state.catalog.topics, ...state.catalog.atlas].map(topic => [topic.id, topic.label]));
  const params = new URLSearchParams(location.search);
  loadConversation(params.get("c"));
  if (params.get("topic")) {
    state.conversation.topic = params.get("topic");
    topicFilter.value = state.conversation.topic;
  }
  renderSidebar();
  if (matchMedia("(max-width: 1180px)").matches) document.body.classList.add("sources-hidden");
  if (params.get("q")) void send(params.get("q"));
  else input.focus();
}

void start();
