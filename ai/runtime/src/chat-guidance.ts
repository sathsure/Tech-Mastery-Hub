/**
 * Answers the tutor builds without writing prose, so they never contain invented content:
 *   - topic overviews: an introduction, then the topic's sections as collapsed lists (progressive disclosure)
 *   - learning plans: the roadmap items a user picked, put in prerequisite order
 *   - outside resources: search links for when the notes don't cover a question
 *
 * Links of the form (#ask:<question>) become buttons in the web app that ask that question.
 */
import { loadQuestionIndex } from "./question-index.js";
import type { QuestionEntry } from "./question-index-contracts.js";
import { PREREQUISITES, topicLevels, topicSlug, withPrerequisites } from "./roadmap-generator.js";
import { TOPIC_LABELS, topicDescription, topicLabel } from "./topic-labels.js";
import type { PlanRequest } from "./chat-contracts.js";
import { trimEndChars } from "./text-utils.js";

/** Markdown link that asks the tutor a question when clicked. */
export function askLink(text: string, question: string): string {
  const target = encodeURIComponent(question).replace(/[()']/g, ch => `%${ch.charCodeAt(0).toString(16).toUpperCase()}`);
  return `[${text.replace(/[[\]]/g, "")}](#ask:${target})`;
}

const MAX_ITEMS_PER_SECTION = 40;
const OVERVIEW_KINDS = new Set(["question", "note", "term", "role"]);

/** "01-core-java-coding.md" → "Core java coding" */
function fileTitle(path: string): string {
  const name = path.split("/").pop()!.replace(/\.md$/i, "").replace(/^\d+[-_]?/, "").replace(/[-_]+/g, " ").trim();
  return name ? name[0].toUpperCase() + name.slice(1) : "Questions";
}

function sectionTitle(entry: QuestionEntry): string {
  const last = entry.section[entry.section.length - 1]?.replace(/\|/g, " ").replace(/\s+/g, " ").trim();
  if (last) return last;
  return entry.source.path.startsWith("practice/") ? `${fileTitle(entry.source.path)} (practice)` : fileTitle(entry.source.path);
}

/** Shorter item text inside its section: "Skills vs Salary — India (LPA): Data Engineer" → "Data Engineer". */
function itemText(entry: QuestionEntry, section: string): string {
  const prefix = `${section}: `;
  return entry.question.startsWith(prefix) ? entry.question.slice(prefix.length) : entry.question;
}

/** Ask for an item: roles and terms already read as questions; headings get "Explain". */
function itemQuestion(entry: QuestionEntry): string {
  return entry.kind === "note" && !/\?$/.test(entry.question) ? `Explain ${entry.question}` : entry.question;
}

export interface Overview {
  markdown: string;
  sections: number;
  items: number;
}

/** Topic overview: what the topic covers, then each section collapsed with its questions inside. */
export async function buildOverview(topic: string): Promise<Overview | null> {
  const index = await loadQuestionIndex();
  const entries = index.entries.filter(entry => entry.topics.includes(topic) && OVERVIEW_KINDS.has(entry.kind));
  if (!entries.length) return null;
  const sections = new Map<string, QuestionEntry[]>();
  for (const entry of entries) {
    const title = sectionTitle(entry);
    sections.set(title, [...(sections.get(title) ?? []), entry]);
  }
  const studyPath = index.entries.find(entry => entry.kind === "roadmap" && entry.source.path === `roadmap/topics/${topicSlug(topic)}.md`);
  const label = topicLabel(topic);
  const description = topicDescription(topic);
  const names = [...sections.keys()];
  const blocks = [...sections.entries()].map(([title, list]) => {
    const shown = list.slice(0, MAX_ITEMS_PER_SECTION);
    const more = list.length - shown.length;
    return [
      `<details class="outline"><summary>${escapeHtml(title)} <small>${list.length}</small></summary>`,
      "",
      ...shown.map(entry => `- ${askLink(itemText(entry, title), itemQuestion(entry))}`),
      ...(more > 0 ? [`- …and ${more} more. Use **Search notes** to find them.`] : []),
      "",
      "</details>",
    ].join("\n");
  });
  const markdown = [
    `**${label}**${description ? ` — ${description}` : ""}`,
    "",
    `It has ${names.length} ${names.length === 1 ? "section" : "sections"}: ${names.slice(0, 6).join(", ")}${names.length > 6 ? ", and more" : ""}. Open a section to see what it covers, then pick an item for the full answer.`,
    "",
    ...blocks.flatMap(block => [block, ""]),
    studyPath ? `Want a guided order? ${askLink(`Open the ${label} study path`, `${label} study path`)}` : "",
  ].join("\n").trim();
  return { markdown, sections: names.length, items: entries.length };
}

/** Several topics at once ("Explore frontend"): each topic with one line, to open on its own. */
export function buildTopicList(topics: string[]): string {
  return [
    "This covers several topics. Pick one to see what it includes:",
    "",
    ...topics.map(topic => `- ${askLink(topicLabel(topic), `Explore ${topicLabel(topic)}`)}${topicDescription(topic) ? ` — ${topicDescription(topic)}` : ""}`),
  ].join("\n");
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]!);
}

// ---------- Outside resources ----------

const DOCS: Record<string, { name: string; url: string }> = {
  javascript: { name: "MDN JavaScript", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
  typescript: { name: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/" },
  html: { name: "MDN HTML", url: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
  css: { name: "MDN CSS", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
  angular: { name: "Angular docs", url: "https://angular.dev/overview" },
  react: { name: "React docs", url: "https://react.dev/learn" },
  rxjs: { name: "RxJS docs", url: "https://rxjs.dev/guide/overview" },
  nodejs: { name: "Node.js docs", url: "https://nodejs.org/docs/latest/api/" },
  java: { name: "dev.java", url: "https://dev.java/learn/" },
  spring: { name: "Spring Boot docs", url: "https://docs.spring.io/spring-boot/index.html" },
  "spring-security": { name: "Spring Security docs", url: "https://docs.spring.io/spring-security/reference/index.html" },
  "spring-cloud": { name: "Spring Cloud", url: "https://spring.io/projects/spring-cloud" },
  "database/sql": { name: "PostgreSQL docs", url: "https://www.postgresql.org/docs/current/" },
  aws: { name: "AWS documentation", url: "https://docs.aws.amazon.com/" },
  "web-vitals": { name: "web.dev Web Vitals", url: "https://web.dev/articles/vitals" },
  "rest-api": { name: "MDN HTTP", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP" },
  messaging: { name: "Apache Kafka docs", url: "https://kafka.apache.org/documentation/" },
  dsa: { name: "Python Time Complexity (wiki)", url: "https://wiki.python.org/moin/TimeComplexity" },
  ai: { name: "Spring AI reference", url: "https://docs.spring.io/spring-ai/reference/" },
};

export const LEARN_MORE_HEADING = "**Learn more elsewhere**";

/** "Can you explain how Kafka works?" → "how Kafka works" */
export function resourceQuery(message: string): string {
  const cleaned = message
    .replace(/^\s*(can you |could you |please )?(explain|what is|what are|what's|tell me about|show me|show|teach me|describe|how do i|how to)\s+/i, "")
    .trim();
  return trimEndChars(cleaned, "?.! \t").trim().slice(0, 120);
}

/** Search links on trusted learning sites; never a guessed page. */
export function learningResources(message: string, topics: string[]): string {
  const query = resourceQuery(message) || message.trim().slice(0, 120);
  const q = encodeURIComponent(query);
  const docs = topics.map(topic => DOCS[topic]).find(Boolean);
  return [
    LEARN_MORE_HEADING,
    "",
    `- [YouTube videos on “${query}”](https://www.youtube.com/results?search_query=${q})`,
    `- [Udemy courses on “${query}”](https://www.udemy.com/courses/search/?q=${q})`,
    docs ? `- [${docs.name}](${docs.url}) (official documentation)` : `- [Search the official documentation (DevDocs)](https://devdocs.io/#q=${q})`,
  ].join("\n");
}

// ---------- Learning plans ----------

const TOPIC_BY_SLUG = new Map(Object.keys(TOPIC_LABELS).map(topic => [topicSlug(topic), topic]));

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

function addedNote(count: number): string {
  if (count === 0) return "";
  return count === 1 ? ", and one prerequisite was added" : `, and ${count} prerequisites were added`;
}

/** Why a topic sits where it does in the plan. */
function planStepReason(topic: string, picked: string[], ordered: string[]): string {
  if (!picked.includes(topic)) {
    const neededBy = ordered.filter(other => (PREREQUISITES[other] ?? []).includes(topic)).map(topicLabel);
    return `Prerequisite for ${neededBy.join(", ")} — skip it if you already know it.`;
  }
  const needs = (PREREQUISITES[topic] ?? []).filter(item => ordered.includes(item)).map(topicLabel);
  return needs.length ? `Builds on ${needs.join(" and ")}.` : "A starting point: no prerequisites.";
}

export function buildLearningPlan(plan: PlanRequest): string {
  const picked = plan.items.map(item => ({ ...item, topicId: item.topic ? TOPIC_BY_SLUG.get(item.topic) : undefined }));
  const topics = [...new Set(picked.flatMap(item => (item.topicId ? [item.topicId] : [])))];
  const others = picked.filter(item => !item.topicId);
  const name = plan.title.replace(/^Roadmap:\s*/i, "").replace(/ study path$/i, "");
  const lines: string[] = [`**Your learning plan${name ? ` for ${name}` : ""}**`, ""];

  if (topics.length) {
    const covered = new Set(Object.keys(PREREQUISITES));
    const all = withPrerequisites(topics, covered);
    const levels = topicLevels(all);
    const firstSeen = (topic: string) => {
      const at = topics.indexOf(topic);
      return at < 0 ? -1 : at;
    };
    const ordered = [...all].sort((a, b) => levels.get(a)! - levels.get(b)! || firstSeen(a) - firstSeen(b));
    const added = ordered.filter(topic => !topics.includes(topic));
    lines.push(`You picked ${plural(topics.length, "topic")}. Learn them in this order — each step builds on the ones before it${addedNote(added.length)}.`, "");
    ordered.forEach((topic, i) => {
      const why = planStepReason(topic, topics, ordered);
      const studyPath = `${topicLabel(topic)} study path`;
      lines.push(`${i + 1}. **${topicLabel(topic)}** — ${why} ${askLink("Open study path", studyPath)}`);
    });
    const firstPath = `${topicLabel(ordered[0])} study path`;
    lines.push("", `**Start with:** ${askLink(firstPath, firstPath)}`);
  }

  if (others.length) {
    const intro = topics.length
      ? "Then work through the items you picked, in this order:"
      : `You picked ${plural(others.length, "item")}. Work through them in this order — they follow the order of the study path, from basics to advanced:`;
    lines.push("", intro, "", ...others.map((item, i) => `${i + 1}. ${askLink(item.label, item.label)}`));
  }
  lines.push("", "_Order based on each topic's prerequisites. Tick different items and submit again to change the plan._");
  return lines.join("\n");
}
