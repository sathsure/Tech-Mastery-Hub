import { createTutorApiServer } from "./api-server.js";

const sessionId = `integration-${Date.now()}`;
const server = createTutorApiServer();

await new Promise<void>(resolve =>
  server.listen(0, "127.0.0.1", resolve)
);

const address = server.address();

if (!address || typeof address === "string") {
  throw new Error("Test server address unavailable.");
}

const base = `http://127.0.0.1:${address.port}`;

async function json(url: string, init?: RequestInit) {
  const response = await fetch(`${base}${url}`, init);
  const data = await response.json() as Record<string, any>;
  return { response, data };
}

try {
  const health = await json("/health");

  if (health.response.status !== 200) {
    throw new Error("Health endpoint failed.");
  }

  const ready = await json("/ready");

  if (ready.response.status !== 200) {
    throw new Error("Readiness endpoint failed.");
  }

  const invalid = await json("/tutor", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: "{}"
  });

  if (invalid.response.status !== 400) {
    throw new Error("Invalid request was not rejected.");
  }

  const media = await json("/tutor", {
    method: "POST",
    headers: {
      "content-type": "text/plain"
    },
    body: "{}"
  });

  if (media.response.status !== 415) {
    throw new Error("Unsupported media type was not rejected.");
  }

  const first = await json("/tutor", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      topic: "typescript",
      sessionId
    })
  });

  if (first.response.status !== 200) {
    throw new Error("Valid tutor request failed.");
  }

  if (first.data?.data?.response?.repositoryBacked !== true) {
    throw new Error("Repository-backed response missing.");
  }

  if (first.data?.data?.turn?.sessionId !== sessionId) {
    throw new Error("Session isolation failed.");
  }

  if (!first.data?.data?.turn?.turnId) {
    throw new Error("Conversation turn ID missing.");
  }

  if (first.data?.data?.turn?.nextStep !== "explanation") {
    throw new Error("Initial session did not start at explanation.");
  }

  const prematurePractice = await json("/tutor", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      topic: "typescript",
      sessionId,
      action: "complete",
      section: "practice"
    })
  });

  if (prematurePractice.response.status !== 400) {
    throw new Error("Premature practice completion was not rejected.");
  }

  const prematureAssessment = await json("/tutor", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      topic: "typescript",
      sessionId,
      action: "complete",
      section: "assessment"
    })
  });

  if (prematureAssessment.response.status !== 400) {
    throw new Error("Premature assessment completion was not rejected.");
  }

  const explain = await json("/tutor", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      topic: "typescript",
      sessionId,
      action: "explain"
    })
  });

  if (explain.response.status !== 200) {
    throw new Error("Explanation action failed.");
  }

  if (explain.data?.data?.turn?.nextStep !== "demonstration") {
    throw new Error("Explanation did not advance to demonstration.");
  }

  const demonstration = await json("/tutor", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      topic: "typescript",
      sessionId,
      action: "complete",
      section: "demonstration"
    })
  });

  if (demonstration.response.status !== 200) {
    throw new Error("Demonstration completion failed.");
  }

  if (demonstration.data?.data?.turn?.nextStep !== "practice") {
    throw new Error("Demonstration did not advance to practice.");
  }

  const answer = await json("/tutor", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      topic: "typescript",
      sessionId,
      action: "answer-practice",
      answer: "TypeScript infers types from initialization and expressions"
    })
  });

  if (answer.response.status !== 200) {
    throw new Error("Practice answer request failed.");
  }

  const evaluationSection =
    answer.data?.data?.response?.sections?.find(
      (item: any) => item.type === "evaluation"
    );

  if (!evaluationSection) {
    throw new Error("Evaluation section missing.");
  }

  if (answer.data?.data?.turn?.nextStep !== "assessment") {
    throw new Error("Practice did not advance to assessment.");
  }

  const incorrectAssessment = await json("/tutor", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      topic: "typescript",
      sessionId,
      action: "answer-assessment",
      answer: "banana"
    })
  });

  if (incorrectAssessment.response.status !== 200) {
    throw new Error("Incorrect assessment request failed.");
  }

  const incorrectEvaluation =
    incorrectAssessment.data?.data?.response?.sections?.find(
      (item: any) => item.type === "evaluation"
    );

  if (!incorrectEvaluation) {
    throw new Error("Incorrect assessment evaluation missing.");
  }

  if (!incorrectEvaluation.content.includes("Result: REVIEW")) {
    throw new Error("Incorrect assessment answer was accepted.");
  }

  if (incorrectAssessment.data?.data?.turn?.mastery === "complete") {
    throw new Error("Incorrect assessment completed mastery.");
  }

  const correctAssessment = await json("/tutor", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      topic: "typescript",
      sessionId,
      action: "answer-assessment",
      answer: "Type inference helps TypeScript infer types from initialization and expressions"
    })
  });

  if (correctAssessment.response.status !== 200) {
    throw new Error("Correct assessment request failed.");
  }

  const correctEvaluation =
    correctAssessment.data?.data?.response?.sections?.find(
      (item: any) => item.type === "evaluation"
    );

  if (!correctEvaluation) {
    throw new Error("Correct assessment evaluation missing.");
  }

  if (!correctEvaluation.content.includes("Result: CORRECT")) {
    throw new Error("Correct assessment answer was not accepted.");
  }

  if (correctAssessment.data?.data?.turn?.mastery !== "complete") {
    throw new Error("Mastery did not become complete.");
  }

  if (correctAssessment.data?.data?.turn?.nextStep !== "complete") {
    throw new Error("Completed mastery did not produce complete next step.");
  }

  const gap = await json("/tutor", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      topic: "xyz-nonexistent-topic",
      sessionId: `gap-${Date.now()}`
    })
  });

  if (gap.response.status !== 200) {
    throw new Error("Repository gap request failed.");
  }

  if (
    gap.data?.data?.response?.repositoryGap !== true ||
    gap.data?.data?.response?.repositoryBacked !== false
  ) {
    throw new Error("Repository gap contract failed.");
  }

  const malformed = await json("/tutor", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: "not-json"
  });

  if (malformed.response.status !== 400) {
    throw new Error("Malformed JSON was not rejected.");
  }

  process.stdout.write("API INTEGRATION TEST: PASS\n");
} finally {
  server.close();
}

