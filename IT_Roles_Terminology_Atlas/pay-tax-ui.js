/*
 * "Pay & Tax" tab: India take-home calculator (old vs new regime), offer comparison, and income tax by country.
 * Calculations live in pay-tax.js; country rules in ATLAS.taxes (it-atlas-data.js).
 */
(() => {
  const A = window.ATLAS;
  const T = window.PayTax;
  const panel = document.getElementById("pay");
  if (!A || !T || !panel) return;
  const $ = (s, root = panel) => root.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const inr = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;
  const money = (n, c) => (c.cur === "INR" ? inr(n) : `${c.sym}${Math.round(n).toLocaleString("en-US")}`);
  const pct = (x) => `${(x * 100).toFixed(1)}%`;
  const HRA_CITIES = "Mumbai, Delhi, Kolkata, Chennai, Bengaluru, Hyderabad, Pune, Ahmedabad";

  // ---------- Saved inputs (this browser only) ----------
  const KEY = "atlas.payTax";
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
  const saved = load();
  const store = () => { try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch { /* private mode: values last for this visit */ } };

  // ---------- Sub-views ----------
  const VIEWS = [["calc", "Take-home calculator"], ["offers", "Compare offers"], ["world", "Income tax by country"]];
  $("#ptTabs").innerHTML = VIEWS.map(([id, label]) => `<button type="button" role="tab" data-pt="${id}">${label}</button>`).join("");
  function showView(id) {
    saved.view = id; store();
    panel.querySelectorAll("[data-pt]").forEach((b) => { const on = b.dataset.pt === id; b.classList.toggle("active", on); b.setAttribute("aria-selected", on); });
    panel.querySelectorAll(".pt-view").forEach((v) => { v.hidden = v.id !== `pt-${id}`; });
    // Linkable: #pay/offers, #pay/world.
    if (location.hash.startsWith("#pay")) window.atlasNav.go(id === "calc" ? "pay" : `pay/${id}`);
    if (id === "offers") renderOffers();
    if (id === "world") renderWorld();
  }
  $("#ptTabs").addEventListener("click", (e) => { const b = e.target.closest("[data-pt]"); if (b) showView(b.dataset.pt); });
  const india = A.taxes.countries.find((c) => c.c === "India");
  $("#payTaxNote").textContent = `India figures use ${india.year} rules: new regime is the default; old regime allows HRA, 80C, 80D and home-loan interest. EPF wage ceiling ₹25,000/month (from 17 Sep 2026). Results are estimates for salary income only — your payroll may differ. Checked ${A.taxes.asOf}.`;

  // ---------- 1. Take-home calculator ----------
  const FIELDS = [
    { id: "ctc", label: "Annual CTC (₹)", step: 10000, min: 0 },
    { id: "variablePct", label: "Variable pay (% of CTC)", step: 1, min: 0, max: 60 },
    { id: "payoutPct", label: "Expected payout (%)", step: 5, min: 0, max: 200, hint: "How much of the target bonus you expect" },
    { id: "metro", label: "City", options: [["1", "HRA metro (50%)"], ["0", "Other city (40%)"]], hint: `HRA metros: ${HRA_CITIES}` },
    { id: "rent", label: "Monthly rent (₹)", step: 1000, min: 0, hint: "Only the old regime uses it (HRA)" },
  ];
  const MORE = [
    { id: "basicPct", label: "Basic (% of gross)", step: 5, min: 20, max: 80, hint: "Usually 40–50%; 50% after the labour codes" },
    { id: "hraPct", label: "HRA (% of basic)", step: 5, min: 0, max: 50 },
    { id: "pfMode", label: "PF calculated on", options: [["ceiling", "₹25,000 ceiling (₹3,000/mo)"], ["basic", "Full basic (12%)"], ["none", "No PF"]] },
    { id: "gratuity", label: "Gratuity inside CTC", options: [["1", "Yes (4.81% of basic)"], ["0", "No"]] },
    { id: "benefits", label: "Other benefits in CTC (₹/yr)", step: 1000, min: 0, hint: "Insurance, meal card, etc. — not paid as salary" },
    { id: "employerNpsPct", label: "Employer NPS (% of basic)", step: 1, min: 0, max: 14 },
    { id: "pt", label: "Professional tax (₹/yr)", step: 100, min: 0, max: 2500 },
    { id: "inv80c", label: "Other 80C investments (₹)", step: 5000, min: 0, hint: "PPF, ELSS, insurance… capped at ₹1.5 lakh together with your PF (old regime)" },
    { id: "d80d", label: "Health insurance 80D (₹)", step: 1000, min: 0 },
    { id: "nps1b", label: "Own NPS 80CCD(1B) (₹)", step: 5000, min: 0, max: 50000 },
    { id: "homeLoan", label: "Home-loan interest (₹/yr)", step: 10000, min: 0, hint: "Self-occupied, up to ₹2 lakh (old regime)" },
  ];
  const calcValues = { ...T.DEFAULTS, ...(saved.calc || {}) };

  const field = (f, value) => {
    const hint = f.hint ? ` title="${esc(f.hint)}"` : "";
    if (f.options) {
      const current = typeof value === "boolean" ? (value ? "1" : "0") : String(value);
      return `<label${hint}>${esc(f.label)}<select data-f="${f.id}">${f.options.map(([v, t]) => `<option value="${v}"${v === current ? " selected" : ""}>${esc(t)}</option>`).join("")}</select></label>`;
    }
    return `<label${hint}>${esc(f.label)}<input data-f="${f.id}" type="number" inputmode="numeric" value="${value}" step="${f.step}"${f.min != null ? ` min="${f.min}"` : ""}${f.max != null ? ` max="${f.max}"` : ""}></label>`;
  };
  $("#pt-calc").innerHTML = `
    <div class="pt-grid">
      <div class="card-block">
        <h3 class="h3 tight">Your offer</h3>
        <div class="est-controls pt-form">${FIELDS.map((f) => field(f, calcValues[f.id])).join("")}</div>
        <details class="pt-more"><summary>Salary structure &amp; tax-saving options</summary>
          <div class="est-controls pt-form">${MORE.map((f) => field(f, calcValues[f.id])).join("")}</div>
        </details>
        <div class="pt-actions"><button type="button" class="btn-link" data-act="pt-reset">Reset to defaults</button><button type="button" class="btn-ghost" data-act="print">Print / Save PDF</button></div>
      </div>
      <div id="ptResult" aria-live="polite"></div>
    </div>
    <details class="section-fold"><summary>Full breakdown</summary><div id="ptBreakdown"></div></details>`;

  function readCalc() {
    panel.querySelectorAll("#pt-calc [data-f]").forEach((el) => {
      const id = el.dataset.f;
      if (id === "metro" || id === "gratuity") calcValues[id] = el.value === "1";
      else if (id === "pfMode") calcValues[id] = el.value;
      else calcValues[id] = Math.max(0, Number(el.value) || 0);
    });
    saved.calc = calcValues; store();
  }

  // Where every rupee of CTC goes, for the better regime.
  function flowBar(s, r) {
    const parts = [
      ["Take-home", r.netAnnual, "var(--good)"],
      ["Income tax", r.tax.total, "var(--s2)"],
      ["Your PF (savings)", s.employeePf, "var(--s1)"],
      ["Employer PF, gratuity, NPS, benefits", s.employerPf + s.gratuity + s.employerNps + s.benefits, "var(--t2)"],
      ["Professional tax", s.pt, "var(--muted)"],
      ["Variable not paid out", s.variable - s.variablePaid, "var(--border)"],
    ].filter(([, v]) => v > 0);
    const total = parts.reduce((sum, [, v]) => sum + v, 0) || 1;
    return `<div class="pt-bar" role="img" aria-label="${esc(parts.map(([n, v]) => `${n} ${inr(v)}`).join(", "))}">${parts.map(([n, v, c]) => `<span style="width:${(v / total) * 100}%;background:${c}" title="${esc(n)}: ${inr(v)}"></span>`).join("")}</div>
      <ul class="pt-legend">${parts.map(([n, v, c]) => `<li><i style="background:${c}"></i>${esc(n)} <b>${inr(v)}</b> <small>${pct(v / total)}</small></li>`).join("")}</ul>`;
  }

  function regimeCard(s, key) {
    const r = s.regimes[key];
    const best = s.best === key;
    return `<div class="pt-card${best ? " best" : ""}">
      <span class="pt-card-title">${key === "new" ? "New regime" : "Old regime"}${best ? ` <em>Better by ${inr(s.saving)}/yr</em>` : ""}</span>
      <strong>${inr(r.monthly)}<small>/month</small></strong>
      <span>${inr(r.netAnnual)} a year incl. variable · tax ${inr(r.tax.total)} (${pct(r.effective)})</span>
    </div>`;
  }

  function renderCalc() {
    readCalc();
    const s = T.indiaSalary(calcValues);
    const best = s.regimes[s.best];
    $("#ptResult").innerHTML = `
      <div class="pt-regimes">${regimeCard(s, "new")}${regimeCard(s, "old")}</div>
      <div class="card-block"><h3 class="h3 tight">Where your ₹${(s.ctc / 1e5).toFixed(2)} lakh CTC goes <small class="muted">${s.best} regime</small></h3>${flowBar(s, best)}
        <p class="pt-note">Variable pay of ${inr(s.variablePaid)} arrives once a year (already counted in the yearly figures). Your PF is your own savings, not a cost.</p></div>`;
    const rows = [
      ["CTC", inr(s.ctc), ""],
      ["− Variable pay (target)", inr(s.variable), `${calcValues.variablePct}% of CTC`],
      ["− Employer PF", inr(s.employerPf), calcValues.pfMode === "ceiling" ? "12% of min(basic, ₹25,000/mo)" : calcValues.pfMode === "basic" ? "12% of basic" : "no PF"],
      ["− Gratuity provision", inr(s.gratuity), "4.81% of basic"],
      ["− Employer NPS", inr(s.employerNps), `${calcValues.employerNpsPct}% of basic`],
      ["− Other benefits", inr(s.benefits), ""],
      ["= Gross salary (fixed)", inr(s.gross), `${inr(s.monthlyGross)} a month`],
      ["Basic", inr(s.basic), `${calcValues.basicPct}% of gross`],
      ["HRA", inr(s.hra), `${calcValues.hraPct}% of basic`],
      ["Special allowance", inr(s.special), "the balance"],
      ["− Your PF", inr(s.employeePf), "same as employer PF"],
      ["− Professional tax", inr(s.pt), "state tax"],
    ];
    const regimeRows = ["new", "old"].map((k) => s.regimes[k]);
    const dedNames = [...new Set(regimeRows.flatMap((r) => r.deductions.map(([n]) => n)))];
    $("#ptBreakdown").innerHTML = `<div class="table-wrap"><table class="gloss pt-table">
      <thead><tr><th>Item</th><th>Amount</th><th>How</th></tr></thead>
      <tbody>${rows.map(([a, b, c]) => `<tr><td>${esc(a)}</td><td>${b}</td><td>${esc(c)}</td></tr>`).join("")}</tbody></table></div>
      <div class="table-wrap pt-gap"><table class="gloss pt-table">
      <thead><tr><th>Tax working</th><th>New regime</th><th>Old regime</th></tr></thead>
      <tbody>
        <tr><td>Income (gross + variable paid)</td><td>${inr(s.gross + s.variablePaid)}</td><td>${inr(s.gross + s.variablePaid)}</td></tr>
        ${dedNames.map((n) => `<tr><td>− ${esc(n)}</td>${regimeRows.map((r) => { const d = r.deductions.find(([x]) => x === n); return `<td>${d ? inr(d[1]) : "—"}</td>`; }).join("")}</tr>`).join("")}
        <tr><td>= Taxable income</td>${regimeRows.map((r) => `<td>${inr(r.taxable)}</td>`).join("")}</tr>
        <tr><td>Slab tax (after 87A rebate)</td>${regimeRows.map((r) => `<td>${inr(r.tax.slab)}</td>`).join("")}</tr>
        <tr><td>+ Surcharge</td>${regimeRows.map((r) => `<td>${inr(r.tax.surcharge)}</td>`).join("")}</tr>
        <tr><td>+ 4% cess</td>${regimeRows.map((r) => `<td>${inr(r.tax.cess)}</td>`).join("")}</tr>
        <tr class="pt-total"><td>= Income tax for the year</td>${regimeRows.map((r) => `<td>${inr(r.tax.total)}</td>`).join("")}</tr>
        <tr class="pt-total"><td>Monthly take-home</td>${regimeRows.map((r) => `<td>${inr(r.monthly)}</td>`).join("")}</tr>
        <tr class="pt-total"><td>Yearly take-home (incl. variable)</td>${regimeRows.map((r) => `<td>${inr(r.netAnnual)}</td>`).join("")}</tr>
      </tbody></table></div>
      <p class="pt-note">Monthly take-home = (gross − your PF − professional tax − yearly tax) ÷ 12, with tax spread evenly over the year. Real payslips vary month to month (bonus month, February PT, investment proofs).</p>`;
  }
  $("#pt-calc").addEventListener("input", (e) => { if (e.target.closest("[data-f]")) renderCalc(); });
  $("#pt-calc").addEventListener("change", (e) => { if (e.target.closest("[data-f]")) renderCalc(); });
  $("#pt-calc").addEventListener("click", (e) => {
    if (e.target.closest('[data-act="pt-reset"]')) {
      Object.assign(calcValues, T.DEFAULTS);
      panel.querySelectorAll("#pt-calc [data-f]").forEach((el) => { const v = T.DEFAULTS[el.dataset.f]; el.value = typeof v === "boolean" ? (v ? "1" : "0") : v; });
      renderCalc();
    }
  });

  // ---------- 2. Compare offers ----------
  const OFFER_DEFAULTS = [
    { name: "Offer A", ctc: 1800000, variablePct: 10, joining: 0, stock: 0, vestYears: 4, metro: true, pfMode: "ceiling" },
    { name: "Offer B", ctc: 2000000, variablePct: 20, joining: 150000, stock: 0, vestYears: 4, metro: true, pfMode: "basic" },
    { name: "Offer C", ctc: 1700000, variablePct: 0, joining: 0, stock: 800000, vestYears: 4, metro: false, pfMode: "ceiling" },
  ];
  const offers = (saved.offers || OFFER_DEFAULTS).map((o, i) => ({ ...OFFER_DEFAULTS[i], ...o }));
  let offerCount = saved.offerCount || 2;
  let currentCtc = saved.currentCtc || 0;
  const OFFER_FIELDS = [
    { id: "name", label: "Name", text: true },
    { id: "ctc", label: "CTC (₹/yr)", step: 10000 },
    { id: "variablePct", label: "Variable (% of CTC)", step: 1 },
    { id: "joining", label: "Joining bonus (₹)", step: 10000 },
    { id: "stock", label: "Stock grant, total (₹)", step: 10000, hint: "ESOP/RSU value at grant" },
    { id: "vestYears", label: "Vesting (years)", step: 1 },
    { id: "metro", label: "City", options: [["1", "HRA metro"], ["0", "Other city"]] },
    { id: "pfMode", label: "PF on", options: [["ceiling", "₹25,000 ceiling"], ["basic", "Full basic"], ["none", "No PF"]] },
  ];
  function renderOffers() {
    const cols = offers.slice(0, offerCount);
    const inputs = cols.map((o, i) => `<div class="card-block pt-offer"><div class="est-controls pt-form one">${OFFER_FIELDS.map((f) => {
      const hint = f.hint ? ` title="${esc(f.hint)}"` : "";
      if (f.text) return `<label>${f.label}<input data-o="${i}" data-k="name" type="text" maxlength="30" value="${esc(o.name)}"></label>`;
      if (f.options) { const cur = typeof o[f.id] === "boolean" ? (o[f.id] ? "1" : "0") : o[f.id]; return `<label${hint}>${f.label}<select data-o="${i}" data-k="${f.id}">${f.options.map(([v, t]) => `<option value="${v}"${v === cur ? " selected" : ""}>${t}</option>`).join("")}</select></label>`; }
      return `<label${hint}>${f.label}<input data-o="${i}" data-k="${f.id}" type="number" min="0" step="${f.step}" value="${o[f.id]}"></label>`;
    }).join("")}</div></div>`).join("");
    $("#pt-offers").innerHTML = `
      <p class="pt-note">Each offer uses your rent, investments, payout % and professional tax from the <button type="button" class="btn-link" data-pt="calc">calculator</button>, and the better tax regime for that offer.</p>
      <div class="pt-offer-top"><label class="inline-select">Current CTC (₹, optional) <input id="ptCurrent" type="number" min="0" step="10000" value="${currentCtc || ""}" placeholder="for hike %"></label>
        <span>${offerCount < 3 ? `<button type="button" class="btn-ghost" data-act="add-offer">+ Add a third offer</button>` : `<button type="button" class="btn-ghost" data-act="remove-offer">Remove offer C</button>`}</span></div>
      <div class="pt-offers c${offerCount}">${inputs}</div>
      <div id="ptOfferResult"></div>`;
    renderOfferResult();
  }
  function renderOfferResult() {
    const personal = { ...calcValues };
    const cols = offers.slice(0, offerCount);
    const vals = cols.map((o) => T.valueOffer(o, personal));
    const hike = (n) => (currentCtc ? `${(((n - currentCtc) / currentCtc) * 100).toFixed(0)}%` : "—");
    const rows = [
      ["CTC", vals.map((v, i) => cols[i].ctc), inr, true],
      ["Fixed pay (guaranteed)", vals.map((v) => v.fixed), inr, true],
      ["Variable you expect", vals.map((v) => v.variableExpected), inr, true],
      ["Monthly take-home", vals.map((v) => v.monthly), inr, true],
      ["Better tax regime", vals.map((v) => v.regime), (r) => (r === "new" ? "New" : "Old"), false],
      ["Year-1 take-home (incl. joining bonus & stock, after tax)", vals.map((v) => v.year1Net), inr, true],
      ["Year-2+ take-home (incl. stock, after tax)", vals.map((v) => v.laterNet), inr, true],
      ["Year-1 total comp (before tax)", vals.map((v) => v.totalComp1), inr, true],
      ["Hike on CTC", cols.map((o) => o.ctc), hike, false],
      ["Hike on fixed pay", vals.map((v) => v.fixed), hike, false],
    ];
    const cell = (vals2, fmt, compare) => {
      const top = compare ? Math.max(...vals2) : null;
      return vals2.map((v) => `<td class="${compare && v === top && vals2.filter((x) => x === top).length === 1 ? "pt-best" : ""}">${fmt(v)}</td>`).join("");
    };
    const names = cols.map((o) => o.name || "Offer");
    const lead = (i) => names[i];
    const best = (key) => vals.reduce((b, v, i) => (v[key] > vals[b][key] ? i : b), 0);
    const m = best("monthly"), y1 = best("year1Net"), y2 = best("laterNet");
    const verdict = [`<b>${esc(lead(m))}</b> pays the most every month.`];
    if (y1 !== m) verdict.push(`<b>${esc(lead(y1))}</b> gives the most cash in year 1${cols[y1].joining ? " thanks to its joining bonus" : ""}.`);
    if (y2 !== m && y2 !== y1) verdict.push(`<b>${esc(lead(y2))}</b> is best from year 2${cols[y2].stock ? " if its stock holds its value" : ""}.`);
    $("#ptOfferResult").innerHTML = `<div class="table-wrap"><table class="gloss pt-table pt-cmp">
      <thead><tr><th></th>${names.map((n) => `<th>${esc(n)}</th>`).join("")}</tr></thead>
      <tbody>${rows.map(([label, v, fmt, compare]) => `<tr><td>${esc(label)}</td>${cell(v, fmt, compare)}</tr>`).join("")}</tbody></table></div>
      <p class="pt-verdict">${verdict.join(" ")}</p>`;
  }
  $("#pt-offers").addEventListener("input", (e) => {
    const el = e.target;
    if (el.id === "ptCurrent") { currentCtc = Math.max(0, Number(el.value) || 0); saved.currentCtc = currentCtc; store(); return renderOfferResult(); }
    if (el.dataset.o == null) return;
    const o = offers[Number(el.dataset.o)], k = el.dataset.k;
    o[k] = k === "name" ? el.value : k === "metro" ? el.value === "1" : k === "pfMode" ? el.value : Math.max(0, Number(el.value) || 0);
    saved.offers = offers; store();
    renderOfferResult();
  });
  $("#pt-offers").addEventListener("click", (e) => {
    if (e.target.closest('[data-act="add-offer"]')) { offerCount = 3; saved.offerCount = 3; store(); renderOffers(); }
    if (e.target.closest('[data-act="remove-offer"]')) { offerCount = 2; saved.offerCount = 2; store(); renderOffers(); }
    const go = e.target.closest("[data-pt]"); if (go) showView(go.dataset.pt);
  });

  // ---------- 3. Income tax by country ----------
  let countryIndex = Math.min(saved.country || 0, A.taxes.countries.length - 1);
  let worldExp = saved.worldExp ?? 5;
  const typicalPay = (c) => {
    const p = A.abroad.pay[c.c];
    if (!p) return null;
    const band = [...p.bands].reverse().find(([y]) => worldExp >= y) || p.bands[0];
    const mid = (band[1] + band[2]) / 2;
    return { gross: p.per === "month" ? mid * 12 : mid, fx: p.fx };
  };
  const rangeText = (c, [from, to]) => (to == null ? `Above ${money(from, c)}` : from === 0 ? `Up to ${money(to, c)}` : `${money(from, c)} – ${money(to, c)}`);

  function glanceTable() {
    const india = T.indiaSalary(calcValues);
    const indiaMonthly = india.regimes[india.best].monthly;
    // Your India take-home in "international dollars", then in each country's money at its price level.
    const ppp = A.taxes.ppp?.rates || {};
    const intl = ppp.India ? indiaMonthly / ppp.India : null;
    let example = null;
    const rows = A.taxes.countries.map((c, i) => {
      const top = Math.max(...c.regimes.flatMap((r) => r.brackets.map((b) => b[2])));
      let eff = "—", same = "—", inHand = "—", gain = "—";
      const sameLocal = intl != null && ppp[c.c] ? intl * ppp[c.c] : null;
      if (c.calc === "india") {
        eff = pct(india.regimes[india.best].effective); same = inr(indiaMonthly); inHand = inr(indiaMonthly); gain = "1×";
      } else {
        const pay = typicalPay(c);
        const est = pay && T.countryEstimate(c, pay.gross);
        if (sameLocal != null) same = money(sameLocal, c);
        if (est) {
          eff = pct(est.effective);
          inHand = `${money(est.monthly, c)} <small class="muted">≈ ${inr(est.monthly * pay.fx)}</small>`;
          if (sameLocal) gain = `${(est.monthly / sameLocal).toFixed(1)}×`;
          if (!example || c.cur === "USD") example = { c, same: sameLocal != null ? money(sameLocal, c) : null, local: money(est.monthly, c), gain };
        }
      }
      return `<tr><td><button type="button" class="btn-link" data-country="${i}">${esc(c.c)}</button></td><td>${top}%</td><td>${eff}</td><td>${same}</td><td>${inHand}</td><td>${gain}</td></tr>`;
    }).join("");
    const where = example && (example.c.c === "United States" ? "the USA" : example.c.c);
    const lead = example && example.same && indiaMonthly > 0
      ? `<p class="pt-equiv"><b>${inr(indiaMonthly)} a month in India</b> buys about as much as <b>${example.same} a month in ${esc(where)}</b> — that's the pay you'd need there for the same lifestyle. A typical software engineer with ${worldExp} years' experience there takes home about <b>${example.local}</b>, so <b>${example.gain}</b> better off in real terms.</p>`
      : "";
    return `${lead}<div class="table-wrap"><table class="gloss pt-table">
      <thead><tr><th>Country</th><th>Top income-tax rate</th><th>Tax + social on typical pay*</th><th title="What your India take-home buys, at each country's prices">Same lifestyle as India / month†</th><th>Typical take-home there / month*</th><th title="Typical take-home there ÷ same-lifestyle pay">Real gain</th></tr></thead><tbody>${rows}</tbody></table></div>
      <p class="pt-note">*Typical software-engineer take-home for ${worldExp} years' experience, from the Work Abroad pay data (the same for any tech role; India: your CTC from the calculator). ₹ values use the Atlas's exchange rates. †Your India take-home converted at each country's price level (<a href="${esc(A.taxes.ppp?.url || "")}" target="_blank" rel="noopener">${esc(A.taxes.ppp?.source || "World Bank PPP")}</a>); real gain = typical take-home there ÷ that amount. Estimates leave out: ${A.taxes.countries.filter((c) => c.excludes).map((c) => `${c.c} — ${c.excludes.charAt(0).toLowerCase()}${c.excludes.slice(1)}`).join("; ")}.</p>`;
  }

  function countryCard(c) {
    const regimes = c.regimes.map((r) => `<div class="pt-brackets"><h4>${esc(r.name)}</h4>
      <table class="gloss pt-table"><thead><tr><th>Taxable income</th><th>Rate</th></tr></thead><tbody>
      ${r.brackets.map((b) => `<tr><td>${rangeText(c, b)}</td><td>${b[3] ? esc(b[3]) : `${b[2]}%`}</td></tr>`).join("")}</tbody></table>
      ${r.extra ? `<p class="pt-note">${esc(r.extra)}</p>` : ""}</div>`).join("");
    let estimator = "";
    if (c.calc === "india") estimator = `<p><button type="button" class="btn" data-pt="calc">Work out your Indian take-home →</button></p>`;
    else if (c.calc) {
      const pay = typicalPay(c);
      const gross = saved.worldGross?.[c.c] ?? Math.round(pay ? pay.gross : 50000);
      const ruling = c.calc === "netherlands" ? `<label class="pt-check"><input id="ptRuling" type="checkbox"${saved.ruling ? " checked" : ""}> I qualify for the 30% ruling</label>` : "";
      estimator = `<div class="pt-estimator"><label class="inline-select">Yearly gross salary (${esc(c.cur)}) <input id="ptAbroadGross" type="number" min="0" step="1000" value="${gross}"></label>${ruling}<div id="ptAbroadOut" aria-live="polite"></div></div>`;
    } else estimator = `<p class="pt-note"><b>No estimate here:</b> tax credits and deductions change the result too much for a simple estimate — use the official calculator linked below.</p>`;
    return `<article class="card-block pt-country">
      <header><h3 class="h3 tight">${esc(c.c)}</h3><small class="muted">${esc(c.year)}</small></header>
      <p>${esc(c.summary)}</p>
      ${estimator}
      <div class="pt-bracket-grid">${regimes}</div>
      <div class="pt-cols"><div><h4>Employee contributions</h4><ul>${c.social.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></div>
        <div><h4>Good to know</h4><ul>${c.notes.map((s) => `<li>${esc(s)}</li>`).join("")}${c.excludes ? `<li>Not in the estimate: ${esc(c.excludes)}.</li>` : ""}</ul></div></div>
      <h4>Check the official source</h4>
      <ul class="pt-links">${c.links.map((l) => `<li><a href="${esc(l.u)}" target="_blank" rel="noopener noreferrer">${esc(l.t)} ↗</a></li>`).join("")}</ul>
    </article>`;
  }

  function renderAbroadEstimate(c) {
    const input = $("#ptAbroadGross");
    if (!input) return;
    const gross = Math.max(0, Number(input.value) || 0);
    saved.worldGross = { ...(saved.worldGross || {}), [c.c]: gross }; store();
    const est = T.countryEstimate(c, gross, { ruling: c.calc === "netherlands" && Boolean(saved.ruling) });
    const fx = A.abroad.pay[c.c]?.fx;
    const lines = [["Gross pay", est.gross], ["− Income tax", est.incomeTax], ...est.extra.map((s) => [`− ${s.n}`, s.amount]), ...est.social.map((s) => [`− ${s.n}`, s.amount])];
    $("#ptAbroadOut").innerHTML = `<div class="pt-regimes one"><div class="pt-card best"><span class="pt-card-title">Estimated take-home</span>
      <strong>${money(est.monthly, c)}<small>/month</small></strong>
      <span>${money(est.net, c)} a year · tax + contributions ${pct(est.effective)}${fx ? ` · ≈ ${inr(est.monthly * fx)}/month` : ""}</span></div></div>
      <table class="gloss pt-table"><tbody>${lines.map(([n, v]) => `<tr><td>${esc(n)}</td><td>${money(v, c)}</td></tr>`).join("")}
      <tr class="pt-total"><td>= Take-home (year)</td><td>${money(est.net, c)}</td></tr></tbody></table>
      ${est.excludes ? `<p class="pt-note">Not included: ${esc(est.excludes)}.</p>` : ""}`;
  }

  function renderWorld() {
    const c = A.taxes.countries[countryIndex];
    $("#pt-world").innerHTML = `
      <p class="pt-note">${esc(A.taxes.note)}</p>
      <div class="pt-offer-top"><label class="inline-select">Experience (yrs) <input id="ptWorldExp" type="number" min="0" max="40" step="1" value="${worldExp}"></label><small class="muted">Rules checked ${esc(A.taxes.asOf)}</small></div>
      ${glanceTable()}
      <div class="chips pt-country-chips" role="tablist">${A.taxes.countries.map((x, i) => `<button type="button" class="chip${i === countryIndex ? " active" : ""}" data-country="${i}">${esc(x.c)}</button>`).join("")}</div>
      ${countryCard(c)}`;
    renderAbroadEstimate(c);
  }
  $("#pt-world").addEventListener("click", (e) => {
    const b = e.target.closest("[data-country]");
    if (b) { countryIndex = Number(b.dataset.country); saved.country = countryIndex; store(); renderWorld(); $(".pt-country").scrollIntoView({ behavior: "smooth", block: "start" }); }
    const go = e.target.closest("[data-pt]"); if (go) showView(go.dataset.pt);
  });
  $("#pt-world").addEventListener("input", (e) => {
    if (e.target.id === "ptAbroadGross") renderAbroadEstimate(A.taxes.countries[countryIndex]);
    if (e.target.id === "ptRuling") { saved.ruling = e.target.checked; store(); renderAbroadEstimate(A.taxes.countries[countryIndex]); }
    if (e.target.id === "ptWorldExp") {
      worldExp = Math.max(0, Number(e.target.value) || 0); saved.worldExp = worldExp; store();
      saved.worldGross = {}; // typical pay changed: refill each estimate from it
      const pos = e.target.selectionStart; renderWorld(); const el = $("#ptWorldExp"); el.focus(); try { el.setSelectionRange(pos, pos); } catch { /* number inputs */ }
    }
  });

  renderCalc();
  const VIEW_LINK = /^#pay\/(calc|offers|world)$/;
  showView(VIEW_LINK.exec(location.hash)?.[1] || saved.view || "calc");
  addEventListener("hashchange", () => { const v = VIEW_LINK.exec(location.hash)?.[1]; if (v) showView(v); });
})();
