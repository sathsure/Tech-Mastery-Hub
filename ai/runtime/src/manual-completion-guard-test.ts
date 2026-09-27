import {
  createSessionState,
  completeSection
} from "./session-state.js";
import {
  canManuallyCompleteSection
} from "./session-engine.js";

const planned = [
  "explanation",
  "visual",
  "demonstration",
  "connections",
  "practice",
  "assessment"
];

const base = createSessionState(
  "sequencing-test",
  "typescript",
  "typescript",
  "learn",
  "basic",
  false,
  ["repository:knowledge/concepts/typescript/README.md"]
);

if (canManuallyCompleteSection(base, "assessment", planned)) {
  throw new Error("Assessment was allowed before earlier sections.");
}

if (canManuallyCompleteSection(base, "practice", planned)) {
  throw new Error("Practice was allowed before earlier sections.");
}

if (!canManuallyCompleteSection(base, "explanation", planned)) {
  throw new Error("Explanation should be completable first.");
}

const explanation = completeSection(base, "explanation");

if (canManuallyCompleteSection(explanation, "demonstration", planned)) {
  throw new Error("Demonstration was allowed before visual.");
}

const visual = completeSection(explanation, "visual");

if (!canManuallyCompleteSection(visual, "demonstration", planned)) {
  throw new Error("Demonstration should be allowed after visual.");
}

const demonstration = completeSection(visual, "demonstration");
const connections = completeSection(demonstration, "connections");

if (canManuallyCompleteSection(connections, "practice", planned)) {
  throw new Error("Practice was allowed without correct practice evidence.");
}

const practiceEvidence = {
  prompt: "Explain type inference.",
  answer: "Types are inferred.",
  correct: true,
  sourcePath: "knowledge/concepts/typescript/README.md"
};

const practicing = {
  ...connections,
  practiceAttempts: [practiceEvidence]
};

if (!canManuallyCompleteSection(practicing, "practice", planned)) {
  throw new Error("Correct practice evidence did not permit practice completion.");
}

const practiced = completeSection(practicing, "practice");

if (canManuallyCompleteSection(practiced, "assessment", planned)) {
  throw new Error("Assessment was allowed without correct assessment evidence.");
}

const assessmentEvidence = {
  question: "What is type inference?",
  answer: "The compiler infers a type.",
  correct: true,
  sourcePath: "knowledge/concepts/typescript/README.md"
};

const assessing = {
  ...practiced,
  assessmentAttempts: [assessmentEvidence]
};

if (!canManuallyCompleteSection(assessing, "assessment", planned)) {
  throw new Error("Correct assessment evidence did not permit assessment completion.");
}

if (!canManuallyCompleteSection(practiced, "explanation", planned)) {
  throw new Error("Already-completed sections should remain idempotently completable.");
}

if (canManuallyCompleteSection(practiced, "unknown-section", planned)) {
  throw new Error("Unknown section was incorrectly accepted.");
}

console.log("SESSION SEQUENCING GUARD TEST PASS");
