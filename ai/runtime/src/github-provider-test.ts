import {
  inspectGitHubConfiguration,
  createGitHubPullRequest,
  verifyGitHubHumanApproval,
  verifyGitHubMerge,
  createAuthoritativeReindexTrigger,
  GITHUB_GOVERNANCE
} from "./github-provider.js";

const configuration = await inspectGitHubConfiguration();

if (configuration.repository && !configuration.repository.owner) {
  throw new Error("GitHub repository owner is missing.");
}

if (configuration.repository && !configuration.repository.name) {
  throw new Error("GitHub repository name is missing.");
}

const requestTitle = "Governed contribution test";
const requestBody =
  "Automated contract test. Do not merge. Human approval is required.";

if (requestTitle.length === 0 || requestBody.length === 0) {
  throw new Error("PR contract test data is invalid.");
}

if (GITHUB_GOVERNANCE.aiMayApprovePullRequest) {
  throw new Error("AI approval must remain prohibited.");
}

if (GITHUB_GOVERNANCE.aiMayMergePullRequest) {
  throw new Error("AI merge must remain prohibited.");
}

if (GITHUB_GOVERNANCE.aiMayBypassBranchProtection) {
  throw new Error("Branch protection bypass must remain prohibited.");
}

if (GITHUB_GOVERNANCE.aiMayModifyPermissions) {
  throw new Error("Permission modification must remain prohibited.");
}

if (GITHUB_GOVERNANCE.aiMayAccessSecrets) {
  throw new Error("Direct secret access must remain prohibited.");
}

const unapproved = {
  verified: false,
  merged: true,
  baseBranch: "main",
  humanApprovalConfirmed: false,
  reason: "Test fixture: approval missing."
};

const blocked = createAuthoritativeReindexTrigger(unapproved);

if (blocked.allowed) {
  throw new Error(
    "Re-indexing was incorrectly allowed without human approval."
  );
}

const approvedUnmerged = {
  verified: false,
  merged: false,
  baseBranch: "main",
  humanApprovalConfirmed: true,
  reason: "Test fixture: approved but not merged."
};

const blockedBeforeMerge =
  createAuthoritativeReindexTrigger(approvedUnmerged);

if (blockedBeforeMerge.allowed) {
  throw new Error(
    "Re-indexing was incorrectly allowed before merge."
  );
}

const confirmed = {
  verified: true,
  merged: true,
  baseBranch: "main",
  humanApprovalConfirmed: true,
  reason: "Test fixture: approved merge confirmed."
};

const eligible = createAuthoritativeReindexTrigger(confirmed);

if (!eligible.allowed) {
  throw new Error(
    "Confirmed approved merge into main was rejected."
  );
}

process.stdout.write("GITHUB PROVIDER CONTRACT TEST PASS\n");
