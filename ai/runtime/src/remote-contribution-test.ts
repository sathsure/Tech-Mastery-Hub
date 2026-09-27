import {
  prepareRemotePullRequest,
  verifyHumanApproval,
  verifyMerge,
  createRemoteReindexEligibility,
  REMOTE_GOVERNANCE_RULES
} from "./remote-contribution.js";

const pr = prepareRemotePullRequest(
  "origin",
  "ai/contribution-test",
  "Add governed contribution",
  "This contribution has passed local validation. Human review and approval are required before merge."
);

if (!pr.ready) {
  throw new Error("Valid remote PR request was rejected.");
}

if (pr.baseBranch !== "main") {
  throw new Error("Remote PR base branch is not main.");
}

if (!pr.requiresHumanApproval) {
  throw new Error("Remote PR does not require human approval.");
}

if (pr.aiMayApprove) {
  throw new Error("AI approval prohibition was violated.");
}

if (pr.aiMayMerge) {
  throw new Error("AI merge prohibition was violated.");
}

const pending = verifyHumanApproval("pending", false);

if (pending.verified) {
  throw new Error("Pending approval was incorrectly accepted.");
}

const unauthorized = verifyHumanApproval("approved", false);

if (unauthorized.verified) {
  throw new Error("Unauthorized approval was incorrectly accepted.");
}

const authorized = verifyHumanApproval("approved", true);

if (!authorized.verified) {
  throw new Error("Authorized human approval was rejected.");
}

const unapprovedMerge = verifyMerge(
  "ai/contribution-test",
  "main",
  true,
  false
);

if (unapprovedMerge.verified) {
  throw new Error("Merge without human approval was accepted.");
}

const unconfirmedMerge = verifyMerge(
  "ai/contribution-test",
  "main",
  false,
  true
);

if (unconfirmedMerge.verified) {
  throw new Error("Unconfirmed merge was accepted.");
}

const confirmedMerge = verifyMerge(
  "ai/contribution-test",
  "main",
  true,
  true
);

if (!confirmedMerge.verified) {
  throw new Error("Confirmed human-approved merge was rejected.");
}

const blockedReindex = createRemoteReindexEligibility(unapprovedMerge);

if (blockedReindex.eligible) {
  throw new Error("Re-indexing was allowed before approved merge.");
}

const eligibleReindex = createRemoteReindexEligibility(confirmedMerge);

if (!eligibleReindex.eligible) {
  throw new Error("Confirmed merged main state was rejected for re-index eligibility.");
}

if (REMOTE_GOVERNANCE_RULES.aiMayApprovePullRequest) {
  throw new Error("Global AI approval rule is incorrectly enabled.");
}

if (REMOTE_GOVERNANCE_RULES.aiMayMergePullRequest) {
  throw new Error("Global AI merge rule is incorrectly enabled.");
}

if (!REMOTE_GOVERNANCE_RULES.authoritativeReindexRequiresMergedMain) {
  throw new Error("Authoritative re-index merged-main requirement is missing.");
}

if (!REMOTE_GOVERNANCE_RULES.authoritativeReindexRequiresHumanApproval) {
  throw new Error("Authoritative re-index human-approval requirement is missing.");
}

process.stdout.write("REMOTE CONTRIBUTION TEST PASS\n");
