/**
 * Follow-up questions ("give me a code example", "why is it useful?") build on the previous answer.
 * They are searched together with the previous question, and answered with only what they add:
 * the code, the diagram, or the paragraphs about the new point — never the same explanation again.
 */
import type { ChatRequest, Evidence } from "./chat-contracts.js";
import { learningResources, resourceQuery } from "./chat-guidance.js";
import { terms, type SearchResult } from "./question-search.js";

/** Words that point back at the previous answer. */
const REFERRING = /\b(it|its|this|that|these|those|them|they|above|same|previous|earlier)\b/i;
const MAX_FOLLOW_UP_WORDS = 10;

export interface PreviousTurn {
  question: string;
  answer: string;
}

/** The last question and the answer that followed it, if any. */
export function previousTurn(request: ChatRequest): PreviousTurn | null {
  const history = request.history ?? [];
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].role !== "user") continue;
    const reply = history[i + 1];
    return { question: history[i].content, answer: reply?.role === "assistant" ? reply.content : "" };
  }
  return null;
}

/**
 * A short question that refers back ("why is it useful?") or names no subject of its own ("show me the code").
 * A question that names a topic, domain, role or term ("Explore Java") has its own subject.
 */
export function looksLikeFollowUp(message: string, direct: SearchResult): boolean {
  const words = message.trim().split(/\s+/).filter(Boolean).length;
  if (words === 0 || words > MAX_FOLLOW_UP_WORDS) return false;
  const namesSubject = direct.topics.length > 0 || direct.entities.length > 0 || direct.domain !== null;
  if (REFERRING.test(message)) return true;
  // "Where do I start?" opens something of its own (the roadmap index), whatever came before.
  if (direct.mode === "browse" && direct.hits.length > 0) return false;
  return direct.terms.length === 0 && !namesSubject;
}

// ---------- Pieces of a note ----------

/** Fenced code blocks in a Markdown answer, each with its fences. */
export function codeBlocks(markdown: string): string[] {
  const blocks: string[] = [];
  let current: string[] | null = null;
  for (const line of markdown.split("\n")) {
    const fence = line.trimStart().startsWith("```");
    if (current) {
      current.push(line);
      if (fence) {
        blocks.push(current.join("\n"));
        current = null;
      }
    } else if (fence) {
      current = [line];
    }
  }
  return blocks;
}

/** Prose paragraphs (code blocks removed). */
function paragraphs(markdown: string): string[] {
  let prose = markdown;
  for (const block of codeBlocks(markdown)) prose = prose.split(block).join("\n\n");
  return prose
    .split(/\n\s*\n/)
    .map(part => part.trim())
    .filter(part => part && !part.startsWith("!["));
}

const normalized = (text: string) => text.replace(/\s+/g, " ").trim();
const alreadySaid = (piece: string, previousAnswer: string) => normalized(previousAnswer).includes(normalized(piece));

// ---------- Answers ----------

/** What the conversation is about, from the previous question: "What is a Closure?" → "Closure". */
function subjectOf(previous: PreviousTurn): string {
  return resourceQuery(previous.question).replace(/^(a|an|the)\s+/i, "") || previous.question;
}

/** Nothing (more) in the notes: say so, and point to places that have it. */
function nothingNew(what: string, subject: string, query: string, topics: string[]): string {
  return [`Your notes don't have ${what} for **${subject}** beyond the previous answer yet — more will be added in a future update.`, "", learningResources(query, topics)].join("\n");
}

/**
 * Pieces (code blocks or images) for a "show me the code / a diagram" follow-up: ones not shown yet first;
 * otherwise the ones from the previous answer, shown on their own without the explanation around them.
 */
function pickPieces(
  found: Evidence[],
  previous: PreviousTurn,
  piecesOf: (item: Evidence) => string[],
): { item: Evidence; pieces: string[]; repeated: boolean } | null {
  // Stay on the subject's topic: after a JavaScript answer, "show me the code" shows JavaScript,
  // even when a note on another language ranks second.
  const subject = new Set(found[0]?.topics ?? []);
  const onTopic = (item: Evidence) => item.topics.some(topic => subject.has(topic));
  const evidence = subject.size ? [...found.filter(onTopic), ...found.filter(item => !onTopic(item))] : found;
  for (const item of evidence) {
    const pieces = piecesOf(item).filter(piece => !alreadySaid(piece, previous.answer));
    if (pieces.length) return { item, pieces, repeated: false };
  }
  for (const item of evidence) {
    const pieces = piecesOf(item);
    if (pieces.length) return { item, pieces, repeated: true };
  }
  return null;
}

function piecesAnswer(heading: string, found: { item: Evidence; pieces: string[]; repeated: boolean }): string {
  const note = found.repeated ? " (from the previous answer; your notes have no other)" : "";
  return [`**${heading}**${note} — _${found.item.question}_ [${found.item.n}]`, "", ...found.pieces.slice(0, 2).flatMap(piece => [piece, ""])].join("\n").trim();
}

const isMermaid = (block: string) => /^\s*```\s*mermaid\b/i.test(block);

function codeAnswer(evidence: Evidence[], previous: PreviousTurn, topics: string[]): string {
  const found = pickPieces(evidence, previous, item => codeBlocks(item.answer ?? "").filter(block => !isMermaid(block)));
  if (found) return piecesAnswer("Code example", found);
  const subject = subjectOf(previous);
  return nothingNew("a code example", subject, `${subject} code example`, topics);
}

function visualAnswer(evidence: Evidence[], previous: PreviousTurn, topics: string[]): string {
  // Images first, then Mermaid diagrams written in the note.
  const found = pickPieces(evidence, previous, item => [
    ...item.visuals.map(visual => `![${visual.alt || item.question}](${visual.url})`),
    ...codeBlocks(item.answer ?? "").filter(isMermaid),
  ]);
  if (found) return piecesAnswer("Diagram", found);
  const subject = subjectOf(previous);
  return nothingNew("a diagram", subject, `${subject} diagram explained`, topics);
}

/** Paragraphs about the new point (matching the follow-up's own words) that the previous answer did not include. */
function excerptAnswer(message: string, evidence: Evidence[], previous: PreviousTurn, topics: string[]): string {
  const wanted = new Set(terms(message));
  for (const item of evidence) {
    const unsaid = paragraphs(item.answer ?? "")
      .filter(part => terms(part).some(term => wanted.has(term)))
      .filter(part => !alreadySaid(part, previous.answer));
    if (unsaid.length) return [`From _${item.question}_ [${item.n}]:`, "", ...unsaid.slice(0, 4).flatMap(part => [part, ""])].join("\n").trim();
  }
  const subject = subjectOf(previous);
  return nothingNew("more on this", subject, `${subject} ${resourceQuery(message)}`, topics);
}

/**
 * The notes' answer to a follow-up: only what it adds. Returns null when the follow-up leads to a different
 * entry than the previous answer covered (then the normal answer is new information and should be shown).
 */
export function composeFollowUpAnswer(message: string, search: SearchResult, evidence: Evidence[], previous: PreviousTurn): string | null {
  const topics = search.topics.map(item => item.topic);
  if (search.intents.includes("code")) return codeAnswer(evidence, previous, topics);
  if (search.intents.includes("visual")) return visualAnswer(evidence, previous, topics);
  const top = evidence[0];
  if (!top || !alreadyAnswered(top, previous.answer)) return null;
  return excerptAnswer(message, evidence, previous, topics);
}

/**
 * The previous answer explained this entry, not just named it. A study path or overview lists question
 * titles as links; that is not an answer, so the full entry should still be shown.
 */
function alreadyAnswered(entry: Evidence, previousAnswer: string): boolean {
  // Answers no longer repeat the question as a title, so the entry's own text is what shows it was explained.
  const body = paragraphs(entry.answer ?? "").filter(part => part.length > 40);
  if (!body.length) return previousAnswer.includes(entry.question);
  return body.some(part => alreadySaid(part, previousAnswer));
}
