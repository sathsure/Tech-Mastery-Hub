import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { AddressInfo } from "node:net";
import { createTutorApiServer } from "./api-server.js";
import { retrieveKnowledge } from "./knowledge-retriever.js";
import { REPOSITORY_ROOT } from "./question-indexer.js";
import { editDistance, loadVocabulary, resolveTopic, searchQuestions, stem } from "./question-search.js";

const results: string[] = [];
async function check(name: string, run: () => void | Promise<void>) {
  try {
    await run();
    results.push(`PASS ${name}`);
  } catch (error) {
    results.push(`FAIL ${name}: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
}

/** Plain-language questions and the entry that must appear in the top results. */
const GOLDEN: Array<{ query: string; path: string; question: RegExp; within?: number }> = [
  { query: "closures", path: "interview/frontend/03-JavaScript.md", question: /closures/i, within: 1 },
  { query: "How does the event loop work?", path: "interview/frontend/03-JavaScript.md", question: /event loop/i, within: 3 },
  { query: "node event loop phases", path: "interview/backend/node/01-Node.js.md", question: /event loop/i, within: 3 },
  { query: "what does flex-basis mean", path: "interview/frontend/02-CSS.md", question: /flex-basis/i, within: 1 },
  { query: "node.js streams", path: "interview/backend/node/01-Node.js.md", question: /streams/i, within: 1 },
  { query: "difference between DI and IoC in spring", path: "interview/backend/java/03-Spring-1.md", question: /ioc/i, within: 1 },
  { query: "show me a diagram of the angular lifecycle", path: "interview/frontend/05-Angular-1.md", question: /lifecycle hooks/i, within: 1 },
  { query: "useEffect cleanup", path: "interview/frontend/06-React.md", question: /useEffect/, within: 2 },
  { query: "my spring boot app is slow with thousands of users", path: "interview/backend/java/08-Architecture.md", question: /slow/i, within: 3 },
  { query: "docker vs virtual machine", path: "interview/architecture/03-devops-build-tools.md", question: /virtual machine/i, within: 2 },
  { query: "how to reduce CLS", path: "interview/architecture/01-web-vitals.md", question: /cls/i, within: 1 },
  { query: "BehaviorSubject vs ReplaySubject", path: "interview/frontend/06-RxJS.md", question: /BehaviorSubject/, within: 2 },
  { query: "what is jwt and is it secure", path: "interview/backend/node/06-Node-security.md", question: /jwt/i, within: 3 },
  { query: "sql joins", path: "practice/coding/sql/02-MySQL-coding.md", question: /./, within: 8 },
];

/** Unrelated text must stay a repository gap rather than be forced onto a topic. */
const GAPS = ["xyz-nonexistent-topic", "totally-unknown-tech-mastery-topic", "xyz-nonexistent-model-topic"];

await check("text helpers", () => {
  assert.equal(stem("closures"), "closure");
  assert.equal(stem("queries"), "query");
  assert.equal(stem("class"), "class");
  assert.equal(editDistance("javscript", "javascript"), 1);
  assert.equal(editDistance("angualr", "angular"), 1);
  assert.ok(editDistance("react", "redux") > 1);
});

await check("vocabulary is valid and topics exist in the content index", () => {
  const vocabulary = loadVocabulary();
  const concepts = new Set(
    (JSON.parse(readFileSync(resolve(REPOSITORY_ROOT, "ai/knowledge-index/content-index.json"), "utf8").replace(/^﻿/, "")) as { documents: Array<{ canonical_concept: string | null }> }).documents
      .map(document => document.canonical_concept)
      .filter(Boolean),
  );
  const indexed = JSON.parse(readFileSync(resolve(REPOSITORY_ROOT, "ai/knowledge-index/question-index.json"), "utf8")) as { entries: Array<{ topics: string[] }> };
  for (const entry of indexed.entries) for (const topic of entry.topics) concepts.add(topic);
  const owners = new Map<string, string>();
  for (const [topic, aliases] of Object.entries(vocabulary.topicAliases)) {
    assert.ok(concepts.has(topic), `topicAliases has unknown topic "${topic}"`);
    for (const alias of aliases) {
      assert.ok(!owners.has(alias), `alias "${alias}" is used by both ${owners.get(alias)} and ${topic}`);
      owners.set(alias, topic);
    }
  }
});

for (const golden of GOLDEN) {
  await check(`finds: "${golden.query}"`, () => {
    const result = searchQuestions(golden.query, { limit: golden.within ?? 3 });
    const found = result.hits.some(hit => hit.source.path === golden.path && golden.question.test(hit.question));
    assert.ok(found, `top ${golden.within ?? 3} were: ${result.hits.map(hit => `${hit.question} (${hit.source.path})`).join(" | ")}`);
  });
}

await check("unrelated text is not mapped to a topic", () => {
  for (const query of GAPS) assert.equal(resolveTopic(query), null, `"${query}" resolved to ${JSON.stringify(resolveTopic(query))}`);
});

await check("free text resolves to the right topic", () => {
  assert.equal(resolveTopic("closures")?.topic, "javascript");
  assert.equal(resolveTopic("unknown")?.topic, "typescript"); // TypeScript has an `unknown` type
  assert.equal(resolveTopic("javscript hoisting")?.topic, "javascript");
  assert.equal(resolveTopic("javscript hoisting")?.via, "typo");
  assert.equal(resolveTopic("what are lifecycle hooks in angular")?.topic, "angular");
  assert.ok(["javascript", "nodejs"].includes(resolveTopic("How does the event loop work?")?.topic ?? ""));
});

await check("aliases do not over-match", () => {
  assert.deepEqual(searchQuestions("node.js streams").topics.map(item => item.topic), ["nodejs"]);
  assert.deepEqual(searchQuestions("what does hoisting mean").topics, []);
  assert.deepEqual(searchQuestions("spring security filter chain").topics.map(item => item.topic), ["spring-security"]);
  assert.deepEqual(searchQuestions("lambda expressions in java").topics.map(item => item.topic), ["java"]);
});

await check("intents are detected", () => {
  assert.ok(searchQuestions("prepare me for a react interview").intents.includes("interview-prep"));
  assert.ok(searchQuestions("where do I start").intents.includes("roadmap"));
  assert.ok(searchQuestions("what is a devops engineer").intents.includes("role"));
  assert.ok(searchQuestions("show me a diagram of the event loop").intents.includes("visual"));
  assert.ok(searchQuestions("promise vs observable").intents.includes("compare"));
  assert.ok(searchQuestions("my api is slow, how do I fix it").intents.includes("debug"));
  assert.ok(searchQuestions("quiz me on css").intents.includes("quiz"));
  assert.ok(searchQuestions("write code to debounce").intents.includes("code"));
  assert.deepEqual(searchQuestions("closures").intents, ["explain"]);
});

await check("naming only a topic gives an overview across its sections", () => {
  const result = searchQuestions("Prepare me for a Java backend interview", { limit: 8 });
  assert.equal(result.mode, "browse");
  assert.equal(result.hits.length, 8);
  assert.ok(result.hits.every(hit => hit.topics.includes("java")));
  assert.ok(new Set(result.hits.map(hit => `${hit.source.path}|${hit.section.join("|")}`)).size >= 5, "overview should span sections");
});

await check("no subject gives suggestions instead of nothing", () => {
  const result = searchQuestions("can you help me");
  assert.equal(result.mode, "empty");
  assert.ok(result.suggestions.topics.length >= 4 && result.suggestions.questions.length >= 1);
  const gap = searchQuestions("xyz-nonexistent-topic");
  assert.equal(gap.confidence, "none");
  assert.ok(gap.suggestions.topics.length > 0);
});

await check("tree search prunes branches but returns exactly the exhaustive results", () => {
  let prunedSomewhere = false;
  for (const { query } of GOLDEN) {
    const fast = searchQuestions(query, { limit: 8 });
    const full = searchQuestions(query, { limit: 8, exhaustive: true });
    assert.deepEqual(fast.hits.map(hit => [hit.id, hit.score]), full.hits.map(hit => [hit.id, hit.score]), `results differ for "${query}"`);
    if (fast.strategy.branchesVisited < fast.strategy.branchesTotal) prunedSomewhere = true;
  }
  assert.ok(prunedSomewhere, "pruning never skipped a branch");
  const narrowed = searchQuestions("angular lifecycle hooks");
  assert.ok(narrowed.strategy.branchesVisited < narrowed.strategy.branchesTotal / 4, "topic narrowing should search a small part of the tree");
});

await check("topic filter restricts results", () => {
  const result = searchQuestions("lifecycle", { topic: "react" });
  assert.ok(result.hits.length > 0 && result.hits.every(hit => hit.topics.includes("react")));
});

const ATLAS = "IT_Roles_Terminology_Atlas/IT_Roles_Terminology_Atlas.md";

/** Queries that name a role or term must put that entry first. */
const LOOKUPS: Array<{ query: string; first: RegExp }> = [
  { query: "what is a DevOps engineer", first: /^What does a DevOps Engineer do\?$/ },
  { query: "SRE", first: /Site Reliability Engineer/ },
  { query: "what does a frontend developer do", first: /Frontend Developer/ },
  { query: "what is SDLC", first: /^What is SDLC/ },
  { query: "full form of CI/CD", first: /CI\/CD/ },
  { query: "kafka", first: /Kafka/ },
  { query: "how much does a data engineer earn", first: /^What does a Data Engineer do\?$/ },
];

for (const lookup of LOOKUPS) {
  await check(`looks up: "${lookup.query}"`, () => {
    const top = searchQuestions(lookup.query, { limit: 3 }).hits[0];
    assert.ok(top && top.source.path === ATLAS && lookup.first.test(top.question) && top.matchedBy === "name", `top was: ${top?.question} (${top?.matchedBy})`);
  });
}

await check("a topic name opens that topic's overview", () => {
  for (const [query, topic] of [["messaging", "messaging"], ["java", "java"], ["leetcode", "dsa"]] as const) {
    const result = searchQuestions(query, { limit: 8 });
    assert.equal(result.mode, "browse", `"${query}" mode ${result.mode}`);
    assert.ok(result.topics.some(item => item.topic === topic), `"${query}" topics ${JSON.stringify(result.topics)}`);
  }
});

await check("a named role also brings its salary section", () => {
  for (const [query, salary] of [["devops engineer salary", /DevOps \/ Cloud \/ SRE/], ["how much does a data engineer earn", /Skills vs Salary.*Data Engineer/]] as const) {
    const hits = searchQuestions(query, { limit: 4 }).hits;
    assert.ok(hits.some(hit => salary.test(hit.question)), `"${query}" top 4: ${hits.map(hit => hit.question).join(" | ")}`);
  }
});

await check("names are only pinned when they are the whole subject", () => {
  for (const query of ["kafka consumer lag", "java streams", "Prepare me for a Java backend interview", "what is it", "closures"]) {
    assert.deepEqual(searchQuestions(query).entities, [], `"${query}" pinned ${JSON.stringify(searchQuestions(query).entities)}`);
  }
  assert.equal(searchQuestions("java streams").hits[0].source.path.startsWith("interview/"), true);
});

await check("asking about roles in general lists roles", () => {
  const result = searchQuestions("what roles are there in IT", { limit: 6 });
  assert.equal(result.mode, "browse");
  assert.ok(result.hits.length === 6 && result.hits.every(hit => hit.kind === "role"));
  assert.ok(new Set(result.hits.map(hit => hit.section.join("|"))).size >= 4, "should span role families");
});

await check("tutor retrieval maps role questions to the matching concept", async () => {
  const evidence = await retrieveKnowledge("what is a DevOps engineer");
  assert.ok(evidence.some(item => item.canonicalConcept === "devops"));
});

await check("roadmap requests return the roadmap first", () => {
  const cases: Array<[string, string]> = [
    ["Roadmap to become a DevOps Engineer", "Roadmap: DevOps Engineer"],
    ["SRE roadmap", "Roadmap: Site Reliability Engineer"],
    ["roadmap to learn react", "React study path"],
    ["Prepare me for a Java backend interview", "Java study path"],
  ];
  for (const [query, first] of cases) assert.equal(searchQuestions(query).hits[0]?.question, first, query);
  assert.equal(searchQuestions("what is a devops engineer").hits[0]?.kind, "role", "plain role questions still show the role first");
});

await check("'where do I start' lists the learning tracks, then study paths in track order", () => {
  const hits = searchQuestions("where do I start", { limit: 4 }).hits;
  assert.deepEqual(hits.map(hit => hit.source.path), ["roadmap/topics/README.md", "roadmap/roles/README.md", "roadmap/topics/html.md", "roadmap/topics/css.md"]);
});

await check("results are deterministic", () => {
  assert.deepEqual(searchQuestions("event loop"), searchQuestions("event loop"));
});

await check("tutor retrieval now answers free-text questions and keeps gaps", async () => {
  const closures = await retrieveKnowledge("closures");
  assert.ok(closures.some(item => item.canonicalConcept === "javascript"), "closures should retrieve the javascript concept page");
  assert.equal((await retrieveKnowledge("xyz-nonexistent-topic")).length, 0);
  assert.ok((await retrieveKnowledge("typescript")).length > 0, "exact topics still work");
});

await check("API /search (GET and POST) and validation", async () => {
  const server = createTutorApiServer();
  await new Promise<void>(done => server.listen(0, "127.0.0.1", () => done()));
  const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  try {
    const get = await fetch(`${base}/search?q=${encodeURIComponent("event loop")}&limit=2`);
    assert.equal(get.status, 200);
    const getBody = (await get.json()) as { data: { hits: unknown[] } };
    assert.equal(getBody.data.hits.length, 2);
    const post = await fetch(`${base}/search`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ query: "closures", topic: "javascript" }) });
    assert.equal(post.status, 200);
    assert.equal(((await post.json()) as { data: { confidence: string } }).data.confidence, "high");
    assert.equal((await fetch(`${base}/search?q=`)).status, 400);
    assert.equal((await fetch(`${base}/search?q=x&limit=999`)).status, 400);
    assert.equal((await fetch(`${base}/search`, { method: "POST", headers: { "content-type": "application/json" }, body: "{bad" })).status, 400);
    assert.equal((await fetch(`${base}/search`, { method: "DELETE" })).status, 405);
  } finally {
    await new Promise<void>(done => server.close(() => done()));
  }
});

process.stdout.write(results.join("\n") + `\n${results.filter(line => line.startsWith("PASS")).length}/${results.length} passed\n`);
