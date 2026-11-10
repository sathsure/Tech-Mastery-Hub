/**
 * Interview question sets for interviewers ("Prepare a question set to interview a Java developer with 10+ years").
 *
 * Step 1: a setup checklist that asks only what the set needs — experience, role, stack, duration, question
 * categories, difficulty, company type and focus — with everything the request already said ticked.
 * Step 2: for the ticked options, a timed, prioritised question set built from the notes: each question with
 * the expected answer, what to look for, follow-ups and a link to the full model answer.
 */
import type { PlanRequest } from "./chat-contracts.js";
import { askLink } from "./chat-guidance.js";
import type { QuestionEntry } from "./question-index-contracts.js";
import { getFollowUps, isContextQuestion, loadQuestionIndex } from "./question-index.js";
import { plainText } from "./question-indexer.js";

/** Heading of the setup checklist; the build step reads the plan title back from it. */
export const SETUP_PREFIX = "Interview question set: ";

// ---------- Options ----------

type Level = 1 | 2 | 3;
type Seniority = "junior" | "mid" | "senior" | "lead";

interface Option {
  label: string;
  /** Learning topics a stack option covers. */
  topics?: string[];
  minutes?: number;
  rounds?: number;
  years?: number;
}

const EXPERIENCE: Option[] = [
  { label: "0–2 years", years: 1 },
  { label: "3–5 years", years: 4 },
  { label: "6–9 years", years: 7 },
  { label: "10+ years", years: 10 },
  { label: "12+ years", years: 12 },
  { label: "15+ years", years: 15 },
];

const ROLES: Array<Option & { match: RegExp; layers: string[] }> = [
  { label: "Full Stack Developer", match: /\bfull[\s-]?stack\b/, layers: ["frontend", "backend", "data", "cloud"] },
  { label: "Backend Developer", match: /\b(back[\s-]?end|server[\s-]?side|api developer)\b/, layers: ["backend", "data", "cloud"] },
  { label: "Frontend Developer", match: /\b(front[\s-]?end|ui developer|ui engineer)\b/, layers: ["frontend"] },
  { label: "Technical Lead", match: /\b(tech(nical)? lead|team lead|lead (developer|engineer))\b/, layers: ["frontend", "backend", "data", "cloud"] },
  { label: "Software Architect", match: /\barchitect\b/, layers: ["frontend", "backend", "data", "cloud"] },
  { label: "Engineering Manager", match: /\b(engineering manager|development manager|delivery manager)\b/, layers: ["frontend", "backend", "data", "cloud"] },
  { label: "DevOps / Cloud Engineer", match: /\b(devops|sre|site reliability|cloud engineer|platform engineer)\b/, layers: ["cloud", "data"] },
];

const STACK: Array<Option & { match: RegExp; layer: string }> = [
  { label: "Java", topics: ["java"], match: /\bjava\b(?!\s*script)/, layer: "backend" },
  { label: "Spring Boot", topics: ["spring", "spring-security"], match: /\bspring\b/, layer: "backend" },
  { label: "Microservices", topics: ["microservices", "spring-cloud"], match: /\bmicro[\s-]?services?\b/, layer: "backend" },
  { label: "REST API design", topics: ["rest-api"], match: /\b(rest|restful|api design)\b/, layer: "backend" },
  { label: "Node.js", topics: ["nodejs"], match: /\bnode(\.?js)?\b/, layer: "backend" },
  { label: "Kafka / messaging", topics: ["messaging"], match: /\b(kafka|rabbitmq|messaging|message queue)\b/, layer: "backend" },
  { label: "Angular", topics: ["angular", "rxjs"], match: /\bangular\b/, layer: "frontend" },
  { label: "React", topics: ["react"], match: /\breact\b/, layer: "frontend" },
  { label: "JavaScript / TypeScript", topics: ["javascript", "typescript"], match: /\b(javascript|typescript|js|ts)\b/, layer: "frontend" },
  { label: "HTML / CSS", topics: ["html", "css"], match: /\b(html|css)\b/, layer: "frontend" },
  { label: "SQL / databases", topics: ["database/sql"], match: /\b(sql|mysql|postgres(ql)?|oracle|database|rdbms)\b/, layer: "data" },
  { label: "Caching / Redis", topics: ["caching"], match: /\b(redis|cach(e|ing))\b/, layer: "data" },
  { label: "Cloud (AWS)", topics: ["aws"], match: /\b(aws|cloud|azure|gcp)\b/, layer: "cloud" },
  { label: "Docker / Kubernetes / CI-CD", topics: ["devops"], match: /\b(docker|kubernetes|k8s|ci\s*\/?\s*cd|devops|jenkins)\b/, layer: "cloud" },
  { label: "AI / LLM integration", topics: ["ai"], match: /\b(ai|llm|genai|rag)\b/, layer: "backend" },
];

const DURATIONS: Option[] = [
  { label: "30 minutes", minutes: 30 },
  { label: "45 minutes", minutes: 45 },
  { label: "60 minutes", minutes: 60 },
  { label: "90 minutes", minutes: 90 },
  { label: "2 rounds × 60 minutes", minutes: 60, rounds: 2 },
];

type CategoryId = "core" | "dsa" | "coding" | "sql" | "design" | "architecture" | "debugging" | "scenarios" | "behavioural";

interface Category {
  id: CategoryId;
  label: string;
  /** Minutes one question of this kind takes to ask and discuss. */
  perQuestion: number;
  /** Round in a two-round loop: 1 = hands-on technical, 2 = design and leadership. */
  round: 1 | 2;
  probes: string[];
}

const CATEGORIES: Category[] = [
  { id: "core", label: "Core technical concepts", perQuestion: 4, round: 1, probes: ["Where has this caused a problem in a real project, and how did you fix it?", "What changes at 10× the traffic or data?"] },
  { id: "dsa", label: "Data structures & algorithms", perQuestion: 15, round: 1, probes: ["What are the time and space complexity?", "Can you do better? What would you trade off?"] },
  { id: "coding", label: "Coding exercise", perQuestion: 15, round: 1, probes: ["How would you test this? Name the edge cases.", "What would you change before putting this in production?"] },
  { id: "sql", label: "SQL queries", perQuestion: 5, round: 1, probes: ["Which index makes this fast? What does the query plan show?", "How does it behave with NULLs and duplicates?"] },
  { id: "design", label: "System design", perQuestion: 20, round: 2, probes: ["What breaks first at 10× load, and how would you know?", "Where do you need strong consistency, and where is eventual consistency fine?", "How would you roll this out safely?"] },
  { id: "architecture", label: "Architecture & design patterns", perQuestion: 5, round: 2, probes: ["What trade-off did you accept, and when would you choose differently?", "How would you explain this decision to a non-technical stakeholder?"] },
  { id: "debugging", label: "Debugging & production issues", perQuestion: 5, round: 1, probes: ["Which logs, metrics or traces do you check first?", "How do you stop it happening again?"] },
  { id: "scenarios", label: "Real-time scenarios", perQuestion: 5, round: 2, probes: ["What did you actually do the last time this happened?", "Who did you involve, and what was the outcome?"] },
  { id: "behavioural", label: "Behavioural & leadership", perQuestion: 5, round: 2, probes: ["What was the measurable result?", "What would you do differently next time?"] },
];

const DIFFICULTIES: Array<Option & { level: Level }> = [
  { label: "Intermediate", level: 1 },
  { label: "Advanced", level: 2 },
  { label: "Expert", level: 3 },
];

const COMPANY_TYPES: Option[] = [
  { label: "Product-based company" },
  { label: "Service-based company" },
  { label: "Startup" },
  { label: "Enterprise / bank (BFSI)" },
];

const FOCUS: Option[] = [
  { label: "Hands-on coding" },
  { label: "Theoretical knowledge" },
  { label: "Practical experience" },
  { label: "Problem-solving" },
  { label: "Technical leadership" },
];

const COMPANIES: Array<[RegExp, string]> = [
  [/\b(google|amazon|microsoft|meta|apple|netflix|flipkart|atlassian|uber|swiggy|zomato|zoho|freshworks|adobe|salesforce|walmart|phonepe|razorpay|paytm|oracle)\b/i, "Product-based company"],
  [/\b(tcs|infosys|wipro|accenture|cognizant|hcl|capgemini|tech mahindra|ltimindtree|mphasis|deloitte|ibm)\b/i, "Service-based company"],
  [/\b(jp ?morgan|goldman|barclays|hsbc|citi(bank)?|morgan stanley|deutsche|wells fargo|hdfc|icici|axis bank|sbi|visa|mastercard|american express)\b/i, "Enterprise / bank (BFSI)"],
];

// ---------- Step 1: recognise the request and ask for the details ----------

/** "Prepare an interview question set to interview a Full Stack Java Developer with 10+ years". */
export function isQuestionSetRequest(message: string): boolean {
  const text = message.toLowerCase();
  if (!/\binterview/.test(text)) return false;
  const asksForSet = /\b(question set|set of (interview )?questions|question bank|question paper|questionnaire)\b/.test(text);
  const interviewerSide = /\b(to interview (a|an|the|my|our)|for interviewing|interviewing (a|an|the)|as (an|the) interviewer|interviewer|interview panel|to hire|hiring|candidates?|questions to ask)\b/.test(text);
  // "Prepare interview questions for Java", "Create interview questions for a 13+ years person".
  const preparesQuestions = /\b(prepare|create|generate|make|build|draft|frame|design|set up)\b(?!\s+me\b)[^.?!]*\binterview questions?\b/.test(text);
  return asksForSet || preparesQuestions || (interviewerSide && /\bquestions?\b/.test(text));
}

interface Detected {
  role: string | null;
  years: number | null;
  stack: string[];
  minutes: number | null;
  rounds: boolean;
  company: string | null;
  companyType: string | null;
}

function detect(message: string): Detected {
  const text = message.toLowerCase();
  const years = /(\d{1,2})\s*\+?\s*(?:plus\s*)?(?:years?|yrs?)/.exec(text);
  const hours = /(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)\b/.exec(text);
  const minutes = /(\d{2,3})\s*(?:minutes?|mins?)\b/.exec(text);
  const named = COMPANIES.find(([pattern]) => pattern.test(message));
  const company = named ? named[0].exec(message)?.[0] ?? null : null;
  const companyType = named?.[1] ?? (/\bproduct[\s-]?(based|company)\b/.test(text) ? "Product-based company" : /\bservice[\s-]?(based|company)\b/.test(text) ? "Service-based company" : /\bstart[\s-]?up\b/.test(text) ? "Startup" : /\b(bank|bfsi|enterprise|fintech)\b/.test(text) ? "Enterprise / bank (BFSI)" : null);
  return {
    role: ROLES.find(role => role.match.test(text))?.label ?? null,
    years: years ? Number(years[1]) : null,
    stack: STACK.filter(item => item.match.test(text)).map(item => item.label),
    minutes: hours ? Math.round(Number(hours[1]) * 60) : minutes ? Number(minutes[1]) : null,
    rounds: /\b(rounds|multiple rounds|interview loop)\b/.test(text),
    company,
    companyType,
  };
}

/** 10 years and more keep the exact number asked for ("13+ years"); fewer fall in a range. */
function experienceFor(years: number): string {
  if (years >= 10) return `${years}+ years`;
  if (years >= 6) return "6–9 years";
  if (years >= 3) return "3–5 years";
  return "0–2 years";
}

/** The experience choices, with the asked-for number added when it is not one of them. */
function experienceOptions(years: number | null): Option[] {
  if (years === null || EXPERIENCE.some(option => option.label === experienceFor(years))) return EXPERIENCE;
  return [...EXPERIENCE, { label: experienceFor(years), years }].sort((a, b) => a.years! - b.years!);
}

/** "13+ years" -> 13, "3–5 years" -> 4; null for anything else. */
function yearsOfLabel(label: string): number | null {
  const plus = /^(\d{1,2})\+ years$/.exec(label);
  if (plus) return Number(plus[1]);
  return EXPERIENCE.find(option => option.label === label)?.years ?? null;
}

function seniorityOf(years: number): Seniority {
  if (years >= 12) return "lead";
  if (years >= 8) return "senior";
  if (years >= 3) return "mid";
  return "junior";
}

const difficultyFor = (years: number) => (years >= 10 ? "Expert" : years >= 5 ? "Advanced" : "Intermediate");

function durationFor(found: Detected): string | null {
  if (found.rounds) return "2 rounds × 60 minutes";
  if (found.minutes === null) return null;
  return DURATIONS.filter(item => !item.rounds).reduce((best, item) => (Math.abs(item.minutes! - found.minutes!) < Math.abs(best.minutes! - found.minutes!) ? item : best)).label;
}

/** Categories that fit the seniority and role; the interviewer can change them. */
function defaultCategories(seniority: Seniority, role: string | null, stack: string[], companyType: string | null = null): CategoryId[] {
  const leadRole = role === "Technical Lead" || role === "Software Architect" || role === "Engineering Manager";
  const hasData = stack.includes("SQL / databases") || role === "Full Stack Developer" || role === "Backend Developer";
  const picked: CategoryId[] = ["core", "coding"];
  if (seniority === "junior" || companyType === "Product-based company") picked.push("dsa");
  if (hasData) picked.push("sql");
  if (seniority !== "junior") picked.push("design", "debugging", "scenarios");
  if (seniority === "senior" || seniority === "lead" || leadRole) picked.push("architecture");
  picked.push("behavioural");
  if (role === "Engineering Manager") return picked.filter(id => id !== "coding" && id !== "dsa");
  return picked;
}

function defaultFocus(seniority: Seniority, role: string | null): string[] {
  if (role === "Engineering Manager") return ["Practical experience", "Technical leadership"];
  if (seniority === "junior") return ["Hands-on coding", "Theoretical knowledge", "Problem-solving"];
  if (seniority === "mid") return ["Hands-on coding", "Practical experience", "Problem-solving"];
  return ["Hands-on coding", "Practical experience", "Problem-solving", "Technical leadership"];
}

const box = (label: string, on: boolean) => `- [${on ? "x" : " "}] ${label}`;

/** The setup checklist, with what the request already says ticked. */
export function questionSetSetup(message: string): string {
  const found = detect(message);
  const years = found.years;
  const seniority = years === null ? null : seniorityOf(years);
  const role = ROLES.find(item => item.label === found.role);
  // Stack choices: only the layers this role works in, plus anything the request named.
  const stackOptions = STACK.filter(item => !role || role.layers.includes(item.layer) || found.stack.includes(item.label));
  const titleParts = [found.role ?? (found.stack.length === 1 ? `${found.stack[0]} Developer` : "Software Engineer"), years === null ? null : experienceFor(years), found.company ? `for ${found.company}` : null].filter(Boolean);
  let categories = seniority ? defaultCategories(seniority, found.role, found.stack, found.companyType) : [];
  const focus = seniority ? defaultFocus(seniority, found.role) : [];
  const duration = durationFor(found);
  // With a single slot of known length, tick only the categories that fit in it.
  if (years !== null && duration) {
    const labels = [experienceFor(years), found.role, ...found.stack, duration, ...CATEGORIES.filter(item => categories.includes(item.id)).map(item => item.label), ...focus, found.companyType];
    const settings = readSettings({ title: `${SETUP_PREFIX}${titleParts.join(" · ")}`, items: labels.filter((label): label is string => Boolean(label)).map(label => ({ label })) });
    if (settings.rounds === 1) {
      const { dropped } = allocate(settings.categories, settings.minutes, settings);
      categories = categories.filter(id => !dropped.some(item => item.id === id));
    }
  }

  const lines = [
    `**${SETUP_PREFIX}${titleParts.join(" · ")}**`,
    "",
    "Before I build the set, confirm a few details. I've ticked what your request already says and sensible defaults for the experience level — change anything, then press **Build question set**. You get a timed plan with the most important questions first, each with the expected answer, what to look for and follow-ups.",
  ];
  const group = (heading: string, hint: string, options: Option[], ticked: (option: Option) => boolean) => {
    lines.push("", `**${heading}** — ${hint}`, "", ...options.map(option => box(option.label, ticked(option))));
  };
  group("Experience", years === null ? "how many years? pick one" : "pick one", experienceOptions(years), option => years !== null && option.label === experienceFor(years));
  group("Role", "pick one", ROLES, option => option.label === found.role);
  const stackHint = found.stack.length
    ? `${found.stack.join(", ")} ${found.stack.length > 1 ? "are" : "is"} ticked — need any other skills on top? Tick them too`
    : "which skills should the interview cover? Tick all that apply";
  group("Tech stack", stackHint, stackOptions, option => found.stack.includes(option.label));
  group("Interview duration", duration ? "pick one" : "how many minutes? pick one", DURATIONS, option => option.label === duration);
  group("Question categories", "untick what you want to leave out", CATEGORIES, option => categories.includes(CATEGORIES.find(item => item.label === option.label)!.id));
  group("Difficulty", "pick one", DIFFICULTIES, option => years !== null && option.label === difficultyFor(years));
  group("Company type", "optional", COMPANY_TYPES, option => option.label === found.companyType);
  group("Interview focus", "what matters most", FOCUS, option => focus.includes(option.label));
  if (!found.company) lines.push("", "_Hiring for a specific company? Say it in your request (e.g. \"…for Amazon\") and the set is tuned to its interview style._");
  return lines.join("\n");
}

// ---------- Step 2: build the set ----------

interface Settings {
  role: string;
  years: number;
  seniority: Seniority;
  topics: string[];
  stackLabels: string[];
  minutes: number;
  rounds: number;
  categories: Category[];
  level: Level;
  companyType: string | null;
  company: string | null;
  focus: string[];
}

const byLabel = <T extends Option>(options: T[], labels: string[]) => options.filter(option => labels.includes(option.label));

function readSettings(plan: PlanRequest): Settings {
  const labels = plan.items.map(item => item.label.trim());
  const title = plan.title.startsWith(SETUP_PREFIX) ? plan.title.slice(SETUP_PREFIX.length) : "";
  const company = /\bfor (.+)$/.exec(title.split(" · ").find(part => part.startsWith("for ")) ?? "")?.[1] ?? null;
  // Several ticks in a "pick one" group: the most senior / longest one wins.
  const years = Math.max(0, ...labels.map(yearsOfLabel).filter((value): value is number => value !== null)) || detect(title).years || 5;
  const role = byLabel(ROLES, labels).map(option => option.label)[0] ?? title.split(" · ")[0] ?? "Software Engineer";
  const stack = byLabel(STACK, labels);
  const duration = byLabel(DURATIONS, labels).sort((a, b) => (b.rounds ?? 1) * b.minutes! - (a.rounds ?? 1) * a.minutes!)[0] ?? DURATIONS[2];
  const seniority = seniorityOf(years);
  const picked = CATEGORIES.filter(category => labels.includes(category.label));
  const level = Math.max(0, ...byLabel(DIFFICULTIES, labels).map(option => option.level)) as Level | 0;
  return {
    role,
    years,
    seniority,
    topics: [...new Set(stack.flatMap(option => option.topics ?? []))],
    stackLabels: stack.map(option => option.label),
    minutes: duration.minutes!,
    rounds: duration.rounds ?? 1,
    categories: picked.length ? picked : CATEGORIES.filter(category => defaultCategories(seniority, role, []).includes(category.id)),
    level: level || (years >= 10 ? 3 : years >= 5 ? 2 : 1),
    companyType: byLabel(COMPANY_TYPES, labels)[0]?.label ?? (company ? COMPANIES.find(([pattern]) => pattern.test(company))?.[1] ?? null : null),
    company,
    focus: byLabel(FOCUS, labels).map(option => option.label),
  };
}

/** How much interview time each category gets, before scaling to the minutes available. */
function weightOf(category: Category, settings: Settings): number {
  const senior = settings.seniority === "senior" || settings.seniority === "lead";
  const base: Record<CategoryId, number> = senior
    ? { core: 18, dsa: 12, coding: 18, sql: 8, design: 26, architecture: 12, debugging: 10, scenarios: 10, behavioural: 12 }
    : { core: 28, dsa: 20, coding: 24, sql: 10, design: 10, architecture: 6, debugging: 6, scenarios: 6, behavioural: 6 };
  let weight = base[category.id];
  const boost = (focus: string, ids: CategoryId[], by: number) => {
    if (settings.focus.includes(focus) && ids.includes(category.id)) weight *= by;
  };
  boost("Hands-on coding", ["coding", "dsa", "sql"], 1.4);
  boost("Theoretical knowledge", ["core"], 1.5);
  boost("Practical experience", ["scenarios", "debugging"], 1.4);
  boost("Problem-solving", ["dsa", "design"], 1.25);
  boost("Technical leadership", ["behavioural", "architecture"], 1.4);
  const company: Record<string, Partial<Record<CategoryId, number>>> = {
    "Product-based company": { dsa: 1.5, design: 1.2, coding: 1.1 },
    "Service-based company": { core: 1.3, sql: 1.2, dsa: 0.8 },
    Startup: { coding: 1.25, scenarios: 1.3, debugging: 1.2 },
    "Enterprise / bank (BFSI)": { architecture: 1.25, debugging: 1.2, sql: 1.2 },
  };
  return weight * (settings.companyType ? company[settings.companyType]?.[category.id] ?? 1 : 1);
}

interface Slot {
  category: Category;
  minutes: number;
  count: number;
}

/** One question's worth of time, in 5-minute steps. */
const minimumOf = (category: Category) => Math.ceil(category.perQuestion / 5) * 5;

interface Allocation {
  slots: Slot[];
  intro: number;
  close: number;
  /** Ticked categories that don't fit in this round, most important first. */
  dropped: Category[];
}

/**
 * Splits the interview time across categories after the intro and the candidate's questions.
 * The most important categories that fit get one question's time each; the rest of the time goes,
 * 5 minutes at a time, to whichever category is furthest below its fair share.
 */
function allocate(categories: Category[], minutes: number, settings: Settings): Allocation {
  const intro = minutes <= 30 ? 3 : minutes >= 90 && settings.seniority !== "junior" ? 10 : 5;
  const close = minutes <= 30 ? 2 : 5;
  const available = minutes - intro - close;
  const weight = (category: Category) => weightOf(category, settings);
  const kept: Category[] = [];
  const dropped: Category[] = [];
  let used = 0;
  for (const category of [...categories].sort((a, b) => weight(b) - weight(a))) {
    if (used + minimumOf(category) <= available) {
      kept.push(category);
      used += minimumOf(category);
    } else dropped.push(category);
  }
  const slots: Slot[] = CATEGORIES.filter(category => kept.includes(category)).map(category => ({ category, minutes: minimumOf(category), count: 0 }));
  const total = kept.reduce((sum, category) => sum + weight(category), 0);
  const share = (slot: Slot) => (available * weight(slot.category)) / total;
  let spare = available - used;
  while (spare >= 5 && slots.length) {
    const neediest = [...slots].sort((a, b) => share(b) - b.minutes - (share(a) - a.minutes))[0];
    neediest.minutes += 5;
    spare -= 5;
  }
  if (spare > 0 && slots.length) [...slots].sort((a, b) => weight(b.category) - weight(a.category))[0].minutes += spare;
  for (const slot of slots) slot.count = Math.max(1, Math.floor(slot.minutes / slot.category.perQuestion));
  return { slots, intro, close, dropped };
}

// ---------- Choosing questions from the notes ----------

/** How deep a question goes, read from the section it sits in. */
function levelOf(entry: QuestionEntry): Level {
  if (entry.difficulty === "beginner") return 1;
  if (entry.difficulty === "advanced") return 3;
  const where = `${entry.section.join(" ")} ${entry.source.path}`.toLowerCase();
  // LeetCode sets run from warm-up (arrays, hashing) to hard (graphs, dynamic programming).
  if (/leetcode/.test(where)) return /dynamic programming|trees and graphs|heaps|patterns/.test(where) ? 3 : /arrays and hashing|binary search/.test(where) ? 1 : 2;
  if (/tricky|trick|deep dive|internals|under-the-hood|advanced|concurrency|jvm|production|architect|judgment|performance|scalab|distributed|consistency|incident|mock|real-world|scenario|managerial|interview\/leadership/.test(where)) return 3;
  if (/basic|fundamental|part 1 |must-know|how to answer|quick revision|getting started/.test(where)) return 1;
  return 2;
}

const FRONTEND_TOPICS = new Set(["html", "css", "javascript", "typescript", "angular", "react", "rxjs", "web-vitals"]);

/** Which entries can serve each category. */
const SOURCES: Record<CategoryId, (entry: QuestionEntry) => boolean> = {
  core: entry => entry.source.path.startsWith("interview/") && !/behavioral|career|system-design|04-system-design|05-distributed|microservice-architecture/i.test(entry.source.path) && !/scenario|mock|production|incident|managerial|team & ownership|how to answer|hr questions/i.test(entry.section.join(" ")),
  // Problems to solve, not questions about complexity theory.
  dsa: entry => /leetcode/i.test(entry.source.path),
  coding: entry => entry.source.path.startsWith("practice/coding/") && !/leetcode|sql/i.test(entry.source.path) && !/\b(output|print|compile|trap)\b/i.test(entry.question),
  sql: entry => /03-SQL-Interview-Queries|02-MySQL-coding|02-SQL-Indexing/.test(entry.source.path),
  design: entry => /04-System-Design\.md$/.test(entry.source.path) ? /classic|tricky|reliability/i.test(entry.section.join(" ")) : /05-Distributed-Systems|microservice-architecture|09-Web_Architecture/.test(entry.source.path) && /final system design|walkthrough|consistency|transactions across/i.test(entry.section.join(" ")),
  architecture: entry => /10-Design-Patterns-SOLID/.test(entry.source.path) || (/04-System-Design\.md$/.test(entry.source.path) && /architecture basics/i.test(entry.section.join(" "))) || (/08-Architecture|06-Spring-Cloud/.test(entry.source.path) && /architect|design decision|end-to-end|api design|fundamentals|service boundaries/i.test(entry.section.join(" "))),
  debugging: entry => /production issues|incident|configuration & environment|troubleshooting|jpa \/ hibernate performance|memory leaks/i.test(entry.section.join(" ")),
  scenarios: entry => /scenario|mock interview|real-world|concurrent users|performance & scalability|state, caching|data safety|security & data exposure|deployment & release/i.test(entry.section.join(" ")),
  behavioural: entry =>
    entry.source.path.startsWith("interview/behavioral/") ? !/how to answer/i.test(entry.section.join(" "))
    : entry.source.path.startsWith("interview/leadership/") ? /people|delivery|production/i.test(entry.section.join(" "))
    : /team & ownership|managerial & design decisions/i.test(entry.section.join(" ")),
};

/** Coding practice files per language, so a Java interview doesn't get JavaScript exercises. */
function codingFits(entry: QuestionEntry, settings: Settings): boolean {
  const path = entry.source.path.toLowerCase();
  const wantsJava = settings.topics.some(topic => ["java", "spring"].includes(topic));
  const wantsJs = settings.topics.some(topic => FRONTEND_TOPICS.has(topic) || topic === "nodejs");
  if (path.includes("/java/")) return wantsJava || !wantsJs;
  if (path.includes("css-coding")) return settings.topics.includes("css");
  if (path.includes("angular-coding")) return settings.topics.includes("angular");
  return wantsJs || !wantsJava;
}

/** Skills every engineer is asked about, whatever the stack. */
const GENERAL_TOPICS = new Set(["dsa", "leadership", "agile", "system-design", "design-patterns", "behavioral", "testing", "networking", "microservices", "rest-api", "web-architecture", "database/sql", "under-the-hood", "caching"]);

/** An entry fits the stack when it is about a chosen topic, or only about general skills any engineer needs. */
function stackFits(entry: QuestionEntry, settings: Settings, category: CategoryId): boolean {
  if (category === "coding") return codingFits(entry, settings);
  // Algorithm problems are the same in any language (the LeetCode notes happen to be tagged Python).
  if (category === "dsa") return true;
  if (category === "core") return entry.topics.some(topic => settings.topics.includes(topic));
  if (!settings.topics.length) return true;
  return entry.topics.some(topic => settings.topics.includes(topic)) || entry.topics.every(topic => GENERAL_TOPICS.has(topic));
}

/** Closer to the asked difficulty first; never more than one level easier. */
function levelRank(entry: QuestionEntry, wanted: Level): number {
  const level = levelOf(entry);
  if (level === wanted) return 0;
  if (level === wanted + 1) return 1;
  if (level === wanted - 1) return 2;
  return 9;
}

const MAX_QUESTION_LENGTH = 160;

/** Picks questions for every slot: best difficulty fit, spread across the chosen stacks, no repeats. */
function chooseQuestions(entries: QuestionEntry[], slots: Slot[], settings: Settings, used = new Set<string>(), variety?: Variety): Map<Slot, QuestionEntry[]> {
  const chosen = new Map<Slot, QuestionEntry[]>();
  const pool = entries.filter(entry => entry.kind === "question" && !isContextQuestion(entry) && entry.question.length <= MAX_QUESTION_LENGTH && entry.answer.trim().length > 40);
  // Another set: questions from earlier sets go last (used only when nothing new is left), the rest in random order.
  const seen = (entry: QuestionEntry) => (variety?.avoid.has(entry.question) ? 1 : 0);
  const order = new Map(variety ? pool.map(entry => [entry.id, Math.random()]) : []);
  const position = (a: QuestionEntry, b: QuestionEntry) =>
    variety ? order.get(a.id)! - order.get(b.id)! : a.source.path.localeCompare(b.source.path) || a.source.startLine - b.source.startLine;
  for (const slot of slots) {
    const id = slot.category.id;
    const fitting = pool.filter(entry => SOURCES[id](entry) && stackFits(entry, settings, id));
    // Near the asked level first; when the notes only have harder ones (design and scenarios are mostly
    // advanced), use those rather than leave the section empty. Each question shows its own level.
    const nearLevel = fitting.filter(entry => levelRank(entry, settings.level) < 9);
    const candidates = (nearLevel.length ? nearLevel : fitting)
      .sort((a, b) => seen(a) - seen(b) || levelRank(a, settings.level) - levelRank(b, settings.level) || position(a, b));
    const picks: QuestionEntry[] = [];
    // Core questions rotate through the chosen stacks; other categories through their source files, so a set mixes material.
    const byFile = [...new Set(candidates.map(entry => entry.source.path))].map(path => candidates.filter(entry => entry.source.path === path));
    // Files in random order too, so another set does not always start from the same notes.
    if (variety) byFile.sort((a, b) => seen(a[0]) - seen(b[0]) || order.get(a[0].id)! - order.get(b[0].id)!);
    // When leadership is a focus, the leadership notes lead the behavioural section.
    if (settings.focus.includes("Technical leadership")) byFile.sort((a, b) => Number(b[0].source.path.startsWith("interview/leadership/")) - Number(a[0].source.path.startsWith("interview/leadership/")));
    const groups = id === "core" ? settings.topics.map(topic => candidates.filter(entry => entry.topics[0] === topic)).filter(group => group.length) : byFile;
    for (let round = 0; picks.length < slot.count && groups.some(group => group.length > round); round++) {
      for (const group of groups) {
        const next = group.filter(entry => !used.has(entry.id) && !used.has(entry.question))[0];
        if (!next || picks.length >= slot.count) continue;
        picks.push(next);
        used.add(next.id);
        used.add(next.question);
      }
    }
    chosen.set(slot, picks);
  }
  return chosen;
}

/** Two or three points a good answer must mention, taken from the model answer's own bullets. */
export function keyPoints(entry: QuestionEntry): string[] {
  const lines = entry.answer.replace(/^\s*(```|~~~)[\s\S]*?^\s*\1\s*$/gm, "").split("\n");
  const bullets = lines
    .filter(line => /^\s*([-*]|\d+\.)\s+\S/.test(line) && !/^\s*[-*]\s*\[/.test(line))
    .map(line => plainText(line))
    .filter(text => text.length >= 12 && text.length <= 140);
  if (bullets.length) return [...new Set(bullets)].slice(0, 3);
  const bold = [...entry.answer.matchAll(/\*\*([^*]{12,80})\*\*/g)].map(match => plainText(match[1])).filter(text => !/^(answer|example|note)\b/i.test(text));
  return [...new Set(bold)].slice(0, 3);
}

const LEVEL_NAMES: Record<Level, string> = { 1: "Intermediate", 2: "Advanced", 3: "Expert" };

/** What a strong answer looks like at this experience level. */
const EXPECTATIONS: Record<Seniority, string[]> = {
  junior: [
    "Explains concepts correctly in their own words, with a small example.",
    "Writes working code for an easy–medium problem and can test it.",
    "Shows curiosity and asks clarifying questions.",
  ],
  mid: [
    "Explains how things work, not just what they are, and when to use them.",
    "Writes clean, tested code and discusses complexity without prompting.",
    "Owns features end to end and can describe a bug they debugged in production.",
  ],
  senior: [
    "Discusses trade-offs and failure modes, not just the happy path.",
    "Drives the design discussion: clarifies requirements, estimates scale, picks and defends components.",
    "Has debugged real production incidents and can explain the root cause and the fix.",
    "Reviews code and mentors others; gives concrete examples.",
  ],
  lead: [
    "Makes and explains architecture decisions with cost, risk and team skills in mind.",
    "Leads incidents and design reviews; can say what they would do differently.",
    "Has grown people: mentoring, hiring, handling conflict and underperformance.",
    "Connects technical choices to business outcomes and communicates them to non-engineers.",
  ],
};

const RED_FLAGS: Record<Seniority, string[]> = {
  junior: ["Memorised definitions with no example", "Can't explain their own project code"],
  mid: ["Only textbook answers, no real-project examples", "No testing mindset; ignores edge cases"],
  senior: ["Says \"we\" but can't explain their own part", "No trade-offs: one tool for every problem", "Can't describe a production issue they owned"],
  lead: ["Hands-off on technical depth", "Blames the team for failures", "No examples of decisions that went wrong and what they learned"],
};

function companyNote(settings: Settings): string | null {
  switch (settings.companyType) {
    case "Product-based company":
      return "Product companies weigh problem-solving, DSA and system design heavily; expect optimal solutions and clear complexity analysis.";
    case "Service-based company":
      return "Service companies weigh breadth of core knowledge, SQL and client-facing communication; check delivery and estimation experience.";
    case "Startup":
      return "Startups value hands-on ownership, speed and debugging under pressure; check they can ship end to end with little support.";
    case "Enterprise / bank (BFSI)":
      return "Banks and large enterprises weigh reliability, security, data consistency and process (change management, audits).";
    default:
      return null;
  }
}

function settingsTable(settings: Settings): string[] {
  const rows: Array<[string, string]> = [
    ["Role", settings.role],
    ["Experience", experienceFor(settings.years)],
    ["Tech stack", settings.stackLabels.join(", ") || "General (no stack picked)"],
    ["Duration", settings.rounds > 1 ? `${settings.rounds} rounds × ${settings.minutes} minutes` : `${settings.minutes} minutes`],
    ["Difficulty", LEVEL_NAMES[settings.level]],
    ["Company", [settings.company, settings.companyType].filter(Boolean).join(" — ") || "Not specified"],
    ["Focus", settings.focus.join(", ") || "Balanced"],
  ];
  return ["| Setting | Choice |", "|---|---|", ...rows.map(([name, value]) => `| ${name} | ${value} |`)];
}

/** The expected answer and the points to look for, without heading fragments or repeats. */
function expectedAnswer(entry: QuestionEntry): { expected: string | null; lookFor: string[] } {
  const points = keyPoints(entry);
  const summary = entry.summary.trim();
  const lead = summary.endsWith(":") ? summary.slice(0, -1) : summary;
  if (lead.length < 40) return { expected: points.length ? points.join("; ") : lead || null, lookFor: [] };
  const extra = points.filter(point => !summary.includes(point.slice(0, 25)));
  if (summary.endsWith(":")) return { expected: extra.length ? `${lead}: ${extra.join("; ")}` : lead, lookFor: [] };
  return { expected: summary, lookFor: extra };
}

async function questionBlock(entry: QuestionEntry, number: number, slot: Slot, settings: Settings, optional: boolean): Promise<string[]> {
  const category = slot.category;
  const followUps = (await getFollowUps(entry.id)).map(item => item.question).slice(0, 2);
  const probes = [...followUps, ...category.probes].slice(0, settings.seniority === "junior" ? 2 : 3);
  const { expected, lookFor } = expectedAnswer(entry);
  const perQuestion = Math.max(category.perQuestion, Math.floor(slot.minutes / Math.max(1, slot.count)));
  const tag = `_~${perQuestion} min · ${LEVEL_NAMES[levelOf(entry)]}${optional ? " · optional if short on time" : ""}_`;
  const lines = [`**Q${number}. ${entry.question}**  `, tag, ""];
  if (expected) lines.push(`- **Expected answer:** ${expected}`);
  if (lookFor.length) lines.push(`- **Look for:** ${lookFor.join("; ")}`);
  lines.push(`- **Follow-ups:** ${probes.map(probe => `“${probe}”`).join(" · ")}`);
  lines.push(`- ${askLink("Full model answer", entry.question)}`);
  return lines;
}

interface Variety {
  /** Questions already shown in earlier sets. */
  avoid: Set<string>;
}

/** The question set for the ticked options. `avoid`: questions from earlier sets; the new set picks others at random. */
export async function buildQuestionSet(plan: PlanRequest, avoid?: Set<string>): Promise<string> {
  const settings = readSettings(plan);
  const variety: Variety | undefined = avoid ? { avoid } : undefined;
  const { entries } = await loadQuestionIndex();
  const header = `**Interview question set: ${settings.role} · ${experienceFor(settings.years)}${settings.company ? ` · for ${settings.company}` : ""}**`;
  const lines = [header, "", ...settingsTable(settings), ""];
  const note = companyNote(settings);
  if (note) lines.push(`_${note}_`, "");

  const rounds = settings.rounds > 1
    ? [1, 2].map(round => ({ name: round === 1 ? "Round 1 — Hands-on technical" : "Round 2 — Design, architecture & leadership", categories: settings.categories.filter(category => category.round === round) })).filter(round => round.categories.length)
    : [{ name: "", categories: settings.categories }];

  let number = 0;
  // Shared by both rounds, so no question is asked twice.
  const used = new Set<string>();
  for (const round of rounds) {
    const { slots, intro, close, dropped } = allocate(round.categories, settings.minutes, settings);
    const chosen = chooseQuestions(entries, slots, settings, used, variety);
    if (round.name) lines.push(`### ${round.name} (${settings.minutes} min)`, "");
    lines.push("**Time plan**", "", "| Part | Time | Questions |", "|---|---|---|", `| Intro${settings.seniority === "junior" ? "" : " + recent project walkthrough"} | ${intro} min | — |`);
    for (const slot of slots) lines.push(`| ${slot.category.label} | ${slot.minutes} min | ${chosen.get(slot)?.length ?? 0} |`);
    lines.push(`| Candidate's questions + wrap-up | ${close} min | — |`, "");
    if (dropped.length) {
      const extra = dropped.reduce((sum, category) => sum + minimumOf(category), 0);
      lines.push(`_Not enough time for: **${dropped.map(category => category.label).join(", ")}** (about ${extra} more minutes). Pick a longer duration or 2 rounds to include them, or untick a category above._`, "");
    }
    if (settings.seniority !== "junior") lines.push(`**Opening (${intro} min):** ask for a walkthrough of a recent system they built — their exact role, the architecture, the hardest problem and the result in numbers. Pick follow-ups from it throughout the interview.`, "");
    for (const slot of slots) {
      const picks = chosen.get(slot) ?? [];
      lines.push(`#### ${slot.category.label} · ${slot.minutes} min`, "");
      if (!picks.length) {
        lines.push(`_Your notes have no ${slot.category.label.toLowerCase()} questions for this stack and level yet — they will be added in a future update. Until then, use your own or widen the stack._`, "");
        continue;
      }
      // The first half of each section is must-ask; the rest can go if time runs short.
      const mustAsk = Math.ceil(picks.length / 2);
      for (const [i, entry] of picks.entries()) lines.push(...(await questionBlock(entry, ++number, slot, settings, i >= mustAsk)), "");
    }
  }

  lines.push(
    "**How to score**",
    "",
    "| Score | Meaning |",
    "|---|---|",
    "| 1 | Can't explain it, or gets it wrong |",
    "| 2 | Textbook definition only |",
    "| 3 | Explains how it works, with a real example |",
    "| 4 | Adds trade-offs, failure modes and production experience |",
    "",
    `**What a strong ${experienceFor(settings.years)} candidate shows**`,
    "",
    ...EXPECTATIONS[settings.seniority].map(item => `- ${item}`),
    "",
    "**Red flags**",
    "",
    ...RED_FLAGS[settings.seniority].map(item => `- ${item}`),
    "",
    `**Suggested bar:** ${settings.seniority === "junior" ? "average 2.5+ with working code" : settings.seniority === "mid" ? "average 3+ and no 1s in core topics" : "average 3+, at least one 4 in design or architecture, and no 1s"}. Write notes against each question during the interview, not after.`,
    "",
    `_Questions come from your notes, so expected answers are only as current as the notes. Ask for "${ANOTHER_SET}" to get different questions with the same settings._`,
  );
  return lines.join("\n");
}

// ---------- Another set with the same settings ----------

/** The chip offered after a question set. */
export const ANOTHER_SET = "Generate another set of these interview questions";

/** "Generate another set", "more questions like these", "a different set". */
export function isAnotherSetRequest(message: string): boolean {
  const text = message.toLowerCase();
  return /\b(another|new|different|more|next|fresh|other)\b/.test(text) && /\b(set|questions?|batch)\b/.test(text);
}

const SETTING_ROW = /^\| (Role|Experience|Tech stack|Duration|Difficulty|Company|Focus) \| (.+) \|$/;

/**
 * Rebuilds the settings of the latest question set in the conversation from its own text (its settings
 * table and time plan), so "another set" needs nothing stored. Also returns every question already asked.
 */
export function previousQuestionSet(answers: string[]): { plan: PlanRequest; asked: Set<string> } | null {
  const sets = answers.filter(text => text.startsWith(`**${SETUP_PREFIX}`) && text.includes("| Setting | Choice |"));
  const last = sets.at(-1);
  if (!last) return null;
  // The history comes from the browser: keep to the same limits as a plan sent directly.
  const header = (/^\*\*Interview question set: (.+?)\*\*/.exec(last)?.[1] ?? "").slice(0, 160);
  const labels: string[] = [];
  for (const line of last.split("\n")) {
    const row = SETTING_ROW.exec(line.trim());
    if (row) {
      const [, name, value] = row;
      if (name === "Tech stack" || name === "Focus") labels.push(...value.split(", "));
      else if (name === "Company") labels.push(...value.split(" — "));
      else labels.push(value);
      continue;
    }
    // Categories: the time plan rows, and any that did not fit.
    const category = CATEGORIES.find(item => line.startsWith(`| ${item.label} |`));
    if (category) labels.push(category.label);
    const dropped = /^_Not enough time for: \*\*(.+?)\*\*/.exec(line);
    if (dropped) labels.push(...dropped[1].split(", "));
  }
  const asked = new Set(sets.flatMap(text => [...text.matchAll(/^\*\*Q\d+\. (.+?)\*\* {0,2}$/gm)].map(match => match[1])));
  return { plan: { title: `${SETUP_PREFIX}${header}`, items: [...new Set(labels)].slice(0, 60).map(label => ({ label: label.slice(0, 200) })), kind: "question-set" }, asked };
}
