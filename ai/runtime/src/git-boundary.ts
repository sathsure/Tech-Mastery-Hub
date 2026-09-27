import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const PROTECTED_MAIN = "main";
const BRANCH_PATTERN = /^[a-z0-9]+(?:[._/-][a-z0-9]+)*$/;

export interface GitRepositoryState {
  repositoryRoot: string;
  currentBranch: string;
  isMain: boolean;
  isClean: boolean;
  hasOrigin: boolean;
}

export interface FeatureBranchPlan {
  allowed: boolean;
  branch: string;
  reason: string;
}

export interface ProposedChange {
  path: string;
  status: "added" | "modified";
}

export interface PullRequestPlan {
  allowed: boolean;
  branch: string;
  baseBranch: string;
  title: string;
  body: string;
  changes: ProposedChange[];
  requiresHumanApproval: true;
  mergeAllowedByAi: false;
}

export interface ReindexRequest {
  allowed: boolean;
  sourceBranch: string;
  sourceState: "merged-main";
  reason: string;
}

async function git(args: string[]): Promise<string> {
  const result = await execFileAsync("git", args, {
    cwd: process.cwd(),
    windowsHide: true
  });

  return result.stdout.trim();
}

export async function inspectGitRepository(): Promise<GitRepositoryState> {
  const repositoryRoot = await git(["rev-parse", "--show-toplevel"]);
  const currentBranch = await git(["branch", "--show-current"]);
  const status = await git(["status", "--porcelain"]);

  let hasOrigin = false;

  try {
    await git(["remote", "get-url", "origin"]);
    hasOrigin = true;
  } catch {
    hasOrigin = false;
  }

  return {
    repositoryRoot,
    currentBranch,
    isMain: currentBranch === PROTECTED_MAIN,
    isClean: status.length === 0,
    hasOrigin
  };
}

export function validateFeatureBranchName(
  branch: string
): FeatureBranchPlan {
  const normalized = branch.trim().toLowerCase();

  if (!normalized) {
    return {
      allowed: false,
      branch: normalized,
      reason: "Feature branch name is required."
    };
  }

  if (normalized === PROTECTED_MAIN) {
    return {
      allowed: false,
      branch: normalized,
      reason: "The protected main branch cannot be used as a feature branch."
    };
  }

  if (!BRANCH_PATTERN.test(normalized)) {
    return {
      allowed: false,
      branch: normalized,
      reason: "Feature branch name contains unsupported characters."
    };
  }

  return {
    allowed: true,
    branch: normalized,
    reason: "Feature branch name satisfies the local Git boundary."
  };
}

export async function validateFeatureBranchCreation(
  branch: string
): Promise<FeatureBranchPlan> {
  const plan = validateFeatureBranchName(branch);

  if (!plan.allowed) {
    return plan;
  }

  try {
    await git(["rev-parse", "--verify", "refs/heads/" + plan.branch]);

    return {
      allowed: false,
      branch: plan.branch,
      reason: "Feature branch already exists."
    };
  } catch {
    return plan;
  }
}

export async function createFeatureBranch(
  branch: string
): Promise<FeatureBranchPlan> {
  const plan = await validateFeatureBranchCreation(branch);

  if (!plan.allowed) {
    return plan;
  }

  const state = await inspectGitRepository();

  if (state.isMain && !state.isClean) {
    return {
      allowed: false,
      branch: plan.branch,
      reason:
        "Cannot create a feature branch from protected main with uncommitted changes."
    };
  }

  await git(["switch", "-c", plan.branch]);

  return {
    allowed: true,
    branch: plan.branch,
    reason:
      "Feature branch created. AI may validate and prepare a PR but cannot merge."
  };
}

export function createPullRequestPlan(
  branch: string,
  changes: ProposedChange[],
  title: string,
  body: string
): PullRequestPlan {
  const branchPlan = validateFeatureBranchName(branch);

  return {
    allowed: branchPlan.allowed,
    branch: branchPlan.branch,
    baseBranch: PROTECTED_MAIN,
    title: title.trim(),
    body: body.trim(),
    changes,
    requiresHumanApproval: true,
    mergeAllowedByAi: false
  };
}

export async function createReindexRequest(
  mergedBranch: string,
  mergeConfirmedByHuman: boolean
): Promise<ReindexRequest> {
  const state = await inspectGitRepository();

  if (mergedBranch !== PROTECTED_MAIN) {
    return {
      allowed: false,
      sourceBranch: mergedBranch,
      sourceState: "merged-main",
      reason: "Re-indexing is permitted only from merged main."
    };
  }

  if (!mergeConfirmedByHuman) {
    return {
      allowed: false,
      sourceBranch: mergedBranch,
      sourceState: "merged-main",
      reason:
        "Authoritative re-indexing requires externally confirmed human-approved merge."
    };
  }

  if (state.currentBranch !== PROTECTED_MAIN) {
    return {
      allowed: false,
      sourceBranch: mergedBranch,
      sourceState: "merged-main",
      reason: "The local repository is not currently on main."
    };
  }

  return {
    allowed: true,
    sourceBranch: mergedBranch,
    sourceState: "merged-main",
    reason: "Merged main is eligible for authoritative re-indexing."
  };
}

export const GIT_BOUNDARY_RULES = {
  protectedBranch: PROTECTED_MAIN,
  aiMayMerge: false,
  aiMaySelfApprove: false,
  aiMayBypassProtection: false,
  reindexSource: "merged-main" as const
};
