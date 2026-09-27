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
  const match = path.match(
    /^knowledge\/concepts\/(.+)\/README\.md$/i
  );

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

  return discovered.sort();
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

async function buildCandidate(): Promise<ReindexBuildResult> {
  const current = await loadCurrentIndex();

  const existingByPath = new Map<string, IndexedDocument>();

  for (const document of current.documents) {
    existingByPath.set(
      normalizePath(document.path).toLowerCase(),
      document
    );
  }



  const documents: IndexedDocument[] = [];


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

async function validateCandidate(
  candidate: KnowledgeIndex
): Promise<ReindexValidation> {
  const findings: string[] = [];
  const paths = new Set<string>();
  const canonicalConcepts = new Set<string>();

  for (const document of candidate.documents) {
    const indexedCanonical =
      document.canonical_concept;

    if (indexedCanonical) {
      canonicalConcepts.add(
        String(indexedCanonical).toLowerCase()
      );
    }

    const pathCanonical =
      canonicalFromPath(document.path);

    if (pathCanonical) {
      canonicalConcepts.add(
        pathCanonical.toLowerCase()
      );
    }
  }

  for (const document of candidate.documents) {
    const normalized =
      normalizePath(document.path).toLowerCase();

    if (paths.has(normalized)) {
      findings.push(
        "Duplicate indexed path: " +
          document.path
      );
    }

    paths.add(normalized);

    if (isExcluded(document.path)) {
      findings.push(
        "Excluded path appeared in candidate index: " +
          document.path
      );
    }

    const absolute = resolve(
      REPOSITORY_ROOT,
      normalizePath(document.path)
    );

    try {
      const fileStat = await stat(absolute);

      if (!fileStat.isFile()) {
        findings.push(
          "Indexed path is not a file: " +
            document.path
        );
      }
    } catch {
      findings.push(
        "Indexed file does not exist: " +
          document.path
      );
    }

    const canonical =
      canonicalFromPath(document.path);

    if (
      canonical &&
      String(
        document.canonical_concept ?? ""
      ).toLowerCase() !== canonical
    ) {
      findings.push(
        "Canonical ownership mismatch: " +
          document.path +
          " expected " +
          canonical
      );
    }

    if (!Array.isArray(document.related_concepts)) {
      findings.push(
        "related_concepts must be an array: " +
          document.path
      );
      continue;
    }

    for (const relationship of document.related_concepts) {
      const normalizedRelationship =
        String(relationship).toLowerCase();

      if (
        !canonicalConcepts.has(
          normalizedRelationship
        )
      ) {
        findings.push(
          "Invalid related concept '" +
            relationship +
            "' for " +
            document.path
        );
      }
    }
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
    canonicalConceptCount: canonicalConcepts.size
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



