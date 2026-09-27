import type {
  ContextSource,
  TeachingContext,
  TeachingStrategy,
  VisualPlan
} from "./contracts.js";

export interface ResponseSection {
  type: string;
  title: string;
  content: string;
  sourcePath: string | null;
  provenance: string | null;
}

export interface AssembledTutorResponse {
  topic: string;
  canonicalConcept: string | null;
  repositoryGap: boolean;
  sections: ResponseSection[];
  visual: VisualPlan;
  provenance: string[];
}

function firstMeaningfulLines(
  content: string,
  maxLines: number
): string {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !line.startsWith("```"))
    .slice(0, maxLines)
    .join("\n");
}

function firstHeading(content: string): string | null {
  const heading = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => /^#{2,6}\s+/.test(line));

  return heading
    ? heading.replace(/^#{2,6}\s+/, "").trim()
    : null;
}

function buildExplanation(
  context: TeachingContext
): ResponseSection {
  const source = context.primarySource;

  return {
    type: "explanation",
    title: "Explanation",
    content: source
      ? firstMeaningfulLines(source.content, 12)
      : "No trusted repository explanation is available for this topic.",
    sourcePath: source?.path ?? null,
    provenance: source
      ? `repository:${source.path}`
      : null
  };
}

function buildDemonstration(
  context: TeachingContext
): ResponseSection {
  const source =
    context.primarySource ??
    context.supportingSources[0];

  return {
    type: "demonstration",
    title: "Demonstration",
    content: source
      ? firstMeaningfulLines(source.content, 8)
      : "A demonstration cannot be constructed because trusted repository evidence is unavailable.",
    sourcePath: source?.path ?? null,
    provenance: source
      ? `repository:${source.path}`
      : null
  };
}

function buildConnections(
  context: TeachingContext
): ResponseSection {
  return {
    type: "connections",
    title: "Connections",
    content:
      context.relatedConcepts.length > 0
        ? context.relatedConcepts.join(", ")
        : "No related repository concepts were identified.",
    sourcePath: null,
    provenance:
      context.relatedConcepts.length > 0
        ? "repository:related-concepts"
        : null
  };
}

function buildPractice(
  context: TeachingContext
): ResponseSection {
  const source = context.primarySource;

  if (!source) {
    return {
      type: "practice",
      title: "Practice",
      content:
        "Practice is unavailable because trusted repository evidence is not available.",
      sourcePath: null,
      provenance: null
    };
  }

  const heading =
    firstHeading(source.content) ??
    context.canonicalConcept ??
    context.topic;

  return {
    type: "practice",
    title: "Practice",
    content:
      `Explain or apply "${context.topic}" with focus on "${heading}". ` +
      "Use the repository explanation as your evidence and describe the reasoning behind your answer.",
    sourcePath: source.path,
    provenance: `repository:${source.path}`
  };
}

function buildAssessment(
  context: TeachingContext
): ResponseSection {
  const source = context.primarySource;

  if (!source) {
    return {
      type: "assessment",
      title: "Assessment",
      content:
        "Assessment is unavailable because trusted repository evidence is not available.",
      sourcePath: null,
      provenance: null
    };
  }

  const heading =
    firstHeading(source.content) ??
    context.canonicalConcept ??
    context.topic;

  return {
    type: "assessment",
    title: "Assessment",
    content:
      `What is an important aspect of "${context.topic}" related to "${heading}"? ` +
      "Answer using only concepts supported by the trusted repository evidence.",
    sourcePath: source.path,
    provenance: `repository:${source.path}`
  };
}

function buildGap(
  context: TeachingContext
): ResponseSection {
  return {
    type: "repository-gap",
    title: "Repository Gap",
    content:
      `No trusted repository evidence was found for "${context.topic}". ` +
      "The tutor must not present repository-backed knowledge for this topic.",
    sourcePath: null,
    provenance: null
  };
}

export function assembleTutorContent(
  context: TeachingContext,
  strategy: TeachingStrategy,
  visualPlan: VisualPlan
): AssembledTutorResponse {
  const sections: ResponseSection[] = [];

  if (context.repositoryGap) {
    sections.push(buildGap(context));
  }

  if (strategy.explanationRequired) {
    sections.push(buildExplanation(context));
  }

  if (visualPlan.selectedKind !== null) {
    sections.push({
      type: "visual",
      title: "Visual",
      content: visualPlan.sourcePath
        ? `Use repository visual: ${visualPlan.sourcePath}`
        : "Use the planned structured visual representation.",
      sourcePath: visualPlan.sourcePath,
      provenance: visualPlan.sourcePath
        ? `repository:${visualPlan.sourcePath}`
        : null
    });
  }

  if (strategy.demonstrationRequired) {
    sections.push(buildDemonstration(context));
  }

  if (
    strategy.connectToRelatedConcepts &&
    context.relatedConcepts.length > 0
  ) {
    sections.push(buildConnections(context));
  }

  if (strategy.practiceRequired) {
    sections.push(buildPractice(context));
  }

  if (strategy.assessmentRequired) {
    sections.push(buildAssessment(context));
  }

  return {
    topic: context.topic,
    canonicalConcept: context.canonicalConcept,
    repositoryGap: context.repositoryGap,
    sections,
    visual: visualPlan,
    provenance: context.provenance
  };
}
