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
      box.checked = Boolean(checks[key]);
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
  box.innerHTML = DOMPurify.sanitize(marked.parse(markdown ?? ""));
  return box.innerText;
}
