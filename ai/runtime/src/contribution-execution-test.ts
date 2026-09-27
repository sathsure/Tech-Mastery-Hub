import {
  createHumanApprovalBoundary,
  createMergeProhibition,
  createReindexEligibilityEvent,
  createContributionAuditEvent
} from "./contribution-execution.js";

const proposed = createContributionAuditEvent(
  "contribution-proposed",
  "ai/test-contribution",
  "Contribution entered the governed execution lifecycle."
);

if (proposed.event !== "contribution-proposed") {
  throw new Error("Contribution proposal audit event failed.");
}

if (!proposed.timestamp) {
  throw new Error("Contribution audit event timestamp is missing.");
}

const approval = createHumanApprovalBoundary("ai/test-contribution");

if (approval.event !== "human-approval-required") {
  throw new Error("Human approval boundary failed.");
}

if (!approval.details.includes("AI validation is not human approval")) {
  throw new Error("Human approval boundary is not explicit.");
}

const merge = createMergeProhibition("ai/test-contribution");

if (merge.event !== "merge-prohibited") {
  throw new Error("AI merge prohibition event failed.");
}

if (!merge.details.includes("prohibited from merging")) {
  throw new Error("AI merge prohibition is not explicit.");
}

const reindex = createReindexEligibilityEvent("main");

if (reindex.event !== "reindex-eligible") {
  throw new Error("Re-index eligibility event failed.");
}

if (!reindex.details.includes("merge into main")) {
  throw new Error("Post-merge re-index boundary is not explicit.");
}

process.stdout.write("CONTRIBUTION EXECUTION CONTRACT TEST PASS\n");

