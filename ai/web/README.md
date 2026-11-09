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
`TUTOR_CLIENT_IP_HEADER=true-client-ip,cf-connecting-ip` with `TUTOR_TRUST_PROXY=1` (rate limits per visitor;
the visitor address comes from headers the proxy sets itself, never from a value the visitor can forge). See `render.yaml`.

## What's in it

- Streaming answers with citation chips `[n]`; each chip and the **Sources** button open the source file on GitHub
  (`TUTOR_GITHUB_REPO`, default `sathsure/Tech-Mastery-Hub`; `TUTOR_GITHUB_BRANCH`, default `main`)
- Topic overviews show a topic's sections first; open one to see its questions (progressive disclosure)
- Roadmap checklists are selectable: tick topics, then **Build my learning plan** for a prerequisite-ordered sequence
- **Interview prep** for a role: tick its stacks, then get the key questions to practise for each
- **Interviewer question sets**: "Prepare a question set to interview a Java developer with 10+ years" first shows a setup
  checklist (experience, role, stack, duration, categories, difficulty, company, focus) with what the request already said
  ticked; then a timed, prioritised set with expected answers, what to look for and follow-ups
- **Mock interview** ("Mock interview on SQL", "Quiz me on Java" or `/quiz java`): 5 questions from the notes, one at a
  time; each typed answer is scored 1–4 by the key points it covers, with what you missed and a final summary. The
  interview state travels with each request, so the server stays stateless
- **Live scoring sheet** on every question set: score each answer 1–4, add notes, see a running scorecard and
  recommendation, then copy or print it (scores are saved with the chat)
- When the notes don't cover a question, the tutor says so and links to YouTube, Udemy and official docs
- **Back** (button, `Alt+←` or the browser's back) returns to the previous screen and scroll position
- "Beyond your notes" callout for anything the notes don't support, plus a grounding badge per answer
- Code highlighting with copy, tables, Mermaid diagrams,
  and your own diagrams from `knowledge/visual-notes`
- Source viewer for the full note, with follow-ups
- `Ctrl K` search across all questions, roles and terms; `/` commands (`/interview`, `/quiz`, `/code`,
  `/diagram`, `/compare`, `/debug`, `/roadmap`, `/role`); topic filter
- Chats are saved in this browser (localStorage); download any chat as Markdown
- Links like `/?q=closures` ask a question directly
- **The Atlas is served too**, at `/atlas/` (open http://127.0.0.1:8787/atlas). Role cards in the chat offer
  **Take the readiness test** for the 15 roles that have one, and the test's "Study next" cards open the study path or
  start a mock interview in the tutor. The Atlas page gets its own security policy so its live job feeds still load

## Files

| File | Purpose |
|---|---|
| `index.html` | Layout and icon set |
| `styles.css` | Theme and responsive layout |
| `app.js` | App logic: chat, sidebar, back navigation, learning plans, search, commands |
| `render.js` | Markdown rendering and enhancements |
| `api.js` | Calls to `/chat`, `/search`, `/catalog`, `/entry` |
| `store.js` | Saved chats |
| `scoring.js` | Interview scoring sheet for question sets |

Libraries (`marked`, `DOMPurify`, `highlight.js`, `mermaid`) are served from `ai/runtime/node_modules`
under `/vendor/`, so the app works offline and loads no third-party scripts.
