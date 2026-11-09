/**
 * Mock interview: the tutor asks questions from the notes one at a time, the user types an answer,
 * and each answer is scored 1–4 by how many of the model answer's key points it covers.
 *
 * The interview's state (questions, position, scores) travels with each request and comes back on the
 * done event, so the server keeps nothing between turns.
 */
import type { MockState } from "./chat-contracts.js";
import { askLink } from "./chat-guidance.js";
import type { QuestionEntry } from "./question-index-contracts.js";
import { getQuestionsByTopic, isContextQuestion, loadQuestionIndex } from "./question-index.js";
import { entityKey, loadVocabulary } from "./question-search.js";
import { keyPoints } from "./chat-question-set.js";
import { TOPIC_DESCRIPTIONS, topicLabel } from "./topic-labels.js";

export const MOCK_PREFIX = "Mock interview: ";
export const MOCK_LENGTH = 5;
export const SKIP = "Skip this question";
export const END = "End the mock interview";

/** "Mock interview on Java", "Quiz me on SQL", "Interview me about React", "/quiz java". */
export function isMockRequest(message: string): boolean {
  return /\b(mock interview|quiz me|interview me|test me|practice interview|practise interview)\b/i.test(message);
}

/** Learning topics named in the message, using the topic labels and the search vocabulary. */
export function mockTopic(message: string): string | null {
  const text = ` ${entityKey(message)} `;
  const vocabulary = loadVocabulary();
  const names: Array<[string, string]> = [
    ...Object.keys(TOPIC_DESCRIPTIONS).map(topic => [entityKey(topicLabel(topic)), topic] as [string, string]),
    ...Object.entries(vocabulary.topicAliases).flatMap(([topic, aliases]) => aliases.map(alias => [entityKey(alias), topic] as [string, string])),
  ];
  // Longest name first, so "spring security" beats "spring".
  const found = names.filter(([name]) => name && text.includes(` ${name} `)).sort((a, b) => b[0].length - a[0].length)[0];
  return found && !ATLAS.has(found[1]) ? found[1] : null;
}

const ATLAS = new Set(["it-roles", "it-terminology", "tech-stack", "it-careers", "roadmaps"]);

/** Questions worth asking: standalone, from interview notes, with at least two key points to grade against. */
function askable(entry: QuestionEntry): boolean {
  return entry.kind === "question" && entry.source.path.startsWith("interview/") && !isContextQuestion(entry) && entry.question.length <= 160 && keyPoints(entry).length >= 2;
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const list = [...items];
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

/** Topics that have enough gradeable questions, for the picker. */
async function mockTopics(): Promise<string[]> {
  const { entries } = await loadQuestionIndex();
  const counts = new Map<string, number>();
  for (const entry of entries) if (askable(entry) && entry.topics[0]) counts.set(entry.topics[0], (counts.get(entry.topics[0]) ?? 0) + 1);
  return [...counts].filter(([topic, count]) => count >= MOCK_LENGTH && !ATLAS.has(topic)).map(([topic]) => topic).sort((a, b) => topicLabel(a).localeCompare(topicLabel(b)));
}

function questionBlock(entry: QuestionEntry, state: MockState): string {
  return [`**Question ${state.index + 1} of ${state.ids.length}**`, "", `> ${entry.question}`, "", "_Type your answer below — aim for what it is, how it works, an example and a trade-off._"].join("\n");
}

/** Starts an interview, or asks which topic when none was named. */
export async function startMock(message: string, random: () => number = Math.random): Promise<{ markdown: string; state: MockState | null; followUps: string[] }> {
  const topic = mockTopic(message);
  if (!topic) {
    const topics = await mockTopics();
    return {
      markdown: [
        "**Mock interview** — I ask 5 questions from your notes, one at a time. You type your answer, and I score it 1–4 against the key points of the model answer, then show what you missed.",
        "",
        "Pick a topic:",
        "",
        topics.map(item => askLink(topicLabel(item), `${MOCK_PREFIX}${topicLabel(item)}`)).join(" · "),
      ].join("\n"),
      state: null,
      followUps: [],
    };
  }
  const pool = (await getQuestionsByTopic(topic)).filter(entry => askable(entry) && entry.topics[0] === topic);
  if (pool.length < 2) {
    return { markdown: `Your notes don't have enough ${topicLabel(topic)} questions for a mock interview yet. Try another topic: ask "Mock interview".`, state: null, followUps: [] };
  }
  const picked = shuffle(pool, random).slice(0, MOCK_LENGTH);
  const state: MockState = { topic, ids: picked.map(entry => entry.id), index: 0, scores: [] };
  const markdown = [
    `**${MOCK_PREFIX}${topicLabel(topic)}**`,
    "",
    `${picked.length} questions from your notes. Answer each in your own words; I'll score it 1–4 and show what a strong answer covers. Say "skip" to move on, or end any time.`,
    "",
    questionBlock(picked[0], state),
  ].join("\n");
  return { markdown, state, followUps: [SKIP, END] };
}

// ---------- Grading ----------

const STOP = new Set("the a an is are was were be been to of and or in on for with from this that it its as by can into what how why when which you your i my we our they them their will would should could do does not no yes so if then than also just very more most such each any all some other use used using like e g eg etc".split(" "));

/** Rough stem, so "caching" matches "cache" and "indexes" matches "index". */
const stem = (word: string) => word.replace(/(ing|ed|es|s)$/, "").replace(/e$/, "");

function words(text: string): string[] {
  return [...new Set(text.toLowerCase().replace(/[^a-z0-9+#.\s-]/g, " ").split(/[\s-]+/).filter(word => word.length > 2 && !STOP.has(word)).map(stem))];
}

export interface Grade {
  score: 1 | 2 | 3 | 4;
  covered: string[];
  missed: string[];
}

/** Scores an answer by the share of key points it covers (a point counts when ~40% of its main words appear). */
export function gradeAnswer(answer: string, entry: QuestionEntry): Grade {
  const said = new Set(words(answer));
  const points = keyPoints(entry);
  const covered: string[] = [];
  const missed: string[] = [];
  for (const point of points) {
    const needed = words(point);
    const hits = needed.filter(word => said.has(word)).length;
    (needed.length && hits / needed.length >= 0.4 ? covered : missed).push(point);
  }
  // The summary's main words count too, for answers that explain the idea without the list's exact points.
  const summaryWords = words(entry.summary);
  const summaryShare = summaryWords.length ? summaryWords.filter(word => said.has(word)).length / summaryWords.length : 0;
  const share = Math.max(points.length ? covered.length / points.length : 0, summaryShare * 0.8);
  let score: Grade["score"] = share >= 0.75 ? 4 : share >= 0.5 ? 3 : share >= 0.25 ? 2 : 1;
  // A one-liner can't be a complete interview answer.
  if (answer.trim().split(/\s+/).length < 12 && score > 2) score = 2;
  return { score, covered, missed };
}

const SCORE_TEXT: Record<number, string> = {
  1: "Not there yet — review this one.",
  2: "Partly right — add how it works and an example.",
  3: "Good — a little more depth or a trade-off makes it great.",
  4: "Strong answer.",
};

const isSkip = (message: string) => /^\s*(skip|pass|next|i don'?t know|no idea|skip this question)\b/i.test(message);
const isEnd = (message: string) => /^\s*(end|stop|finish|quit|end the mock interview|end interview)\b/i.test(message);

/** Grades the answer to the current question, then asks the next one or closes with a summary. */
export async function continueMock(message: string, state: MockState): Promise<{ markdown: string; state: MockState; followUps: string[] }> {
  const { entries } = await loadQuestionIndex();
  const byId = new Map(entries.map(entry => [entry.id, entry]));
  const questions = state.ids.map(id => byId.get(id)).filter((entry): entry is QuestionEntry => Boolean(entry));
  const lines: string[] = [];
  const next: MockState = { ...state, scores: [...state.scores] };
  const current = questions[state.index];

  if (isEnd(message)) {
    next.index = questions.length;
  } else if (current) {
    if (isSkip(message)) {
      next.scores[state.index] = null;
      lines.push(`**Skipped.** A strong answer covers: ${keyPoints(current).join("; ")}.`, "", `- ${askLink("Full model answer", current.question)}`);
    } else {
      const grade = gradeAnswer(message, current);
      next.scores[state.index] = grade.score;
      lines.push(`**Score: ${grade.score}/4** — ${SCORE_TEXT[grade.score]}`, "");
      if (grade.covered.length) lines.push(`- **You covered:** ${grade.covered.join("; ")}`);
      if (grade.missed.length) lines.push(`- **Missed:** ${grade.missed.join("; ")}`);
      lines.push(`- **Model answer in short:** ${current.summary}`, `- ${askLink("Full model answer", current.question)}`);
    }
    next.index = state.index + 1;
  }

  if (next.index < questions.length) {
    lines.push("", "---", "", questionBlock(questions[next.index], next));
    return { markdown: lines.join("\n"), state: next, followUps: [SKIP, END] };
  }
  lines.push("", "---", "", ...summary(questions, next));
  return { markdown: lines.join("\n"), state: next, followUps: [`${MOCK_PREFIX}${topicLabel(state.topic)}`, `${topicLabel(state.topic)} study path`, "Mock interview"] };
}

function summary(questions: QuestionEntry[], state: MockState): string[] {
  const scored = state.scores.filter((score): score is number => typeof score === "number");
  const average = scored.length ? scored.reduce((sum, score) => sum + score, 0) / scored.length : 0;
  const verdict = !scored.length ? "No answers scored." : average >= 3.25 ? "Interview-ready on this topic." : average >= 2.5 ? "Nearly there — review the weaker answers below." : "Needs more practice — go through the study path, then try again.";
  const rows = questions.map((entry, i) => {
    const score = state.scores[i];
    return `| ${i + 1} | ${entry.question.replace(/\|/g, "\\|")} | ${score == null ? (i < state.index ? "skipped" : "—") : `${score}/4`} |`;
  });
  const review = questions.filter((_, i) => state.scores[i] == null || (state.scores[i] ?? 0) <= 2);
  return [
    `**Mock interview result: ${topicLabel(state.topic)}**`,
    "",
    `Average **${scored.length ? average.toFixed(1) : "–"}/4** over ${scored.length} answered question${scored.length === 1 ? "" : "s"}. ${verdict}`,
    "",
    "| # | Question | Score |",
    "|---|---|---|",
    ...rows,
    "",
    ...(review.length ? ["**Review these:**", "", ...review.map(entry => `- ${askLink(entry.question, entry.question)}`), ""] : []),
    "_Scores come from matching the key points in your notes, so treat them as a guide — a correct answer in different words can score lower._",
  ];
}
