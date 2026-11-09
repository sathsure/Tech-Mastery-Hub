/*
 * "Role Test" tab: pick a role, answer a short adaptive-by-level quiz across its topics, and get a readiness score,
 * a topic-by-topic breakdown and what to study next. Results are kept in this browser only.
 */
(() => {
  const A = window.ATLAS;
  const BANK = window.ROLE_TEST;
  const E = window.RoleTestEngine;
  const root = document.getElementById("rtRoot");
  if (!A || !BANK || !E || !root) return;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const load = (k, f) => { try { return JSON.parse(localStorage.getItem(k)) ?? f; } catch { return f; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* results last for this visit */ } };
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const ICON = {
    layers: '<path d="M12 3 2.5 8 12 13l9.5-5zM2.5 12.5 12 17.5l9.5-5M2.5 16.5 12 21.5l9.5-5"/>',
    server: '<rect x="3" y="4" width="18" height="7" rx="1.5"/><rect x="3" y="13" width="18" height="7" rx="1.5"/><path d="M7 7.5h.01M7 16.5h.01"/>',
    layout: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
    flow: '<rect x="3" y="3" width="7" height="6" rx="1.5"/><rect x="14" y="15" width="7" height="6" rx="1.5"/><path d="M10 6h4a3 3 0 0 1 3 3v6"/>',
    cloud: '<path d="M7 19a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 17.8 11.5 3.8 3.8 0 0 1 17.5 19z"/>',
    pulse: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    sparkles: '<path d="M11 3l1.9 5.1L18 10l-5.1 1.9L11 17l-1.9-5.1L4 10l5.1-1.9zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="m8 12.5 3 3 5-6"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    back: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
    book: '<path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H20v15H5.5A1.5 1.5 0 0 0 4 19.5zM4 19.5A1.5 1.5 0 0 0 5.5 21H20v-3"/>',
    alert: '<path d="M12 3 2 20h20zM12 10v4M12 17h.01"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    rocket: '<path d="M12 2c3.5 2.5 5 7 3 13H9C7 9 8.5 4.5 12 2zM9 15l-3 4h3M15 15l3 4h-3M12 7.5v2"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 3h6v3H9zM9 11h6M9 15h4"/>',
    chart: '<path d="M3 21h18M6 17v-6M11 17V5M16 17v-9M21 17v-4"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6M16 4.5a3.5 3.5 0 0 1 0 7M18 14c2.4.6 4 2.9 4 6"/>',
    pen: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/>',
  };
  const icon = (name, cls = "rt-ic") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[name] || ICON.target}</svg>`;

  const HISTORY = "atlas.roleTests";
  const history = load(HISTORY, {});
  const roleKey = (role, choice) => (role.choice ? `${role.name} (${topicLabel(choice || role.choice.options[0])})` : role.name);
  const topicLabel = (id) => BANK.topics[id]?.label || id;
  // Served by the AI tutor (under /atlas/), links open the tutor; opened as a file, they open the markdown study paths.
  const TUTOR = location.pathname.startsWith("/atlas/");
  const ask = (q) => `/?q=${encodeURIComponent(q)}`;
  const studyPath = (id) => (TUTOR ? ask(BANK.topics[id]?.tutor?.study || `${topicLabel(id)} study path`) : BANK.topics[id]?.path || `../roadmap/topics/${id === "sql" ? "database-sql" : id}.md`);
  const mockLink = (id) => ask(`Mock interview: ${BANK.topics[id]?.tutor?.mock || topicLabel(id)}`);
  const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(?:^-)|(?:-$)/g, "");
  const tone = (pct) => (pct >= 70 ? "good" : pct >= 40 ? "mid" : "low");
  const minutes = (n) => Math.max(5, Math.round(n * 0.5));
  const DIFF = { 1: "Easy", 2: "Medium", 3: "Hard" };

  /** SVG ring: pct of a full circle, with the number in the middle. */
  function ring(pct, size, stroke, label = "", animate = false) {
    const r = (size - stroke) / 2, c = 2 * Math.PI * r;
    const offset = c * (1 - pct / 100);
    return `<svg class="rt-ring ${tone(pct)}" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${pct}%${label ? ` ${label}` : ""}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="rt-ring-track" stroke-width="${stroke}" fill="none"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="rt-ring-value" stroke-width="${stroke}" fill="none" stroke-linecap="round"
        stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(animate && !reduceMotion ? c : offset).toFixed(1)}" data-offset="${offset.toFixed(1)}" transform="rotate(-90 ${size / 2} ${size / 2})"/>
      <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" class="rt-ring-text" style="font-size:${Math.round(size * 0.26)}px">${pct}%</text>
    </svg>`;
  }
  const animateRings = () => requestAnimationFrame(() => requestAnimationFrame(() => root.querySelectorAll(".rt-ring-value[data-offset]").forEach((c) => { c.style.strokeDashoffset = c.dataset.offset; })));

  const state = { view: "home", role: null, choice: null, items: [], answers: [], index: 0, guess: false, result: null };
  const show = (view) => {
    state.view = view;
    if (view === "home" && location.hash.startsWith("#roletest/")) window.history.replaceState(null, "", "#roletest");
    render(); root.scrollIntoView({ block: "start", behavior: reduceMotion ? "auto" : "smooth" }); };

  // ---------- Home ----------
  function home() {
    const implemented = new Set(BANK.roles.map((r) => r.name));
    const soon = A.roles.map((r) => r.name).filter((n) => !implemented.has(n));
    const cards = BANK.roles.map((role, i) => {
      const topics = E.roleTopics(role, null);
      const count = topics.reduce((s, t) => s + (t.core ? 3 : 2), 0);
      const runs = Object.entries(history).filter(([k]) => k === role.name || k.startsWith(`${role.name} (`)).flatMap(([, v]) => v);
      const last = runs.sort((a, b) => b.date - a.date)[0];
      const chips = topics.slice(0, 5).map((t) => `<span>${esc(t.id.startsWith("@") ? role.choice.label : topicLabel(t.id))}</span>`).join("") + (topics.length > 5 ? `<span class="more">+${topics.length - 5}</span>` : "");
      return `<button type="button" class="rt-role" style="--rc:${role.color}" data-rt-role="${i}">
        <span class="rt-role-top"><span class="rt-role-ic">${icon(role.icon)}</span>${last ? `<span class="rt-role-last">${ring(last.pct, 52, 5)}<small>Last</small></span>` : ""}</span>
        <span class="rt-role-name">${esc(role.name)}</span>
        <span class="rt-role-blurb">${esc(role.blurb)}</span>
        <span class="rt-role-topics">${chips}</span>
        <span class="rt-role-foot"><span>${icon("clock", "rt-ic sm")} ${count} questions · ~${minutes(count)} min</span><span class="rt-go">${last ? "Retake" : "Start"} ${icon("arrow", "rt-ic sm")}</span></span>
      </button>`;
    }).join("");
    return `
      <section class="rt-hero">
        <div class="rt-hero-text">
          <span class="rt-eyebrow">${icon("target", "rt-ic sm")} Role Readiness Test</span>
          <h2>How ready are you for your next role?</h2>
          <p>Answer a short set of questions across the topics a role needs. Get a readiness score, a topic-by-topic breakdown and exactly what to study next.</p>
          <ol class="rt-steps"><li><b>1</b><span>Pick a role</span></li><li><b>2</b><span>Answer 12–30 questions</span></li><li><b>3</b><span>Get your score &amp; study plan</span></li></ol>
        </div>
        <div class="rt-hero-art" aria-hidden="true">
          <div class="rt-demo">${ring(72, 132, 12)}<span class="rt-demo-level">Interview-ready</span>
            <div class="rt-demo-bars"><i style="--w:86%"></i><i style="--w:64%"></i><i style="--w:38%"></i></div></div>
        </div>
      </section>
      <h3 class="rt-h3">Choose a role <small class="muted">${BANK.roles.length} available</small></h3>
      <div class="rt-roles">${cards}</div>
      <section class="rt-soon">
        <div class="rt-soon-head"><span class="rt-soon-badge">Coming soon</span><h3>More roles</h3></div>
        <p>Tests for these roles will be updated in the future, as their question banks are written. Their study paths are already in the <a href="#roles" data-tab="roles">Roles</a> tab.</p>
        <div class="rt-soon-list">${soon.map((n) => `<span>${esc(n)}</span>`).join("")}</div>
      </section>`;
  }

  // ---------- Setup ----------
  function setup() {
    const role = state.role;
    const topics = E.roleTopics(role, state.choice);
    const count = topics.reduce((s, t) => s + (t.core ? 3 : 2), 0);
    const chip = (t) => `<span class="rt-chip ${t.core ? "core" : ""}">${esc(topicLabel(t.id))}</span>`;
    const choice = role.choice ? `<div class="rt-choice"><span>${esc(role.choice.label)}</span><div class="rt-seg" role="radiogroup" aria-label="${esc(role.choice.label)}">${role.choice.options.map((o) => `<button type="button" role="radio" aria-checked="${o === (state.choice || role.choice.options[0])}" class="${o === (state.choice || role.choice.options[0]) ? "on" : ""}" data-rt-choice="${o}">${esc(topicLabel(o))}</button>`).join("")}</div></div>` : "";
    return `
      <button type="button" class="rt-back" data-rt="home">${icon("back", "rt-ic sm")} All roles</button>
      <section class="rt-setup" style="--rc:${role.color}">
        <div class="rt-setup-head"><span class="rt-role-ic lg">${icon(role.icon)}</span><div><span class="rt-eyebrow">Role Readiness Test</span><h2>${esc(role.name)}</h2><p>${esc(role.blurb)}</p></div></div>
        ${choice}
        <div class="rt-setup-grid">
          <div class="rt-setup-col"><h4>Core topics <small>count double · easy, medium &amp; hard</small></h4><div class="rt-chips">${topics.filter((t) => t.core).map(chip).join("")}</div></div>
          <div class="rt-setup-col"><h4>Supporting topics <small>easy &amp; medium</small></h4><div class="rt-chips">${topics.filter((t) => !t.core).map(chip).join("")}</div></div>
        </div>
        <div class="rt-rules">
          <div><b>${count}</b><span>questions</span></div>
          <div><b>~${minutes(count)}</b><span>minutes</span></div>
          <div><b>1·2·3</b><span>points for easy, medium, hard</span></div>
          <div><b>½</b><span>points when you mark a guess</span></div>
        </div>
        <p class="rt-note">Honest guesses make the score more accurate: tick <b>I'm guessing</b> when you aren't sure. A confident wrong answer is flagged as a misconception to fix.</p>
        <button type="button" class="rt-start" data-rt="start">Start the test ${icon("arrow", "rt-ic sm")}</button>
      </section>`;
  }

  // ---------- Question ----------
  function question() {
    const item = state.items[state.index];
    const answered = state.answers[state.index];
    const total = state.items.length;
    const letters = ["A", "B", "C", "D"];
    const options = item.options.map((o, i) => {
      let cls = "";
      if (answered) cls = i === item.answer ? " right" : i === answered.choice ? " wrong" : " dim";
      return `<button type="button" class="rt-opt${cls}" data-rt-opt="${i}" ${answered ? "disabled" : ""}><kbd>${letters[i]}</kbd><span>${esc(o)}</span>${answered && i === item.answer ? icon("check", "rt-ic sm") : ""}</button>`;
    }).join("");
    const right = answered && answered.choice === item.answer;
    const feedback = answered ? `<div class="rt-feedback ${right ? "ok" : "bad"}"><b>${right ? (answered.guess ? "Correct — lucky guess!" : "Correct!") : answered.guess ? "Not quite — good that you marked it as a guess." : "Not quite."}</b><span>${esc(item.explain)}</span></div>` : "";
    return `
      <div class="rt-quiz" style="--rc:${state.role.color}">
        <div class="rt-top"><button type="button" class="rt-back" data-rt="quit">${icon("back", "rt-ic sm")} Quit</button><span class="rt-top-role">${esc(roleKey(state.role, state.choice))}</span><span class="rt-count">${state.index + 1}<small>/${total}</small></span></div>
        <div class="rt-progress" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${state.index}"><span style="width:${(state.index / total) * 100}%"></span></div>
        <article class="rt-card">
          <div class="rt-tags"><span class="rt-topic">${esc(item.topicLabel)}</span><span class="rt-diff d${item.level}"><i></i><i></i><i></i>${DIFF[item.level]}</span>${item.core ? '<span class="rt-core">Core</span>' : ""}</div>
          <h3 class="rt-q">${esc(item.q)}</h3>
          ${item.code ? `<pre class="rt-code"><code>${esc(item.code)}</code></pre>` : ""}
          <div class="rt-opts">${options}</div>
          ${answered ? feedback : `<label class="rt-guess"><input type="checkbox" data-rt-guess ${state.guess ? "checked" : ""}><span class="rt-switch"></span>I'm guessing</label>`}
          ${answered ? `<button type="button" class="rt-next" data-rt="next">${state.index + 1 === total ? "See my result" : "Next question"} ${icon("arrow", "rt-ic sm")}</button>` : ""}
        </article>
        <p class="rt-keys"><kbd>1</kbd>–<kbd>4</kbd> answer · <kbd>G</kbd> mark a guess · <kbd>Enter</kbd> next</p>
      </div>`;
  }

  // ---------- Results ----------
  function results() {
    const r = state.result;
    const key = roleKey(state.role, state.choice);
    const runs = (history[key] || []).slice().sort((a, b) => a.date - b.date);
    const prev = runs.length > 1 ? runs[runs.length - 2] : null;
    const delta = prev ? r.pct - prev.pct : null;
    const bars = [...r.topics].sort((a, b) => a.pct - b.pct).map((t) => `
      <li class="rt-bar ${tone(t.pct)}"><span class="rt-bar-name">${esc(t.label)}${t.core ? '<em>Core</em>' : ""}</span>
        <span class="rt-bar-track"><span style="--w:${Math.max(t.pct, 2)}%"></span></span><b>${t.pct}%</b><small>${t.right}/${t.asked}</small></li>`).join("");
    const next = r.studyNext.length ? r.studyNext.map((t) => `
      <div class="rt-next-card ${tone(t.pct)}"><div class="rt-next-head">${ring(t.pct, 48, 5)}<div><b>${esc(t.label)}</b><small>${t.core ? "Core topic" : "Supporting topic"} · ${t.right}/${t.asked} right</small></div></div>
        <a class="rt-link" href="${esc(studyPath(t.id))}" target="_blank" rel="noopener">${icon("book", "rt-ic sm")} Open the study path</a>
        ${TUTOR ? `<a class="rt-link" href="${esc(mockLink(t.id))}" target="_blank" rel="noopener">${icon("chat", "rt-ic sm")} Start a mock interview</a>` : `<span class="rt-tip">Then try “Mock interview on ${esc(t.label)}” in the tutor.</span>`}</div>`).join("")
      : `<p class="rt-note">No weak topics below 70% — try a mock interview in the tutor to practise explaining your answers out loud.</p>`;
    // Core-topic misconceptions first; the first five are shown, the rest fold away.
    const missItem = (m) => {
      const item = state.items[m.index];
      return `<li><span class="rt-topic">${esc(m.topic)}</span><b>${esc(m.q)}</b><span class="rt-miss-answer">Correct answer: <b>${esc(item.options[item.answer])}</b></span><span>${esc(m.explain)}</span></li>`;
    };
    const missList = [...r.misconceptions].sort((a, b) => Number(state.items[b.index].core) - Number(state.items[a.index].core));
    const misses = missList.length ? `<section class="rt-block"><h3 class="rt-h3">${icon("alert", "rt-ic")} Misconceptions to fix <small class="muted">${missList.length} confident but wrong · core topics first</small></h3>
      <ul class="rt-miss">${missList.slice(0, 5).map(missItem).join("")}</ul>
      ${missList.length > 5 ? `<details class="rt-more"><summary>Show ${missList.length - 5} more</summary><ul class="rt-miss">${missList.slice(5).map(missItem).join("")}</ul></details>` : ""}</section>` : "";
    const review = state.items.map((item, i) => {
      const a = state.answers[i];
      const ok = a && a.choice === item.answer;
      return `<li class="${ok ? "ok" : "bad"}"><span class="rt-mark">${ok ? "✓" : "✕"}</span><div><b>${esc(item.q)}</b>${item.code ? `<pre class="rt-code sm"><code>${esc(item.code)}</code></pre>` : ""}<span>Your answer: ${a ? esc(item.options[a.choice]) : "—"}${a?.guess ? " (guess)" : ""}${ok ? "" : ` · Correct: <b>${esc(item.options[item.answer])}</b>`}</span></div></li>`;
    }).join("");
    const chart = runs.length > 1 ? `<section class="rt-block"><h3 class="rt-h3">Your progress <small class="muted">${runs.length} attempts</small></h3>
      <div class="rt-history">${runs.slice(-8).map((h) => `<div class="rt-hbar ${tone(h.pct)}" title="${new Date(h.date).toLocaleDateString()}: ${h.pct}%"><span style="--h:${Math.max(h.pct, 3)}%"></span><b>${h.pct}%</b><small>${new Date(h.date).toLocaleDateString(undefined, { day: "numeric", month: "short" })}</small></div>`).join("")}</div></section>` : "";
    return `
      <button type="button" class="rt-back" data-rt="home">${icon("back", "rt-ic sm")} All roles</button>
      <section class="rt-result" style="--rc:${state.role.color}">
        <div class="rt-gauge">${ring(r.pct, 190, 16, "ready", true)}</div>
        <div class="rt-result-text">
          <span class="rt-eyebrow">Role readiness · ${esc(key)}</span>
          <h2>${r.pct}% ready</h2>
          <span class="rt-level ${r.level.tone}">${esc(r.level.name)}</span>
          <p>${esc(r.level.text)}</p>
          <div class="rt-stats">
            <div><b>${r.correct}/${r.total}</b><span>correct</span></div>
            <div><b>${r.confidentCorrect}</b><span>sure &amp; right</span></div>
            <div><b>${r.misconceptions.length}</b><span>misconceptions</span></div>
            <div><b class="${delta == null ? "" : delta >= 0 ? "up" : "down"}">${delta == null ? "—" : `${delta >= 0 ? "+" : ""}${delta}`}</b><span>vs last attempt</span></div>
          </div>
        </div>
      </section>
      <div class="rt-result-grid">
        <section class="rt-block"><h3 class="rt-h3">Topic breakdown <small class="muted">weakest first</small></h3><ul class="rt-bars">${bars}</ul>
          <p class="rt-legend"><span class="good"></span>70%+ ready <span class="mid"></span>40–69% developing <span class="low"></span>below 40% start here</p></section>
        <section class="rt-block"><h3 class="rt-h3">Study next</h3><div class="rt-next-list">${next}</div></section>
      </div>
      ${misses}
      ${chart}
      <details class="rt-block rt-review"><summary>Review all ${state.items.length} answers</summary><ol>${review}</ol></details>
      <div class="rt-actions">
        <button type="button" class="rt-start" data-rt="start">Retake this test</button>
        <button type="button" class="btn-ghost" data-rt="copy">Copy result</button>
        <button type="button" class="btn-ghost" data-act="print">Print / Save PDF</button>
        <button type="button" class="btn-ghost" data-rt="home">Choose another role</button>
      </div>
      <p class="rt-note">A knowledge check on concepts — it shows what you recognise, not how well you build or explain. Practise explaining with the tutor's mock interviews.</p>`;
  }

  function render() {
    root.innerHTML = state.view === "home" ? home() : state.view === "setup" ? setup() : state.view === "quiz" ? question() : results();
    if (state.view === "results") animateRings();
    if (state.view === "quiz") root.querySelector(state.answers[state.index] ? ".rt-next" : ".rt-opt")?.focus({ preventScroll: true });
  }

  function answer(choice) {
    if (state.answers[state.index]) return;
    state.answers[state.index] = { choice, guess: state.guess };
    render();
  }

  function next() {
    state.guess = false;
    if (state.index + 1 < state.items.length) { state.index += 1; render(); return; }
    state.result = E.scoreTest(state.items, state.answers);
    const key = roleKey(state.role, state.choice);
    history[key] = [...(history[key] || []), { date: Date.now(), pct: state.result.pct, topics: Object.fromEntries(state.result.topics.map((t) => [t.id, t.pct])) }].slice(-20);
    save(HISTORY, history);
    show("results");
  }

  function copyResult() {
    const r = state.result;
    const lines = [`Role readiness: ${roleKey(state.role, state.choice)} — ${r.pct}% (${r.level.name})`, `${r.correct}/${r.total} correct · ${r.misconceptions.length} misconceptions`, "", ...[...r.topics].sort((a, b) => b.pct - a.pct).map((t) => `${t.label}: ${t.pct}%${t.core ? " (core)" : ""}`), "", r.studyNext.length ? `Study next: ${r.studyNext.map((t) => t.label).join(", ")}` : ""];
    navigator.clipboard?.writeText(lines.join("\n")).then(() => flash("Result copied"), () => flash("Copy isn't available here"));
  }
  function flash(text) {
    const t = document.getElementById("toast");
    if (!t) return;
    t.textContent = text; t.hidden = false;
    clearTimeout(flash.timer); flash.timer = setTimeout(() => { t.hidden = true; }, 2200);
  }

  root.addEventListener("click", (e) => {
    const b = e.target.closest("[data-rt], [data-rt-role], [data-rt-choice], [data-rt-opt]");
    if (!b) return;
    if (b.dataset.rtRole != null) { state.role = BANK.roles[Number(b.dataset.rtRole)]; state.choice = state.role.choice ? state.role.choice.options[0] : null; return show("setup"); }
    if (b.dataset.rtChoice) { state.choice = b.dataset.rtChoice; return render(); }
    if (b.dataset.rtOpt != null) return answer(Number(b.dataset.rtOpt));
    const act = b.dataset.rt;
    if (act === "home") show("home");
    else if (act === "start") { Object.assign(state, { items: E.buildTest(BANK, state.role, state.choice), answers: [], index: 0, guess: false }); show("quiz"); }
    else if (act === "next") next();
    else if (act === "quit") { if (!state.answers.length || confirm("Quit this test? Your answers so far won't be saved.")) show("setup"); }
    else if (act === "copy") copyResult();
  });
  root.addEventListener("change", (e) => { if (e.target.matches("[data-rt-guess]")) state.guess = e.target.checked; });
  document.addEventListener("keydown", (e) => {
    if (state.view !== "quiz" || !root.closest(".panel")?.classList.contains("active") || /input|textarea|select/i.test(document.activeElement?.tagName) && !document.activeElement.matches("[data-rt-guess]")) return;
    const answered = state.answers[state.index];
    const n = "1234".indexOf(e.key) >= 0 ? "1234".indexOf(e.key) : "abcd".indexOf(e.key.toLowerCase());
    if (!answered && n >= 0 && n < state.items[state.index].options.length && !e.ctrlKey && !e.metaKey) { e.preventDefault(); answer(n); }
    else if (!answered && e.key.toLowerCase() === "g") { state.guess = !state.guess; const box = root.querySelector("[data-rt-guess]"); if (box) box.checked = state.guess; }
    else if (answered && e.key === "Enter") { e.preventDefault(); next(); }
  });

  // Deep link: #roletest/<role-slug> opens that role's setup (the tutor's role cards link here).
  function openFromHash() {
    const m = /^#roletest\/([a-z0-9-]+)$/.exec(location.hash);
    const role = m && BANK.roles.find((r) => slug(r.name) === m[1]);
    if (!role) return false;
    Object.assign(state, { role, choice: role.choice ? role.choice.options[0] : null });
    state.view = "setup";
    render();
    return true;
  }
  addEventListener("hashchange", openFromHash);
  if (!openFromHash()) render();
})();
