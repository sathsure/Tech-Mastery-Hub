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

const KIND_LABELS = { question: "Interview question", "follow-up": "Follow-up", note: "Note", role: "Role", term: "Term", roadmap: "Roadmap" };
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

const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Bring a question to the top of the view. Its answer then grows below it without moving the page,
 * so the reader starts at the beginning of the answer instead of chasing the end of it.
 */
function anchorToQuestion(questionElement, { smooth = true } = {}) {
  if (!questionElement) return;
  for (const old of thread.querySelectorAll(".msg.latest")) old.classList.remove("latest");
  questionElement.nextElementSibling?.classList.add("latest");
  thread.style.setProperty("--thread-h", `${thread.clientHeight}px`);
  const top = Math.max(questionElement.offsetTop - 16, 0);
  const near = Math.abs(top - thread.scrollTop) < thread.clientHeight * 1.5;
  thread.scrollTo({ top, behavior: smooth && near && !reducedMotion() ? "smooth" : "auto" });
}

/** "Jump to latest" appears only when the end of the answer is out of view. */
function updateJump() {
  const below = thread.scrollHeight - thread.scrollTop - thread.clientHeight;
  $("#jump").hidden = below < 120 || !state.conversation.messages.length;
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
  const { atlas } = state.catalog;
  // Names only, alphabetical: the sidebar is navigation, not statistics.
  const topics = [...state.catalog.topics].sort((a, b) => a.label.localeCompare(b.label));
  $("#topic-list").innerHTML = topics
    .map(topic => `<li><button type="button" class="nav-item" data-ask="Explore ${escapeHtml(topic.label)}"><span>${escapeHtml(topic.label)}</span></button></li>`)
    .join("");
  const atlasPrompts = { roadmaps: "Where do I start?", "it-roles": "What roles are there in IT?", "it-terminology": "What is SDLC?", "tech-stack": "What is Kafka used for?", "it-careers": "Career ladder" };
  $("#atlas-list").innerHTML = atlas
    .map(item => `<li><button type="button" class="nav-item" data-ask="${escapeHtml(atlasPrompts[item.id] ?? item.label)}"><span>${escapeHtml(item.label)}</span></button></li>`)
    .join("");
  topicFilter.innerHTML = `<option value="">All notes</option>` + [...topics, ...atlas].map(topic => `<option value="${escapeHtml(topic.id)}">${escapeHtml(topic.label)}</option>`).join("");
  topicFilter.value = state.conversation.topic ?? "";
  const engine = $("#engine");
  const claude = state.catalog.answerMode === "claude";
  engine.className = `engine ${claude ? "on" : "notes"}`;
  engine.innerHTML = `<i class="dot"></i><span>${claude ? escapeHtml(prettyModel(state.catalog.model)) : "Answers from your notes"}</span>`;
  renderRecent();
}

function renderRecent() {
  const list = listConversations();
  $("#recent-list").innerHTML = list.length
    ? list
        .map(item => `<li class="${item.id === state.conversation.id ? "active" : ""}"><button type="button" class="nav-item" data-open="${item.id}"><span>${escapeHtml(item.title)}</span></button><button type="button" class="recent-del" data-delete="${item.id}" aria-label="Delete chat">${icon("trash")}</button></li>`)
        .join("")
    : `<li class="recent-empty">No chats yet</li>`;
}

/** Remember which sidebar sections are open. */
function restoreSections() {
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem("tmh.sections") ?? "{}");
  } catch {
    saved = {};
  }
  for (const section of document.querySelectorAll("details[data-section]")) {
    if (section.dataset.section in saved) section.open = Boolean(saved[section.dataset.section]);
    section.addEventListener("toggle", () => {
      saved[section.dataset.section] = section.open;
      try {
        localStorage.setItem("tmh.sections", JSON.stringify(saved));
      } catch {
        // Not saved; the section still works.
      }
    });
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.querySelector(".theme-icon use")?.setAttribute("href", theme === "dark" ? "#i-sun" : "#i-moon");
}

function toggleTheme() {
  const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try {
    localStorage.setItem("tmh.theme", next);
  } catch {
    // Theme still switches for this visit.
  }
}

// ---------- Welcome ----------

function renderWelcome() {
  // Kept short on purpose: one line of context and a few ways in.
  const starters = ["How does the event loop work?", "Prepare me for a Java interview", "What does a DevOps engineer do?", "Where do I start?"];
  thread.innerHTML = `<div class="welcome">
    <h2>Ask about any topic in your notes</h2>
    <p>Interview questions, concepts, IT roles and learning roadmaps.</p>
    <div class="starters">${starters.map(q => `<button type="button" class="starter" data-ask="${escapeHtml(q)}"><span>${escapeHtml(q)}</span>${icon("arrow")}</button>`).join("")}</div>
  </div>`;
}

// ---------- Messages ----------

function userView(message) {
  const element = document.createElement("article");
  element.className = "msg user";
  element.innerHTML = `<div class="bubble"><p></p></div>`;
  element.querySelector("p").textContent = message.content;
  return element;
}

/** Shown only when something needs the reader's attention. */
function groundingHtml(message) {
  const done = message.done;
  if (!done) return "";
  const g = done.grounding;
  const sources = message.meta?.evidence.length ?? 0;
  if (g.invalid.length) return `<span class="grounding warn">${icon("alert")}Refers to a source that doesn't exist</span>`;
  if (!sources) return `<span class="grounding">${icon("info")}Not found in your notes</span>`;
  if (g.generatedSection) return `<span class="grounding mixed">${icon("info")}Includes information not from your notes</span>`;
  if (g.uncited) return `<span class="grounding warn">${icon("alert")}Check the sources for this answer</span>`;
  return `<span class="grounding ok">${icon("check")}From your notes</span>`;
}

function assistantHead(message) {
  const meta = message.meta;
  if (!meta) return "";
  const mode = message.done?.answerMode ?? meta.answerMode;
  const label = mode === "claude" ? prettyModel(message.done?.model ?? state.catalog?.model) : "From your notes";
  const sources = meta.evidence.length ? `<button type="button" class="src-btn" data-sources>${icon("file")}Sources</button>` : "";
  const weak = meta.confidence === "low" ? `<span class="match-note">Closest match</span>` : "";
  return `<span class="who"><svg aria-hidden="true"><use href="#i-logo"></use></svg>Tutor</span><span class="mode">${escapeHtml(label)}</span>${weak}${sources}`;
}

function assistantView(message, index) {
  const element = document.createElement("article");
  element.className = "msg assistant";
  element.dataset.index = String(index);
  element.innerHTML = `<div class="bubble">
      <header class="msg-head"></header>
      <div class="status-line" aria-live="polite"><span class="status-text">Searching your notes</span></div>
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
    foot.innerHTML = `${groundingHtml(message)}<span class="foot-actions">
      <button type="button" class="ghost-btn" data-copy-answer="${index}">${icon("copy")}<span>Copy</span></button>
      ${index === state.conversation.messages.length - 1 ? `<button type="button" class="ghost-btn" data-retry="${index}">${icon("refresh")}<span>Regenerate</span></button>` : ""}</span>`;
  }
  const followUps = element.querySelector(".followups");
  const chips = final && message.done ? message.done.followUps.slice(0, 3) : [];
  followUps.innerHTML = chips.length
    ? `<span class="followups-label">Related questions</span><div class="followup-list">${chips.map(text => `<button type="button" class="followup" data-ask="${escapeHtml(text)}"><span>${escapeHtml(text)}</span>${icon("arrow")}</button>`).join("")}</div>`
    : "";
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
  // Reopened chats show the last question at the top, with its answer below.
  const questions = thread.querySelectorAll(".msg.user");
  requestAnimationFrame(() => {
    anchorToQuestion(questions[questions.length - 1], { smooth: false });
    updateJump();
  });
}

// ---------- Sources panel ----------

function showSources(index) {
  state.sourcesFor = index;
  const message = state.conversation.messages[index];
  const cards = $("#source-cards");
  const mapCard = $("#map-card");
  if (!message?.meta) {
    $("#sources-sub").textContent = "Sources for each answer appear here.";
    mapCard.hidden = true;
    cards.innerHTML = "";
    return;
  }
  const { evidence } = message.meta;
  $("#sources-sub").textContent = evidence.length ? "Select a source to read it in full." : "No matching notes.";
  mapCard.hidden = evidence.length < 2;
  $("#map").innerHTML = connectionMap(evidence, state.labels);
  // Title, short summary and kind; file paths and match details are in the source view.
  cards.innerHTML = evidence
    .map(item => `<article class="source-card" data-n="${item.n}" data-entry="${escapeHtml(item.id)}" tabindex="0">
        <header><span class="source-n">${item.n}</span><span class="kind">${KIND_LABELS[item.kind] ?? escapeHtml(item.kind)}</span></header>
        <h3>${escapeHtml(item.question)}</h3>
        ${item.summary ? `<p>${escapeHtml(item.summary)}</p>` : ""}
        ${item.visuals[0] ? `<img class="source-thumb" src="${escapeHtml(item.visuals[0].url)}" alt="${escapeHtml(item.visuals[0].alt || item.question)}" loading="lazy">` : ""}
        ${item.kind === "role" && item.relatedTopics?.length ? `<div class="skills"><span>Skills to learn</span>${item.relatedTopics.slice(0, 5).map(topic => `<button type="button" class="chip mini" data-ask="Prepare me for a ${escapeHtml(topicLabel(topic))} interview">${escapeHtml(topicLabel(topic))}</button>`).join("")}</div>` : ""}
      </article>`)
    .join("");
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
  $("#palette-meta").innerHTML = result?.corrections.length ? `Showing results for “${escapeHtml(result.corrections.map(c => c.to).join(" "))}”` : "";
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
  const questionView = userView(user);
  thread.append(questionView);
  const view = assistantView(assistant, index);
  thread.append(view);
  input.value = "";
  autosize();
  anchorToQuestion(questionView);

  const controller = new AbortController();
  state.controller = controller;
  setStreaming(true);
  let frame = 0;
  let status = "Searching your notes";
  const paint = (final = false) => {
    frame = 0;
    updateAssistant(view, assistant, { final, status });
    updateJump();
  };
  const schedule = () => {
    frame ||= requestAnimationFrame(() => paint());
  };

  try {
    await streamChat({ message: text, history: turns, topic: conversation.topic }, event => {
      if (event.type === "meta") {
        assistant.meta = event;
        status = event.evidence.length ? "Preparing the answer" : "Checking your notes";
        showSources(index);
        schedule();
      } else if (event.type === "status") {
        status = event.stage === "thinking" ? "Thinking" : event.stage === "fallback" ? (event.message ?? "Using your notes") : "Writing";
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
  if (action === "theme") return toggleTheme();
  if (action === "jump") return thread.scrollTo({ top: thread.scrollHeight, behavior: reducedMotion() ? "auto" : "smooth" });
  if (action === "close-panels") {
    document.body.classList.remove("sidebar-open");
    if (matchMedia("(max-width: 1180px)").matches) document.body.classList.add("sources-hidden");
    return;
  }
  if (action === "open-sidebar") return document.body.classList.add("sidebar-open");
  if (action === "close-sidebar") return document.body.classList.remove("sidebar-open");
  if (action === "close-overlay") return closeOverlays();
  if (action === "export") return exportConversation();
  if (action === "slash") {
    input.value = "/";
    input.focus();
    return renderSlashMenu();
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

thread.addEventListener("scroll", () => updateJump(), { passive: true });
addEventListener("resize", () => {
  thread.style.setProperty("--thread-h", `${thread.clientHeight}px`);
  updateJump();
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
  applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");
  restoreSections();
  try {
    state.catalog = await fetchCatalog();
  } catch {
    thread.innerHTML = `<div class="boot-error">${icon("alert")}<h2>Couldn't load the tutor</h2><p>Refresh the page to try again.</p></div>`;
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
