import type { QuestionEntryKind } from "./question-index-contracts.js";
import type { SearchConfidence, SearchIntent, SearchResult } from "./question-search.js";

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  message: string;
  /** Earlier turns, oldest first. Only the last few are used. */
  history?: ChatTurn[];
  /** Optional topic filter chosen in the UI. */
  topic?: string;
  /** Items picked from a roadmap checklist; the answer is a learning sequence for them. */
  plan?: PlanRequest;
  /** A topic id picked in the sidebar: answer with that topic's overview. */
  overview?: string;
}

export interface PlanRequest {
  /** The roadmap the items were picked from, e.g. "Roadmap: Forward Deployed Engineer". */
  title: string;
  /** `topic` is a study-path slug (e.g. "database-sql") when the item links to one. */
  items: Array<{ label: string; topic?: string }>;
}

/** How the answer was produced: a written answer, a topic overview, or a learning plan. */
export type AnswerView = "answer" | "overview" | "plan";

/** One numbered source given to the model and shown in the UI. Citations [n] refer to `n`. */
export interface Evidence {
  n: number;
  id: string;
  kind: QuestionEntryKind;
  question: string;
  summary: string;
  topics: string[];
  /** Learning topics linked to this entry (e.g. the skills of a role). */
  relatedTopics: string[];
  section: string[];
  path: string;
  startLine: number;
  endLine: number;
  /** Full answer text, or null when only the summary is passed to the model. */
  answer: string | null;
  codeLanguages: string[];
  visuals: Array<{ url: string; alt: string }>;
  matchedBy: "name" | "search" | "browse";
}

export interface Grounding {
  /** Source numbers the answer cites. */
  cited: number[];
  /** Citations that point at no source (should never happen). */
  invalid: number[];
  /** The answer has a "Beyond your notes" section (content not from the repository). */
  generatedSection: boolean;
  /** Sources existed but the answer cites none. */
  uncited: boolean;
}

export type AnswerMode = "claude" | "repository";

export type ChatEvent =
  | {
      type: "meta";
      query: string;
      searchedFor: string;
      intents: SearchIntent[];
      confidence: SearchConfidence;
      mode: SearchResult["mode"];
      topics: string[];
      entities: SearchResult["entities"];
      evidence: Evidence[];
      answerMode: AnswerMode;
    }
  | { type: "status"; stage: "thinking" | "writing" | "fallback"; message?: string }
  | { type: "delta"; text: string }
  | {
      type: "done";
      answerMode: AnswerMode;
      view: AnswerView;
      model: string | null;
      grounding: Grounding;
      followUps: string[];
      suggestions: SearchResult["suggestions"];
      notice: string | null;
      usage: { inputTokens: number; outputTokens: number; cacheReadTokens: number; cacheWriteTokens: number } | null;
    }
  | { type: "error"; code: string; message: string };

export const GENERATED_HEADING = "### Beyond your notes";
