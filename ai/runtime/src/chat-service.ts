/**
 * One chat turn: understand the question → search the notes → stream an answer → check it.
 *
 *   meta    sources found, intents, confidence (sent before any answer text)
 *   status  thinking / writing / fallback notices
 *   delta   answer text as it is written
 *   done    citation check, follow-up suggestions, usage
 *
 * With an AI model the answer is written by Claude from the sources. Without one, or when the
 * model fails or declines, the answer is assembled from the notes themselves.
 */
import type Anthropic from "@anthropic-ai/sdk";
import { createAnswerModel, describeModelError, type AnswerModel } from "./answer-model.js";
import { renderUserTurn, SYSTEM_PROMPT } from "./answer-prompt.js";
import type { AnswerMode, ChatEvent, ChatRequest, Evidence } from "./chat-contracts.js";
import { buildEvidence, checkGrounding, composeRepositoryAnswer, MAX_EVIDENCE, suggestFollowUps } from "./chat-evidence.js";
import { getFollowUps } from "./question-index.js";
import { searchQuestions, type SearchConfidence, type SearchResult } from "./question-search.js";

export const MAX_HISTORY_TURNS = 8;
const CONFIDENCE_RANK: Record<SearchConfidence, number> = { none: 0, low: 1, medium: 2, high: 3 };

export interface ChatOptions {
  /** Inject a model (tests); null forces notes-only answers; undefined reads the environment. */
  model?: AnswerModel | null;
  signal?: AbortSignal;
}

/**
 * Short follow-ups ("show me the code", "why?") rarely match on their own, so when the message
 * alone matches weakly, search again together with the previous question and keep the better match.
 */
export function searchWithContext(request: ChatRequest): { search: SearchResult; searchedFor: string } {
  const options = { limit: MAX_EVIDENCE, topic: request.topic };
  const direct = searchQuestions(request.message, options);
  const previous = [...(request.history ?? [])].reverse().find(turn => turn.role === "user")?.content;
  if (!previous || CONFIDENCE_RANK[direct.confidence] >= CONFIDENCE_RANK.medium) return { search: direct, searchedFor: request.message };
  const combinedQuery = `${previous} ${request.message}`;
  const combined = searchQuestions(combinedQuery, options);
  return CONFIDENCE_RANK[combined.confidence] > CONFIDENCE_RANK[direct.confidence]
    ? { search: combined, searchedFor: combinedQuery }
    : { search: direct, searchedFor: request.message };
}

function buildMessages(request: ChatRequest, search: SearchResult, evidence: Evidence[]): Anthropic.Beta.BetaMessageParam[] {
  const history = (request.history ?? []).slice(-MAX_HISTORY_TURNS);
  // The conversation must start with a user turn.
  while (history.length && history[0].role !== "user") history.shift();
  return [
    ...history.map(turn => ({ role: turn.role, content: turn.content })),
    { role: "user" as const, content: renderUserTurn(request.message, search, evidence) },
  ];
}

/** Paragraph-sized chunks, so notes-only answers stream like model answers. */
function chunks(text: string): string[] {
  return text.split(/(?<=\n\n)/);
}

export async function* runChat(request: ChatRequest, options: ChatOptions = {}): AsyncGenerator<ChatEvent> {
  const model = options.model === undefined ? createAnswerModel() : options.model;
  const { search, searchedFor } = searchWithContext(request);
  const evidence = await buildEvidence(search);
  const followUpQuestions = evidence[0] ? (await getFollowUps(evidence[0].id)).map(entry => entry.question) : [];

  yield {
    type: "meta",
    query: request.message,
    searchedFor,
    intents: search.intents,
    confidence: search.confidence,
    mode: search.mode,
    topics: search.topics.map(item => item.topic),
    entities: search.entities,
    evidence,
    answerMode: model ? "claude" : "repository",
  };

  let answer = "";
  let modelName: string | null = null;
  let notice: string | null = null;
  let usage: Extract<ChatEvent, { type: "done" }>["usage"] = null;
  let needsRepositoryAnswer = !model;

  if (model) {
    let announcedWriting = false;
    try {
      for await (const event of model.stream({ system: SYSTEM_PROMPT, messages: buildMessages(request, search, evidence), signal: options.signal })) {
        if (event.type === "thinking") {
          yield { type: "status", stage: "thinking" };
        } else if (event.type === "fallback") {
          yield { type: "status", stage: "fallback", message: `${event.from} declined; ${event.to} continued the answer.` };
        } else if (event.type === "text") {
          if (!announcedWriting) {
            announcedWriting = true;
            yield { type: "status", stage: "writing" };
          }
          answer += event.text;
          yield { type: "delta", text: event.text };
        } else if (event.type === "final") {
          modelName = event.model;
          usage = event.usage;
          if (event.refusal) notice = "The AI model declined this request.";
          else if (event.stopReason === "max_tokens") notice = "The answer was cut off because it reached the length limit.";
        }
      }
      if (!answer.trim()) {
        notice = notice ?? "The AI model returned no answer.";
        needsRepositoryAnswer = true;
      } else if (notice === "The AI model declined this request.") {
        needsRepositoryAnswer = true;
      }
    } catch (error) {
      const described = describeModelError(error);
      if (described.aborted) return;
      notice = described.message;
      needsRepositoryAnswer = true;
    }
    if (needsRepositoryAnswer) {
      yield { type: "status", stage: "fallback", message: `${notice} Showing the answer from your notes.` };
    }
  }

  // "claude" only when the model actually wrote part of the answer.
  const answerMode: AnswerMode = answer.trim() ? "claude" : "repository";
  if (needsRepositoryAnswer) {
    const fromNotes = composeRepositoryAnswer(search, evidence);
    const text = answer.trim() ? `\n\n---\n\n_Answer from your notes:_\n\n${fromNotes}` : fromNotes;
    for (const piece of chunks(text)) {
      answer += piece;
      yield { type: "delta", text: piece };
    }
  }

  yield {
    type: "done",
    answerMode,
    model: modelName,
    grounding: checkGrounding(answer, evidence),
    followUps: suggestFollowUps(search, evidence, followUpQuestions),
    suggestions: search.suggestions,
    notice,
    usage,
  };
}
