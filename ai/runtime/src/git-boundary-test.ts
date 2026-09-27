import {
  validateFeatureBranchName,
  createPullRequestPlan,
  GIT_BOUNDARY_RULES,
  inspectGitRepository
} from "./git-boundary.js";

const main = validateFeatureBranchName("main");

if (main.allowed) {
  throw new Error("main was incorrectly accepted as a feature branch.");
}

const invalid = validateFeatureBranchName("feature bad branch");

if (invalid.allowed) {
  throw new Error("Invalid branch name was accepted.");
}

const feature = validateFeatureBranchName("ai/contribution-test");

if (!feature.allowed) {
  throw new Error("Valid feature branch was rejected.");
}

const pr = createPullRequestPlan(
  "ai/contribution-test",
  [{ path: "knowledge/concepts/test.md", status: "added" }],
  "Add contribution test",
  "Automated contribution proposal. Human approval is required before merge."
);

if (!pr.allowed) {
  throw new Error("Valid PR plan was rejected.");
}

if (pr.baseBranch !== "main") {
  throw new Error("PR base branch is not main.");
}

if (!pr.requiresHumanApproval) {
  throw new Error("PR approval boundary is missing.");
}

if (pr.mergeAllowedByAi) {
  throw new Error("AI merge prohibition was violated.");
}

if (GIT_BOUNDARY_RULES.aiMayMerge) {
  throw new Error("Global AI merge rule is incorrectly enabled.");
}

const state = await inspectGitRepository();

if (!state.repositoryRoot) {
  throw new Error("Repository root was not detected.");
}

if (!state.currentBranch) {
  throw new Error("Current Git branch was not detected.");
}

process.stdout.write("GIT BOUNDARY TEST PASS\n");
