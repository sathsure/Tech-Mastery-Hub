import { executeConversation } from "./conversation-service.js";

async function assertModelStage(
  action: Parameters<typeof executeConversation>[0]["action"],
  expectedType: string,
  expectedTitle: string
): Promise<void> {
  const result = await executeConversation({
    topic: "typescript",
    sessionId: `model-stage-${expectedType}-${Date.now()}`,
    action
  });

  const section = result.response.sections.find(
    item => item.type === expectedType
  );

  if (!section) {
    throw new Error(
      `Expected model section type "${expectedType}" for action "${action}".`
    );
  }

  if (section.title !== expectedTitle) {
    throw new Error(
      `Expected model section title "${expectedTitle}", received "${section.title}".`
    );
  }

  if (!section.content.trim()) {
    throw new Error(
      `Model section "${expectedType}" must contain content.`
    );
  }

  if (section.sourcePath !== null) {
    throw new Error(
      `Model-generated section "${expectedType}" must not masquerade as a repository source.`
    );
  }

  if (!result.response.model?.repositoryGrounded) {
    throw new Error(
      `Model section "${expectedType}" must remain repository-grounded for a canonical topic.`
    );
  }
}

await assertModelStage(
  "none",
  "model-explanation",
  "AI Explanation"
);

await assertModelStage(
  "practice",
  "model-practice",
  "AI Practice"
);

await assertModelStage(
  "assessment",
  "model-assessment",
  "AI Assessment"
);

const gapSessionId = `model-gap-${Date.now()}`;

const gap = await executeConversation({
  topic: "xyz-nonexistent-model-topic",
  sessionId: gapSessionId,
  action: "none"
});

const gapModelSection = gap.response.sections.find(
  section =>
    section.type === "model-explanation" ||
    section.type === "model-demonstration" ||
    section.type === "model-practice" ||
    section.type === "model-assessment"
);

if (!gapModelSection) {
  throw new Error(
    "Repository-gap response must still contain a model section."
  );
}

if (gap.response.repositoryGap !== true) {
  throw new Error(
    "Unknown topic must remain marked as a repository gap."
  );
}

if (gap.response.model?.repositoryGrounded === true) {
  throw new Error(
    "Repository-gap model content must never be marked repository-grounded."
  );
}

if (gap.response.repositoryBacked !== false) {
  throw new Error(
    "Repository-gap response must not be marked repository-backed."
  );
}

process.stdout.write(
  "MODEL ORCHESTRATION INTEGRATION TEST: PASS\n"
);
