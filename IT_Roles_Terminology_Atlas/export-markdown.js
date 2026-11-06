// Generates IT_Roles_Terminology_Atlas.md from it-atlas-data.js for the Tech-Mastery-Hub AI chatbot.
// Usage: node export-markdown.js
const fs = require("fs");
const path = require("path");
const A = require("./it-atlas-data.js");

const cell = (s) => String(s || "").replace(/\|/g, "\\|");
const list = (arr) => (arr && arr.length ? arr.join(", ") : "—");
const famName = (id) => A.families.find((f) => f.id === id).name;
const out = [];

out.push("# IT Roles & Terminology Atlas", "");
out.push("> One-stop reference for IT career hierarchy, roles, terminology, languages, frameworks and tools. Generated from `it-atlas-data.js` — edit the data file, then re-run `node export-markdown.js`.", "");

out.push("## Career Hierarchy", "");
for (const [label, rows] of [["Individual Contributor (Technical) Track", A.ladder.ic], ["Management (People) Track", A.ladder.mgmt]]) {
  out.push(`### ${label}`, "", "| Level | Title | Also called | Typical years | Scope |", "|---|---|---|---|---|");
  rows.forEach((r) => out.push(`| ${r.level} | ${cell(r.title)} | ${cell(r.aka)} | ${r.years} | ${cell(r.scope)} |`));
  out.push("");
}
A.ladder.notes.forEach((n) => out.push(`- ${n}`));
out.push("");

const LN = A.levelNames;
out.push("### Same level, different names", "", LN.note, "", `| Level | ${LN.companies.join(" | ")} |`, `|---|${LN.companies.map(() => "---").join("|")}|`);
[...A.ladder.ic, ...A.ladder.mgmt].forEach((l) => out.push(`| ${l.level} ${cell(l.title)} | ${LN.levels[l.level].map(cell).join(" | ")} |`));
out.push("");

out.push("## IT Roles", "");
for (const f of A.families) {
  out.push(`### ${f.name}`, "", `${f.desc}`, "");
  A.roles.filter((r) => r.family === f.id).forEach((r) => {
    out.push(`#### ${r.name}${r.isNew ? " (New)" : ""}`, "", r.what, "");
    const n = A.roleNames[r.name];
    if (n) {
      out.push(`- **Also called:** ${list(n.aka)}`);
      out.push(`- **At IT services firms (TCS, Infosys, Wipro, Accenture):** ${n.services}`);
      out.push(`- **At product / Big Tech companies:** ${n.product}`);
      out.push(`- **At startups:** ${n.startup}`);
    }
    const mv = A.careerMoves[r.name];
    if (mv) {
      out.push(`- **Typical experience to be hired:** ${mv.m}+ yrs`);
      out.push(`- **Next moves — grow:** ${list(mv.grow)} · **lead:** ${list(mv.lead)} · **pivot:** ${list(mv.pivot)}`);
      if (mv.narrower.length) out.push(`- **Narrower (sideways) roles:** ${list(mv.narrower)}`);
    }
    if (r.why) out.push(`- **Why it exists now:** ${r.why}`);
    out.push(`- **Languages:** ${list(r.languages)}`);
    out.push(`- **Frameworks / Standards:** ${list(r.frameworks)}`);
    out.push(`- **Tools:** ${list(r.tools)}`);
    out.push(`- **Technical skills:** ${list(r.skills)}`);
    if (r.soft) out.push(`- **Soft skills:** ${list(r.soft)}`);
    if (r.ai) out.push(`- **AI impact:** ${r.ai}`);
    out.push("");
  });
}

out.push("## Expected Pay Abroad (typical software engineer, by experience)", "", A.abroad.payNote, "",
  "| Country | Period | 0–2 yrs | 2–5 yrs | 5–8 yrs | 8–12 yrs | 12+ yrs | Tax |", "|---|---|---|---|---|---|---|---|");
for (const [c, v] of Object.entries(A.abroad.pay)) out.push(`| ${c} | per ${v.per} (${v.cur}) | ${v.bands.map((b) => `${b[1].toLocaleString("en-US")}–${b[2].toLocaleString("en-US")}`).join(" | ")} | ${cell(v.tax)} |`);
out.push("", `Role multipliers vs a generic software engineer: ${Object.entries(A.abroad.payRole).map(([k, m]) => `${A.salary.profiles.find((p) => p.key === k)?.track || k} ×${m}`).join(", ")}.`, "");

out.push("## Glossary", "");
for (const c of A.glossaryCats) {
  out.push(`### ${c}`, "", "| Term | Meaning |", "|---|---|");
  A.glossary.filter((g) => g.c === c).forEach((g) => out.push(`| **${cell(g.t)}**${g.f ? ` (${cell(g.f)})` : ""} | ${cell(g.d)} |`));
  out.push("");
}

out.push("## Technology Stack Map", "");
for (const s of A.stack) {
  out.push(`### ${s.layer}${s.isNew ? " (New)" : ""}`, "", "| Technology | Used for |", "|---|---|");
  s.items.forEach((i) => out.push(`| ${cell(i.n)} | ${cell(i.u)} |`));
  out.push("");
}

const S = A.salary;
const lakh = (n) => (n >= 100 ? `${+(n / 100).toFixed(2)} Cr` : `${n} LPA`);
const range = ([a, b]) => (b >= 100 ? `${lakh(a)} – ${lakh(b)}` : `${a}–${b} LPA`);
out.push("## Skills vs Salary — India (LPA)", "", `> ${S.disclaimer}`, "");
for (const t of S.tracks) {
  out.push(`### ${t.track}${t.isNew ? " (New)" : ""}`, "", `Stack: ${t.stack}`, "");
  out.push("| Experience (yrs) | Typical skills | Typical LPA | + Add these (skills / certs) | Potential LPA |", "|---|---|---|---|---|");
  t.rows.forEach((r) => out.push(`| ${r.y} | ${cell(r.s)} | ${range(r.lpa)} | ${cell(r.up)} | ${range(r.pot)} |`));
  out.push("");
}
out.push("### Company Type vs Pay", "", "| Company type | Examples | Pay vs IT services |", "|---|---|---|");
S.tiers.forEach((t) => out.push(`| ${cell(t.tier)} | ${cell(t.eg)} | ${cell(t.mult)} |`));
out.push("", "### Salary Adjustment Factors (multiplied on the experience band)", "");
for (const [label, arr] of [["City", S.cities], ["Company type", S.companies], ["Work mode", S.workModes]]) {
  out.push(`- **${label}:** ${arr.map((x) => `${x.n} ×${x.m}`).join("; ")}`);
}
out.push("", "### Expected Resume Skills by Role and Level", "", "`A / B` = any one of them. Mid = 4+ yrs, Senior = 7+ yrs. Adding more than the listed limit of languages, frameworks or clouds signals breadth over depth.", "");
const grp = (arr) => arr.map((g) => g.replace(/\|/g, " / ")).join(", ");
for (const p of S.profiles) {
  out.push(`#### ${p.track}`, "", `- **All levels:** ${grp(p.core)}`, `- **Mid (4+ yrs):** ${grp(p.adv)}`, `- **Senior (7+ yrs):** ${grp(p.senior)}`);
  const extras = S.skills.filter((s) => s.b >= 2 && s.t.split(" ").includes(p.key)).map((s) => s.n);
  if (extras.length) out.push(`- **High-value add-ons:** ${extras.join(", ")}`);
  out.push("");
}
out.push(`Focus limits (under 8 yrs / 8+ yrs): ${Object.entries(S.focusLimits).map(([c, l]) => `${c} ${l[0]}/${l[1]}`).join("; ")}.`);
out.push("", "### Biggest Salary Boosters", "");
S.boosters.forEach((b) => out.push(`- **${b.b}:** ${b.i}`));
out.push("");

out.push(`### Market Reality (${S.asOf})`, "");
S.reality.forEach((r) => out.push(`- ${r.f} ([source](${r.src}))`));
out.push("");

const AB = A.abroad;
out.push(`## Working Abroad from India (checked ${AB.asOf})`, "", `> ${AB.disclaimer}`, "");
const byRank = AB.countries.slice().sort((a, b) => a.rank - b.rank);
const trackName = (key) => S.profiles.find((p) => p.key === key).track;
out.push("Ordered from most realistic to hardest for Indian IT professionals.", "");
out.push("| Country | Odds from India | Typical pay | Visa route | Usual minimum experience |", "|---|---|---|---|---|");
byRank.forEach((k) => out.push(`| ${k.c} | ${k.oddsText} | ${cell(k.pay)} | ${cell(k.visa)} | ${k.minExp}+ yrs |`));
out.push("");
byRank.forEach((k) => {
  const high = Object.entries(k.demand).filter(([, v]) => v === 2).map(([key]) => trackName(key));
  const some = Object.entries(k.demand).filter(([, v]) => v === 1).map(([key]) => trackName(key));
  out.push(`### ${k.c} — ${k.oddsText}`, "", `**Latest (${AB.asOf}):** ${k.latest}`, "", `**Blunt take:** ${k.blunt}`, "",
    `- **Visa rule:** ${k.rule}`, `- **High demand roles:** ${high.join(", ") || "—"}`, `- **Some demand:** ${some.join(", ") || "—"}`,
    `- **Official source:** ${k.link}`, "", "**How to get in (best route first):**", "");
  k.how.forEach((h, i) => out.push(`${i + 1}. ${h}`));
  out.push("");
});
out.push("### How to Actually Get an Interview", "");
AB.howTo.forEach((h, i) => out.push(`${i + 1}. ${h}`));
out.push("", "> Live job and news feeds are only available in the interactive page (Arbeitnow, Remotive, Jobicy, Hacker News search).", "");

out.push("## Who Does What in a Project", "", "| Phase | What | Who | Output |", "|---|---|---|---|");
A.sdlc.forEach((p) => out.push(`| ${p.phase} | ${cell(p.what)} | ${cell(p.who)} | ${cell(p.out)} |`));
out.push("");

const file = path.join(__dirname, "IT_Roles_Terminology_Atlas.md");
fs.writeFileSync(file, out.join("\n"), "utf8");
console.log(`Wrote ${file} — ${A.roles.length} roles (${A.roles.filter((r) => r.isNew).length} new), ${A.glossary.length} terms, ${A.stack.reduce((n, s) => n + s.items.length, 0)} technologies.`);
