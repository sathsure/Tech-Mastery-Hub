# Revision pages

Hand-written revision pages per technical topic, shown in the tutor chat exactly as written (no AI model involved).
Typing the command alone opens a topic list; adding a topic opens that page.

| Command | Folder | Ask in chat | Topics |
|---|---|---|---|
| `/cheat-sheet` | `knowledge/cheat-sheets/` | "Java cheat sheet" | 34 |
| `/quick-traps` | `knowledge/quick-traps/` | "Java quick traps" | 34 |
| `/one-liners` | `knowledge/one-liners/` | "Java one-liners" | 34 |
| `/vs` | `knowledge/comparisons/` | "Java comparisons" (or `/vs let vs var` for any pair) | 34 |
| `/explain-like-5` | `knowledge/explain-like-5/` | "Explain Java like I'm 5" | 34 |
| `/predict-output` | `knowledge/predict-output/` | "Java predict the output" | 10 code topics |
| `/code-snippets` | `knowledge/code-snippets/` | "Java code snippets" | 21 code topics |
| `/revise` | (built from one-liners + quick traps) | "Revise Java", "Revise Java, React", "Revise all topics" | all |

- **File name = topic id** from `ai/runtime/src/topic-labels.ts` (`/` becomes `-`): `java.md`, `database-sql.md`.
- A topic shows in a list as soon as its file exists. Logic lives in `ai/runtime/src/chat-revision.ts`.
- These files are **not** part of the question index, so they don't change search results.

## Formats (keep them — the code parses some of them)
- **One-liners:** `1. **Question?** — one-sentence answer.` (`/revise` reads these lines.)
- **Quick traps:** `### Title`, then a `- ❌ …` line and a `- ✅ …` line. (`/revise` reads these.)
- **Predict the output:** code block, then `<details class="reveal"><summary>Show answer</summary>` … `</details>` with blank lines inside.
- **ELI5:** `## Concept`, an everyday picture, then `**Really:**` one line.
- Plain words first, tiny examples, small tables only for comparisons.
