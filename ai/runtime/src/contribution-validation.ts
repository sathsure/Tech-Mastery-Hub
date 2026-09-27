import { loadKnowledgeIndex } from "./knowledge-index.js";
import type { ContributionFile } from "./contribution-contracts.js";
import { readRepositoryFile } from "./repository.js";

export interface ContentValidationResult {
  valid: boolean;
  findings: string[];
  validatedFiles: number;
}

export interface OwnershipResult {
  valid: boolean;
  findings: string[];
  owners: Record<string, string | null>;
}

export interface DuplicateResult {
  valid: boolean;
  findings: string[];
  duplicatePaths: string[];
}

export interface RelationshipResult {
  valid: boolean;
  findings: string[];
  relationships: Array<{ path: string; concept: string }>;
}

export interface ImpactResult {
  valid: boolean;
  findings: string[];
  affectedPaths: string[];
  indexImpact: boolean;
}

const pathOf = (value: string): string =>
  value.replace(/\\/g, "/").replace(/^\.\/+/, "").trim();

const normalizeContent = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[`*_#>\[\]{}:;,.!?"'()\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const canonicalFromPath = (path: string): string | null => {
  const match = path.match(/^knowledge\/concepts\/([^/]+)\/README\.md$/i);
  return match ? match[1].toLowerCase() : null;
};

export function validateContributionContent(
  files: ContributionFile[]
): ContentValidationResult {
  const findings: string[] = [];
  const seen = new Set<string>();

  for (const file of files) {
    const path = pathOf(file.path);

    if (!path) {
      findings.push("Contribution file path is empty.");
    }

    if (
      path.startsWith("../") ||
      path.includes("/../") ||
      path.startsWith("/") ||
      /^[A-Za-z]:/.test(path)
    ) {
      findings.push("Path is outside repository boundary: " + file.path);
    }

    if (seen.has(path)) {
      findings.push("Duplicate path in contribution request: " + path);
    }

    seen.add(path);

    if (!file.content.trim()) {
      findings.push("Contribution file is empty: " + path);
    }

    if (file.content.length > 1000000) {
      findings.push("Contribution file exceeds 1 MB: " + path);
    }

    if (
      path.toLowerCase().endsWith(".md") &&
      !/^\s*#\s+\S+/m.test(file.content)
    ) {
      findings.push(
        "Markdown contribution lacks a top-level heading: " + path
      );
    }
  }

  return {
    valid: findings.length === 0,
    findings,
    validatedFiles: files.length
  };
}

export async function analyzeCanonicalOwnership(
  files: ContributionFile[]
): Promise<OwnershipResult> {
  const index = await loadKnowledgeIndex();
  const findings: string[] = [];
  const owners: Record<string, string | null> = {};
  const documents = (index as any).documents ?? [];

  for (const file of files) {
    const path = pathOf(file.path);
    const canonical = canonicalFromPath(path);

    if (canonical) {
      const indexed = documents.find(
        (entry: any) =>
          String(entry.path ?? "").toLowerCase() === path.toLowerCase()
      );

      if (
        indexed &&
        indexed.canonical_concept &&
        String(indexed.canonical_concept).toLowerCase() !== canonical
      ) {
        findings.push(
          "Canonical ownership conflict for " +
            path +
            ": indexed owner is " +
            String(indexed.canonical_concept)
        );
      }

      owners[path] = canonical;
    }

    if (!canonical) {
      const indexed = documents.find(
        (entry: any) =>
          String(entry.path ?? "").toLowerCase() === path.toLowerCase()
      );
      owners[path] = indexed?.canonical_concept
        ? String(indexed.canonical_concept)
        : null;
    }
  }

  return {
    valid: findings.length === 0,
    findings,
    owners
  };
}

export async function detectContributionDuplicates(
  files: ContributionFile[]
): Promise<DuplicateResult> {
  const index = await loadKnowledgeIndex();
  const documents = (index as any).documents ?? [];
  const findings: string[] = [];
  const duplicatePaths: string[] = [];

  for (const file of files) {
    const proposed = normalizeContent(file.content);

    if (!proposed) {
      continue;
    }

    for (const entry of documents) {
      const indexedPath = String(entry.path ?? "");

      if (!indexedPath) {
        continue;
      }

      if (indexedPath.toLowerCase() === pathOf(file.path).toLowerCase()) {
        continue;
      }

      try {
        const existing = await readRepositoryFile(indexedPath);
        if (normalizeContent(existing) === proposed) {
          duplicatePaths.push(indexedPath);
          findings.push(
            "Contribution content duplicates existing repository file: " +
              indexedPath
          );
          break;
        }
      } catch {
        continue;
      }
    }
  }

  return {
    valid: findings.length === 0,
    findings,
    duplicatePaths
  };
}

export async function analyzeContributionRelationships(
  files: ContributionFile[]
): Promise<RelationshipResult> {
  const index = await loadKnowledgeIndex();
  const documents = (index as any).documents ?? [];
  const concepts = new Set<string>();

  for (const entry of documents) {
    const concept =
      entry.canonical_concept ??
      entry.canonicalConcept ??
      entry.concept;

    if (concept) {
      concepts.add(String(concept).toLowerCase());
    }
  }

  const relationships: Array<{ path: string; concept: string }> = [];

  for (const file of files) {
    const content = normalizeContent(file.content);

    for (const concept of concepts) {
      if (content.includes(concept)) {
        relationships.push({
          path: pathOf(file.path),
          concept
        });
      }
    }
  }

  return {
    valid: true,
    findings: [],
    relationships
  };
}

export function analyzeContributionImpact(
  files: ContributionFile[],
  relationships: RelationshipResult
): ImpactResult {
  const affectedPaths = files.map((file) => pathOf(file.path));
  const findings: string[] = [];
  const indexImpact = affectedPaths.some(
    (path) =>
      path.toLowerCase() === "ai/knowledge-index/content-index.json"
  );

  if (indexImpact) {
    findings.push(
      "Contribution directly targets the authoritative knowledge index; re-indexing must occur only after merge."
    );
  }

  if (relationships.relationships.length > 0) {
    findings.push(
      "Detected " +
        relationships.relationships.length +
        " repository concept relationship(s)."
    );
  }

  return {
    valid: true,
    findings,
    affectedPaths,
    indexImpact
  };
}

