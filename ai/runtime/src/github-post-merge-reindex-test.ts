import {
  processVerifiedGitHubMerge
} from "./github-post-merge-reindex.js";

type MergeInput = Parameters<
  typeof processVerifiedGitHubMerge
>[0];

const validMerge = {
  verified: true,
  merged: true,
  humanApprovalConfirmed: true,
  baseBranch: "main"
} as MergeInput;

const validResult =
  await processVerifiedGitHubMerge(validMerge);

if (!validResult.reindex.eligible) {
  throw new Error(
    "Verified GitHub merge was not eligible."
  );
}

if (!validResult.reindex.executed) {
  throw new Error(
    "Verified GitHub merge did not execute."
  );
}

const blockedCases: Array<{
  name: string;
  merge: MergeInput;
}> = [
  {
    name: "unverified merge",
    merge: {
      ...validMerge,
      verified: false
    }
  },
  {
    name: "unmerged pull request",
    merge: {
      ...validMerge,
      merged: false
    }
  },
  {
    name: "missing human approval",
    merge: {
      ...validMerge,
      humanApprovalConfirmed: false
    }
  },
  {
    name: "non-main base branch",
    merge: {
      ...validMerge,
      baseBranch: "develop"
    }
  }
];

for (const testCase of blockedCases) {
  const result =
    await processVerifiedGitHubMerge(
      testCase.merge
    );

  if (result.reindex.eligible) {
    throw new Error(
      "SECURITY BOUNDARY FAILURE: " +
        testCase.name +
        " was accepted."
    );
  }

  if (result.reindex.executed) {
    throw new Error(
      "SECURITY BOUNDARY FAILURE: " +
        testCase.name +
        " reached re-index execution."
    );
  }
}

console.log(
  "GITHUB POST-MERGE REINDEX INTEGRATION TEST PASS"
);
console.log(
  "GITHUB POST-MERGE NEGATIVE SECURITY TEST PASS"
);
