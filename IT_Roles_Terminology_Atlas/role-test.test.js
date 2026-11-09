/* Checks the Role Readiness Test bank and scoring. Run: node IT_Roles_Terminology_Atlas/role-test.test.js */
const assert = require("node:assert/strict");
const bank = require("./role-test-data-5.js");
const E = require("./role-test-engine.js");
const A = require("./it-atlas-data.js");

const results = [];
function check(name, run) {
  try { run(); results.push(`PASS ${name}`); } catch (e) { results.push(`FAIL ${name}: ${e.message}`); process.exitCode = 1; }
}
let seed = 7;
const random = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);

check("bank: every topic has 12 questions — 4 easy, 4 medium, 4 hard — with valid answers and no repeats", () => {
  for (const [id, t] of Object.entries(bank.topics)) {
    for (const level of [1, 2, 3]) assert.equal(t.q.filter((q) => q.l === level).length, 4, `${id} level ${level}`);
    assert.equal(new Set(t.q.map((q) => q.q + (q.code || ""))).size, t.q.length, `${id}: duplicate question`);
    for (const q of t.q) {
      assert.ok(q.q && q.e && q.o.length >= 3 && q.o.length <= 4, `${id}: ${q.q}`);
      assert.ok(Number.isInteger(q.a) && q.a >= 0 && q.a < q.o.length, `${id}: answer index for ${q.q}`);
      assert.equal(new Set(q.o).size, q.o.length, `${id}: duplicate options in ${q.q}`);
    }
  }
});

check("roles: names match the Atlas and every topic has questions", () => {
  const atlasNames = new Set(A.roles.map((r) => r.name));
  for (const role of bank.roles) {
    assert.ok(atlasNames.has(role.name), `${role.name} is not an Atlas role`);
    for (const choice of role.choice ? role.choice.options : [null]) {
      for (const t of E.roleTopics(role, choice)) assert.ok(bank.topics[t.id], `${role.name}: no bank for ${t.id}`);
    }
  }
});

check("build: core topics ask easy+medium+hard, supporting topics easy+medium, answers stay correct after shuffling", () => {
  const role = bank.roles.find((r) => r.name === "Full Stack Developer");
  const items = E.buildTest(bank, role, "react", random);
  assert.equal(items.length, role.core.length * 3 + role.support.length * 2);
  assert.ok(items.some((i) => i.topic === "react") && !items.some((i) => i.topic === "angular"), "the framework choice is applied");
  for (const item of items) {
    const source = bank.topics[item.topic].q.find((q) => q.q === item.q && (q.code || null) === item.code);
    assert.equal(item.options[item.answer], source.o[source.a], "shuffled answer still points at the right option");
  }
  for (const r of bank.roles) {
    const n = E.buildTest(bank, r, null, random).length;
    assert.ok(n >= 12 && n <= 32, `${r.name} has ${n} questions`);
  }
});

check("score: all right = 100, all wrong = 0, guesses earn half, core topics count double", () => {
  const role = bank.roles.find((r) => r.name === "Data Engineer");
  const items = E.buildTest(bank, role, null, random);
  assert.equal(E.scoreTest(items, items.map((i) => ({ choice: i.answer, guess: false }))).pct, 100);
  const allWrong = E.scoreTest(items, items.map((i) => ({ choice: (i.answer + 1) % i.options.length, guess: false })));
  assert.equal(allWrong.pct, 0);
  assert.equal(allWrong.misconceptions.length, items.length, "confident wrong answers are misconceptions");
  assert.equal(E.scoreTest(items, items.map((i) => ({ choice: i.answer, guess: true }))).pct, 50);
  // Only core topics right → core weight 2×3 topics = 6, support 1×4 = 4 → 6/10 = 60%.
  const coreOnly = E.scoreTest(items, items.map((i) => ({ choice: i.core ? i.answer : (i.answer + 1) % i.options.length, guess: false })));
  assert.equal(coreOnly.pct, 60);
  assert.equal(coreOnly.level.name, "Developing");
  assert.ok(coreOnly.studyNext.every((t) => !t.core), "study next lists the weak (supporting) topics");
});

check("levels: thresholds", () => {
  assert.equal(E.levelOf(90).name, "Strong");
  assert.equal(E.levelOf(70).name, "Interview-ready");
  assert.equal(E.levelOf(40).name, "Developing");
  assert.equal(E.levelOf(39).name, "Beginner");
});

console.log(results.join("\n"));
console.log(`${results.filter((r) => r.startsWith("PASS")).length}/${results.length} passed`);
