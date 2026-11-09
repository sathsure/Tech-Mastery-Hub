/* Checks the pay & tax engine against hand-worked figures. Run: node IT_Roles_Terminology_Atlas/pay-tax.test.js */
const assert = require("node:assert/strict");
const T = require("./pay-tax.js");
const A = require("./it-atlas-data.js");

const results = [];
function check(name, run) {
  try { run(); results.push(`PASS ${name}`); } catch (e) { results.push(`FAIL ${name}: ${e.message}`); process.exitCode = 1; }
}
const near = (actual, expected, tolerance, label) => assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: ${actual} vs ${expected}`);
const country = (name) => A.taxes.countries.find((c) => c.c === name);

// Same assumptions as the worked examples in interview/career/01-Salary-Compensation-India.md.
const example = { variablePct: 10, payoutPct: 100, basicPct: 50, hraPct: 50, pfMode: "ceiling", gratuity: true, pt: 2500, metro: true, rent: 25000, inv80c: 150000, d80d: 25000 };

check("India: ₹10/15/20/25 LPA match the worked examples", () => {
  const expected = { 1000000: [843709, 0, 14099, 67101], 1500000: [1283140, 87070, 110718, 96464], 2000000: [1722572, 176295, 267135, 125648], 2500000: [2162004, 295621, 426693, 152324] };
  for (const [ctc, [gross, newTax, oldTax, monthly]] of Object.entries(expected)) {
    const s = T.indiaSalary({ ...example, ctc: Number(ctc) });
    near(s.gross, gross, 2, `gross ${ctc}`);
    near(s.regimes.new.tax.total, newTax, 3, `new tax ${ctc}`);
    near(s.regimes.old.tax.total, oldTax, 3, `old tax ${ctc}`);
    near(s.regimes.new.monthly, monthly, 3, `monthly ${ctc}`);
    assert.equal(s.best, "new");
  }
});

check("India: 87A rebate and marginal relief", () => {
  assert.equal(T.indiaTax(1200000, "new").total, 0);
  assert.equal(T.indiaTax(1210000, "new").total, 10400, "tax limited to income above ₹12 lakh, plus cess");
  assert.equal(T.indiaTax(500000, "old").total, 0);
  assert.equal(T.indiaTax(500001, "old").total, 13000, "no relief in the old regime: 12,500 + 4% cess");
});

check("India: surcharge relief just above ₹50 lakh", () => {
  const at = T.indiaTax(5000000, "new").total;
  const above = T.indiaTax(5010000, "new").total;
  assert.ok(above - at <= 10000 * 1.04 + 1, `crossing ₹50 lakh by ₹10,000 adds ${above - at}`);
  assert.ok(T.indiaTax(6000000, "new").surcharge > 0);
});

check("India: home loan and high rent can make the old regime win", () => {
  const s = T.indiaSalary({ ...example, ctc: 2000000, rent: 50000, homeLoan: 200000, nps1b: 50000, d80d: 75000 });
  assert.equal(s.best, "old");
});

check("Offers: joining bonus and stock raise year-1 cash, not monthly pay", () => {
  const personal = { ...example };
  const a = T.valueOffer({ ctc: 2000000, variablePct: 10 }, personal);
  const b = T.valueOffer({ ctc: 2000000, variablePct: 10, joining: 200000, stock: 800000, vestYears: 4 }, personal);
  assert.equal(a.monthly, b.monthly);
  assert.ok(b.year1Net > a.year1Net && b.laterNet > a.laterNet && b.year1Net > b.laterNet);
  assert.equal(b.totalComp1, 2000000 + 200000 + 200000);
});

check("Germany: §32a 2026 formula is continuous at every zone edge", () => {
  assert.equal(T.germanyIncomeTax(12348), 0);
  near(T.germanyIncomeTax(17800) - T.germanyIncomeTax(17799), 0, 1, "zone 2/3");
  near(T.germanyIncomeTax(69879) - T.germanyIncomeTax(69878), 0, 1, "zone 3/4");
  near(T.germanyIncomeTax(277826) - T.germanyIncomeTax(277825), 0, 1, "zone 4/5");
});

check("UK: personal allowance taper and NI", () => {
  const uk = country("United Kingdom");
  const at50 = T.countryEstimate(uk, 50000);
  assert.equal(at50.incomeTax, 7486, "20% of 37,430");
  assert.equal(at50.social[0].amount, 2994, "8% of 37,430");
  assert.equal(T.countryEstimate(uk, 125140).taxable, 125140, "no allowance left at £125,140");
});

check("US, Canada, Ireland, Australia, Singapore, UAE: hand-worked figures", () => {
  const us = T.countryEstimate(country("United States"), 100000);
  assert.equal(us.incomeTax, 13170, "1,240 + 4,560 + 22% of 33,500 on $83,900 taxable");
  assert.equal(us.social.reduce((s, x) => s + x.amount, 0), 7650);
  const ca = T.countryEstimate(country("Canada"), 74600);
  assert.equal(ca.social.find((s) => s.n === "CPP").amount, 4230, "maximum CPP");
  const ie = T.countryEstimate(country("Ireland"), 60000);
  assert.equal(ie.incomeTax, 11200, "8,800 + 6,400 − 4,000 credits");
  const au = T.countryEstimate(country("Australia"), 100000);
  assert.equal(au.incomeTax, 20520, "4,020 + 30% of 55,000");
  const sg = T.countryEstimate(country("Singapore"), 121000);
  assert.equal(sg.incomeTax, 7950, "chargeable 120,000 → $7,950");
  assert.equal(T.countryEstimate(country("UAE (Dubai/Abu Dhabi)"), 300000).net, 300000);
  const nl = T.countryEstimate(country("Netherlands"), 60000);
  assert.equal(nl.incomeTax, 15906, "brackets 21,832 − general credit 1,179 − labour credit 4,747");
  assert.ok(T.countryEstimate(country("Netherlands"), 60000, { ruling: true }).net > nl.net, "30% ruling raises take-home");
  const jp = T.countryEstimate(country("Japan"), 6000000);
  assert.equal(jp.taxable, 2444000, "6M − 1.64M employment deduction − 876,000 social − 1.04M basic");
  assert.equal(jp.incomeTax, 149985, "146,900 + 2.1% surtax");
  const jp8 = T.countryEstimate(country("Japan"), 8000000);
  assert.equal(jp8.taxable, 4280000, "8M − 1.9M employment deduction − 1,149,700 social − 670,000 basic (income 6.1M is in the middle band)");
});

check("Data: every country has a year, brackets and an official link", () => {
  for (const c of A.taxes.countries) {
    assert.ok(c.year && c.regimes.length && c.regimes.every((r) => r.brackets.length), c.c);
    assert.ok(c.links.length && c.links.every((l) => /^https:\/\//.test(l.u)), `${c.c} links`);
  }
});

console.log(results.join("\n"));
console.log(`${results.filter((r) => r.startsWith("PASS")).length}/${results.length} passed`);
