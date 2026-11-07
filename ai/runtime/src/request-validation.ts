import type { TutorApiRequest, ApiAction } from "./api-contracts.js";

/** A problem with the client's request: reported as HTTP 400 with its message. */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

const ACTIONS = new Set<ApiAction>([
  "none",
  "explain",
  "practice",
  "assessment",
  "complete",
  "answer-practice",
  "answer-assessment",
]);
const MODES = new Set(["learn", "interview", "practice", "navigate"]);
const VISUALS = new Set(["auto", "required", "none"]);
const DEPTHS = new Set(["basic", "intermediate", "deep"]);

/** Optional string fields: each must be a string within its length limit, or one of its allowed values. */
const OPTIONAL_FIELDS: Array<{ name: string; maxLength?: number; allowed?: Set<string>; message: string }> = [
  { name: "sessionId", maxLength: 100, message: "sessionId must be a string of 100 characters or fewer." },
  { name: "action", allowed: ACTIONS as Set<string>, message: "action is invalid." },
  { name: "answer", maxLength: 5000, message: "answer must be 5000 characters or fewer." },
  { name: "section", maxLength: 100, message: "section must be a string of 100 characters or fewer." },
  { name: "learningMode", allowed: MODES, message: "learningMode is invalid." },
  { name: "visualPreference", allowed: VISUALS, message: "visualPreference is invalid." },
  { name: "depth", allowed: DEPTHS, message: "depth is invalid." },
];

function optionalFieldValid(value: unknown, field: (typeof OPTIONAL_FIELDS)[number]): boolean {
  if (value === undefined) return true;
  if (typeof value !== "string") return false;
  if (field.maxLength !== undefined && value.length > field.maxLength) return false;
  return !field.allowed || field.allowed.has(value);
}

export function validateTutorRequest(value: unknown): TutorApiRequest {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new ValidationError("Request body must be a JSON object.");
  const input = value as Record<string, unknown>;
  if (typeof input.topic !== "string" || !input.topic.trim()) throw new ValidationError("topic is required.");
  if (input.topic.trim().length > 300) throw new ValidationError("topic must be 300 characters or fewer.");
  for (const field of OPTIONAL_FIELDS) {
    if (!optionalFieldValid(input[field.name], field)) throw new ValidationError(field.message);
  }
  return input as unknown as TutorApiRequest;
}

export function validateActionRequirements(request: TutorApiRequest): void {
  const action = request.action ?? "none";
  const answerAction = action === "answer-practice" || action === "answer-assessment";
  if (answerAction && !request.answer?.trim()) throw new ValidationError("answer is required for answer actions.");
  if (action === "complete" && !request.section?.trim()) throw new ValidationError("section is required for complete action.");
}
