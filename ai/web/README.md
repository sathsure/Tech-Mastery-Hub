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

## Put it online for free (Render)

The repository includes a [`render.yaml`](../../render.yaml) Blueprint for Render's free plan.

1. Sign in at [render.com](https://render.com) with GitHub.
2. **New → Blueprint**, choose `sathsure/Tech-Mastery-Hub` and the branch to deploy, then **Apply**.
3. When the build finishes, open the `https://tech-mastery-hub-tutor.onrender.com` link Render shows
   (the exact name may differ if it's taken).

Free-plan behaviour: the service sleeps after 15 minutes without visitors, and the next visit takes
about a minute to wake it. It runs in notes-only mode, so it costs nothing. To use Claude, set
`TUTOR_ANSWER_MODE=claude` and add `ANTHROPIC_API_KEY` as a secret in the Render dashboard; every
answer is then billed to that key, and anyone with the link can use it (20 chats per minute each).

Public deployments set `TUTOR_PUBLIC=1` (turns off the older `/tutor` endpoint) and
`TUTOR_TRUST_PROXY=1` (rate limits per visitor). See `render.yaml`.

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
