# 🧭 Tech Lead & Engineering Leadership Interview Preparation

## The Role

### ❓ What does a tech lead do?

A tech lead is the engineer responsible for **how** a team builds things: the technical direction, quality and delivery of the team's work — while usually still writing code.

- **Technical direction:** designs, key decisions, standards (testing, reviews, CI).
- **Delivery:** breaking work down, estimating, unblocking people, managing technical risk.
- **People:** mentoring, raising the team's skill level, good code reviews.
- **Production ownership:** the team's services stay healthy; leads incidents when needed.

**Example:** before a new payments feature, the tech lead writes the design, splits it into stories, pairs with a junior on the trickiest part, and makes sure it ships behind a feature flag with dashboards.

#### ↳ Follow-up: How much code should a tech lead write?

↪ Usually 30–60% of their time — enough to stay close to the code and feel the team's pain, but not so much that they become the bottleneck. Avoid owning the critical-path tasks; take the ones that unblock others.

---

### ❓ What is the difference between a tech lead, an engineering manager and an architect?

| | Tech Lead | Engineering Manager | Architect |
|---|---|---|---|
| Focus | How one team builds | People and team health | How many systems fit together |
| Owns | Design, quality, technical delivery | Hiring, growth, performance, process | Cross-team standards and long-term direction |
| Codes? | Yes, part-time | Rarely | Sometimes, prototypes and reviews |
| Measured by | Team ships reliable software | Team is healthy, growing and delivering | Systems stay coherent and scalable |

In smaller companies one person often does two of these jobs; say how you'd handle that in interviews.

---

## Technical Direction

### ❓ How do you run a good code review?

Code review is about **correctness, clarity and shared knowledge** — not personal style.

- Keep pull requests **small** (under ~400 lines) so reviews are fast and thorough.
- Automate style with formatters and linters, so humans review logic, design, tests and security.
- Review the important things first: correct behaviour, edge cases, error handling, tests, naming, and whether it fits the design.
- Be kind and specific: ask questions ("What happens if the list is empty?"), and label minor points as "nit:".
- Aim to respond within a working day; slow reviews kill delivery speed.

**Example comment:** "This loads every order into memory — could we page through them? For big customers this is about 2M rows."

---

### ❓ What is a design document (RFC), and when do you write one?

A short document that explains a technical plan **before** building it, so others can find problems while change is cheap.

Write one for anything that is hard to undo, spans teams, or takes more than a couple of weeks. Typical sections:

1. Context and problem
2. Goals and non-goals
3. Proposed design (diagram, APIs, data model)
4. Alternatives considered and why not
5. Risks, rollout and rollback, monitoring
6. Open questions

Record the final decision in an **ADR** (Architecture Decision Record) so future teammates know *why*.

---

### ❓ How do you make a technical decision when the team disagrees?

1. **Agree on the problem and the criteria first** — cost, performance, team skills, time to market, operations.
2. **Compare the options against those criteria**, using data or a quick spike (prototype) where possible.
3. **Decide and write it down** — consensus is nice, but a clear decision beats a long debate. "Disagree and commit."
4. **Make it reversible where you can**, and set a date to review it.

**Example:** the team splits between Kafka and RabbitMQ. You agree the criteria (replay needed? ordering? ops experience?), run a 2-day spike, pick Kafka because replay is a must, and record it in an ADR.

---

### ❓ How do you handle technical debt?

Make it **visible**, **tie it to business impact**, and pay it down **continuously**, not in one big rewrite.

- Keep a tech-debt list with the cost of each item ("adds about 2 days to every payment feature", "caused 3 incidents this quarter").
- Reserve regular capacity — for example 15–20% of each sprint.
- Fix debt where you're already working (the "boy scout rule"), and avoid big-bang rewrites; use the **strangler fig** pattern to replace pieces gradually.

---

### ❓ How do you set engineering standards for a team?

Standards work best when they're **automated and agreed**, not just written down.

- **Automate:** formatting, linting, tests and security scans in CI; required reviews; protected main branch.
- **Agree:** a short team guide (branching, testing expectations, logging, error handling), written with the team.
- **Measure:** deployment frequency, lead time, change-failure rate and recovery time (the **DORA metrics**) to see if standards help.

---

## Delivery

### ❓ How do you break down a large feature and estimate it?

1. **Slice vertically** — each piece delivers a thin, working, end-to-end slice (UI + API + DB), not "all the backend first".
2. Make pieces small: 1–3 days each; spikes for unknowns.
3. **Estimate as a team** (story points or t-shirt sizes); give **ranges**, not single numbers, for big work.
4. Call out risks and dependencies early; deliver the riskiest slice first.

**Example:** "Order tracking" → (1) show status from existing data, (2) add a status-history table, (3) push notifications, (4) courier webhook integration — each releasable on its own.

---

### ❓ How do you keep a project on track when it starts slipping?

- Spot it early: watch the burn-down and blocked items weekly, not just at the deadline.
- **Tell stakeholders as soon as you know**, with options — not just bad news.
- Use the three levers: **reduce scope** (usually best), **move the date**, or **add people** (rarely helps late — Brooks's law).
- Protect quality: cutting tests to hit a date usually costs more later.

**Example:** "We're two weeks behind because the courier API is unstable. Option A: launch without live tracking on the 15th. Option B: full launch on the 29th. I recommend A."

---

### ❓ How do you work with product managers and stakeholders?

- Understand the **why** behind requests, then suggest cheaper ways to reach the same goal.
- Translate technical work into business terms: risk, cost, speed, customer impact.
- Make trade-offs explicit and give options with recommendations.
- Share progress regularly so there are no surprises.

---

## People

### ❓ How do you mentor junior developers?

- **Pair** on real tasks; let them drive while you guide with questions.
- Give **stretch tasks** with a safety net — a clear goal and regular check-ins.
- Use code reviews to teach the **why**, not just to fix things.
- Agree on growth goals and praise specific progress.

**Example:** a junior struggles with SQL performance — you pair on one slow query using `EXPLAIN`, then they fix the next two alone and present what they learned to the team.

---

### ❓ How do you handle a team member who is underperforming?

1. **Find the cause first** — unclear expectations, skill gap, personal issues, or the wrong kind of work.
2. Talk privately and early, with **specific examples** and clear expectations.
3. Offer support: pairing, smaller tasks, training, regular feedback.
4. Follow up on an agreed timeline; involve the engineering manager if there's no improvement — performance management is usually their job.

Avoid silently taking over their work — it hides the problem and burns you out.

---

### ❓ How do you delegate as a tech lead?

Delegate **outcomes, not instructions**: explain the goal, the constraints and what "done" looks like, then let the person choose how. Match the task to their level and growth goals, check in at agreed points, and accept that their solution may differ from yours.

The tech lead's job is to make the **team** effective, not to do the most work personally.

---

### ❓ What would you do in your first 90 days as a new tech lead?

- **Days 1–30 — learn:** meet each team member and stakeholder one to one; read the code, architecture docs and incident history; ship a small change yourself.
- **Days 31–60 — find the biggest problems:** slow builds, flaky tests, unclear ownership, recurring incidents; agree priorities with the team and manager.
- **Days 61–90 — deliver early wins:** fix one or two high-impact problems, set up lightweight practices (design reviews, on-call runbooks), and share a plan for the next quarter.

---

## Production Ownership

### ❓ What is your role during a production incident?

Often the **incident commander**: you coordinate rather than fix everything yourself.

- Assign roles: someone investigates, someone communicates, someone takes notes.
- **Mitigate first** — roll back, switch traffic, disable the feature flag.
- Keep stakeholders updated at a fixed interval.
- Afterwards, run a **blameless postmortem** and make sure the action items actually get done.

See also: [How do you handle a production incident?](../devops/03-Observability-SRE.md)
