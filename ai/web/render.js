// Markdown → safe HTML, plus the extras the tutor uses: citation chips, code blocks with copy,
// interactive checklists, the "Beyond your notes" callout, scrollable tables and Mermaid diagrams.
import { marked } from "/vendor/marked.js";
import DOMPurify from "/vendor/purify.js";
import hljs from "/vendor/highlight.js";

marked.setOptions({ gfm: true, breaks: false });

export const GENERATED_HEADING = "Beyond your notes";

export function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
}

export function icon(name, extra = "") {
  return `<svg class="icon ${extra}" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
}

function highlight(code, language) {
  try {
    if (language && hljs.getLanguage(language)) return hljs.highlight(code, { language, ignoreIllegals: true }).value;
    if (code.length < 4000) return hljs.highlightAuto(code).value;
  } catch {
    // Fall through to plain text.
  }
  return escapeHtml(code);
}

function enhanceCode(root, { final }) {
  for (const pre of root.querySelectorAll("pre")) {
    const code = pre.querySelector("code");
    if (!code || pre.parentElement?.classList.contains("code-block")) continue;
    const language = ([...code.classList].find(name => name.startsWith("language-")) ?? "").slice(9).toLowerCase();
    const text = code.textContent ?? "";
    if (language === "tmh-cards") {
      pre.replaceWith(cardsElement(text, final));
      continue;
    }
    if (language === "mermaid") {
      const holder = document.createElement("figure");
      holder.className = "diagram";
      if (final) {
        holder.dataset.mermaid = text;
        holder.innerHTML = `<div class="diagram-loading">Loading diagram</div>`;
      } else {
        holder.innerHTML = `<div class="diagram-loading">Diagram appears when the answer is complete</div>`;
      }
      pre.replaceWith(holder);
      continue;
    }
    code.innerHTML = highlight(text, language);
    code.classList.add("hljs");
    const wrapper = document.createElement("div");
    wrapper.className = "code-block";
    wrapper.innerHTML = `<div class="code-head"><span class="code-lang">${icon("terminal")}${escapeHtml(language || "code")}</span><button type="button" class="ghost-btn copy-code" data-copy>${icon("copy")}<span>Copy</span></button></div>`;
    pre.replaceWith(wrapper);
    wrapper.append(pre);
  }
}

// ---------- Cards ----------
// Answers about roles, countries and topics carry their data as a ```tmh-cards JSON block.
// Every button either asks the tutor a question (data-ask) or opens a real link in a new tab.

const CHIPS_SHOWN = 12;
const ITEMS_SHOWN = 4;

function cardButton(action, primary) {
  const cls = `card-btn${primary ? " primary" : ""}`;
  if (action.href && /^https:\/\//.test(action.href)) {
    return `<a class="${cls}" href="${escapeHtml(action.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(action.label)}${icon("external")}</a>`;
  }
  if (!action.ask) return "";
  const overview = action.overview ? ` data-overview="${escapeHtml(action.overview)}"` : "";
  return `<button type="button" class="${cls}" data-ask="${escapeHtml(action.ask)}"${overview}>${escapeHtml(action.label)}</button>`;
}

function cardActions(actions = []) {
  const buttons = actions.map((action, i) => cardButton(action, i === 0)).filter(Boolean);
  return buttons.length ? `<div class="card-actions">${buttons.join("")}</div>` : "";
}

const chipList = (items, cls = "") => `<div class="chips ${cls}">${items.map(item => `<span class="chip-tag">${escapeHtml(item)}</span>`).join("")}</div>`;

/** A labelled block inside a card; empty values are left out rather than shown as blanks. */
function cardField(label, body) {
  return body ? `<div class="card-field"><span class="card-label">${escapeHtml(label)}</span>${body}</div>` : "";
}

const chipsOrEmpty = items => (items?.length ? chipList(items) : "");

/** Collapsible part of a card; `data-outline` (set later) remembers whether it was open. */
function moreSection(summary, body) {
  return body ? `<details class="outline card-more"><summary>${escapeHtml(summary)}</summary><div class="card-more-body">${body}</div></details>` : "";
}

function progressionHtml(progression) {
  const rows = [
    ["Grow into", progression?.grow],
    ["Lead", progression?.lead],
    ["Switch to", progression?.pivot],
  ].filter(([, items]) => items?.length);
  if (!rows.length) return "";
  return `<ul class="card-progress">${rows.map(([label, items]) => `<li><span>${label}</span>${escapeHtml(items.join(", "))}</li>`).join("")}</ul>`;
}

function roleCardHtml(card) {
  const designations = card.designations?.length
    ? `<dl class="card-dl">${card.designations.map(item => `<dt>${escapeHtml(item.label)}</dt><dd>${escapeHtml(item.value)}</dd>`).join("")}</dl>`
    : "";
  const stack = [
    cardField("Languages", chipsOrEmpty(card.languages)),
    cardField("Frameworks & Standards", chipsOrEmpty(card.frameworks)),
    cardField("Tools", chipsOrEmpty(card.tools)),
    cardField("Soft skills", chipsOrEmpty(card.soft)),
    cardField("Industry designations", designations),
    cardField("Related career paths", chipsOrEmpty(card.related)),
    cardField("AI impact", card.aiImpact ? `<p>${escapeHtml(card.aiImpact)}</p>` : ""),
  ].join("");
  return `<article class="card role-card">
    <header class="card-head"><h3>${escapeHtml(card.title)}</h3>${card.experience ? `<span class="badge">${escapeHtml(card.experience)}</span>` : ""}</header>
    ${card.aka?.length ? `<p class="card-aka">Also called ${escapeHtml(card.aka.join(", "))}</p>` : ""}
    <p class="card-summary">${escapeHtml(card.summary)}</p>
    ${cardField("Technical skills", chipsOrEmpty(card.technical))}
    ${cardField("Career progression", progressionHtml(card.progression))}
    ${moreSection("Languages, tools and more", stack)}
    ${cardActions(card.actions)}
  </article>`;
}

const BADGE_TONE = { Realistic: "good", Moderate: "mid", Hard: "hard", "Very hard": "hard" };

function countryCardHtml(card) {
  const details = card.details?.length
    ? `<dl class="card-dl">${card.details.map(item => `<dt>${escapeHtml(item.label)}</dt><dd>${escapeHtml(item.value)}</dd>`).join("")}</dl>`
    : "";
  return `<article class="card country-card">
    <header class="card-head"><span class="card-flag" aria-hidden="true">${escapeHtml(card.flag)}</span><h3>${escapeHtml(card.title)}</h3><span class="badge ${BADGE_TONE[card.badge] ?? ""}">${escapeHtml(card.badge)}</span></header>
    <p class="card-summary">${escapeHtml(card.summary)}</p>
    ${cardField("Key details", details)}
    ${cardActions(card.actions)}
  </article>`;
}

function itemHtml(item, asChip) {
  const cls = asChip ? "chip-link" : "card-link";
  const overview = item.overview ? ` data-overview="${escapeHtml(item.overview)}"` : "";
  const inner = item.ask ? `<button type="button" class="${cls}" data-ask="${escapeHtml(item.ask)}"${overview}>${escapeHtml(item.label)}</button>` : escapeHtml(item.label);
  return asChip ? inner : `<li>${inner}</li>`;
}

function topicItems(card) {
  const items = card.items ?? [];
  const shown = card.chips ? CHIPS_SHOWN : ITEMS_SHOWN;
  const wrap = list => (card.chips ? `<div class="chips">${list.map(item => itemHtml(item, true)).join("")}</div>` : `<ul class="card-list">${list.map(item => itemHtml(item, false)).join("")}</ul>`);
  const first = items.slice(0, shown);
  const rest = items.slice(shown);
  const label = card.chips ? "" : `<span class="card-label">Key concepts</span>`;
  return `${label}${wrap(first)}${rest.length ? moreSection(`Show ${rest.length} more`, wrap(rest)) : ""}`;
}

function topicCardHtml(card) {
  return `<article class="card topic-card">
    <header class="card-head"><h3>${escapeHtml(card.title)}</h3>${card.badge ? `<span class="badge">${escapeHtml(card.badge)}</span>` : ""}</header>
    ${card.description ? `<p class="card-summary">${escapeHtml(card.description)}</p>` : ""}
    ${topicItems(card)}
    ${cardActions(card.actions)}
  </article>`;
}

const CARD_RENDERERS = { role: roleCardHtml, country: countryCardHtml, topic: topicCardHtml };

/** Parse a cards block; null while it is still streaming in or if it is malformed. */
export function parseCards(text) {
  try {
    const cards = JSON.parse(text);
    return Array.isArray(cards) ? cards.filter(card => card && CARD_RENDERERS[card.type]) : null;
  } catch {
    return null;
  }
}

function cardsElement(text, final) {
  const grid = document.createElement("div");
  const cards = parseCards(text);
  if (!cards) {
    // Placeholder cards while the data streams in (or if it can't be read).
    grid.className = "card-grid loading";
    grid.innerHTML = final ? `<p class="card-error">${icon("alert")} These cards could not be shown.</p>` : `<div class="card skeleton-card"></div><div class="card skeleton-card"></div>`;
    return grid;
  }
  const single = cards.length === 1 || cards[0]?.type === "role";
  grid.className = `card-grid${single ? " single" : ""}`;
  // Built from escaped strings only; the result is sanitized again with the rest of the answer.
  grid.innerHTML = DOMPurify.sanitize(cards.map(card => CARD_RENDERERS[card.type](card)).join(""), { ADD_ATTR: ["target"] });
  return grid;
}

/** Plain-text version of the cards, for copying and for the conversation history sent to the tutor. */
function cardsAsText(text) {
  const cards = parseCards(text) ?? [];
  return cards
    .map(card => {
      const lines = [`- ${card.title}${card.badge ? ` (${card.badge})` : ""}${card.summary || card.description ? `: ${card.summary ?? card.description}` : ""}`];
      if (card.type === "role" && card.technical?.length) lines.push(`  Technical skills: ${card.technical.join(", ")}`);
      if (card.type === "country") for (const item of card.details ?? []) lines.push(`  ${item.label}: ${item.value}`);
      if (card.type === "topic" && card.items?.length) lines.push(`  ${card.items.map(item => item.label).join(", ")}`);
      return lines.join("\n");
    })
    .join("\n");
}

/** Markdown with every cards block replaced by its plain-text version. */
export function withCardsAsText(markdown) {
  return String(markdown ?? "").replace(/```tmh-cards\n([\s\S]*?)(?:```|$)/g, (_, json) => cardsAsText(json));
}

/** A citation chip: a link to the source on GitHub when it exists, otherwise a marked-invalid button. */
function citationChip(n, evidenceCount, sourceUrl) {
  const valid = n >= 1 && n <= evidenceCount;
  const url = valid ? sourceUrl?.(n) : null;
  const chip = document.createElement(url ? "a" : "button");
  if (url) {
    chip.href = url;
    chip.target = "_blank";
    chip.rel = "noopener noreferrer";
    chip.title = "Open the source on GitHub";
  } else {
    chip.type = "button";
  }
  chip.className = valid ? "cite" : "cite invalid";
  chip.dataset.n = String(n);
  chip.textContent = String(n);
  chip.setAttribute("aria-label", `Source ${n}`);
  return chip;
}

/** Text nodes that contain [n] and are not inside code, links or existing chips. */
function citationTextNodes(root) {
  const skip = node => node.parentElement?.closest("code, pre, a, .cite") || !/\[\d{1,2}\]/.test(node.nodeValue ?? "");
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: node => (skip(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  return nodes;
}

function enhanceCitations(root, evidenceCount, sourceUrl) {
  for (const node of citationTextNodes(root)) {
    const fragment = document.createDocumentFragment();
    let last = 0;
    const text = node.nodeValue ?? "";
    for (const match of text.matchAll(/\[(\d{1,2})\]/g)) {
      fragment.append(text.slice(last, match.index), citationChip(Number(match[1]), evidenceCount, sourceUrl));
      last = (match.index ?? 0) + match[0].length;
    }
    fragment.append(text.slice(last));
    node.replaceWith(fragment);
  }
}

function enhanceGenerated(root) {
  const heading = [...root.querySelectorAll("h1, h2, h3, h4")].find(element => element.textContent?.trim().toLowerCase() === GENERATED_HEADING.toLowerCase());
  if (!heading) return false;
  const box = document.createElement("section");
  box.className = "beyond";
  box.innerHTML = `<div class="beyond-head">${icon("info")}<strong>Not from your notes</strong><span>General knowledge. Check before relying on it.</span></div>`;
  const body = document.createElement("div");
  body.className = "beyond-body";
  let next = heading.nextSibling;
  while (next) {
    const move = next;
    next = next.nextSibling;
    body.append(move);
  }
  box.append(body);
  heading.replaceWith(box);
  return true;
}

/** Checklists are selections: tick the items you want, then build a plan from them. */
function enhanceChecklists(root, checks) {
  let index = 0;
  for (const list of root.querySelectorAll("ul, ol")) {
    const items = [...list.children].filter(item => item.tagName === "LI" && item.querySelector(":scope > input[type=checkbox], :scope > p > input[type=checkbox]"));
    if (!items.length) continue;
    list.classList.add("task-list");
    for (const item of items) {
      const box = item.querySelector("input[type=checkbox]");
      const key = String(index++);
      box.disabled = false;
      box.dataset.check = key;
      box.checked = key in checks ? Boolean(checks[key]) : box.checked;
      // What the plan needs: the item's text, and its study-path topic when it links to one.
      const link = item.querySelector(".repo-link, a");
      box.dataset.label = (link?.textContent ?? item.textContent ?? "").trim();
      const topic = /\/topics\/([a-z0-9-]+)\.md/.exec(link?.dataset.href ?? "")?.[1];
      if (topic && topic !== "README") box.dataset.topic = topic;
      box.setAttribute("aria-label", `Select ${box.dataset.label}`);
      item.classList.add("task");
    }
  }
  return index;
}

/** Overview sections stay open or closed as the reader left them. */
function enhanceOutlines(root, open) {
  [...root.querySelectorAll("details.outline")].forEach((details, i) => {
    details.dataset.outline = String(i);
    if (open[i]) details.open = true;
  });
}

/**
 * Links between repository files (from roadmaps and notes) can't open in the browser app,
 * so they ask the tutor instead: a study path, a role roadmap, or the linked question.
 */
/** What a link to a repository file asks: the study path, the role roadmap, or the link text. */
function repoLinkQuestion(href, file, text, fromName) {
  if (href.includes("/topics/")) {
    if (file === "README") return "Where do I start?";
    const subject = /study path/i.test(text) ? fromName : text;
    return `${subject} study path`;
  }
  if (href.includes("/roles/")) return file === "README" ? "Role roadmaps" : `${text} roadmap`;
  return text;
}

function repoLink(link, href) {
  const text = (link.textContent ?? "").trim();
  const file = href.split("#")[0].split("/").pop().replace(/\.md$/i, "");
  const fromName = file.replace(/-/g, " ");
  const ask = repoLinkQuestion(href, file, text, fromName);
  const button = document.createElement("button");
  button.type = "button";
  button.className = "repo-link";
  button.dataset.ask = ask;
  button.title = `${href} — ask the tutor`;
  button.dataset.href = href;
  button.textContent = text || fromName;
  return button;
}

function enhanceMisc(root) {
  for (const table of root.querySelectorAll("table")) {
    if (table.parentElement?.classList.contains("table-wrap")) continue;
    const wrap = document.createElement("div");
    wrap.className = "table-wrap";
    table.replaceWith(wrap);
    wrap.append(table);
  }
  for (const link of root.querySelectorAll("a[href]")) {
    const href = link.getAttribute("href") ?? "";
    if (href.startsWith("#ask:")) {
      // Built answers link to questions; clicking one asks it.
      const button = document.createElement("button");
      button.type = "button";
      button.className = "ask-link";
      try {
        button.dataset.ask = decodeURIComponent(href.slice(5));
      } catch {
        button.dataset.ask = link.textContent ?? "";
      }
      button.textContent = link.textContent ?? "";
      link.replaceWith(button);
    } else if (/^https?:/i.test(href)) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    } else if (/\.md(#.*)?$/i.test(href) && !href.startsWith("/")) {
      link.replaceWith(repoLink(link, href));
    }
  }
  for (const image of root.querySelectorAll("img")) {
    image.loading = "lazy";
    image.classList.add("md-img");
  }
}

/**
 * Render markdown into `target`.
 * options: evidenceCount (citations above it are marked invalid), sourceUrl(n) (link for citation n),
 * final (draw diagrams), checks (saved checklist state), open (saved open overview sections).
 */
export function renderMarkdown(target, markdown, { evidenceCount = 0, sourceUrl = null, final = true, checks = {}, open = {} } = {}) {
  const html = DOMPurify.sanitize(marked.parse(markdown ?? ""), { FORBID_TAGS: ["style", "form", "iframe"], FORBID_ATTR: ["style"] });
  target.innerHTML = html;
  enhanceCode(target, { final });
  enhanceCitations(target, evidenceCount, sourceUrl);
  const generated = enhanceGenerated(target);
  enhanceMisc(target);
  const tasks = enhanceChecklists(target, checks);
  enhanceOutlines(target, open);
  if (final) renderDiagrams(target);
  return { generated, tasks };
}

let mermaidLoading = null;
function loadMermaid() {
  mermaidLoading ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "/vendor/mermaid.js";
    script.onload = () => {
      const mermaid = globalThis.mermaid;
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        // Diagrams sit on a white card in both themes, like figures in documentation.
        theme: "neutral",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
        themeVariables: { fontSize: "14px" },
      });
      resolve(mermaid);
    };
    script.onerror = () => reject(new Error("Could not load the diagram library."));
    document.head.append(script);
  });
  return mermaidLoading;
}

let diagramCount = 0;
export async function renderDiagrams(root) {
  const holders = [...root.querySelectorAll("figure.diagram[data-mermaid]")];
  if (!holders.length) return;
  let mermaid;
  try {
    mermaid = await loadMermaid();
  } catch (error) {
    for (const holder of holders) holder.innerHTML = `<div class="diagram-error">${escapeHtml(error.message)}</div>`;
    return;
  }
  for (const holder of holders) {
    const source = holder.dataset.mermaid ?? "";
    delete holder.dataset.mermaid;
    try {
      const { svg } = await mermaid.render(`diagram-${++diagramCount}`, source);
      holder.innerHTML = `<div class="diagram-svg">${svg}</div>`;
    } catch {
      holder.innerHTML = `<div class="diagram-error">${icon("alert")} This diagram could not be drawn. Source:</div><pre><code>${escapeHtml(source)}</code></pre>`;
    }
  }
}

/** Plain text of a markdown answer, for copying. */
export function markdownToText(markdown) {
  const box = document.createElement("div");
  box.innerHTML = DOMPurify.sanitize(marked.parse(withCardsAsText(markdown)));
  return box.innerText;
}
