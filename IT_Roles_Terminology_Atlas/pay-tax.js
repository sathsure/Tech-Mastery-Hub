/*
 * Pay & tax engine for the Atlas: India take-home (old vs new regime), offer comparison and
 * rough take-home estimates for other countries. Pure functions — no DOM — so Node tests can load it.
 * Tax rules: FY / Tax Year 2026-27 for India; each country's own year in ATLAS.taxes.
 */
(function (root) {
  const round = (n) => Math.round(n);

  /** Tax on `taxable` for [from, to|null, rate%] brackets. */
  function bracketTax(taxable, brackets) {
    let tax = 0;
    for (const [from, to, rate] of brackets) {
      if (taxable <= from) break;
      tax += (Math.min(taxable, to == null ? Infinity : to) - from) * rate / 100;
    }
    return tax;
  }

  /** Contribution for bands [from, to|null, rate%] on gross pay. */
  function bandAmount(gross, bands, exemptUpTo = 0) {
    if (gross <= exemptUpTo) return 0;
    return bracketTax(gross, bands);
  }

  // ---------- India ----------

  const INDIA = {
    new: { deduction: 75000, brackets: [[0, 400000, 0], [400000, 800000, 5], [800000, 1200000, 10], [1200000, 1600000, 15], [1600000, 2000000, 20], [2000000, 2400000, 25], [2400000, null, 30]], rebateUpTo: 1200000, maxSurcharge: 25, npsCap: 0.14 },
    old: { deduction: 50000, brackets: [[0, 250000, 0], [250000, 500000, 5], [500000, 1000000, 20], [1000000, null, 30]], rebateUpTo: 500000, maxSurcharge: 37, npsCap: 0.10 },
  };
  const SURCHARGE = [[5e6, 10], [1e7, 15], [2e7, 25], [5e7, 37]];
  const METRO_HRA = 0.5, OTHER_HRA = 0.4;
  const PF_RATE = 0.12, PF_CEILING = 25000, GRATUITY_RATE = 0.0481; // 15/26 of a month per year, as payroll quotes it

  /** Slab tax after the 87A rebate and its marginal relief (new regime). */
  function indiaBaseTax(taxable, regime) {
    const r = INDIA[regime];
    const tax = bracketTax(taxable, r.brackets);
    if (taxable <= r.rebateUpTo) return 0;
    // New regime: just above ₹12 lakh, tax can't exceed the income above ₹12 lakh.
    return regime === "new" ? Math.min(tax, taxable - r.rebateUpTo) : tax;
  }

  /** Full tax: slabs, rebate, surcharge (with marginal relief) and 4% cess. */
  function indiaTax(taxable, regime) {
    taxable = Math.max(0, taxable);
    const base = indiaBaseTax(taxable, regime);
    const cap = INDIA[regime].maxSurcharge;
    let surcharge = 0;
    const tier = [...SURCHARGE].reverse().find(([limit]) => taxable > limit);
    if (tier) {
      const [limit, rawRate] = tier;
      const rate = Math.min(rawRate, cap);
      surcharge = base * rate / 100;
      // Marginal relief: crossing a surcharge limit can't cost more than the income above it.
      const lower = SURCHARGE.filter(([l]) => l < limit).pop();
      const atLimit = indiaBaseTax(limit, regime) * (lower ? Math.min(lower[1], cap) : 0) / 100 + indiaBaseTax(limit, regime);
      surcharge = Math.max(0, Math.min(surcharge, atLimit + (taxable - limit) - base));
    }
    const cess = (base + surcharge) * 0.04;
    return { slab: base, surcharge, cess, total: round(base + surcharge + cess) };
  }

  const DEFAULTS = {
    ctc: 1500000, variablePct: 10, payoutPct: 100, basicPct: 50, hraPct: 50, pfMode: "ceiling", gratuity: true,
    benefits: 0, employerNpsPct: 0, pt: 2500, metro: true, rent: 25000, inv80c: 150000, d80d: 25000, nps1b: 0, homeLoan: 0, otherIncome: 0,
  };

  function employerCosts(gross, o) {
    const basic = gross * o.basicPct / 100;
    const pf = o.pfMode === "none" ? 0 : o.pfMode === "basic" ? basic * PF_RATE : Math.min(basic / 12, PF_CEILING) * 12 * PF_RATE;
    const gratuity = o.gratuity ? basic * GRATUITY_RATE : 0;
    const nps = basic * o.employerNpsPct / 100;
    return { basic, pf, gratuity, nps, total: pf + gratuity + nps };
  }

  /**
   * Breaks a CTC into gross pay and take-home under both regimes.
   * Gross is solved from: fixed CTC = gross + employer PF + gratuity + employer NPS (+ other benefits).
   */
  function indiaSalary(input) {
    const o = { ...DEFAULTS, ...input };
    const variable = o.ctc * o.variablePct / 100;
    const variablePaid = variable * o.payoutPct / 100;
    const fixedCtc = o.ctc - variable - o.benefits;
    let lo = 0, hi = Math.max(0, fixedCtc);
    for (let i = 0; i < 60; i++) {
      const mid = (lo + hi) / 2;
      if (mid + employerCosts(mid, o).total > fixedCtc) hi = mid; else lo = mid;
    }
    const gross = lo;
    const e = employerCosts(gross, o);
    const hra = Math.min(e.basic * o.hraPct / 100, gross - e.basic);
    const special = gross - e.basic - hra;
    const employeePf = e.pf;
    const income = gross + variablePaid + o.otherIncome;

    const regimes = {};
    for (const regime of ["new", "old"]) {
      const r = INDIA[regime];
      const npsDeduction = Math.min(e.nps, e.basic * r.npsCap);
      const lines = [["Standard deduction", r.deduction], ["Employer NPS (80CCD(2))", npsDeduction]];
      if (regime === "old") {
        const rentYear = o.rent * 12;
        const hraExempt = rentYear > 0 ? Math.max(0, Math.min(hra, rentYear - 0.1 * e.basic, e.basic * (o.metro ? METRO_HRA : OTHER_HRA))) : 0;
        lines.push(["HRA exemption", hraExempt], ["Professional tax", Math.min(o.pt, 2500)], ["80C (incl. your PF)", Math.min(150000, employeePf + o.inv80c)],
          ["80D health insurance", Math.min(o.d80d, 100000)], ["80CCD(1B) NPS", Math.min(o.nps1b, 50000)], ["Home-loan interest (24b)", Math.min(o.homeLoan, 200000)]);
      }
      const deductions = lines.reduce((sum, [, v]) => sum + v, 0);
      const taxable = Math.max(0, income - deductions);
      const tax = indiaTax(taxable, regime);
      const netAnnual = income - employeePf - o.pt - tax.total;
      regimes[regime] = {
        deductions: lines.filter(([, v]) => v > 0).map(([n, v]) => [n, round(v)]),
        taxable: round(taxable), tax, netAnnual: round(netAnnual),
        monthly: round((gross + o.otherIncome - employeePf - o.pt - tax.total) / 12),
        effective: income ? tax.total / income : 0,
      };
    }
    const best = regimes.new.netAnnual >= regimes.old.netAnnual ? "new" : "old";
    return {
      input: o, ctc: o.ctc, variable: round(variable), variablePaid: round(variablePaid), fixedCtc: round(fixedCtc), benefits: round(o.benefits),
      gross: round(gross), monthlyGross: round(gross / 12), basic: round(e.basic), hra: round(hra), special: round(special),
      employerPf: round(e.pf), gratuity: round(e.gratuity), employerNps: round(e.nps), employeePf: round(employeePf), pt: o.pt,
      regimes, best, saving: Math.abs(regimes.new.netAnnual - regimes.old.netAnnual),
    };
  }

  /**
   * One job offer, valued like a person would: guaranteed monthly pay, then year-1 and later cash after tax.
   * Joining bonus and the yearly stock value are taxed as salary in the year received.
   */
  function valueOffer(offer, personal) {
    const base = { ...personal, ctc: offer.ctc, variablePct: offer.variablePct, pfMode: offer.pfMode ?? personal.pfMode, metro: offer.metro ?? personal.metro };
    const stockYear = offer.vestYears > 0 ? offer.stock / offer.vestYears : 0;
    const plain = indiaSalary(base);
    const year1 = indiaSalary({ ...base, otherIncome: (offer.joining || 0) + stockYear });
    const later = indiaSalary({ ...base, otherIncome: stockYear });
    const pick = (s) => s.regimes[s.best];
    return {
      fixed: plain.fixedCtc + plain.benefits, variableExpected: plain.variablePaid, monthly: pick(plain).monthly, regime: plain.best,
      year1Net: pick(year1).netAnnual, laterNet: pick(later).netAnnual, stockYear: round(stockYear),
      totalComp1: round(offer.ctc - plain.variable + plain.variablePaid + (offer.joining || 0) + stockYear),
      salary: plain,
    };
  }

  // ---------- Other countries ----------

  /** Germany §32a EStG 2026 (tax class I). */
  function germanyIncomeTax(zve) {
    const x = Math.floor(zve);
    if (x <= 12348) return 0;
    if (x <= 17799) { const y = (x - 12348) / 10000; return Math.floor((914.51 * y + 1400) * y); }
    if (x <= 69878) { const z = (x - 17799) / 10000; return Math.floor((173.10 * z + 2397) * z + 1034.87); }
    if (x <= 277825) return Math.floor(0.42 * x - 11135.63);
    return Math.floor(0.45 * x - 19470.38);
  }

  /** Solidarity surcharge 2026: only above €20,350 of income tax, phased in at 11.9%. */
  const germanySoli = (tax) => (tax <= 20350 ? 0 : Math.min(tax * 0.055, (tax - 20350) * 0.119));

  /** Netherlands 2026 tax credits (below state-pension age), from the Belastingdienst tables. */
  function nlGeneralCredit(income) {
    if (income <= 29736) return 3115;
    return Math.max(0, 3115 - 0.06398 * (income - 29736));
  }
  function nlLabourCredit(income) {
    if (income <= 11965) return 0.08324 * income;
    if (income <= 25845) return 996 + 0.31009 * (income - 11965);
    if (income <= 45592) return 5300 + 0.0195 * (income - 25845);
    if (income <= 132920) return Math.max(0, 5685 - 0.0651 * (income - 45592));
    return 0;
  }

  /** Japan employment income deduction for 2026: the standard table, with the ¥740,000 minimum (¥690,000 + ¥50,000). */
  function jpEmploymentDeduction(gross) {
    let d;
    if (gross <= 1800000) d = gross * 0.4 - 100000;
    else if (gross <= 3600000) d = gross * 0.3 + 80000;
    else if (gross <= 6600000) d = gross * 0.2 + 440000;
    else if (gross <= 8500000) d = gross * 0.1 + 1100000;
    else d = 1950000;
    return Math.min(gross, Math.max(740000, d));
  }

  /**
   * Rough yearly take-home for a single employee in `country` (an ATLAS.taxes entry) on `gross` local pay.
   * Returns null for countries marked reference-only. options.ruling: apply the Dutch 30% ruling.
   */
  function countryEstimate(country, gross, options = {}) {
    if (!country.calc || country.calc === "india") return null;
    const regime = country.regimes[0];
    const social = (country.socialBands || []).map((s) => ({ n: s.n, amount: bandAmount(gross, s.bands, s.exemptUpTo) }));
    const socialTotal = social.reduce((sum, s) => sum + s.amount, 0);
    let taxable = Math.max(0, gross - (regime.deduction || 0));
    let tax = 0;
    const extra = [];
    if (country.calc === "uk") {
      const allowance = Math.max(0, regime.deduction - Math.max(0, gross - 100000) / 2);
      taxable = Math.max(0, gross - allowance);
      tax = bracketTax(taxable, regime.brackets);
    } else if (country.calc === "germany") {
      // Taxable income: minus work-expense and special-expense lump sums and most social contributions.
      const deductibleSocial = social.filter((s) => s.n !== "Unemployment").reduce((sum, s) => sum + (s.n === "Health" ? s.amount * 0.96 : s.amount), 0);
      taxable = Math.max(0, gross - 1230 - 36 - deductibleSocial);
      tax = germanyIncomeTax(taxable);
      const soli = germanySoli(tax);
      if (soli) extra.push({ n: "Solidarity surcharge", amount: soli });
    } else if (country.calc === "netherlands") {
      // 30% ruling: up to 30% of salary is paid tax-free (2026).
      taxable = options.ruling ? gross * 0.7 : gross;
      const credits = nlGeneralCredit(taxable) + nlLabourCredit(taxable);
      tax = Math.max(0, bracketTax(taxable, regime.brackets) - credits);
    } else if (country.calc === "japan") {
      const socialTotal0 = social.reduce((sum, s) => sum + s.amount, 0);
      const employment = jpEmploymentDeduction(gross);
      const basic = gross <= 6650000 ? 1040000 : 620000;
      taxable = Math.max(0, Math.floor((gross - employment - socialTotal0 - basic) / 1000) * 1000);
      tax = bracketTax(taxable, regime.brackets) * 1.021; // + 2.1% reconstruction surtax
      // Resident tax: about 10% with its own ¥430,000 basic deduction, plus a small flat charge; paid a year later.
      const residentBase = Math.max(0, gross - employment - socialTotal0 - 430000);
      extra.push({ n: "Resident tax (from your 2nd year)", amount: residentBase * 0.1 + 5000 });
    } else {
      tax = Math.max(0, bracketTax(taxable, regime.brackets) - (regime.credit || 0));
    }
    const extraTotal = extra.reduce((sum, s) => sum + s.amount, 0);
    const net = gross - tax - extraTotal - socialTotal;
    return {
      gross, taxable: round(taxable), incomeTax: round(tax), extra: extra.map((s) => ({ n: s.n, amount: round(s.amount) })),
      social: social.map((s) => ({ n: s.n, amount: round(s.amount) })), net: round(net), monthly: round(net / 12),
      effective: gross ? (gross - net) / gross : 0, excludes: country.excludes || null,
    };
  }

  const api = { bracketTax, indiaTax, indiaSalary, valueOffer, countryEstimate, germanyIncomeTax, DEFAULTS, INDIA };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.PayTax = api;
})(typeof window !== "undefined" ? window : globalThis);
