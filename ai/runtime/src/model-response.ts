import type { TutorTurn } from "./tutor-service.js";
import { createTutorModelProvider } from "./model-provider-factory.js";
import { DeterministicTutorModelProvider } from "./deterministic-model-provider.js";
import type { TutorModelProvider } from "./model-provider.js";
import { generateRepositoryGroundedContent } from "./model-orchestrator.js";
import type { ApiAction } from "./api-contracts.js";

export interface ModelTutorSection {
  type:
    | "model-explanation"
    | "model-demonstration"
    | "model-practice"
    | "model-assessment";
  title: string;
  content: string;
  sourcePath: null;
}

export interface ModelTutorResult {
  section: ModelTutorSection;
  provider: string;
  model: string;
  repositoryGrounded: boolean;
  provenance: string[];
  fallbackUsed: boolean;
}

function determineStage(
  turn: TutorTurn,
  action: ApiAction
): ModelTutorSection["type"] {
  if (action === "practice" || action === "answer-practice") {
    return "model-practice";
  }

  if (action === "assessment" || action === "answer-assessment") {
    return "model-assessment";
  }

  if (action === "complete") {
    if (turn.nextStep === "demonstration") {
      return "model-demonstration";
    }

    if (turn.nextStep === "practice") {
      return "model-practice";
    }

    if (turn.nextStep === "assessment") {
      return "model-assessment";
    }
  }

  if (turn.nextStep === "demonstration") {
    return "model-demonstration";
  }

  if (turn.nextStep === "practice") {
    return "model-practice";
  }

  if (turn.nextStep === "assessment") {
    return "model-assessment";
  }

  return "model-explanation";
}

function instructionForStage(
  stage: ModelTutorSection["type"]
): string {
  switch (stage) {
    case "model-demonstration":
      return [
        "Produce a concise demonstration.",
        "Show how the repository concept works in practice.",
        "Use only the supplied trusted repository evidence.",
        "Make the demonstration concrete and easy to follow."
      ].join("\n");

    case "model-practice":
      return [
        "Produce a practice activity.",
        "Ask the learner to explain or apply the repository concept.",
        "Base the activity on the supplied trusted repository evidence.",
        "Do not reveal an unsupported answer."
      ].join("\n");

    case "model-assessment":
      return [
        "Produce an assessment question.",
        "The learner must demonstrate understanding of the repository concept.",
        "The question must be answerable using the supplied trusted repository evidence.",
        "Do not introduce unsupported repository facts."
      ].join("\n");

    default:
      return [
        "Produce a concise teaching explanation.",
        "Use the supplied trusted repository evidence.",
        "Explain the concept clearly before moving to application.",
        "Do not present unsupported information as repository fact."
      ].join("\n");
  }
}

function titleForStage(
  stage: ModelTutorSection["type"]
): string {
  switch (stage) {
    case "model-demonstration":
      return "AI Demonstration";
    case "model-practice":
      return "AI Practice";
    case "model-assessment":
      return "AI Assessment";
    default:
      return "AI Explanation";
  }
}

function inputFromTurn(
  turn: TutorTurn,
  instruction: string
) {
  return {
    topic: turn.context.topic,
    sourcePath: turn.context.primarySource?.path ?? null,
    sourceContent: turn.context.primarySource?.content ?? null,
    repositoryGap: turn.context.repositoryGap,
    provenance: turn.context.provenance,
    instruction
  };
}

export async function generateModelTutorSection(
  turn: TutorTurn,
  action: ApiAction
): Promise<ModelTutorResult> {
  const stage = determineStage(turn, action);
  const instruction = instructionForStage(stage);

  let provider: TutorModelProvider;

  try {
    provider = createTutorModelProvider();

    const result = await generateRepositoryGroundedContent(
      provider,
      inputFromTurn(turn, instruction)
    );

    return {
      section: {
        type: stage,
        title: titleForStage(stage),
        content: result.generation.content,
        sourcePath: null
      },
      provider: result.generation.provider,
      model: result.generation.model,
      repositoryGrounded: result.generation.repositoryGrounded,
      provenance: result.provenance,
      fallbackUsed: false
    };
  } catch {
    provider = new DeterministicTutorModelProvider();

    const result = await generateRepositoryGroundedContent(
      provider,
      inputFromTurn(turn, instruction)
    );

    return {
      section: {
        type: stage,
        title: titleForStage(stage),
        content: result.generation.content,
        sourcePath: null
      },
      provider: result.generation.provider,
      model: result.generation.model,
      repositoryGrounded: result.generation.repositoryGrounded,
      provenance: result.provenance,
      fallbackUsed: true
    };
  }
}
