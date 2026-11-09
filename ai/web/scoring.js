/**
 * Live scoring sheet for an interviewer's question set: a 1–4 score and a note under every question,
 * a running summary (average, per-section averages, recommendation), and copy / print of the scorecard.
 * Scores live on the message (message.scores), so they are saved with the conversation.
 */
import { escapeHtml } from "./render.js";

const SET_TITLE = /^\*\*Interview question set: (.+?)\*\*/;
const SCALE = [
  [1, "Can't explain it, or wrong"],
  [2, "Textbook definition only"],
  [3, "How it works + a real example"],
  [4, "Trade-offs, failure modes, production experience"],
];

/** Is this answer a built question set (not the setup checklist)? */
export const isQuestionSet = message => message?.done?.view === "plan" && SET_TITLE.test(message.content ?? "");

/** The questions on screen: number, text, section, and the element to attach the score row after. */
function questionsIn(body) {
  const list = [];
  let section = "";
  for (const element of body.querySelectorAll("h3, h4, p")) {
    if (element.tagName !== "P") {
      section = (element.textContent ?? "").split(" · ")[0].replace(/\s*\(\d+ min\)$/, "").trim();
      continue;
    }
    const strong = element.querySelector(":scope > strong:first-child");
    const match = /^Q(\d+)\.\s+(.+)$/.exec(strong?.textContent?.trim() ?? "");
    if (!match) continue;
    const after = element.nextElementSibling?.tagName === "UL" ? element.nextElementSibling : element;
    list.push({ n: match[1], text: match[2], section, after });
  }
  return list;
}

const scoreOf = (scores, n) => scores[n]?.s ?? null;

function scoreRow(q, scores) {
  const current = scoreOf(scores, q.n);
  const note = scores[q.n]?.note ?? "";
  const buttons = SCALE.map(([value, meaning]) =>
    `<button type="button" class="score-btn s${value}${current === value ? " on" : ""}" data-score="${q.n}" data-value="${value}" aria-pressed="${current === value}" title="${escapeHtml(meaning)}">${value}</button>`,
  ).join("");
  return `<div class="score-row" data-score-row="${q.n}">
    <span class="score-label">Score</span>
    <span class="score-btns" role="group" aria-label="Score for question ${q.n}">${buttons}</span>
    <input class="score-note" type="text" data-score-note="${q.n}" maxlength="300" placeholder="Notes: what they said, gaps, red flags" value="${escapeHtml(note)}" aria-label="Notes for question ${q.n}">
  </div>`;
}

/** Numbers behind the summary. */
function tally(questions, scores) {
  const scored = questions.filter(q => scoreOf(scores, q.n) !== null);
  const avg = list => (list.length ? list.reduce((sum, q) => sum + scoreOf(scores, q.n), 0) / list.length : null);
  const sections = [...new Set(questions.map(q => q.section))].map(name => {
    const inSection = scored.filter(q => q.section === name);
    return { name, avg: avg(inSection), scored: inSection.length, total: questions.filter(q => q.section === name).length };
  });
  return { total: questions.length, scored: scored.length, average: avg(scored), ones: scored.filter(q => scoreOf(scores, q.n) === 1).length, sections };
}

function verdict(t) {
  if (!t.scored) return { tone: "", text: "Score each question as you go — the recommendation appears here." };
  if (t.scored < Math.ceil(t.total / 2)) return { tone: "", text: `Score at least ${Math.ceil(t.total / 2)} questions for a recommendation.` };
  const avg = t.average;
  if (t.ones > 0 && avg < 3.25) return { tone: "warn", text: `Concern: ${t.ones} answer${t.ones > 1 ? "s" : ""} scored 1. Review those before deciding.` };
  if (avg >= 3.25) return { tone: "good", text: "Strong yes — clearly above the bar." };
  if (avg >= 2.75) return { tone: "good", text: "Lean yes — discuss the weaker sections with the panel." };
  if (avg >= 2.25) return { tone: "warn", text: "Lean no — below the bar in important areas." };
  return { tone: "bad", text: "No — well below the bar for this level." };
}

function summaryHtml(questions, scores, bar) {
  const t = tally(questions, scores);
  const v = verdict(t);
  const sections = t.sections.map(s => `<li><span>${escapeHtml(s.name)}</span><span class="score-meter"><i style="width:${s.avg ? (s.avg / 4) * 100 : 0}%"></i></span><b>${s.avg ? s.avg.toFixed(1) : "–"}</b><small>${s.scored}/${s.total}</small></li>`).join("");
  return `<div class="score-head"><strong>Scorecard</strong>
      <input class="score-candidate" type="text" data-score-candidate maxlength="80" placeholder="Candidate name" value="${escapeHtml(scores._candidate ?? "")}" aria-label="Candidate name"></div>
    <div class="score-stats"><span><b>${t.scored}/${t.total}</b> scored</span><span>Average <b>${t.average ? t.average.toFixed(2) : "–"}</b> / 4</span><span>1s <b>${t.ones}</b></span></div>
    <ul class="score-sections">${sections}</ul>
    <p class="score-verdict ${v.tone}">${escapeHtml(v.text)}</p>
    ${bar ? `<p class="score-bar-note">Suggested bar for this level: ${escapeHtml(bar)}</p>` : ""}
    <div class="score-actions">
      <button type="button" class="ghost-btn" data-score-copy>Copy scorecard</button>
      <button type="button" class="ghost-btn" data-score-print>Print</button>
      <button type="button" class="ghost-btn" data-score-clear>Clear scores</button>
    </div>`;
}

/** The suggested bar sentence from the set itself ("average 3+, … and no 1s"). */
const barOf = body => /Suggested bar:\s*(.+?)\.\s/.exec(body.textContent ?? "")?.[1] ?? null;

/** Adds score rows and the summary to a rendered question set. */
export function enhanceScoring(body, message) {
  const scores = message.scores ?? {};
  const questions = questionsIn(body);
  if (!questions.length) return;
  for (const q of questions) q.after.insertAdjacentHTML("afterend", scoreRow(q, scores));
  // The summary sits just before the scoring guide, where the interviewer finishes.
  const guide = [...body.querySelectorAll("p > strong")].find(strong => strong.textContent?.trim() === "How to score")?.parentElement;
  const summary = document.createElement("section");
  summary.className = "scorecard";
  summary.setAttribute("aria-live", "polite");
  summary.innerHTML = summaryHtml(questions, scores, barOf(body));
  if (guide) guide.before(summary);
  else body.append(summary);
  body.classList.add("scoring");
}

/** Redraws the summary and one row's buttons after a change, without re-rendering the answer. */
export function refreshScoring(body, message, changed) {
  const scores = message.scores ?? {};
  if (changed) {
    body.querySelectorAll(`[data-score="${changed}"]`).forEach(button => {
      const on = Number(button.dataset.value) === scoreOf(scores, changed);
      button.classList.toggle("on", on);
      button.setAttribute("aria-pressed", String(on));
    });
  }
  const summary = body.querySelector(".scorecard");
  if (summary) summary.innerHTML = summaryHtml(questionsIn(body), scores, barOf(body));
}

/** Plain-text scorecard for sharing with the panel. */
export function scorecardText(body, message) {
  const scores = message.scores ?? {};
  const questions = questionsIn(body);
  const t = tally(questions, scores);
  const title = SET_TITLE.exec(message.content ?? "")?.[1] ?? "Interview";
  const lines = [
    `Scorecard — ${title}`,
    `Candidate: ${scores._candidate || "(not entered)"}`,
    `Date: ${new Date().toLocaleDateString()}`,
    "",
    `Scored ${t.scored}/${t.total} · average ${t.average ? t.average.toFixed(2) : "–"}/4 · 1s: ${t.ones}`,
    `Recommendation: ${verdict(t).text}`,
    "",
    "By section:",
    ...t.sections.map(s => `- ${s.name}: ${s.avg ? s.avg.toFixed(1) : "–"} (${s.scored}/${s.total} scored)`),
    "",
    "Questions:",
  ];
  let section = "";
  for (const q of questions) {
    if (q.section !== section) {
      section = q.section;
      lines.push("", `${section}`);
    }
    const score = scoreOf(scores, q.n);
    lines.push(`Q${q.n}. ${q.text} — ${score ?? "not scored"}${scores[q.n]?.note ? ` · ${scores[q.n].note}` : ""}`);
  }
  return lines.join("\n");
}
