# AI Architecture

## Goal

Provide a natural-language interface to the Tech-Mastery-Hub knowledge base.

## Core Capabilities

- Discover what to learn — study paths per topic and roadmaps per role
- Explain concepts — answers from the notes, with every source cited
- Navigate masterclasses and topic overviews
- Generate interview questions — role-based prep, and timed question sets for interviewers with a live scoring sheet
- Conduct mock interviews — one question at a time, each answer scored against the notes' key points
- Generate practice questions
- Explain visual notes
- Find related concepts
- Identify knowledge gaps — the tutor says when the notes don't cover a question and points to trusted resources
- Propose knowledge updates

## Knowledge Source

The GitHub repository is the canonical source of truth.

## Retrieval Strategy

The AI retrieves relevant repository content before generating an answer.

## Knowledge Updates

AI-generated changes are proposed for human review.

## Important Rule

Do not retrain the model for ordinary knowledge corrections. Updated repository content is re-indexed so the AI retrieves the latest version (`npm run question-index` in `ai/runtime`).

## Pipeline

```text
GitHub
   ↓
Parser            (ai/runtime/src/question-indexer.ts, atlas-indexer.ts)
   ↓
Knowledge Index   (ai/knowledge-index/question-index.json)
   ↓
Retrieval         (ai/runtime/src/question-search.ts)
   ↓
AI                (Claude when ANTHROPIC_API_KEY is set; otherwise answers straight from the notes)
   ↓
User              (ai/web — the chat UI)
```

## Where to look next

- [`web/README.md`](./web/README.md) — running the chat, deploying it, and what it can do
- [`architecture/`](./architecture/) — detailed design and contract specs
- [`instructions/`](./instructions/) — system, retrieval, governance and security rules for the tutor
