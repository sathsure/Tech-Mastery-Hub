import { DeterministicTutorModelProvider } from "./deterministic-model-provider.js";
import {
  readModelProviderConfiguration
} from "./model-provider.js";
import { createTutorModelProvider } from "./model-provider-factory.js";
import {
  generateRepositoryGroundedContent
} from "./model-orchestrator.js";

const configuration = readModelProviderConfiguration();

if (configuration.provider !== "deterministic") {
  throw new Error("Default model provider must be deterministic.");
}

const provider = createTutorModelProvider();

if (provider.name !== "deterministic") {
  throw new Error("Default provider contract failed.");
}

const deterministic =
  new DeterministicTutorModelProvider();

const result =
  await generateRepositoryGroundedContent(
    deterministic,
    {
      topic: "typescript",
      sourcePath: "knowledge/concepts/typescript/README.md",
      sourceContent: "TypeScript supports type inference.",
      repositoryGap: false,
      provenance: [
        "repository:knowledge/concepts/typescript/README.md"
      ],
      instruction: "Explain the concept."
    }
  );

if (!result.generation.content.includes("trusted repository evidence")) {
  throw new Error("Deterministic provider response contract failed.");
}

if (!result.generation.repositoryGrounded) {
  throw new Error("Repository grounding flag was lost.");
}

if (result.sourcePath !== "knowledge/concepts/typescript/README.md") {
  throw new Error("Repository source path was lost.");
}

if (
  !result.provenance.includes(
    "repository:knowledge/concepts/typescript/README.md"
  )
) {
  throw new Error("Repository provenance was lost.");
}

let rejected = false;

try {
  await generateRepositoryGroundedContent(
    deterministic,
    {
      topic: "unknown",
      sourcePath: null,
      sourceContent: null,
      repositoryGap: true,
      provenance: [],
      instruction: "Explain the concept."
    }
  );
} catch {
  rejected = true;
}

if (rejected) {
  throw new Error(
    "Repository-gap orchestration must not fail merely because evidence is unavailable."
  );
}

process.stdout.write(
  "MODEL PROVIDER CONTRACT TEST: PASS\n"
);
