import { executeConversation } from "./conversation-service.js";

type ProductResponse =
  Awaited<ReturnType<typeof executeConversation>>["response"];

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`PRODUCT COMPLETION FAILURE: ${message}`);
  }
}

function requireSection(
  response: ProductResponse,
  type: string
): {
  type: string;
  title: string;
  content: string;
  sourcePath: string | null;
} {
  const found = response.sections.find((item) => item.type === type);

  if (!found) {
    throw new Error(
      `PRODUCT COMPLETION FAILURE: required section "${type}" is missing`
    );
  }

  return found;
}

async function run(): Promise<void> {
  const sessionId = `product-completion-${Date.now()}`;

  console.log("===== PRODUCT COMPLETION GATE =====");

  // ============================================================
  // 1. LEARN
  // ============================================================
  const initial = await executeConversation({
    topic: "typescript",
    sessionId,
    action: "none",
    depth: "intermediate",
    visualPreference: "auto"
  });

  assert(
    initial.response.repositoryGap === false,
    "canonical TypeScript topic was classified as a repository gap"
  );

  assert(
    initial.response.repositoryBacked === true,
    "canonical response is not repository-backed"
  );

  assert(
    initial.response.provenance.some((item) =>
      item.startsWith("repository:")
    ),
    "repository provenance is missing"
  );

  requireSection(initial.response, "explanation");

  assert(
    initial.response.model?.repositoryGrounded === true,
    "model explanation is not repository-grounded"
  );

  console.log("PASS: LEARN");

  // ============================================================
  // 2. EXPLANATION ? VISUAL
  // ============================================================
  const explained = await executeConversation({
    topic: "typescript",
    sessionId,
    action: "explain",
    depth: "intermediate",
    visualPreference: "required"
  });

  assert(
    explained.response.visual.selectedKind !== null,
    "required visual was not selected"
  );

  assert(
    explained.response.visual.required === true,
    "required visual was not marked required"
  );

  requireSection(explained.response, "visual");

  assert(
    explained.response.nextStep === "visual",
    `expected next step visual, received ${explained.response.nextStep}`
  );

  console.log(
    `PASS: SEE (${explained.response.visual.selectedKind})`
  );

  // ============================================================
  // 3. COMPLETE VISUAL ? DEMONSTRATION
  // ============================================================
  const visualComplete = await executeConversation({
    topic: "typescript",
    sessionId,
    action: "complete",
    section: "visual",
    depth: "intermediate",
    visualPreference: "required"
  });

  assert(
    visualComplete.response.nextStep === "demonstration",
    `expected next step demonstration, received ${visualComplete.response.nextStep}`
  );

  console.log("PASS: VISUAL SEQUENCING");

  // ============================================================
  // 4. UNDERSTAND — DEMONSTRATION
  // Observe the stage before completing it.
  // ============================================================
  const demonstration = await executeConversation({
    topic: "typescript",
    sessionId,
    action: "none",
    depth: "intermediate",
    visualPreference: "required"
  });

  const demonstrationSection = requireSection(
    demonstration.response,
    "model-demonstration"
  );

  assert(
    demonstrationSection.content.trim().length > 0,
    "AI demonstration is empty"
  );

  assert(
    demonstrationSection.sourcePath === null,
    "AI demonstration incorrectly claims repository attribution"
  );

  assert(
    demonstration.response.model?.repositoryGrounded === true,
    "AI demonstration is not repository-grounded"
  );

  assert(
    demonstration.response.nextStep === "demonstration",
    `expected next step demonstration, received ${demonstration.response.nextStep}`
  );

  console.log("PASS: UNDERSTAND");

  // Complete the demonstration only after verifying the
  // demonstration stage itself.
  const demonstrationComplete = await executeConversation({
    topic: "typescript",
    sessionId,
    action: "complete",
    section: "demonstration",
    depth: "intermediate",
    visualPreference: "required"
  });

  assert(
    demonstrationComplete.response.nextStep === "practice",
    `expected next step practice after demonstration, received ${demonstrationComplete.response.nextStep}`
  );

  console.log("PASS: DEMONSTRATION SEQUENCING");

  // ============================================================
  // 5. APPLY — PRACTICE
  // ============================================================
  const practice = await executeConversation({
    topic: "typescript",
    sessionId,
    action: "practice",
    depth: "intermediate",
    visualPreference: "auto"
  });

  const practiceSection = requireSection(
    practice.response,
    "model-practice"
  );

  assert(
    practiceSection.content.trim().length > 0,
    "AI practice is empty"
  );

  assert(
    practiceSection.sourcePath === null,
    "AI practice incorrectly claims repository attribution"
  );

  assert(
    practice.response.model?.repositoryGrounded === true,
    "AI practice is not repository-grounded"
  );

  console.log("PASS: APPLY");

  // ============================================================
  // 6. PRACTICE ANSWER
  // Use trusted repository explanation as the answer evidence.
  // ============================================================
  const explanationSection = requireSection(
    initial.response,
    "explanation"
  );

  const practiceAnswer = await executeConversation({
    topic: "typescript",
    sessionId,
    action: "answer-practice",
    answer: explanationSection.content,
    depth: "intermediate",
    visualPreference: "auto"
  });

  assert(
    practiceAnswer.response.sections.some(
      (item) => item.type === "evaluation"
    ),
    "practice answer evaluation is missing"
  );

  assert(
    practiceAnswer.response.nextStep === "assessment",
    `expected next step assessment after correct practice, received ${practiceAnswer.response.nextStep}`
  );

  console.log("PASS: PRACTICE EVALUATION");

  // ============================================================
  // 7. PROVE — ASSESSMENT
  // ============================================================
  const assessment = await executeConversation({
    topic: "typescript",
    sessionId,
    action: "assessment",
    depth: "intermediate",
    visualPreference: "auto"
  });

  const assessmentSection = requireSection(
    assessment.response,
    "model-assessment"
  );

  assert(
    assessmentSection.content.trim().length > 0,
    "AI assessment is empty"
  );

  assert(
    assessmentSection.sourcePath === null,
    "AI assessment incorrectly claims repository attribution"
  );

  assert(
    assessment.response.model?.repositoryGrounded === true,
    "AI assessment is not repository-grounded"
  );

  console.log("PASS: PROVE");

  // ============================================================
  // 8. INCORRECT ASSESSMENT ? REVIEW
  // ============================================================
  const incorrect = await executeConversation({
    topic: "typescript",
    sessionId,
    action: "answer-assessment",
    answer: "This answer is intentionally incorrect and unrelated.",
    depth: "intermediate",
    visualPreference: "auto"
  });

  const incorrectEvaluation = requireSection(
    incorrect.response,
    "evaluation"
  );

  assert(
    incorrectEvaluation.content.includes("Result: REVIEW"),
    "incorrect assessment did not produce REVIEW"
  );

  assert(
    incorrect.response.mastery === "assessing",
    `expected assessing mastery after incorrect assessment, received ${incorrect.response.mastery}`
  );

  console.log("PASS: INCORRECT ? REVIEW");

  // ============================================================
  // 9. CORRECT ASSESSMENT ? COMPLETE
  // ============================================================
  const correct = await executeConversation({
    topic: "typescript",
    sessionId,
    action: "answer-assessment",
    answer: explanationSection.content,
    depth: "intermediate",
    visualPreference: "auto"
  });

  const correctEvaluation = requireSection(
    correct.response,
    "evaluation"
  );

  assert(
    correctEvaluation.content.includes("Result: CORRECT"),
    "correct assessment did not produce CORRECT"
  );

  assert(
    correct.response.mastery === "complete",
    `expected complete mastery, received ${correct.response.mastery}`
  );

  assert(
    correct.response.nextStep === "complete",
    `expected complete next step, received ${correct.response.nextStep}`
  );

  console.log("PASS: CORRECT ? COMPLETE");

  // ============================================================
  // 10. KNOWLEDGE BOUNDARY
  // ============================================================
  const unknown = await executeConversation({
    topic: "totally-unknown-tech-mastery-topic",
    sessionId: `product-gap-${Date.now()}`,
    action: "none"
  });

  assert(
    unknown.response.repositoryGap === true,
    "unknown topic was not classified as a repository gap"
  );

  assert(
    unknown.response.repositoryBacked === false,
    "unknown topic was incorrectly marked repository-backed"
  );

  requireSection(unknown.response, "repository-gap");

  assert(
    unknown.response.model?.repositoryGrounded === false,
    "unknown topic model response was incorrectly marked repository-grounded"
  );

  console.log("PASS: KNOWLEDGE BOUNDARY");

  // ============================================================
  // 11. PROVENANCE BOUNDARY
  // ============================================================
  assert(
    demonstrationSection.sourcePath === null,
    "AI demonstration has repository attribution"
  );

  assert(
    practiceSection.sourcePath === null,
    "AI practice has repository attribution"
  );

  assert(
    assessmentSection.sourcePath === null,
    "AI assessment has repository attribution"
  );

  console.log("PASS: PROVENANCE BOUNDARY");

  // ============================================================
  // 12. RESPONSE CONTRACT
  // ============================================================
  assert(
    initial.response.title.includes("Tech-Mastery-Hub AI Tutor"),
    "response title contract failed"
  );

  assert(
    initial.response.mastery.length > 0,
    "mastery state is missing"
  );

  assert(
    initial.response.nextStep !== null,
    "initial response has no progression state"
  );

  console.log("PASS: RESPONSE CONTRACT");

  console.log("");
  console.log("PRODUCT COMPLETION GATE: PASS");
  console.log("LEARN: PASS");
  console.log("SEE: PASS");
  console.log("UNDERSTAND: PASS");
  console.log("APPLY: PASS");
  console.log("PROVE: PASS");
  console.log("INCORRECT ? REVIEW: PASS");
  console.log("CORRECT ? COMPLETE: PASS");
  console.log("KNOWLEDGE BOUNDARY: PASS");
  console.log("PROVENANCE BOUNDARY: PASS");
  console.log("RESPONSE CONTRACT: PASS");
}

run().catch((error: unknown) => {
  console.error(
    error instanceof Error
      ? error.message
      : "PRODUCT COMPLETION FAILURE: unknown error"
  );
  process.exitCode = 1;
});

