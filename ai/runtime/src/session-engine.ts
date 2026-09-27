import type { AssessmentAttempt, PracticeAttempt, TutorSessionState } from "./session-state.js";
import {
  completeSection,
  recordAssessmentAttempt,
  recordPracticeAttempt,
  getNextStep
} from "./session-state.js";
import { evaluateMastery } from "./mastery-evaluator.js";

export type SessionAction =
  | {
      type: "complete-section";
      section: string;
    }
  | {
      type: "practice-attempt";
      attempt: PracticeAttempt;
    }
  | {
      type: "assessment-attempt";
      attempt: AssessmentAttempt;
    };

export function applySessionAction(
  state: TutorSessionState,
  action: SessionAction
): TutorSessionState {
  if (action.type === "complete-section") {
    return completeSection(state, action.section);
  }

  if (action.type === "practice-attempt") {
    return recordPracticeAttempt(state, action.attempt);
  }

  return recordAssessmentAttempt(state, action.attempt);
}

export function canManuallyCompleteSection(
  state: TutorSessionState,
  section: string,
  plannedSections: string[] = []
): boolean {
  if (state.completedSections.includes(section)) {
    return true;
  }

  if (plannedSections.length > 0) {
    const index = plannedSections.indexOf(section);

    if (index === -1) {
      return false;
    }

    const prerequisites = plannedSections.slice(0, index);

    if (
      prerequisites.some(
        prerequisite => !state.completedSections.includes(prerequisite)
      )
    ) {
      return false;
    }
  }

  if (section === "practice") {
    return state.practiceAttempts.some(
      attempt => attempt.correct === true
    );
  }

  if (section === "assessment") {
    return state.assessmentAttempts.some(
      attempt => attempt.correct === true
    );
  }

  return true;
}

export function advanceSession(
  state: TutorSessionState,
  plannedSections: string[]
): TutorSessionState {
  const evaluation = evaluateMastery(state);

  if (evaluation.decision === "complete") {
    return {
      ...state,
      mastery: "complete"
    };
  }

  if (evaluation.decision === "review") {
    return {
      ...state,
      mastery: "assessing"
    };
  }

  if (evaluation.decision === "continue-practice") {
    return {
      ...state,
      mastery: "practicing"
    };
  }

  if (evaluation.decision === "continue-assessment") {
    return {
      ...state,
      mastery:
        state.assessmentAttempts.length > 0
          ? "assessing"
          : "practicing"
    };
  }

  if (evaluation.decision === "blocked") {
    return {
      ...state,
      mastery: "not-started"
    };
  }

  const next = getNextStep(state, plannedSections);

  return next
    ? state
    : {
        ...state,
        mastery: "complete"
      };
}
