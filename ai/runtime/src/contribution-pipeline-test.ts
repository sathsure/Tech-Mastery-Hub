import { evaluateContributionPipeline } from "./contribution-pipeline.js";
import type { ContributionRequest } from "./contribution-contracts.js";

const createRequest = (
  content: string,
  path = "knowledge/concepts/pipeline-test.md"
): ContributionRequest => ({
  requestId: "pipeline-test",
  actor: "ai",
  hasHumanApproval: true,
  files: [{ path, content }]
});

const valid = await evaluateContributionPipeline(
  createRequest(
    "# Contribution Test\n\nTypeScript type inference helps infer types from expressions."
  )
);

if (!valid.allowed) {
  throw new Error(
    "Valid contribution was rejected at " +
      valid.stage +
      ": " +
      valid.reason
  );
}

const empty = await evaluateContributionPipeline(
  createRequest("", "knowledge/concepts/empty.md")
);

if (empty.allowed || empty.stage !== "content-validation") {
  throw new Error("Empty contribution was not blocked by content validation.");
}

const outside = await evaluateContributionPipeline(
  createRequest("# Bad\n\nOutside repository.", "../outside.md")
);

if (outside.allowed || outside.stage !== "content-validation") {
  throw new Error("Outside-repository contribution was not blocked.");
}

process.stdout.write("CONTRIBUTION PIPELINE TEST PASS\n");

