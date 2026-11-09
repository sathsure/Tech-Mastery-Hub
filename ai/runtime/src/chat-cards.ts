/**
 * Structured cards for chat answers: career roles, countries for working abroad, and learning topics.
 * Cards are sent inside the answer as a fenced block (```tmh-cards + JSON), so they stream, save and
 * reload like any other answer; the web app renders them as interactive cards.
 * Every action on a card either asks the tutor a question that has an answer, or opens a real link.
 */
import type { QuestionEntry } from "./question-index-contracts.js";

export interface CardAction {
  label: string;
  /** Question to ask the tutor. */
  ask?: string;
  /** Topic id for a topic overview (used with `ask`). */
  overview?: string;
  /** External link, opened in a new tab. */
  href?: string;
}

export interface CardItem {
  label: string;
  /** Question asked when the item is clicked; plain text without it. */
  ask?: string;
  /** Topic id: clicking opens that topic's overview (used with `ask`). */
  overview?: string;
}

export interface RoleCard {
  type: "role";
  title: string;
  aka: string[];
  summary: string;
  experience: string | null;
  designations: Array<{ label: string; value: string }>;
  progression: { grow: string[]; lead: string[]; pivot: string[] };
  related: string[];
  languages: string[];
  frameworks: string[];
  tools: string[];
  technical: string[];
  soft: string[];
  aiImpact: string | null;
  actions: CardAction[];
}

export interface CountryCard {
  type: "country";
  title: string;
  flag: string;
  badge: string;
  summary: string;
  details: Array<{ label: string; value: string }>;
  actions: CardAction[];
}

export interface TopicCard {
  type: "topic";
  title: string;
  /** Short label beside the title, e.g. "Start here" or "After Java". */
  badge?: string;
  description: string | null;
  /** Shown as small chips instead of a bullet list (glossary categories). */
  chips: boolean;
  items: CardItem[];
  actions: CardAction[];
}

export type Card = RoleCard | CountryCard | TopicCard;

/** Markdown for a set of cards; ``` inside values can't end the block early. */
export function cardsBlock(cards: Card[]): string {
  const json = JSON.stringify(cards).replace(/```/g, "'''");
  return ["```tmh-cards", json, "```"].join("\n");
}

// ---------- Concise titles ----------

const ROLE_QUESTION = /^What does an? (.+) do\?$/;
const TERM_USED_FOR = /^What is (.+) used for\?$/;
const TERM_DEFINITION = /^What is (.+)\?$/;

/** "What does a Data Analyst do?" → "Data Analyst"; "What is Git used for?" → "Git"; questions stay as they are. */
export function conciseTitle(entry: Pick<QuestionEntry, "kind" | "question">): string {
  const q = entry.question;
  if (entry.kind === "role") return ROLE_QUESTION.exec(q)?.[1] ?? q;
  if (entry.kind === "term") return TERM_USED_FOR.exec(q)?.[1] ?? TERM_DEFINITION.exec(q)?.[1] ?? q;
  if (entry.kind === "note") {
    // Atlas notes are titled "Section: Name" — the name alone is enough.
    const colon = q.indexOf(": ");
    if (q.startsWith("Technology stack: ")) return q.slice("Technology stack: ".length);
    if (colon > 0 && /^(Working Abroad|Skills vs Salary|Career Hierarchy|Who Does What)/.test(q)) return q.slice(colon + 2);
  }
  return q;
}

// ---------- Role cards ----------

/** Value of a "- **Field:** value" line in a role entry. */
function field(answer: string, name: string): string | null {
  const prefix = `- **${name}:**`;
  const line = answer.split("\n").find(text => text.startsWith(prefix));
  return line ? line.slice(prefix.length).trim() : null;
}

/** "A, B (x, y), C" → ["A", "B (x, y)", "C"] */
export function splitList(text: string | null): string[] {
  if (!text || text === "—") return [];
  const parts: string[] = [];
  let depth = 0;
  let current = "";
  for (const char of text) {
    if (char === "(") depth++;
    if (char === ")") depth = Math.max(0, depth - 1);
    if (char === "," && depth === 0) {
      parts.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  parts.push(current.trim());
  return parts.filter(part => part && part !== "—");
}

/** "A, B · **lead:** C · **pivot:** D" → { grow: [A, B], lead: [C], pivot: [D] } */
function progression(text: string | null): RoleCard["progression"] {
  const result: RoleCard["progression"] = { grow: [], lead: [], pivot: [] };
  if (!text) return result;
  const plain = text.replace(/\*\*/g, "");
  for (const part of plain.split(" · ")) {
    const text = part.trim();
    const colon = text.indexOf(":");
    const name = colon > 0 ? text.slice(0, colon).toLowerCase() : "";
    const key: keyof RoleCard["progression"] = name === "lead" || name === "pivot" ? name : "grow";
    result[key].push(...splitList(key === name ? text.slice(colon + 1) : text));
  }
  return result;
}

/** "Forward Deployed Engineer (New)" → "Forward Deployed Engineer"; other names unchanged. */
function withoutNewTag(name: string): string {
  return name.toLowerCase().endsWith("(new)") ? name.slice(0, -"(new)".length).trimEnd() : name;
}

export interface RoleCardContext {
  /** Question that opens the role's roadmap, when one exists. */
  roadmap: string | null;
  /** Question that opens the interview-prep stack picker for this role. */
  interviewPrep: string | null;
  /** Atlas Role Readiness Test link, when the role has a test. */
  readinessTest?: string | null;
}

export function roleCard(entry: QuestionEntry, context: RoleCardContext): RoleCard {
  const title = withoutNewTag(conciseTitle(entry));
  const answer = entry.answer;
  const summary = answer.split("\n").find(line => line.trim() && !line.startsWith("-"))?.trim() ?? entry.summary;
  const designations = [
    ["IT services firms", "At IT services firms (TCS, Infosys, Wipro, Accenture)"],
    ["Product / Big Tech", "At product / Big Tech companies"],
    ["Startups", "At startups"],
  ]
    .map(([label, name]) => ({ label, value: field(answer, name) ?? "" }))
    .filter(item => item.value);
  const actions: CardAction[] = [];
  if (context.roadmap) actions.push({ label: "Explore Roadmap", ask: context.roadmap });
  if (context.interviewPrep) actions.push({ label: "Interview Prep", ask: context.interviewPrep });
  if (context.readinessTest) actions.push({ label: "Take the readiness test", href: context.readinessTest });
  return {
    type: "role",
    title,
    aka: splitList(field(answer, "Also called")),
    summary,
    experience: field(answer, "Typical experience to be hired")?.replace(/yrs?$/, "years") ?? null,
    designations,
    progression: progression(field(answer, "Next moves — grow")),
    related: splitList(field(answer, "Narrower (sideways) roles")),
    languages: splitList(field(answer, "Languages")),
    frameworks: splitList(field(answer, "Frameworks / Standards")),
    tools: splitList(field(answer, "Tools")),
    technical: splitList(field(answer, "Technical skills")),
    soft: splitList(field(answer, "Soft skills")),
    aiImpact: field(answer, "AI impact"),
    actions,
  };
}

// ---------- Country cards ----------

const FLAGS: Record<string, string> = {
  Germany: "🇩🇪",
  UAE: "🇦🇪",
  Netherlands: "🇳🇱",
  Ireland: "🇮🇪",
  Japan: "🇯🇵",
  Australia: "🇦🇺",
  "United Kingdom": "🇬🇧",
  Singapore: "🇸🇬",
  Canada: "🇨🇦",
  "United States": "🇺🇸",
};

const COUNTRY_NOTE = /^Working Abroad from India[^:]*: (.+) — (Realistic|Moderate|Hard|Very hard)$/;

/** Is this entry one country's "working abroad" note? */
export function isCountryNote(entry: Pick<QuestionEntry, "question">): boolean {
  return COUNTRY_NOTE.test(entry.question);
}

/** The overview table: country → { pay, visa, experience }. */
function abroadTable(overview: QuestionEntry | undefined): Map<string, { pay: string; visa: string; experience: string }> {
  const rows = new Map<string, { pay: string; visa: string; experience: string }>();
  for (const line of overview?.answer.split("\n") ?? []) {
    const cells = line.split("|").map(cell => cell.trim());
    if (cells.length < 7 || cells[1] === "Country" || cells[1].startsWith("---")) continue;
    rows.set(cells[1], { pay: cells[3], visa: cells[4], experience: cells[5] });
  }
  return rows;
}

/** Text after "**Label:**" (paragraph) or "- **Label:**" (bullet) in a note. */
function noteField(answer: string, label: string): string | null {
  for (const line of answer.split("\n")) {
    const text = (line.startsWith("- ") ? line.slice(2) : line).trim();
    if (!text.startsWith(`**${label}`)) continue;
    const end = text.indexOf(":**");
    if (end > 0) return text.slice(end + 3).trim();
  }
  return null;
}

export function countryCard(entry: QuestionEntry, overview: QuestionEntry | undefined): CountryCard | null {
  const match = COUNTRY_NOTE.exec(entry.question);
  if (!match) return null;
  const [, name, badge] = match;
  const remote = name.startsWith("Remote");
  const table = abroadTable(overview).get(name);
  const details: Array<{ label: string; value: string }> = [];
  if (table?.pay) details.push({ label: "Typical pay", value: table.pay });
  if (table?.experience) details.push({ label: "Experience", value: table.experience });
  if (table?.visa) details.push({ label: remote ? "Route" : "Visa route", value: table.visa });
  const demand = splitList(noteField(entry.answer, "High demand roles")).slice(0, 3);
  if (demand.length) details.push({ label: "In demand", value: demand.join(", ") });
  // "UAE (Dubai/Abu Dhabi)" → "UAE"
  const location = remote ? "Worldwide" : name.split(" (")[0];
  const keywords = remote ? "remote software engineer" : "software engineer visa sponsorship";
  return {
    type: "country",
    title: name,
    flag: FLAGS[name.split(" (")[0]] ?? "🌐",
    badge,
    summary: noteField(entry.answer, "Blunt take") ?? entry.summary,
    details,
    actions: [
      { label: "View Details", ask: `Working in ${location === "Worldwide" ? "remote jobs for global companies" : location} from India` },
      {
        label: "Explore Jobs",
        href: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(keywords)}&location=${encodeURIComponent(location)}`,
      },
    ],
  };
}
