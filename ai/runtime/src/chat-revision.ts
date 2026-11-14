/**
 * Revision pages for each technical topic, written by hand and shown exactly as written (no model).
 * Each kind lives in its own folder, one Markdown file per topic id ("/" → "-"):
 *
 *   sheet      knowledge/cheat-sheets/      "Cheat sheets"         "Java cheat sheet"
 *   traps      knowledge/quick-traps/       "Quick traps"          "Java quick traps"
 *   oneliners  knowledge/one-liners/        "One-liners"           "Java one-liners"
 *   vs         knowledge/comparisons/       "Comparisons"          "Java comparisons"
 *   output     knowledge/predict-output/    "Predict the output"   "Java predict the output"
 *   snippets   knowledge/code-snippets/     "Code snippets"        "Java code snippets"
 *   eli5       knowledge/explain-like-5/    "Explain like I'm 5"   "Explain Java like I'm 5"
 *
 * "Revise Java" builds a fresh set of flashcards from that topic's one-liners and quick traps.
 * A bare request ("Cheat sheets") opens a picker of the topics that have that kind of page.
 */
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { cardsBlock, type TopicCard } from "./chat-cards.js";
import { TOPIC_GROUPS } from "./chat-guidance.js";
import { REPOSITORY_ROOT } from "./question-indexer.js";
import { topicLabel } from "./topic-labels.js";

export type RevisionKind = "sheet" | "traps" | "oneliners" | "vs" | "output" | "snippets" | "eli5";
export const REVISION_KINDS: RevisionKind[] = ["sheet", "traps", "oneliners", "vs", "output", "snippets", "eli5"];

interface KindInfo {
  dir: string;
  /** The bare request that opens the picker, e.g. "Cheat sheets". */
  ask: string;
  /** "Java cheat sheet". */
  topicAsk: (label: string) => string;
  unit: [string, string];
  intro: string;
  missing: string;
  picker: RegExp;
  /** Capture group 1 = the topic name. */
  named: RegExp[];
  /**
   * When the name isn't a topic ("Explain closures like I'm 5"), let the tutor answer it normally
   * instead of showing the picker.
   */
  fallThrough: boolean;
  /** Suggested next steps on a page of this kind ("quiz" and "revise" are practice chips). */
  next: Array<RevisionKind | "quiz" | "revise">;
}

const END = String.raw`\s*[.?!]?\s*$`;
const LEAD = String.raw`^\s*(?:show|open|give|list|see)?\s*(?:me\s+)?(?:all\s+)?(?:the\s+|a\s+|some\s+)?`;
const FOR = String.raw`\s+(?:for|on|of|in|about|:)?\s*`;

/** Picker, "<topic> <phrase>" and "<phrase> for <topic>" patterns for one phrase. */
function phrase(words: string): { picker: RegExp; named: RegExp[] } {
  return {
    picker: new RegExp(`${LEAD}${words}${END}`, "i"),
    named: [new RegExp(`${LEAD}(.+?)\\s+${words}${END}`, "i"), new RegExp(`^\\s*${words}${FOR}(.+?)${END}`, "i")],
  };
}

const FIVE = String.raw`like\s+i'?\s*a?m\s+(?:5|five)`;

export const KINDS: Record<RevisionKind, KindInfo> = {
  sheet: {
    dir: "knowledge/cheat-sheets",
    ask: "Cheat sheets",
    topicAsk: label => `${label} cheat sheet`,
    unit: ["sheet", "sheets"],
    intro: "**Cheat sheets** — the key interview concepts of a topic on one page, in plain words with tiny examples. Pick a topic:",
    missing: "cheat sheet",
    ...phrase(String.raw`cheat[\s-]?sheets?`),
    fallThrough: false,
    next: ["traps", "quiz"],
  },
  traps: {
    dir: "knowledge/quick-traps",
    ask: "Quick traps",
    topicAsk: label => `${label} quick traps`,
    unit: ["page", "pages"],
    intro: "**Quick traps** — the tricky spots interviewers love: what people get wrong, a tiny example, and the right answer. Pick a topic:",
    missing: "quick traps page",
    ...phrase(String.raw`(?:quick[\s-]?traps?|traps|gotchas|common\s+mistakes)`),
    fallThrough: false,
    next: ["sheet", "quiz"],
  },
  oneliners: {
    dir: "knowledge/one-liners",
    ask: "One-liners",
    topicAsk: label => `${label} one-liners`,
    unit: ["page", "pages"],
    intro: "**One-liners** — the most asked questions of a topic, each answered in one sentence. Perfect for last-minute revision. Pick a topic:",
    missing: "one-liners page",
    ...phrase(String.raw`one[\s-]?liners?`),
    fallThrough: true,
    next: ["revise", "traps"],
  },
  vs: {
    dir: "knowledge/comparisons",
    ask: "Comparisons",
    topicAsk: label => `${label} comparisons`,
    unit: ["page", "pages"],
    intro: "**Comparisons** — the classic “X vs Y” questions of a topic as side-by-side tables. Pick a topic (or type `/vs let vs var` for any pair):",
    missing: "comparisons page",
    ...phrase(String.raw`(?:comparisons|comparison\s+tables|vs\s+tables)`),
    fallThrough: true,
    next: ["sheet", "oneliners"],
  },
  output: {
    dir: "knowledge/predict-output",
    ask: "Predict the output",
    topicAsk: label => `${label} predict the output`,
    unit: ["page", "pages"],
    intro: "**Predict the output** — short code puzzles: guess what it prints, then reveal the answer and why. Pick a topic:",
    missing: "predict-the-output page",
    ...phrase(String.raw`(?:predict(?:\s+the)?\s+(?:output|result)|output\s+(?:questions|puzzles))`),
    fallThrough: true,
    next: ["traps", "snippets"],
  },
  snippets: {
    dir: "knowledge/code-snippets",
    ask: "Code snippets",
    topicAsk: label => `${label} code snippets`,
    unit: ["page", "pages"],
    intro: "**Code snippets** — the must-know code interviewers ask you to write from memory, short and commented. Pick a topic:",
    missing: "code snippets page",
    ...phrase(String.raw`code\s+snippets?`),
    fallThrough: true,
    next: ["output", "sheet"],
  },
  eli5: {
    dir: "knowledge/explain-like-5",
    ask: "Explain like I'm 5",
    topicAsk: label => `Explain ${label} like I'm 5`,
    unit: ["page", "pages"],
    intro: "**Explain like I'm 5** — the hardest ideas of a topic as everyday analogies, then the real meaning in one line. Pick a topic:",
    missing: "explain-like-I'm-5 page",
    picker: new RegExp(String.raw`^\s*(?:eli5|explain\s+(?:it\s+|things\s+)?${FIVE})${END}`, "i"),
    named: [
      new RegExp(String.raw`^\s*explain\s+(.+?)\s+${FIVE}${END}`, "i"),
      new RegExp(String.raw`^\s*(.+?)\s+(?:eli5|explained\s+${FIVE})${END}`, "i"),
      new RegExp(String.raw`^\s*(?:eli5|explain\s+${FIVE})${FOR}(.+?)${END}`, "i"),
    ],
    fallThrough: true,
    next: ["sheet", "oneliners"],
  },
};

/** Areas that are about technology (career and soft-skill areas have no revision pages). */
const TECH_AREAS = new Set(["Frontend", "Backend", "Data", "Cloud & DevOps", "AI", "Computer science & design"]);

/** Other names people type for a topic. */
const ALIASES: Record<string, string[]> = {
  javascript: ["js", "es6", "ecmascript"],
  typescript: ["ts"],
  nodejs: ["node", "node js", "express"],
  spring: ["spring boot", "springboot"],
  "database/sql": ["sql", "mysql", "database", "databases", "dbms", "postgres", "postgresql"],
  "rest-api": ["rest", "rest apis", "api", "apis"],
  messaging: ["kafka", "rabbitmq", "messaging", "message queues"],
  caching: ["redis", "cache"],
  devops: ["docker", "kubernetes", "k8s", "ci cd", "cicd"],
  ai: ["llm", "llms", "genai", "gen ai", "rag"],
  dsa: ["data structures", "algorithms", "data structures and algorithms"],
  "design-patterns": ["solid", "design pattern", "patterns"],
  networking: ["http", "networks", "network"],
  security: ["owasp", "web security"],
  observability: ["sre", "monitoring"],
  terraform: ["iac", "infrastructure as code"],
  linux: ["shell", "bash", "unix"],
  "web-vitals": ["core web vitals", "performance"],
  "web-architecture": ["frontend architecture"],
  "system-design": ["hld", "high level design"],
  "data-engineering": ["etl", "spark"],
};

export const revisionPath = (kind: RevisionKind, topic: string) => `${KINDS[kind].dir}/${topic.replace(/\//g, "-")}.md`;
export const hasPage = (kind: RevisionKind, topic: string) => existsSync(resolve(REPOSITORY_ROOT, revisionPath(kind, topic)));

const TECH_GROUPS = () => TOPIC_GROUPS.filter(([title]) => TECH_AREAS.has(title));

/** Technical topics, grouped by area, that pass `keep`. */
function groupsWhere(keep: (topic: string) => boolean): Array<{ title: string; description: string; topics: string[] }> {
  return TECH_GROUPS()
    .map(([title, description, topics]) => ({ title, description, topics: topics.filter(keep) }))
    .filter(group => group.topics.length);
}

export const revisionGroups = (kind: RevisionKind) => groupsWhere(topic => hasPage(kind, topic));

const normalize = (text: string) => text.toLowerCase().replace(/[^a-z0-9+#]+/g, " ").trim();

const namesOf = (topic: string) => {
  const label = topicLabel(topic);
  return [topic, label, label.replace(/\(.*?\)/g, ""), ...label.split(/[&()]/), ...(ALIASES[topic] ?? [])].map(normalize).filter(Boolean);
};

/**
 * "Spring Boot", "k8s", "Caching & Redis" → the topic id. A longer phrase ("Java collections") falls back
 * to the longest topic name inside it ("java"), so "Spring Security filters" finds Spring Security, not Spring.
 */
export function findTopic(name: string, topics: string[]): string | null {
  const wanted = normalize(name);
  if (!wanted) return null;
  const exact = topics.find(topic => namesOf(topic).includes(wanted));
  if (exact) return exact;
  let best: { topic: string; length: number } | null = null;
  for (const topic of topics) {
    for (const item of namesOf(topic)) {
      if (item.length > 2 && ` ${wanted} `.includes(` ${item} `) && item.length > (best?.length ?? 0)) best = { topic, length: item.length };
    }
  }
  return best?.topic ?? null;
}

export const revisionAsk = (kind: RevisionKind, topic: string) => KINDS[kind].topicAsk(topicLabel(topic));

export interface RevisionRequest {
  kind: RevisionKind;
  topic: string | null;
  /** A name with no page: the picker says so. */
  unknown?: string;
}

/** What a message asks for: a picker, one topic's page, or null when it is about none of these. */
export function revisionRequest(message: string): RevisionRequest | null {
  for (const kind of REVISION_KINDS) {
    const info = KINDS[kind];
    if (info.picker.test(message)) return { kind, topic: null };
    for (const pattern of info.named) {
      const name = pattern.exec(message)?.[1];
      if (!name) continue;
      const topic = findTopic(name, revisionGroups(kind).flatMap(group => group.topics));
      if (topic) return { kind, topic };
      return info.fallThrough ? null : { kind, topic: null, unknown: name.trim() };
    }
  }
  return null;
}

/** The picker: one card per area, each topic a chip that opens its page. */
export function revisionPicker(kind: RevisionKind, unknown?: string): string {
  const info = KINDS[kind];
  const cards: TopicCard[] = revisionGroups(kind).map(group => ({
    type: "topic",
    title: group.title,
    badge: `${group.topics.length} ${info.unit[group.topics.length === 1 ? 0 : 1]}`,
    description: group.description,
    chips: true,
    items: group.topics.map(topic => ({ label: topicLabel(topic), ask: revisionAsk(kind, topic) })),
    actions: [],
  }));
  const intro = unknown ? `There is no ${info.missing} for **${unknown}** yet. Pick one of these:` : info.intro;
  return [intro, "", cardsBlock(cards)].join("\n");
}

const cache = new Map<string, string>();

async function readPage(path: string): Promise<string> {
  const cached = cache.get(path);
  if (cached !== undefined) return cached;
  const text = (await readFile(resolve(REPOSITORY_ROOT, path), "utf8")).replace(/\r\n/g, "\n").trim();
  cache.set(path, text);
  return text;
}

/** The page's Markdown, or null when the topic has none. */
export async function loadRevisionPage(kind: RevisionKind, topic: string): Promise<string | null> {
  return hasPage(kind, topic) ? readPage(revisionPath(kind, topic)) : null;
}

/** Next steps: other pages for the same topic (only ones that exist), practice, then back to the list. */
export function revisionFollowUps(kind: RevisionKind, topic: string): string[] {
  const label = topicLabel(topic);
  const chips = KINDS[kind].next.flatMap(next => {
    if (next === "quiz") return [`Quiz me on ${label}`];
    if (next === "revise") return [`Revise ${label}`];
    return hasPage(next, topic) ? [revisionAsk(next, topic)] : [];
  });
  return [...chips, KINDS[kind].ask];
}

// ---------- Revise: flashcards from the one-liners and quick traps ----------

export const REVISE_ASK = "Revise";
const ALL_TOPICS = "all topics";
const REVISE_PICKER = /^\s*(?:revise|revision|quick\s+revision|flash\s*cards?)\s*[.?!]?\s*$/i;
const REVISE_NAMED = [
  /^\s*revise\s+(.+?)(?:\s+again)?\s*[.?!]?\s*$/i,
  /^\s*(?:quick\s+)?revision\s+(?:for|on|of)\s+(.+?)(?:\s+again)?\s*[.?!]?\s*$/i,
  /^\s*(.+?)\s+(?:flash\s*cards?|revision)(?:\s+again)?\s*[.?!]?\s*$/i,
];

const canRevise = (topic: string) => hasPage("oneliners", topic) || hasPage("traps", topic);

/** "Revise Java and React" → ["java", "react"]; [] for the picker; null when it isn't a revise request. */
export function reviseRequest(message: string): string[] | null {
  if (REVISE_PICKER.test(message)) return [];
  const topics = groupsWhere(canRevise).flatMap(group => group.topics);
  for (const pattern of REVISE_NAMED) {
    const name = pattern.exec(message)?.[1]?.trim();
    if (!name) continue;
    if (/^(?:all|all\s+topics|everything|every\s+topic)$/i.test(name)) return topics;
    const whole = findTopic(name, topics);
    if (whole && normalize(name) === normalize(topicLabel(whole))) return [whole];
    const parts = name.split(/\s*(?:,|\band\b|\+)\s*/i).filter(Boolean);
    const found = parts.map(part => findTopic(part, topics));
    if (found.length && found.every(Boolean)) return [...new Set(found as string[])];
    return whole ? [whole] : null;
  }
  return null;
}

interface Card {
  topic: string;
  question: string;
  answer: string;
  kind: "one-liner" | "trap";
}

/** "1. **What is X?** — answer" lines. */
function oneLinerCards(topic: string, text: string): Card[] {
  return [...text.matchAll(/^\d+\.\s+\*\*(.+?)\*\*\s+[—–-]\s+(.+)$/gm)].map(match => ({ topic, question: match[1], answer: match[2], kind: "one-liner" }));
}

/** "### Title" blocks with a ❌ line and a ✅ line. */
function trapCards(topic: string, text: string): Card[] {
  return text.split(/^### /m).slice(1).flatMap(block => {
    const [title, ...rest] = block.split("\n");
    const wrong = rest.find(line => line.includes("❌"));
    const right = rest.find(line => line.includes("✅"));
    if (!wrong || !right) return [];
    const clean = (line: string) => line.replace(/^\s*-\s*/, "").trim();
    return [{ topic, question: `${title.replace(/^\d+\.\s*/, "").trim()}: ${clean(wrong)}`, answer: clean(right), kind: "trap" as const }];
  });
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const REVISE_SIZE = 10;

/** A fresh set of 10 flashcards (about 6 one-liners and 4 traps), answers hidden until tapped. */
export async function buildRevision(topics: string[], random: () => number = Math.random): Promise<string> {
  const oneLiners: Card[] = [];
  const traps: Card[] = [];
  for (const topic of topics) {
    if (hasPage("oneliners", topic)) oneLiners.push(...oneLinerCards(topic, await readPage(revisionPath("oneliners", topic))));
    if (hasPage("traps", topic)) traps.push(...trapCards(topic, await readPage(revisionPath("traps", topic))));
  }
  const trapCount = Math.min(traps.length, Math.max(REVISE_SIZE - oneLiners.length, 4));
  const picked = shuffle([...shuffle(traps, random).slice(0, trapCount), ...shuffle(oneLiners, random).slice(0, REVISE_SIZE - trapCount)], random);
  const many = topics.length > 1;
  const title = topics.length > 6 ? "all topics" : topics.map(topicLabel).join(", ");
  const lines = [`**Quick revision — ${title}** · ${picked.length} cards. Answer in your head first, then tap to check. Ask again for a new set.`, ""];
  picked.forEach((card, i) => {
    const tag = many ? ` _(${topicLabel(card.topic)})_` : "";
    const lead = card.kind === "trap" ? `**${i + 1}. Spot the trap — ${card.question}**${tag}` : `**${i + 1}. ${card.question}**${tag}`;
    lines.push(lead, "", `<details class="reveal"><summary>${card.kind === "trap" ? "Show the right answer" : "Show answer"}</summary>`, "", card.answer, "", "</details>", "");
  });
  return lines.join("\n").trim();
}

export function revisionTopicsLabel(topics: string[]): string {
  return topics.length > 6 ? ALL_TOPICS : topics.map(topicLabel).join(" and ");
}

export function reviseFollowUps(topics: string[]): string[] {
  const again = `Revise ${revisionTopicsLabel(topics)} again`;
  const single = topics.length === 1 ? [revisionAsk("traps", topics[0])].filter(() => hasPage("traps", topics[0])) : [];
  return [again, ...single, REVISE_ASK];
}

/** Picker for revise: an "All topics" card, then the areas. */
export function revisePicker(): string {
  const cards: TopicCard[] = [
    { type: "topic", title: "Mixed", badge: "Everything", description: "Ten random cards from every technical topic.", chips: true, items: [{ label: "All topics", ask: "Revise all topics" }], actions: [] },
    ...groupsWhere(canRevise).map(group => ({
      type: "topic" as const,
      title: group.title,
      badge: `${group.topics.length} topics`,
      description: group.description,
      chips: true,
      items: group.topics.map(topic => ({ label: topicLabel(topic), ask: `Revise ${topicLabel(topic)}` })),
      actions: [],
    })),
  ];
  return ["**Revise** — ten random flashcards (one-liners and traps). Answer in your head, then tap to check. Pick a topic, or type `/revise java, react` to mix:", "", cardsBlock(cards)].join("\n");
}
