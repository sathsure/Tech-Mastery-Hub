# 🔄 Agile & Scrum Interview Preparation

## Agile Basics

### ❓ What is Agile, and why do teams use it?

Agile is a way of building software in **small increments with frequent feedback**, instead of one big release at the end. Requirements are expected to change, so the team plans a little, delivers something usable, learns, and adjusts.

The Agile Manifesto (2001) values:

- Individuals and interactions over processes and tools
- Working software over comprehensive documentation
- Customer collaboration over contract negotiation
- Responding to change over following a plan

**Example:** instead of a 9-month project, the team ships a usable "pay by UPI" feature in 2 weeks, sees users drop off at one step, and fixes that next.

#### ↳ Follow-up: Does Agile mean no documentation or no planning?

↪ No. It means just enough documentation and planning, done continuously instead of all up front.

---

### ❓ What is the difference between Agile and Waterfall?

| | Waterfall | Agile |
|---|---|---|
| Flow | Phases in order: requirements → design → build → test → release | Short cycles, each with planning, building and testing |
| Changes | Expensive late in the project | Expected and welcomed |
| Delivery | Once, at the end | Every sprint or continuously |
| Best for | Fixed, well-known requirements (some government, regulated work) | Products where needs evolve |

Many companies mix them: a fixed contract scope (Waterfall-style) delivered in sprints.

---

### ❓ What is the difference between Scrum and Kanban?

- **Scrum** works in fixed **sprints** (usually 2 weeks) with set roles (Product Owner, Scrum Master, Developers) and events. Good for product development.
- **Kanban** shows work on a board with **work-in-progress (WIP) limits** and continuous flow — no sprints. Good for support, operations and maintenance work.

**Example:** a feature team uses Scrum; a production-support team uses Kanban so urgent tickets can start any time.

---

## Scrum

### ❓ What are the Scrum roles?

1. **Product Owner (PO)** — decides *what* to build and in what order; owns and prioritises the product backlog; represents customers and stakeholders.
2. **Scrum Master (SM)** — coaches the team on Scrum, runs or facilitates events, and removes blockers. Not a project manager or the team's boss.
3. **Developers** — everyone who builds the increment: developers, testers, designers. They decide *how* to do the work and how much fits in a sprint.

---

### ❓ What are the Scrum events (ceremonies)?

| Event | When | Purpose |
|---|---|---|
| **Sprint planning** | Start of sprint | Choose backlog items and a sprint goal |
| **Daily scrum (stand-up)** | Every day, 15 min | Progress toward the goal, plan for today, blockers |
| **Sprint review** | End of sprint | Demo the increment to stakeholders, get feedback |
| **Sprint retrospective** | After the review | How to work better next sprint |
| **Backlog refinement** | Ongoing (an activity, not a formal event) | Clarify, split and estimate upcoming items |

The Scrum Guide (2020) names five events: the sprint itself plus the four above it. Tip for interviews: the stand-up is for the team to coordinate, not a status report to a manager.

---

### ❓ What is a user story, and what makes a good one?

A short requirement from the user's view: **"As a ‹user›, I want ‹goal›, so that ‹benefit›."** It comes with acceptance criteria.

A good story follows **INVEST**: Independent, Negotiable, Valuable, Estimable, Small (fits in a sprint), Testable.

**Example:**
> As an employee, I want to download my payslip as a PDF, so that I can submit it for a loan.
> **Acceptance criteria:** Given I'm logged in, when I pick a month and click Download, then a PDF for that month downloads within 3 seconds.

---

### ❓ What are story points and velocity?

**Story points** estimate relative effort — complexity, amount of work and risk — not hours, often on a Fibonacci-like scale (1, 2, 3, 5, 8, 13). **Velocity** is the points a team usually completes per sprint, used to plan how much to take next time.

- Teams often estimate with **planning poker** so everyone's view is heard.
- Velocity is for the team's own planning — never compare teams by it or use it as a performance target.

---

### ❓ What is the Definition of Done?

A checklist the whole team agrees every item must meet before it counts as done, so "done" means the same thing to everyone.

**Example:** code reviewed and merged, unit tests passing, acceptance criteria met, deployed to QA, documentation updated, no new critical bugs.

**Acceptance criteria** are specific to one story; the **Definition of Done** applies to every story.

---

### ❓ What happens if the team can't finish the sprint's work?

Unfinished items go back to the product backlog; the PO re-prioritises them; nothing is "partly done" in the sprint review. In the retrospective the team discusses why — over-commitment, unclear stories, unplanned work — and adjusts.

The sprint length is not extended. Only the Product Owner can cancel a sprint, and only if its goal no longer makes sense.

---

## Agile in Practice

### ❓ How do you handle changing requirements in the middle of a sprint?

Protect the sprint goal. New requests normally go to the **product backlog**, and the PO prioritises them for the next sprint. If something is truly urgent (a production bug, a legal change), the PO and team agree what to drop to make room, so the total work doesn't silently grow.

**Example answer:** "I'd raise it with the PO, estimate it with the team, and if it must come in now we'd swap out a story of similar size and note the impact in the review."

---

### ❓ What are some Agile anti-patterns?

- **Water-Scrum-fall** — sprints in name, but all testing happens at the end.
- **Stand-up as status report** to a manager.
- **No retrospectives**, or retros with no actions.
- **Velocity as a target** — teams inflate estimates.
- **Stories too big** to finish in a sprint, carried over again and again.
- **The PO is unavailable**, so the team guesses priorities.

---

### ❓ What is SAFe, and when is it used?

SAFe (Scaled Agile Framework) applies Agile across many teams working on one large product. Teams are grouped into **Agile Release Trains** that plan together in **PI (Program Increment) Planning** every 8–12 weeks.

Common in large enterprises and banks. Critics say it adds a lot of process; alternatives are LeSS and Scrum@Scale.

---

### ❓ What do Jira workflows and boards usually look like?

A **board** shows issues moving through states, for example **To Do → In Progress → Code Review → QA → Done**. Issue types are usually **Epic → Story → Sub-task**, plus **Bug**.

**Example:** an epic "Online payments" holds stories "Pay by UPI" and "Pay by card"; each story has sub-tasks like "Add Razorpay SDK" and "Write the webhook handler".
