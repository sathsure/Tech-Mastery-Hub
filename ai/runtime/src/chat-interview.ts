/**
 * Interview prep for a role: first a picker of the role's tech stacks (a checklist grouped by layer),
 * then, for the ticked stacks, a prep plan with the key questions to practise for each one.
 */
import type { PlanRequest } from "./chat-contracts.js";
import { askLink } from "./chat-guidance.js";
import type { QuestionEntry } from "./question-index-contracts.js";
import { getQuestionsByTopic, isContextQuestion } from "./question-index.js";
import { topicLabel } from "./topic-labels.js";
import { topicSlug } from "./roadmap-generator.js";

/** Picker groups, in the order a candidate usually prepares them (basics before frameworks, HR last). */
const LAYERS: Array<[string, string[]]> = [
  ["Frontend", ["html", "css", "javascript", "typescript", "angular", "react", "rxjs", "web-vitals"]],
  ["Backend", ["java", "spring", "spring-security", "nodejs", "rest-api", "microservices", "spring-cloud", "messaging"]],
  ["Data", ["database/sql", "caching"]],
  ["Cloud & DevOps", ["git", "devops", "aws"]],
  ["AI", ["ai"]],
  ["Core skills", ["dsa", "design-patterns", "testing", "networking", "system-design", "web-architecture", "under-the-hood"]],
  ["HR round", ["behavioral"]],
];
const ORDER = LAYERS.flatMap(([, topics]) => topics);

/** Topics a role's stack implies even when the role text doesn't name them. */
const IMPLIES: Record<string, string[]> = {
  angular: ["html", "css", "typescript", "rxjs"],
  react: ["html", "css", "javascript"],
  typescript: ["javascript"],
  nodejs: ["javascript", "rest-api"],
  spring: ["java", "rest-api", "microservices", "design-patterns"],
  devops: ["git", "aws", "networking"],
  aws: ["devops"],
};

/** Programming topics: a role that writes code in one of them also gets the coding-interview basics (DSA, design, testing). SQL alone doesn't count — analysts use it too. */
const ENGINEERING = new Set(["javascript", "typescript", "angular", "react", "nodejs", "java", "spring", "devops", "aws"]);

/** The stacks to offer for a role, in picker order. */
export function interviewTopics(relatedTopics: string[]): string[] {
  const picked = new Set(relatedTopics.filter(topic => ORDER.includes(topic)));
  for (const topic of [...picked]) for (const implied of IMPLIES[topic] ?? []) picked.add(implied);
  if ([...picked].some(topic => ENGINEERING.has(topic))) for (const core of ["dsa", "system-design", "testing"]) picked.add(core);
  picked.add("behavioral");
  return ORDER.filter(topic => picked.has(topic));
}

/** "Interview prep: Full Stack Developer", "Prepare me for a Full Stack Developer interview" → "Full Stack Developer". */
export function interviewPrepRole(message: string): string | null {
  const text = message.trim().replace(/[?.!]+$/, "");
  const direct = /^interview prep(?:aration)?(?::| for)\s+(?:an?\s+)?(.+)$/i.exec(text);
  if (direct) return direct[1].trim();
  const prepare = /^prepare me for an?\s+(.+?)\s+interview$/i.exec(text);
  return prepare ? prepare[1].trim() : null;
}

const clean = (name: string) => name.toLowerCase().replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s+/g, " ").trim();

/** The role entry whose name (or another name for it) matches. */
export function findRole(name: string, entries: QuestionEntry[]): QuestionEntry | null {
  const wanted = clean(name);
  return (
    entries.find(entry => entry.kind === "role" && (entry.names ?? []).some(other => clean(other) === wanted)) ??
    entries.find(entry => entry.kind === "role" && clean(entry.question.replace(/^What does an? /, "").replace(/ do\?$/, "")) === wanted) ??
    null
  );
}

/** Heading of the picker; the web app reads it to name the plan. */
export const PICKER_PREFIX = "Interview prep: ";

/** The checklist of a role's stacks, grouped by layer. */
export function interviewPicker(role: string, topics: string[]): string {
  const lines = [
    `**${PICKER_PREFIX}${role}**`,
    "",
    "Tick the stacks your interview will cover, then press **Build my interview prep**. You get the key questions to practise for each one, in a sensible order.",
  ];
  for (const [layer, layerTopics] of LAYERS) {
    const here = layerTopics.filter(topic => topics.includes(topic));
    if (!here.length) continue;
    lines.push("", `**${layer}**`, "", ...here.map(topic => `- [ ] [${topicLabel(topic)}](../topics/${topicSlug(topic)}.md)`));
  }
  return lines.join("\n");
}

/**
 * Key questions for a topic: from its main interview notes (the file holding most of the topic's questions),
 * in the order the notes teach them, skipping questions that only make sense next to a code snippet.
 */
async function keyQuestions(topic: string, limit: number): Promise<string[]> {
  const all = (await getQuestionsByTopic(topic)).filter(
    entry => entry.kind === "question" && entry.topics[0] === topic && !isContextQuestion(entry) && entry.question.length <= 140,
  );
  const perFile = new Map<string, number>();
  for (const entry of all) perFile.set(entry.source.path, (perFile.get(entry.source.path) ?? 0) + 1);
  const weight = (entry: QuestionEntry) => (entry.source.path.startsWith("interview/") ? 0 : 1_000_000) - (perFile.get(entry.source.path) ?? 0) * 1000;
  const questions = [...all].sort((a, b) => weight(a) - weight(b) || a.source.path.localeCompare(b.source.path) || a.source.startLine - b.source.startLine);
  return [...new Set(questions.map(entry => entry.question))].slice(0, limit);
}

const TOPIC_BY_SLUG = new Map(ORDER.map(topic => [topicSlug(topic), topic]));

/** The prep plan for the ticked stacks. */
export async function buildInterviewPrep(plan: PlanRequest): Promise<string> {
  const role = plan.title.startsWith(PICKER_PREFIX) ? plan.title.slice(PICKER_PREFIX.length) : plan.title;
  const topics = ORDER.filter(topic => plan.items.some(item => item.topic && TOPIC_BY_SLUG.get(item.topic) === topic));
  const others = plan.items.filter(item => !item.topic || !TOPIC_BY_SLUG.has(item.topic));
  const lines = [`**Your interview prep${role ? ` for ${role}` : ""}**`, ""];
  if (!topics.length && !others.length) return [...lines, "Pick at least one stack to build a plan."].join("\n");

  const weeks = Math.max(1, Math.ceil(topics.length / 2));
  lines.push(
    `You picked ${topics.length + others.length} stack${topics.length + others.length === 1 ? "" : "s"}. Prepare them in this order — frontend, backend, data and DevOps first, then problem solving and design, and the HR round last.`,
    `Suggested pace: about two stacks a week, so **${weeks} week${weeks === 1 ? "" : "s"}**. For each stack, answer the key questions out loud in 2–3 minutes, then go through its study path.`,
  );
  let step = 0;
  for (const topic of topics) {
    const label = topicLabel(topic);
    const questions = await keyQuestions(topic, 5);
    lines.push("", `**${++step}. ${label}**`, "");
    if (questions.length) lines.push(...questions.map(question => `- ${askLink(question, question)}`));
    else lines.push(`- Your notes have no ${label} questions yet.`);
    lines.push(`- ${askLink(`${label} study path`, `${label} study path`)}`);
  }
  for (const item of others) lines.push("", `**${++step}. ${item.label}**`, "", `- ${askLink(item.label, item.label)}`);
  lines.push(
    "",
    "**Interview day checklist**",
    "",
    "- Explain one project end to end: the problem, your design, a hard bug, and the result in numbers.",
    "- For every technical answer: what it is → how it works → a real example → a trade-off.",
    "- Ask the interviewer one thoughtful question about the team's stack or challenges.",
    "",
    "_Tick different stacks and submit again to change the plan._",
  );
  return lines.join("\n");
}
