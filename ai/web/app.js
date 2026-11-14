import { fetchCatalog, fetchEntry, searchNotes, streamChat, suggestQuestions } from "./api.js";
import { escapeHtml, icon, markdownToText, renderMarkdown, withCardsAsText } from "./render.js";
import { deleteConversation, getConversation, listConversations, newConversation, saveConversation } from "./store.js";
import { openZoom } from "./zoom.js";
import { enhanceScoring, isQuestionSet, refreshScoring, scorecardText } from "./scoring.js";

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
};

/**
 * Screens visited in this tab, kept in step with the browser's history: `at` is the current screen,
 * `max` the furthest one Forward can reach, `scroll` the scroll position each screen was left at.
 */
const nav = { at: 0, max: 0, scroll: {} };
const NAV_KEY = "tmh.nav";

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
  { name: "cheat-sheet", hint: "topic (optional)", text: "{} cheat sheet", bare: "Cheat sheets", desc: "Key concepts of a topic on one page" },
  { name: "quick-traps", hint: "topic (optional)", text: "{} quick traps", bare: "Quick traps", aliases: ["traps"], desc: "Tricky spots interviewers love, with the right answer" },
  { name: "one-liners", hint: "topic (optional)", text: "{} one-liners", bare: "One-liners", desc: "Top questions, each answered in one sentence" },
  { name: "vs", hint: "topic, or A vs B", text: "{} comparisons", bare: "Comparisons", pair: "Compare {}", desc: "Side-by-side “X vs Y” tables" },
  { name: "predict-output", hint: "topic (optional)", text: "{} predict the output", bare: "Predict the output", aliases: ["output"], desc: "What does this code print?" },
  { name: "code-snippets", hint: "topic (optional)", text: "{} code snippets", bare: "Code snippets", aliases: ["snippets"], desc: "Must-know code to write from memory" },
  { name: "explain-like-5", hint: "topic or concept", text: "Explain {} like I'm 5", bare: "Explain like I'm 5", aliases: ["eli5"], desc: "Hard ideas as everyday analogies" },
  { name: "revise", hint: "topics (optional)", text: "Revise {}", bare: "Revise", desc: "10 random flashcards; tap to check" },
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

/** GitHub page for a source, scrolled to its lines. */
function lineAnchor(item) {
  if (!item.startLine) return "";
  const end = item.endLine && item.endLine !== item.startLine ? `-L${item.endLine}` : "";
  return `#L${item.startLine}${end}`;
}

function sourceUrl(item) {
  if (!item?.path || !state.catalog?.github) return null;
  const path = item.path.split("/").map(encodeURIComponent).join("/");
  const lines = lineAnchor(item);
  // ?plain=1 shows Markdown as source, so the line anchor lands on the exact entry.
  const plain = /\.md$/i.test(item.path) && lines ? "?plain=1" : "";
  return `${state.catalog.github}${path}${plain}${lines}`;
}

// ---------- Back / Forward navigation ----------
// Every new question and every chat switch is a screen in the browser's history. Back and Forward
// (buttons, Alt+← / Alt+→, or the browser's own) return to a screen exactly as it was left: same chat,
// same scroll position, same open sections and ticked items, without asking anything again.

function loadNav() {
  try {
    Object.assign(nav, JSON.parse(sessionStorage.getItem(NAV_KEY) ?? "{}"));
  } catch {
    // Starts a fresh history; navigation still works.
  }
  nav.at = Number.isInteger(history.state?.tmh) ? history.state.tmh : 0;
  nav.max = Math.max(nav.max, nav.at);
}

function saveNav() {
  try {
    sessionStorage.setItem(NAV_KEY, JSON.stringify(nav));
  } catch {
    // Not saved; positions are kept for this page only.
  }
}

const screenUrl = id => (id ? `?c=${encodeURIComponent(id)}` : location.pathname);

/** Note where the current screen is scrolled to, so returning to it lands in the same place. */
function rememberScroll() {
  nav.scroll[nav.at] = thread.scrollTop;
  saveNav();
}

/** Start a new screen for chat `id`; screens ahead of the current one are dropped, as in a browser. */
function pushScreen(id) {
  rememberScroll();
  nav.at += 1;
  nav.max = nav.at;
  for (const key of Object.keys(nav.scroll)) if (Number(key) >= nav.at) delete nav.scroll[key];
  history.pushState({ tmh: nav.at, c: id }, "", screenUrl(id));
  saveNav();
  updateNavButtons();
}

/** Update the current screen's chat without adding a history entry. */
function replaceScreen(id) {
  history.replaceState({ tmh: nav.at, c: id }, "", screenUrl(id));
}

function updateNavButtons() {
  // A new, empty chat is a fresh start: no Back there (the browser's own Back still works).
  $("#back").hidden = nav.at <= 0 || !state.conversation?.messages.length;
  $("#forward").hidden = nav.at >= nav.max;
}

/** The browser moved to another screen (Back or Forward): show it as it was left. */
function showScreen(screen) {
  rememberScroll();
  nav.at = screen.tmh;
  saveNav();
  updateNavButtons();
  const top = nav.scroll[nav.at];
  if (screen.c === state.conversation.id) {
    if (top !== undefined) settleScroll(top);
    return;
  }
  // A different chat: stop any answer still being written there; it is saved as far as it got.
  if (state.controller) state.controller.abort();
  state.conversation = (screen.c && getConversation(screen.c)) || { ...newConversation(), ...(screen.c ? { id: screen.c } : {}) };
  topicFilter.value = state.conversation.topic ?? "";
  withTransition(() => {
    renderThread({ scrollTop: top });
    renderRecent();
  });
}

/** Scroll to `top` and keep it there while an earlier smooth scroll winds down. */
function settleScroll(top) {
  const apply = () => {
    // Only correct small drift; a large difference means the reader has scrolled since.
    if (Math.abs(thread.scrollTop - top) < 80) thread.scrollTo({ top, behavior: "instant" });
    updateJump();
  };
  thread.scrollTo({ top, behavior: "instant" });
  requestAnimationFrame(apply);
  setTimeout(apply, 250);
  setTimeout(apply, 600);
}

// The browser's history drives both buttons, so its own Back and Forward behave the same way.
function goBack() {
  if (nav.at > 0) history.back();
}

function goForward() {
  if (nav.at < nav.max) history.forward();
}

const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Run a DOM update as an animated page change (View Transitions API) where the browser supports it. */
function withTransition(update) {
  if (!document.startViewTransition || reducedMotion() || document.hidden) return update();
  document.startViewTransition(update);
}

/** Line icon for each sidebar item. */
const NAV_ICONS = {
  html: "code", css: "brush", javascript: "braces", typescript: "braces", react: "atom", angular: "hexagon", rxjs: "waves",
  nodejs: "server", java: "coffee", spring: "leaf", "spring-security": "lock", "spring-cloud": "cloud", microservices: "boxes",
  "rest-api": "plug", "database/sql": "database", devops: "infinity", aws: "cloud", "web-architecture": "network", "web-vitals": "gauge",
  dsa: "graduation", messaging: "route", ai: "sparkles",
  "system-design": "compass", "design-patterns": "puzzle", testing: "flask", git: "branch", caching: "zap", networking: "globe", behavioral: "users", salary: "wallet", "terraform": "boxes", "leadership": "compass", "python": "code",
  "linux": "terminal", "security": "lock", "observability": "eye", "agile": "refresh", "job-search": "target", "data-engineering": "filter",
  "it-roles": "briefcase", "it-terminology": "book", "tech-stack": "layers", "it-careers": "trend", roadmaps: "map",
};

/**
 * Bring a question to the top of the view. Its answer then grows below it without moving the page,
 * so the reader starts at the beginning of the answer instead of chasing the end of it.
 */
function anchorToQuestion(questionElement, { smooth = true } = {}) {
  if (!questionElement) return;
  following = false;
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
  $("#jump").hidden = following || below < 120 || !state.conversation.messages.length;
}

/**
 * "Jump to latest": go to the end and stay there while the answer is still being written or its
 * diagrams and images are still loading. A plain scroll would stop at the old end and leave the
 * reader short of it. Scrolling up yourself stops following.
 */
let following = false;
function jumpToLatest() {
  following = true;
  $("#jump").hidden = true;
  const started = performance.now();
  let height = 0;
  let steadySince = started;
  thread.scrollTo({ top: thread.scrollHeight, behavior: reducedMotion() ? "auto" : "smooth" });
  const step = now => {
    if (!following) return;
    if (thread.scrollHeight !== height) {
      height = thread.scrollHeight;
      steadySince = now;
    }
    // Let the smooth scroll run first, then keep pinned to the end as the content grows.
    const atEnd = thread.scrollHeight - thread.scrollTop - thread.clientHeight <= 2;
    if (now - started > 450 && !atEnd) thread.scrollTo({ top: thread.scrollHeight, behavior: "auto" });
    // Stop once the end is reached and stays put; a phone's fling can hold the scroll for a moment.
    if (!state.controller && now - steadySince > 900 && (atEnd || now - started > 4000)) return stopFollowing();
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function stopFollowing() {
  if (!following) return;
  following = false;
  updateJump();
}

function setStreaming(active) {
  document.body.classList.toggle("is-streaming", active);
  sendButton.innerHTML = icon(active ? "stop" : "send");
  sendButton.setAttribute("aria-label", active ? "Stop" : "Send");
  sendButton.classList.toggle("stop", active);
}

function autosize() {
  input.style.height = "auto";
  const ghostHeight = $("#ghost").hidden ? 0 : $("#ghost").scrollHeight;
  input.style.height = `${Math.min(Math.max(input.scrollHeight, ghostHeight), 220)}px`;
}

// ---------- Suggested next words (Tab or → to accept) ----------

/** Openings worth completing while typing. */
const STARTERS = [
  "Prepare interview questions for ",
  "Prepare a question set to interview a ",
  "Explain ",
  "What is the difference between ",
  "Roadmap to become a ",
  "Interview prep: ",
  "Quiz me on ",
  "Mock interview on ",
  "Where do I start?",
];

const suggest = { text: "", hits: [], query: "", timer: 0 };

/** Next steps offered by the latest answer ("Generate another set of these interview questions"). */
function latestFollowUps() {
  const last = [...state.conversation.messages].reverse().find(message => message.role === "assistant");
  return last?.done?.followUps ?? [];
}

/** The best completion of what is typed, or with nothing typed the latest answer's first next step. */
function pickSuggestion(typed) {
  if (activeMock(state.conversation.messages) || typed.startsWith("/") || typed.includes("\n")) return "";
  if (!typed.trim()) return latestFollowUps()[0] ?? "";
  if (typed.trim().length < 2) return "";
  const lower = typed.toLowerCase();
  const candidates = [...latestFollowUps(), ...suggest.hits, ...STARTERS];
  return candidates.find(text => text.length > typed.length && text.toLowerCase().startsWith(lower)) ?? "";
}

function renderSuggestion() {
  const typed = input.value;
  const text = state.controller ? "" : pickSuggestion(typed);
  suggest.text = text;
  const ghost = $("#ghost");
  ghost.hidden = !text;
  ghost.querySelector(".ghost-typed").textContent = typed;
  ghost.querySelector(".ghost-rest").textContent = text.slice(typed.length);
  // The ghost text replaces the placeholder while it shows.
  input.classList.toggle("has-ghost", Boolean(text));
  // Phones have no Tab or → key: a button takes the suggestion there.
  $("#suggest-use").hidden = !text;
  $("#ghost-hint").textContent = text ? `Suggestion: ${text}. Press Tab to use it.` : "";
  autosize();
}

/** Questions from the notes that start with what is typed; fetched shortly after typing stops. */
function fetchSuggestions() {
  clearTimeout(suggest.timer);
  const typed = input.value.trim();
  if (typed.length < 3 || typed.startsWith("/")) return;
  suggest.timer = setTimeout(async () => {
    try {
      const questions = await suggestQuestions(input.value);
      if (input.value.trim() !== typed) return;
      suggest.hits = questions;
      renderSuggestion();
    } catch {
      // No suggestions this time; typing still works.
    }
  }, 160);
}

/** Tab or → at the end of the text takes the suggestion. */
function acceptSuggestion() {
  if (!suggest.text) return false;
  input.value = suggest.text;
  input.setSelectionRange(input.value.length, input.value.length);
  renderSuggestion();
  return true;
}

// ---------- Sidebar ----------


function renderSidebar() {
  const { atlas } = state.catalog;
  // Names only, alphabetical: the sidebar is navigation, not statistics.
  const topics = [...state.catalog.topics].sort((a, b) => a.label.localeCompare(b.label));
  // Each item opens an overview: what the section covers, then its parts to pick from.
  const navItem = item => `<li><button type="button" class="nav-item" data-ask="${item.id === "roadmaps" ? "Roadmaps" : `Explore ${escapeHtml(item.label)}`}" data-overview="${item.id === "roadmaps" ? "roadmaps-hub" : escapeHtml(item.id)}" title="${escapeHtml(item.description ?? item.label)}">${icon(NAV_ICONS[item.id] ?? "book", "nav-ic")}<span>${escapeHtml(item.label)}</span></button></li>`;
  // The Career Atlas opens as its own page over the chat. The card shows it holds many sections
  // (roles, ladder, salary, tax, abroad, readiness test…), with an arrow for "opens a page".
  // The Career Atlas: styled like the section headings around it; the "open" icon says it goes to another page.
  $("#atlas-entry").innerHTML = `<button type="button" class="side-link" data-atlas="overview" title="Open the Career Atlas page">${icon("external", "side-link-ic")}<span>Career Atlas</span></button>`;
  // The learning roadmaps come next. The glossary lives in the Career Atlas only.
  const primary = ["roadmaps"].map(id => atlas.find(item => item.id === id)).filter(Boolean);
  $("#primary-list").innerHTML = primary.map(navItem).join("");
  $("#topic-list").innerHTML = topics.map(navItem).join("");
  topicFilter.innerHTML = `<option value="">All notes</option>` + [...topics, ...atlas.filter(item => item.id !== "it-terminology")].map(topic => `<option value="${escapeHtml(topic.id)}">${escapeHtml(topic.label)}</option>`).join("");
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
        .map(item => `<li class="${item.id === state.conversation.id ? "active" : ""}"><button type="button" class="nav-item" data-open="${escapeHtml(item.id)}">${icon("message", "nav-ic")}<span>${escapeHtml(item.title)}</span></button><button type="button" class="recent-del" data-delete="${escapeHtml(item.id)}" aria-label="Delete chat">${icon("trash")}<span class="del-confirm">Delete?</span></button></li>`)
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
  // Cross-fade the whole page between themes.
  document.documentElement.classList.add("theming");
  withTransition(() => applyTheme(next));
  setTimeout(() => document.documentElement.classList.remove("theming"), 600);
  try {
    localStorage.setItem("tmh.theme", next);
  } catch {
    // Theme still switches for this visit.
  }
}

// ---------- Career Atlas (same page) ----------
// The Atlas opens over the chat at /#atlas/<section>. The chat stays loaded underneath, so
// "Chat" in the Atlas (or the browser's Back) returns to the same conversation and scroll position.
const ATLAS_PAGE = "/atlas/IT_Roles_Terminology_Atlas.html";
const atlasView = $("#atlas-view");
const pageTitle = document.title;
let atlasFrame = null;
/** Marks the history entry openAtlas() created, so "Chat" can step back to the screen before it. */
let atlasToken = null;
let atlasReturnFocus = null;

/** The section in the address (#atlas/salary → "salary", #atlas → ""), or null when the Atlas is not open. */
function atlasSection() {
  const match = /^#atlas(?:\/(.*))?$/.exec(location.hash);
  return match ? decodeURIComponent(match[1] ?? "") : null;
}
const atlasUrl = section => `${location.pathname}${location.search}#atlas/${section}`;

function syncAtlasTheme() {
  const theme = document.documentElement.getAttribute("data-theme");
  try {
    localStorage.setItem("atlas-theme", theme);
    const root = atlasFrame?.contentDocument?.documentElement;
    if (root && root.dataset.theme !== theme) root.dataset.theme = theme;
  } catch {
    // The Atlas keeps its own theme.
  }
}

/** Opening or closing the Atlas: one quick cross-fade of the whole page. */
function atlasTransition(update) {
  if (!document.startViewTransition || reducedMotion() || document.hidden) return update();
  document.documentElement.classList.add("atlas-switch");
  document.startViewTransition(update).finished.finally(() => document.documentElement.classList.remove("atlas-switch"));
}

function showAtlas(section) {
  section = section || "overview";
  syncAtlasTheme();
  if (!atlasFrame) {
    atlasFrame = document.createElement("iframe");
    atlasFrame.className = "atlas-frame";
    atlasFrame.title = "Career Atlas";
    atlasFrame.src = `${ATLAS_PAGE}?embed=1#${section}`;
    atlasView.append(atlasFrame);
  } else {
    try {
      // replace(): changing sections must not add history entries of its own. The URL is absolute:
      // a bare "#x" would resolve against this page, not the Atlas.
      const frameLocation = atlasFrame.contentWindow.location;
      if (frameLocation.hash.slice(1) !== section) frameLocation.replace(`${ATLAS_PAGE}?embed=1#${section}`);
    } catch {
      atlasFrame.src = `${ATLAS_PAGE}?embed=1#${section}`;
    }
  }
  const reveal = () => {
    atlasView.hidden = false;
    document.body.classList.add("atlas-open");
    document.title = "Career Atlas · Tech-Mastery-Hub";
  };
  if (atlasView.hidden) {
    atlasReturnFocus = document.activeElement;
    atlasTransition(reveal);
  } else reveal();
  atlasFrame.focus();
}

function hideAtlas() {
  if (atlasView.hidden) return;
  atlasTransition(() => {
    atlasView.hidden = true;
    document.body.classList.remove("atlas-open");
    document.title = pageTitle;
  });
  (atlasReturnFocus?.isConnected ? atlasReturnFocus : input).focus();
}

/** Open the Atlas as a new screen in the browser's history. */
function openAtlas(section = "overview") {
  closeOverlays();
  closeSidebar();
  rememberScroll();
  atlasToken = `${Date.now()}`;
  history.pushState({ tmh: nav.at, c: history.state?.c ?? null, atlas: section, opened: atlasToken }, "", atlasUrl(section));
  // Screens ahead of this one are gone from the browser's history.
  nav.max = nav.at;
  saveNav();
  updateNavButtons();
  showAtlas(section);
}

/** "Chat" in the Atlas: step back to the chat screen it was opened from. */
function leaveAtlas() {
  // A new step for the chat (the Atlas pages you visited are steps of their own), so the browser's Back
  // returns to the Atlas page you left, then through the Atlas pages before it.
  hideAtlas();
  pushScreen(state.conversation.id);
}

addEventListener("message", event => {
  if (event.origin !== location.origin || !atlasFrame || event.source !== atlasFrame.contentWindow || event.data?.source !== "atlas") return;
  const { type } = event.data;
  if (type === "close") leaveAtlas();
  else if (type === "route" && !atlasView.hidden && typeof history.state?.atlas === "string") {
    const section = String(event.data.hash || "overview").slice(0, 200);
    if (section !== history.state.atlas) history.replaceState({ ...history.state, atlas: section }, "", atlasUrl(section));
  } else if (type === "theme" && (event.data.theme === "dark" || event.data.theme === "light") && event.data.theme !== document.documentElement.getAttribute("data-theme")) {
    applyTheme(event.data.theme);
    try {
      localStorage.setItem("tmh.theme", event.data.theme);
    } catch {
      // Theme still switches for this visit.
    }
  }
});

// Anything marked data-atlas="<section>" opens the Atlas here (Ctrl/⌘-click on a link still opens a new tab).
document.addEventListener("click", event => {
  const target = event.target.closest("[data-atlas]");
  if (!target || event.ctrlKey || event.metaKey || event.shiftKey) return;
  event.preventDefault();
  openAtlas(target.dataset.atlas || "overview");
});

// ---------- Welcome ----------

function renderWelcome() {
  // A short hero, four ways in, and a few starter questions.
  const features = [
    { icon: "layers", title: "Explore topics", text: "Frontend, backend, data, cloud and more: pick an area, then a topic.", ask: "Explore topics", overview: "topics" },
    { icon: "graduation", title: "Interview prep", text: "Model answers, key points and likely follow-ups.", ask: "Interview prep", overview: "interview-prep" },
    { icon: "map", title: "Roadmaps", text: "Follow a learning track, or get a full roadmap for a job role.", ask: "Roadmaps", overview: "roadmaps-hub" },
    { icon: "briefcase", title: "Career atlas", text: "IT roles, salaries in India and working abroad.", atlas: "overview" },
  ];
  const starters = ["How does the event loop work?", "What does a DevOps engineer do?", "How does HashMap work internally?", "Where do I start?"];
  thread.innerHTML = `<div class="welcome">
    <span class="hero-badge"><svg aria-hidden="true"><use href="#i-logo"></use></svg>Your notes, as a tutor</span>
    <h2>Learn faster. <em>Interview with confidence.</em></h2>
    <p>Answers come from your Tech-Mastery-Hub notes, with every source a click away on GitHub.</p>
    <div class="features">${features.map(item => `<button type="button" class="feature" ${item.atlas ? `data-atlas="${item.atlas}"` : `data-ask="${escapeHtml(item.ask)}"`} ${item.overview ? `data-overview="${item.overview}"` : ""}><span class="feature-ic">${icon(item.icon)}</span><b>${escapeHtml(item.title)}</b><span>${escapeHtml(item.text)}</span></button>`).join("")}</div>
    <p class="starters-label">Try asking</p>
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
  // Overviews and plans are built from the notes' structure; there is nothing to verify.
  if (["overview", "plan", "pick", "setup", "mock"].includes(done.view)) return "";
  const g = done.grounding;
  const sources = message.meta?.evidence.length ?? 0;
  if (g.invalid.length) return `<span class="grounding warn">${icon("alert")}Refers to a source that doesn't exist</span>`;
  if (!sources) return `<span class="grounding">${icon("info")}Not found in your notes</span>`;
  if (message.meta?.confidence === "low") return `<span class="grounding">${icon("info")}Not covered directly by your notes</span>`;
  if (g.generatedSection) return `<span class="grounding mixed">${icon("info")}Includes information not from your notes</span>`;
  if (g.uncited) return `<span class="grounding warn">${icon("alert")}Check the sources for this answer</span>`;
  // A normal answer from the notes needs no label.
  return "";
}

/** Only what helps: a link to the sources, and which AI model wrote the answer when one did. */
function assistantHead(message) {
  const meta = message.meta;
  if (!meta) return "";
  const mode = message.done?.answerMode ?? meta.answerMode;
  const model = mode === "claude" && message.done ? `<span class="mode">${escapeHtml(prettyModel(message.done.model ?? state.catalog?.model))}</span>` : "";
  // Sources opens the main source file on GitHub; each [n] chip opens its own.
  const top = meta.evidence[0];
  const url = sourceUrl(top);
  const sources = url ? `<a class="src-btn" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" title="${escapeHtml(`${top.path} — open on GitHub`)}">${icon("file")}Sources${icon("external")}</a>` : "";
  return `${model}${sources}`;
}

function assistantView(message, index) {
  const element = document.createElement("article");
  element.className = "msg assistant";
  element.dataset.index = String(index);
  element.innerHTML = `<div class="bubble">
      <header class="msg-head"></header>
      <div class="status-line" aria-live="polite"><span class="status-text">Searching your notes</span></div>
      <div class="skeleton" aria-hidden="true"><span></span><span></span><span class="short"></span></div>
      <div class="md"></div>
      <div class="notice" hidden></div>
      <footer class="msg-foot" hidden></footer>
      <div class="followups"></div>
    </div>`;
  updateAssistant(element, message, { final: Boolean(message.done || message.error) });
  return element;
}

/** Is this answer the interview-prep stack picker (not a roadmap checklist)? */
const isPrepPicker = message => message?.done?.view === "pick";
/** Is this answer the setup checklist for an interviewer's question set? */
const isSetSetup = message => message?.done?.view === "setup";
/** What kind of checklist an answer is: "set", "prep" or a learning roadmap (false). */
const checklistKind = message => (isSetSetup(message) ? "set" : isPrepPicker(message) ? "prep" : false);

/** Text of the plan bar for `picked` selected items. */
function planBarText(picked, prep = false) {
  if (prep === "set") return `${picked ? `${picked} selected.` : "Select the options for your interview."} The tutor will build a timed question set with expected answers.`;
  if (prep) {
    const lead = picked ? `${picked} selected.` : "Select the stacks your interview will cover.";
    return `${lead} The tutor will list the key questions to practise for each.`;
  }
  const lead = picked ? `${picked} selected.` : "Select the topics you want to learn.";
  return `${lead} The tutor will put them in the right order.`;
}

function planBarHtml(index, picked, prep = false) {
  const disabled = picked ? "" : "disabled";
  const label = prep === "set" ? "Build question set" : prep ? "Build my interview prep" : "Build my learning plan";
  return `<div class="plan-bar"><span>${planBarText(picked, prep)}</span><button type="button" class="btn btn-primary" data-plan="${index}" ${disabled}>${icon("list")}<span>${label}</span></button></div>`;
}

function renderAnswerBody(element, message, final, index) {
  const body = element.querySelector(".md");
  const evidence = message.meta?.evidence ?? [];
  const { tasks } = renderMarkdown(body, message.content, {
    evidenceCount: evidence.length,
    sourceUrl: n => sourceUrl(evidence[n - 1]),
    final,
    checks: message.checks ?? {},
    open: message.open ?? {},
  });
  element.classList.toggle("streaming", !final);
  if (!final && message.content) body.insertAdjacentHTML("beforeend", `<span class="caret"></span>`);
  // A checklist (roadmap or study path) can be turned into a learning plan.
  if (final && tasks && message.done?.view !== "plan") {
    // Count the ticked boxes on screen: some checklists arrive with options already ticked.
    const picked = body.querySelectorAll("input[data-check]:checked").length;
    body.insertAdjacentHTML("beforeend", planBarHtml(index, picked, checklistKind(message)));
  }
  // An interviewer's question set becomes a live scoring sheet.
  if (final && isQuestionSet(message)) enhanceScoring(body, message);
}

const retryButton = (index, label) =>
  `<button type="button" class="ghost-btn" data-retry="${index}">${icon("refresh")}<span>${label}</span></button>`;

function renderNotice(element, message, index) {
  const notice = element.querySelector(".notice");
  const noticeText = message.error ?? message.done?.notice;
  notice.hidden = !noticeText;
  if (!noticeText) return;
  const retry = message.error ? retryButton(index, "Try again") : "";
  notice.innerHTML = `${icon("alert")}<span>${escapeHtml(noticeText)}</span>${retry}`;
}

function renderFooter(element, message, final, index) {
  const foot = element.querySelector(".msg-foot");
  foot.hidden = !final || !message.done;
  if (foot.hidden) return;
  const isLast = index === state.conversation.messages.length - 1;
  const copy = `<button type="button" class="ghost-btn" data-copy-answer="${index}">${icon("copy")}<span>Copy</span></button>`;
  foot.innerHTML = `${groundingHtml(message)}<span class="foot-actions">${copy}${isLast ? retryButton(index, "Regenerate") : ""}</span>`;
}

function renderFollowUps(element, message, final) {
  const chips = final && message.done ? message.done.followUps.slice(0, 3) : [];
  const buttons = chips.map(text => `<button type="button" class="followup" data-ask="${escapeHtml(text)}"><span>${escapeHtml(text)}</span>${icon("arrow")}</button>`);
  element.querySelector(".followups").innerHTML = chips.length
    ? `<span class="followups-label">${message.done?.view === "mock" ? "Interview options" : "Related questions"}</span><div class="followup-list">${buttons.join("")}</div>`
    : "";
}

function updateAssistant(element, message, { final, status } = {}) {
  const index = Number(element.dataset.index);
  element.querySelector(".msg-head").innerHTML = assistantHead(message);
  const statusLine = element.querySelector(".status-line");
  statusLine.hidden = final || (Boolean(message.content) && !status);
  // Placeholder lines until the first words arrive.
  element.querySelector(".skeleton").hidden = final || Boolean(message.content);
  if (status) statusLine.querySelector(".status-text").textContent = status;
  renderAnswerBody(element, message, final, index);
  renderNotice(element, message, index);
  renderFooter(element, message, final, index);
  renderFollowUps(element, message, final);
}

/** Draw the whole chat. With `scrollTop`, return to that exact position (Back). */
function renderThread({ scrollTop } = {}) {
  const messages = state.conversation.messages;
  $("#chat-title").textContent = state.conversation.title;
  updateNavButtons();
  if (!messages.length) {
    renderWelcome();
    updateComposerHint();
    return;
  }
  thread.innerHTML = "";
  messages.forEach((message, index) => thread.append(message.role === "user" ? userView(message) : assistantView(message, index)));
  updateComposerHint();
  // Reopened chats show the last question at the top, with its answer below.
  const questions = thread.querySelectorAll(".msg.user");
  requestAnimationFrame(() => {
    anchorToQuestion(questions[questions.length - 1], { smooth: false });
    if (scrollTop !== undefined) settleScroll(scrollTop);
    updateJump();
  });
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
      <div class="viewer-actions">${sourceUrl(entry) ? `<a class="ghost-btn" href="${escapeHtml(sourceUrl(entry))}" target="_blank" rel="noopener noreferrer">${icon("external")}<span>Open on GitHub</span></a>` : ""}<button type="button" class="ghost-btn" data-copy-path="${escapeHtml(`${entry.path}:${entry.startLine}`)}">${icon("copy")}<span>Copy path</span></button><button type="button" class="primary-btn" data-ask="${escapeHtml(entry.question)}">${icon("message")}<span>Ask the tutor about this</span></button></div>`;
  } catch (error) {
    $("#viewer-title").textContent = "Could not open this source";
    $("#viewer-body").innerHTML = `<p>${escapeHtml(friendlyError(error.message))}</p>`;
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
  const emptyState = result ? `<li class="palette-empty">Nothing matched. Press Enter to ask the tutor anyway.</li>` : "";
  $("#palette-results").innerHTML = hits.length
    ? hits.map((hit, i) => `<li class="palette-item ${i === 0 ? "active" : ""}" data-i="${i}" role="option"><span class="kind ${KIND_CLASS[hit.kind] ?? ""}">${KIND_LABELS[hit.kind] ?? escapeHtml(hit.kind)}</span><span class="palette-q">${escapeHtml(hit.question)}</span><span class="palette-topic">${escapeHtml(hit.topics.map(topicLabel).join(", "))}</span><button type="button" class="icon-btn" data-entry-open="${escapeHtml(hit.id)}" aria-label="Read source">${icon("eye")}</button></li>`).join("")
    : emptyState;
}

function movePalette(delta) {
  if (!paletteHits.length) return;
  paletteActive = (paletteActive + delta + paletteHits.length) % paletteHits.length;
  for (const item of document.querySelectorAll(".palette-item")) item.classList.toggle("active", Number(item.dataset.i) === paletteActive);
  document.querySelector(".palette-item.active")?.scrollIntoView({ block: "nearest" });
}

// ---------- Slash commands ----------

function slashMatches() {
  const match = /^\/([\w-]*)$/.exec(input.value);
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
  const trimmed = text.trim();
  if (!trimmed.startsWith("/")) return trimmed;
  const space = trimmed.search(/\s/);
  const name = (space < 0 ? trimmed.slice(1) : trimmed.slice(1, space)).toLowerCase();
  const command = COMMANDS.find(item => item.name === name || item.name.replace(/-/g, "") === name || item.aliases?.includes(name));
  if (!command) return trimmed;
  const typed = space < 0 ? "" : trimmed.slice(space).trim();
  // Commands with a list of their own ("/cheat-sheet") show that list when no argument is typed.
  if (!typed && command.bare) return command.bare;
  // "/vs let vs var" compares that pair; "/vs java" opens the topic's comparison tables.
  if (typed && command.pair && /\s(?:vs\.?|versus)\s/i.test(typed)) return command.pair.replace("{}", typed);
  const argument = typed || (state.conversation.topic ? topicLabel(state.conversation.topic) : "");
  return argument ? command.text.replace("{}", argument) : command.text.replace(" {}", "").replace("{}", "this");
}

// ---------- Sending ----------

function historyFor(messages) {
  return messages
    .filter(message => message.content?.trim() && !message.error)
    .slice(-8)
    .map(message => {
      // Cards travel as their plain-text summary: the tutor needs the facts, not the card data.
      const content = withCardsAsText(message.content);
      return { role: message.role, content: content.length > 6000 ? `${content.slice(0, 6000)}\n…` : content };
    });
}

/** Status line for a "status" event: thinking, a fallback notice, or nothing once writing starts. */
function statusText(event) {
  if (event.stage === "thinking") return "Thinking";
  if (event.stage === "fallback") return event.message ?? "Using your notes";
  return "";
}

/** Applies one stream event to the answer; returns the new status line, or undefined to leave it. */
function applyEvent(assistant, event) {
  switch (event.type) {
    case "meta":
      assistant.meta = event;
      return event.evidence.length ? "Preparing the answer" : "Checking your notes";
    case "status":
      return statusText(event);
    case "delta":
      assistant.content += event.text;
      return "";
    case "done":
      assistant.done = event;
      return undefined;
    case "error":
      assistant.error = friendlyError(event.message);
      return undefined;
    default:
      return undefined;
  }
}

/** Short, friendly text for a failure; technical details stay out of the chat. */
function friendlyError(message) {
  const text = String(message ?? "");
  if (/failed to fetch|networkerror|load failed|network/i.test(text)) return "Couldn't reach the tutor. Check your connection and try again.";
  if (/429|too many/i.test(text)) return "Too many questions at once. Wait a minute, then try again.";
  if (/timeout|timed out/i.test(text)) return "The answer took too long. Try again.";
  // Server messages are already written for people; anything long or code-like is not.
  if (text && text.length <= 160 && !/\bat \S+:\d+|Error:|\{|\}/.test(text)) return text;
  return "Something went wrong while answering. Try again.";
}

function failureMessage(error, assistant) {
  if (error.name !== "AbortError") return friendlyError(error.message);
  return assistant.content ? "Stopped." : "Stopped before an answer was written.";
}

/**
 * Ask a question. options: replaceFrom (regenerate from this message), plan (items picked from a
 * checklist), overview (a topic id from the sidebar).
 */
async function send(rawText, { replaceFrom, plan, overview, mock } = {}) {
  const text = expandCommand(rawText);
  if (!text) return;
  // One answer at a time: a second click or Enter while answering does not send again.
  if (state.controller) return toast("Wait for this answer to finish, or press Stop");
  const conversation = state.conversation;
  // During a mock interview, the next message is the answer to its current question.
  if (replaceFrom === undefined && !plan && !overview) mock = activeMock(conversation.messages);
  // A new question is a new screen; Back returns to the answer you were reading.
  if (replaceFrom === undefined && conversation.messages.length) pushScreen(conversation.id);
  if (replaceFrom !== undefined) conversation.messages.splice(replaceFrom);
  const turns = historyFor(conversation.messages);
  if (!conversation.messages.length) {
    conversation.title = text.length > 60 ? `${text.slice(0, 57)}…` : text;
    thread.innerHTML = "";
  }
  $("#chat-title").textContent = conversation.title;
  const user = { role: "user", content: text, ...(plan ? { plan } : {}), ...(overview ? { overview } : {}), ...(mock ? { mock } : {}) };
  const assistant = { role: "assistant", content: "", meta: null, done: null, checks: {} };
  conversation.messages.push(user, assistant);
  updateNavButtons();
  const index = conversation.messages.length - 1;
  const questionView = userView(user);
  questionView.classList.add("enter");
  thread.append(questionView);
  const view = assistantView(assistant, index);
  view.classList.add("enter");
  thread.append(view);
  input.value = "";
  suggest.hits = [];
  renderSuggestion();
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
    const request = { message: text, history: turns, topic: conversation.topic, plan, overview, ...(mock ? { mock } : {}) };
    await streamChat(request, event => {
      const next = applyEvent(assistant, event);
      if (next === undefined) return;
      status = next;
      schedule();
    }, controller.signal);
  } catch (error) {
    assistant.error = failureMessage(error, assistant);
  } finally {
    if (frame) cancelAnimationFrame(frame);
    state.controller = null;
    setStreaming(false);
    if (!assistant.done && !assistant.error) assistant.error = "The answer ended unexpectedly.";
    paint(true);
    saveConversation(conversation);
    renderRecent();
    // Only if the reader is still on this chat (Back may have taken them to another one).
    if (state.conversation === conversation) replaceScreen(conversation.id);
    updateComposerHint();
  }
}

/** The mock interview still waiting for an answer in this chat, if any. */
function activeMock(messages) {
  const last = [...messages].reverse().find(message => message.role === "assistant");
  const mock = last?.done?.mock;
  return mock && mock.index < mock.ids.length ? mock : undefined;
}

/** The composer says when the next message is an interview answer. */
function updateComposerHint() {
  const mock = activeMock(state.conversation.messages);
  queueMicrotask(renderSuggestion);
  input.placeholder = mock ? `Your answer to question ${mock.index + 1} of ${mock.ids.length}… (Shift+Enter for a new line)` : "Ask a question…";
}

/** Open a saved chat (or a new one). `animate: false` at startup, where later code needs the DOM at once. */
function loadConversation(id, { animate = true, remember = true } = {}) {
  const stored = id ? getConversation(id) : null;
  const next = stored ?? newConversation();
  // Leaving a chat that has messages is a new screen; an empty chat is simply replaced.
  const push = remember && next.id !== state.conversation.id && state.conversation.messages.length > 0;
  if (push) pushScreen(next.id);
  state.conversation = next;
  topicFilter.value = state.conversation.topic ?? "";
  const draw = () => {
    renderThread();
    renderRecent();
  };
  if (animate) withTransition(draw);
  else draw();
  if (!push) replaceScreen(stored ? stored.id : null);
}

function exportConversation() {
  const conversation = state.conversation;
  if (!conversation.messages.length) return toast("Nothing to download yet", "error");
  const lines = [`# ${conversation.title}`, ""];
  for (const message of conversation.messages) {
    if (message.role === "user") lines.push(`## You`, "", message.content, "");
    else {
      lines.push(`## Tutor`, "", withCardsAsText(message.content), "");
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

const closeSidebar = () => document.body.classList.remove("sidebar-open");

/** Buttons with data-action="...". */
const ACTIONS = {
  "new-chat": () => {
    loadConversation(null);
    closeSidebar();
    input.focus();
  },
  palette: () => openPalette(),
  back: () => goBack(),
  forward: () => goForward(),
  reload: () => location.reload(),
  theme: () => toggleTheme(),
  jump: () => jumpToLatest(),
  "use-suggestion": () => {
    acceptSuggestion();
    input.focus();
  },
  "close-panels": closeSidebar,
  "open-sidebar": () => document.body.classList.add("sidebar-open"),
  "close-sidebar": closeSidebar,
  "close-overlay": () => closeOverlays(),
  export: () => exportConversation(),
  slash: () => {
    input.value = "/";
    input.focus();
    renderSlashMenu();
  },
};

/**
 * Touch screens have no hover to reveal the trash icon on purpose, so it is always shown there and
 * the first tap only asks "Delete?"; a second tap deletes. A mouse click deletes at once.
 */
function confirmDelete(id, button) {
  if (matchMedia("(hover: hover)").matches || button.classList.contains("armed")) return deleteChat(id);
  for (const other of document.querySelectorAll(".recent-del.armed")) other.classList.remove("armed");
  button.classList.add("armed");
  setTimeout(() => button.classList.remove("armed"), 3000);
}

function deleteChat(id) {
  deleteConversation(id);
  if (id === state.conversation.id) loadConversation(null);
  renderRecent();
}

function retryAnswer(value) {
  const at = Number(value);
  const question = state.conversation.messages[at - 1];
  if (question?.content) send(question.content, { replaceFrom: at - 1, plan: question.plan, overview: question.overview, mock: question.mock });
}

/** Buttons identified by a data attribute, checked in this order: [dataset key, handler(value, button)]. */
const DATA_HANDLERS = [
  [
    "ask",
    (value, target) => {
      closeOverlays();
      closeSidebar();
      send(value, { overview: target.dataset.overview });
    },
  ],
  ["plan", value => submitPlan(Number(value))],
  ["command", value => completeSlash(value)],
  [
    "open",
    value => {
      loadConversation(value);
      closeSidebar();
    },
  ],
  ["delete", (value, target) => confirmDelete(value, target)],
  ["entryOpen", value => openEntry(value)],
  ["copyPath", value => copyText(value, "Path copied")],
  ["copy", (_, target) => copyText(target.closest(".code-block")?.querySelector("pre")?.innerText ?? "", "Code copied")],
  ["copyAnswer", value => copyText(markdownToText(state.conversation.messages[Number(value)].content), "Answer copied")],
  ["retry", value => retryAnswer(value)],
];

document.addEventListener("click", event => {
  const target = event.target.closest("button, img.md-img, .diagram-svg, .overlay");
  if (!target || target.closest("#lightbox")) return;
  if (target.classList.contains("overlay")) {
    if (event.target === target) closeOverlays();
    return;
  }
  if (target.matches("img.md-img, .diagram-svg")) {
    // An image inside a link should zoom, not navigate away.
    event.preventDefault();
    return openZoom(target);
  }
  const action = ACTIONS[target.dataset.action];
  if (action) return action();
  const handler = DATA_HANDLERS.find(([key]) => target.dataset[key] !== undefined);
  if (handler) handler[1](target.dataset[handler[0]], target);
});

/** Turn the ticked checklist items of one answer into a learning plan. */
function submitPlan(index) {
  const view = thread.querySelector(`.msg.assistant[data-index="${index}"]`);
  const message = state.conversation.messages[index];
  if (!view || !message) return;
  const items = [...view.querySelectorAll("input[data-check]:checked")].map(box => ({ label: box.dataset.label || "Item", ...(box.dataset.topic ? { topic: box.dataset.topic } : {}) }));
  if (!items.length) return toast("Select at least one topic first", "error");
  // The roadmap's own title ("Roadmap: Forward Deployed Engineer"), else the answer's first heading.
  const title = message.meta?.evidence[0]?.kind === "roadmap" ? message.meta.evidence[0].question : (view.querySelector(".md h1, .md h2, .md strong")?.textContent ?? "").trim();
  const names = items.map(item => item.label);
  const kind = checklistKind(message);
  const list = `${names.slice(0, 6).join(", ")}${names.length > 6 ? ` and ${names.length - 6} more` : ""}`;
  const text = kind === "set" ? `Build the interview question set: ${list}` : kind ? `Build my interview prep: ${list}` : `Build my learning plan: ${list}`;
  const plan = { title: title.slice(0, 200), items: items.slice(0, 60).map(item => ({ ...item, label: item.label.slice(0, 200) })), ...(kind === "set" ? { kind: "question-set" } : kind ? { kind: "interview" } : {}) };
  send(text, { plan });
}

// Overview sections remember whether they are open, so Back and reloads show them as you left them.
document.addEventListener(
  "toggle",
  event => {
    const details = event.target;
    if (!(details instanceof HTMLDetailsElement) || !details.matches("details.outline")) return;
    const message = state.conversation.messages[Number(details.closest(".msg")?.dataset.index)];
    if (!message) return;
    message.open = { ...(message.open ?? {}), [details.dataset.outline]: details.open };
    saveConversation(state.conversation);
  },
  true,
);

addEventListener("popstate", event => {
  if (typeof event.state?.atlas === "string") return showAtlas(event.state.atlas);
  // A typed or clicked /#atlas/<section> on this page: make it an Atlas screen.
  const section = atlasSection();
  if (section !== null) {
    history.replaceState({ ...(event.state ?? { tmh: nav.at }), atlas: section || "overview" }, "", atlasUrl(section || "overview"));
    return showAtlas(section || "overview");
  }
  hideAtlas();
  if (Number.isInteger(event.state?.tmh)) showScreen(event.state);
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
  // Update the plan bar in place: redrawing the answer would move the page under the reader.
  const bar = view.querySelector(".plan-bar");
  if (bar) {
    const picked = view.querySelectorAll("input[data-check]:checked").length;
    bar.querySelector("span").textContent = planBarText(picked, checklistKind(message));
    bar.querySelector("[data-plan]").disabled = !picked;
  }
});


$("#composer").addEventListener("submit", event => {
  event.preventDefault();
  if (state.controller) return state.controller.abort();
  send(input.value);
});

input.addEventListener("input", () => {
  slashActive = 0;
  renderSlashMenu();
  renderSuggestion();
  fetchSuggestions();
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
    const picked = slashMatches()[slashActive];
    // "/cheat-sheet" typed in full + Enter: open its topic list straight away.
    if (event.key === "Enter" && picked.bare && input.value.slice(1).toLowerCase() === picked.name) {
      $("#slash-menu").hidden = true;
      return $("#composer").requestSubmit();
    }
    return completeSlash(picked.name);
  }
  const atEnd = input.selectionStart === input.value.length && input.selectionEnd === input.value.length;
  if (suggest.text && !event.shiftKey && !event.ctrlKey && !event.altKey && (event.key === "Tab" || (event.key === "ArrowRight" && atEnd))) {
    event.preventDefault();
    return acceptSuggestion();
  }
  if (event.key === "Escape" && suggest.text) {
    suggest.text = "";
    $("#ghost").hidden = true;
    return;
  }
  if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
    event.preventDefault();
    $("#composer").requestSubmit();
  }
});

// Scrolling up yourself ends "Jump to latest" following the answer.
thread.addEventListener("wheel", event => event.deltaY < 0 && stopFollowing(), { passive: true });
thread.addEventListener("touchstart", stopFollowing, { passive: true });
thread.addEventListener("pointerdown", stopFollowing, { passive: true });
thread.addEventListener("keydown", event => ["ArrowUp", "PageUp", "Home"].includes(event.key) && stopFollowing());

let scrollSaveTimer = 0;
thread.addEventListener(
  "scroll",
  () => {
    updateJump();
    // Keep this screen's position, so Back / Forward and reloads return to it.
    nav.scroll[nav.at] = thread.scrollTop;
    clearTimeout(scrollSaveTimer);
    scrollSaveTimer = setTimeout(saveNav, 300);
  },
  { passive: true },
);
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
      toast(friendlyError(error.message), "error");
    }
  }, 120);
});

// Clicking a result asks it, like Enter; the eye button on the row opens the source instead.
$("#palette-results").addEventListener("click", event => {
  if (event.target.closest("[data-entry-open]")) return;
  const item = event.target.closest(".palette-item");
  const hit = item ? paletteHits[Number(item.dataset.i)] : null;
  const text = hit?.question ?? (event.target.closest(".palette-empty") ? $("#palette-input").value.trim() : "");
  if (!text) return;
  closeOverlays();
  send(text);
});
// The row under the mouse is the one Enter would open.
$("#palette-results").addEventListener("mousemove", event => {
  const item = event.target.closest(".palette-item");
  if (!item || Number(item.dataset.i) === paletteActive) return;
  movePalette(Number(item.dataset.i) - paletteActive);
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
    send(text);
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
    if (!$("#slash-menu").hidden) {
      $("#slash-menu").hidden = true;
      return;
    }
    if (document.body.classList.contains("has-overlay")) return closeOverlays();
    if (state.controller) return state.controller.abort();
  }
  if (event.key === "/" && !typing && !document.body.classList.contains("has-overlay")) {
    event.preventDefault();
    input.focus();
    input.value = "/";
    renderSlashMenu();
  }
  if (!typing) historyKey(event);
});

/** Alt+← / Alt+→ move Back and Forward, like the browser. */
const HISTORY_KEYS = { ArrowLeft: () => goBack(), ArrowRight: () => goForward() };
function historyKey(event) {
  const move = event.altKey ? HISTORY_KEYS[event.key] : undefined;
  if (!move) return;
  event.preventDefault();
  move();
}

// ---------- Start ----------

async function start() {
  applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");
  restoreSections();
  try {
    state.catalog = await fetchCatalog();
  } catch {
    thread.innerHTML = `<div class="boot-error">${icon("alert")}<h2>Couldn't reach the tutor</h2><p>Check your connection, then try again.</p><button type="button" class="btn btn-primary" data-action="reload">${icon("refresh")}<span>Try again</span></button></div>`;
    $("#engine").innerHTML = `<i class="dot"></i><span>Offline</span>`;
    return;
  }
  state.labels = Object.fromEntries([...state.catalog.topics, ...state.catalog.atlas].map(topic => [topic.id, topic.label]));
  const params = new URLSearchParams(location.search);
  // Read before loading the chat: that resets the address for the chat and would drop #atlas/<section>.
  const section = atlasSection();
  loadNav();
  loadConversation(params.get("c"), { animate: false, remember: false });
  // After a reload, return to where this screen was scrolled.
  const top = nav.scroll[nav.at];
  if (top !== undefined && state.conversation.messages.length) requestAnimationFrame(() => settleScroll(top));
  if (params.get("topic")) {
    state.conversation.topic = params.get("topic");
    topicFilter.value = state.conversation.topic;
  }
  renderSidebar();
  updateNavButtons();
  if (section !== null) {
    history.replaceState({ ...(history.state ?? { tmh: nav.at }), atlas: section || "overview" }, "", atlasUrl(section || "overview"));
    showAtlas(section || "overview");
  } else if (params.get("q")) send(params.get("q"));
  else input.focus();
}

start();

// ---------- Interview scoring sheet ----------

/** The message and answer body an element of a scoring sheet belongs to. */
function scoringContext(element) {
  const view = element.closest(".msg.assistant");
  const message = state.conversation.messages[Number(view?.dataset.index)];
  return view && message ? { view, message, body: view.querySelector(".md") } : null;
}

document.addEventListener("click", event => {
  const target = event.target.closest("[data-score], [data-score-copy], [data-score-print], [data-score-clear]");
  if (!target) return;
  const context = scoringContext(target);
  if (!context) return;
  const { view, message, body } = context;
  if (target.dataset.score) {
    const n = target.dataset.score;
    const value = Number(target.dataset.value);
    const scores = { ...(message.scores ?? {}) };
    // Clicking the chosen score again clears it.
    scores[n] = { ...(scores[n] ?? {}), s: scores[n]?.s === value ? null : value };
    message.scores = scores;
    saveConversation(state.conversation);
    refreshScoring(body, message, n);
  } else if (target.dataset.scoreCopy !== undefined) {
    copyText(scorecardText(body, message), "Scorecard copied");
  } else if (target.dataset.scorePrint !== undefined) {
    document.body.classList.add("print-one");
    view.classList.add("print-target");
    const done = () => { document.body.classList.remove("print-one"); view.classList.remove("print-target"); removeEventListener("afterprint", done); };
    addEventListener("afterprint", done);
    print();
  } else if (target.dataset.scoreClear !== undefined) {
    if (!confirm("Clear all scores and notes for this question set?")) return;
    message.scores = {};
    saveConversation(state.conversation);
    updateAssistant(view, message, { final: true });
  }
});

document.addEventListener("input", event => {
  const field = event.target.closest("[data-score-note], [data-score-candidate]");
  if (!field) return;
  const context = scoringContext(field);
  if (!context) return;
  const scores = { ...(context.message.scores ?? {}) };
  if (field.dataset.scoreNote) scores[field.dataset.scoreNote] = { ...(scores[field.dataset.scoreNote] ?? {}), note: field.value };
  else scores._candidate = field.value;
  context.message.scores = scores;
  saveConversation(state.conversation);
});
