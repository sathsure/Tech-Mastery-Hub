import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const PROTECTED_MAIN = "main";

export interface RemoteRepositoryState {
  remoteName: string;
  remoteUrl: string;
  reachable: boolean;
  branch: string;
  branchExistsRemotely: boolean;
}

export interface PushResult {
  allowed: boolean;
  branch: string;
  remoteName: string;
  pushed: boolean;
  reason: string;
}

export interface PullRequestRequest {
  ready: boolean;
  provider: "git";
  remoteName: string;
  branch: string;
  baseBranch: string;
  title: string;
  body: string;
  requiresHumanApproval: true;
  aiMayApprove: false;
  aiMayMerge: false;
}

export type PullRequestApprovalState =
  | "unknown"
  | "pending"
  | "approved"
  | "changes-requested";

export interface PullRequestApprovalVerification {
  verified: boolean;
  state: PullRequestApprovalState;
  authorizedHumanApproval: boolean;
  reason: string;
}

export interface MergeVerification {
  verified: boolean;
  branch: string;
  baseBranch: string;
  merged: boolean;
  humanApprovalConfirmed: boolean;
  reason: string;
}

export interface RemoteReindexEligibility {
  eligible: boolean;
  baseBranch: string;
  merged: boolean;
  humanApprovalConfirmed: boolean;
  reason: string;
}

async function git(args: string[]): Promise<string> {
  const result = await execFileAsync("git", args, {
    cwd: process.cwd(),
    windowsHide: true
  });

  return result.stdout.trim();
}

async function gitSucceeds(args: string[]): Promise<boolean> {
  try {
    await git(args);
    return true;
  } catch {
    return false;
  }
}

export async function inspectRemoteRepository(
  remoteName = "origin"
): Promise<RemoteRepositoryState> {
  const branch = await git(["branch", "--show-current"]);

  let remoteUrl = "";

  try {
    remoteUrl = await git(["remote", "get-url", remoteName]);
  } catch {
    return {
      remoteName,
      remoteUrl,
      reachable: false,
      branch,
      branchExistsRemotely: false
    };
  }

  const reachable = await gitSucceeds([
    "ls-remote",
    "--exit-code",
    remoteName,
    "HEAD"
  ]);

  let branchExistsRemotely = false;

  if (branch) {
    branchExistsRemotely = await gitSucceeds([
      "ls-remote",
      "--exit-code",
      "--heads",
      remoteName,
      branch
    ]);
  }

  return {
    remoteName,
    remoteUrl,
    reachable,
    branch,
    branchExistsRemotely
  };
}

export async function pushFeatureBranch(
  remoteName = "origin"
): Promise<PushResult> {
  const branch = await git(["branch", "--show-current"]);

  if (!branch) {
    return {
      allowed: false,
      branch,
      remoteName,
      pushed: false,
      reason: "A feature branch is required before pushing."
    };
  }

  if (branch === PROTECTED_MAIN) {
    return {
      allowed: false,
      branch,
      remoteName,
      pushed: false,
      reason: "The protected main branch cannot be pushed by the contribution execution layer."
    };
  }

  const remote = await inspectRemoteRepository(remoteName);

  if (!remote.remoteUrl) {
    return {
      allowed: false,
      branch,
      remoteName,
      pushed: false,
      reason: `Remote '${remoteName}' is not configured.`
    };
  }

  if (!remote.reachable) {
    return {
      allowed: false,
      branch,
      remoteName,
      pushed: false,
      reason: `Remote '${remoteName}' is not reachable.`
    };
  }

  await git([
    "push",
    "--set-upstream",
    remoteName,
    branch
  ]);

  return {
    allowed: true,
    branch,
    remoteName,
    pushed: true,
    reason:
      "Feature branch pushed. Pull-request creation and approval remain governed operations."
  };
}

export function prepareRemotePullRequest(
  remoteName: string,
  branch: string,
  title: string,
  body: string
): PullRequestRequest {
  const normalizedBranch = branch.trim();

  const ready =
    normalizedBranch.length > 0 &&
    normalizedBranch !== PROTECTED_MAIN &&
    title.trim().length > 0 &&
    body.trim().length > 0;

  return {
    ready,
    provider: "git",
    remoteName,
    branch: normalizedBranch,
    baseBranch: PROTECTED_MAIN,
    title: title.trim(),
    body: body.trim(),
    requiresHumanApproval: true,
    aiMayApprove: false,
    aiMayMerge: false
  };
}

export function verifyHumanApproval(
  approvalState: PullRequestApprovalState,
  approvalActorIsAuthorizedHuman: boolean
): PullRequestApprovalVerification {
  if (approvalState !== "approved") {
    return {
      verified: false,
      state: approvalState,
      authorizedHumanApproval: false,
      reason:
        "Pull request does not have an approved state."
    };
  }

  if (!approvalActorIsAuthorizedHuman) {
    return {
      verified: false,
      state: approvalState,
      authorizedHumanApproval: false,
      reason:
        "Approval is not verified as coming from the externally configured authorized human."
    };
  }

  return {
    verified: true,
    state: approvalState,
    authorizedHumanApproval: true,
    reason:
      "Approval is externally confirmed as coming from the authorized human."
  };
}

export function verifyMerge(
  branch: string,
  baseBranch: string,
  mergeConfirmed: boolean,
  humanApprovalConfirmed: boolean
): MergeVerification {
  if (baseBranch !== PROTECTED_MAIN) {
    return {
      verified: false,
      branch,
      baseBranch,
      merged: false,
      humanApprovalConfirmed,
      reason: "Only merge into protected main can become authoritative."
    };
  }

  if (!humanApprovalConfirmed) {
    return {
      verified: false,
      branch,
      baseBranch,
      merged: false,
      humanApprovalConfirmed,
      reason:
        "Merge cannot become authoritative without externally confirmed human approval."
    };
  }

  if (!mergeConfirmed) {
    return {
      verified: false,
      branch,
      baseBranch,
      merged: false,
      humanApprovalConfirmed,
      reason: "Merge has not been externally confirmed."
    };
  }

  return {
    verified: true,
    branch,
    baseBranch,
    merged: true,
    humanApprovalConfirmed,
    reason:
      "Merge into main is externally confirmed and may enter the authoritative re-index boundary."
  };
}

export function createRemoteReindexEligibility(
  merge: MergeVerification
): RemoteReindexEligibility {
  if (!merge.verified || !merge.merged || !merge.humanApprovalConfirmed) {
    return {
      eligible: false,
      baseBranch: merge.baseBranch,
      merged: merge.merged,
      humanApprovalConfirmed: merge.humanApprovalConfirmed,
      reason:
        "Authoritative re-indexing is blocked until an externally confirmed human-approved merge into main exists."
    };
  }

  return {
    eligible: true,
    baseBranch: merge.baseBranch,
    merged: true,
    humanApprovalConfirmed: true,
    reason:
      "Authoritative re-indexing may proceed from the confirmed merged main state."
  };
}

export const REMOTE_GOVERNANCE_RULES = {
  protectedBaseBranch: PROTECTED_MAIN,
  aiMayPushFeatureBranch: true,
  aiMayCreatePullRequest: true,
  aiMayApprovePullRequest: false,
  aiMayMergePullRequest: false,
  aiMayBypassBranchProtection: false,
  authoritativeReindexRequiresMergedMain: true,
  authoritativeReindexRequiresHumanApproval: true
} as const;
