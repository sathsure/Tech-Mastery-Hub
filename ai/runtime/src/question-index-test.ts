import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { getFollowUps, getQuestionsByTopic, loadQuestionIndex } from "./question-index.js";
import { buildQuestionIndex, cleanHeading, extractCodeBlocks, listSourceFiles, QUESTION_INDEX_PATH, REPOSITORY_ROOT, summarize } from "./question-indexer.js";

const results: string[] = [];
function check(name: string, run: () => void | Promise<void>) {
  return Promise.resolve()
    .then(run)
    .then(() => results.push(`PASS ${name}`))
    .catch(error => {
      results.push(`FAIL ${name}: ${error instanceof Error ? error.message : String(error)}`);
      process.exitCode = 1;
    });
}

const index = buildQuestionIndex("test");
const find = (path: string, text: string) =>
  index.entries.find(entry => entry.source.path === path && entry.question.toLowerCase().includes(text.toLowerCase()));

await check("helpers clean headings, extract code and summarize", () => {
  assert.equal(cleanHeading("❓ 1. What is Largest Contentful Paint (LCP)?"), "What is Largest Contentful Paint (LCP)?");
  assert.equal(cleanHeading("↳ **Follow-up:** Why does `transform` win?"), "Why does `transform` win?");
  assert.equal(cleanHeading("1️⃣ OOP & Design Thinking"), "OOP & Design Thinking");
  assert.equal(cleanHeading("Why microservices over monolith?\\_"), "Why microservices over monolith?");
  assert.deepEqual(extractCodeBlocks("> ```java\n> int x = 1;\n> ```"), [{ language: "java", code: "int x = 1;" }]);
  assert.equal(summarize("## Title\n\n```js\nx\n```\n\nA **closure** keeps its scope alive."), "A closure keeps its scope alive.");
});

await check("every source file is indexed", () => {
  const files = listSourceFiles();
  assert.ok(files.length >= 31, `expected at least 31 files, got ${files.length}`);
  for (const file of files) assert.ok(index.files.some(stats => stats.path === file), `${file} missing from stats`);
  assert.ok(index.stats.questions >= 600, `expected 600+ questions, got ${index.stats.questions}`);
});

await check("entries are complete and point at real lines", () => {
  const lineCounts = new Map<string, number>();
  for (const entry of index.entries) {
    assert.ok(entry.question.length > 0, `${entry.id} has no question`);
    assert.ok(entry.answer.trim().length > 0, `${entry.id} has no answer`);
    if (!lineCounts.has(entry.source.path)) {
      lineCounts.set(entry.source.path, readFileSync(resolve(REPOSITORY_ROOT, entry.source.path), "utf8").split(/\r?\n/).length);
    }
    const total = lineCounts.get(entry.source.path)!;
    assert.ok(entry.source.startLine >= 1 && entry.source.endLine <= total && entry.source.startLine <= entry.source.endLine, `${entry.id} has bad line range`);
  }
});

await check("ids are unique and follow-ups link to an existing parent", () => {
  const ids = new Set(index.entries.map(entry => entry.id));
  assert.equal(ids.size, index.entries.length);
  for (const entry of index.entries.filter(item => item.kind === "follow-up")) {
    assert.ok(entry.parentId && ids.has(entry.parentId), `${entry.id} has no valid parent`);
  }
});

await check("every repository image resolves to a file", () => {
  for (const visual of index.entries.flatMap(entry => entry.visuals)) {
    if (visual.origin === "repository") assert.ok(visual.path && existsSync(resolve(REPOSITORY_ROOT, visual.path)), `${visual.reference} does not resolve`);
  }
});

await check("closures question keeps its code and summary", () => {
  const entry = find("interview/frontend/03-JavaScript.md", "closures");
  assert.ok(entry, "closures question not found");
  assert.deepEqual(entry.topics, ["javascript"]);
  assert.ok(entry.codeBlocks.length > 0 && entry.codeBlocks.every(block => block.language === "js"));
  assert.match(entry.summary, /closure is a function/i);
});

await check("bare ❓ questions (web-vitals) are split", () => {
  assert.equal(index.files.find(file => file.path === "interview/architecture/01-web-vitals.md")?.questions, 6);
  assert.ok(find("interview/architecture/01-web-vitals.md", "CLS"));
});

await check("level-2 headings inside an answer do not split it", () => {
  const entry = find("practice/coding/03-angular-coding.md", "manages users");
  assert.ok(entry, "angular CRUD question not found");
  assert.match(entry.answer, /User Model/);
  assert.ok(entry.codeBlocks.length >= 10);
});

await check("files without questions become section notes", () => {
  const notes = index.entries.filter(entry => entry.source.path === "interview/architecture/02-aws-cloud.md");
  assert.ok(notes.length >= 20 && notes.every(entry => entry.kind === "note"));
  assert.ok(notes.some(entry => entry.visuals.some(visual => visual.path === "knowledge/visual-notes/aws-compute.png")));
  assert.match(find("interview/architecture/02-aws-cloud.md", "Core Compute")?.summary ?? "", /Amazon EC2/);
});

await check("quoted snippets are captured as the question prompt", () => {
  const entry = find("practice/coding/java/01-core-java-coding.md", "output");
  assert.ok(entry, "output question not found");
  assert.ok(entry.prompt?.includes("finally"), "prompt snippet not captured");
  assert.ok(entry.codeBlocks.some(block => block.code.includes("return 2;")));
});

await check("Atlas: every role, glossary term and technology is indexed", () => {
  const atlas = "IT_Roles_Terminology_Atlas/IT_Roles_Terminology_Atlas.md";
  const source = readFileSync(resolve(REPOSITORY_ROOT, atlas), "utf8").split(/\r?\n/);
  const rolesStart = source.indexOf("## IT Roles");
  const rolesEnd = source.findIndex((line, position) => position > rolesStart && /^## /.test(line));
  const roleHeadings = source.slice(rolesStart, rolesEnd).filter(line => /^#### /.test(line)).length;
  const resume = index.entries.find(entry => entry.source.path === atlas && entry.question.includes("Expected Resume Skills"));
  assert.ok(resume?.answer.includes("#### DevOps / Cloud / SRE"), "sub-headings outside IT Roles stay inside their section");
  const entries = index.entries.filter(entry => entry.source.path === atlas);
  const roles = entries.filter(entry => entry.kind === "role");
  assert.equal(roles.length, roleHeadings, "one entry per role heading");
  assert.ok(roles.every(role => role.summary && role.names?.length && role.answer.includes("**Languages:**")), "roles need summary, names and details");
  assert.ok(entries.filter(entry => entry.kind === "term" && entry.section[0] === "Glossary").length >= 250);
  assert.ok(entries.filter(entry => entry.kind === "term" && entry.section[0] === "Technology Stack Map").length >= 100);
  const sre = roles.find(role => role.question.includes("Site Reliability"));
  assert.ok(sre?.names?.includes("SRE"));
  const frontend = roles.find(role => role.question === "What does a Frontend Developer do?");
  assert.ok(frontend?.relatedTopics?.includes("angular") && frontend.relatedTopics.includes("react"), "roles link to learning topics");
  const atlasTopics = new Set(["it-roles", "it-terminology", "tech-stack", "it-careers"]);
  assert.ok(entries.every(entry => !(entry.relatedTopics ?? []).some(topic => atlasTopics.has(topic))), "relatedTopics are learning topics only");
  for (const entry of entries) {
    const text = source.slice(entry.source.startLine - 1, entry.source.endLine).join("\n");
    assert.ok(entry.kind !== "term" || text.includes(entry.names?.[0]?.split(" ")[0] ?? ""), `${entry.id} line range does not contain its name`);
  }
  assert.ok(!index.files.some(file => file.path.endsWith("completion.md")), "unrelated files in the Atlas folder are not indexed");
});

await check("roadmaps: generated files become roadmap entries; backups are skipped", () => {
  const roadmaps = index.entries.filter(entry => entry.kind === "roadmap");
  assert.ok(roadmaps.length >= 40, `expected 40+ roadmaps, got ${roadmaps.length}`);
  assert.ok(!index.files.some(file => file.path.endsWith(".backup.md")), "migration backups are not content");
  const sre = roadmaps.find(entry => entry.question === "Roadmap: Site Reliability Engineer");
  assert.ok(sre && sre.names?.includes("SRE"), "role roadmaps answer to the role's names");
  assert.ok(sre.answer.includes("- [ ]"), "roadmaps are checklists");
  const react = roadmaps.find(entry => entry.question === "React study path");
  assert.deepEqual(react?.topics, ["react"]);
  const restored = index.entries.find(entry => entry.source.path === "roadmap/frontend/README.md");
  assert.ok(restored?.kind === "note", "hand-written roadmap areas are indexed as notes");
});

await check("roadmaps: every checklist link points at a real file", () => {
  for (const entry of index.entries.filter(item => item.kind === "roadmap")) {
    for (const match of entry.answer.matchAll(/\]\(([^)#\s]+\.md)\)/g)) {
      const target = resolve(REPOSITORY_ROOT, dirname(entry.source.path), match[1]);
      assert.ok(existsSync(target), `${entry.source.path} links to missing ${match[1]}`);
    }
  }
});

await check("build is deterministic", () => {
  assert.equal(JSON.stringify(buildQuestionIndex("test")), JSON.stringify(index));
});

await check("committed index matches the sources", async () => {
  const committed = await loadQuestionIndex();
  assert.equal(committed.source_fingerprint, index.source_fingerprint, `stale ${QUESTION_INDEX_PATH}; run npm run question-index`);
  assert.equal(committed.entries.length, index.entries.length);
  assert.ok((await getQuestionsByTopic("RxJS")).length > 50);
  const parent = find("interview/frontend/01-HTML.md", "render a webpage");
  assert.ok(parent && (await getFollowUps(parent.id)).length >= 1);
});

process.stdout.write(results.join("\n") + `\n${results.filter(line => line.startsWith("PASS")).length}/${results.length} passed\n`);
