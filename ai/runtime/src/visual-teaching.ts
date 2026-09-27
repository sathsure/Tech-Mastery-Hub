import type {
  TeachingContext,
  TeachingStrategy,
  VisualPlan
} from "./contracts.js";

export function createVisualPlan(
  context: TeachingContext,
  strategy: TeachingStrategy
): VisualPlan {
  if (!strategy.visualPreferred && !strategy.visualRequired) {
    return {
      required: false,
      selectedKind: null,
      purpose: null,
      sourcePath: null,
      repositoryBacked: false,
      reason:
        "Visual teaching was not selected by the teaching strategy."
    };
  }

  if (context.visualSources.length > 0) {
    const source = context.visualSources[0];

    return {
      required: strategy.visualRequired,
      selectedKind: "repository-image",
      purpose: "architecture",
      sourcePath: source.path,
      repositoryBacked: true,
      reason:
        "An approved repository visual source is available and takes precedence over generated visuals."
    };
  }

  if (context.primarySource !== null) {
    return {
      required: strategy.visualRequired,
      selectedKind: "structured-diagram",
      purpose: "concept-map",
      sourcePath: null,
      repositoryBacked: false,
      reason:
        "No repository visual source was retrieved, so a deterministic structured diagram may represent the canonical concept using trusted repository evidence."
    };
  }

  return {
    required: strategy.visualRequired,
    selectedKind: null,
    purpose: null,
    sourcePath: null,
    repositoryBacked: false,
    reason:
      "No trusted repository evidence is available for a visual representation."
  };
}
