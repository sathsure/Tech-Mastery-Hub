/**
 * Question-level search over ai/knowledge-index/question-index.json.
 *
 * How a query is answered:
 *  1. Understand it: find named topics ("js", "spring boot"), domain, intent, synonyms, typos.
 *  2. Narrow it: search a tree (root → topic → section → question). Named topics prune the
 *     tree to their branches; inside, branch-and-bound skips any branch whose best possible
 *     score cannot beat the current results. If the narrowed search is thin, widen to all topics.
 *  3. Rank: BM25 over weighted fields (question > keywords > section/summary > answer),
 *     with a bonus for exact phrases and for covering every query word.
 *
 * CLI (after `npm run build`):  node dist/question-search.js "how does the event loop work" [--limit 5] [--json]
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { QuestionEntry, QuestionEntryKind, QuestionIndex } from "./question-index-contracts.js";
import { trimEndChars } from "./text-utils.js";

const REPOSITORY_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const INDEX_FILE = resolve(REPOSITORY_ROOT, "ai/knowledge-index/question-index.json");
const VOCABULARY_FILE = resolve(REPOSITORY_ROOT, "ai/knowledge-index/search-vocabulary.json");

// ---------- Public types ----------

export type SearchIntent = "explain" | "interview-prep" | "roadmap" | "role" | "code" | "visual" | "compare" | "debug" | "quiz";
export type SearchConfidence = "high" | "medium" | "low" | "none";

export interface SearchOptions {
  limit?: number;
  /** Restrict to one topic (e.g. chosen from a UI filter). */
  topic?: string;
  kinds?: QuestionEntryKind[];
  /** Tests only: score every branch (no pruning), to prove pruning never changes results. */
  exhaustive?: boolean;
}

export interface SearchHit {
  id: string;
  kind: QuestionEntryKind;
  parentId: string | null;
  question: string;
  summary: string;
  topics: string[];
  section: string[];
  source: QuestionEntry["source"];
  score: number;
  /** Share of the query's meaningful words found in the question, keywords, section or summary. */
  coverage: number;
  matchedTerms: string[];
  codeLanguages: string[];
  visualCount: number;
  /** "name" when the query named this role/term directly (pinned first). */
  matchedBy: "name" | "search" | "browse";
}

export interface SearchResult {
  query: string;
  mode: "search" | "browse" | "lookup" | "empty";
  intents: SearchIntent[];
  confidence: SearchConfidence;
  topics: Array<{ topic: string; via: "alias" | "typo" | "filter" }>;
  domain: string | null;
  terms: string[];
  corrections: Array<{ from: string; to: string }>;
  /** Roles or terms named in the query (IT Roles & Terminology Atlas). */
  entities: Array<{ name: string; id: string; kind: QuestionEntryKind }>;
  strategy: {
    narrowedTo: string[];
    widened: boolean;
    branchesTotal: number;
    branchesVisited: number;
    branchesPruned: number;
    entriesScored: number;
  };
  hits: SearchHit[];
  /** Hit counts per topic over every match, for filter chips. */
  facets: Array<{ topic: string; count: number }>;
  /** Offered when nothing (or little) matched, so the user always has a next step. */
  suggestions: { topics: string[]; questions: Array<{ id: string; question: string; topic: string | null }> };
}

// ---------- Text processing ----------

const STOPWORDS = new Set(
  ("a an and are as at be been being but by can could did do does doing for from had has have having how i if in into is it its " +
    "just me my of on or our should so some such than that the their them then there these they this those through to too us " +
    "was we were what when where which while who whom why will with would you your yours about any also each more most other " +
    "very own same both few only over under again further once here all no nor not off out up down get got want wants need " +
    "please kindly tell know understand explain explained explaining work works working mean means meant use used using " +
    "give show list let lets help between app apps")
    .split(" "),
);

/** Words that describe what the user wants to do rather than the subject. */
const INTENT_WORDS = new Set(
  ("interview interviews question questions prepare preparing preparation prep ask asked asking roadmap roadmaps path learn " +
    "learning start started begin beginner study guide topic topics quiz test mock practice practise revise revision example " +
    "examples sample explore overview tour code snippet diagram diagrams visual visually visualize visualise draw picture image flow role roles career " +
    "job engineer developer become").split(" "),
);

/** Words that ask something about a named role/term without changing which one ("devops engineer salary"). */
const ABOUT_WORDS = new Set(
  ("salary salaries pay paid earn earning earnings package lpa ctc much skill skills tool tools career path growth next move moves " +
    "responsibility responsibilities duty duties day daily life meaning full form stand stands definition define abbreviation " +
    "roadmap become role job title called abroad scope do does work task tasks need required requirement requirements " +
    "used purpose").split(" ").map(word => stem(word)),
);
/** Questions that ask for a definition, so naming a common technology ("what is Java") may pin its glossary/stack entry. */
const DEFINITION = /\b(what is|what's|what are|define|definition|meaning of|full form|stand for|stands for|used for|what does .+ (mean|stand))\b/;
/** One-word names too common to treat as a lookup. */
const BLOCKED_NAMES = new Set(["go", "it", "do", "r", "c", "d", "ui", "app"]);

/** Comparison words: they shape the answer but are not the subject, so they don't count toward coverage. */
const COMPARE_WORDS = new Set(["vs", "versus", "difference", "differences", "differ", "compare", "comparison", "between"]);

const TOKEN = /[a-z0-9@#][a-z0-9#+]*(?:[./-][a-z0-9#+]+)*/g;

export function normalize(text: string): string {
  return text.toLowerCase().replace(/[’‘]/g, "'").replace(/[“”]/g, '"');
}

/** Light suffix stripping, applied the same way to documents and queries. */
export function stem(word: string): string {
  if (!/^[a-z]+$/.test(word) || word.length <= 3) return word;
  if (word.endsWith("ies") && word.length > 4) return word.slice(0, -3) + "y";
  if (word.endsWith("sses")) return word.slice(0, -2);
  if (/(ss|us|is)$/.test(word)) return word;
  if (/(x|z|ch|sh)es$/.test(word)) return word.slice(0, -2);
  if (word.endsWith("s")) return word.slice(0, -1);
  if (word.endsWith("ing") && word.length > 5) return word.slice(0, -3);
  if (word.endsWith("ed") && word.length > 4) return word.slice(0, -2);
  return word;
}

/** Raw tokens; compound tokens ("node.js", "real-world") also yield their parts. */
function rawTokens(text: string): string[] {
  const tokens: string[] = [];
  for (const token of normalize(text).replace(/`/g, " ").match(TOKEN) ?? []) {
    const clean = trimEndChars(token, ".");
    if (!clean) continue;
    tokens.push(clean);
    // "@WebMvcTest" is also found as "WebMvcTest".
    if (clean.startsWith("@") && clean.length > 1) tokens.push(clean.slice(1));
    if (/[./-]/.test(clean)) for (const part of clean.split(/[./-]/)) if (part) tokens.push(part);
  }
  return tokens;
}

export function terms(text: string): string[] {
  return rawTokens(text).filter(token => !STOPWORDS.has(token)).map(stem);
}

/** Key for exact-name lookup: lower case, compounds split, light stemming ("CI/CD" → "ci cd"). */
export function entityKey(text: string): string {
  return (normalize(text).replace(/`/g, " ").match(/[a-z0-9#+]+/g) ?? []).map(stem).join(" ");
}

/** Damerau (optimal string alignment) distance, stopping early past `max`. */
export function editDistance(a: string, b: string, max = 2): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const rows: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...new Array<number>(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) rows[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    let rowMin = Infinity;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let value = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1, rows[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) value = Math.min(value, rows[i - 2][j - 2] + 1);
      rows[i][j] = value;
      rowMin = Math.min(rowMin, value);
    }
    if (rowMin > max) return max + 1;
  }
  return rows[a.length][b.length];
}

/** Text with fenced code blocks removed (code is indexed separately). */
function withoutCodeBlocks(markdown: string): string {
  const kept: string[] = [];
  let inFence = false;
  for (const line of markdown.split("\n")) {
    if (line.trimStart().startsWith("```")) {
      inFence = !inFence;
      kept.push(" ");
    } else if (!inFence) {
      kept.push(line);
    }
  }
  return kept.join("\n");
}

function allowedTypos(word: string): number {
  if (word.length >= 8) return 2;
  return word.length >= 4 ? 1 : 0;
}

// ---------- Vocabulary ----------

interface Vocabulary {
  topicAliases: Record<string, string[]>;
  /** Extra skill names that link job roles to a topic; never used to parse searches. */
  roleSkillAliases?: Record<string, string[]>;
  termSynonyms: string[][];
  domainAliases: Record<string, string[]>;
}

/** Topic words for linking roles to topics: the search aliases plus the role-only skill names. */
export function roleLinkAliases(vocabulary: Pick<Vocabulary, "topicAliases" | "roleSkillAliases">): Record<string, string[]> {
  const merged: Record<string, string[]> = {};
  for (const source of [vocabulary.topicAliases, vocabulary.roleSkillAliases ?? {}]) {
    for (const [topic, words] of Object.entries(source)) merged[topic] = [...(merged[topic] ?? []), ...words];
  }
  return merged;
}

export function loadVocabulary(path = VOCABULARY_FILE): Vocabulary {
  const parsed = JSON.parse(readFileSync(path, "utf8")) as Partial<Vocabulary>;
  const isStringList = (value: unknown) => Array.isArray(value) && value.every(item => typeof item === "string" && item.trim());
  if (!parsed.topicAliases || !Object.values(parsed.topicAliases).every(isStringList)) throw new Error("search-vocabulary.json: topicAliases must map topics to lists of words.");
  if (!Array.isArray(parsed.termSynonyms) || !parsed.termSynonyms.every(isStringList)) throw new Error("search-vocabulary.json: termSynonyms must be lists of words.");
  if (!parsed.domainAliases || !Object.values(parsed.domainAliases).every(isStringList)) throw new Error("search-vocabulary.json: domainAliases must map domains to lists of words.");
  return parsed as Vocabulary;
}

// ---------- Engine (built once, then cached) ----------

const FIELD_WEIGHTS = { question: 3, keywords: 2, section: 1.5, summary: 1.5, prompt: 1, answer: 1 } as const;
type Field = keyof typeof FIELD_WEIGHTS;
const STRONG_FIELDS: Field[] = ["question", "keywords", "section", "summary"];
const K1 = 1.2;
const B = 0.5;

interface Doc {
  entry: QuestionEntry;
  weighted: Map<string, number>;
  strong: Set<string>;
  all: Set<string>;
  questionTerms: string[];
  length: number;
}

interface Branch {
  key: string;
  topic: string;
  docs: number[];
  /** Highest BM25 contribution any doc in the branch can make for each term (for pruning). */
  maxContribution: Map<string, number>;
}

interface Engine {
  index: QuestionIndex;
  vocabulary: Vocabulary;
  docs: Doc[];
  documentFrequency: Map<string, number>;
  branches: Branch[];
  topicNames: string[];
  topicCounts: Map<string, number>;
  /** Name key ("site reliability engineer") → doc positions. */
  entities: Map<string, number[]>;
  maxEntityWords: number;
  topicAliasKeys: Set<string>;
}

let engine: Engine | null = null;

function idf(engineRef: Engine, term: string): number {
  const df = engineRef.documentFrequency.get(term) ?? 0;
  const n = engineRef.docs.length;
  return Math.log(1 + (n - df + 0.5) / (df + 0.5));
}

function contribution(engineRef: Engine, doc: Doc, term: string, averageLength: number): number {
  const tf = doc.weighted.get(term) ?? 0;
  if (!tf) return 0;
  return (idf(engineRef, term) * tf * (K1 + 1)) / (tf + K1 * (1 - B + (B * doc.length) / averageLength));
}

let averageLength = 1;

function buildEngine(index: QuestionIndex, vocabulary: Vocabulary): Engine {
  const docs: Doc[] = index.entries.map(entry => {
    const fields: Record<Field, string[]> = {
      question: terms(entry.question),
      keywords: terms(entry.keywords.join(" ")),
      section: terms(entry.section.join(" ")),
      summary: terms(entry.summary),
      prompt: terms(entry.prompt ?? ""),
      answer: terms(withoutCodeBlocks(entry.answer)),
    };
    const weighted = new Map<string, number>();
    let length = 0;
    for (const field of Object.keys(fields) as Field[]) {
      for (const term of fields[field]) weighted.set(term, (weighted.get(term) ?? 0) + FIELD_WEIGHTS[field]);
      length += fields[field].length * FIELD_WEIGHTS[field];
    }
    const strong = new Set(STRONG_FIELDS.flatMap(field => fields[field]));
    return { entry, weighted, strong, all: new Set(weighted.keys()), questionTerms: fields.question, length };
  });
  averageLength = docs.reduce((total, doc) => total + doc.length, 0) / Math.max(docs.length, 1);

  const documentFrequency = new Map<string, number>();
  for (const doc of docs) for (const term of doc.all) documentFrequency.set(term, (documentFrequency.get(term) ?? 0) + 1);

  const topicAliasKeys = new Set(Object.values(vocabulary.topicAliases).flat().map(entityKey));
  const partial: Engine = { index, vocabulary, docs, documentFrequency, branches: [], topicNames: [], topicCounts: new Map(), entities: new Map(), maxEntityWords: 1, topicAliasKeys };
  docs.forEach((doc, position) => {
    for (const name of doc.entry.names ?? []) {
      const key = entityKey(name);
      if (!key || (!key.includes(" ") && (BLOCKED_NAMES.has(key) || STOPWORDS.has(key)))) continue;
      const list = partial.entities.get(key) ?? [];
      if (!list.includes(position)) list.push(position);
      partial.entities.set(key, list);
      partial.maxEntityWords = Math.max(partial.maxEntityWords, key.split(" ").length);
    }
  });
  const branchMap = new Map<string, Branch>();
  docs.forEach((doc, position) => {
    // Related topics (a role's languages and tools) put the entry in those branches too.
    const own = doc.entry.topics.length ? doc.entry.topics : ["(untagged)"];
    const topics = [...new Set([...own, ...(doc.entry.relatedTopics ?? [])])];
    for (const topic of topics) {
      const key = `${topic} › ${doc.entry.source.path} › ${doc.entry.section.join(" › ")}`;
      let branch = branchMap.get(key);
      if (!branch) {
        branch = { key, topic, docs: [], maxContribution: new Map() };
        branchMap.set(key, branch);
      }
      branch.docs.push(position);
      for (const term of doc.all) {
        const value = contribution(partial, doc, term, averageLength);
        if (value > (branch.maxContribution.get(term) ?? 0)) branch.maxContribution.set(term, value);
      }
      if (own.includes(topic)) partial.topicCounts.set(topic, (partial.topicCounts.get(topic) ?? 0) + 1);
    }
  });
  partial.branches = [...branchMap.values()];
  partial.topicNames = [...new Set([...Object.keys(vocabulary.topicAliases), ...partial.topicCounts.keys()])].filter(t => t !== "(untagged)");
  return partial;
}

function getEngine(): Engine {
  if (!engine) engine = buildEngine(JSON.parse(readFileSync(INDEX_FILE, "utf8")) as QuestionIndex, loadVocabulary());
  return engine;
}

/** For tests and after rebuilding the index in the same process. */
export function resetSearchEngine(index?: QuestionIndex, vocabulary?: Vocabulary): void {
  engine = index ? buildEngine(index, vocabulary ?? loadVocabulary()) : null;
}

// ---------- Query understanding ----------

interface ParsedQuery {
  topics: SearchResult["topics"];
  domain: string | null;
  intents: SearchIntent[];
  /** Words that carry the subject, weighted. Primary ones count toward coverage. */
  weights: Map<string, number>;
  primary: string[];
  bigrams: Array<[string, string]>;
  corrections: SearchResult["corrections"];
  /** Doc positions of roles/terms named in the query, best first. */
  pinned: number[];
  /** "Full form of CI/CD", "what does SDLC stand for": a glossary definition is the answer. */
  wantsDefinition: boolean;
}

const DEFINITION_REQUEST = /\b(full form|stands? for|abbreviation|acronym|meaning of|define|definition)\b/;

const INTENT_RULES: Array<[SearchIntent, RegExp[]]> = [
  ["interview-prep", [/\b(interview|interviews|prepare|preparing|preparation|prep|asked in|crack)\b/]],
  [
    "roadmap",
    [
      /\b(roadmap|road map|learning path|learn path|study plan|beginner)\b/,
      /\bwhere (do|should) i start\b|\bwhere to start\b/,
      /\bhow (do|should) i (start|begin)\b|\bwhat should i learn\b/,
    ],
  ],
  [
    "role",
    [
      /\b(role|roles|career|job|become an?|responsibilit\w*|sre|architect)\b/,
      /\b(devops|frontend|backend|full ?stack|cloud|data|qa|test) (engineer|developer)\b/,
    ],
  ],
  ["code", [/\b(code|coding|example|examples|implement|implementation|write|snippet|program|syntax|output)\b/]],
  ["visual", [/\b(diagram|diagrams|visual|visually|visuali[sz]e|draw|picture|image|flow ?chart|illustrat\w*)\b/]],
  ["compare", [/\b(vs|versus|difference|differences|differ|compare|comparison|better than|or)\b/]],
  [
    "debug",
    [
      /\b(error|errors|exception|issue|issues|bug|bugs|debug|debugging|fix|fails?|failing|slow)\b/,
      /\b(not working|doesn'?t work|crash\w*|leak\w*|troubleshoot\w*)\b/,
    ],
  ],
  ["quiz", [/\b(quiz|test me|mock|assess|assessment|practice|practise|ask me)\b/]],
];

function detectIntents(query: string): SearchIntent[] {
  const found = INTENT_RULES.filter(([, patterns]) => patterns.some(pattern => pattern.test(query))).map(([intent]) => intent);
  // "or" alone is too weak to mean a comparison unless the query is a question about two things.
  if (found.includes("compare") && !/\b(vs|versus|differ\w*|compare|comparison|better than)\b/.test(query)) found.splice(found.indexOf("compare"), 1);
  return found.length ? found : ["explain"];
}

/** Finds alias phrases (longest first) and removes them from the text so shorter ones don't double-match. */
function matchPhrases(padded: string, phrases: Array<{ phrase: string; value: string }>): { matches: string[]; rest: string } {
  const matches: string[] = [];
  let rest = padded;
  for (const { phrase, value } of [...phrases].sort((a, b) => b.phrase.length - a.phrase.length)) {
    const needle = ` ${phrase} `;
    if (rest.includes(needle)) {
      matches.push(value);
      rest = rest.split(needle).join(" | ");
    }
  }
  return { matches, rest };
}

type Phrase = { phrase: string; value: string };

/**
 * Compound words that are aliases ("node.js", "ci/cd") stay whole; others split ("real-world" → real world),
 * so "node.js" does not also match the "js" alias.
 */
function phraseTokens(text: string, vocabulary: Vocabulary): string[] {
  const aliasSet = new Set([...Object.values(vocabulary.topicAliases), ...Object.values(vocabulary.domainAliases)].flat().map(normalize));
  const tokens: string[] = [];
  for (const token of text.replace(/`/g, " ").match(TOKEN) ?? []) {
    const clean = trimEndChars(token, ".");
    if (aliasSet.has(clean) || !/[./-]/.test(clean)) tokens.push(clean);
    else tokens.push(...clean.split(/[./-]/).filter(Boolean));
  }
  return tokens;
}

/** Subject words, weighted; typos are corrected and a misspelt topic name becomes a topic. */
interface SubjectWeights {
  weights: Map<string, number>;
  primary: string[];
  corrections: SearchResult["corrections"];
}

function typoTopicFor(token: string, topicPhrases: Phrase[]): Phrase | undefined {
  const max = allowedTypos(token);
  if (!max) return undefined;
  return topicPhrases.find(item => !item.phrase.includes(" ") && item.phrase.length >= 5 && editDistance(token, item.phrase, max) <= max);
}

function weighSubject(
  subjectTokens: string[],
  engineRef: Engine,
  topics: SearchResult["topics"],
  topicPhrases: Phrase[],
  aliasWords: Set<string>,
): SubjectWeights {
  const result: SubjectWeights = { weights: new Map(), primary: [], corrections: [] };
  for (const token of subjectTokens) {
    let term = stem(token);
    if (!engineRef.documentFrequency.has(term)) {
      const typoTopic = topics.length ? undefined : typoTopicFor(token, topicPhrases);
      if (typoTopic) {
        topics.push({ topic: typoTopic.value, via: "typo" });
        result.corrections.push({ from: token, to: typoTopic.phrase });
        continue;
      }
      const fixed = correctTypo(term, engineRef);
      if (fixed) {
        result.corrections.push({ from: token, to: fixed });
        term = fixed;
      }
    }
    if (aliasWords.has(term) || COMPARE_WORDS.has(token)) {
      addWeight(result.weights, term, 0.3);
    } else {
      result.primary.push(term);
      addWeight(result.weights, term, 1);
    }
  }
  return result;
}

function addWeight(weights: Map<string, number>, term: string, weight: number): void {
  weights.set(term, Math.max(weights.get(term) ?? 0, weight));
}

/**
 * "WHERE vs HAVING": both words are stop words in plain English, so the question would have no subject.
 * When "having" appears with another SQL cue, search the SQL topic for clauses instead.
 */
function addSqlClauseSubject(text: string, topics: SearchResult["topics"], weights: Map<string, number>, primary: string[]): void {
  const padded = ` ${text} `;
  if (!padded.includes(" having ") || !/ (where|group by|sql|clause|clauses) /.test(padded)) return;
  if (!topics.some(item => item.topic === "database/sql")) topics.push({ topic: "database/sql", via: "alias" });
  const clause = stem("clause");
  addWeight(weights, clause, 1);
  if (!primary.includes(clause)) primary.push(clause);
}

/** Synonyms widen the query: "di" also searches "dependency injection". */
function addSynonyms(weights: Map<string, number>, text: string, vocabulary: Vocabulary): void {
  const queryPadded = ` ${rawTokens(text).join(" ")} `;
  for (const group of vocabulary.termSynonyms) {
    if (!group.some(member => queryPadded.includes(` ${normalize(member)} `))) continue;
    for (const member of group) for (const term of terms(member)) if (!INTENT_WORDS.has(term)) addWeight(weights, term, 0.6);
  }
}

/** Exact names (roles, glossary terms, technologies) in the query: longest match first, each word used once. */
function findNames(text: string, engineRef: Engine): Array<{ key: string; positions: number[] }> {
  const keyTokens = entityKey(text).split(" ").filter(Boolean);
  const used = new Array<boolean>(keyTokens.length).fill(false);
  const named: Array<{ key: string; positions: number[] }> = [];
  for (let size = Math.min(engineRef.maxEntityWords, keyTokens.length); size >= 1; size--) {
    for (let start = 0; start + size <= keyTokens.length; start++) {
      if (used.slice(start, start + size).some(Boolean)) continue;
      const key = keyTokens.slice(start, start + size).join(" ");
      const positions = engineRef.entities.get(key);
      // A common technology name ("java") only counts as a lookup in a definition question.
      if (!positions || (engineRef.topicAliasKeys.has(key) && !DEFINITION.test(text))) continue;
      named.push({ key, positions });
      used.fill(true, start, start + size);
    }
  }
  return named;
}

const KIND_RANK_ROADMAP_FIRST: Record<string, number> = { roadmap: 0, role: 1, term: 2, note: 3, question: 4, "follow-up": 5 };
const KIND_RANK_ROLE_FIRST: Record<string, number> = { role: 0, roadmap: 1, term: 2, note: 3, question: 4, "follow-up": 5 };

/**
 * Entries to pin first, when the names are the whole subject: "devops engineer salary" yes, "kafka partitions" no.
 * A roadmap goes first when one is asked for; otherwise right after the role it belongs to.
 */
const ATLAS_TOPIC_IDS = new Set(["it-roles", "it-terminology", "tech-stack", "it-careers", "roadmaps"]);

function pinNamed(
  named: Array<{ key: string; positions: number[] }>,
  primary: string[],
  intents: SearchIntent[],
  engineRef: Engine,
  text: string,
  topics: string[],
): number[] {
  const nameTokens = new Set(named.flatMap(item => item.key.split(" ")));
  const leftover = primary.filter(term => !nameTokens.has(term) && !ABOUT_WORDS.has(term));
  if (!named.length || leftover.length) return [];
  // "RabbitMQ vs Kafka", "When should I use Kafka?": the notes on comparing or choosing beat a one-line definition.
  if (intents.includes("compare") || /\bwhen\b/.test(text)) return [];
  const kindRank = intents.includes("roadmap") ? KIND_RANK_ROADMAP_FIRST : KIND_RANK_ROLE_FIRST;
  // "What is a Spring proxy?": when the question names a learning topic, only pin entries about that topic.
  const learning = topics.filter(topic => !ATLAS_TOPIC_IDS.has(topic));
  const onTopic = (position: number) => {
    const entry = engineRef.docs[position].entry;
    return !learning.length || [...entry.topics, ...(entry.relatedTopics ?? [])].some(topic => learning.includes(topic));
  };
  const pinned = [...new Set(named.flatMap(item => item.positions))]
    .filter(onTopic)
    .sort((a, b) => kindRank[engineRef.docs[a].entry.kind] - kindRank[engineRef.docs[b].entry.kind] || a - b)
    .slice(0, 3);
  // "What is the CAP theorem?": a full interview answer about the term beats its one-line glossary definition.
  const onlyTerms = pinned.every(position => engineRef.docs[position].entry.kind === "term");
  const fullAnswer = onlyTerms && !DEFINITION_REQUEST.test(text) && named.some(item => hasFullAnswer(item.key, engineRef));
  return fullAnswer ? [] : pinned;
}

/** Is there an interview question titled "What is <term>…" ("What is the Saga pattern?" for "saga pattern")? */
function hasFullAnswer(key: string, engineRef: Engine): boolean {
  let titles = questionTitles.get(engineRef);
  if (!titles) {
    titles = engineRef.docs.filter(doc => doc.entry.kind === "question").map(doc => ` ${entityKey(doc.entry.question)} `);
    questionTitles.set(engineRef, titles);
  }
  return ["what is", "what is the", "what is a", "what is an", "what are", "what are the"].some(lead => titles.some(title => title.startsWith(` ${lead} ${key} `)));
}

/** Interview question titles as name keys, built once per loaded index. */
const questionTitles = new WeakMap<Engine, string[]>();

function parseQuery(query: string, engineRef: Engine, forcedTopic?: string): ParsedQuery {
  const vocabulary = engineRef.vocabulary;
  const text = normalize(query);
  const padded = ` ${phraseTokens(text, vocabulary).join(" ")} `;

  const topicPhrases: Phrase[] = Object.entries(vocabulary.topicAliases).flatMap(([topic, aliases]) => aliases.map(alias => ({ phrase: normalize(alias), value: topic })));
  const topicMatch = matchPhrases(padded, topicPhrases);
  const topics: SearchResult["topics"] = [...new Set(topicMatch.matches)].map(topic => ({ topic, via: "alias" as const }));
  if (forcedTopic) topics.splice(0, topics.length, { topic: forcedTopic, via: "filter" });

  const domainPhrases: Phrase[] = Object.entries(vocabulary.domainAliases).flatMap(([domain, aliases]) => aliases.map(alias => ({ phrase: normalize(alias), value: domain })));
  const domainMatch = matchPhrases(topicMatch.rest, domainPhrases);
  const domain = domainMatch.matches[0] ?? null;

  // Only whole one-word aliases ("java"), not parts of longer ones ("lifecycle" in "request lifecycle").
  const aliasWords = new Set([...topicPhrases, ...domainPhrases].filter(item => !/\s/.test(item.phrase)).flatMap(item => terms(item.phrase)));
  const remaining = rawTokens(domainMatch.rest.replace(/\|/g, " ")).filter(token => !/[./-]/.test(token));
  const subjectTokens = remaining.filter(token => !STOPWORDS.has(token) && !INTENT_WORDS.has(token));
  const { weights, primary, corrections } = weighSubject(subjectTokens, engineRef, topics, topicPhrases, aliasWords);
  addSqlClauseSubject(text, topics, weights, primary);

  // Named topics and domains still add a little signal inside their branch.
  for (const word of [...topicMatch.matches, ...domainMatch.matches]) for (const term of terms(word)) addWeight(weights, term, 0.3);
  addSynonyms(weights, text, vocabulary);

  const named = findNames(text, engineRef);
  const intents = detectIntents(text);
  const pinned = pinNamed(named, primary, intents, engineRef, text, topics.map(item => item.topic));
  if (pinned.length) {
    // Search around the named thing for related entries (salary notes, related terms).
    for (const term of new Set(named.flatMap(item => item.key.split(" ")))) {
      if (STOPWORDS.has(term)) continue;
      weights.set(term, 1);
      if (!primary.includes(term)) primary.push(term);
    }
  }

  const bigrams: Array<[string, string]> = [];
  for (let i = 0; i + 1 < primary.length; i++) bigrams.push([primary[i], primary[i + 1]]);

  const uniqueTopics = topics.filter((item, position) => topics.findIndex(other => other.topic === item.topic) === position);
  const wantsDefinition = DEFINITION_REQUEST.test(text);
  return { topics: uniqueTopics, domain, intents, weights, primary: [...new Set(primary)], bigrams, corrections, pinned, wantsDefinition };
}

function correctTypo(term: string, engineRef: Engine): string | null {
  const max = allowedTypos(term);
  if (!max || !/^[a-z]+$/.test(term)) return null;
  let best: { term: string; distance: number; df: number } | null = null;
  for (const [candidate, df] of engineRef.documentFrequency) {
    if (Math.abs(candidate.length - term.length) > max || candidate[0] !== term[0]) continue;
    const distance = editDistance(term, candidate, max);
    if (distance > max) continue;
    if (!best || distance < best.distance || (distance === best.distance && df > best.df)) best = { term: candidate, distance, df };
  }
  return best?.term ?? null;
}

// ---------- Scoring and tree search ----------

const TOPIC_BOOST = 1.3;
const DOMAIN_BOOST = 1.1;
const PHRASE_BONUS = 2;
/** All query words in the title, in order and next to each other: "O(log n)" beats "O(n log n)". */
const EXACT_PHRASE_BONUS = 3;

function titleHasPhrase(title: string[], phrase: string[]): boolean {
  if (phrase.length < 2 || phrase.length > title.length) return false;
  for (let start = 0; start + phrase.length <= title.length; start++) {
    if (phrase.every((term, i) => title[start + i] === term)) return true;
  }
  return false;
}
/** Favour entries with a diagram / code when the user asks for one. */
const INTENT_BOOST = 1.15;
const TITLE_BOOST = 0.5;

interface Scored {
  doc: Doc;
  score: number;
  coverage: number;
  matched: string[];
}

/** Weighted term matches plus phrase bonuses; the primary terms that matched. */
function termScore(engineRef: Engine, doc: Doc, parsed: ParsedQuery): { score: number; matched: string[] } {
  let score = 0;
  const matched: string[] = [];
  for (const [term, weight] of parsed.weights) {
    const value = contribution(engineRef, doc, term, averageLength);
    if (value <= 0) continue;
    score += value * weight;
    if (parsed.primary.includes(term)) matched.push(term);
  }
  if (score <= 0) return { score: 0, matched };
  for (const [first, second] of parsed.bigrams) {
    const at = doc.questionTerms.indexOf(first);
    if (at >= 0 && doc.questionTerms[at + 1] === second) score += PHRASE_BONUS;
  }
  if (titleHasPhrase(doc.questionTerms, parsed.primary)) score += EXACT_PHRASE_BONUS;
  return { score, matched };
}

/** Study paths list every question of a topic, so they match many words; they lead only when a path is asked for. */
const STUDY_PATH_DAMPING = 0.6;
/** Follow-up titles are short, so they outscore their longer main question on shared words; the main answer leads. */
const FOLLOW_UP_DAMPING = 0.85;
/** Glossary lines are one sentence with a two-word title, so they outscore the full explanation of the same thing. */
const TERM_DAMPING = 0.8;

/** Multipliers for what the user asked for: diagrams, code, the named topic and domain. */
function intentBoost(doc: Doc, parsed: ParsedQuery): number {
  let boost = 1;
  const wantsPath = parsed.intents.includes("roadmap") || parsed.intents.includes("interview-prep");
  if (doc.entry.kind === "roadmap" && !wantsPath) boost *= STUDY_PATH_DAMPING;
  if (doc.entry.kind === "follow-up") boost *= FOLLOW_UP_DAMPING;
  if (doc.entry.kind === "term" && !parsed.wantsDefinition) boost *= TERM_DAMPING;
  if (parsed.intents.includes("visual") && visualCount(doc.entry)) boost *= INTENT_BOOST;
  if (parsed.intents.includes("code") && doc.entry.codeBlocks.some(block => !isDiagram(block))) boost *= INTENT_BOOST;
  if (parsed.topics.some(item => doc.entry.topics.includes(item.topic))) boost *= TOPIC_BOOST;
  if (parsed.domain && doc.entry.domain === parsed.domain) boost *= DOMAIN_BOOST;
  return boost;
}

/** Share of the primary terms that pass the test; `empty` when there are none. */
function share(primary: string[], test: (term: string) => boolean, empty: number): number {
  return primary.length ? primary.filter(test).length / primary.length : empty;
}

function scoreDoc(engineRef: Engine, doc: Doc, parsed: ParsedQuery): Scored | null {
  const { score: raw, matched } = termScore(engineRef, doc, parsed);
  if (raw <= 0) return null;
  const coverage = share(parsed.primary, term => doc.strong.has(term), 1);
  const anyCoverage = share(parsed.primary, term => matched.includes(term), 1);
  // Query words in the question title are the strongest relevance signal (short glossary rows otherwise rank too high).
  const titleCoverage = share(parsed.primary, term => doc.questionTerms.includes(term), 0);
  const score = raw * (0.4 + 0.3 * anyCoverage + 0.3 * coverage) * (1 + TITLE_BOOST * titleCoverage) * intentBoost(doc, parsed);
  return { doc, score, coverage, matched };
}

/** A Mermaid block is a diagram, not a code example. */
function isDiagram(block: { language: string }): boolean {
  return block.language.toLowerCase() === "mermaid";
}

/** Images plus Mermaid diagrams in an entry. */
function visualCount(entry: QuestionEntry): number {
  return entry.visuals.length + entry.codeBlocks.filter(isDiagram).length;
}

function upperBound(branch: Branch, parsed: ParsedQuery): number {
  let bound = 0;
  for (const [term, weight] of parsed.weights) bound += (branch.maxContribution.get(term) ?? 0) * weight;
  if (bound === 0) return 0;
  const intentBoost = (parsed.intents.includes("visual") ? INTENT_BOOST : 1) * (parsed.intents.includes("code") ? INTENT_BOOST : 1);
  const exact = parsed.primary.length >= 2 ? EXACT_PHRASE_BONUS : 0;
  return (bound + PHRASE_BONUS * parsed.bigrams.length + exact) * TOPIC_BOOST * DOMAIN_BOOST * intentBoost * (1 + TITLE_BOOST);
}

interface TreeOutcome {
  scored: Scored[];
  visited: number;
  pruned: number;
  entriesScored: number;
}

function searchTree(engineRef: Engine, branches: Branch[], parsed: ParsedQuery, keep: number, allowed: (doc: Doc) => boolean, exhaustive = false): TreeOutcome {
  const ordered = branches.map(branch => ({ branch, bound: upperBound(branch, parsed) })).filter(item => item.bound > 0).sort((a, b) => b.bound - a.bound);
  const best = new Map<string, Scored>();
  let visited = 0;
  let entriesScored = 0;
  const threshold = () => {
    if (best.size < keep) return 0;
    return [...best.values()].map(item => item.score).sort((a, b) => b - a)[keep - 1];
  };
  for (const { branch, bound } of ordered) {
    if (!exhaustive && bound <= threshold()) break; // Every remaining branch has an even lower bound.
    visited++;
    for (const position of branch.docs) {
      const doc = engineRef.docs[position];
      if (!allowed(doc) || best.has(doc.entry.id)) continue;
      entriesScored++;
      const scored = scoreDoc(engineRef, doc, parsed);
      if (scored) best.set(doc.entry.id, scored);
    }
  }
  return { scored: [...best.values()], visited, pruned: branches.length - visited, entriesScored };
}

function toHit(item: { doc: Doc; score: number; coverage: number; matched: string[] }, matchedBy: SearchHit["matchedBy"] = "search"): SearchHit {
  const entry = item.doc.entry;
  return {
    id: entry.id,
    kind: entry.kind,
    parentId: entry.parentId,
    question: entry.question,
    summary: entry.summary,
    topics: entry.topics,
    section: entry.section,
    source: entry.source,
    score: Math.round(item.score * 100) / 100,
    coverage: Math.round(item.coverage * 100) / 100,
    matchedTerms: item.matched,
    codeLanguages: [...new Set(entry.codeBlocks.filter(block => !isDiagram(block)).map(block => block.language))],
    visualCount: visualCount(entry),
    matchedBy,
  };
}

const START_HERE = "roadmap/topics/README.md";
const ROLES_INDEX = "roadmap/roles/README.md";

/** One question per section, in file order, so a topic overview covers the whole topic. */
function browse(engineRef: Engine, predicate: (doc: Doc) => boolean, limit: number, roadmapFirst = false): Doc[] {
  if (roadmapFirst) {
    const roadmaps = engineRef.docs.filter(doc => predicate(doc) && doc.entry.kind === "roadmap");
    return [...roadmaps, ...browse(engineRef, doc => predicate(doc) && doc.entry.kind !== "roadmap", limit)].slice(0, limit);
  }
  // One question per file first, then per section within each file, so every file of the topic is represented.
  const byFile = new Map<string, Map<string, Doc[]>>();
  for (const doc of engineRef.docs) {
    if (!predicate(doc) || doc.entry.kind === "follow-up") continue;
    const sections = byFile.get(doc.entry.source.path) ?? new Map<string, Doc[]>();
    const key = doc.entry.section.join("|");
    sections.set(key, [...(sections.get(key) ?? []), doc]);
    byFile.set(doc.entry.source.path, sections);
  }
  const fileQueues = [...byFile.values()].map(sections => roundRobin([...sections.values()], Number.POSITIVE_INFINITY));
  return roundRobin(fileQueues, limit);
}

/** First item of each list, then the second of each, and so on, up to `limit`. */
function roundRobin<T>(lists: T[][], limit: number): T[] {
  const picked: T[] = [];
  const longest = Math.max(0, ...lists.map(list => list.length));
  for (let round = 0; round < longest; round++) {
    for (const list of lists) {
      if (round < list.length) picked.push(list[round]);
    }
  }
  return picked.slice(0, limit);
}

/** `noSubject`: nothing was asked yet ("can you help me"), so popular starter questions are welcome. */
function suggestionsFor(engineRef: Engine, query: string, topics: string[], noSubject = false): SearchResult["suggestions"] {
  const tokens = rawTokens(query).filter(token => token.length >= 3);
  const nearTopics = engineRef.topicNames.filter(topic =>
    tokens.some(token => {
      const name = topic.split("/").pop()!;
      return name.startsWith(token) || editDistance(token, name, allowedTypos(name)) <= allowedTypos(name);
    }),
  );
  const popular = [...engineRef.topicCounts.entries()].filter(([topic]) => topic !== "(untagged)").sort((a, b) => b[1] - a[1]).map(([topic]) => topic);
  const suggestedTopics = [...new Set([...topics, ...nearTopics, ...popular])].slice(0, 8);
  // Starter questions only for topics the query itself points to; the most popular topics would be
  // unrelated ("What is WebAssembly?" → "Why OOP was introduced?"), and nothing beats a wrong lead.
  const related = noSubject ? suggestedTopics : [...new Set([...topics, ...nearTopics])];
  const starters = related.slice(0, 4).flatMap(topic => browse(engineRef, doc => doc.entry.topics.includes(topic) && doc.entry.kind === "question", 1));
  return {
    topics: suggestedTopics,
    questions: starters.map(doc => ({ id: doc.entry.id, question: doc.entry.question, topic: doc.entry.topics[0] ?? null })),
  };
}

function confidenceOf(top: Scored | undefined, primaryCount: number): SearchConfidence {
  if (!top) return "none";
  if (primaryCount === 0) return "high";
  if (top.coverage >= 0.75) return "high";
  if (top.coverage >= 0.5) return "medium";
  return "low";
}

export function searchQuestions(query: string, options: SearchOptions = {}): SearchResult {
  const engineRef = getEngine();
  const limit = Math.min(Math.max(options.limit ?? 8, 1), 50);
  const parsed = parseQuery(query, engineRef, options.topic?.trim().toLowerCase() || undefined);
  const result = searchParsed(engineRef, query, parsed, limit, options);
  if (!parsed.pinned.length) return result;
  // Named roles/terms go first; the rest of the results show what is related to them.
  const pins = parsed.pinned.map(position => toHit({ doc: engineRef.docs[position], score: (result.hits[0]?.score ?? 0) + 1, coverage: 1, matched: [] }, "name"));
  const pinnedIds = new Set(pins.map(hit => hit.id));
  return {
    ...result,
    mode: result.mode === "empty" ? "lookup" : result.mode,
    confidence: "high",
    hits: [...pins, ...result.hits.filter(hit => !pinnedIds.has(hit.id))].slice(0, limit),
    suggestions: { topics: [], questions: [] },
  };
}

/** Everything one search needs, shared by the result builders below. */
interface SearchContext {
  engineRef: Engine;
  query: string;
  parsed: ParsedQuery;
  limit: number;
  options: SearchOptions;
  topicNames: string[];
  kindAllowed: (doc: Doc) => boolean;
  base: Omit<SearchResult, "mode" | "confidence" | "strategy" | "hits" | "facets" | "suggestions">;
}

const NO_SUGGESTIONS: SearchResult["suggestions"] = { topics: [], questions: [] };

/** A browse result: entries listed in order rather than scored. */
function browseResult(
  ctx: SearchContext,
  docs: Doc[],
  extra: Pick<SearchResult, "confidence" | "facets" | "suggestions"> & { narrowedTo: string[] },
): SearchResult {
  return {
    ...ctx.base,
    mode: "browse",
    confidence: extra.confidence,
    strategy: { narrowedTo: extra.narrowedTo, widened: false, branchesTotal: ctx.engineRef.branches.length, branchesVisited: 0, branchesPruned: 0, entriesScored: 0 },
    hits: docs.map(doc => toHit({ doc, score: 0, coverage: 1, matched: [] }, "browse")),
    facets: extra.facets,
    suggestions: extra.suggestions,
  };
}

/** Only a topic or domain was named ("java", "prepare me for a frontend interview"): give an overview. */
function topicOverview(ctx: SearchContext): SearchResult {
  const { engineRef, parsed, topicNames } = ctx;
  const inTopics = (doc: Doc) => !topicNames.length || doc.entry.topics.some(topic => topicNames.includes(topic));
  const inDomain = (doc: Doc) => !parsed.domain || topicNames.length > 0 || doc.entry.domain === parsed.domain;
  const predicate = (doc: Doc) => ctx.kindAllowed(doc) && inTopics(doc) && inDomain(doc);
  // A study path is the best overview when the user wants to learn or prepare.
  const roadmapFirst = parsed.intents.includes("roadmap") || parsed.intents.includes("interview-prep");
  const docs = browse(engineRef, predicate, ctx.limit, roadmapFirst);
  const counts = new Map<string, number>();
  for (const doc of engineRef.docs.filter(predicate)) for (const topic of doc.entry.topics) counts.set(topic, (counts.get(topic) ?? 0) + 1);
  return browseResult(ctx, docs, {
    confidence: docs.length ? "high" : "none",
    narrowedTo: topicNames,
    facets: [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([topic, count]) => ({ topic, count })),
    suggestions: docs.length ? NO_SUGGESTIONS : suggestionsFor(engineRef, ctx.query, topicNames),
  });
}

/**
 * "Where do I start?": the learning tracks, the role roadmaps, then study paths in track order.
 * Study paths follow the order the learning-tracks page lists them (HTML first).
 */
function startHere(ctx: SearchContext): SearchResult | null {
  const { engineRef } = ctx;
  const startPage = engineRef.docs.find(doc => doc.entry.source.path === START_HERE)?.entry.answer ?? "";
  const trackOrder = [...startPage.matchAll(/\]\(\.\.\/topics\/([a-z0-9-]+)\.md\)/g)].map(match => `roadmap/topics/${match[1]}.md`);
  const order = (doc: Doc) => {
    const path = doc.entry.source.path;
    if (path === START_HERE) return -2;
    if (path === ROLES_INDEX) return -1;
    const at = trackOrder.indexOf(path);
    return at < 0 ? trackOrder.length : at;
  };
  const isOverviewRoadmap = (doc: Doc) =>
    doc.entry.kind === "roadmap" && (doc.entry.source.path === ROLES_INDEX || !doc.entry.source.path.startsWith("roadmap/roles/"));
  const docs = engineRef.docs
    .filter(doc => ctx.kindAllowed(doc) && isOverviewRoadmap(doc))
    .sort((a, b) => order(a) - order(b))
    .slice(0, ctx.limit);
  if (!docs.length) return null;
  return browseResult(ctx, docs, { confidence: "high", narrowedTo: ["roadmaps"], facets: [{ topic: "roadmaps", count: docs.length }], suggestions: NO_SUGGESTIONS });
}

/** "What roles are there?": a sample of roles from each family. */
function roleBrowse(ctx: SearchContext): SearchResult | null {
  const docs = browse(ctx.engineRef, doc => ctx.kindAllowed(doc) && doc.entry.kind === "role", ctx.limit);
  if (!docs.length) return null;
  const count = ctx.engineRef.topicCounts.get("it-roles") ?? 0;
  return browseResult(ctx, docs, { confidence: "medium", narrowedTo: ["it-roles"], facets: [{ topic: "it-roles", count }], suggestions: NO_SUGGESTIONS });
}

/** Nothing to search for: suggest where to start. */
function emptyResult(ctx: SearchContext): SearchResult {
  return {
    ...ctx.base,
    mode: "empty",
    confidence: "none",
    strategy: { narrowedTo: [], widened: false, branchesTotal: ctx.engineRef.branches.length, branchesVisited: 0, branchesPruned: 0, entriesScored: 0 },
    hits: [],
    facets: [],
    suggestions: suggestionsFor(ctx.engineRef, ctx.query, [], true),
  };
}

/** Scores the branches of the named topics; widens to all topics when they hold too few good matches. */
function scoreBranches(ctx: SearchContext, keep: number): { outcome: TreeOutcome; widened: boolean } {
  const { engineRef, parsed, topicNames, options } = ctx;
  const narrowedBranches = topicNames.length ? engineRef.branches.filter(branch => topicNames.includes(branch.topic)) : engineRef.branches;
  const outcome = searchTree(engineRef, narrowedBranches, parsed, keep, ctx.kindAllowed, options.exhaustive);
  // Judge only the top `keep` results, which pruning returns exactly, so pruning never changes this decision.
  const strongEnough = (items: Scored[]) =>
    [...items].sort((x, y) => y.score - x.score).slice(0, keep).filter(item => item.coverage >= 0.5).length >= Math.min(ctx.limit, 3);
  if (!topicNames.length || options.topic || strongEnough(outcome.scored)) return { outcome, widened: false };
  const wider = searchTree(engineRef, engineRef.branches, parsed, keep, ctx.kindAllowed, options.exhaustive);
  return {
    outcome: {
      scored: [...new Map([...outcome.scored, ...wider.scored].map(item => [item.doc.entry.id, item])).values()],
      visited: outcome.visited + wider.visited,
      pruned: wider.pruned,
      entriesScored: outcome.entriesScored + wider.entriesScored,
    },
    widened: true,
  };
}

function searchParsed(engineRef: Engine, query: string, parsed: ParsedQuery, limit: number, options: SearchOptions): SearchResult {
  const ctx: SearchContext = {
    engineRef,
    query,
    parsed,
    limit,
    options,
    topicNames: parsed.topics.map(item => item.topic),
    kindAllowed: (doc: Doc) => !options.kinds || options.kinds.includes(doc.entry.kind),
    base: {
      query,
      intents: parsed.intents,
      topics: parsed.topics,
      domain: parsed.domain,
      terms: parsed.primary,
      corrections: parsed.corrections,
      entities: parsed.pinned.map(position => {
        const entry = engineRef.docs[position].entry;
        return { name: entry.names?.[0] ?? entry.question, id: entry.id, kind: entry.kind };
      }),
    },
  };

  // "Java vs Python" compares two topics: search for the comparison rather than listing both topics.
  const comparesTopics = parsed.intents.includes("compare") && ctx.topicNames.length > 1;
  if (parsed.primary.length === 0 && (ctx.topicNames.length || parsed.domain) && !comparesTopics) return topicOverview(ctx);
  if (parsed.weights.size === 0) {
    const browsed = (parsed.intents.includes("roadmap") ? startHere(ctx) : null) ?? (parsed.intents.includes("role") ? roleBrowse(ctx) : null);
    return browsed ?? emptyResult(ctx);
  }

  // Keep extra candidates so facet counts and follow-up grouping have room.
  const keep = Math.max(limit * 3, 20);
  const { outcome, widened } = scoreBranches(ctx, keep);
  const ranked = [...outcome.scored].sort((a, b) => b.score - a.score || a.doc.entry.id.localeCompare(b.doc.entry.id));
  const facets = new Map<string, number>();
  for (const item of ranked) for (const topic of item.doc.entry.topics.length ? item.doc.entry.topics : ["(untagged)"]) facets.set(topic, (facets.get(topic) ?? 0) + 1);
  const confidence = confidenceOf(ranked[0], parsed.primary.length);
  return {
    ...ctx.base,
    mode: "search",
    confidence,
    strategy: {
      narrowedTo: ctx.topicNames,
      widened,
      branchesTotal: engineRef.branches.length,
      branchesVisited: outcome.visited,
      branchesPruned: engineRef.branches.length - outcome.visited,
      entriesScored: outcome.entriesScored,
    },
    hits: ranked.slice(0, limit).map(item => toHit(item)),
    facets: [...facets.entries()].sort((a, b) => b[1] - a[1]).map(([topic, count]) => ({ topic, count })),
    suggestions: confidence === "high" || confidence === "medium" ? { topics: [], questions: [] } : suggestionsFor(engineRef, query, ctx.topicNames),
  };
}

/** Every topic the query could mean, best first (named topics, then topics of strong matches). */
export function resolveTopics(query: string): string[] {
  const result = searchQuestions(query, { limit: 8 });
  const named = result.topics.map(item => item.topic);
  const votes = new Map<string, number>();
  if (result.terms.length) {
    for (const hit of result.hits) {
      if (hit.coverage < 2 / 3 && hit.matchedBy !== "name") continue;
      for (const topic of hit.topics) votes.set(topic, (votes.get(topic) ?? 0) + Math.max(hit.score, 1));
    }
  }
  const voted = [...votes.entries()].sort((a, b) => b[1] - a[1]).map(([topic]) => topic);
  return [...new Set([...named, ...voted])];
}

/**
 * Maps free text ("how does the event loop work?") to one repository topic, or null.
 * Only resolves when the evidence is strong, so unrelated text still reports a repository gap.
 */
export function resolveTopic(query: string): { topic: string; via: "alias" | "typo" | "search"; confidence: SearchConfidence } | null {
  const result = searchQuestions(query, { limit: 5 });
  if (result.topics.length) return { topic: result.topics[0].topic, via: result.topics[0].via === "typo" ? "typo" : "alias", confidence: "high" };
  const strong = result.hits.filter(hit => hit.coverage >= 2 / 3 && hit.topics.length);
  if (!strong.length || result.terms.length === 0) return null;
  const votes = new Map<string, number>();
  for (const hit of strong) for (const topic of hit.topics) votes.set(topic, (votes.get(topic) ?? 0) + hit.score);
  const [topic] = [...votes.entries()].sort((a, b) => b[1] - a[1])[0];
  return { topic, via: "search", confidence: result.confidence };
}

function main(): void {
  const args = process.argv.slice(2);
  const limitAt = args.indexOf("--limit");
  const limit = limitAt >= 0 ? Number(args[limitAt + 1]) : 5;
  const query = args.filter((arg, position) => !arg.startsWith("--") && position !== limitAt + 1).join(" ");
  if (!query) {
    process.stderr.write('Usage: node dist/question-search.js "your question" [--limit 5] [--json]\n');
    process.exit(1);
  }
  const result = searchQuestions(query, { limit });
  if (args.includes("--json")) {
    process.stdout.write(JSON.stringify(result, null, 2) + "\n");
    return;
  }
  const lines = [
    `Query:      ${result.query}`,
    `Mode:       ${result.mode}   Confidence: ${result.confidence}   Intents: ${result.intents.join(", ")}`,
    `Topics:     ${result.topics.map(item => `${item.topic} (${item.via})`).join(", ") || "-"}   Domain: ${result.domain ?? "-"}`,
    `Terms:      ${result.terms.join(", ") || "-"}${result.corrections.length ? `   Corrected: ${result.corrections.map(c => `${c.from}→${c.to}`).join(", ")}` : ""}`,
    `Tree:       visited ${result.strategy.branchesVisited}/${result.strategy.branchesTotal} branches, scored ${result.strategy.entriesScored} entries${result.strategy.widened ? ", widened to all topics" : ""}`,
    "",
    ...result.hits.map((hit, position) => `${position + 1}. [${hit.score}] ${hit.question}\n   ${hit.topics.join(", ") || "(untagged)"} · ${hit.source.path}:${hit.source.startLine}${hit.codeLanguages.length ? ` · code: ${hit.codeLanguages.join("/")}` : ""}${hit.visualCount ? ` · ${hit.visualCount} visual(s)` : ""}`),
  ];
  if (result.suggestions.topics.length) lines.push("", `Try a topic: ${result.suggestions.topics.join(", ")}`, ...result.suggestions.questions.map(item => `  • ${item.question}`));
  process.stdout.write(lines.join("\n") + "\n");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
