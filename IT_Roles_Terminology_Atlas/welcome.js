/* Welcome page: collects the profile the atlas personalises from, or lets the user skip.
 * Writes atlas-profile (name, role, target, ctc) and the shared atlas-salary state (track, exp, city, company, mode, skills). */
(() => {
  const A = window.ATLAS, S = A.salary;
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(?:^-)|(?:-$)/g, "");
  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
  const DASH = `IT_Roles_Terminology_Atlas.html${location.search}`; // keeps ?embed=1 inside the tutor
  // The Atlas section this page was opened from (e.g. #mypath), so leaving returns there.
  const RETURN = (() => { try { return sessionStorage.getItem("atlas-return") || ""; } catch { return ""; } })();
  const BACK_TO = `${DASH}${/^#[\w/,-]*$/.test(RETURN) ? RETURN : ""}`;
  // The brand goes back to the Atlas the same way (keeping the tutor's "Chat" button).
  document.getElementById("wBrand").href = BACK_TO;
  // Opened from an Atlas page: leaving is a step back in history, so Back / Forward stay in order.
  const cameFromAtlas = Boolean(RETURN) && history.length > 1;
  try { sessionStorage.removeItem("atlas-return"); } catch {}
  const leave = () => (cameFromAtlas ? history.back() : location.replace(BACK_TO));
  document.getElementById("wBrand").addEventListener("click", (e) => {
    if (!cameFromAtlas || e.ctrlKey || e.metaKey || e.shiftKey) return;
    e.preventDefault();
    leave();
  });

  // Inside the tutor: use the tutor's theme.
  const embedded = new URLSearchParams(location.search).has("embed") && window.parent !== window;
  let parentTheme = null;
  if (embedded) {
    try { parentTheme = window.parent.document.documentElement.getAttribute("data-theme"); } catch { /* not same-origin */ }
  }
  try { document.documentElement.dataset.theme = parentTheme || localStorage.getItem("atlas-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"); } catch {}

  const prev = load("atlas-profile", {}) || {};
  const sal = Object.assign({ track: 0, exp: 0, city: 0, company: 0, mode: 0, skills: [] }, load("atlas-salary", {}));
  const skills = prev.skipped ? [] : [...(sal.skills || [])];

  /* ---------- Fill selects ---------- */
  const roleOpts = A.families.map((f) => `<optgroup label="${esc(f.name)}">${A.roles.filter((r) => r.family === f.id)
    .map((r) => `<option value="${slug(r.name)}">${esc(r.name)}</option>`).join("")}</optgroup>`).join("");
  $("#wRole").innerHTML = `<option value="">Choose your current role…</option><option value="student">I'm a student / fresher</option>${roleOpts}`;
  $("#wTarget").innerHTML = `<option value="">Not sure yet</option>${roleOpts}`;
  const opts = (arr) => arr.map((x, i) => `<option value="${i}">${esc(x.n)}</option>`).join("");
  $("#wCity").innerHTML = opts(S.cities); $("#wCompany").innerHTML = opts(S.companies); $("#wMode").innerHTML = opts(S.workModes);
  $("#wSkillList").innerHTML = S.skills.map((s) => `<option value="${esc(s.n)}">`).join("");
  const expLabel = (y) => {
    if (!y) return "Fresher";
    return `${y} yr${y === 1 ? "" : "s"}`;
  };
  $("#wExpChips").innerHTML = [0, 1, 3, 5, 8, 12].map((y) => `<button class="chip" type="button" data-exp="${y}">${expLabel(y)}</button>`).join("");

  // Prefill when editing an existing profile.
  if (!prev.skipped) {
    $("#wName").value = prev.name || "";
    $("#wRole").value = prev.role || "";
    $("#wTarget").value = prev.target || "";
    $("#wCtc").value = prev.ctc || "";
    if (prev.role) $("#wExp").value = sal.exp;
  }
  $("#wCity").value = sal.city; $("#wCompany").value = sal.company; $("#wMode").value = sal.mode;

  /* ---------- Skills ---------- */
  const roleOf = (s) => A.roles.find((r) => slug(r.name) === s);
  const trackFor = (r) => (r ? S.tracks.findIndex((t) => t.track === (S.alias[r.name] || r.name)) : -1);
  const canon = (n) => (S.skills.find((s) => s.n.toLowerCase() === n.toLowerCase()) || { n }).n;
  const has = (n) => skills.some((s) => s.toLowerCase() === n.toLowerCase());
  function suggestionsFor() {
    const r = roleOf($("#wRole").value), exp = +$("#wExp").value || 0;
    const ti = trackFor(r), p = ti >= 0 && S.profiles.find((x) => x.track === S.tracks[ti].track);
    // Expected skills at this experience first (from the salary profiles), then the role's own stack.
    const expected = p ? [...p.core, ...(exp >= 4 ? p.adv : []), ...(exp >= 7 ? p.senior : [])].filter((g) => !g.split("|").some(has)).map((g) => g.split("|")[0]) : [];
    const stack = r ? [...r.languages, ...r.frameworks, ...r.tools].filter((x) => !has(x) && !/\(|varies/i.test(x)) : [];
    return [...new Set([...expected, ...stack])].slice(0, 14);
  }
  function renderSkills() {
    $("#wSkillCount").textContent = skills.length ? `· ${skills.length} added` : "";
    $("#wSkills").innerHTML = skills.length
      ? skills.map((s, i) => `<span class="skill ok">${esc(s)}<button type="button" data-rm="${i}" aria-label="Remove ${esc(s)}">×</button></span>`).join("")
      : `<p class="empty-inline">No skills yet — pick from the suggestions below or type your own.</p>`;
    const sug = suggestionsFor();
    const atExp = +$("#wExp").value ? ` at ${$("#wExp").value} yrs` : "";
    $("#wSuggest").innerHTML = sug.length ? `<label>Common for your role${atExp}</label>
      <div class="chips">${sug.map((s) => `<button class="chip sug sug-expected" type="button" data-add="${esc(s)}">+ ${esc(s)}</button>`).join("")}
      <button class="btn-link" type="button" data-add-all>Add all</button></div>` : "";
  }
  const addSkill = (raw) => {
    const n = canon(raw.trim());
    if (n && !has(n)) skills.push(n);
    renderSkills();
  };
  $("#wSkillAdd").addEventListener("click", () => { addSkill($("#wSkillInput").value); $("#wSkillInput").value = ""; $("#wSkillInput").focus(); });
  $("#wSkillInput").addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); $("#wSkillAdd").click(); } });
  $("#wSkills").addEventListener("click", (e) => { const b = e.target.closest("[data-rm]"); if (b) { skills.splice(+b.dataset.rm, 1); renderSkills(); } });
  $("#wSuggest").addEventListener("click", (e) => {
    if (e.target.closest("[data-add-all]")) { suggestionsFor().forEach((s) => { if (!has(s)) skills.push(s); }); return renderSkills(); }
    const b = e.target.closest("[data-add]"); if (b) addSkill(b.dataset.add);
  });
  $("#wExpChips").addEventListener("click", (e) => { const b = e.target.closest("[data-exp]"); if (b) { $("#wExp").value = b.dataset.exp; markExp(); } });
  const markExp = () => document.querySelectorAll("#wExpChips .chip").forEach((c) => c.classList.toggle("active", c.dataset.exp === String(+$("#wExp").value)));
  $("#wExp").addEventListener("input", markExp);
  $("#wRole").addEventListener("change", () => { if ($("#wRole").value === "student") { $("#wExp").value = 0; markExp(); } });

  /* ---------- Steps ---------- */
  let step = 1;
  const error = (msg) => { $("#wError").textContent = msg; $("#wError").hidden = !msg; };
  function show(n) {
    step = n; error("");
    document.querySelectorAll("[data-step]").forEach((f) => { f.hidden = +f.dataset.step !== n; });
    document.querySelectorAll("[data-step-dot]").forEach((d) => { d.classList.toggle("on", +d.dataset.stepDot <= n); });
    $("#wBack").hidden = n === 1;
    $("#wNext").textContent = n === 3 ? "Show my dashboard →" : "Next →";
    if (n === 2) renderSkills();
    document.querySelector(`[data-step="${n}"] input, [data-step="${n}"] select`)?.focus();
  }
  $("#wBack").addEventListener("click", () => { if (step > 1) show(step - 1); });
  $("#wlForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if (step === 1) {
      const exp = parseFloat($("#wExp").value);
      if (!$("#wRole").value) return error("Choose your current role (or “student / fresher”) so we can tailor things.");
      if (!(exp >= 0 && exp <= 45)) return error("Enter your years of experience (0–45).");
      return show(2);
    }
    if (step === 2) return show(3);
    finish();
  });
  function finish() {
    const roleSlug = $("#wRole").value, r = roleOf(roleSlug), ti = trackFor(r);
    save("atlas-profile", {
      name: $("#wName").value.trim(), role: roleSlug, target: $("#wTarget").value || null,
      ctc: parseFloat($("#wCtc").value) || null, at: new Date().toISOString().slice(0, 10)
    });
    save("atlas-salary", Object.assign(sal, {
      track: ti >= 0 ? ti : sal.track, exp: parseFloat($("#wExp").value) || 0, skills,
      city: +$("#wCity").value, company: +$("#wCompany").value, mode: +$("#wMode").value
    }));
    try { localStorage.removeItem("atlas-plan"); } catch {} // so the switch plan starts from the new role/target
    location.replace(`${DASH}#mypath`);
  }
  // Skip: first visit → browse without recommendations. Editing an existing profile → just go back unchanged.
  const editing = !!prev.role && !prev.skipped;
  document.querySelectorAll("[data-skip]").forEach((b) => {
    if (editing) b.textContent = "Cancel — back to the atlas";
    b.addEventListener("click", () => {
      if (!editing) save("atlas-profile", { skipped: true });
      leave();
    });
  });
  if (editing) {
    $(".wl-foot").innerHTML = `Want recommendations off? <button class="btn-link" type="button" id="wForget">Remove my details</button>`;
    $("#wForget").addEventListener("click", () => {
      if (!confirm("Remove your name, role, skills and salary from this browser?")) return;
      save("atlas-profile", { skipped: true });
      save("atlas-salary", Object.assign(sal, { skills: [] }));
      location.replace(BACK_TO);
    });
  }

  markExp();
  show(1);
})();
