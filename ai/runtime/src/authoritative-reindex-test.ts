import {
  validateCurrentIndex,
  executeAuthoritativeReindex
} from "./authoritative-reindex.js";

const validation = await validateCurrentIndex();

if (!validation.valid) {
  throw new Error(
    "CURRENT INDEX VALIDATION FAILED: " +
      validation.findings.join(" | ")
  );
}

const blockedMerge = {
  verified: false,
  merged: false,
  baseBranch: "main",
  humanApprovalConfirmed: false,
  reason: "Contract fixture: merge not confirmed."
};

const blocked = await executeAuthoritativeReindex(blockedMerge);

if (blocked.promoted) {
  throw new Error(
    "Re-index was promoted without confirmed human-approved merge."
  );
}

const wrongBranchMerge = {
  verified: true,
  merged: true,
  baseBranch: "feature/test",
  humanApprovalConfirmed: true,
  reason: "Contract fixture: wrong base branch."
};

const wrongBranch = await executeAuthoritativeReindex(
  wrongBranchMerge
);

if (wrongBranch.promoted) {
  throw new Error(
    "Re-index was promoted from a non-main base branch."
  );
}

process.stdout.write(
  "AUTHORITATIVE REINDEX CONTRACT TEST PASS\n"
);
