import {
  executeAuthoritativeReindex
} from "./authoritative-reindex.js";

export type PostMergeReindexInput =
  Parameters<typeof executeAuthoritativeReindex>[0];

export interface PostMergeReindexResult {
  eligible: boolean;
  executed: boolean;
  reason: string;
  result: Awaited<
    ReturnType<typeof executeAuthoritativeReindex>
  > | null;
}

function validateMergeEligibility(
  merge: PostMergeReindexInput
): string[] {
  const findings: string[] = [];

  const value =
    merge as unknown as Record<string, unknown>;

  if (value.verified !== true) {
    findings.push(
      "Merge verification must be confirmed."
    );
  }

  if (value.merged !== true) {
    findings.push(
      "Merge must be confirmed as completed."
    );
  }

  if (value.humanApprovalConfirmed !== true) {
    findings.push(
      "Human approval must be confirmed."
    );
  }

  if (
    String(value.baseBranch ?? "").toLowerCase() !==
    "main"
  ) {
    findings.push(
      "Authoritative re-indexing requires base branch main."
    );
  }

  return findings;
}

export function evaluatePostMergeReindexEligibility(
  merge: PostMergeReindexInput
): {
  eligible: boolean;
  findings: string[];
} {
  const findings =
    validateMergeEligibility(merge);

  return {
    eligible: findings.length === 0,
    findings
  };
}

export async function executePostMergeReindex(
  merge: PostMergeReindexInput
): Promise<PostMergeReindexResult> {
  const eligibility =
    evaluatePostMergeReindexEligibility(merge);

  if (!eligibility.eligible) {
    return {
      eligible: false,
      executed: false,
      reason: eligibility.findings.join(" "),
      result: null
    };
  }

  const result =
    await executeAuthoritativeReindex(merge);

  return {
    eligible: true,
    executed: true,
    reason:
      "Verified merged main state is eligible for authoritative re-indexing.",
    result
  };
}
