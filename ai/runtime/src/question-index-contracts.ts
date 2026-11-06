export const QUESTION_INDEX_SCHEMA_VERSION = "1.0.0";

/** question/follow-up: interview & practice files. note: a reference section. role/term: IT Roles & Terminology Atlas. */
export type QuestionEntryKind = "question" | "follow-up" | "note" | "role" | "term" | "roadmap";
export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface CodeBlock {
  language: string;
  code: string;
}

export interface VisualRef {
  /** Repository-relative path, or the URL for external images; null when it could not be resolved. */
  path: string | null;
  origin: "repository" | "external";
  /** The reference exactly as written in the markdown. */
  reference: string;
  alt: string;
  /** For repository images: the file exists. External URLs are not fetched and are reported as true. */
  exists: boolean;
  /** "answer" = inside the question/answer; "section" = shown in the section intro just before it. */
  placement: "answer" | "section";
}

export interface QuestionEntry {
  /** Stable id: `<source path>#<question slug>`. */
  id: string;
  kind: QuestionEntryKind;
  /** For follow-ups: id of the question they follow. */
  parentId: string | null;
  question: string;
  /** Extra question context written before the answer (e.g. a code snippet for "What is the output?"). */
  prompt: string | null;
  answer: string;
  /** First paragraph of the answer as plain text, at most 320 characters. */
  summary: string;
  codeBlocks: CodeBlock[];
  visuals: VisualRef[];
  contentType: string;
  domain: string;
  topics: string[];
  /** Section headings above the question, outermost first. */
  section: string[];
  /** Only set when a section heading states it explicitly. */
  difficulty: Difficulty | null;
  keywords: string[];
  /** Exact names this entry answers to ("SRE", "Site Reliability Engineer"), for direct lookup. */
  names?: string[];
  /** Learning topics this entry connects to (e.g. a role's languages and tools). */
  relatedTopics?: string[];
  source: { path: string; startLine: number; endLine: number };
  contentHash: string;
}

export interface QuestionIndexFileStats {
  path: string;
  questions: number;
  followUps: number;
  notes: number;
  roles: number;
  terms: number;
  roadmaps: number;
  withoutAnswer: number;
  missingVisuals: number;
}

export interface QuestionIndex {
  schema_version: string;
  repository: string;
  generated_at: string;
  /** Hash of every source file's content; unchanged sources give an unchanged fingerprint. */
  source_fingerprint: string;
  stats: {
    files: number;
    entries: number;
    questions: number;
    followUps: number;
    notes: number;
    roles: number;
    terms: number;
    roadmaps: number;
    codeBlocks: number;
    visuals: number;
    missingVisuals: number;
  };
  files: QuestionIndexFileStats[];
  entries: QuestionEntry[];
}
