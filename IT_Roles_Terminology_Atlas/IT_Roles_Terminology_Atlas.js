(() => {
  if (window.atlasRedirecting) return; // atlas-ui.js is moving this page into the tutor
  const A = window.ATLAS;
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(?:^-)|(?:-$)/g, "");
  /** "Kafka (event streaming)" → "Kafka": drops a trailing "( … )" group and the spaces before it. */
  const withoutParenSuffix = (s) => {
    if (!s.endsWith(")")) return s;
    const open = s.indexOf("(");
    return open < 0 ? s : s.slice(0, open).trimEnd();
  };
  const famName = (id) => (A.families.find((f) => f.id === id) || {}).name || id;
  const highlight = (text, q) => {
    const safe = esc(text);
    const tokens = String(q || "").trim().split(/\s+/).filter((t) => t.length > 1);
    if (!tokens.length) return safe;
    const re = new RegExp(`(${tokens.map((t) => esc(t).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "ig");
    return safe.replace(re, "<mark>$1</mark>");
  };
  const roleNamesText = (r) => { const n = A.roleNames[r.name]; return n ? [...n.aka, n.services, n.product, n.startup] : []; };
  const roleText = (r) => [r.name, ...roleNamesText(r), r.what, r.why || "", r.ai || "", famName(r.family), ...r.languages, ...r.frameworks, ...r.tools, ...r.skills, ...(r.soft || [])].join(" ").toLowerCase();
  const termText = (g) => [g.t, g.f || "", g.d, g.c].join(" ").toLowerCase();
  const NEW = '<span class="new-badge">New</span>';
  /** "🇩🇪" → "DE"; anything else (e.g. 🌐 for remote work) → "". */
  const flagCode = (f) => [...String(f || "")].map((c) => c.codePointAt(0)).every((n) => n >= 0x1f1e6 && n <= 0x1f1ff) && f
    ? [...f].map((c) => String.fromCharCode(c.codePointAt(0) - 0x1f1e6 + 65)).join("") : "";

  /* ---------- Icons: one inline sprite, line style (24px grid, currentColor stroke) ---------- */
  const ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    stairs: '<path d="M3 20h5v-5h5v-5h5V5h3"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
    book: '<path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H20v15H5.5A1.5 1.5 0 0 0 4 19.5zM4 19.5A1.5 1.5 0 0 0 5.5 21H20v-3"/>',
    layers: '<path d="M12 3 2.5 8 12 13l9.5-5zM2.5 12.5 12 17.5l9.5-5M2.5 16.5 12 21.5l9.5-5"/>',
    rupee: '<path d="M6 4h12M6 9h12M9 4c3.5 0 6 1.6 6 5s-2.5 5-6 5H6l8 7"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    flow: '<rect x="3" y="3" width="7" height="6" rx="1.5"/><rect x="14" y="15" width="7" height="6" rx="1.5"/><path d="M10 6h4a3 3 0 0 1 3 3v6"/>',
    sparkles: '<path d="M11 3l1.9 5.1L18 10l-5.1 1.9L11 17l-1.9-5.1L4 10l5.1-1.9zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
    code: '<path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
    database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    cloud: '<path d="M7 19a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 17.8 11.5 3.8 3.8 0 0 1 17.5 19z"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="m8 12.5 3 3 5-6"/>',
    shield: '<path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
    pen: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    building: '<path d="M4 21V6l8-3 8 3v15M2 21h20M9 9h.01M15 9h.01M9 13h.01M15 13h.01M10 21v-4h4v4"/>',
    headset: '<path d="M4 15v-3a8 8 0 0 1 16 0v3M4 15h3v5H5a1 1 0 0 1-1-1zM20 15h-3v5h2a1 1 0 0 0 1-1z"/>',
    chart: '<path d="M3 21h18M6 17v-6M11 17V5M16 17v-9M21 17v-4"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 3h6v3H9zM9 11h6M9 15h4"/>',
    layout: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
    rocket: '<path d="M12 2c3.5 2.5 5 7 3 13H9C7 9 8.5 4.5 12 2zM9 15l-3 4h3M15 15l3 4h-3M12 7.5v2"/>',
    pulse: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6M16 4.5a3.5 3.5 0 0 1 0 7M18 14c2.4.6 4 2.9 4 6"/>',
    server: '<rect x="3" y="4" width="18" height="7" rx="1.5"/><rect x="3" y="13" width="18" height="7" rx="1.5"/><path d="M7 7.5h.01M7 16.5h.01"/>',
    phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
    message: '<path d="M4 5h16v11H9l-5 4z"/>',
    cpu: '<rect x="6" y="6" width="12" height="12" rx="1.5"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
    file: '<path d="M14 3H6v18h12V7zM14 3v4h4"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>',
    wallet: '<path d="M4 7h15a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12v3"/><path d="M16 13.5h.01"/>',
    bookmark: '<path d="M6 3h12v18l-6-4-6 4z"/>',
    compare: '<path d="M7 4 3 8l4 4M3 8h14M17 12l4 4-4 4M21 16H7"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>'
  };
  document.body.insertAdjacentHTML("afterbegin", `<svg width="0" height="0" style="position:absolute" aria-hidden="true">${Object.entries(ICONS)
    .map(([k, p]) => `<symbol id="i-${k}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${p}</symbol>`).join("")}</svg>`);
  const icon = (k, cls = "") => `<svg class="ic ${cls}" aria-hidden="true"><use href="#i-${k}"/></svg>`;
  const FAM_ICON = { ai: "sparkles", dev: "code", data: "database", ops: "cloud", qa: "check", sec: "shield", design: "pen", arch: "building", support: "headset", biz: "chart" };
  const famIcon = (id) => icon(FAM_ICON[id] || "briefcase");
  const TAB_ICON = { overview: "home", mypath: "compass", ladder: "stairs", roles: "briefcase", roletest: "target", glossary: "book", stack: "layers", salary: "rupee", pay: "wallet", abroad: "globe", lifecycle: "flow" };
  document.querySelectorAll(".tabs button").forEach((b) => b.insertAdjacentHTML("afterbegin", icon(TAB_ICON[b.dataset.tab])));
  const QUICK_ICON = { roles: "briefcase", salary: "rupee", abroad: "globe", mypath: "compass", roletest: "target" };
  document.querySelectorAll(".quick-card").forEach((b) => b.insertAdjacentHTML("afterbegin", `<span class="q-ic">${icon(QUICK_ICON[b.dataset.tab] || "sparkles")}</span>`));

  /* ---------- Chart tooltip: any element with data-tip (HTML, already escaped) ---------- */
  const tipEl = document.createElement("div");
  tipEl.className = "viz-tip"; tipEl.hidden = true; tipEl.setAttribute("role", "tooltip");
  document.body.appendChild(tipEl);
  const placeTip = (x, y) => {
    const r = tipEl.getBoundingClientRect();
    tipEl.style.left = `${Math.min(Math.max(8, x + 14), innerWidth - r.width - 8)}px`;
    tipEl.style.top = `${y + 18 + r.height > innerHeight ? y - r.height - 12 : y + 18}px`;
  };
  const showTip = (el, x, y) => { tipEl.innerHTML = el.dataset.tip; tipEl.hidden = false; placeTip(x, y); };
  document.addEventListener("pointermove", (e) => {
    const el = e.target.closest?.("[data-tip]");
    if (el) showTip(el, e.clientX, e.clientY); else tipEl.hidden = true;
  });
  document.addEventListener("focusin", (e) => {
    const el = e.target.closest?.("[data-tip]");
    if (el) { const r = el.getBoundingClientRect(); showTip(el, r.left, r.bottom - 10); }
  });
  document.addEventListener("focusout", () => { tipEl.hidden = true; });
  addEventListener("scroll", () => { tipEl.hidden = true; }, { passive: true });

  /* ---------- Storage, theme, toast ---------- */
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch {} }
  };
  const loadJSON = (k, d) => { try { return JSON.parse(store.get(k)) ?? d; } catch { return d; } };

  /* ---------- Profile (filled on welcome.html). Without one, nothing on the page is personalised. ---------- */
  const profile = loadJSON("atlas-profile", null);
  const storageOk = (() => { try { localStorage.setItem("atlas-t", "1"); localStorage.removeItem("atlas-t"); return true; } catch { return false; } })();
  // First visit goes to the welcome page; shared links (#roles/…, #compare/…) open directly.
  if (!profile && storageOk && !location.hash) { location.replace("welcome.html"); return; }
  const personal = !!profile && !profile.skipped;
  const firstName = personal && profile.name ? profile.name.trim().split(/\s+/)[0] : "";
  const greeting = firstName ? `Hi, ${esc(firstName)}` : "My profile";
  $("#profileBtn").innerHTML = personal
    ? `<span class="avatar">${esc((firstName || "Me")[0].toUpperCase())}</span><span class="pb-text">${greeting}</span>`
    : `${icon("user")}<span class="pb-text">Set up profile</span>`;
  $("#profileBtn").title = personal ? "Edit your profile" : "Tell us about you to see personal recommendations";
  // Scroll to an element and keep it marked until the next click elsewhere, so a search result is easy to spot.
  const jumpTo = (el, block = "center") => {
    if (!el) return;
    window.atlasReveal?.(el);
    document.querySelectorAll(".target").forEach((x) => x.classList.remove("target"));
    el.classList.add("target");
    el.scrollIntoView({ block, behavior: "smooth" });
  };
  document.addEventListener("pointerdown", (e) => { if (!e.target.closest(".target, .search-results")) document.querySelectorAll(".target").forEach((x) => x.classList.remove("target")); });
  // Click or Enter/Space on a [data-*] row inside a container (chart rows are role="button").
  const onPick = (box, sel, fn) => {
    box.addEventListener("click", (e) => { const r = e.target.closest(sel); if (r) fn(r); });
    box.addEventListener("keydown", (e) => { const r = e.target.closest(sel); if (r && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); fn(r); } });
  };
  const roleBySlug = (s) => A.roles.findIndex((r) => slug(r.name) === s);

  /* ---------- Personal state: saved items + compare list (this browser only) ---------- */
  const saved = Object.assign({ roles: [], terms: [] }, loadJSON("atlas-saved", {}));
  const saveSaved = () => store.set("atlas-saved", JSON.stringify(saved));
  const toggleSaved = (kind, s) => {
    const on = !saved[kind].includes(s);
    saved[kind] = on ? [...saved[kind], s] : saved[kind].filter((x) => x !== s);
    saveSaved(); return on;
  };
  let compareList = loadJSON("atlas-compare", []).filter((s) => roleBySlug(s) >= 0).slice(0, 3);
  const saveCompare = () => store.set("atlas-compare", JSON.stringify(compareList));
  document.documentElement.dataset.theme = store.get("atlas-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  // Animated page changes (View Transitions API) where supported and motion is welcome.
  const calm = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const transition = (update) => (document.startViewTransition && !calm() ? document.startViewTransition(update) : update());
  const themeIcon = () => { $("#themeToggle").innerHTML = icon(document.documentElement.dataset.theme === "dark" ? "sun" : "moon"); };
  themeIcon();
  $("#themeToggle").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    transition(() => { document.documentElement.dataset.theme = next; themeIcon(); });
    store.set("atlas-theme", next);
  });
  let toastTimer;
  const toast = (msg) => {
    const t = $("#toast");
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => (t.hidden = true), 1800);
  };
  const toTop = $("#toTop");
  addEventListener("scroll", () => { toTop.hidden = scrollY < 600; }, { passive: true });
  toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- Tabs & routing (#tab or #tab/item) ---------- */
  const onShow = {}; // per-tab hooks, e.g. lazy-load live feeds
  function showTab(id, { hash = id, scroll = true } = {}) {
    if (!document.getElementById(id) || !document.getElementById(id).classList.contains("panel")) id = hash = "overview";
    const current = document.querySelector(".panel.active");
    const swap = () => document.querySelectorAll(".panel").forEach((p) => p.classList.toggle("active", p.id === id));
    // The animated switch shows the new panel a moment later; callers wait for `shown` before scrolling in it.
    const shown = current && current.id !== id ? Promise.resolve(transition(swap)?.updateCallbackDone).catch(() => {}) : (swap(), Promise.resolve());
    document.querySelectorAll(".tabs button").forEach((b) => {
      const on = b.dataset.tab === (id === "compare" ? "roles" : id);
      b.classList.toggle("active", on);
      if (on) b.scrollIntoView({ block: "nearest", inline: "nearest" });
    });
    if (location.hash.slice(1) !== hash) history.replaceState(null, "", `#${hash}`);
    if (scroll) scrollTo({ top: 0 });
    onShow[id]?.();
    return shown;
  }
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-tab]");
    if (t) { e.preventDefault(); showTab(t.dataset.tab); }
  });
  function route() {
    const [tab, item] = decodeURIComponent(location.hash.slice(1)).split("/");
    if (tab === "roles" && item) {
      const i = A.roles.findIndex((r) => slug(r.name) === item);
      if (i >= 0) return openRole(i);
    }
    if (tab === "compare" && item) {
      const list = item.split(",").filter((s) => roleBySlug(s) >= 0).slice(0, 3);
      if (list.length >= 2) {
        compareList = list; saveCompare(); renderTray();
        return openCompare();
      }
    }
    if (tab === "glossary" && item) {
      const i = A.glossary.findIndex((g) => slug(g.t) === item);
      if (i >= 0) return goTerm(i);
    }
    // Pay & Tax keeps its sub-view in the link (#pay/offers, #pay/world).
    if (tab === "pay" && item) return showTab("pay", { hash: `pay/${item}` });
    // Role Test opens one role's setup (#roletest/tech-lead); role-test-ui.js reads the rest.
    if (tab === "roletest" && item) return showTab("roletest", { hash: `roletest/${item}` });
    // A page's sub-tab (#ladder/titles, #salary/market, #abroad/live).
    if (item && window.atlasShowSub?.(tab, item)) return showTab(tab, { hash: `${tab}/${item}` });
    // #compare without roles: the comparison of the saved compare list, or Roles.
    if (tab === "compare") return compareList.length >= 2 ? openCompare() : showTab("roles");
    showTab(tab || "overview");
  }
  addEventListener("hashchange", route);

  /* ---------- Overview ---------- */
  $("#heroCounts").textContent = `${A.roles.length} roles · ${A.glossary.length} terms · ${A.stack.reduce((n, s) => n + s.items.length, 0)} technologies · salaries & visas — explained simply, with examples.`;

  const POPULAR = ["FDE", "RAG", "System Design", "Kubernetes", "SRE", "Spring Boot", "CTC", "Microservices"];
  document.querySelector("[data-quick-ai]").addEventListener("click", () => {
    termState.q = ""; termState.cat = "AI & ML"; $("#termFilter").value = "";
    renderCatChips(); renderGlossary(); showTab("glossary");
  });

  // Each tile: icon + name + a bar for its role count (one series, shared scale across tiles).
  const famCount = (id) => A.roles.filter((r) => r.family === id).length;
  const maxFam = Math.max(...A.families.map((f) => famCount(f.id)));
  $("#familyCards").innerHTML = A.families.map((f) => {
    const n = famCount(f.id);
    return `<button class="family${f.isNew ? " family-new" : ""}" data-family="${f.id}" title="${esc(f.desc)}">
      <span class="fam-ic">${famIcon(f.id)}</span>
      <span class="fam-body"><b>${esc(f.name)}${f.isNew ? NEW : ""}</b><small>${esc(f.desc)}</small>
        <span class="fam-bar" data-tip="<b>${esc(f.name)}</b><br>${n} roles"><span style="width:${(n / maxFam) * 100}%"></span></span></span>
      <span class="fam-n">${n}</span></button>`;
  }).join("");
  $("#familyCards").addEventListener("click", (e) => {
    const b = e.target.closest("[data-family]");
    if (!b) return;
    roleState.family = b.dataset.family; roleState.q = ""; roleState.ids = null; $("#roleFilter").value = "";
    renderRoleChips(); renderRoles(); showTab("roles");
  });

  /* ---------- Ladder ---------- */
  // Year ranges from the data, used by the ladder and salary bands alike.
  // "4–8" → exp in [4, 8); "12–15+" / "15+" → exp ≥ lower bound; "0" → first year.
  const inYears = (y, exp) => {
    const [a, b] = y.replace(/\+/g, "").split("–").map(Number);
    if (y.endsWith("+")) return exp >= a;
    if (b == null) return exp < a + 1;
    return exp >= a && exp < b;
  };
  /* Range chart: x = years of experience, one bar per level; open-ended ("15+") bars fade out to the right. */
  const LAD_X = 22;
  const spanEnd = (a, b, open) => {
    if (b == null) return open ? a + 5 : a + 1;
    return open ? b + 3 : b;
  };
  const yrsSpan = (y) => {
    const open = y.endsWith("+"), [a, b] = y.replace(/\+/g, "").split("–").map(Number);
    return [a, Math.min(LAD_X, spanEnd(a, b, open)), open];
  };
  const pctX = (v, max) => `${(v / max) * 100}%`;
  const axisHtml = (ticks, max, fmt) => `<div class="rc-row rc-axis"><span class="rc-label"></span><span class="rc-track">${ticks.map((t) =>
    `<span class="rc-tick${t >= max ? " end" : ""}" style="left:${pctX(t, max)}">${fmt(t)}</span>`).join("")}</span></div>`;
  let ladderSel = null;
  const LN = A.levelNames;
  function renderLadder() {
    const all = [...A.ladder.ic, ...A.ladder.mgmt];
    if (!all.some((s) => s.level === ladderSel)) ladderSel = ((personal && A.ladder.ic.find((s) => inYears(s.years, sal.exp))) || A.ladder.ic[2]).level;
    const you = Math.min(sal.exp, LAD_X);
    const row = (s, cls) => {
      const [a, b, open] = yrsSpan(s.years), me = personal && inYears(s.years, sal.exp);
      const tip = `<b>${s.level} · ${esc(s.title)}</b><br>${esc(s.years)} yrs${me ? " · <em>matches your experience</em>" : ""}`;
      return `<div class="rc-row${me ? " me" : ""}${ladderSel === s.level ? " sel" : ""}" role="button" tabindex="0" data-lvl="${s.level}" data-tip="${esc(tip)}">
        <span class="rc-label"><b>${s.level}</b> ${esc(s.title.split(" / ")[0])}</span>
        <span class="rc-track">${personal ? `<span class="rc-you" style="left:${pctX(you, LAD_X)}"></span>` : ""}<span class="rc-bar ${cls}${open ? " open" : ""}" style="left:${pctX(a, LAD_X)};width:${pctX(Math.max(b - a, 0.6), LAD_X)}"></span></span></div>`;
    };
    const group = (title, cls, list) => `<div class="rc-group"><span class="sw ${cls}"></span>${title}</div>${list.slice().reverse().map((s) => row(s, cls)).join("")}`;
    $("#ladderChart").style.setProperty("--gs", pctX(5, LAD_X));
    $("#ladderChart").innerHTML = `<div class="rc-legend"><span><i class="sw s1"></i>Technical (IC)</span><span><i class="sw s2"></i>Management</span>${personal ? `<span><i class="sw you"></i>You · ${sal.exp} yrs</span>` : `<a class="btn-link" href="welcome.html">Add your experience to see where you are →</a>`}</div>
      ${group("Individual contributor — keep building", "s1", A.ladder.ic)}${group("Management — lead people", "s2", A.ladder.mgmt)}
      ${axisHtml([0, 5, 10, 15, 20], LAD_X, (t) => `${t}${t === 20 ? "+" : ""}`)}`;
    const s = all.find((x) => x.level === ladderSel), mg = A.ladder.mgmt.includes(s);
    $("#ladderDetail").innerHTML = `<span class="detail-ic ${mg ? "s2" : "s1"}">${icon(mg ? "users" : "code")}</span>
      <div><span class="lvl">${s.level} · ${esc(s.years)} yrs</span><h3>${esc(s.title)}</h3><p>${esc(s.scope)}</p><p class="aka">Also called: ${esc(s.aka)}</p>
        <span class="c-label">Same level elsewhere</span><ul class="co-list">${LN.companies.map((c, k) => `<li><b>${c}</b><span>${esc(LN.levels[s.level][k])}</span></li>`).join("")}</ul></div>`;
  }
  const pickLevel = (el) => { ladderSel = el.dataset.lvl; renderLadder(); $(`#ladderChart [data-lvl="${ladderSel}"]`)?.focus({ preventScroll: true }); };
  onPick($("#ladderChart"), "[data-lvl]", pickLevel);
  $("#ladderNotes").innerHTML = A.ladder.notes.map((n) => `<li>${esc(n)}</li>`).join("");
  // Same level, different names: levels × companies.
  $("#levelMatrix").innerHTML = `<thead><tr><th>Level</th>${LN.companies.map((c) => `<th>${c}</th>`).join("")}</tr></thead><tbody>${[...A.ladder.ic, ...A.ladder.mgmt].map((l) =>
    `<tr><th scope="row"><b>${l.level}</b> ${esc(l.title.split(" / ")[0])}</th>${LN.levels[l.level].map((t) => `<td>${esc(t)}</td>`).join("")}</tr>`).join("")}</tbody>`;
  $("#levelNote").textContent = LN.note;
  onShow.ladder = renderLadder;

  /* ---------- Roles ---------- */
  /* Skill matching: split items like "AWS/Azure/GCP" or "C# / .NET" into comparable parts. */
  const STOP = new Set(["varies", "basics", "etc", "and"]);
  const GENERIC = /\b(apis?|basics|framework|platform)\b/g; // so "REST APIs" matches "REST/GraphQL/gRPC APIs"
  const parts = (s) => String(s).toLowerCase().split(/[/,()+|&]|\bor\b/)
    .map((x) => x.replace(GENERIC, "").replace(/\s+/g, " ").trim()).filter((x) => x.length > 1 && !STOP.has(x));
  const roleItems = (r) => [...new Set([...r.languages, ...r.frameworks, ...r.tools, ...r.skills])];
  const rolePartSets = A.roles.map((r) => new Set(roleItems(r).flatMap(parts)));
  const covers = (set, item) => parts(item).some((p) => set.has(p));
  // Personal matching only once the user has given a profile.
  const mySkillSet = () => new Set(personal ? sal.skills.flatMap(parts) : []);

  /* Long language/framework/tool lists are alternatives ("Java, Python, C#, Go…"): you need a few, not all.
   * Lists of 5+ count as "pick N"; shorter lists and skills are all expected. */
  const CAPS = { languages: 2, frameworks: 3, tools: 4 };
  const CAT_W = { languages: 0.2, frameworks: 0.25, tools: 0.2, skills: 0.35 };
  const PLACEHOLDER = /team's main stack|^varies$/i;
  function gapAnalysis(r, set) {
    let w = 0, sc = 0;
    const have = [], need = [], pick = [], cats = [];
    Object.keys(CAT_W).forEach((k) => {
      const arr = (r[k] || []).filter((x) => !PLACEHOLDER.test(x));
      if (!arr.length) return;
      const cap = k !== "skills" && arr.length >= 5 ? CAPS[k] : arr.length;
      const got = arr.filter((x) => covers(set, x)), left = arr.filter((x) => !got.includes(x));
      have.push(...got);
      if (cap < arr.length) { if (got.length < cap) pick.push({ n: cap - got.length, items: left }); }
      else need.push(...left);
      sc += CAT_W[k] * Math.min(got.length, cap) / cap; w += CAT_W[k];
      cats.push({ k, got: Math.min(got.length, cap), cap, alt: cap < arr.length });
    });
    const steps = need.length + pick.reduce((n, p) => n + p.n, 0);
    const gap = [...need, ...pick.map((p) => `${p.n} of ${p.items.slice(0, 3).join(" / ")}${p.items.length > 3 ? "…" : ""}`)];
    return { have: [...new Set(have)], need, pick, cats, steps, gap, pct: w ? Math.round((sc / w) * 100) : 0 };
  }
  const matchRole = (i, set = mySkillSet()) => gapAnalysis(A.roles[i], set);
  const CAT_LABEL = { languages: "Languages", frameworks: "Frameworks", tools: "Tools", skills: "Skills" };
  function similarRoles(i, n = 4) {
    const a = rolePartSets[i];
    return A.roles.map((_, j) => {
      if (j === i) return null;
      const b = rolePartSets[j]; let x = 0;
      a.forEach((p) => { if (b.has(p)) x++; });
      return { j, s: x / (a.size + b.size - x || 1) };
    }).filter((o) => o && o.s > 0.12).sort((p, q) => q.s - p.s).slice(0, n);
  }

  // ids/label: a "roles that use <term>" filter set from the glossary.
  const roleState = { q: "", family: "all", sort: "default", ids: null, label: "" };
  const resetRoleFilters = () => { Object.assign(roleState, { q: "", family: "all", ids: null, label: "" }); $("#roleFilter").value = ""; renderRoleChips(); renderRoles(); };
  let visibleRoles = A.roles.map((_, i) => i);
  /** 2 = strong match, 1 = partial, 0 = weak (badge colour). */
  const matchLevel = (pct) => {
    if (pct >= 60) return 2;
    return pct >= 35 ? 1 : 0;
  };
  function renderRoleChips() {
    $("#familyChips").innerHTML = [{ id: "all", name: "All" }, { id: "saved", name: `Saved (${saved.roles.length})` }, ...A.families]
      .map((f) => `<button class="chip${roleState.family === f.id ? " active" : ""}" data-fam="${f.id}">${esc(f.name)}</button>`).join("");
  }
  function renderRoles() {
    const q = roleState.q.trim().toLowerCase();
    const tokens = q.split(/\s+/).filter(Boolean);
    const me = mySkillSet();
    const pct = new Map(A.roles.map((_, i) => [i, me.size ? matchRole(i, me).pct : 0]));
    visibleRoles = A.roles.map((r, i) => i).filter((i) => {
      const r = A.roles[i];
      const famOk = roleState.family === "all" || r.family === roleState.family || (roleState.family === "saved" && saved.roles.includes(slug(r.name)));
      return famOk && (!roleState.ids || roleState.ids.includes(i)) && tokens.every((t) => roleText(r).includes(t));
    });
    if (roleState.sort === "match") visibleRoles.sort((a, b) => pct.get(b) - pct.get(a));
    $("#roleSort").closest("label").hidden = !personal;
    $("#roleSort").value = roleState.sort;
    const usesLabel = visibleRoles.length === 1 ? "role uses" : "roles use";
    $("#roleCount").innerHTML = roleState.ids
      ? `<span class="uses-banner">${icon("book")} <b>${visibleRoles.length} ${usesLabel} “${esc(roleState.label)}”</b> <button class="btn-link" type="button" data-clear-roles>Show all roles</button></span>`
      : `${visibleRoles.length} of ${A.roles.length} roles`;
    $("#roleGrid").innerHTML = visibleRoles.map((idx) => {
      const r = A.roles[idx];
      const pills = [...r.languages.slice(0, 3), ...r.frameworks.slice(0, 3)].map((p) => `<span class="pill${me.size && covers(me, p) ? " pill-have" : ""}">${highlight(p, q)}</span>`).join("");
      const badges = (saved.roles.includes(slug(r.name)) ? `<span class="star-on" title="Saved">★</span>` : "")
        + (me.size ? `<span class="match-badge m${matchLevel(pct.get(idx))}" title="Share of this role's stack you already have">${pct.get(idx)}% match</span>` : "");
      return `<button class="role" data-role="${idx}"><span class="card-top"><span class="fam-tag">${famIcon(r.family)}${esc(famName(r.family))}</span>${badges ? `<span class="card-badges">${badges}</span>` : ""}</span>
        <h3>${highlight(r.name, q)}${r.isNew ? NEW : ""}</h3><p>${highlight(r.what, q)}</p><div class="pills">${pills}</div></button>`;
    }).join("") || `<div class="empty">${roleState.family === "saved" && !saved.roles.length ? "No saved roles yet — open a role and press ☆ Save." : "No roles match."} <button class="btn-link" data-clear-roles>Clear filters</button></div>`;
    restoreRoleView();
  }
  $("#roleCount").addEventListener("click", (e) => { if (e.target.closest("[data-clear-roles]")) resetRoleFilters(); });
  $("#roleSort").addEventListener("change", (e) => { roleState.sort = e.target.value; renderRoles(); });
  $("#familyChips").addEventListener("click", (e) => {
    const c = e.target.closest("[data-fam]");
    if (!c) return;
    roleState.family = c.dataset.fam; renderRoleChips(); renderRoles();
  });
  $("#roleFilter").addEventListener("input", (e) => { roleState.q = e.target.value; renderRoles(); });
  $("#roleGrid").addEventListener("click", (e) => {
    if (e.target.closest("[data-clear-roles]")) return resetRoleFilters();
    const c = e.target.closest("[data-role]");
    if (c) openRole(+c.dataset.role, c);
  });

  /* Link role pills to glossary terms / stack entries, so readers can dig deeper. */
  const linkMap = new Map();
  const addLink = (key, target) => { const k = key.toLowerCase().trim(); if (k.length > 1 && !linkMap.has(k)) linkMap.set(k, target); };
  A.glossary.forEach((g, i) => {
    const link = { type: "term", i };
    addLink(g.t, link);
    if (g.f) addLink(g.f, link);
    g.t.split(/ \/ | \(/).forEach((p) => addLink(p.replace(/\)$/, ""), link));
  });
  A.stack.forEach((s, si) => s.items.forEach((it) => {
    addLink(it.n, { type: "stack", si });
    it.n.split(/ \/ | \+ /).forEach((p) => addLink(p, { type: "stack", si }));
  }));
  const findLink = (x) => linkMap.get(x.toLowerCase()) || linkMap.get(withoutParenSuffix(x).toLowerCase());

  /* Roles that have a salary track. */
  const salaryTrackFor = (name) => A.salary.tracks.findIndex((t) => t.track === (A.salary.alias[name] || name));

  /* ---------- In-place panels (no dialogs): a role or a comparison opens right below what was clicked ---------- */
  const views = { role: null, cmp: null }; // { el, i, inGrid }
  const makeView = (kind) => {
    const el = document.createElement("section");
    el.className = `inline-view inline-${kind}`; el.setAttribute("aria-live", "polite");
    return el;
  };
  // Put a panel after the clicked thing: below the whole row of role cards, below a glossary row,
  // below the flow chart / another panel, or below the top-level block of the current tab.
  function placeAfter(view, anchor) {
    const card = anchor?.closest(".role-grid > .role");
    if (card) {
      let last = card;
      for (let n = card.nextElementSibling; n?.classList.contains("role") && n.offsetTop === card.offsetTop; n = n.nextElementSibling) last = n;
      last.after(view); return true;
    }
    const row = anchor?.closest("#glossBody tr");
    if (row) {
      const tr = document.createElement("tr"), td = tr.insertCell();
      tr.className = "inline-row"; td.className = "inline-cell"; td.colSpan = row.cells.length;
      td.appendChild(view); row.after(tr); return false;
    }
    let host = anchor?.closest(".inline-view, .fc, .fc-band");
    if (!host && anchor?.closest(".panel")) { host = anchor; while (!host.parentElement.classList.contains("panel")) host = host.parentElement; }
    if (host) { host.after(view); return false; }
    // No anchor in the page (search, shared link, compare tray): top of the current tab, under its heading.
    const p = $(".panel.active");
    (p.querySelector(":scope > .hint") || p.querySelector(":scope > .panel-head") || p.querySelector(":scope > .lead") || p.querySelector(":scope > .h2")).after(view);
    return false;
  }
  function closeView(kind) {
    const v = views[kind];
    if (!v) return;
    const row = v.el.closest(".inline-row");
    (row || v.el).remove();
    views[kind] = null;
    if (/^#(roles|compare)\//.test(location.hash)) history.replaceState(null, "", `#${$(".panel.active").id}`);
  }
  const reveal = (el) => { el.scrollIntoView({ block: "nearest", behavior: "smooth" }); el.querySelector("h2")?.focus({ preventScroll: true }); };

  function openRole(i, anchor) {
    let shown = null;
    if (!anchor) { // search result or shared link: show it in the Roles tab, under its card
      shown = showTab("roles", { scroll: false });
      if (!visibleRoles.includes(i)) { roleState.q = ""; roleState.family = "all"; $("#roleFilter").value = ""; renderRoleChips(); renderRoles(); }
      anchor = $(`#roleGrid [data-role="${i}"]`);
    }
    const v = views.role;
    if (v && v.el.isConnected && v.el.contains(anchor)) v.i = i; // e.g. "Similar roles": swap content in place
    else {
      closeView("role");
      const el = makeView("role");
      views.role = { el, i, inGrid: placeAfter(el, anchor) };
    }
    renderRoleView();
    // The tab buttons switch at once; the panel may still be animating in.
    if ($(".tabs button.active")?.dataset.tab === "roles") history.replaceState(null, "", `#roles/${slug(A.roles[i].name)}`);
    // Coming from another tab, scroll once the Roles panel is on screen (scrolling a hidden panel does nothing).
    const el = views.role.el;
    if (shown) shown.then(() => requestAnimationFrame(() => { el.scrollIntoView({ block: "start", behavior: "smooth" }); el.querySelector("h2")?.focus({ preventScroll: true }); }));
    else reveal(el);
  }
  // The roles grid is re-rendered on filter/sort/save; put an open panel back under its card.
  function restoreRoleView() {
    const v = views.role;
    if (!v || !v.inGrid || v.el.isConnected) return;
    const card = $(`#roleGrid [data-role="${v.i}"]`);
    if (card) placeAfter(v.el, card); else views.role = null;
  }
  const NAME_AT = [["building", "IT services", "TCS, Infosys, Wipro, Accenture", "services"], ["layers", "Product & Big Tech", "Amazon, Google, Microsoft, GCCs", "product"], ["rocket", "Startups", "", "startup"]];
  function renderRoleView() {
    const i = views.role.i, r = A.roles[i], n = A.roleNames[r.name];
    const me = mySkillSet();
    /** Languages, Frameworks, Tools, Skills and Soft skills as sub-tabs: one group shown at a time. */
    const stackTabsHtml = (role, mine) => {
      const groups = [["Languages", role.languages], ["Frameworks", role.frameworks], ["Tools", role.tools], ["Skills", role.skills], ["Soft skills", role.soft]].filter(([, a]) => a && a.length);
      if (!groups.length) return "";
      return `<h4 class="sub">Skills &amp; stack</h4>
        <div class="stack-tabs" role="tablist" aria-label="Skills and stack">${groups.map(([label, a], k) =>
          `<button type="button" role="tab" class="${k ? "" : "active"}" data-act="stack-tab" data-k="${k}" aria-selected="${!k}">${label} <small>${a.length}</small></button>`).join("")}</div>
        ${groups.map(([label, a], k) => `<div class="stack-pane" role="tabpanel" aria-label="${label}" data-k="${k}"${k ? " hidden" : ""}><div class="pills">${a.map((x) => linkPill(x, mine)).join("")}</div></div>`).join("")}`;
    };
    const row = (label, arr) => arr && arr.length ? `<dt>${label}</dt><dd><div class="pills">${arr.map((x) => linkPill(x, me)).join("")}</div></dd>` : "";
    const ti = salaryTrackFor(r.name);
    const sim = similarRoles(i);
    views.role.el.innerHTML = `<div class="iv-head"><div><span class="fam-tag">${famIcon(r.family)}${esc(famName(r.family))}</span><h2 tabindex="-1">${esc(r.name)}${r.isNew ? NEW : ""}</h2><p class="what">${esc(r.what)}</p></div>
        <button class="iv-close" type="button" data-act="close-view" data-kind="role" aria-label="Close ${esc(r.name)}">✕</button></div>
      <div class="role-actions">${saveBtn(i)}${cmpBtn(i)}<button class="btn-ghost" type="button" data-act="plan-to" data-i="${i}">Plan a switch here →</button><button class="btn-ghost" type="button" data-act="copy-role" data-i="${i}">Copy link</button><button class="btn-ghost" type="button" data-act="print">Print / PDF</button></div>
      ${n ? `<div class="names">
        <div class="names-aka"><span class="c-label">Also called</span><div class="pills">${n.aka.map((a) => `<span class="pill">${esc(a)}</span>`).join("")}</div></div>
        <div class="names-at">${NAME_AT.map(([ic, label, eg, k]) => `<div class="at"><span class="at-ic">${icon(ic)}</span><span><small>${label}${eg ? ` · ${eg}` : ""}</small><b>${esc(n[k])}</b></span></div>`).join("")}</div>
      </div>` : ""}
      ${forYouHtml(i, me)}
      ${stackTabsHtml(r, me)}
      ${ti >= 0 ? `<h4 class="sub">Skill roadmap <small class="muted">what's expected as you grow · ✓ = you have it</small></h4>${roadmapHtml(ti, me)}` : ""}
      ${sim.length ? `<h4 class="sub">Similar roles <small class="muted">by shared stack</small></h4><div class="pills">${sim.map((o) =>
        `<button class="pill pill-link" type="button" data-act="open-role" data-i="${o.j}">${esc(A.roles[o.j].name)} <small>${Math.round(o.s * 100)}%</small></button>`).join("")}</div>` : ""}
      ${ti >= 0 ? `<button class="btn btn-block" type="button" data-act="go-salary" data-i="${ti}">See salary &amp; skill check for this role →</button>` : ""}`;
  }

  /* Shared pieces for the role panel, compare view and My Path. */
  function linkPill(x, me) {
    const l = findLink(x), have = me && me.size && covers(me, x);
    const cls = `pill${have ? " pill-have" : ""}`, label = `${have ? "✓ " : ""}${esc(x)}`;
    if (l) {
      const title = `${have ? "You have this · " : ""}Learn more`;
      return `<button class="${cls} pill-link" type="button" data-link='${JSON.stringify(l)}' title="${title}">${label}</button>`;
    }
    const title = have ? ' title="You have this"' : "";
    return `<span class="${cls}"${title}>${label}</span>`;
  }
  function saveBtn(i) {
    const on = saved.roles.includes(slug(A.roles[i].name));
    return `<button class="btn-ghost${on ? " on" : ""}" type="button" data-act="save-role" data-i="${i}" aria-pressed="${on}">${icon("bookmark")}${on ? "Saved" : "Save"}</button>`;
  }
  function cmpBtn(i) {
    const on = compareList.includes(slug(A.roles[i].name));
    return `<button class="btn-ghost${on ? " on" : ""}" type="button" data-act="cmp" data-i="${i}" aria-pressed="${on}">${icon("compare")}${on ? "In compare" : "Compare"}</button>`;
  }
  function salaryAt(ti, exp) {
    const b = bandFor(S.tracks[ti], exp), m = payMult();
    return [roundL(b.lpa[0] * m), roundL(b.lpa[1] * m)];
  }
  const roleKey = (i) => { const ti = salaryTrackFor(A.roles[i].name); return ti >= 0 ? profileOf(ti).key : null; };
  const hotCountries = (key) => AB.countries.filter((k) => (k.demand[key] || 0) === 2).sort((a, b) => a.rank - b.rank).slice(0, 3);
  const countriesHtml = (key) => {
    const hot = hotCountries(key);
    const ti = S.tracks.findIndex((_, t) => profileOf(t).key === key);
    return hot.length ? hot.map((k) => `<span class="pill" data-tip="${esc(`<b>${k.c}</b><br>${payAbroad(k.c, ti, sal.exp).text} at ${sal.exp} yrs<br>${k.oddsText} · usually ${k.minExp}+ yrs`)}">${esc(k.c)}${sal.exp < k.minExp ? ` <small>(${k.minExp}+ yrs)</small>` : ""}</span>`).join("")
      : `<span class="muted">No high-demand country in our list</span>`;
  };
  /** One roadmap item: its alternatives ("Java|Kotlin") and whether the user has any of them. */
  const roadmapItem = (x, me) => {
    const alts = x.split("|");
    return { alts, ok: me.size && alts.some((a) => covers(me, a)) };
  };
  const roadmapPill = ({ alts, ok }) => {
    const title = alts.length > 1 ? ` title="Any of: ${esc(alts.join(", "))}"` : "";
    const more = alts.length > 1 ? ` <small>or ${alts.length - 1} more</small>` : "";
    return `<span class="pill${ok ? " pill-have" : ""}"${title}>${ok ? "✓ " : ""}${esc(alts[0])}${more}</span>`;
  };
  function roadmapStep(label, arr, n, me) {
    const items = arr.map((x) => roadmapItem(x, me));
    const done = items.filter((x) => x.ok).length;
    return `<div class="rm-step"><span class="rm-dot">${n}</span><label>${label} <b class="rm-count">${done}/${arr.length}</b></label>
        <span class="rm-bar"><span style="width:${(done / arr.length) * 100}%"></span></span><div class="pills">${items.map(roadmapPill).join("")}</div></div>`;
  }
  function roadmapHtml(ti, me) {
    const p = profileOf(ti);
    return `<div class="roadmap">${roadmapStep("Start · 0–3 yrs", p.core, 1, me)}${roadmapStep("Grow · 4+ yrs", p.adv, 2, me)}${roadmapStep("Lead · 7+ yrs", p.senior, 3, me)}</div>`;
  }
  /** "Expected at 5 yrs and missing: A, B." / "Next to learn: …" / "You cover everything…" */
  function nextToLearn(next, hasTrack) {
    if (!next.length) return hasTrack ? ` You cover everything expected at ${sal.exp} yrs.` : "";
    const lead = hasTrack ? `Expected at ${sal.exp} yrs and missing` : "Next to learn";
    const more = next.length > 5 ? ` +${next.length - 5}` : "";
    return ` ${lead}: ${next.slice(0, 5).map(esc).join(", ")}${more}.`;
  }
  const coverageRow = (c) => `<div class="cov-row" data-tip="<b>${CAT_LABEL[c.k]}</b><br>${c.got} of ${c.cap}${c.alt ? " (pick any)" : ""}">
          <span>${CAT_LABEL[c.k]}</span><span class="cov-track"><span style="width:${(c.got / c.cap) * 100}%"></span></span><b>${c.got}/${c.cap}</b></div>`;
  function matchHtml(m, ti) {
    // Prefer the curated, experience-aware expectations from the salary profile; fall back to the role's own stack.
    const next = ti >= 0 ? evaluate(ti, sal.skills, sal.exp).missing.map((g) => g.split("|")[0]) : m.gap;
    const items = `${m.have.length} item${m.have.length === 1 ? "" : "s"}`;
    return `<div class="fy-match">
        <p><b>${m.pct}% match</b> — you already have ${items} from this role's stack.${nextToLearn(next, ti >= 0)}</p>
        <div class="cov">${m.cats.map(coverageRow).join("")}</div></div>`;
  }
  function forYouHtml(i, me) {
    const ti = salaryTrackFor(A.roles[i].name), key = roleKey(i);
    const m = matchRole(i, me);
    const lines = [];
    if (me.size) lines.push(matchHtml(m, ti));
    if (ti >= 0 && personal) lines.push(`<p><b>Pay at ${sal.exp} yrs</b> (${esc(S.cities[sal.city].n.split(" (")[0])}, ${esc(S.companies[sal.company].n)}): <b>${range(salaryAt(ti, sal.exp))}</b> typical</p>`);
    if (key) lines.push(`<div class="fy-countries"><b>In demand abroad:</b> <span class="pills">${countriesHtml(key)}</span></div>`);
    const head = personal || me.size
      ? `<h3>For you</h3>`
      : `<h3>Personal fit <a class="btn-link fy-cta" href="welcome.html">Add your profile →</a></h3>`;
    return `<div class="for-you">${head}${lines.join("")}</div>`;
  }

  /* ---------- Glossary ---------- */
  const termState = { q: "", cat: "all" };
  function renderCatChips() {
    $("#catChips").innerHTML = ["all", ...A.glossaryCats]
      .map((c) => `<button class="chip${termState.cat === c ? " active" : ""}" data-cat="${esc(c)}">${c === "all" ? "All" : esc(c)}</button>`).join("");
  }
  /** "In 3 roles →": opens the roles whose stack mentions this term. */
  const usedByButton = (g, used) => {
    if (!used.length) return "";
    const roles = `${used.length} role${used.length > 1 ? "s" : ""}`;
    return `<button class="btn-link used-by" type="button" data-act="used-by" data-list="${used.join(",")}" data-term="${esc(g.t)}">In ${roles} →</button>`;
  };
  function renderGlossary() {
    const q = termState.q.trim().toLowerCase();
    const tokens = q.split(/\s+/).filter(Boolean);
    const list = A.glossary
      .map((g, i) => ({ g, i }))
      .filter(({ g }) => (termState.cat === "all" || g.c === termState.cat) && tokens.every((t) => termText(g).includes(t)))
      .sort((a, b) => a.g.t.localeCompare(b.g.t));
    $("#termCount").textContent = `${list.length} of ${A.glossary.length} terms`;
    const firstOf = {};
    list.forEach(({ g, i }) => { const L = letterOf(g.t); if (!(L in firstOf)) firstOf[L] = i; });
    $("#azBar").innerHTML = AZ.map((L) => `<button type="button" data-az="${L}"${L in firstOf ? "" : " disabled"}>${L}</button>`).join("");
    $("#glossBody").innerHTML = list.map(({ g, i }) => {
      const s = slug(g.t), on = saved.terms.includes(s), used = termRoles(i);
      return `<tr id="term-${i}"${firstOf[letterOf(g.t)] === i ? ` data-letter="${letterOf(g.t)}"` : ""}><td>
        <button class="star${on ? " on" : ""}" type="button" data-act="save-term" data-s="${s}" aria-pressed="${on}" aria-label="${on ? "Remove from saved" : "Save term"}">${on ? "★" : "☆"}</button>${highlight(g.t, q)}${g.f ? `<small>${highlight(g.f, q)}</small>` : ""}
        ${usedByButton(g, used)}</td>
      <td>${highlight(g.d, q)}</td><td>${esc(g.c)}</td></tr>`;
    }).join("")
      || `<tr><td colspan="3"><div class="empty">No terms match. <button class="btn-link" data-clear-terms>Clear filters</button></div></td></tr>`;
  }
  const AZ = ["#", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
  const letterOf = (t) => { const c = t[0].toUpperCase(); return c >= "A" && c <= "Z" ? c : "#"; };
  $("#azBar").addEventListener("click", (e) => {
    const b = e.target.closest("[data-az]");
    const row = b && $(`#glossBody tr[data-letter="${b.dataset.az}"]`);
    jumpTo(row, "start");
  });
  /* Roles whose description or stack mentions a term (whole-word match), computed once per term. */
  const termRoleCache = new Map();
  const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  function termRoles(i) {
    if (termRoleCache.has(i)) return termRoleCache.get(i);
    const g = A.glossary[i];
    const names = [withoutParenSuffix(g.t), ...g.t.split(/ \/ /), g.f || ""].map((n) => n.trim()).filter((n) => n.length > 1);
    const res = names.map((n) => new RegExp(`(^|[^a-z0-9])${reEsc(n.toLowerCase())}([^a-z0-9]|$)`));
    const out = A.roles.map((r, k) => (res.some((re) => re.test(roleText(r))) ? k : -1)).filter((k) => k >= 0);
    termRoleCache.set(i, out);
    return out;
  }
  $("#catChips").addEventListener("click", (e) => {
    const c = e.target.closest("[data-cat]");
    if (!c) return;
    termState.cat = c.dataset.cat; renderCatChips(); renderGlossary();
  });
  $("#termFilter").addEventListener("input", (e) => { termState.q = e.target.value; renderGlossary(); });
  $("#glossBody").addEventListener("click", (e) => {
    if (e.target.closest("[data-clear-terms]")) { termState.q = ""; termState.cat = "all"; $("#termFilter").value = ""; renderCatChips(); renderGlossary(); }
  });
  function goTerm(i) {
    termState.q = ""; termState.cat = "all"; $("#termFilter").value = "";
    renderCatChips(); renderGlossary();
    showTab("glossary", { hash: `glossary/${slug(A.glossary[i].t)}` });
    const row = document.getElementById(`term-${i}`);
    jumpTo(row);
  }

  /* ---------- Stack ---------- */
  const LAYER_ICON = [[/language/i, "code"], [/frontend/i, "layout"], [/backend/i, "server"], [/mobile/i, "phone"], [/database/i, "database"], [/cloud/i, "cloud"],
    [/ai infra/i, "cpu"], [/devops|infra/i, "flow"], [/monitor/i, "pulse"], [/messag/i, "message"], [/test/i, "check"], [/genai/i, "sparkles"], [/coding/i, "bolt"], [/ai/i, "cpu"], [/collab/i, "users"]];
  const layerIcon = (name) => (LAYER_ICON.find(([re]) => re.test(name)) || [, "layers"])[1];
  $("#stackGrid").innerHTML = A.stack.map((s, si) => `<article class="stack-card" id="stack-${si}"><h3><span class="stack-ic">${icon(layerIcon(s.layer))}</span>${esc(s.layer)}${s.isNew ? NEW : ""}</h3><ul>
    ${s.items.map((it) => `<li><b>${esc(it.n)}</b><span>${esc(it.u)}</span></li>`).join("")}</ul></article>`).join("");
  function goStack(si, ii) {
    showTab("stack");
    const card = document.getElementById(`stack-${si}`);
    jumpTo((ii != null && card.querySelectorAll("li")[ii]) || card);
  }

  /* ---------- Salary (India): estimator + resume skill builder ---------- */
  const S = A.salary;
  const SK = new Map(S.skills.map((s) => [s.n.toLowerCase(), s]));
  const lakh = (n) => (n >= 100 ? `${+(n / 100).toFixed(2)} Cr` : `${n} LPA`);
  const range = ([a, b]) => (b >= 100 ? `${lakh(a)} – ${lakh(b)}` : `${a}–${b} LPA`);
  const roundL = (n) => (n < 10 ? Math.round(n * 2) / 2 : Math.round(n));
  const clamp = (n, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, n));
  const bandFor = (track, exp) => track.rows.find((r) => inYears(r.y, exp)) ||
    (exp < parseFloat(track.rows[0].y) ? track.rows[0] : track.rows[track.rows.length - 1]);
  const profileOf = (ti) => S.profiles.find((p) => p.track === S.tracks[ti].track);
  const info = (name) => SK.get(name.toLowerCase());
  const fits = (sk, key) => !!sk && (sk.t === "*" || sk.t.split(" ").includes(key));
  const expectedFor = (p, exp) => [...p.core, ...(exp >= 4 ? p.adv : []), ...(exp >= 7 ? p.senior : [])];
  const hasGroup = (g, set) => g.split("|").some((n) => set.has(n.toLowerCase()));
  const shortTrack = (t) => t.replace(/ \(.*\)$/, "");

  const midOf = (r) => (r[0] + r[1]) / 2;
  const payMult = () => S.cities[sal.city].m * S.companies[sal.company].m * S.workModes[sal.mode].m;

  const SAL_KEY = "atlas-salary";
  const sal = Object.assign({ track: 0, exp: 4, city: 0, company: 0, mode: 0, skills: [] },
    loadJSON(SAL_KEY, {}));
  [["track", S.tracks], ["city", S.cities], ["company", S.companies], ["mode", S.workModes]].forEach(([k, arr]) => { if (!arr[sal[k]]) sal[k] = 0; });
  if (!Array.isArray(sal.skills)) sal.skills = [];
  const saveSal = () => store.set(SAL_KEY, JSON.stringify(sal));
  const ui = { allTips: false, allSug: false };

  const opts = (arr, f) => arr.map((x, i) => `<option value="${i}">${esc(f(x))}</option>`).join("");
  $("#salTrack").innerHTML = opts(S.tracks, (t) => t.track + (t.isNew ? " ✦" : ""));
  $("#salCity").innerHTML = opts(S.cities, (c) => c.n);
  $("#salCompany").innerHTML = opts(S.companies, (c) => c.n);
  $("#salMode").innerHTML = opts(S.workModes, (c) => c.n);
  $("#skillList").innerHTML = S.skills.map((s) => `<option value="${esc(s.n)}">${esc(s.c)}</option>`).join("");
  $("#salaryNote").textContent = S.disclaimer;
  $("#reality").innerHTML = `<b>Market reality · ${esc(S.asOf)}</b>` + S.reality.map((r) =>
    `<span>${esc(r.f)} <a href="${esc(r.src)}" target="_blank" rel="noopener" title="Source">↗</a></span>`).join("");
  const syncControls = () => {
    $("#salTrack").value = sal.track; $("#myExp").value = sal.exp;
    $("#salCity").value = sal.city; $("#salCompany").value = sal.company; $("#salMode").value = sal.mode;
  };

  /* Score a skill list against a track at an experience level. */
  function evaluate(ti, skills, exp) {
    const p = profileOf(ti), key = p.key;
    const set = new Set(skills.map((s) => s.toLowerCase()));
    const known = skills.filter((s) => info(s));
    const relevant = known.filter((s) => fits(info(s), key));
    const unrelated = known.filter((s) => !fits(info(s), key));
    const unknown = skills.filter((s) => !info(s));
    const expected = expectedFor(p, exp);
    const missing = expected.filter((g) => !hasGroup(g, set));
    const coverage = expected.length ? (expected.length - missing.length) / expected.length : 0;
    const expectedNames = new Set(expected.flatMap((g) => g.split("|")).map((n) => n.toLowerCase()));
    const bonus = relevant.filter((s) => !expectedNames.has(s.toLowerCase())).reduce((n, s) => n + info(s).b, 0);
    const limitIndex = exp >= 8 ? 1 : 0;
    const wide = Object.entries(S.focusLimits).map(([cat, lim]) => {
      const items = known.filter((s) => info(s).c === cat);
      return items.length > lim[limitIndex] ? { cat, items } : null;
    }).filter(Boolean);
    const extraT = Math.min(bonus / 12, 1); // high-value skills beyond the expected set (~5–6 strong extras to max out)
    const penalty = Math.min(wide.length * 0.05, 0.15) + Math.min(unrelated.length * 0.03, 0.1);
    const score = clamp(coverage * 0.75 + extraT * 0.25 - penalty);
    return { p, known, relevant, unrelated, unknown, expected, missing, wide, coverage, extraT, penalty, score };
  }

  /* Estimated LPA range.
   * All expected skills and nothing extra = the band's typical range. Missing skills or penalties pull it below
   * typical; high-value extras on top of full coverage push it toward the potential range. */
  function estimate(ti, exp, ev) {
    const band = bandFor(S.tracks[ti], exp);
    const m = payMult();
    const f = clamp(0.7 + 0.3 * ev.coverage - ev.penalty, 0.5, 1);
    const t = ev.extraT * ev.coverage;
    const lo = band.lpa[0] * f + (band.pot[0] - band.lpa[0]) * t;
    const hi = band.lpa[1] * f + (band.pot[1] - band.lpa[1]) * t;
    return [roundL(lo * m), roundL(hi * m)];
  }

  function suggestions(ev) {
    const set = new Set(sal.skills.map((s) => s.toLowerCase()));
    const fromMissing = ev.missing.map((g) => ({ n: g.split("|")[0], alt: g.split("|").slice(1).join(" / "), why: "expected" }));
    const extra = S.skills
      .filter((s) => s.b >= 2 && fits(s, ev.p.key) && s.t !== "*" && !set.has(s.n.toLowerCase()) && !fromMissing.some((m) => m.n === s.n))
      .filter((s) => !(S.focusLimits[s.c] && ev.known.some((k) => info(k).c === s.c)))
      .sort((a, b) => b.b - a.b)
      .map((s) => ({ n: s.n, why: "boost" }));
    return [...fromMissing, ...extra].slice(0, 12);
  }

  const level = (v, steps) => steps.find(([min]) => v >= min) || steps[steps.length - 1];

  /** How a skill counts for the chosen track: scored and relevant, scored but off-track, or unknown. */
  function skillStatus(sk, key, role) {
    if (!sk) return { cls: "unknown", tip: "Not in catalog — not scored" };
    return fits(sk, key) ? { cls: "ok", tip: sk.c } : { cls: "off", tip: `Not relevant to ${role}` };
  }
  function renderMySkills(ev, role) {
    $("#skillCount").textContent = sal.skills.length ? `· ${sal.skills.length}` : "";
    if (!sal.skills.length) {
      $("#mySkills").innerHTML = `<p class="empty-inline">No skills yet. Type one above or click <b>Fill typical</b>.</p>`;
      return;
    }
    $("#mySkills").innerHTML = sal.skills.map((s, i) => {
      const { cls, tip } = skillStatus(info(s), ev.p.key, role);
      return `<span class="skill ${cls}" title="${esc(tip)}">${esc(s)}<button type="button" data-rm="${i}" aria-label="Remove ${esc(s)}">×</button></span>`;
    }).join("");
  }

  function suggestionTitle(s, exp) {
    if (s.why !== "expected") return "Raises your range";
    return `Expected at ${exp} yrs${s.alt ? ` (or ${esc(s.alt)})` : ""}`;
  }
  /** "Less", "+3 more", "Show less", "2 more tips": toggles for lists that start collapsed. */
  const moreLabel = (expanded, hidden, collapsedLabel) => (expanded ? collapsedLabel : hidden);
  function renderSuggestions(ev, exp) {
    const sug = suggestions(ev);
    if (!sug.length) {
      $("#suggestBox").innerHTML = "";
      return;
    }
    const shown = ui.allSug ? sug : sug.slice(0, 6);
    const chips = shown.map((s) => `<button class="chip sug sug-${s.why}" data-add="${esc(s.n)}" title="${suggestionTitle(s, exp)}">+ ${esc(s.n)}</button>`).join("");
    const more = sug.length > 6 ? `<button class="btn-link" data-more-sug>${moreLabel(ui.allSug, `+${sug.length - 6} more`, "Less")}</button>` : "";
    $("#suggestBox").innerHTML = `<label>Add next</label><div class="chips">${chips}
        ${more}</div>`;
  }

  const FOCUS_LEVELS = [[85, "Focused", "good"], [65, "Mixed", "mid"], [0, "Scattered", "bad"]];
  const STRENGTH_LEVELS = [[0.85, "Strong", "good"], [0.6, "Good", "good-ish"], [0.35, "Fair", "mid"], [0, "Weak", "bad"]];
  function setMeter(name, label, cls, width) {
    $(`#${name}Label`).textContent = label;
    $(`#${name}Label`).className = cls;
    $(`#${name}Bar`).style.width = width;
    $(`#${name}Bar`).className = cls;
  }
  function renderMeters(ev, role, exp) {
    const relPct = ev.known.length ? Math.round((ev.relevant.length / ev.known.length) * 100) : 0;
    const [, relName, relCls] = ev.known.length ? level(relPct, FOCUS_LEVELS) : [0, "—", ""];
    setMeter("rel", relName, relCls, `${relPct}%`);
    $("#relText").textContent = ev.known.length ? `${ev.relevant.length}/${ev.known.length} fit ${role}` : "";
    const [, strName, strCls] = sal.skills.length ? level(ev.score, STRENGTH_LEVELS) : [0, "—", ""];
    setMeter("str", strName, strCls, `${Math.round(ev.score * 100)}%`);
    $("#strText").textContent = `${ev.expected.length - ev.missing.length}/${ev.expected.length} expected at ${exp} yrs`;
  }

  /** Where the user's pay sits against the estimated range. */
  function payVerdict(ctc, [lo, hi]) {
    if (ctc < lo) return "below this range — worth negotiating or moving";
    if (ctc > hi) return "above this range — you're paid well for this profile";
    return "within this range";
  }
  function renderEstimate(ti, exp, ev, role) {
    const est = estimate(ti, exp, ev);
    $("#estLpa").textContent = range(est);
    const ctc = personal && +profile.ctc;
    $("#estYou").innerHTML = ctc ? `You earn <b>${esc(ctc)} LPA</b> · ${payVerdict(ctc, est)}` : "";
    $("#estBasis").textContent = `${role} · ${exp} yrs · ${S.cities[sal.city].n.split(" (")[0]} · ${S.companies[sal.company].n}`;
    return est;
  }

  /** "Pick one cloud…", "Pick one (e.g. Java) and go deep…", "Master one (e.g. …)". */
  function deepAdvice(w) {
    if (w.cat === "Cloud") return "Pick one cloud and get to Professional level.";
    if (w.cat === "Backend Language") return `Pick one (e.g. ${esc(w.items[0])}) and go deep: internals, performance, concurrency.`;
    return `Master one (e.g. ${esc(w.items[0])}).`;
  }
  /** The track the user's skills fit better than the chosen one, when the difference is clear. */
  function betterTrackTip(ev, role) {
    const fitCount = S.profiles.map((p) => ({ p, n: ev.known.filter((s) => fits(info(s), p.key)).length, ti: S.tracks.findIndex((t) => t.track === p.track) }));
    const cur = fitCount.find((f) => f.p.key === ev.p.key);
    const best = fitCount.filter((f) => f.p.key !== ev.p.key).sort((a, b) => b.n - a.n)[0];
    if (!best || best.n < 3 || best.n < cur.n + 2) return null;
    return { k: "switch", h: `Your skills say <b>${esc(shortTrack(best.p.track))}</b>, not ${esc(role)} (${best.n} vs ${cur.n} relevant). <button class="btn-link" data-switch="${best.ti}">Switch</button>` };
  }
  function unrelatedTip(ev, role) {
    if (!ev.unrelated.length) return null;
    const items = ev.unrelated.slice(0, 4).map((s) => {
      const sk = info(s);
      const home = S.profiles.filter((p) => fits(sk, p.key)).map((p) => shortTrack(p.track))[0] || sk.hint || "another role";
      return `<b>${esc(s)}</b> (${esc(home)})`;
    });
    const more = ev.unrelated.length > 4 ? ` +${ev.unrelated.length - 4} more` : "";
    return { k: "warn", h: `Drop ${items.join(", ")}${more} — irrelevant for ${esc(role)}.` };
  }
  function summaryTip(ev, role, exp) {
    if (!sal.skills.length) return null;
    if (!ev.unrelated.length && !ev.wide.length && ev.score >= 0.85) {
      return { first: true, k: "ok", h: `Strong for ${exp} yrs. Now prove each skill with a project or a number on your resume.` };
    }
    if (ev.missing.length) return null;
    const boosts = suggestions(ev).slice(0, 3).map((s) => `<b>${esc(s.n)}</b>`);
    const beat = boosts.length ? ` To beat it, add ${boosts.join(", ")}.` : "";
    return { k: "ok", h: `You match the typical ${exp}-yr ${esc(role)}, so the estimate is the typical range.${beat}` };
  }
  /** Blunt advice, most important first. Missing expected skills are already the blue "Add next" chips. */
  function adviceTips(ev, role, exp) {
    const tips = [];
    if (!sal.skills.length) tips.push({ k: "info", h: "Add your skills, or click <b>Fill typical</b> to start from the usual set." });
    const better = betterTrackTip(ev, role);
    if (better) tips.push(better);
    const unrelated = unrelatedTip(ev, role);
    if (unrelated) tips.push(unrelated);
    ev.wide.forEach((w) => tips.push({ k: "wide", h: `${w.items.map(esc).join(" + ")} at ${exp} yrs reads as shallow. ${deepAdvice(w)}` }));
    if (sal.skills.length > 25) tips.push({ k: "wide", h: `${sal.skills.length} skills is padding. Cut to the 15–20 that matter.` });
    if (ev.unknown.length) tips.push({ k: "info", h: `Not scored: ${ev.unknown.map(esc).join(", ")}.` });
    const summary = summaryTip(ev, role, exp);
    if (summary?.first) tips.unshift({ k: summary.k, h: summary.h });
    else if (summary) tips.push(summary);
    return tips;
  }
  function renderAdvice(tips) {
    const tipsShown = ui.allTips ? tips : tips.slice(0, 2);
    const hidden = tips.length - 2;
    const hiddenLabel = `${hidden} more tip${hidden > 1 ? "s" : ""}`;
    const more = tips.length > 2 ? `<button class="btn-link" data-more-tips>${moreLabel(ui.allTips, hiddenLabel, "Show less")}</button>` : "";
    $("#advice").innerHTML = tipsShown.map((t) => `<p class="tip tip-${t.k}">${t.h}</p>`).join("") + more;
  }

  function renderBuilder() {
    const ti = sal.track, exp = sal.exp, role = shortTrack(S.tracks[ti].track);
    const ev = evaluate(ti, sal.skills, exp);
    renderMySkills(ev, role);
    renderSuggestions(ev, exp);
    renderMeters(ev, role, exp);
    const est = renderEstimate(ti, exp, ev, role);
    renderAdvice(adviceTips(ev, role, exp));
    return est;
  }

  function renderSalary() {
    const t = S.tracks[sal.track];
    $("#trackStack").textContent = `· ${shortTrack(t.track)}`;
    salBand = null; // follow the user's own band after any change
    renderSalChart(t, renderBuilder());
    saveSal();
    updateQuickPath();
  }
  /* Range chart: typical (dark) and top-paying potential (light) per experience band, plus your estimate.
   * Clicking a row shows that band's description underneath; by default it's the user's own band. */
  let salBand = null;
  /** "0", "40L", "1.5 Cr": an amount in lakh as an axis label. */
  const lakhLabel = (v) => {
    if (v === 0) return "0";
    return v >= 100 ? `${+(v / 100).toFixed(2)} Cr` : `${v}L`;
  };
  /** One experience band of the salary chart; the user's own band also shows their estimate. */
  function salaryRow(r, k, { sel, est, max, bar }) {
    const me = inYears(r.y, sal.exp);
    const estLabel = personal ? "Your estimate" : "Estimate";
    const tip = `<b>${esc(r.y)} yrs</b><br>Typical ${range(r.lpa)}<br>Top-paying ${range(r.pot)}${me ? `<br><em>${estLabel} ${range(est)}</em>` : ""}`;
    const youLabel = personal ? "You" : "Selected";
    const youTag = me ? ` <em class="you-tag">${youLabel}</em>` : "";
    const estBar = me ? `<span class="rc-est" style="left:${pctX(est[0], max)};width:${pctX(Math.max(est[1] - est[0], max / 120), max)}"></span>` : "";
    return `<div class="rc-row${me ? " me" : ""}${k === sel ? " sel" : ""}" role="button" tabindex="0" data-band="${k}" data-tip="${esc(tip)}"><span class="rc-label"><b>${esc(r.y)}</b> yrs${youTag}</span>
          <span class="rc-track">${bar("t2", r.pot)}${bar("t1", r.lpa)}${estBar}</span></div>`;
  }
  /** Axis tick spacing in LPA for a chart whose largest value is `top`. */
  const tickStep = (top) => {
    if (top > 80) return 25;
    return top > 40 ? 10 : 5;
  };
  function renderSalChart(t, est) {
    const sel = salBand ?? Math.max(0, t.rows.findIndex((r) => inYears(r.y, sal.exp)));
    const top = Math.max(...t.rows.map((r) => r.pot[1]), est[1]);
    const step = tickStep(top), max = Math.ceil(top / step) * step;
    const ticks = Array.from({ length: max / step + 1 }, (_, k) => k * step);
    const bar = (cls, [a, b]) => `<span class="rc-bar ${cls}" style="left:${pctX(a, max)};width:${pctX(Math.max(b - a, max / 120), max)}"></span>`;
    $("#salChart").style.setProperty("--gs", pctX(step, max));
    $("#salChart").innerHTML = `<div class="rc-legend"><span><i class="sw t1"></i>Typical</span><span><i class="sw t2"></i>Top-paying companies</span><span><i class="sw est"></i>${personal ? "Your estimate" : "Estimate for the inputs above"}</span></div>
      ${t.rows.map((r, k) => salaryRow(r, k, { sel, est, max, bar })).join("")}
      ${axisHtml(ticks, max, lakhLabel)}`;
    const r = t.rows[sel];
    $("#salBand").innerHTML = `<div><label>${esc(r.y)} yrs · typical ${range(r.lpa)}</label><p>${esc(r.s)}</p></div>
      <div><label>To reach ${range(r.pot)}</label><p>${esc(r.up)}</p></div>`;
  }
  const pickBand = (el) => { salBand = +el.dataset.band; renderSalChart(S.tracks[sal.track], estimate(sal.track, sal.exp, evaluate(sal.track, sal.skills, sal.exp))); };
  onPick($("#salChart"), "[data-band]", pickBand);

  function addSkill(raw) {
    const name = raw.trim();
    if (!name) return;
    const canon = info(name)?.n || name;
    if (sal.skills.some((s) => s.toLowerCase() === canon.toLowerCase())) return toast(`${canon} is already added`);
    sal.skills.push(canon);
    renderSalary();
  }
  const skillInput = $("#skillInput");
  const submitSkill = () => { addSkill(skillInput.value); skillInput.value = ""; skillInput.focus(); };
  $("#skillAddBtn").addEventListener("click", submitSkill);
  skillInput.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); submitSkill(); } });
  skillInput.addEventListener("change", () => { if (info(skillInput.value)) submitSkill(); }); // picked from the list
  $("#mySkills").addEventListener("click", (e) => {
    const b = e.target.closest("[data-rm]");
    if (b) { sal.skills.splice(+b.dataset.rm, 1); renderSalary(); }
  });
  $("#suggestBox").addEventListener("click", (e) => {
    if (e.target.closest("[data-more-sug]")) { ui.allSug = !ui.allSug; return renderBuilder(); }
    const b = e.target.closest("[data-add]"); if (b) addSkill(b.dataset.add);
  });
  $("#advice").addEventListener("click", (e) => {
    if (e.target.closest("[data-more-tips]")) { ui.allTips = !ui.allTips; return renderBuilder(); }
    const b = e.target.closest("[data-switch]");
    if (b) { sal.track = +b.dataset.switch; syncControls(); renderSalary(); toast(`Switched to ${shortTrack(S.tracks[sal.track].track)}`); }
  });
  $("#loadTypical").addEventListener("click", () => {
    const before = sal.skills.length;
    expectedFor(profileOf(sal.track), sal.exp).forEach((g) => {
      if (!hasGroup(g, new Set(sal.skills.map((s) => s.toLowerCase())))) sal.skills.push(g.split("|")[0]);
    });
    renderSalary();
    toast(sal.skills.length > before ? `Added ${sal.skills.length - before} typical skills` : "You already have the typical set");
  });
  $("#clearSkills").addEventListener("click", () => { if (!sal.skills.length || confirm("Remove all skills?")) { sal.skills = []; renderSalary(); } });
  $("#copySkills").addEventListener("click", () => {
    if (!sal.skills.length) return toast("Add skills first");
    const groups = {};
    sal.skills.forEach((s) => {
      const c = info(s)?.c || "Other";
      groups[c] ??= [];
      groups[c].push(s);
    });
    const text = Object.entries(groups).map(([c, l]) => `${c}: ${l.join(", ")}`).join("\n");
    copyText(text, "Copied — paste into your resume");
  });
  [["#salTrack", "track"], ["#salCity", "city"], ["#salCompany", "company"], ["#salMode", "mode"]].forEach(([sel, k]) =>
    $(sel).addEventListener("change", (e) => { sal[k] = +e.target.value; renderSalary(); }));
  $("#myExp").addEventListener("input", (e) => {
    const v = parseFloat(e.target.value);
    if (Number.isFinite(v) && v >= 0 && v <= 45) { sal.exp = v; renderSalary(); }
  });
  $("#tierBody").innerHTML = S.tiers.map((t) => `<tr><td>${esc(t.tier)}</td><td>${esc(t.eg)}</td><td>${esc(t.mult)}</td></tr>`).join("");
  $("#boosters").innerHTML = S.boosters.map((b) => `<div class="booster"><b>${esc(b.b)}</b><p>${esc(b.i)}</p></div>`).join("");
  function goTrack(i) { sal.track = i; syncControls(); renderSalary(); showTab("salary"); }
  syncControls();

  /* ---------- Work abroad: country guide + live feeds ---------- */
  const AB = A.abroad;
  $("#abroadAsOf").textContent = AB.asOf;
  $("#abroadNote").textContent = AB.disclaimer;
  $("#payNote").textContent = AB.payNote;
  $("#payAsOf").textContent = `· estimates, ${AB.payAsOf}`;
  $("#howTo").innerHTML = AB.howTo.map((h) => `<li>${esc(h)}</li>`).join("");
  // Role + experience drive "fit". "me" = whatever is set in the Salary tab.
  $("#abroadRole").innerHTML = (personal ? `<option value="me">My profile</option>` : "") + S.tracks.map((t, i) => `<option value="${i}">${esc(t.track)}</option>`).join("");
  const ab = { role: "me", exp: null, sort: "odds" };
  Object.assign(ab, loadJSON("atlas-abroad", {}));
  if (!personal && ab.role === "me") ab.role = String(sal.track);
  const abTrack = () => (ab.role === "me" ? sal.track : +ab.role);
  const abExp = () => (ab.exp ?? sal.exp);
  const DEMAND = [["Low demand", "d0"], ["Some demand", "d1"], ["High demand", "d2"]];
  function fitOf(k) {
    const key = profileOf(abTrack()).key, d = k.demand[key] || 0, under = abExp() < k.minExp;
    return { d, under, score: k.odds * 10 + d * 4 - (under ? 6 : 0) };
  }
  /* Expected pay abroad for a role + experience (+ your skills when it's your profile), in the local currency. */
  const money = (c, v) => (c.cur === "JPY" ? `¥${(v / 1e6).toFixed(1)}M` : `${c.sym}${Math.round(v).toLocaleString("en-US")}`);
  /** Pay rounded to a sensible step: ¥100k, 500 a month, or 1,000 a year. */
  const payStep = (c) => {
    if (c.cur === "JPY") return 100000;
    return c.per === "month" ? 500 : 1000;
  };
  const roundPay = (c, v) => Math.round(v / payStep(c)) * payStep(c);
  function payAbroad(country, ti, exp) {
    const c = AB.pay[country], band = c.bands.filter((b) => exp >= b[0]).pop();
    const mult = AB.payRole[profileOf(ti).key] ?? 1, lo = band[1] * mult, hi = band[2] * mult;
    // Where you sit in the band: your skills when it's your own profile, otherwise the middle.
    let t = 0.5;
    if (personal && ab.role === "me") { const ev = evaluate(ti, sal.skills, exp); t = clamp(0.2 + 0.5 * ev.coverage + 0.3 * ev.extraT - ev.penalty, 0.05, 0.95); }
    const at = lo + (hi - lo) * t, w = (hi - lo) * 0.3;
    const r = [roundPay(c, Math.max(lo * 0.92, at - w)), roundPay(c, Math.min(hi * 1.08, at + w))];
    const lpa = r.map((v) => Math.round((v * (c.per === "month" ? 12 : 1) * c.fx) / 1e5));
    return { c, r, lpa, text: `${money(c, r[0])} – ${money(c, r[1])} / ${c.per}` };
  }
  /** Axis tick spacing (₹ lakh) for the abroad pay chart. */
  const payTickStep = (top) => {
    if (top > 200) return 50;
    return top > 80 ? 25 : 10;
  };
  /** Country order: best fit for the user, highest pay, or the editor's ranking. */
  const COUNTRY_SORTS = {
    fit: (a, b) => b.f.score - a.f.score || a.k.rank - b.k.rank,
    pay: (a, b) => midOf(b.p.lpa) - midOf(a.p.lpa),
  };
  const byRank = (a, b) => a.k.rank - b.k.rank;
  // ₹ comparison chart: every country + India as reference, your current pay marked.
  function renderPayChart(list, ti, exp) {
    const india = personal && ab.role === "me" ? estimate(ti, exp, evaluate(ti, sal.skills, exp)) : salaryAt(ti, exp);
    const ctc = personal && +profile.ctc;
    const rows = [...list.map(({ k, p }) => ({ name: k.c.split(" (")[0], lpa: p.lpa, tip: `<b>${esc(k.c)}</b><br>${esc(p.text)}<br>${esc(p.c.tax)}<br>≈ ₹${p.lpa[0]}–${p.lpa[1]} LPA` })),
      { name: "India (your city)", lpa: india, india: true, tip: `<b>India</b> · ${esc(S.cities[sal.city].n.split(" (")[0])}<br>${range(india)}` }]
      .sort((a, b) => midOf(b.lpa) - midOf(a.lpa));
    const top = Math.max(...rows.map((r) => r.lpa[1]), ctc || 0), step = payTickStep(top), max = Math.ceil(top / step) * step;
    const ticks = Array.from({ length: max / step + 1 }, (_, k) => k * step);
    $("#payChart").style.setProperty("--gs", pctX(step, max));
    $("#payChart").innerHTML = `<div class="rc-legend"><span><i class="sw s1"></i>Abroad (expected range)</span><span><i class="sw s2"></i>India</span>${ctc ? `<span><i class="sw you"></i>You earn ${ctc} LPA</span>` : ""}<span>in ₹ lakh / year, approx. exchange rates</span></div>
      ${rows.map((r) => `<div class="rc-row" data-tip="${esc(r.tip)}"><span class="rc-label">${esc(r.name)}</span>
        <span class="rc-track">${ctc ? `<span class="rc-you" style="left:${pctX(Math.min(ctc, max), max)}"></span>` : ""}<span class="rc-bar ${r.india ? "s2" : "s1"}" style="left:${pctX(r.lpa[0], max)};width:${pctX(Math.max(r.lpa[1] - r.lpa[0], max / 100), max)}"></span></span></div>`).join("")}
      ${axisHtml(ticks, max, (v) => `₹${v}L`)}`;
  }
  function renderCountries() {
    $("#abroadRole").value = ab.role; $("#abroadExp").value = abExp(); $("#abroadSort").value = ab.sort;
    const role = shortTrack(S.tracks[abTrack()].track), exp = abExp();
    const ti = abTrack();
    const list = AB.countries.map((k) => ({ k, f: fitOf(k), p: payAbroad(k.c, ti, exp) }))
      .sort(COUNTRY_SORTS[ab.sort] ?? byRank);
    renderPayChart(list, ti, exp);
    const best = list.slice().sort((a, b) => b.f.score - a.f.score).filter((x) => x.f.d === 2 && !x.f.under).slice(0, 3).map((x) => x.k.c);
    $("#abroadSummary").innerHTML = best.length
      ? `For a <b>${esc(role)}</b> with <b>${exp} yrs</b>, your best bets: <b>${best.map(esc).join(", ")}</b>.`
      : `For a <b>${esc(role)}</b> with <b>${exp} yrs</b>, no country shows high demand at your level — build experience or switch to an in-demand role.`;
    $("#countryGrid").innerHTML = list.map(({ k, f, p }) => `<details class="country o${k.odds}" data-country="${esc(k.c)}">
      <summary>
        <span class="flag" aria-hidden="true">${flagCode(k.flag) || icon("globe")}</span>
        <span class="c-main"><b>${esc(k.c)}</b><small>${esc(k.visa)}</small></span>
        <span class="c-side"><span class="odds o${k.odds}">${esc(k.oddsText)}</span><b class="c-pay">${esc(p.text)}</b><small>≈ ₹${p.lpa[0]}–${p.lpa[1]} LPA</small></span>
        <span class="fit"><span class="demand ${DEMAND[f.d][1]}">${DEMAND[f.d][0]} for ${esc(role)}</span>${f.under ? `<span class="demand d0">Usually needs ${k.minExp}+ yrs</span>` : ""}</span>
      </summary>
      <div class="c-body">
        <p class="c-latest"><b>Latest</b> ${esc(k.latest)}</p>
        <p class="c-blunt">${esc(k.blunt)}</p>
        <p class="c-label">How to get in — best route first</p>
        <ol class="c-how">${k.how.map((h) => `<li>${esc(h)}</li>`).join("")}</ol>
        <dl class="dl"><dt>Expected pay</dt><dd><b>${esc(p.text)}</b> for a ${esc(role)} with ${exp} yrs${personal && ab.role === "me" ? " and your skills" : ""} · ${esc(p.c.tax)} · ≈ ₹${p.lpa[0]}–${p.lpa[1]} LPA</dd><dt>Visa rule</dt><dd>${esc(k.rule)}</dd><dt>Usual minimum</dt><dd>${k.minExp}+ yrs experience</dd></dl>
        <a class="btn-link" href="${esc(k.link)}" target="_blank" rel="noopener">Official source ↗</a>
      </div>
    </details>`).join("");
    store.set("atlas-abroad", JSON.stringify(ab));
  }
  $("#abroadRole").addEventListener("change", (e) => { ab.role = e.target.value; renderCountries(); });
  $("#abroadSort").addEventListener("change", (e) => { ab.sort = e.target.value; renderCountries(); });
  $("#abroadExp").addEventListener("input", (e) => { const v = parseFloat(e.target.value); if (Number.isFinite(v) && v >= 0) { ab.exp = v; renderCountries(); } });
  renderCountries();

  const ago = (t) => {
    const s = (Date.now() - t) / 1000;
    if (!Number.isFinite(s)) return "";
    if (s < 3600) return `${Math.max(1, Math.round(s / 60))} min ago`;
    if (s < 86400) return `${Math.round(s / 3600)} h ago`;
    return `${Math.round(s / 86400)} d ago`;
  };
  const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return ""; } };
  /** True when any of the patterns matches: long keyword lists split into readable groups. */
  const anyOf = (patterns) => ({ test: (text) => patterns.some((re) => re.test(text)) });
  const IT_RE = anyOf([
    /developer|engineer|software|programmer|architect|tester/i,
    /\b(data|sre|ml|ai|qa)\b|devops|cloud|security|machine learning|java|python/i,
    /front.?end|back.?end|full.?stack/i,
  ]);
  const NOT_IT_RE = /business development|sales|account (executive|manager)|marketing|recruiter/i;
  const NEWS_RE = anyOf([
    /h-?1b|visa|green card|blue card|express entry|work permit|immigra/i,
    /layoff|laid off|hiring|outsourc|offshor|tech workers|recruit|talent|employ|salar/i,
    /\bindia|\bjobs?\b/i,
  ]);
  const getJSON = async (url) => {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 15000);
    try {
      const r = await fetch(url, { signal: ctl.signal });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.json();
    } finally {
      clearTimeout(t);
    }
  };
  const FEEDS = {
    visa: {
      credit: [["Arbeitnow", "https://www.arbeitnow.com/?visa_sponsorship=true"]],
      async load() {
        const j = await getJSON("https://www.arbeitnow.com/api/job-board-api?visa_sponsorship=true");
        return (j.data || []).filter((x) => IT_RE.test(x.title) || (x.tags || []).some((t) => IT_RE.test(t)))
          .map((x) => ({ title: x.title, sub: `${x.company_name} · ${x.location}${x.remote ? " · Remote" : ""}`, url: x.url, t: x.created_at * 1000, tags: (x.tags || []).slice(0, 3) }));
      }
    },
    remote: {
      credit: [["Remotive", "https://remotive.com/remote-jobs/software-dev"], ["Jobicy", "https://jobicy.com/"]],
      async load() {
        const OPEN = /worldwide|anywhere|india|asia|apac/i;
        const [r, jb] = await Promise.allSettled([
          getJSON("https://remotive.com/api/remote-jobs?category=software-dev&limit=150"),
          getJSON("https://jobicy.com/api/v2/remote-jobs?count=50&geo=apac")
        ]);
        const a = r.status === "fulfilled" ? (r.value.jobs || []).filter((x) => OPEN.test(x.candidate_required_location || ""))
          .map((x) => ({ title: x.title, sub: `${x.company_name} · ${x.candidate_required_location} · Remotive`, url: x.url, t: Date.parse(x.publication_date), tags: (x.tags || []).slice(0, 3) })) : [];
        const b = jb.status === "fulfilled" ? (jb.value.jobs || []).filter((x) => IT_RE.test(x.jobTitle))
          .map((x) => ({ title: x.jobTitle, sub: `${x.companyName} · ${x.jobGeo} · Jobicy`, url: x.url, t: Date.parse(x.pubDate), tags: [].concat(x.jobIndustry || []).slice(0, 2) })) : [];
        if (!a.length && !b.length && r.status === "rejected" && jb.status === "rejected") throw new Error("both sources failed");
        return [...a, ...b].filter((x) => !NOT_IT_RE.test(x.title)).sort((x, y) => (y.t || 0) - (x.t || 0));
      }
    },
    news: {
      credit: [["Hacker News search (links to original publishers)", "https://hn.algolia.com/"]],
      async load() {
        const since = Math.floor(Date.now() / 1000) - 60 * 86400;
        const qs = ["H-1B", "visa tech workers", "tech layoffs", "hiring freeze", "Blue Card", "India IT jobs", "Express Entry", "skilled worker visa"];
        const res = await Promise.allSettled(qs.map((q) => getJSON(`https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(q)}&tags=story&typoTolerance=false&numericFilters=created_at_i>${since},points>5&hitsPerPage=10`)));
        const seen = new Set(), items = [];
        const hits = res.flatMap((r) => (r.status === "fulfilled" ? r.value.hits || [] : []));
        for (const h of hits) {
          if (seen.has(h.objectID) || !h.title || /^show hn/i.test(h.title) || !NEWS_RE.test(h.title)) continue;
          seen.add(h.objectID);
          const url = h.url || `https://news.ycombinator.com/item?id=${h.objectID}`;
          items.push({ title: h.title, sub: `${host(url)} · ${h.points} points`, url, t: h.created_at_i * 1000, tags: [] });
        }
        if (!items.length && res.every((r) => r.status === "rejected")) throw new Error("news source failed");
        return items.sort((a, b) => b.t - a.t);
      }
    }
  };
  const feed = { cur: "visa", items: [], fetched: 0, limit: 25, loaded: false };
  const cacheKey = (k) => `atlas-feed-${k}`;
  /** Items this tab fetched in the last 30 minutes, or null. */
  function cachedFeed(k) {
    try {
      const c = JSON.parse(sessionStorage.getItem(cacheKey(k)) || "null");
      return c && Date.now() - c.fetched < 30 * 60 * 1000 ? c : null;
    } catch {
      return null; // Storage blocked or corrupt: fetch fresh.
    }
  }
  function storeFeed(k, items, fetched) {
    try {
      sessionStorage.setItem(cacheKey(k), JSON.stringify({ items, fetched }));
    } catch {
      // Storage full or blocked: the feed still shows, it just isn't cached.
    }
  }
  function showFeedLoading(force) {
    const btn = $("#feedRefresh");
    btn.classList.add("loading");
    btn.disabled = true;
    $("#feedUpdated").textContent = "Refreshing…";
    if (!feed.items.length || !force) {
      $("#feedMeta").textContent = "Loading live data…";
      $("#feedList").innerHTML = `<div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div>`;
    }
  }
  const newItemsMessage = (n) => {
    if (!n) return "Up to date — nothing new";
    return `${n} new item${n > 1 ? "s" : ""}`;
  };
  async function loadFeed(force = false) {
    const k = feed.cur, def = FEEDS[k];
    feed.limit = 25;
    const cached = force ? null : cachedFeed(k);
    if (cached) {
      feed.items = cached.items;
      feed.fetched = cached.fetched;
      return renderFeed();
    }
    showFeedLoading(force);
    try {
      const before = force ? new Set(feed.items.map((x) => x.url)) : null;
      const items = await def.load();
      if (feed.cur !== k) return;
      feed.items = items;
      feed.fetched = Date.now();
      storeFeed(k, items, feed.fetched);
      renderFeed();
      if (before) toast(newItemsMessage(items.filter((x) => !before.has(x.url)).length));
    } catch {
      if (feed.cur !== k) return;
      $("#feedMeta").textContent = "";
      stampUpdated();
      $("#feedList").innerHTML = `<div class="empty">Couldn't load live data — you may be offline, or the source is down.
        Open it directly: ${def.credit.map(([n, u]) => `<a class="btn-link" href="${esc(u)}" target="_blank" rel="noopener">${esc(n)} ↗</a>`).join(" ")}</div>`;
    } finally {
      const btn = $("#feedRefresh");
      btn.classList.remove("loading");
      btn.disabled = false;
    }
  }
  function stampUpdated() {
    if (!feed.fetched) { $("#feedUpdated").textContent = ""; return; }
    const d = new Date(feed.fetched);
    $("#feedUpdated").textContent = `Last refreshed ${d.toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" })}, ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · ${Date.now() - feed.fetched < 60000 ? "just now" : ago(feed.fetched)}`;
  }
  setInterval(() => {
    if (!$("#abroad").classList.contains("active")) return;
    if (feed.fetched && Date.now() - feed.fetched > 30 * 60 * 1000 && !$("#feedRefresh").disabled) loadFeed(true);
    else stampUpdated();
  }, 30000);
  function renderFeed() {
    const def = FEEDS[feed.cur];
    const tokens = $("#feedFilter").value.toLowerCase().split(/\s+/).filter(Boolean);
    const list = feed.items.filter((x) => tokens.every((t) => `${x.title} ${x.sub} ${x.tags.join(" ")}`.toLowerCase().includes(t)));
    stampUpdated();
    $("#feedMeta").innerHTML = `${list.length} items · Source: ${def.credit.map(([n, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(n)}</a>`).join(", ")} · auto-refreshes every 30 min`;
    // Feed links come from third-party APIs: only allow web links (no javascript: or data: URLs).
    const safeUrl = (u) => (/^https?:\/\//i.test(String(u || "")) ? u : "#");
    $("#feedList").innerHTML = list.slice(0, feed.limit).map((x) => `<a class="feed-item" href="${esc(safeUrl(x.url))}" target="_blank" rel="noopener noreferrer">
        <b>${highlight(x.title, tokens.join(" "))}</b><small>${esc(x.sub)}${x.t ? ` · ${ago(x.t)}` : ""}</small>
        ${x.tags.length ? `<span class="pills">${x.tags.map((t) => `<span class="pill">${esc(t)}</span>`).join("")}</span>` : ""}</a>`).join("")
      + (list.length > feed.limit ? `<button class="btn-ghost more" data-feed-more>Show more (${list.length - feed.limit})</button>` : "")
      || `<div class="empty">Nothing matches that filter.</div>`;
  }
  document.querySelector(".live-tabs").addEventListener("click", (e) => {
    const b = e.target.closest("[data-feed]");
    if (!b || b.dataset.feed === feed.cur) return;
    document.querySelectorAll(".live-tabs button").forEach((x) => x.classList.toggle("active", x === b));
    feed.cur = b.dataset.feed; $("#feedFilter").value = ""; loadFeed();
  });
  $("#feedRefresh").addEventListener("click", () => loadFeed(true));
  $("#feedFilter").addEventListener("input", () => { feed.limit = 25; renderFeed(); });
  $("#feedList").addEventListener("click", (e) => { if (e.target.closest("[data-feed-more]")) { feed.limit += 25; renderFeed(); } });
  onShow.abroad = () => {
    renderCountries(); // picks up role/experience changes made in the Salary tab
    if (!feed.loaded) { feed.loaded = true; loadFeed(); }
    else if (Date.now() - feed.fetched > 30 * 60 * 1000) loadFeed(true);
  };

  /* ---------- Lifecycle ---------- */
  // Link each name in "Who" to its role, e.g. "SRE" → "Site Reliability Engineer (SRE)", "Frontend" → "Frontend Developer".
  const roleForName = (n) => {
    const l = n.toLowerCase().trim();
    return A.roles.findIndex((r) => { const rn = r.name.toLowerCase(); return rn === l || rn.startsWith(`${l} `) || rn.includes(`(${l})`) || rn.startsWith(`${l} /`); });
  };
  const whoHtml = (who) => who.split(/,\s*/).map((n) => {
    const i = roleForName(n);
    return i >= 0 ? `<button class="pill pill-link" type="button" data-act="open-role" data-i="${i}">${esc(n)}</button>` : `<span class="pill">${esc(n)}</span>`;
  }).join("");
  // Flow chart: numbered phases joined by arrows; "Throughout" runs as a band under all of them.
  const SDLC_ICON = ["clipboard", "layout", "code", "check", "rocket", "pulse", "users"];
  const phaseName = (p) => p.phase.replace(/^\d+\.\s*/, "");
  // Other roles that can do this phase's work: collapsed under the main ones.
  const othersHtml = (p) => {
    const list = A.sdlcOthers?.[(/^(\d+)/.exec(p.phase) || [, p.phase])[1]];
    return list ? `<details class="fc-alt"><summary>Other roles</summary><div class="fc-who">${whoHtml(list)}</div></details>` : "";
  };
  const node = (p, k) => `<li class="fc-node">
      <span class="fc-num">${k + 1}</span><span class="fc-ic">${icon(SDLC_ICON[k] || "flow")}</span>
      <h3>${esc(phaseName(p))}</h3><p class="fc-what">${esc(p.what)}</p>
      <div class="fc-who">${whoHtml(p.who)}</div>${othersHtml(p)}
      <p class="fc-out" title="Output of this phase">${icon("file")}<span>${esc(p.out)}</span></p></li>`;
  const phases = A.sdlc.filter((p) => /^\d/.test(p.phase)), always = A.sdlc.filter((p) => !/^\d/.test(p.phase));
  // The client / customer: who talks to them at each stage, and who takes their production issues.
  const clientHtml = (A.clientContacts || []).length ? `<div class="client-band">
      <h3>${icon("users")}Client / customer <small>who talks to them, and who handles their production issues</small></h3>
      <ol class="cb-list">${A.clientContacts.map((c) => `<li><b>${esc(c.when)}</b><span class="cb-what">${esc(c.what)}</span><div class="fc-who">${whoHtml(c.who)}</div></li>`).join("")}</ol>
    </div>` : "";
  $("#flow").innerHTML = `${clientHtml}<ol class="fc">${phases.map(node).join("")}</ol>
    ${always.map((p) => `<div class="fc-band"><span class="fc-ic">${icon("users")}</span><div><h3>${esc(p.phase)}</h3><p class="fc-what">${esc(p.what)}</p></div>
      <div class="fc-who">${whoHtml(p.who)}${othersHtml(p)}</div><p class="fc-out">${icon("file")}<span>${esc(p.out)}</span></p></div>`).join("")}`;

  /* ---------- My Path: fit ranking, switch planner, saved items ---------- */
  const roleOptions = A.families.map((f) => `<optgroup label="${esc(f.name)}">${A.roles.map((r, i) => (r.family === f.id ? `<option value="${i}">${esc(r.name)}</option>` : "")).join("")}</optgroup>`).join("");
  $("#planFrom").innerHTML = roleOptions; $("#planTo").innerHTML = roleOptions;
  const plan = Object.assign({ from: null, to: null }, loadJSON("atlas-plan", {}));
  const mp = { fitAll: false };
  const rankFit = (me) => A.roles.map((_, i) => ({ i, m: matchRole(i, me) })).sort((a, b) => b.m.pct - a.m.pct || b.m.have.length - a.m.have.length);
  const profileRoleName = () => {
    const k = roleBySlug(profile?.role || "");
    if (k >= 0) return A.roles[k].name;
    return profile?.role === "student" ? "Student / fresher" : shortTrack(S.tracks[sal.track].track);
  };
  const currentRole = () => A.roles.findIndex((r) => salaryTrackFor(r.name) === sal.track);
  const roleIdx = (name) => A.roles.findIndex((r) => r.name === name);

  /* ---------- Recommendations: real next moves from your current role, scored for you ----------
   * Candidates come from careerMoves (grow / lead / pivot). Each is scored on how much you keep, the pay change
   * vs what you earn now, whether your experience fits, demand abroad and AI-era growth. Narrower roles are flagged. */
  const MOVE_KINDS = [
    ["grow", "stairs", "Grow in your track", "A step up — keep what you do, add scope"],
    ["lead", "users", "Lead people", "Move into managing teams"],
    ["pivot", "rocket", "High-growth pivots", "A switch that reuses much of what you know"]
  ];
  /** Typical pay change (%) of a move at experience `at`, or null without salary data. */
  function movePay(ti, tiF, at, base, proxy) {
    if (!base) return null;
    if (ti >= 0) return Math.round(((midOf(salaryAt(ti, at)) - base) / base) * 100);
    return proxy ? Math.round(((salaryAt(tiF, at)[1] - base) / base) * 100) : null;
  }
  function recommend() {
    const from = personal ? roleBySlug(profile.role || "") : -1;
    const moves = from >= 0 && A.careerMoves[A.roles[from].name];
    if (!moves) return null;
    const exp = sal.exp, bring = new Set([...rolePartSets[from], ...mySkillSet()]);
    // Pay change = the move itself (typical pay of the new role vs your current role, same experience/city),
    // so being under- or over-paid today doesn't distort it. Your own pay vs market is shown separately.
    const tiF = salaryTrackFor(A.roles[from].name);
    const score = (name, kind) => {
      const i = roleIdx(name), g = gapAnalysis(A.roles[i], bring);
      const m = A.careerMoves[name]?.m ?? 0, wait = Math.max(0, Math.ceil(m - exp));
      const ti = salaryTrackFor(name);
      // Compare at the experience you'd have when you make the move (now + wait), against staying in your track.
      const at = exp + wait, base = tiF >= 0 ? midOf(salaryAt(tiF, at)) : 0;
      // Roles without their own salary data (Tech Lead, architects, managers): a step up at the same experience
      // usually pays like the top of your track's typical range.
      const proxy = ti < 0 && kind !== "pivot" && tiF >= 0;
      const pay = movePay(ti, tiF, at, base, proxy);
      // What to add: new skills for a step up (not languages); the missing stack for a pivot.
      const add = kind === "pivot" ? g.gap : A.roles[i].skills.filter((x) => !covers(bring, x));
      const key = roleKey(i), hot = key ? hotCountries(key) : [];
      // Growing or leading builds on everything you do now; only a pivot depends on how much of the new stack you have.
      const keep = kind === "pivot" ? g.pct : 70;
      const fit = exp >= m && exp <= m + 8 ? 5 : 0;
      const s = keep * 0.5 + (pay == null ? 6 : Math.max(-20, Math.min(40, pay))) * 0.6 + hot.length * 3 + (A.roles[i].isNew ? 6 : 0)
        + (kind === "grow" ? 10 : 0) + fit - wait * 8;
      return { i, kind, g, wait, pay, proxy, add: [...new Set(add)], hot, s };
    };
    const groups = MOVE_KINDS.map(([k]) => ({ k, items: moves[k].map((n) => score(n, k)).sort((a, b) => b.s - a.s) })).filter((g) => g.items.length);
    const all = groups.flatMap((g) => g.items);
    // Top pick = the natural step up you're ready for; the pivot with the most pay upside is badged separately.
    const ready = (k) => all.filter((x) => x.kind === k && !x.wait).sort((a, b) => b.s - a.s)[0];
    const best = ready("grow") || ready("lead") || ready("pivot") || all.slice().sort((a, b) => a.wait - b.wait)[0];
    const upside = all.filter((x) => x.kind === "pivot" && x.pay > 10).sort((a, b) => b.pay - a.pay)[0];
    return { from, groups, best, upside, narrower: moves.narrower.map(roleIdx) };
  }
  function recRow(x, best, upside) {
    const r = A.roles[x.i];
    const chips = [
      x.kind === "pivot" ? `<span class="why-chip">You have ${x.g.pct}% of its stack</span>` : `<span class="why-chip ok">Builds on your current stack</span>`,
      x.kind !== "pivot" && x.add.length ? `<span class="why-chip">Add: ${x.add.slice(0, 2).map(esc).join(", ")}</span>` : "",
      x.hot.length ? `<span class="why-chip">Hiring: ${x.hot.slice(0, 2).map((k) => esc(k.c.split(" (")[0])).join(", ")}</span>` : "",
      r.isNew ? `<span class="why-chip ai">AI-era role</span>` : ""
    ].join("");
    const tip = `<b>${esc(r.name)}</b>${x.add.length ? `<br>To add: ${x.add.slice(0, 5).map(esc).join(", ")}` : ""}`;
    return `<div class="rec-row${x === best ? " best" : ""}">
      <span class="fit-ic">${famIcon(r.family)}</span>
      <div class="rec-main"><div class="rec-title"><button class="fit-name" type="button" data-act="open-role" data-i="${x.i}">${esc(r.name)}</button>${x === best ? `<span class="top-pick">Top pick</span>` : ""}${x === upside && x !== best ? `<span class="top-pick upside">Biggest pay upside</span>` : ""}</div>
        <div class="rec-why" data-tip="${esc(tip)}">${chips}</div></div>
      <span class="fit-actions"><button class="icon-act${compareList.includes(slug(r.name)) ? " on" : ""}" type="button" data-act="cmp" data-i="${x.i}" aria-label="Compare ${esc(r.name)}" title="Add to compare">${icon("compare")}</button><button class="icon-act" type="button" data-act="plan-to" data-i="${x.i}" aria-label="Plan a switch to ${esc(r.name)}" title="Plan this move">${icon("arrow")}</button></span>
    </div>`;
  }
  // Plain skill-overlap list (used for students / no role, and as a folded extra).
  const fitRows = (ranked, n) => ranked.slice(0, n).map(({ i, m }) => `<div class="fit-row">
      <span class="fit-ic" title="${esc(famName(A.roles[i].family))}">${famIcon(A.roles[i].family)}</span>
      <button class="fit-name" type="button" data-act="open-role" data-i="${i}">${esc(A.roles[i].name)}</button>
      <span class="fit-bar" data-tip="${esc(`<b>${esc(A.roles[i].name)} · ${m.pct}%</b><br>${m.steps} to learn`)}"><span style="width:${m.pct}%"></span></span>
      <b class="fit-pct">${m.pct}%</b>
      <span class="fit-actions"><button class="icon-act" type="button" data-act="plan-to" data-i="${i}" aria-label="Plan a switch to ${esc(A.roles[i].name)}" title="Plan this move">${icon("arrow")}</button></span>
    </div>`).join("");

  function profileBarHtml() {
    if (!personal) {
      return `<span class="cta-line">${icon("target")}<span>Recommendations are off — we don't know your role, experience or skills yet.</span></span><a class="btn" href="welcome.html">Tell us about you</a>`;
    }
    const name = firstName ? `<b>${esc(profile.name)}</b> · ` : "";
    const skills = `${sal.skills.length} skill${sal.skills.length === 1 ? "" : "s"}`;
    const earns = profile.ctc ? ` · earns ${esc(profile.ctc)} LPA` : "";
    return `<span>${name}${esc(profileRoleName())} · ${sal.exp} yrs · ${skills} · ${esc(S.cities[sal.city].n.split(" (")[0])}${earns}</span>
        <a class="btn-link" href="welcome.html">Edit profile →</a>`;
  }

  /** How the user's pay compares with the market for their current role. */
  function marketPayNote(ctc, mkt) {
    if (!ctc || !mkt) return "";
    if (ctc < mkt[0]) return ` — <b class="bad">below</b> the usual ${range(mkt)} for your role, so even staying put you could ask for more`;
    if (ctc > mkt[1]) return ` — <b class="good">above</b> the usual ${range(mkt)} for your role`;
    return ` — within the usual ${range(mkt)} for your role`;
  }
  function recGroupHtml(g, rec) {
    const [, ic, title, desc] = MOVE_KINDS.find(([k]) => k === g.k);
    return `<div class="rec-group"><h4>${icon(ic)}${title} <small>${desc}</small></h4>${g.items.slice(0, 3).map((x) => recRow(x, rec.best, rec.upside)).join("")}</div>`;
  }
  /** Roles that are a narrower part of the current one: shown, but flagged as not a step up. */
  function narrowerHtml(rec, fromName) {
    if (!rec.narrower.length) return "";
    const many = rec.narrower.length > 1;
    const links = rec.narrower.map((i) => `<button class="btn-link" type="button" data-act="open-role" data-i="${i}">${esc(A.roles[i].name)}</button>`).join(", ");
    return `<p class="rec-narrow">${icon("target")}<span><b>Not a step up:</b> ${links}
          ${many ? "are" : "is a"} narrower specialisation${many ? "s" : ""} of ${esc(fromName)} — you'd stop using part of what you do today. Pick only if you want to go deeper in that one area.</span></p>`;
  }
  function recommendationsHtml(me, ranked, rec) {
    if (!me.size && !rec) {
      const ask = personal ? "Add your role and skills to your profile" : "Tell us your role and skills";
      return `<div class="empty"><a class="btn-link" href="welcome.html">${ask}</a> — we'll then suggest real next moves: growing in your track, leading, or pivoting.</div>`;
    }
    if (!rec) {
      // Student / no current role: entry roles that fit your skills.
      const entry = ranked.filter(({ i }) => (A.careerMoves[A.roles[i].name]?.m ?? 0) <= sal.exp + 1);
      return `<p class="rec-intro">Entry-level roles that fit the skills you have</p>${fitRows(entry, mp.fitAll ? 20 : 8)}
        <button class="btn-link" type="button" data-act="fit-more">${mp.fitAll ? "Show top 8" : "Show top 20"}</button>`;
    }
    const fromName = A.roles[rec.from].name;
    const tiNow = salaryTrackFor(fromName), mkt = tiNow >= 0 ? salaryAt(tiNow, sal.exp) : null, ctc = +profile.ctc;
    const earning = ctc ? ` earning <b>${ctc} LPA</b>` : "";
    return `<p class="rec-intro">For a <b>${esc(fromName)}</b> with <b>${sal.exp} yrs</b>${earning}${marketPayNote(ctc, mkt)}.</p>
        ${rec.groups.map((g) => recGroupHtml(g, rec)).join("")}
        ${narrowerHtml(rec, fromName)}
        <details class="rec-more"><summary>All roles by skill overlap (not a recommendation)</summary>${fitRows(ranked.filter(({ i }) => i !== rec.from), 10)}</details>`;
  }

  /** Default "to" role for the planner: the profile's target, the top recommendation, or the best fit. */
  function defaultTarget(rec, ranked, pTarget) {
    if (pTarget >= 0 && pTarget !== plan.from) return pTarget;
    if (rec?.best) return rec.best.i;
    const entryBest = rec ? null : ranked.find(({ i }) => i !== plan.from && (A.careerMoves[A.roles[i].name]?.m ?? 0) <= sal.exp + 1);
    return (entryBest || ranked.find((x) => x.i !== plan.from) || { i: 0 }).i;
  }
  /** Planner defaults: from = the profile's role (or the Salary-tab track), to = the best next move. */
  function setPlanDefaults(rec, ranked) {
    const pRole = personal ? roleBySlug(profile.role || "") : -1, pTarget = personal ? roleBySlug(profile.target || "") : -1;
    if (!A.roles[plan.from]) plan.from = pRole >= 0 ? pRole : Math.max(0, currentRole());
    if (!A.roles[plan.to] || plan.to === plan.from) plan.to = defaultTarget(rec, ranked, pTarget);
    $("#planFrom").value = plan.from;
    $("#planTo").value = plan.to;
    store.set("atlas-plan", JSON.stringify(plan));
  }

  const savedRoleChip = (i) => `<span class="saved-chip"><button type="button" data-act="open-role" data-i="${i}">${esc(A.roles[i].name)}</button><button type="button" data-act="save-role" data-i="${i}" aria-label="Remove">×</button></span>`;
  const savedTermRow = (i) => {
    const g = A.glossary[i];
    return `<dt><button class="btn-link" type="button" data-act="go-term" data-i="${i}">${esc(g.t)}</button> <button class="star on" type="button" data-act="save-term" data-s="${slug(g.t)}" aria-label="Remove">★</button></dt><dd>${esc(g.d)}</dd>`;
  };
  function savedHtml() {
    const sr = saved.roles.map(roleBySlug).filter((i) => i >= 0);
    const st = saved.terms.map((s) => A.glossary.findIndex((g) => slug(g.t) === s)).filter((i) => i >= 0);
    if (!sr.length && !st.length) {
      return `<p class="empty-inline">No saved items yet.</p>`;
    }
    const firstThree = sr.length > 3 ? "first 3 " : "";
    const compare = sr.length > 1 ? `<button class="btn-link" type="button" data-act="cmp-saved">Compare ${firstThree}saved roles →</button>` : "";
    const roles = sr.length ? `<label class="c-label">Roles</label><div class="pills">${sr.map(savedRoleChip).join("")}</div>
          ${compare}` : "";
    const terms = st.length ? `<label class="c-label">Terms</label><dl class="saved-terms">${st.map(savedTermRow).join("")}</dl>` : "";
    return `${roles}
        ${terms}`;
  }

  function renderMyPath() {
    const me = mySkillSet();
    $("#profileBar").innerHTML = profileBarHtml();
    const ranked = rankFit(me), rec = recommend();
    $("#fitList").innerHTML = recommendationsHtml(me, ranked, rec);
    setPlanDefaults(rec, ranked);
    renderPlan(me);
    $("#savedList").innerHTML = savedHtml();
  }

  /** How a move relates to the current role: grow, lead, narrower (sideways) or pivot. */
  function moveKind(mv, name) {
    return ["grow", "lead", "narrower"].find((kind) => mv[kind]?.includes(name)) ?? "pivot";
  }
  /** A step up adds skills on top of what you keep, so it takes more items to count as a big shift. */
  function effortOf(steps, keepStack) {
    const k1 = keepStack ? 6 : 4, k2 = keepStack ? 12 : 9;
    if (steps <= k1) return ["Small step", "good"];
    return steps <= k2 ? ["Medium shift", "mid"] : ["Big shift", "bad"];
  }
  function planData(me) {
    const f = A.roles[plan.from], t = A.roles[plan.to];
    // What you bring = the "from" role's stack plus your own skills.
    const mv = A.careerMoves[f.name] || {};
    const kind = moveKind(mv, t.name);
    const keepStack = kind === "grow" || kind === "lead";
    const bring = new Set([...rolePartSets[plan.from], ...me]);
    // Growing into a lead / architect / manager role keeps your stack — only its new skills count as "to learn".
    const g = keepStack ? gapAnalysis({ skills: t.skills, tools: t.tools }, bring) : gapAnalysis(t, bring);
    if (keepStack) g.have = [...new Set([...(me.size ? sal.skills : roleItems(f)), ...g.have])];
    // A step up adds skills on top of what you keep, so it takes more items to count as a big shift.
    const effort = effortOf(g.steps, keepStack);
    const tiF = salaryTrackFor(f.name), tiT = salaryTrackFor(t.name);
    // What you'd stop using: your skills (or the from-role's stack) that the from-role uses and the target doesn't.
    const tSet = rolePartSets[plan.to], fSet = rolePartSets[plan.from];
    const mine = me.size ? sal.skills : roleItems(f);
    const drop = keepStack ? [] : mine.filter((x) => covers(fSet, x) && !covers(tSet, x));
    const narrower = kind === "narrower";
    return { f, t, g, effort, tiF, tiT, drop, narrower, kind, key: roleKey(plan.to) };
  }
  const learnHtml = (g) => `<div class="pills">${g.need.map((x) => linkPill(x)).join("")}${g.pick.map((p) =>
    `<span class="pick-group"><span class="pick-label">Pick ${p.n}:</span>${p.items.map((x) => linkPill(x)).join("")}</span>`).join("")}</div>`;
  /** Typical pay now → after the move, with the change in %. */
  function planPayHtml(d) {
    if (d.tiT < 0) return "";
    const mid = (r) => (r[0] + r[1]) / 2;
    const to = salaryAt(d.tiT, sal.exp);
    if (d.tiF < 0) return `<b>${range(to)}</b>`;
    const from = salaryAt(d.tiF, sal.exp), diff = Math.round(((mid(to) - mid(from)) / mid(from)) * 100);
    const sign = diff >= 0 ? "+" : "";
    return `${range(from)} → <b>${range(to)}</b> <span class="delta ${diff >= 0 ? "up" : "down"}">${sign}${diff}%</span>`;
  }
  function sidewaysWarning(d) {
    if (!d.narrower) return "";
    const better = (A.careerMoves[d.f.name]?.grow || []).slice(0, 2);
    const up = better.length
      ? ` To move <i>up</i> instead, look at ${better.map((n) => `<button class="btn-link" type="button" data-act="plan-to" data-i="${roleIdx(n)}">${esc(n)}</button>`).join(" or ")}.`
      : "";
    return `<p class="plan-warn">${icon("target")}<span><b>Sideways move:</b> ${esc(d.t.name)} is a narrower part of ${esc(d.f.name)}. You'd stop using ${d.drop.slice(0, 5).map(esc).join(", ") || "part of your current work"}.${up}</span></p>`;
  }
  const MOVE_SUMMARY = {
    grow: "A step up — you keep your current stack and add the skills below.",
    lead: "A leadership move — you keep your technical base and add people skills.",
    narrower: "A sideways specialisation.",
  };
  function moveSummary(d) {
    if (d.kind !== "pivot") return MOVE_SUMMARY[d.kind];
    if (d.f.family === d.t.family) return "A pivot within the same family — ask for a project in the new area first.";
    return `A pivot from ${esc(famName(d.f.family))} to ${esc(famName(d.t.family))}.`;
  }
  function renderPlan(me = mySkillSet()) {
    if (plan.from === plan.to) {
      $("#planOut").innerHTML = `<p class="empty-inline">Pick two different roles.</p>`;
      return;
    }
    const d = planData(me);
    const pay = planPayHtml(d);
    const keepLabel = d.kind === "grow" || d.kind === "lead" ? "You keep" : "You can reuse";
    $("#planOut").innerHTML = `
      ${sidewaysWarning(d)}
      <p class="plan-summary"><span class="effort ${d.effort[1]}">${d.effort[0]}</span> ${d.g.have.length} skill${d.g.have.length === 1 ? "" : "s"} carry over, ${d.g.steps} to learn.
        ${moveSummary(d)}</p>
      <div class="split" role="img" aria-label="${d.g.have.length} carry over, ${d.g.steps} to learn">
        <span class="split-have" style="flex:${d.g.have.length || 0.01}" data-tip="<b>${d.g.have.length}</b> skills carry over"></span>
        <span class="split-learn" style="flex:${d.g.steps || 0.01}" data-tip="<b>${d.g.steps}</b> to learn"></span></div>
      <div class="split-legend"><span><i class="sw s1"></i>Carry over · ${d.g.have.length}</span><span><i class="sw gray"></i>To learn · ${d.g.steps}</span></div>
      <dl class="dl plan-dl">
        ${d.g.steps ? `<dt>Learn next</dt><dd>${learnHtml(d.g)}</dd>` : ""}
        ${d.drop.length ? `<dt>You'd stop using</dt><dd><div class="pills">${d.drop.map((x) => `<span class="pill pill-drop">${esc(x)}</span>`).join("")}</div></dd>` : ""}
        ${d.g.have.length ? `<dt>${keepLabel}</dt><dd><div class="pills">${d.g.have.map((x) => linkPill(x, me)).join("")}</div></dd>` : ""}
        ${pay ? `<dt>Pay at ${sal.exp} yrs</dt><dd>${pay} <small class="muted">typical, your city &amp; company type</small></dd>` : ""}
        ${d.key ? `<dt>In demand abroad</dt><dd><div class="pills">${countriesHtml(d.key)}</div></dd>` : ""}
      </dl>
      ${d.tiT >= 0 ? `<h4 class="sub">Roadmap for ${esc(d.t.name)}</h4>${roadmapHtml(d.tiT, me)}` : ""}
      <div class="plan-actions"><button class="btn" type="button" data-act="copy-plan">Copy plan</button>
        <button class="btn-ghost" type="button" data-act="cmp-pair">Compare side by side</button>
        <button class="btn-ghost" type="button" data-act="open-role" data-i="${plan.to}">Open ${esc(d.t.name)}</button></div>`;
  }
  const planText = () => {
    const me = mySkillSet(), d = planData(me);
    const lines = [`Switch plan: ${d.f.name} → ${d.t.name}`, `Effort: ${d.effort[0]} (${d.g.steps} to learn, ${d.g.have.length} carry over)`];
    if (d.g.steps) lines.push(`Learn next: ${[...d.g.need, ...d.g.pick.map((p) => `pick ${p.n} of ${p.items.join(" / ")}`)].join(", ")}`);
    if (d.g.have.length) lines.push(`Reuse: ${d.g.have.join(", ")}`);
    if (d.drop.length) lines.push(`Would stop using: ${d.drop.join(", ")}`);
    if (d.tiT >= 0) lines.push(`Typical pay at ${sal.exp} yrs: ${d.tiF >= 0 ? `${range(salaryAt(d.tiF, sal.exp))} → ` : ""}${range(salaryAt(d.tiT, sal.exp))}`);
    if (d.key) lines.push(`In demand abroad: ${hotCountries(d.key).map((k) => k.c).join(", ") || "—"}`);
    if (d.tiT >= 0) { const p = profileOf(d.tiT), n = (a) => a.map((x) => x.split("|")[0]).join(", "); lines.push(`Roadmap — Start: ${n(p.core)}`, `Grow (4+ yrs): ${n(p.adv)}`, `Lead (7+ yrs): ${n(p.senior)}`); }
    return `${lines.join("\n")}\n— IT Roles & Terminology Atlas`;
  };
  ["from", "to"].forEach((k) => $(`#plan${k === "from" ? "From" : "To"}`).addEventListener("change", (e) => {
    plan[k] = +e.target.value; store.set("atlas-plan", JSON.stringify(plan)); renderPlan();
  }));
  onShow.mypath = renderMyPath;

  /* ---------- Compare (up to 3 roles, shareable as #compare/a,b,c) ---------- */
  const tray = $("#cmpTray");
  // Inside the tutor, share the tutor's own address (/#atlas/<section>): the frame's address would open a bare page.
  const linkTo = (hash) => {
    if (document.documentElement.classList.contains("embedded")) {
      try { return `${parent.location.origin}${parent.location.pathname}#atlas/${hash}`; } catch { /* not same-origin */ }
    }
    return `${location.href.split("#")[0].replace(/[?&]embed=1/, "")}#${hash}`;
  };
  function renderTray() {
    tray.hidden = !compareList.length;
    document.body.classList.toggle("has-tray", !!compareList.length);
    // A bar of its own under the page: label, the picked roles, then the action (or what is still needed).
    const ready = compareList.length >= 2;
    tray.innerHTML = `<div class="tray-inner"><span class="tray-label">Compare roles</span>
      <span class="tray-chips">${compareList.map((s) => { const i = roleBySlug(s);
        return `<span class="tray-chip">${esc(A.roles[i].name)}<button type="button" data-act="cmp" data-i="${i}" aria-label="Remove ${esc(A.roles[i].name)} from compare">×</button></span>`; }).join("")}</span>
      <span class="tray-actions">${ready ? `<button class="btn" type="button" data-act="cmp-open">Compare ${compareList.length} roles →</button>` : `<span class="tray-hint">Add 1 more role to compare</span>`}
      <button class="btn-link" type="button" data-act="cmp-clear">Clear</button></span></div>`;
  }
  function toggleCompare(i) {
    const s = slug(A.roles[i].name);
    if (compareList.includes(s)) compareList = compareList.filter((x) => x !== s);
    else if (compareList.length >= 3) { toast("Compare up to 3 roles — remove one first"); return false; }
    else compareList.push(s);
    saveCompare(); renderTray();
    // On the Compare page: update it, or go back to Roles when fewer than 2 roles are left.
    if (location.hash.startsWith("#compare")) {
      if (compareList.length >= 2) openCompare(); else { closeView("cmp"); showTab("roles"); }
    }
    return true;
  }
  /** The comparison opens as its own page (#compare/a,b), not on top of the page you were on. */
  function openCompare() {
    const ids = compareList.map(roleBySlug).filter((i) => i >= 0);
    if (ids.length < 2) { closeView("cmp"); return toast("Pick at least 2 roles to compare"); }
    if (!views.cmp?.el.isConnected) {
      const el = makeView("cmp");
      $("#cmpPage").replaceChildren(el);
      views.cmp = { el };
    }
    renderCompare(ids);
    showTab("compare", { hash: `compare/${compareList.join(",")}` });
  }
  function renderCompare(ids) {
    const me = mySkillSet();
    const sets = ids.map((i) => rolePartSets[i]);
    const shared = (x) => sets.every((s) => covers(s, x));
    const cell = (arr) => `<div class="pills">${arr.map((x) => {
      const have = me.size && covers(me, x), common = shared(x);
      return `<span class="pill${have ? " pill-have" : ""}${common ? " pill-common" : ""}">${have ? "✓ " : ""}${esc(x)}</span>`;
    }).join("") || "—"}</div>`;
    const rowHtml = (label, f) => `<tr><th scope="row">${label}</th>${ids.map((i) => `<td>${f(i)}</td>`).join("")}</tr>`;
    const r = (i) => A.roles[i];
    views.cmp.el.innerHTML = `<div class="iv-head"><div><h2 tabindex="-1">Compare roles</h2>
        <p class="muted cmp-legend"><span class="pill pill-common">shared by all</span> <span class="pill pill-have">✓ you have it</span></p></div>
        <button class="iv-close" type="button" data-act="close-view" data-kind="cmp" aria-label="Close comparison">✕</button></div>
      <div class="table-wrap"><table class="gloss cmp-table">
        <thead><tr><th></th>${ids.map((i) => `<th scope="col"><button class="fit-name" type="button" data-act="open-role" data-i="${i}">${esc(r(i).name)}</button><small>${esc(famName(r(i).family))}</small></th>`).join("")}</tr></thead>
        <tbody>
          ${rowHtml("What", (i) => esc(r(i).what))}
          ${rowHtml("Also called", (i) => esc(A.roleNames[r(i).name]?.aka.join(", ") || "—"))}
          ${me.size ? rowHtml("Your match", (i) => { const m = matchRole(i, me); return `<b>${m.pct}%</b> <small class="muted">${m.steps} to learn</small>`; }) : ""}
          ${rowHtml(`Pay at ${sal.exp} yrs`, (i) => { const ti = salaryTrackFor(r(i).name); return ti >= 0 ? range(salaryAt(ti, sal.exp)) : `<span class="muted">No data</span>`; })}
          ${rowHtml("In demand abroad", (i) => { const k = roleKey(i); return k ? `<div class="pills">${countriesHtml(k)}</div>` : `<span class="muted">No data</span>`; })}
          ${rowHtml("Languages", (i) => cell(r(i).languages))}
          ${rowHtml("Frameworks", (i) => cell(r(i).frameworks))}
          ${rowHtml("Tools", (i) => cell(r(i).tools))}
          ${rowHtml("Skills", (i) => cell(r(i).skills))}
        </tbody></table></div>
      <div class="plan-actions"><button class="btn-ghost" type="button" data-act="cmp-link">Copy link</button><button class="btn-ghost" type="button" data-act="print">Print / PDF</button></div>`;
  }

  /* Re-render everything that shows personal state. */
  function refreshPersonal() {
    renderRoleChips(); renderRoles(); renderTray();
    if ($("#mypath").classList.contains("active")) renderMyPath();
    if (views.role?.el.isConnected) renderRoleView();
    if (views.cmp?.el.isConnected) {
      const ids = compareList.map(roleBySlug).filter((i) => i >= 0);
      ids.length >= 2 ? renderCompare(ids) : closeView("cmp");
    }
    updateQuickPath();
  }
  function updateQuickPath() {
    const me = mySkillSet();
    const rec = recommend(), best = !rec && me.size ? rankFit(me)[0] : null;
    $("#quickPath").textContent = quickPathText(rec, best);
  }
  /** The "My path" card on the overview: next move, best fit, or what to do to get one. */
  function quickPathText(rec, best) {
    if (rec?.best) return `Next move: ${A.roles[rec.best.i].name}${rec.best.wait ? ` (in ~${rec.best.wait} yrs)` : ""}`;
    if (best) return `Best fit: ${A.roles[best.i].name} (${best.m.pct}%)`;
    return personal ? "Add skills to your profile to see your best fit" : "Tell us about you to get recommendations";
  }
  // Print just one panel (role or comparison) when its Print button is used.
  /**
   * Print one panel only. Its ancestors are marked so print CSS can drop everything else from the
   * layout (hiding it would keep its space and print blank pages).
   */
  function printPanel(el) {
    const path = [];
    for (let n = el.parentElement; n && n !== document.documentElement; n = n.parentElement) { n.classList.add("print-path"); path.push(n); }
    el.classList.add("print-focus"); document.body.classList.add("print-one");
    addEventListener("afterprint", () => {
      el.classList.remove("print-focus"); path.forEach((n) => n.classList.remove("print-path")); document.body.classList.remove("print-one");
    }, { once: true });
    print();
  }

  /* One handler for every data-act button (role panel, My Path, compare, glossary, lifecycle). */
  /** A pill linked to a glossary term or a tech-stack entry. */
  function followLink(link) {
    const t = JSON.parse(link.dataset.link);
    if (t.type === "term") goTerm(t.i);
    else goStack(t.si);
  }
  function saveRole(i) {
    const on = toggleSaved("roles", slug(A.roles[i].name));
    toast(on ? `Saved ${A.roles[i].name}` : "Removed from saved");
    refreshPersonal();
  }
  function saveTerm(b) {
    const on = toggleSaved("terms", b.dataset.s);
    b.classList.toggle("on", on);
    b.textContent = on ? "★" : "☆";
    b.setAttribute("aria-pressed", on);
    toast(on ? "Term saved to My Path" : "Removed from saved");
    if ($("#mypath").classList.contains("active")) renderMyPath();
  }
  function showRolesUsing(b) {
    closeView("role");
    Object.assign(roleState, { q: "", family: "all", ids: b.dataset.list.split(",").map(Number), label: b.dataset.term });
    $("#roleFilter").value = "";
    renderRoleChips();
    renderRoles();
    showTab("roles");
  }
  /** Plan a move to role i; if it was the "from" role, start from another one. */
  function planTo(i) {
    plan.to = i;
    if (plan.from === i) {
      const other = (rankFit(mySkillSet()).find((x) => x.i !== i) || { i: 0 }).i;
      plan.from = Math.max(0, currentRole() === i ? other : currentRole());
    }
    store.set("atlas-plan", JSON.stringify(plan));
    showTab("mypath");
    window.atlasReveal?.($("#planner"));
  }
  function printFrom(b) {
    const view = b.closest(".inline-view");
    if (view) printPanel(view);
    else print();
  }
  document.addEventListener("click", (e) => {
    const l = e.target.closest("[data-link]");
    if (l) {
      followLink(l);
      return;
    }
    const b = e.target.closest("[data-act]");
    if (!b) return;
    const i = +b.dataset.i;
    switch (b.dataset.act) {
      case "save-role": saveRole(i); break;
      case "save-term": saveTerm(b); break;
      case "cmp": if (toggleCompare(i)) refreshPersonal(); break;
      case "cmp-open": openCompare(); break;
      case "cmp-clear": { const onPage = location.hash.startsWith("#compare"); compareList = []; saveCompare(); closeView("cmp"); refreshPersonal(); if (onPage) showTab("roles"); break; }
      case "cmp-saved": compareList = saved.roles.filter((s) => roleBySlug(s) >= 0).slice(0, 3); saveCompare(); renderTray(); openCompare(b); break;
      case "cmp-pair": compareList = [plan.from, plan.to].map((k) => slug(A.roles[k].name)); saveCompare(); renderTray(); openCompare(b); break;
      case "cmp-link": copyText(linkTo(`compare/${compareList.join(",")}`), "Link copied — anyone can open this comparison"); break;
      case "stack-tab": {
        const box = b.closest(".inline-view");
        box.querySelectorAll("[data-act=stack-tab]").forEach((t) => { const on = t === b; t.classList.toggle("active", on); t.setAttribute("aria-selected", on); });
        box.querySelectorAll(".stack-pane").forEach((pane) => { pane.hidden = pane.dataset.k !== b.dataset.k; });
        break;
      }
      case "copy-role": copyText(linkTo(`roles/${slug(A.roles[i].name)}`), "Link copied — share this role"); break;
      case "open-role": openRole(i, b); break;
      case "close-view": closeView(b.dataset.kind); if (b.dataset.kind === "cmp") showTab("roles"); break;
      case "used-by": showRolesUsing(b); break; // just the roles that use this term, in the Roles tab
      case "go-term": goTerm(i); break;
      case "go-salary": goTrack(i); break;
      case "plan-to": planTo(i); break;
      case "fit-more": mp.fitAll = !mp.fitAll; renderMyPath(); break;
      case "copy-plan": copyText(planText(), "Plan copied — paste it into your notes"); break;
      case "print": printFrom(b); break;
    }
  });
  // Esc closes the most recently opened panel (search handles its own Esc).
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || /input|textarea|select/i.test(document.activeElement.tagName)) return;
    if (views.role?.el.isConnected) closeView("role"); else if (views.cmp?.el.isConnected) closeView("cmp");
  });

  /* ---------- Global search (command palette) ---------- */
  const KINDS = ["Role", "Term", "Tech", "Salary", "Country", "Level"];
  const roleLists = (r) => [...r.languages, ...r.frameworks, ...r.tools, ...r.skills];
  const index = [
    ...A.roles.map((r, i) => ({ kind: "Role", title: r.name, sub: r.what, text: roleText(r), lists: roleLists(r), go: () => openRole(i) })),
    ...AB.countries.map((k) => ({ kind: "Country", title: `${k.c} — ${k.oddsText}`, sub: `${k.visa} · ${k.pay}`, text: [k.c, k.visa, k.rule, k.hot, "abroad visa work overseas job"].join(" ").toLowerCase(),
      go: () => { showTab("abroad"); const d = [...document.querySelectorAll(".country")].find((el) => el.textContent.includes(k.c)); if (d) { d.open = true; window.atlasReveal?.(d); d.scrollIntoView({ block: "center" }); } } })),
    ...A.glossary.map((g, i) => ({ kind: "Term", title: g.t + (g.f ? ` — ${g.f}` : ""), sub: g.d, text: termText(g), go: () => goTerm(i) })),
    ...A.stack.flatMap((s, si) => s.items.map((it, ii) => ({ kind: "Tech", title: it.n, sub: `${it.u} · ${s.layer}`, text: [it.n, it.u, s.layer].join(" ").toLowerCase(), go: () => goStack(si, ii) }))),
    ...S.tracks.map((t, i) => ({ kind: "Salary", title: `${t.track} salary`, sub: `${range(t.rows[0].lpa)} (entry) to ${range(t.rows[t.rows.length - 1].pot)} (top)`, text: [t.track, t.stack, "salary lpa ctc pay"].join(" ").toLowerCase(), go: () => goTrack(i) })),
    ...[...A.ladder.ic, ...A.ladder.mgmt].map((l) => ({ kind: "Level", title: `${l.title} (${l.level})`, sub: `${l.years} yrs · ${l.scope}`, text: [l.title, l.aka, l.scope, "career level"].join(" ").toLowerCase(), go: () => { ladderSel = l.level; showTab("ladder"); jumpTo($(`#ladderChart [data-lvl="${l.level}"]`)); } }))
  ];
  const RECENT_KEY = "atlas-recent";
  const recent = () => loadJSON(RECENT_KEY, []);
  const remember = (q) => { if (q.length > 1) store.set(RECENT_KEY, JSON.stringify([q, ...recent().filter((r) => r !== q)].slice(0, 5))); };

  const box = $("#searchResults"), input = $("#globalSearch");
  let hits = [], active = 0;
  /** 0 exact title, 1 title starts with the query, 2 contains it, 3 contains every word, 4 body match only. */
  function titleScore(t, ql, tokens) {
    if (t === ql) return 0;
    if (t.startsWith(ql)) return 1;
    if (t.includes(ql)) return 2;
    return tokens.every((tok) => t.includes(tok)) ? 3 : 4;
  }
  const mentionsAny = (x, tokens) => tokens.some((tok) => x.toLowerCase().includes(tok));
  function search(q) {
    const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
    const ql = q.toLowerCase();
    const hit = (x) => mentionsAny(x, tokens);
    return index.map((it) => {
      const t = it.title.toLowerCase();
      if (!tokens.every((tok) => t.includes(tok) || it.text.includes(tok))) return null;
      let score = titleScore(t, ql, tokens);
      let sub = it.sub, pos = 99;
      if (score === 4 && it.lists) {
        // Body match on a role: rank by how many of its skills match and how central they are (earlier = core stack).
        const matched = it.lists.filter(hit);
        score -= Math.min(matched.length, 5) * 0.1;
        pos = it.lists.findIndex(hit);
        if (matched.length) sub = `Uses ${matched.slice(0, 3).join(", ")}`;
      }
      return { it: { ...it, sub }, score, pos };
    }).filter(Boolean).sort((a, b) => a.score - b.score || a.pos - b.pos || a.it.title.length - b.it.title.length);
  }
  function renderResults() {
    const q = input.value.trim();
    if (!q) {
      const rec = recent();
      hits = [];
      box.innerHTML = `${rec.length ? `<div class="sr-group">Recent</div><div class="sr-chips">${rec.map((r) => `<button class="pop" data-q="${esc(r)}">${esc(r)}</button>`).join("")}</div>` : ""}
        <div class="sr-group">Try</div><div class="sr-chips">${POPULAR.map((p) => `<button class="pop" data-q="${esc(p)}">${esc(p)}</button>`).join("")}</div>
        <div class="sr-foot"><kbd>↑</kbd><kbd>↓</kbd> move · <kbd>Enter</kbd> open · <kbd>Esc</kbd> close</div>`;
    } else {
      const all = search(q);
      const grouped = KINDS.map((k) => ({ k, items: all.filter((h) => h.it.kind === k) })).filter((g) => g.items.length);
      hits = [];
      box.innerHTML = grouped.length ? grouped.map((g) => {
        const items = g.items.slice(0, g.k === "Term" || g.k === "Role" ? 5 : 3);
        const label = { Role: "Roles", Term: "Terms", Tech: "Technologies", Salary: "Salaries", Country: "Countries", Level: "Career levels" }[g.k];
        return `<div class="sr-group">${label} <span>${g.items.length}</span></div>` + items.map((h) => {
          const i = hits.push(h.it) - 1;
          return `<button class="sr-item" role="option" id="sr-${i}" data-hit="${i}"><b>${highlight(h.it.title, q)}</b><small>${esc(h.it.sub)}</small></button>`;
        }).join("");
      }).join("") + `<div class="sr-foot">${all.length} results · <kbd>Enter</kbd> opens the highlighted one</div>`
        : `<div class="sr-empty">Nothing for “${esc(q)}”. Try a shorter word, e.g. <b>${esc(q.split(/\s+/)[0].slice(0, 4))}</b>.</div>`;
    }
    active = 0; paintActive();
    box.hidden = false; input.setAttribute("aria-expanded", "true");
  }
  function paintActive() {
    box.querySelectorAll(".sr-item").forEach((el, i) => el.classList.toggle("active", i === active));
    const el = box.querySelector(`#sr-${active}`);
    if (el) { el.scrollIntoView({ block: "nearest" }); input.setAttribute("aria-activedescendant", el.id); }
  }
  function closeSearch() { box.hidden = true; input.setAttribute("aria-expanded", "false"); }
  function openSearch(q) { scrollTo({ top: 0 }); input.value = q; input.focus(); renderResults(); }
  function go(i) {
    const h = hits[i]; if (!h) return;
    remember(input.value.trim()); closeSearch(); input.value = ""; input.blur(); h.go();
  }
  input.addEventListener("input", renderResults);
  input.addEventListener("focus", renderResults);
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); active = Math.min(active + 1, hits.length - 1); paintActive(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); active = Math.max(active - 1, 0); paintActive(); }
    else if (e.key === "Enter") { e.preventDefault(); go(active); }
    else if (e.key === "Escape") { closeSearch(); input.blur(); }
  });
  box.addEventListener("mousemove", (e) => { const b = e.target.closest("[data-hit]"); if (b && +b.dataset.hit !== active) { active = +b.dataset.hit; paintActive(); } });
  box.addEventListener("mousedown", (e) => e.preventDefault()); // keep focus in the input
  box.addEventListener("click", (e) => {
    const p = e.target.closest("[data-q]");
    if (p) { input.value = p.dataset.q; return renderResults(); }
    const b = e.target.closest("[data-hit]"); if (b) go(+b.dataset.hit);
  });
  input.addEventListener("blur", () => setTimeout(closeSearch, 120));
  document.addEventListener("keydown", (e) => {
    const typing = /input|textarea|select/i.test(document.activeElement.tagName);
    if ((e.key === "k" && (e.ctrlKey || e.metaKey)) || (e.key === "/" && !typing)) { e.preventDefault(); openSearch(input.value); }
  });

  /* ---------- Small helpers: tab tips, copy actions, shortcuts ---------- */
  const copyText = async (text, msg) => {
    try { await navigator.clipboard.writeText(text); toast(msg); } catch { prompt("Copy:", text); }
  };
  // "Treat this as a guide": a small caution note in the top-right corner of the pages it applies to.
  const GUIDE_NOTES = {
    ladder: "Levels here are a general scale, not one company's. Each company sets its own (e.g. Google L3–L8, Amazon SDE I–III) — see Titles by company.",
    roles: "Titles, years and tools vary by company. Treat this as a guide.",
    lifecycle: "Who owns each step varies by company and team size. Treat this as a guide.",
    stack: "Tools vary by company. Treat this as a guide.",
    salary: "Pay varies by company, city and negotiation. Treat these as estimates.",
  };
  Object.entries(GUIDE_NOTES).forEach(([id, text]) => {
    document.querySelector(`#${id} > .panel-head`)?.insertAdjacentHTML("beforeend", `<p class="guide-note" role="note">${icon("info")}<span>${esc(text)}</span></p>`);
  });
  const TIPS = {
    ladder: "IC and management pay about the same at equal levels — you don't have to manage people to grow.",
    glossary: "Click any term to copy it with its meaning — handy for notes and interview prep.",
    stack: "Click any technology to see which roles use it."
  };
  const hidden = loadJSON("atlas-tips-hidden", []);
  Object.entries(TIPS).forEach(([id, html]) => {
    if (hidden.includes(id)) return;
    const panel = document.getElementById(id);
    const anchor = panel.querySelector(".panel-head") || panel.querySelector(".hero") || panel.querySelector(".lead") || panel.querySelector(".h2");
    anchor.insertAdjacentHTML("afterend", `<p class="hint" data-hint="${id}"><span>${icon("bulb")} ${html}</span><button type="button" aria-label="Dismiss tip">×</button></p>`);
  });
  document.addEventListener("click", (e) => {
    const b = e.target.closest(".hint button");
    if (!b) return;
    const p = b.closest(".hint"); hidden.push(p.dataset.hint); store.set("atlas-tips-hidden", JSON.stringify(hidden)); p.remove();
  });

  $("#glossBody").addEventListener("click", (e) => {
    const row = e.target.closest("tr[id^=term-]");
    if (!row || e.target.closest("button")) return;
    const g = A.glossary[+row.id.slice(5)];
    copyText(`${g.t}${g.f ? ` (${g.f})` : ""}: ${g.d}`, `Copied “${g.t}”`);
  });
  $("#stackGrid").addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (li) openSearch(li.querySelector("b").textContent.split(/ \/ | \+ /)[0]);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "?" && !/input|textarea|select/i.test(document.activeElement.tagName)) {
      const d = $("#shortcuts"); d.open = !d.open; if (d.open) d.scrollIntoView({ block: "end", behavior: "smooth" });
    }
  });

  /* ---------- Init ---------- */
  onShow.roles = renderRoles; // picks up skill changes for match badges
  renderRoleChips(); renderRoles(); renderCatChips(); renderGlossary(); renderSalary(); renderTray();
  route();

  // Offline support once served over http(s); file:// can't register a service worker.
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(() => {});
})();
