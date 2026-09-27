import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const PROTECTED_MAIN = "main";

export interface StagedChange {
  path: string;
  status: string;
}

export interface StageResult {
  allowed: boolean;
  branch: string;
  staged: StagedChange[];
  reason: string;
}

export interface ValidationCommandResult {
  command: string;
  passed: boolean;
  output: string;
}

export interface PrePrValidationResult {
  passed: boolean;
  results: ValidationCommandResult[];
  reason: string;
}

export interface PreparedPullRequest {
  ready: boolean;
  branch: string;
  baseBranch: string;
  title: string;
  body: string;
  changes: StagedChange[];
  validation: PrePrValidationResult;
  requiresHumanApproval: true;
  mergeAllowedByAi: false;
}

export interface AuditEvent {
  event:
    | "contribution-proposed"
    | "changes-staged"
    | "validation-completed"
    | "pull-request-prepared"
    | "human-approval-required"
    | "merge-prohibited"
    | "reindex-eligible";
  timestamp: string;
  branch: string;
  details: string;
}

async function git(args: string[]): Promise<string> {
  const result = await execFileAsync("git", args, {
    cwd: process.cwd(),
    windowsHide: true
  });

  return result.stdout.trim();
}

async function runNpmScript(script: string): Promise<ValidationCommandResult> {
  const command = `npm.cmd run ${script}`;

  try {
    const result = await execFileAsync(
      "npm.cmd",
      ["run", script],
      {
        cwd: process.cwd(),
        windowsHide: true
      }
    );

    return {
      command,
      passed: true,
      output: `${result.stdout}${result.stderr}`.trim()
    };
  } catch (error) {
    const failure = error as {
      stdout?: string;
      stderr?: string;
      message?: string;
    };

    return {
      command,
      passed: false,
      output:
        `${failure.stdout ?? ""}${failure.stderr ?? ""}${failure.message ?? ""}`.trim()
    };
  }
}

function normalizePath(path: string): string {
  return path.replace(/\\/g, "/").replace(/^\/+/, "");
}

function isSafeRelativePath(path: string): boolean {
  const normalized = normalizePath(path);

  if (!normalized || normalized.startsWith("../") || normalized.includes("/../")) {
    return false;
  }

  if (/^[A-Za-z]:\//.test(normalized)) {
    return false;
  }

  return true;
}

export async function stageProposedChanges(
  paths: string[]
): Promise<StageResult> {
  const branch = await git(["branch", "--show-current"]);

  if (branch === PROTECTED_MAIN) {
    return {
      allowed: false,
      branch,
      staged: [],
      reason: "Proposed changes cannot be staged while the protected main branch is checked out."
    };
  }

  if (!branch) {
    return {
      allowed: false,
      branch,
      staged: [],
      reason: "A named feature branch is required before proposed changes can be staged."
    };
  }

  const normalizedPaths = [...new Set(paths.map(normalizePath))];

  if (normalizedPaths.length === 0) {
    return {
      allowed: false,
      branch,
      staged: [],
      reason: "At least one proposed change path is required."
    };
  }

  const unsafePath = normalizedPaths.find((path) => !isSafeRelativePath(path));

  if (unsafePath) {
    return {
      allowed: false,
      branch,
      staged: [],
      reason: `Unsafe repository path rejected: ${unsafePath}`
    };
  }

  await git(["add", "--", ...normalizedPaths]);

  const stagedStatus = await git(["diff", "--cached", "--name-status"]);

  const staged = stagedStatus
    ? stagedStatus
        .split(/\r?\n/)
        .filter(Boolean)
        .map((line) => {
          const firstTab = line.indexOf("\t");

          if (firstTab < 0) {
            return {
              path: line,
              status: "unknown"
            };
          }

          return {
            status: line.slice(0, firstTab),
            path: line.slice(firstTab + 1)
          };
        })
    : [];

  return {
    allowed: true,
    branch,
    staged,
    reason: "Proposed changes were staged on the feature branch."
  };
}

export async function inspectStagedChanges(): Promise<StagedChange[]> {
  const stagedStatus = await git(["diff", "--cached", "--name-status"]);

  if (!stagedStatus) {
    return [];
  }

  return stagedStatus
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const firstTab = line.indexOf("\t");

      if (firstTab < 0) {
        return {
          path: line,
          status: "unknown"
        };
      }

      return {
        status: line.slice(0, firstTab),
        path: line.slice(firstTab + 1)
      };
    });
}

export async function runPrePrValidation(): Promise<PrePrValidationResult> {
  const branch = await git(["branch", "--show-current"]);

  if (!branch || branch === PROTECTED_MAIN) {
    return {
      passed: false,
      results: [],
      reason: "Pre-PR validation requires a feature branch."
    };
  }

  const staged = await inspectStagedChanges();

  if (staged.length === 0) {
    return {
      passed: false,
      results: [],
      reason: "Pre-PR validation requires staged proposed changes."
    };
  }

  const scripts = [
    "check",
    "build",
    "contribution-check",
    "contribution-pipeline-check",
    "git-boundary-check",
    "response-check",
    "api-check"
  ];

  const results: ValidationCommandResult[] = [];

  for (const script of scripts) {
    const result = await runNpmScript(script);
    results.push(result);

    if (!result.passed) {
      return {
        passed: false,
        results,
        reason: `Pre-PR validation failed at: npm.cmd run ${script}`
      };
    }
  }

  return {
    passed: true,
    results,
    reason: "All required pre-PR validation gates passed."
  };
}

export async function preparePullRequest(
  title: string,
  body: string
): Promise<PreparedPullRequest> {
  const branch = await git(["branch", "--show-current"]);

  if (!branch || branch === PROTECTED_MAIN) {
    return {
      ready: false,
      branch,
      baseBranch: PROTECTED_MAIN,
      title: title.trim(),
      body: body.trim(),
      changes: [],
      validation: {
        passed: false,
        results: [],
        reason: "Pull requests may only be prepared from a feature branch."
      },
      requiresHumanApproval: true,
      mergeAllowedByAi: false
    };
  }

  const changes = await inspectStagedChanges();

  if (changes.length === 0) {
    return {
      ready: false,
      branch,
      baseBranch: PROTECTED_MAIN,
      title: title.trim(),
      body: body.trim(),
      changes,
      validation: {
        passed: false,
        results: [],
        reason: "A pull request requires staged proposed changes."
      },
      requiresHumanApproval: true,
      mergeAllowedByAi: false
    };
  }

  const validation = await runPrePrValidation();

  return {
    ready: validation.passed,
    branch,
    baseBranch: PROTECTED_MAIN,
    title: title.trim(),
    body: body.trim(),
    changes,
    validation,
    requiresHumanApproval: true,
    mergeAllowedByAi: false
  };
}

export function createContributionAuditEvent(
  event: AuditEvent["event"],
  branch: string,
  details: string
): AuditEvent {
  return {
    event,
    timestamp: new Date().toISOString(),
    branch,
    details
  };
}

export function createHumanApprovalBoundary(branch: string): AuditEvent {
  return createContributionAuditEvent(
    "human-approval-required",
    branch,
    "AI validation is not human approval. An authorized human must approve the pull request externally."
  );
}

export function createMergeProhibition(branch: string): AuditEvent {
  return createContributionAuditEvent(
    "merge-prohibited",
    branch,
    "AI is prohibited from merging its own pull request or bypassing repository protection."
  );
}

export function createReindexEligibilityEvent(branch: string): AuditEvent {
  return createContributionAuditEvent(
    "reindex-eligible",
    branch,
    "Authoritative re-indexing is eligible only after an externally confirmed merge into main."
  );
}
