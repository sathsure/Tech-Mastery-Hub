import { GENERATED_HEADING, type Evidence, type Grounding } from "./chat-contracts.js";
import { loadQuestionIndex } from "./question-index.js";
import type { QuestionEntry } from "./question-index-contracts.js";
import type { SearchResult } from "./question-search.js";
import { topicLabel } from "./topic-labels.js";

const VISUAL_ROOT = "knowledge/visual-notes/";
/** Sources passed with their full answer; the rest go as summaries so the model sees what else exists. */
const FULL_ANSWERS = 4;
export const MAX_EVIDENCE = 6;

/** Browser URL for an image: repository images are served by GET /visuals/..., external ones as-is. */
export function visualUrl(visual: QuestionEntry["visuals"][number]): string | null {
  if (!visual.exists || !visual.path) return null;
  if (visual.origin === "external") return visual.path;
  if (!visual.path.startsWith(VISUAL_ROOT)) return null;
  return `/visuals/${visual.path.slice(VISUAL_ROOT.length).split("/").map(encodeURIComponent).join("/")}`;
}

/** Point image references in an answer at URLs the browser can load. */
export function rewriteImages(markdown: string, entry: QuestionEntry): string {
  let text = markdown;
  for (const visual of entry.visuals) {
    const url = visualUrl(visual);
    if (url && visual.reference !== url) text = text.split(visual.reference).join(url);
  }
  return text;
}

/** Search hits scoring below this share of the best hit are left out: they matched on a stray word. */
export const RELEVANCE_CUTOFF = 0.6;

/** The hits worth showing: named entries always, plus search hits close enough to the best one. */
export function relevantHits(search: SearchResult): SearchResult["hits"] {
  if (search.mode !== "search") return search.hits;
  const best = Math.max(0, ...search.hits.filter(hit => hit.matchedBy === "search").map(hit => hit.score));
  return search.hits.filter(hit => hit.matchedBy === "name" || hit.score >= best * RELEVANCE_CUTOFF);
}

export async function buildEvidence(search: SearchResult): Promise<Evidence[]> {
  const index = await loadQuestionIndex();
  const byId = new Map(index.entries.map(entry => [entry.id, entry]));
  return relevantHits(search).slice(0, MAX_EVIDENCE).flatMap((hit, position): Evidence[] => {
    const entry = byId.get(hit.id);
    if (!entry) return [];
    const visuals = entry.visuals.flatMap(visual => {
      const url = visualUrl(visual);
      return url ? [{ url, alt: visual.alt }] : [];
    });
    return [
      {
        n: position + 1,
        id: entry.id,
        kind: entry.kind,
        question: entry.question,
        summary: entry.summary,
        topics: entry.topics,
        relatedTopics: entry.relatedTopics ?? [],
        section: entry.section,
        path: entry.source.path,
        startLine: entry.source.startLine,
        endLine: entry.source.endLine,
        answer: position < FULL_ANSWERS ? rewriteImages([entry.prompt ?? "", entry.answer].filter(Boolean).join("\n\n"), entry) : null,
        codeLanguages: hit.codeLanguages,
        visuals,
        matchedBy: hit.matchedBy,
      },
    ];
  });
}

/** Removes code so `arr[0]` is not read as a citation. */
function withoutCode(markdown: string): string {
  return markdown.replace(/```[\s\S]*?```/g, " ").replace(/`[^`\n]*`/g, " ");
}

export function checkGrounding(answer: string, evidence: Evidence[]): Grounding {
  const prose = withoutCode(answer);
  const numbers = [...prose.matchAll(/\[(\d{1,2})\](?!\()/g)].map(match => Number(match[1]));
  const valid = new Set(evidence.map(item => item.n));
  const cited = [...new Set(numbers.filter(n => valid.has(n)))].sort((a, b) => a - b);
  const invalid = [...new Set(numbers.filter(n => !valid.has(n)))].sort((a, b) => a - b);
  return {
    cited,
    invalid,
    generatedSection: prose.includes(GENERATED_HEADING),
    uncited: evidence.length > 0 && cited.length === 0,
  };
}

/**
 * Answer built only from the notes: used when no AI model is configured, or when the model fails.
 * Everything here is quoted from the repository and cited.
 */
export function composeRepositoryAnswer(search: SearchResult, evidence: Evidence[]): string {
  if (!evidence.length) {
    const topics = search.suggestions.topics.slice(0, 6).map(topic => `\`${topic}\``).join(", ");
    return [
      "I couldn't find this in your notes.",
      topics ? `Try one of these topics: ${topics}.` : "",
      ...search.suggestions.questions.slice(0, 3).map(item => `- ${item.question}`),
    ].filter(Boolean).join("\n\n");
  }

  // An overview led by a roadmap shows the roadmap itself (a checklist), then the rest.
  if (search.mode === "browse" && evidence[0].kind !== "roadmap") {
    const heading = search.topics.length ? `Here is an overview of **${search.topics.map(item => item.topic).join(", ")}** from your notes:` : "From your notes:";
    return [heading, "", ...evidence.map(item => `- **${item.question}** — ${item.summary || "see the source"} [${item.n}]`)].join("\n");
  }

  const [top, ...rest] = evidence;
  const intro = search.confidence === "low" ? "_Closest match in your notes; it may not fully answer your question._\n\n" : "";
  const body = top.answer ?? top.summary;
  const related = rest.length ? ["", "**Related in your notes**", ...rest.map(item => `- ${item.question} [${item.n}]`)] : [];
  return [`${intro}**${top.question}** [${top.n}]`, "", body, ...related].join("\n");
}

/** Next questions to offer as chips: built from the matches, never invented. */
export function suggestFollowUps(search: SearchResult, evidence: Evidence[], followUpQuestions: string[]): string[] {
  const top = evidence[0];
  const suggestions: string[] = [];
  const subject = search.entities[0]?.name ?? search.topics[0]?.topic ?? top?.question.replace(/\?$/, "");
  suggestions.push(...followUpQuestions.slice(0, 2));
  if (top?.kind === "roadmap") {
    suggestions.push(...top.relatedTopics.slice(0, 2).map(topic => `Prepare me for a ${topicLabel(topic)} interview`));
    const role = /^Roadmap: (.+)$/.exec(top.question)?.[1];
    if (role) suggestions.push(`What does a ${role} do?`, `${role} salary`);
    else if (top.topics[0] && top.topics[0] !== "roadmaps") suggestions.push(`Quiz me on ${topicLabel(top.topics[0])}`);
  } else if (top?.kind === "role") {
    const role = search.entities[0]?.name ?? top.question.replace(/^What does an? /, "").replace(/ do\?$/, "");
    suggestions.push(`Roadmap to become a ${role}`, `${role} salary and skills`);
  } else if (top) {
    if (!search.intents.includes("interview-prep")) suggestions.push(`How would I answer this in an interview: ${top.question}`);
    if (top.codeLanguages.length && !search.intents.includes("code")) suggestions.push(`Show a code example for: ${top.question}`);
    if (!top.codeLanguages.length && !search.intents.includes("visual")) suggestions.push(`Show a diagram of: ${top.question}`);
    if (subject && !search.intents.includes("quiz")) suggestions.push(`Quiz me on ${search.topics[0]?.topic ?? subject}`);
  }
  for (const item of evidence.slice(1)) if (item.kind !== "note") suggestions.push(item.question);
  return [...new Set(suggestions.map(text => text.trim()).filter(text => text && text.length <= 160))].slice(0, 4);
}
