# Tech-Mastery-Hub AI Tutor — Chat UI

A browser chat for the tutor. Answers come from the repository notes first, with every source cited.

## Run it

```bash
cd ai/runtime
npm install
npm run build
npm run api          # then open http://127.0.0.1:8787
```

Set `ANTHROPIC_API_KEY` to have Claude write the answers from your notes. Without a key the chat
answers straight from the notes (no model, no cost). See `ai/runtime/src/answer-model.ts` for
`TUTOR_ANSWER_MODE`, `TUTOR_CLAUDE_MODEL` and `TUTOR_CLAUDE_EFFORT`.

## What's in it

- Streaming answers with citation chips `[n]` linked to source cards and a "How it connects" map
- "Beyond your notes" callout for anything the notes don't support, plus a grounding badge per answer
- Code highlighting with copy, tables, interactive checklists (progress is saved), Mermaid diagrams,
  and your own diagrams from `knowledge/visual-notes`
- Source viewer for the full note, with follow-ups
- `Ctrl K` search across all questions, roles and terms; `/` commands (`/interview`, `/quiz`, `/code`,
  `/diagram`, `/compare`, `/debug`, `/roadmap`, `/role`); topic filter
- Chats are saved in this browser (localStorage); download any chat as Markdown
- Links like `/?q=closures` ask a question directly

## Files

| File | Purpose |
|---|---|
| `index.html` | Layout and icon set |
| `styles.css` | Theme and responsive layout |
| `app.js` | App logic: chat, sidebar, sources, search, commands |
| `render.js` | Markdown rendering and enhancements |
| `graph.js` | "How it connects" map |
| `api.js` | Calls to `/chat`, `/search`, `/catalog`, `/entry` |
| `store.js` | Saved chats |

Libraries (`marked`, `DOMPurify`, `highlight.js`, `mermaid`) are served from `ai/runtime/node_modules`
under `/vendor/`, so the app works offline and loads no third-party scripts.
