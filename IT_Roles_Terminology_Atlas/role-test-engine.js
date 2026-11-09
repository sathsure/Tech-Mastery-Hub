/*
 * Role Readiness Test engine: builds a test for a role and scores it. Pure functions (no DOM) so Node tests can load it.
 *
 * Each core topic asks 3 questions (easy, medium, hard); each supporting topic asks 2 (easy, medium).
 * Points: easy 1, medium 2, hard 3; a correct answer marked "guessing" earns half.
 * Topic score = points earned ÷ points possible. Overall = average of topic scores, core topics counting double.
 */
(function (root) {
  const LEVELS = [
    { min: 85, name: "Strong", tone: "strong", text: "You know this role's topics well — focus on mock interviews and system design depth." },
    { min: 70, name: "Interview-ready", tone: "ready", text: "You're ready for most interviews — close the remaining gaps below." },
    { min: 40, name: "Developing", tone: "developing", text: "A good base, with clear gaps — study the topics below, then retake the test." },
    { min: 0, name: "Beginner", tone: "beginner", text: "Start with the core topics below, one at a time, and retake the test as you go." },
  ];
  const levelOf = (pct) => LEVELS.find((l) => pct >= l.min);

  function shuffle(list, random) {
    const a = [...list];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /** The role's topics with the choice applied (e.g. "@frontend" → "react"). */
  function roleTopics(role, choice) {
    const pick = (id) => (role.choice && id === role.choice.key ? choice || role.choice.options[0] : id);
    return [...role.core.map((id) => ({ id: pick(id), core: true })), ...role.support.map((id) => ({ id: pick(id), core: false }))];
  }

  /**
   * Builds the question list: per topic one question per level asked, picked at random from the two written for
   * that level; options are shuffled so the right answer isn't always in the same place.
   */
  function buildTest(bank, role, choice, random = Math.random) {
    const items = [];
    for (const t of roleTopics(role, choice)) {
      const topic = bank.topics[t.id];
      if (!topic) throw new Error(`No questions for topic ${t.id}`);
      const levels = t.core ? [1, 2, 3] : [1, 2];
      for (const level of levels) {
        const pool = topic.q.filter((q) => q.l === level);
        const q = pool[Math.floor(random() * pool.length)];
        const order = shuffle(q.o.map((_, i) => i), random);
        items.push({ topic: t.id, topicLabel: topic.label, core: t.core, level, q: q.q, code: q.code || null, options: order.map((i) => q.o[i]), answer: order.indexOf(q.a), explain: q.e });
      }
    }
    // Interleave topics so the test doesn't feel like blocks, but keep easy questions early.
    return [...items].sort((a, b) => a.level - b.level || random() - 0.5);
  }

  /** answers[i] = { choice: optionIndex, guess: boolean } (missing = unanswered). */
  function scoreTest(items, answers) {
    const topics = new Map();
    let correct = 0, confidentCorrect = 0;
    const misconceptions = [];
    items.forEach((item, i) => {
      const a = answers[i];
      const right = a != null && a.choice === item.answer;
      const t = topics.get(item.topic) || { id: item.topic, label: item.topicLabel, core: item.core, earned: 0, possible: 0, asked: 0, right: 0 };
      t.possible += item.level;
      t.asked += 1;
      if (right) {
        t.earned += item.level * (a.guess ? 0.5 : 1);
        t.right += 1;
        correct += 1;
        if (!a.guess) confidentCorrect += 1;
      } else if (a != null && !a.guess) {
        misconceptions.push({ index: i, topic: item.topicLabel, q: item.q, explain: item.explain });
      }
      topics.set(item.topic, t);
    });
    const list = [...topics.values()].map((t) => ({ ...t, pct: Math.round((t.earned / t.possible) * 100) }));
    const weight = (t) => (t.core ? 2 : 1);
    const total = list.reduce((s, t) => s + weight(t), 0);
    const pct = total ? Math.round(list.reduce((s, t) => s + t.pct * weight(t), 0) / total) : 0;
    // Study next: weakest first, core topics before supporting ones at the same level.
    const weakest = [...list].sort((a, b) => a.pct - b.pct || Number(b.core) - Number(a.core)).filter((t) => t.pct < 70);
    return { pct, level: levelOf(pct), correct, total: items.length, confidentCorrect, misconceptions, topics: list, studyNext: weakest.slice(0, 3) };
  }

  const api = { buildTest, scoreTest, roleTopics, levelOf, LEVELS };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.RoleTestEngine = api;
})(typeof window !== "undefined" ? window : globalThis);
