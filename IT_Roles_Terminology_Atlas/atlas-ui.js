/*
 * Page shell for the Atlas, loaded before the other scripts.
 *  1. Sub-tabs: a page whose content is split into `.subview` blocks shows one block at a time,
 *     with a segmented control above them. `window.atlasReveal(el)` opens the block holding `el`.
 *  2. Embedded mode (`?embed=1` inside the tutor): a "Chat" back button, the tutor's theme,
 *     and the current section reported to the tutor so its address bar stays in step.
 */
(() => {
  // Opened on its own from the tutor (an old copied link, a refresh of the frame): load it inside the tutor
  // instead, so "Chat" and the tutor's navigation are always there.
  if (window.parent === window && location.pathname === "/atlas/IT_Roles_Terminology_Atlas.html") {
    window.atlasRedirecting = true;
    location.replace(`/#atlas/${location.hash.slice(1) || "overview"}`);
    return;
  }
  /**
   * Browser history for the Atlas. A page change you make (a tab, sub-tab, role, comparison) is a new step,
   * so Back returns to it. While following Back / Forward or opening a link, the address is only updated.
   */
  let following = false;
  window.atlasNav = {
    go(hash) {
      const target = `#${hash}`;
      if (location.hash === target) return;
      if (following) history.replaceState(null, "", target);
      else history.pushState(null, "", target);
    },
    /** Runs `fn` (showing the page for the current address) without adding history steps. */
    follow(fn) {
      following = true;
      try { return fn(); } finally { following = false; }
    },
  };
  const read = (k) => { try { return sessionStorage.getItem(k); } catch { return null; } };
  const write = (k, v) => { try { sessionStorage.setItem(k, v); } catch { /* remembered for this visit only */ } };

  /* ---------- 1. Sub-tabs ---------- */
  function showSub(panel, id) {
    const subs = [...panel.querySelectorAll(":scope > .subview")];
    if (!subs.some((s) => s.dataset.sub === id)) id = subs[0].dataset.sub;
    subs.forEach((s) => { s.hidden = s.dataset.sub !== id; });
    panel.querySelectorAll(":scope > .seg [data-sub]").forEach((b) => {
      const on = b.dataset.sub === id;
      b.classList.toggle("active", on);
      b.setAttribute("aria-selected", on);
    });
    write(`atlas-sub-${panel.id}`, id);
  }
  document.querySelectorAll(".panel").forEach((panel) => {
    const subs = panel.querySelectorAll(":scope > .subview");
    if (!subs.length) return;
    const seg = document.createElement("div");
    seg.className = "seg";
    seg.setAttribute("role", "tablist");
    seg.setAttribute("aria-label", "Sections of this page");
    seg.innerHTML = [...subs].map((s) => `<button type="button" role="tab" data-sub="${s.dataset.sub}">${s.dataset.label}</button>`).join("");
    subs[0].before(seg);
    seg.addEventListener("click", (e) => {
      const b = e.target.closest("[data-sub]");
      if (!b) return;
      showSub(panel, b.dataset.sub);
      // The sub-tab is part of the address (#ladder/titles), so a copied link opens the same view.
      window.atlasNav.go(`${panel.id}/${b.dataset.sub}`);
    });
    showSub(panel, read(`atlas-sub-${panel.id}`));
  });
  // Leaving for the profile page: remember this section, so Back / Skip there returns here.
  document.addEventListener("click", (e) => {
    if (e.target.closest?.('a[href^="welcome.html"]')) write("atlas-return", location.hash);
  }, true);

  /** Open sub-tab `id` of panel `panelId` (from a link like #ladder/titles); false when there is no such sub-tab. */
  window.atlasShowSub = (panelId, id) => {
    const panel = document.getElementById(panelId);
    if (!panel?.querySelector(`:scope > .subview[data-sub="${CSS.escape(id)}"]`)) return false;
    showSub(panel, id);
    return true;
  };
  /** Show the sub-tab that holds `el` (used before scrolling to a search result). */
  window.atlasReveal = (el) => {
    const sub = el?.closest?.(".subview");
    if (sub && sub.hidden) showSub(sub.closest(".panel"), sub.dataset.sub);
  };

  /* ---------- 2. Embedded in the tutor ---------- */
  const embedded = new URLSearchParams(location.search).has("embed") && window.parent !== window;
  if (!embedded) return;
  const root = document.documentElement;
  root.classList.add("embedded");
  const post = (msg) => window.parent.postMessage({ source: "atlas", ...msg }, location.origin);

  // Use the tutor's theme; the Atlas script reads it from storage when it starts.
  let parentTheme = null;
  try { parentTheme = window.parent.document.documentElement.getAttribute("data-theme"); } catch { /* not same-origin */ }
  if (parentTheme) { try { localStorage.setItem("atlas-theme", parentTheme); } catch { /* storage blocked */ } root.dataset.theme = parentTheme; }
  new MutationObserver(() => post({ type: "theme", theme: root.dataset.theme })).observe(root, { attributes: true, attributeFilter: ["data-theme"] });

  // Keep the tutor's address (/#atlas/<section>) in step with this page.
  const report = () => post({ type: "route", hash: location.hash.slice(1) });
  for (const name of ["replaceState", "pushState"]) {
    const original = history[name].bind(history);
    history[name] = (...args) => { original(...args); report(); };
  }
  addEventListener("hashchange", report);

  const back = document.getElementById("backToChat");
  back.hidden = false;
  back.addEventListener("click", () => post({ type: "close" }));
  // Profile links keep the embedded flag (so the profile page comes back here). Opening it is a history
  // step, so Back returns to the Atlas page it was opened from.
  document.addEventListener("click", (e) => {
    const link = e.target.closest?.('a[href^="welcome.html"]');
    if (!link || e.ctrlKey || e.metaKey || e.shiftKey) return;
    e.preventDefault();
    location.assign(`welcome.html${location.search}`);
  });
})();
