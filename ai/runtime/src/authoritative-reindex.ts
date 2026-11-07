import {
  appendFile,
  copyFile,
  mkdir,
  readFile,
  rename,
  readdir,
  stat
} from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import type { MergeVerification } from "./reindex-contracts.js";
import { byText } from "./text-utils.js";

const execFileAsync = promisify(execFile);

const RUNTIME_DIR = dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = resolve(RUNTIME_DIR, "../../..");
const INDEX_DIRECTORY = join(REPOSITORY_ROOT, "ai", "knowledge-index");
const INDEX_PATH = join(INDEX_DIRECTORY, "content-index.json");
const CANDIDATE_PATH = join(
  INDEX_DIRECTORY,
  "content-index.reindex-candidate.json"
);
const AUDIT_PATH = join(
  INDEX_DIRECTORY,
  "reindex-audit.jsonl"
);

const PROTECTED_MAIN = "main";

const EXCLUDED_PREFIXES = [
  ".git/",
  "_migration/",
  "ai/knowledge-index/",
  "templates/",
  "scripts/reports/"
];

const EXCLUDED_NAME_PATTERNS = [
  /\.before-/i,
  /\.backup/i,
  /(^|\/)backup([._-]|\/)/i,
  /(^|\/)candidate([._-]|\/)/i,
  /(^|\/)migration([._-]|\/)/i
];

interface IndexedDocument {
  id: string;
  path: string;
  content_type: string;
  domain: string;
  canonical_concept: string | null;
  extension: string;
  size_bytes: number;
  source_of_truth: boolean;
  related_concepts: string[];
  [key: string]: unknown;
}

interface KnowledgeIndex {
  schema_version: string;
  repository: string;
  generated_at: string;
  source_schema: string;
  indexing_rules: string[];
  documents: IndexedDocument[];
  [key: string]: unknown;
}

export interface ReindexValidation {
  valid: boolean;
  findings: string[];
  documentCount: number;
  canonicalConceptCount: number;
}

export interface ReindexBuildResult {
  valid: boolean;
  candidatePath: string;
  validation: ReindexValidation;
  addedPaths: string[];
  removedPaths: string[];
  changedPaths: string[];
}

export interface ReindexExecutionResult {
  executed: boolean;
  promoted: boolean;
  branch: string;
  source: "merged-main";
  candidate: ReindexBuildResult | null;
  auditPath: string;
  reason: string;
}

interface AuditEvent {
  event: string;
  timestamp: string;
  branch: string;
  source: "merged-main";
  status: "started" | "completed" | "blocked" | "failed";
  details: string;
}

function normalizePath(value: string): string {
  return value.replace(/\\/g, "/").replace(/^\.\/+/, "");
}

function isExcluded(path: string): boolean {
  const normalized = normalizePath(path).toLowerCase();

  if (EXCLUDED_PREFIXES.some((prefix) =>
    normalized.startsWith(prefix.toLowerCase())
  )) {
    return true;
  }

  return EXCLUDED_NAME_PATTERNS.some((pattern) =>
    pattern.test(normalized)
  );
}

function canonicalFromPath(path: string): string | null {
  const match = /^knowledge\/concepts\/(.+)\/README\.md$/i.exec(path);

  return match ? match[1].toLowerCase() : null;
}

function domainFromPath(path: string): string {
  const parts = normalizePath(path).split("/");

  if (parts.length >= 2) {
    return parts[1];
  }

  return "general";
}

function contentTypeFromPath(path: string): string {
  const normalized = normalizePath(path).toLowerCase();

  if (normalized.startsWith("knowledge/concepts/")) {
    return "concept";
  }

  if (normalized.startsWith("interview/")) {
    return "interview";
  }

  if (normalized.startsWith("study_materials/")) {
    return "study-material";
  }

  if (normalized.startsWith("study-materials/")) {
    return "study-material";
  }

  if (normalized.startsWith("stack-mastery/")) {
    return "stack-mastery";
  }

  return "knowledge";
}

async function currentBranch(): Promise<string> {
  const result = await execFileAsync(
    "git",
    ["branch", "--show-current"],
    {
      cwd: REPOSITORY_ROOT,
      windowsHide: true
    }
  );

  return result.stdout.trim();
}

async function discoverCanonicalConceptPaths(): Promise<string[]> {
  const conceptsRoot = join(
    REPOSITORY_ROOT,
    "knowledge",
    "concepts"
  );

  const discovered: string[] = [];

  async function walk(directory: string): Promise<void> {
    const entries = await readdir(directory, {
      withFileTypes: true
    });

    for (const entry of entries) {
      const absolute = join(directory, entry.name);

      if (entry.isDirectory()) {
        await walk(absolute);
        continue;
      }

      if (
        entry.isFile() &&
        entry.name.toLowerCase() === "readme.md"
      ) {
        const relativePath = normalizePath(
          relative(REPOSITORY_ROOT, absolute)
        );

        if (!isExcluded(relativePath)) {
          discovered.push(relativePath);
        }
      }
    }
  }

  try {
    await walk(conceptsRoot);
  } catch {
    return [];
  }

  return discovered.sort(byText);
}
async function loadCurrentIndex(): Promise<KnowledgeIndex> {
  const raw = (await readFile(INDEX_PATH, "utf8")).replace(/^\uFEFF/, "");
  const parsed = JSON.parse(raw) as KnowledgeIndex;

  if (!Array.isArray(parsed.documents)) {
    throw new Error(
      "Authoritative index does not contain a documents array."
    );
  }

  return parsed;
}

function preserveDocumentMetadata(
  existing: IndexedDocument | undefined,
  path: string,
  sizeBytes: number
): IndexedDocument {
  const canonical = canonicalFromPath(path);

  if (existing) {
    return {
      ...existing,
      id: existing.id || path,
      path,
      extension: extname(path),
      size_bytes: sizeBytes,
      canonical_concept:
        canonical ?? existing.canonical_concept ?? null,
      source_of_truth:
        canonical !== null
          ? true
          : Boolean(existing.source_of_truth),
      related_concepts:
        Array.isArray(existing.related_concepts)
          ? existing.related_concepts
          : []
    };
  }

  return {
    id: path,
    path,
    content_type: contentTypeFromPath(path),
    domain: domainFromPath(path),
    canonical_concept: canonical,
    extension: extname(path),
    size_bytes: sizeBytes,
    source_of_truth: canonical !== null,
    related_concepts: []
  };
}

/** Size of a repository file, or null when it no longer exists. */
async function fileSize(path: string): Promise<number | null> {
  try {
    const fileStat = await stat(resolve(REPOSITORY_ROOT, normalizePath(path)));
    return fileStat.isFile() ? fileStat.size : null;
  } catch {
    return null;
  }
}

/**
 * The documents of the rebuilt index: every indexed file that still exists (metadata kept, size refreshed),
 * then any canonical concept README that is not indexed yet.
 */
async function rebuildDocuments(
  existing: IndexedDocument[],
  existingByPath: Map<string, IndexedDocument>
): Promise<IndexedDocument[]> {
  const documents: IndexedDocument[] = [];
  for (const document of existing) {
    const path = normalizePath(document.path);
    if (isExcluded(path)) continue;
    const size = await fileSize(path);
    if (size !== null) documents.push(preserveDocumentMetadata(document, path, size));
  }
  for (const path of await discoverCanonicalConceptPaths()) {
    if (existingByPath.has(path.toLowerCase())) continue;
    const size = await fileSize(path);
    if (size !== null) documents.push(preserveDocumentMetadata(undefined, path, size));
  }
  return documents;
}

async function buildCandidate(): Promise<ReindexBuildResult> {
  const current = await loadCurrentIndex();

  const existingByPath = new Map<string, IndexedDocument>();

  for (const document of current.documents) {
    existingByPath.set(
      normalizePath(document.path).toLowerCase(),
      document
    );
  }

  const documents = await rebuildDocuments(current.documents, existingByPath);


  const currentPaths = new Set(
    current.documents.map((document) =>
      normalizePath(document.path).toLowerCase()
    )
  );

  const rebuiltPaths = new Set(
    documents.map((document) =>
      normalizePath(document.path).toLowerCase()
    )
  );

  const addedPaths = documents
    .filter(
      (document) =>
        !currentPaths.has(
          normalizePath(document.path).toLowerCase()
        )
    )
    .map((document) => document.path);

  const removedPaths = current.documents
    .filter(
      (document) =>
        !rebuiltPaths.has(
          normalizePath(document.path).toLowerCase()
        )
    )
    .map((document) => document.path);

  const changedPaths = documents
    .filter((document) => {
      const existing = existingByPath.get(
        normalizePath(document.path).toLowerCase()
      );

      return Boolean(
        existing &&
        existing.size_bytes !== document.size_bytes
      );
    })
    .map((document) => document.path);

  const candidate: KnowledgeIndex = {
    ...current,
    generated_at: new Date().toISOString(),
    documents
  };

  await mkdir(INDEX_DIRECTORY, { recursive: true });

  await copyFile(
    INDEX_PATH,
    `${INDEX_PATH}.before-reindex.json`
  );

  await import("node:fs/promises").then(({ writeFile }) =>
    writeFile(
      CANDIDATE_PATH,
      JSON.stringify(candidate, null, 2) + "\n",
      "utf8"
    )
  );

  const validation = await validateCandidate(candidate);

  return {
    valid: validation.valid,
    candidatePath: CANDIDATE_PATH,
    validation,
    addedPaths,
    removedPaths,
    changedPaths
  };
}

/** Every canonical concept the candidate knows about, from its metadata and its concept README paths. */
function knownConcepts(candidate: KnowledgeIndex): Set<string> {
  const concepts = new Set<string>();
  for (const document of candidate.documents) {
    if (document.canonical_concept) concepts.add(String(document.canonical_concept).toLowerCase());
    const fromPath = canonicalFromPath(document.path);
    if (fromPath) concepts.add(fromPath.toLowerCase());
  }
  return concepts;
}

/** Problems with one indexed document: excluded, missing, wrong owner, or broken relationships. */
async function documentFindings(document: IndexedDocument, concepts: Set<string>): Promise<string[]> {
  const findings: string[] = [];
  if (isExcluded(document.path)) findings.push("Excluded path appeared in candidate index: " + document.path);
  if ((await fileSize(document.path)) === null) {
    findings.push(await missingFileFinding(document.path));
  }
  const canonical = canonicalFromPath(document.path);
  if (canonical && String(document.canonical_concept ?? "").toLowerCase() !== canonical) {
    findings.push("Canonical ownership mismatch: " + document.path + " expected " + canonical);
  }
  if (!Array.isArray(document.related_concepts)) {
    findings.push("related_concepts must be an array: " + document.path);
    return findings;
  }
  for (const relationship of document.related_concepts) {
    if (!concepts.has(String(relationship).toLowerCase())) {
      findings.push("Invalid related concept '" + relationship + "' for " + document.path);
    }
  }
  return findings;
}

/** "does not exist" or "is not a file", matching the wording the audit log has always used. */
async function missingFileFinding(path: string): Promise<string> {
  try {
    await stat(resolve(REPOSITORY_ROOT, normalizePath(path)));
    return "Indexed path is not a file: " + path;
  } catch {
    return "Indexed file does not exist: " + path;
  }
}

async function validateCandidate(
  candidate: KnowledgeIndex
): Promise<ReindexValidation> {
  const findings: string[] = [];
  const concepts = knownConcepts(candidate);
  const paths = new Set<string>();

  for (const document of candidate.documents) {
    const normalized = normalizePath(document.path).toLowerCase();
    if (paths.has(normalized)) findings.push("Duplicate indexed path: " + document.path);
    paths.add(normalized);
    findings.push(...(await documentFindings(document, concepts)));
  }

  if (candidate.schema_version !== "1.1") {
    findings.push(
      "Unexpected index schema version: " +
        candidate.schema_version
    );
  }

  if (candidate.repository !== "Tech-Mastery-Hub") {
    findings.push(
      "Unexpected repository identifier."
    );
  }

  if (candidate.documents.length === 0) {
    findings.push(
      "Candidate index contains no documents."
    );
  }

  return {
    valid: findings.length === 0,
    findings,
    documentCount: candidate.documents.length,
    canonicalConceptCount: concepts.size
  };
}
async function appendAudit(
  event: AuditEvent
): Promise<void> {
  await mkdir(INDEX_DIRECTORY, { recursive: true });

  await appendFile(
    AUDIT_PATH,
    JSON.stringify(event) + "\n",
    "utf8"
  );
}

async function promoteCandidate(): Promise<void> {
  const backupPath =
    `${INDEX_PATH}.pre-promotion.json`;

  await rename(INDEX_PATH, backupPath);

  try {
    await rename(CANDIDATE_PATH, INDEX_PATH);
    await import("node:fs/promises").then(({ unlink }) =>
      unlink(backupPath)
    ).catch(() => undefined);
  } catch (error) {
    await rename(backupPath, INDEX_PATH).catch(() => undefined);
    throw error;
  }
}

export async function executeAuthoritativeReindex(
  merge: MergeVerification
): Promise<ReindexExecutionResult> {
  const branch = await currentBranch();

  if (
    !merge.verified ||
    !merge.merged ||
    !merge.humanApprovalConfirmed ||
    merge.baseBranch !== PROTECTED_MAIN
  ) {
    await appendAudit({
      event: "authoritative-reindex",
      timestamp: new Date().toISOString(),
      branch,
      source: "merged-main",
      status: "blocked",
      details:
        "Re-index blocked because approved merge into main was not externally confirmed."
    });

    return {
      executed: false,
      promoted: false,
      branch,
      source: "merged-main",
      candidate: null,
      auditPath: AUDIT_PATH,
      reason:
        "Authoritative re-index requires externally confirmed human-approved merge into main."
    };
  }

  if (branch !== PROTECTED_MAIN) {
    await appendAudit({
      event: "authoritative-reindex",
      timestamp: new Date().toISOString(),
      branch,
      source: "merged-main",
      status: "blocked",
      details:
        "Re-index blocked because the runtime is not executing from main."
    });

    return {
      executed: false,
      promoted: false,
      branch,
      source: "merged-main",
      candidate: null,
      auditPath: AUDIT_PATH,
      reason:
        "Authoritative re-index must execute from main."
    };
  }

  await appendAudit({
    event: "authoritative-reindex",
    timestamp: new Date().toISOString(),
    branch,
    source: "merged-main",
    status: "started",
    details:
      "Building candidate knowledge index from merged main."
  });

  try {
    const candidate = await buildCandidate();

    if (!candidate.valid) {
      await appendAudit({
        event: "authoritative-reindex",
        timestamp: new Date().toISOString(),
        branch,
        source: "merged-main",
        status: "failed",
        details:
          "Candidate validation failed: " +
          candidate.validation.findings.join(" | ")
      });

      return {
        executed: true,
        promoted: false,
        branch,
        source: "merged-main",
        candidate,
        auditPath: AUDIT_PATH,
        reason:
          "Candidate index failed validation. Existing authoritative index was preserved."
      };
    }

    await promoteCandidate();

    await appendAudit({
      event: "authoritative-reindex",
      timestamp: new Date().toISOString(),
      branch,
      source: "merged-main",
      status: "completed",
      details:
        "Candidate index passed validation and was promoted to authoritative content-index.json."
    });

    return {
      executed: true,
      promoted: true,
      branch,
      source: "merged-main",
      candidate,
      auditPath: AUDIT_PATH,
      reason:
        "Authoritative index successfully rebuilt and promoted."
    };
  } catch (error) {
    await appendAudit({
      event: "authoritative-reindex",
      timestamp: new Date().toISOString(),
      branch,
      source: "merged-main",
      status: "failed",
      details:
        error instanceof Error
          ? error.message
          : "Unknown re-index failure."
    });

    return {
      executed: true,
      promoted: false,
      branch,
      source: "merged-main",
      candidate: null,
      auditPath: AUDIT_PATH,
      reason:
        "Re-index execution failed. Existing authoritative index was preserved where possible."
    };
  }
}

export async function validateCurrentIndex(): Promise<ReindexValidation> {
  const current = await loadCurrentIndex();
  return validateCandidate(current);
}

/** Builds and validates a rebuilt index in memory, writing nothing. */
export async function previewReindex(): Promise<ReindexValidation> {
  const current = await loadCurrentIndex();
  const existingByPath = new Map(current.documents.map(document => [normalizePath(document.path).toLowerCase(), document]));
  const documents = await rebuildDocuments(current.documents, existingByPath);
  return validateCandidate({ ...current, documents });
}



