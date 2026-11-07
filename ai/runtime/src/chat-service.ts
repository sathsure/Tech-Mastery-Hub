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
import type { AnswerMode, AnswerView, ChatEvent, ChatRequest, Evidence } from "./chat-contracts.js";
import { buildEvidence, checkGrounding, composeRepositoryAnswer, MAX_EVIDENCE, suggestFollowUps, withoutTrailingParentheses } from "./chat-evidence.js";
import { cardsBlock, conciseTitle, countryCard, isCountryNote, roleCard } from "./chat-cards.js";
import type { QuestionEntry } from "./question-index-contracts.js";
import { buildLearningPlan, buildOverview, buildTopicList, learningResources, LEARN_MORE_HEADING } from "./chat-guidance.js";
import { composeFollowUpAnswer, looksLikeFollowUp, previousTurn } from "./chat-followup.js";
import { TOPIC_DESCRIPTIONS, topicLabel } from "./topic-labels.js";
import { getFollowUps, loadQuestionIndex } from "./question-index.js";
import { searchQuestions, type SearchConfidence, type SearchResult } from "./question-search.js";

export const MAX_HISTORY_TURNS = 8;
const CONFIDENCE_RANK: Record<SearchConfidence, number> = { none: 0, low: 1, medium: 2, high: 3 };

export interface ChatOptions {
  /** Inject a model (tests); null forces notes-only answers; undefined reads the environment. */
  model?: AnswerModel | null;
  signal?: AbortSignal;
}

/**
 * Follow-ups ("show me the code", "why is it useful?") are about the previous question, so they are searched
 * together with it. Other questions that match weakly on their own also try the combined search and keep the
 * better match. `followUp` is true when the answer continues the previous one.
 */
export function searchWithContext(request: ChatRequest): { search: SearchResult; searchedFor: string; followUp: boolean } {
  const options = { limit: MAX_EVIDENCE, topic: request.topic };
  const direct = searchQuestions(request.message, options);
  const previous = previousTurn(request)?.question;
  const own = { search: direct, searchedFor: request.message, followUp: false };
  if (!previous) return own;
  const followUp = looksLikeFollowUp(request.message, direct);
  if (!followUp && CONFIDENCE_RANK[direct.confidence] >= CONFIDENCE_RANK.medium) return own;
  const combinedQuery = `${previous} ${request.message}`;
  const combined = searchQuestions(combinedQuery, options);
  if (followUp && combined.confidence !== "none") {
    // The combined search names the previous subject; the intents (code, diagram…) are the follow-up's own.
    return { search: { ...combined, intents: direct.intents }, searchedFor: combinedQuery, followUp: true };
  }
  // A new question that only matches better with the previous one for context: a normal answer, not a follow-up.
  if (CONFIDENCE_RANK[combined.confidence] > CONFIDENCE_RANK[direct.confidence]) {
    return { search: combined, searchedFor: combinedQuery, followUp: false };
  }
  return own;
}

function buildMessages(request: ChatRequest, search: SearchResult, evidence: Evidence[], followUp: boolean): Anthropic.Beta.BetaMessageParam[] {
  const history = (request.history ?? []).slice(-MAX_HISTORY_TURNS);
  // The conversation must start with a user turn.
  while (history.length && history[0].role !== "user") history.shift();
  return [
    ...history.map(turn => ({ role: turn.role, content: turn.content })),
    { role: "user" as const, content: renderUserTurn(request.message, search, evidence, followUp ? previousTurn(request)?.question : undefined) },
  ];
}

/** Paragraph-sized chunks, so notes-only answers stream like model answers. */
function chunks(text: string): string[] {
  return text.split(/(?<=\n\n)/);
}

/** The single topic an overview request is about ("Explore Java", "What roles are there in IT?"), if any. */
function overviewTopics(search: SearchResult, evidence: Evidence[]): string[] {
  if (search.mode !== "browse" || evidence[0]?.kind === "roadmap") return [];
  const named = search.topics.map(item => item.topic);
  if (named.length) return named;
  // A domain ("Explore frontend"): the learning topics found in it, most material first.
  if (search.domain) return search.facets.map(item => item.topic).filter(topic => topic in TOPIC_DESCRIPTIONS && !ATLAS_TOPICS.has(topic)).slice(0, 8);
  return search.strategy.narrowedTo.filter(topic => topic !== "roadmaps");
}

const ATLAS_TOPICS = new Set(["it-roles", "it-terminology", "tech-stack", "it-careers", "roadmaps"]);

/**
 * A medium match where the best entry covers half the question or less matched on a side word
 * ("quantum entanglement" → a quantum computing job role). Treat it as weak, not as an answer.
 */
export function judgeMatch(search: SearchResult): SearchResult {
  if (search.mode !== "search" || search.confidence !== "medium") return search;
  const best = search.hits.find(hit => hit.matchedBy === "search");
  return best && best.coverage <= 0.5 ? { ...search, confidence: "low" } : search;
}

/** Built answers (overviews, plans) stream like the others but need no model. */
async function* builtAnswer(
  request: ChatRequest,
  search: SearchResult,
  view: AnswerView,
  text: string,
  followUps: string[],
  evidence: Evidence[] = [],
): AsyncGenerator<ChatEvent> {
  yield {
    type: "meta",
    query: request.message,
    searchedFor: request.message,
    intents: search.intents,
    confidence: search.confidence,
    mode: search.mode,
    topics: search.topics.map(item => item.topic),
    entities: search.entities,
    evidence,
    answerMode: "repository",
  };
  for (const piece of chunks(text)) yield { type: "delta", text: piece };
  yield {
    type: "done",
    answerMode: "repository",
    view,
    model: null,
    grounding: { ...checkGrounding(text, evidence), uncited: false },
    followUps,
    suggestions: { topics: [], questions: [] },
    notice: null,
    usage: null,
  };
}

/** Next steps after a topic overview: study, quiz, interview. Atlas sections have no study path. */
function topicFollowUps(topic: string): string[] {
  if (ATLAS_TOPICS.has(topic)) return [];
  const label = topicLabel(topic);
  return [`${label} study path`, `Quiz me on ${label}`, `Prepare me for a ${label} interview`];
}

/** A search result with no hits, used as the frame for built answers. */
function emptySearch(overrides: Partial<SearchResult>): SearchResult {
  return { ...searchQuestions("", { limit: 1 }), confidence: "high", ...overrides };
}

/** A learning plan or a topic overview asked for directly, or null when the request needs a search. */
async function directAnswer(request: ChatRequest): Promise<AsyncGenerator<ChatEvent> | null> {
  if (request.plan) {
    const name = request.plan.title.replace(/^Roadmap:\s*/i, "");
    const followUps = /^Roadmap:/i.test(request.plan.title) ? [`What does a ${name} do?`, `${name} salary in India (LPA)`] : [];
    return builtAnswer(request, emptySearch({ intents: ["roadmap"] }), "plan", buildLearningPlan(request.plan), followUps);
  }
  if (!request.overview || request.overview === "roadmaps") return null;
  const overview = await buildOverview(request.overview);
  if (!overview) return null;
  return builtAnswer(request, emptySearch({ mode: "browse" }), "overview", overview.markdown, topicFollowUps(request.overview));
}

/** Overviews show the main sections first; details come when the user opens one. */
async function overviewAnswer(
  request: ChatRequest,
  search: SearchResult,
  evidence: Evidence[],
): Promise<AsyncGenerator<ChatEvent> | null> {
  const topics = overviewTopics(search, evidence);
  if (topics.length > 1) {
    const followUps = topics.slice(0, 3).map(topic => `Explore ${topicLabel(topic)}`);
    return builtAnswer(request, search, "overview", await buildTopicList(topics), followUps);
  }
  if (topics.length === 0) return null;
  const overview = await buildOverview(topics[0]);
  return overview ? builtAnswer(request, search, "overview", overview.markdown, topicFollowUps(topics[0])) : null;
}

/** Intents a role card doesn't answer: they need the roadmap, a comparison or practice instead. */
const NOT_A_ROLE_CARD = new Set<SearchResult["intents"][number]>(["compare", "roadmap", "interview-prep", "quiz", "code", "visual", "debug"]);

const WORKING_ABROAD = /^Working Abroad from India \([^)]*\)$/;

function roleCardMarkdown(entry: QuestionEntry, entries: QuestionEntry[]): string {
  const name = withoutTrailingParentheses(conciseTitle(entry));
  const roadmap = entries.find(item => item.kind === "roadmap" && withoutTrailingParentheses(item.question.replace(/^Roadmap:\s*/, "")) === name);
  const topic = (entry.relatedTopics ?? []).find(item => item in TOPIC_DESCRIPTIONS && !ATLAS_TOPICS.has(item));
  const card = roleCard(entry, {
    roadmap: roadmap ? `Roadmap to become a ${name}` : null,
    interviewTopic: topic ? topicLabel(topic) : null,
  });
  return cardsBlock([card]);
}

/** All countries as cards, most realistic first, under the overview's own disclaimer. */
function countriesMarkdown(overview: QuestionEntry, entries: QuestionEntry[]): string {
  const cards = entries.filter(isCountryNote).flatMap(entry => countryCard(entry, overview) ?? []);
  const disclaimer = overview.answer.split("\n").find(line => line.startsWith("> "));
  return ["**Working abroad from India**", "", disclaimer ? `_${disclaimer.slice(2).trim()}_` : "", "", cardsBlock(cards)].join("\n");
}

/**
 * Career roles and the countries overview read best as cards. They are built from the notes in both
 * answer modes, so every field is exactly what the notes say.
 */
async function cardAnswer(
  request: ChatRequest,
  search: SearchResult,
  evidence: Evidence[],
  followUp: boolean,
): Promise<AsyncGenerator<ChatEvent> | null> {
  const top = evidence[0];
  if (!top || followUp || CONFIDENCE_RANK[search.confidence] < CONFIDENCE_RANK.medium) return null;
  const { entries } = await loadQuestionIndex();
  const entry = entries.find(item => item.id === top.id);
  if (!entry) return null;
  if (entry.kind === "role" && !search.intents.some(intent => NOT_A_ROLE_CARD.has(intent))) {
    return builtAnswer(request, search, "answer", roleCardMarkdown(entry, entries), suggestFollowUps(search, evidence, []), [top]);
  }
  if (entry.kind === "note" && WORKING_ABROAD.test(entry.question)) {
    const followUps = ["Working in Germany from India", "How to actually get an interview abroad"];
    return builtAnswer(request, search, "answer", countriesMarkdown(entry, entries), followUps, [top]);
  }
  return null;
}

/** What the model produced; the caller decides whether the notes must fill in. */
interface ModelOutcome {
  answer: string;
  model: string | null;
  usage: Extract<ChatEvent, { type: "done" }>["usage"];
  notice: string | null;
  /** The model failed, declined or wrote nothing: answer from the notes. */
  needsNotes: boolean;
  aborted: boolean;
}

const DECLINED = "The AI model declined this request.";

function finalNotice(refusal: unknown, stopReason: string | null): string | null {
  if (refusal) return DECLINED;
  if (stopReason === "max_tokens") return "The answer was cut off because it reached the length limit.";
  return null;
}

/** Streams the model's answer as chat events and returns what it produced. */
async function* streamModelAnswer(
  model: AnswerModel,
  request: ChatRequest,
  search: SearchResult,
  evidence: Evidence[],
  signal: AbortSignal | undefined,
  followUp: boolean,
): AsyncGenerator<ChatEvent, ModelOutcome> {
  const outcome: ModelOutcome = { answer: "", model: null, usage: null, notice: null, needsNotes: false, aborted: false };
  let announcedWriting = false;
  try {
    const messages = buildMessages(request, search, evidence, followUp);
    for await (const event of model.stream({ system: SYSTEM_PROMPT, messages, signal })) {
      if (event.type === "thinking") {
        yield { type: "status", stage: "thinking" };
      } else if (event.type === "fallback") {
        yield { type: "status", stage: "fallback", message: `${event.from} declined; ${event.to} continued the answer.` };
      } else if (event.type === "text") {
        if (!announcedWriting) {
          announcedWriting = true;
          yield { type: "status", stage: "writing" };
        }
        outcome.answer += event.text;
        yield { type: "delta", text: event.text };
      } else if (event.type === "final") {
        outcome.model = event.model;
        outcome.usage = event.usage;
        outcome.notice = finalNotice(event.refusal, event.stopReason);
      }
    }
    if (!outcome.answer.trim()) outcome.notice ??= "The AI model returned no answer.";
    outcome.needsNotes = !outcome.answer.trim() || outcome.notice === DECLINED;
  } catch (error) {
    const described = describeModelError(error);
    outcome.aborted = described.aborted;
    outcome.notice = described.message;
    outcome.needsNotes = true;
  }
  return outcome;
}

/** Text added after the model's answer: the notes' own answer when needed, then outside resources for weak matches. */
/** The notes' own answer; a follow-up gets only what it adds to the previous answer. */
function notesAnswer(request: ChatRequest, search: SearchResult, evidence: Evidence[], followUp: boolean): string {
  const previous = followUp ? previousTurn(request) : null;
  const added = previous ? composeFollowUpAnswer(request.message, search, evidence, previous) : null;
  return added ?? composeRepositoryAnswer(search, evidence);
}

function closingPieces(
  request: ChatRequest,
  search: SearchResult,
  evidence: Evidence[],
  outcome: ModelOutcome,
  followUp: boolean,
): string[] {
  const pieces: string[] = [];
  if (outcome.needsNotes) {
    const fromNotes = notesAnswer(request, search, evidence, followUp);
    pieces.push(...chunks(outcome.answer.trim() ? `\n\n---\n\n_Answer from your notes:_\n\n${fromNotes}` : fromNotes));
  }
  // When the notes don't clearly answer, point to trusted places to learn instead of guessing.
  const text = outcome.answer + pieces.join("");
  // Follow-ups add their own subject-aware links when the notes have nothing more.
  if (!followUp && search.confidence !== "high" && text.trim() && !text.includes(LEARN_MORE_HEADING)) {
    pieces.push(`\n\n${learningResources(request.message, search.topics.map(item => item.topic))}`);
  }
  return pieces;
}

export async function* runChat(request: ChatRequest, options: ChatOptions = {}): AsyncGenerator<ChatEvent> {
  const model = options.model === undefined ? createAnswerModel() : options.model;
  const direct = await directAnswer(request);
  if (direct) {
    yield* direct;
    return;
  }

  const found = searchWithContext(request);
  const search = judgeMatch(found.search);
  const evidence = await buildEvidence(search);
  const overview = await overviewAnswer(request, search, evidence);
  if (overview) {
    yield* overview;
    return;
  }
  const cards = await cardAnswer(request, search, evidence, found.followUp);
  if (cards) {
    yield* cards;
    return;
  }

  const followUpQuestions = evidence[0] ? (await getFollowUps(evidence[0].id)).map(entry => entry.question) : [];
  yield {
    type: "meta",
    query: request.message,
    searchedFor: found.searchedFor,
    intents: search.intents,
    confidence: search.confidence,
    mode: search.mode,
    topics: search.topics.map(item => item.topic),
    entities: search.entities,
    evidence,
    answerMode: model ? "claude" : "repository",
  };

  let outcome: ModelOutcome = { answer: "", model: null, usage: null, notice: null, needsNotes: true, aborted: false };
  if (model) {
    outcome = yield* streamModelAnswer(model, request, search, evidence, options.signal, found.followUp);
    if (outcome.aborted) return;
    if (outcome.needsNotes) {
      yield { type: "status", stage: "fallback", message: `${outcome.notice} Showing the answer from your notes.` };
    }
  }

  // "claude" only when the model actually wrote part of the answer.
  const answerMode: AnswerMode = outcome.answer.trim() ? "claude" : "repository";
  let answer = outcome.answer;
  for (const piece of closingPieces(request, search, evidence, outcome, found.followUp)) {
    answer += piece;
    yield { type: "delta", text: piece };
  }

  yield {
    type: "done",
    answerMode,
    view: "answer",
    model: outcome.model,
    // Notes-only answers quote the sources rather than cite them, so a missing [n] is not a warning.
    grounding: { ...checkGrounding(answer, evidence), ...(answerMode === "repository" ? { uncited: false } : {}) },
    // A weak match's own follow-ups would lead away from the question; the answer lists the closest entries instead.
    followUps: search.confidence === "low" ? [] : suggestFollowUps(search, evidence, followUpQuestions),
    suggestions: search.suggestions,
    notice: outcome.notice,
    usage: outcome.usage,
  };
}
