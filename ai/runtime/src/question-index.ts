import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { QUESTION_INDEX_SCHEMA_VERSION, type QuestionEntry, type QuestionIndex } from "./question-index-contracts.js";

const REPOSITORY_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const INDEX_PATH = resolve(REPOSITORY_ROOT, "ai/knowledge-index/question-index.json");

let cached: QuestionIndex | null = null;

function isEntry(value: unknown): value is QuestionEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.id === "string" &&
    typeof entry.question === "string" &&
    typeof entry.answer === "string" &&
    Array.isArray(entry.topics) &&
    Array.isArray(entry.keywords) &&
    !!entry.source &&
    typeof (entry.source as Record<string, unknown>).path === "string"
  );
}

/** Loads the question-level index built by `npm run question-index`. */
export async function loadQuestionIndex(): Promise<QuestionIndex> {
  if (cached) return cached;
  const parsed = JSON.parse(await readFile(INDEX_PATH, "utf8")) as Partial<QuestionIndex>;
  if (parsed.schema_version !== QUESTION_INDEX_SCHEMA_VERSION) {
    throw new Error(`Question index schema ${parsed.schema_version ?? "missing"} is not supported (expected ${QUESTION_INDEX_SCHEMA_VERSION}).`);
  }
  if (!Array.isArray(parsed.entries) || !parsed.entries.every(isEntry)) {
    throw new Error("Question index entries are malformed. Rebuild it with: npm run question-index");
  }
  cached = parsed as QuestionIndex;
  return cached;
}

export async function getQuestionsByTopic(topic: string): Promise<QuestionEntry[]> {
  const normalized = topic.trim().toLowerCase();
  const index = await loadQuestionIndex();
  return index.entries.filter(entry => entry.topics.some(item => item.toLowerCase() === normalized));
}

export async function getQuestionById(id: string): Promise<QuestionEntry | null> {
  const index = await loadQuestionIndex();
  return index.entries.find(entry => entry.id === id) ?? null;
}

export async function getFollowUps(id: string): Promise<QuestionEntry[]> {
  const index = await loadQuestionIndex();
  return index.entries.filter(entry => entry.parentId === id);
}
