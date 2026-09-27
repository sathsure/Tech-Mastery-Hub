import type {
  ModelGenerationResult,
  TutorModelProvider
} from "./model-provider.js";

export interface RepositoryGroundedModelInput {
  topic: string;
  sourcePath: string | null;
  sourceContent: string | null;
  repositoryGap: boolean;
  provenance: string[];
  instruction: string;
}

export interface RepositoryGroundedModelResult {
  generation: ModelGenerationResult;
  repositoryGap: boolean;
  sourcePath: string | null;
  provenance: string[];
}

export async function generateRepositoryGroundedContent(
  provider: TutorModelProvider,
  input: RepositoryGroundedModelInput
): Promise<RepositoryGroundedModelResult> {
  const evidence =
    input.repositoryGap || !input.sourceContent
      ? "TRUSTED REPOSITORY EVIDENCE\nNo trusted repository evidence is available for this topic."
      : [
          "TRUSTED REPOSITORY EVIDENCE",
          `SOURCE: ${input.sourcePath ?? "unknown"}`,
          input.sourceContent
        ].join("\n");

  const instruction = [
    "You are a repository-grounded tutor.",
    "Use trusted repository evidence as the authoritative source.",
    "Do not claim unsupported repository facts.",
    "Clearly distinguish model-generated explanation from repository evidence.",
    input.instruction
  ].join("\n");

  const generation =
    await provider.generate({
      messages: [
        {
          role: "system",
          content: instruction
        },
        {
          role: "user",
          content: [
            `TOPIC: ${input.topic}`,
            evidence
          ].join("\n\n")
        }
      ],
      temperature: 0,
      maxTokens: 1200
    });

  return {
    generation: {
      ...generation,
      repositoryGrounded:
        !input.repositoryGap &&
        Boolean(input.sourceContent)
    },
    repositoryGap: input.repositoryGap,
    sourcePath: input.sourcePath,
    provenance: input.provenance
  };
}
