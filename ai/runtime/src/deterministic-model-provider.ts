import type {
  ModelGenerationRequest,
  ModelGenerationResult,
  TutorModelProvider
} from "./model-provider.js";

function extractEvidence(request: ModelGenerationRequest): string {
  const userMessage =
    request.messages.find(message => message.role === "user")?.content ?? "";

  const marker = "TRUSTED REPOSITORY EVIDENCE";
  const index = userMessage.indexOf(marker);

  if (index === -1) {
    return "";
  }

  return userMessage.slice(index);
}

function extractSourcePath(evidence: string): string | null {
  const match = evidence.match(/^SOURCE:\s*(.+)$/m);
  return match ? match[1].trim() : null;
}

function extractRepositoryContent(evidence: string): string {
  const sourceMatch = evidence.match(
    /^SOURCE:\s*.+\r?\n([\s\S]*)$/m
  );

  if (!sourceMatch) {
    return "";
  }

  return sourceMatch[1]
    .replace(/^```[\w-]*\r?\n?/gm, "")
    .replace(/^```\r?\n?/gm, "")
    .trim();
}

function meaningfulLines(content: string, limit: number): string[] {
  return content
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .filter(line => !line.startsWith("```"))
    .filter(line => !line.startsWith("#"))
    .slice(0, limit);
}

function buildExplanation(
  topic: string,
  content: string
): string {
  const lines = meaningfulLines(content, 8);

  if (lines.length === 0) {
    return `The repository contains trusted information about ${topic}, but no concise explanation could be extracted.`;
  }

  return [
    `AI-generated explanation of ${topic}:`,
    "",
    ...lines.map(line => `• ${line}`),
    "",
    "This explanation is derived from the trusted repository evidence supplied to the tutor."
  ].join("\n");
}

function buildDemonstration(
  topic: string,
  content: string
): string {
  const lines = meaningfulLines(content, 6);

  if (lines.length === 0) {
    return `No repository-backed demonstration could be constructed for ${topic}.`;
  }

  return [
    `Repository-grounded demonstration for ${topic}:`,
    "",
    ...lines.map((line, index) => `${index + 1}. ${line}`)
  ].join("\n");
}

function buildPractice(
  topic: string,
  content: string
): string {
  const lines = meaningfulLines(content, 3);
  const focus = lines[0] ?? `the core concept of ${topic}`;

  return [
    `Practice: explain or apply ${topic}.`,
    "",
    `Use this repository evidence as your starting point: ${focus}`,
    "",
    "Explain the concept in your own words and connect it to a practical example."
  ].join("\n");
}

function buildAssessment(
  topic: string,
  content: string
): string {
  const lines = meaningfulLines(content, 2);
  const evidence = lines[0] ?? `the repository definition of ${topic}`;

  return [
    `Assessment: What is an important aspect of ${topic}?`,
    "",
    `Your answer should be supported by the repository evidence, including: ${evidence}`
  ].join("\n");
}

function buildContent(
  topic: string,
  instruction: string,
  repositoryContent: string
): string {
  const normalizedInstruction = instruction.toLowerCase();

  if (
    normalizedInstruction.includes("assessment")
  ) {
    return buildAssessment(topic, repositoryContent);
  }

  if (
    normalizedInstruction.includes("practice")
  ) {
    return buildPractice(topic, repositoryContent);
  }

  if (
    normalizedInstruction.includes("demonstration")
  ) {
    return buildDemonstration(topic, repositoryContent);
  }

  return buildExplanation(topic, repositoryContent);
}

export class DeterministicTutorModelProvider
  implements TutorModelProvider
{
  readonly name = "deterministic";
  readonly model = "repository-grounded-deterministic";

  async generate(
    request: ModelGenerationRequest
  ): Promise<ModelGenerationResult> {
    const evidence = extractEvidence(request);

    if (!evidence) {
      return {
        provider: this.name,
        model: this.model,
        content: "No trusted repository evidence was supplied.",
        repositoryGrounded: false,
        provenance: []
      };
    }

    if (
      evidence.includes(
        "No trusted repository evidence is available for this topic."
      )
    ) {
      return {
        provider: this.name,
        model: this.model,
        content:
          "No trusted repository evidence is available for this topic. The tutor will not present repository-backed knowledge for it.",
        repositoryGrounded: false,
        provenance: []
      };
    }

    const topicMatch = request.messages
      .find(message => message.role === "user")
      ?.content.match(/^TOPIC:\s*(.+)$/m);

    const topic = topicMatch?.[1]?.trim() ?? "the requested topic";
    const systemInstruction =
      request.messages.find(message => message.role === "system")
        ?.content ?? "";

    const repositoryContent = extractRepositoryContent(evidence);
    const sourcePath = extractSourcePath(evidence);

    return {
      provider: this.name,
      model: this.model,
      content: buildContent(
        topic,
        systemInstruction,
        repositoryContent
      ),
      repositoryGrounded: repositoryContent.length > 0,
      provenance: sourcePath ? [`repository:${sourcePath}`] : []
    };
  }
}
