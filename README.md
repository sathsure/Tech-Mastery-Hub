# Tech-Mastery-Hub

> A centralized hub for developer learning, mastery, and interviews.

## 🚀 What is Tech-Mastery-Hub?

Tech-Mastery-Hub brings together technical roadmaps, concepts, masterclasses, visual notes, interview preparation, practice, projects, career data and AI-assisted learning in one place.

## 🗺 Roadmaps

Structured learning paths that answer: *What should I learn?*

- [Foundations](./roadmap/foundations/)
- [Frontend](./roadmap/frontend/)
- [Backend](./roadmap/backend/)
- [Database](./roadmap/database/)
- [DevOps](./roadmap/devops/)
- [Cloud](./roadmap/cloud/)
- [Networking](./roadmap/networking/)
- [Architecture](./roadmap/architecture/)
- [Study path per topic](./roadmap/topics/) and [roadmap per job role](./roadmap/roles/)

## 🧠 Knowledge

The central source of technical knowledge.

- [Concepts](./knowledge/concepts/)
- [Masterclasses](./knowledge/masterclasses/)
- [Visual Notes](./knowledge/visual-notes/)
- [Resources](./knowledge/resources/)

## 🎓 Masterclasses

Deep, structured learning from beginner to advanced — for example the [SQL Masterclass](./knowledge/masterclasses/SQL_MasterClass.html).

## 🎤 Interview Preparation

[Interview notes](./interview/) by technology, each answer simple and short, with an example and likely follow-ups:

- Frontend, Backend (Java, Spring, Node.js), Database, Cloud & DevOps, Architecture & System Design
- Coding (DSA), Testing, AI & LLMs, "Under the hood" internals
- Linux & Shell, Security (OWASP Top 10 2025), Observability & SRE, Data Engineering
- Agile & Scrum, Behavioral & HR rounds, Job search & resume
- [Salary, payslips & compensation in India](./interview/career/01-Salary-Compensation-India.md) — CTC vs take-home, allowances, PF, gratuity, old vs new tax regime, ESOPs/RSUs, with worked ₹10–25 LPA examples (FY 2026-27)

## 🧪 Practice

- [Coding](./practice/coding/) (Java, JavaScript, Angular, CSS, SQL, LeetCode in Python)
- [Quizzes](./practice/quizzes/), [scenarios](./practice/scenarios/) and [mock interviews](./practice/mock-interviews/)

## 🚀 Projects

Apply the concepts through [real-world projects](./projects/): beginner, intermediate and advanced.

## 🧭 IT Roles & Terminology Atlas

An offline-capable web page ([IT_Roles_Terminology_Atlas](./IT_Roles_Terminology_Atlas/IT_Roles_Terminology_Atlas.html)) with:

- 74 IT roles, career ladders and "my path" recommendations
- A glossary of 258 terms, each explained in 2–3 simple lines, with **flashcards and a quiz** (spaced repetition, saved in your browser)
- Salary ranges in India by role and experience, and working abroad by country
- **Pay & Tax** — a take-home calculator (old vs new regime), a side-by-side offer comparison, and income tax for India plus 10 countries with take-home estimates and official links

Content lives in [`it-atlas-data.js`](./IT_Roles_Terminology_Atlas/it-atlas-data.js); calculations in [`pay-tax.js`](./IT_Roles_Terminology_Atlas/pay-tax.js) (tests: `npm run atlas-check` in `ai/runtime`).

## 🤖 AI Tutor

A chat over these notes ([`ai/web`](./ai/web/README.md), runtime in [`ai/runtime`](./ai/runtime/)). Answers come from the repository, with every source cited; Claude writes them when an API key is set, otherwise the notes answer directly.

Try asking:

> Where do I start?
> How does HashMap work internally?
> Interview prep: Full Stack Developer
> Prepare an interview question set to interview a Java developer with 10+ years
> What is the difference between CTC and take-home salary?

Candidates can take a **mock interview** ("Mock interview on Java" or `/quiz java`): 5 questions from the notes, each answer scored 1–4 against the model answer's key points, then a summary of what to review.

Interviewers get a setup checklist (experience, role, stack, duration, categories, difficulty, company, focus), then a timed question set with expected answers, follow-ups and a live 1–4 scoring sheet.

## 📚 Philosophy

A concept should have a single source of truth. Roadmaps, masterclasses, interview questions, practice material, visual notes and projects reference the same underlying concepts instead of duplicating them.

## 🏗 Architecture

```text
Roadmap
   │
   ▼
Concepts
   │
   ├──► Masterclasses
   ├──► Visual Notes
   ├──► Interview
   ├──► Practice
   └──► Projects
            │
            ▼
         AI Tutor
```
