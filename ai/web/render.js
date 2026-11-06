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
        holder.innerHTML = `<div class="diagram-loading">${icon("share")} Drawing diagram…</div>`;
      } else {
        holder.innerHTML = `<div class="diagram-loading">${icon("share")} Diagram will render when the answer finishes…</div>`;
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

function enhanceCitations(root, evidenceCount) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: node => (node.parentElement?.closest("code, pre, a, .cite") || !/\[\d{1,2}\]/.test(node.nodeValue ?? "") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    const fragment = document.createDocumentFragment();
    let last = 0;
    const text = node.nodeValue ?? "";
    for (const match of text.matchAll(/\[(\d{1,2})\]/g)) {
      fragment.append(text.slice(last, match.index));
      const n = Number(match[1]);
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = n >= 1 && n <= evidenceCount ? "cite" : "cite invalid";
      chip.dataset.n = String(n);
      chip.textContent = String(n);
      chip.setAttribute("aria-label", `Source ${n}`);
      fragment.append(chip);
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
  box.innerHTML = `<div class="beyond-head">${icon("sparkles")}<strong>Beyond your notes</strong><span>AI-generated — not from your repository. Verify before relying on it.</span></div>`;
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
      if (key in checks) box.checked = Boolean(checks[key]);
      item.classList.add("task");
      item.classList.toggle("done", box.checked);
    }
    const done = items.filter(item => item.querySelector("input")?.checked).length;
    const progress = document.createElement("div");
    progress.className = "task-progress";
    progress.innerHTML = `<div class="bar"><i style="width:${Math.round((done / items.length) * 100)}%"></i></div><span>${done}/${items.length} done</span>`;
    list.before(progress);
  }
}

/**
 * Links between repository files (from roadmaps and notes) can't open in the browser app,
 * so they ask the tutor instead: a study path, a role roadmap, or the linked question.
 */
function repoLink(link, href) {
  const text = (link.textContent ?? "").trim();
  const file = href.split("#")[0].split("/").pop().replace(/\.md$/i, "");
  const fromName = file.replace(/-/g, " ");
  let ask = text;
  if (/\/topics\//.test(href)) ask = file === "README" ? "Where do I start?" : `${/study path/i.test(text) ? fromName : text} study path`;
  else if (/\/roles\//.test(href)) ask = file === "README" ? "Role roadmaps" : `${text} roadmap`;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "repo-link";
  button.dataset.ask = ask;
  button.title = `${href} — ask the tutor`;
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
    if (/^https?:/i.test(href)) {
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
 * options: evidenceCount (citations above it are marked invalid), final (draw diagrams), checks (saved checklist state).
 */
export function renderMarkdown(target, markdown, { evidenceCount = 0, final = true, checks = {} } = {}) {
  const html = DOMPurify.sanitize(marked.parse(markdown ?? ""), { FORBID_TAGS: ["style", "form", "iframe"], FORBID_ATTR: ["style"] });
  target.innerHTML = html;
  enhanceCode(target, { final });
  enhanceCitations(target, evidenceCount);
  const generated = enhanceGenerated(target);
  enhanceChecklists(target, checks);
  enhanceMisc(target);
  if (final) void renderDiagrams(target);
  return { generated };
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
        theme: "base",
        fontFamily: "var(--font-sans)",
        themeVariables: {
          darkMode: true,
          background: "#0b1020",
          primaryColor: "#122036",
          primaryTextColor: "#e6edf7",
          primaryBorderColor: "#38bdf8",
          secondaryColor: "#1c1633",
          secondaryBorderColor: "#a78bfa",
          tertiaryColor: "#0f1a2b",
          lineColor: "#64748b",
          edgeLabelBackground: "#0b1020",
          clusterBkg: "#0d1426",
          clusterBorder: "#334155",
          textColor: "#cbd5e1",
          fontSize: "14px",
        },
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
      holder.innerHTML = `<div class="diagram-svg">${svg}</div><figcaption>${icon("share")} Diagram</figcaption>`;
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
