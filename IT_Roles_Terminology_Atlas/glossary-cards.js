/*
 * Glossary practice: flashcards and a multiple-choice quiz, with spaced repetition (Leitner boxes).
 * Cards you miss come back in the same session; cards you know come back after 1, 3, 7, then 21 days.
 * Progress is kept in this browser only.
 */
(() => {
  const A = window.ATLAS;
  const panel = document.getElementById("glossary");
  if (!A || !panel) return;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(?:^-)|(?:-$)/g, "");
  const load = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
  const store = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* progress lasts for this visit */ } };

  const DAY = 864e5;
  const INTERVALS = [0, 0, 1, 3, 7, 21]; // days to wait after reaching box 1..5
  const SESSION = 20;
  const progress = load("atlas-cards", {}); // slug → { box, due }
  const prefs = load("atlas-cards-prefs", { deck: "due", mode: "cards" });
  const terms = A.glossary.map((g) => ({ ...g, s: slug(g.t) }));
  const starred = () => new Set((load("atlas-saved", {}).terms) || []);
  const isDue = (t) => progress[t.s] && progress[t.s].due <= Date.now();

  function deckTerms(deck) {
    if (deck === "starred") { const s = starred(); return terms.filter((t) => s.has(t.s)); }
    if (deck === "due") return terms.filter(isDue).concat(terms.filter((t) => !progress[t.s]));
    if (deck === "all") return terms;
    return terms.filter((t) => t.c === deck);
  }
  const shuffle = (list) => { const a = [...list]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // ---------- UI shell ----------
  const opener = document.createElement("div");
  opener.className = "gc-open";
  opener.innerHTML = `<button type="button" class="btn" data-gc="open">Practise with flashcards</button><span class="muted" id="gcDueNote"></span>`;
  panel.querySelector(".h2").after(opener);
  const box = document.createElement("section");
  box.className = "card-block gc";
  box.hidden = true;
  box.setAttribute("aria-label", "Glossary practice");
  opener.after(box);

  const session = { queue: [], done: 0, right: 0, missed: [], current: null, flipped: false, answered: null };

  function dueNote() {
    const due = terms.filter(isDue).length, learned = Object.values(progress).filter((p) => p.box >= 3).length;
    document.getElementById("gcDueNote").textContent = Object.keys(progress).length ? `${due} due for review · ${learned} of ${terms.length} learned` : `${terms.length} terms · spaced repetition`;
  }

  function setup() {
    const s = starred().size;
    const decks = [["due", `Due & new (${deckTerms("due").length})`], ["starred", `Starred (${s})`], ["all", `All terms (${terms.length})`], ...A.glossaryCats.map((c) => [c, `${c} (${terms.filter((t) => t.c === c).length})`])];
    box.innerHTML = `<div class="gc-head"><h3 class="h3 tight">Practise the glossary</h3><button type="button" class="btn-link" data-gc="close">Close</button></div>
      <div class="est-controls gc-controls">
        <label>Deck<select data-gc-pref="deck">${decks.map(([v, t]) => `<option value="${esc(v)}"${prefs.deck === v ? " selected" : ""}>${esc(t)}</option>`).join("")}</select></label>
        <label>Mode<select data-gc-pref="mode"><option value="cards"${prefs.mode === "cards" ? " selected" : ""}>Flashcards — flip and rate yourself</option><option value="quiz"${prefs.mode === "quiz" ? " selected" : ""}>Quiz — pick the term for a meaning</option></select></label>
      </div>
      <p class="pt-note">${s ? "" : "Tip: star terms in the table below (☆) to build your own deck. "}Each session has up to ${SESSION} cards. Keys: <kbd>Space</kbd> flip, <kbd>1</kbd> didn't know, <kbd>2</kbd> knew it; in the quiz <kbd>1</kbd>–<kbd>4</kbd> pick an answer.</p>
      <button type="button" class="btn" data-gc="start">Start session</button>`;
  }

  function start() {
    const pool = deckTerms(prefs.deck);
    if (!pool.length) { box.querySelector(".pt-note").textContent = prefs.deck === "starred" ? "No starred terms yet — star some terms in the table below first." : "Nothing to review in this deck right now."; return; }
    // Due cards first, then the rest shuffled.
    const due = shuffle(pool.filter(isDue)), rest = shuffle(pool.filter((t) => !isDue(t)));
    Object.assign(session, { queue: [...due, ...rest].slice(0, SESSION), done: 0, right: 0, missed: [], current: null });
    next();
  }

  function next() {
    session.current = session.queue.shift() || null;
    session.flipped = false; session.answered = null;
    if (!session.current) return finish();
    session.mode = prefs.mode === "quiz" && terms.length >= 4 ? "quiz" : "cards";
    if (session.mode === "quiz") session.options = options(session.current);
    draw();
  }

  /** Four choices, preferring terms from the same category so the quiz isn't trivial. */
  function options(t) {
    const same = shuffle(terms.filter((x) => x.c === t.c && x.s !== t.s));
    const other = shuffle(terms.filter((x) => x.c !== t.c));
    return shuffle([t, ...[...same, ...other].slice(0, 3)]);
  }

  /** The meaning with the term's own name blanked out, for the quiz. */
  function hidden(t) {
    const names = [t.t, ...t.t.split(/\s*\/\s*|\s*\(|\)/), t.f || ""].map((n) => n.trim()).filter((n) => n.length > 1).sort((a, b) => b.length - a.length);
    let text = esc(t.d);
    for (const n of names) text = text.replace(new RegExp(`\\b${esc(n).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi"), "<span class=\"gc-blank\">_____</span>");
    return text;
  }

  function bar() {
    const total = session.done + session.queue.length + (session.current ? 1 : 0);
    return `<div class="gc-progress"><span style="width:${total ? (session.done / total) * 100 : 0}%"></span></div><p class="gc-count">${session.done} of ${total} · ${session.right} right</p>`;
  }

  function draw() {
    const t = session.current;
    const level = progress[t.s] ? `Box ${progress[t.s].box} of 5` : "New card";
    if (session.mode === "quiz") {
      box.innerHTML = `${bar()}<div class="gc-quiz"><span class="gc-tag">${esc(t.c)} · ${level}</span><p class="gc-def">${hidden(t)}</p>
        <div class="gc-choices">${session.options.map((o, i) => {
          const state = session.answered == null ? "" : o.s === t.s ? " right" : o.s === session.answered ? " wrong" : "";
          return `<button type="button" class="gc-choice${state}" data-gc-pick="${esc(o.s)}"${session.answered != null ? " disabled" : ""}><kbd>${i + 1}</kbd>${esc(o.t)}</button>`;
        }).join("")}</div>
        ${session.answered != null ? `<p class="gc-full"><b>${esc(t.t)}</b>${t.f ? ` (${esc(t.f)})` : ""}: ${esc(t.d)}</p><button type="button" class="btn" data-gc="next">Next →</button>` : ""}</div>`;
    } else {
      box.innerHTML = `${bar()}<button type="button" class="gc-card${session.flipped ? " flipped" : ""}" data-gc="flip" aria-label="${session.flipped ? "Card back" : "Card front: press to flip"}">
          <span class="gc-face gc-front"><span class="gc-tag">${esc(t.c)} · ${level}</span><strong>${esc(t.t)}</strong>${t.f ? `<small>${esc(t.f)}</small>` : ""}<em>Tap or press Space to see the meaning</em></span>
          <span class="gc-face gc-back"><strong>${esc(t.t)}</strong><span>${esc(t.d)}</span></span>
        </button>
        <div class="gc-rate"${session.flipped ? "" : " hidden"}><button type="button" class="btn-ghost gc-miss" data-gc-rate="0"><kbd>1</kbd> Didn't know</button><button type="button" class="btn gc-know" data-gc-rate="1"><kbd>2</kbd> Knew it</button></div>`;
    }
  }

  /** Leitner update: right → next box and a longer wait; wrong → box 1, and the card comes back this session. */
  function rate(knew) {
    const t = session.current;
    const p = progress[t.s] || { box: 0 };
    p.box = knew ? Math.min(5, p.box + 1) : 1;
    p.due = Date.now() + INTERVALS[p.box] * DAY;
    progress[t.s] = p;
    store("atlas-cards", progress);
    session.done++;
    if (knew) session.right++;
    else { session.missed.push(t); session.queue.splice(Math.min(3, session.queue.length), 0, t); }
    next();
  }

  function finish() {
    const missed = [...new Map(session.missed.map((t) => [t.s, t])).values()];
    box.innerHTML = `<div class="gc-head"><h3 class="h3 tight">Session done</h3><button type="button" class="btn-link" data-gc="close">Close</button></div>
      <p class="gc-result"><b>${session.right}</b> right out of <b>${session.done}</b> answers.</p>
      ${missed.length ? `<p>Worth another look:</p><ul class="gc-missed">${missed.map((t) => `<li><a href="#glossary/${esc(t.s)}">${esc(t.t)}</a></li>`).join("")}</ul>` : "<p>No misses — nice.</p>"}
      <div class="gc-rate"><button type="button" class="btn" data-gc="start">Another session</button><button type="button" class="btn-ghost" data-gc="setup">Change deck</button></div>`;
    dueNote();
  }

  box.addEventListener("click", (e) => {
    const b = e.target.closest("[data-gc], [data-gc-rate], [data-gc-pick]");
    if (!b) return;
    const act = b.dataset.gc;
    if (act === "close") { box.hidden = true; opener.hidden = false; dueNote(); }
    else if (act === "start") start();
    else if (act === "setup") setup();
    else if (act === "flip") { session.flipped = !session.flipped; draw(); }
    else if (act === "next") rate(session.answered === session.current.s);
    else if (b.dataset.gcRate) rate(b.dataset.gcRate === "1");
    else if (b.dataset.gcPick && session.answered == null) { session.answered = b.dataset.gcPick; draw(); box.querySelector('[data-gc="next"]')?.focus(); }
  });
  box.addEventListener("change", (e) => {
    const sel = e.target.closest("[data-gc-pref]");
    if (sel) { prefs[sel.dataset.gcPref] = sel.value; store("atlas-cards-prefs", prefs); }
  });
  opener.addEventListener("click", (e) => {
    if (!e.target.closest('[data-gc="open"]')) return;
    opener.hidden = true; box.hidden = false; setup();
    box.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  document.addEventListener("keydown", (e) => {
    if (box.hidden || !session.current || /input|textarea|select/i.test(document.activeElement.tagName) || !panel.classList.contains("active")) return;
    if (session.mode === "cards") {
      if (e.key === " ") { e.preventDefault(); session.flipped = !session.flipped; draw(); }
      else if (session.flipped && (e.key === "1" || e.key === "2")) rate(e.key === "2");
    } else if (session.answered == null && /^[1-4]$/.test(e.key)) {
      session.answered = session.options[Number(e.key) - 1].s; draw();
    } else if (session.answered != null && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); rate(session.answered === session.current.s); }
  });
  dueNote();
})();
