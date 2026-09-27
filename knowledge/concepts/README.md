# Canonical Concepts

Canonical Concepts are the reusable technical knowledge layer of Tech-Mastery-Hub. They explain a topic independently of a specific interview question, exercise, project, or visual note.

## Purpose

- Provide one stable explanation for reusable technical knowledge.
- Give roadmap topics a canonical knowledge target.
- Allow interview questions and practice material to reference the same underlying concept.
- Connect visual notes and masterclasses to the concepts they explain.
- Give the AI Tutor a stable source for retrieval and contextual answers.

## Relationship Model

```text
Roadmap topic
    ↓
Canonical Concept
    ├── Masterclass
    ├── Visual Notes
    ├── Interview Questions
    ├── Practice
    └── Projects
```

## Canonical Concept Rules

1. A concept should represent reusable knowledge rather than a single question or exercise.
2. Existing source material must be reviewed before creating substantial new content.
3. Do not copy entire interview, practice, or masterclass documents into a concept.
4. Use links to connect related material.
5. Preserve source terminology unless a deliberate editorial change is documented.
6. Record source references when a concept is derived from repository material.
7. Avoid creating multiple canonical pages for the same underlying concept.
8. A concept may link to several interview questions, practice exercises, visual notes, and masterclasses.

## Suggested Concept Structure

```text
knowledge/concepts/<domain>/<concept>/README.md
```

## AI / RAG Guidance

- Canonical concepts are preferred retrieval sources for definitions and reusable explanations.
- Interview and practice files provide contextual examples and assessment material.
- Visual notes provide image-based supporting context.
- Masterclasses provide deeper learning context.
- The AI should distinguish repository-derived information from information not present in the repository.
- The AI should not silently modify canonical knowledge. Proposed improvements should go through repository review and approval.
