import { loadKnowledgeIndex } from "./knowledge-index.js";
import { retrieveKnowledge } from "./knowledge-retriever.js";
import { assembleTeachingContext } from "./context-assembler.js";
import { createTeachingStrategy } from "./teaching-strategy.js";
import { createVisualPlan } from "./visual-teaching.js";
import { createPracticeAssessment } from "./practice-assessment.js";
import { createSessionState, getNextStep } from "./session-state.js";
import { loadSessionState, saveSessionState } from "./session-store.js";
import { applySessionAction, advanceSession, canManuallyCompleteSection } from "./session-engine.js";
import { evaluateMastery } from "./mastery-evaluator.js";
import { evaluateAnswer } from "./answer-evaluator.js";
import type { TutorIntent, LearningMode, VisualPreference } from "./contracts.js";
import { ValidationError } from "./request-validation.js";
export type TutorAction =
  | "none"
  | "explain"
  | "practice"
  | "assessment"
  | "complete"
  | "answer-practice"
  | "answer-assessment";
export interface TutorRequest {
  topic: string;
  sessionId?: string;
  action?: TutorAction;
  answer?: string;
  section?: string;
  learningMode?: LearningMode;
  visualPreference?: VisualPreference;
  depth?: "basic" | "intermediate" | "deep";
}
export interface TutorTurn {
  intent: TutorIntent;
  context: ReturnType<typeof assembleTeachingContext>;
  strategy: ReturnType<typeof createTeachingStrategy>;
  visualPlan: ReturnType<typeof createVisualPlan>;
  practiceAssessment: ReturnType<typeof createPracticeAssessment>;
  session: ReturnType<typeof createSessionState>;
  evaluation: ReturnType<typeof evaluateMastery>;
  nextStep: string | null;
  actionResult: { correct: boolean | null; confidence: number | null; matchedTerms: string[]; reason: string | null };
}
function plannedSections(
  strategy: ReturnType<typeof createTeachingStrategy>,
  visualPlan: ReturnType<typeof createVisualPlan>,
): string[] {
  return ["explanation", "visual", "demonstration", "connections", "practice", "assessment"].filter(section => {
    if (section === "visual") return visualPlan.selectedKind !== null;
    if (section === "connections") return strategy.connectToRelatedConcepts;
    return true;
  });
}
type Session = ReturnType<typeof createSessionState>;
type ActionResult = TutorTurn["actionResult"];
const NO_RESULT: ActionResult = { correct: null, confidence: null, matchedTerms: [], reason: null };

/** Marks a section complete, or rejects the request when earlier sections are still open. */
function completeSection(session: Session, section: string, sections: string[]): Session {
  if (!canManuallyCompleteSection(session, section, sections))
    throw new ValidationError(`Section cannot be completed yet: ${section}.`);
  return applySessionAction(session, { type: "complete-section", section });
}

/** Grades a practice or assessment answer against the primary source and records the attempt. */
function gradeAnswer(
  session: Session,
  action: "answer-practice" | "answer-assessment",
  request: TutorRequest,
  context: TutorTurn["context"],
  practiceAssessment: TutorTurn["practiceAssessment"],
): { session: Session; actionResult: ActionResult } {
  const source = context.primarySource;
  if (!source) {
    return {
      session,
      actionResult: {
        correct: false,
        confidence: 0,
        matchedTerms: [],
        reason: "No trusted repository source is available; answer evaluation is blocked.",
      },
    };
  }
  const topic = request.topic.trim();
  const answer = request.answer ?? "";
  const evaluation = evaluateAnswer(answer, source.content);
  const actionResult = {
    correct: evaluation.correct,
    confidence: evaluation.confidence,
    matchedTerms: evaluation.matchedTerms,
    reason: evaluation.reason,
  };
  let next: Session;
  let section: string;
  if (action === "answer-practice") {
    const prompt = practiceAssessment.practice[0]?.prompt ?? `Explain ${topic}.`;
    next = applySessionAction(session, {
      type: "practice-attempt",
      attempt: { prompt, answer, correct: evaluation.correct, sourcePath: source.path },
    });
    section = "practice";
  } else {
    const question = practiceAssessment.assessment[0]?.question ?? `Explain an important aspect of ${topic}.`;
    next = applySessionAction(session, {
      type: "assessment-attempt",
      attempt: { question, answer, correct: evaluation.correct, sourcePath: source.path },
    });
    section = "assessment";
  }
  if (evaluation.correct) next = applySessionAction(next, { type: "complete-section", section });
  return { session: next, actionResult };
}

export async function runTutorTurn(request: TutorRequest): Promise<TutorTurn> {
  const topic = request.topic.trim();
  if (!topic) throw new ValidationError("topic is required.");
  const sessionId = (request.sessionId ?? "api-session").trim() || "api-session";
  const intent: TutorIntent = {
    query: topic,
    topic,
    learningMode: request.learningMode ?? "learn",
    visualPreference: request.visualPreference ?? "auto",
    depth: request.depth ?? "basic",
  };
  await loadKnowledgeIndex();
  const evidence = await retrieveKnowledge(topic);
  const context = assembleTeachingContext(topic, evidence);
  const strategy = createTeachingStrategy(intent, context);
  const visualPlan = createVisualPlan(context, strategy);
  const practiceAssessment = createPracticeAssessment(context, strategy);
  const sections = plannedSections(strategy, visualPlan);
  const existing = await loadSessionState(sessionId);
  let session =
    existing?.topic === topic
      ? existing
      : createSessionState(
          sessionId,
          topic,
          context.canonicalConcept,
          intent.learningMode,
          intent.depth,
          context.repositoryGap,
          context.provenance,
        );
  let actionResult = NO_RESULT;
  const action = request.action ?? "none";
  if (action === "explain") session = completeSection(session, "explanation", sections);
  if (action === "complete") {
    const section = request.section?.trim() ?? "";
    if (!section) throw new ValidationError("section is required for complete action.");
    session = completeSection(session, section, sections);
  }
  if (action === "answer-practice" || action === "answer-assessment") {
    ({ session, actionResult } = gradeAnswer(session, action, request, context, practiceAssessment));
  }
  session = advanceSession(session, sections);
  await saveSessionState(session);
  const evaluation = evaluateMastery(session);
  return {
    intent,
    context,
    strategy,
    visualPlan,
    practiceAssessment,
    session,
    evaluation,
    nextStep: getNextStep(session, sections),
    actionResult,
  };
}
