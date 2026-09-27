import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const PROTECTED_MAIN = "main";
const GITHUB_API = "https://api.github.com";

export type PullRequestState =
  | "draft"
  | "open"
  | "approved"
  | "changes-requested"
  | "merged"
  | "closed";

export interface GitHubRepository {
  owner: string;
  name: string;
  remoteUrl: string;
}

export interface GitHubPullRequest {
  number: number;
  url: string;
  state: PullRequestState;
  headBranch: string;
  baseBranch: string;
  merged: boolean;
}

export interface GitHubApproval {
  verified: boolean;
  approved: boolean;
  authorizedReviewer: boolean;
  reason: string;
}

export interface GitHubMergeVerification {
  verified: boolean;
  merged: boolean;
  baseBranch: string;
  humanApprovalConfirmed: boolean;
  reason: string;
}

export interface ReindexTrigger {
  allowed: boolean;
  branch: string;
  source: "merged-main";
  reason: string;
}

export interface GitHubProviderConfiguration {
  configured: boolean;
  remoteName: string;
  repository: GitHubRepository | null;
  reason: string;
}

interface GitHubApiResponse {
  number: number;
  html_url: string;
  state: string;
  draft?: boolean;
  merged?: boolean;
  head: {
    ref: string;
  };
  base: {
    ref: string;
  };
}

interface GitHubReview {
  user?: {
    login?: string;
  };
  state?: string;
}

async function git(args: string[]): Promise<string> {
  const result = await execFileAsync("git", args, {
    cwd: process.cwd(),
    windowsHide: true
  });

  return result.stdout.trim();
}

async function getRemoteUrl(remoteName = "origin"): Promise<string> {
  return git(["remote", "get-url", remoteName]);
}

function parseGitHubRemote(remoteUrl: string): GitHubRepository | null {
  const normalized = remoteUrl
    .replace(/^git@github\.com:/, "https://github.com/")
    .replace(/\.git$/, "")
    .replace(/\/+$/, "");

  const match = normalized.match(
    /^https:\/\/github\.com\/([^/]+)\/([^/]+)$/
  );

  if (!match) {
    return null;
  }

  return {
    owner: match[1],
    name: match[2],
    remoteUrl
  };
}

export async function inspectGitHubConfiguration(
  remoteName = "origin"
): Promise<GitHubProviderConfiguration> {
  let remoteUrl = "";

  try {
    remoteUrl = await getRemoteUrl(remoteName);
  } catch {
    return {
      configured: false,
      remoteName,
      repository: null,
      reason: `Git remote '${remoteName}' is not configured.`
    };
  }

  const repository = parseGitHubRemote(remoteUrl);

  if (!repository) {
    return {
      configured: false,
      remoteName,
      repository: null,
      reason: "The configured Git remote is not a supported GitHub repository URL."
    };
  }

  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return {
      configured: false,
      remoteName,
      repository,
      reason:
        "GitHub repository detected, but GITHUB_TOKEN is not configured. No credential is stored by the runtime."
    };
  }

  return {
    configured: true,
    remoteName,
    repository,
    reason: "GitHub provider configuration is available."
  };
}

async function githubRequest<T>(
  path: string,
  method: "GET" | "POST" = "GET",
  body?: unknown
): Promise<T> {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error(
      "GITHUB_TOKEN is required for GitHub provider operations."
    );
  }

  const response = await fetch(`${GITHUB_API}${path}`, {
    method,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json"
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(
      `GitHub API request failed with HTTP ${response.status}.`
    );
  }

  return (await response.json()) as T;
}

function mapPullRequestState(
  pullRequest: GitHubApiResponse
): PullRequestState {
  if (pullRequest.merged) {
    return "merged";
  }

  if (pullRequest.state === "closed") {
    return "closed";
  }

  if (pullRequest.draft) {
    return "draft";
  }

  return "open";
}

export async function createGitHubPullRequest(
  title: string,
  body: string,
  headBranch: string,
  baseBranch = PROTECTED_MAIN,
  remoteName = "origin"
): Promise<GitHubPullRequest> {
  if (baseBranch !== PROTECTED_MAIN) {
    throw new Error(
      "GitHub pull requests must target protected main."
    );
  }

  if (!headBranch || headBranch === PROTECTED_MAIN) {
    throw new Error(
      "A non-main feature branch is required for pull request creation."
    );
  }

  if (!title.trim() || !body.trim()) {
    throw new Error(
      "Pull request title and body are required."
    );
  }

  const configuration = await inspectGitHubConfiguration(remoteName);

  if (!configuration.configured || !configuration.repository) {
    throw new Error(configuration.reason);
  }

  const repository = configuration.repository;

  const created = await githubRequest<GitHubApiResponse>(
    `/repos/${encodeURIComponent(repository.owner)}/${encodeURIComponent(repository.name)}/pulls`,
    "POST",
    {
      title: title.trim(),
      body: body.trim(),
      head: headBranch,
      base: baseBranch,
      draft: false
    }
  );

  return {
    number: created.number,
    url: created.html_url,
    state: mapPullRequestState(created),
    headBranch: created.head.ref,
    baseBranch: created.base.ref,
    merged: Boolean(created.merged)
  };
}

export async function getGitHubPullRequest(
  pullRequestNumber: number,
  remoteName = "origin"
): Promise<GitHubPullRequest> {
  const configuration = await inspectGitHubConfiguration(remoteName);

  if (!configuration.configured || !configuration.repository) {
    throw new Error(configuration.reason);
  }

  const repository = configuration.repository;

  const pullRequest = await githubRequest<GitHubApiResponse>(
    `/repos/${encodeURIComponent(repository.owner)}/${encodeURIComponent(repository.name)}/pulls/${pullRequestNumber}`
  );

  return {
    number: pullRequest.number,
    url: pullRequest.html_url,
    state: mapPullRequestState(pullRequest),
    headBranch: pullRequest.head.ref,
    baseBranch: pullRequest.base.ref,
    merged: Boolean(pullRequest.merged)
  };
}

export async function verifyGitHubHumanApproval(
  pullRequestNumber: number,
  authorizedReviewer: string,
  remoteName = "origin"
): Promise<GitHubApproval> {
  const configuration = await inspectGitHubConfiguration(remoteName);

  if (!configuration.configured || !configuration.repository) {
    return {
      verified: false,
      approved: false,
      authorizedReviewer: false,
      reason: configuration.reason
    };
  }

  const repository = configuration.repository;

  const reviews = await githubRequest<GitHubReview[]>(
    `/repos/${encodeURIComponent(repository.owner)}/${encodeURIComponent(repository.name)}/pulls/${pullRequestNumber}/reviews`
  );

  const matchingApproval = reviews.some(
    (review) =>
      review.state?.toUpperCase() === "APPROVED" &&
      review.user?.login === authorizedReviewer
  );

  if (!matchingApproval) {
    return {
      verified: false,
      approved: false,
      authorizedReviewer: false,
      reason:
        "No externally confirmed approval from the configured authorized reviewer was found."
    };
  }

  return {
    verified: true,
    approved: true,
    authorizedReviewer: true,
    reason:
      "GitHub confirms approval from the configured authorized human reviewer."
  };
}

export async function verifyGitHubMerge(
  pullRequestNumber: number,
  authorizedReviewer: string,
  remoteName = "origin"
): Promise<GitHubMergeVerification> {
  const pullRequest = await getGitHubPullRequest(
    pullRequestNumber,
    remoteName
  );

  if (pullRequest.baseBranch !== PROTECTED_MAIN) {
    return {
      verified: false,
      merged: false,
      baseBranch: pullRequest.baseBranch,
      humanApprovalConfirmed: false,
      reason:
        "Only a pull request merged into main can become authoritative."
    };
  }

  const approval = await verifyGitHubHumanApproval(
    pullRequestNumber,
    authorizedReviewer,
    remoteName
  );

  if (!approval.verified) {
    return {
      verified: false,
      merged: false,
      baseBranch: pullRequest.baseBranch,
      humanApprovalConfirmed: false,
      reason: approval.reason
    };
  }

  if (!pullRequest.merged) {
    return {
      verified: false,
      merged: false,
      baseBranch: pullRequest.baseBranch,
      humanApprovalConfirmed: true,
      reason:
        "The pull request has human approval but has not been merged into main."
    };
  }

  return {
    verified: true,
    merged: true,
    baseBranch: pullRequest.baseBranch,
    humanApprovalConfirmed: true,
    reason:
      "GitHub confirms an approved pull request was merged into main."
  };
}

export function createAuthoritativeReindexTrigger(
  merge: GitHubMergeVerification
): ReindexTrigger {
  if (
    !merge.verified ||
    !merge.merged ||
    !merge.humanApprovalConfirmed ||
    merge.baseBranch !== PROTECTED_MAIN
  ) {
    return {
      allowed: false,
      branch: merge.baseBranch,
      source: "merged-main",
      reason:
        "Authoritative re-indexing is blocked until GitHub confirms an approved merge into main."
    };
  }

  return {
    allowed: true,
    branch: PROTECTED_MAIN,
    source: "merged-main",
    reason:
      "GitHub-confirmed approved merge into main is eligible for authoritative re-indexing."
  };
}

export const GITHUB_GOVERNANCE = {
  protectedBaseBranch: PROTECTED_MAIN,
  aiMayCreatePullRequest: true,
  aiMayApprovePullRequest: false,
  aiMayMergePullRequest: false,
  aiMayBypassBranchProtection: false,
  aiMayModifyPermissions: false,
  aiMayAccessSecrets: false,
  authoritativeReindexRequiresConfirmedMerge: true
} as const;
