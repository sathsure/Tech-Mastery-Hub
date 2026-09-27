import {
  evaluatePostMergeReindexEligibility
} from "./post-merge-reindex.js";

type MergeInput = Parameters<
  typeof evaluatePostMergeReindexEligibility
>[0];

function expectBlocked(
  name: string,
  merge: MergeInput
): void {
  const result =
    evaluatePostMergeReindexEligibility(merge);

  if (result.eligible) {
    throw new Error(
      "EXPECTED BLOCK: " + name
    );
  }
}

function expectAllowed(
  name: string,
  merge: MergeInput
): void {
  const result =
    evaluatePostMergeReindexEligibility(merge);

  if (!result.eligible) {
    throw new Error(
      "EXPECTED ALLOW: " +
        name +
        " | " +
        result.findings.join(" ")
    );
  }
}

const validMerge = {
  verified: true,
  merged: true,
  humanApprovalConfirmed: true,
  baseBranch: "main"
} as MergeInput;

expectBlocked(
  "unverified merge",
  {
    ...validMerge,
    verified: false
  }
);

expectBlocked(
  "unmerged pull request",
  {
    ...validMerge,
    merged: false
  }
);

expectBlocked(
  "missing human approval",
  {
    ...validMerge,
    humanApprovalConfirmed: false
  }
);

expectBlocked(
  "non-main base branch",
  {
    ...validMerge,
    baseBranch: "develop"
  }
);

expectAllowed(
  "verified merged main contribution",
  validMerge
);

console.log(
  "POST-MERGE REINDEX ORCHESTRATION TEST PASS"
);
