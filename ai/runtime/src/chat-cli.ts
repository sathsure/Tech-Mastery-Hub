/**
 * Try the chat in a terminal (after `npm run build`):
 *   npm run chat -- "how does the event loop work?"
 * Uses Claude when ANTHROPIC_API_KEY is set (or TUTOR_ANSWER_MODE=claude), otherwise answers from the notes only.
 */
import { runChat } from "./chat-service.js";

const message = process.argv.slice(2).join(" ").trim();
if (!message) {
  process.stderr.write('Usage: npm run chat -- "your question"\n');
  process.exit(1);
}

for await (const event of runChat({ message })) {
  if (event.type === "meta") {
    process.stdout.write(`\n[${event.answerMode} · intents: ${event.intents.join(", ")} · confidence: ${event.confidence}]\n`);
    for (const item of event.evidence) process.stdout.write(`  [${item.n}] ${item.question}  (${item.path}:${item.startLine})\n`);
    process.stdout.write("\n");
  } else if (event.type === "status" && event.stage === "fallback") {
    process.stdout.write(`\n(${event.message})\n`);
  } else if (event.type === "delta") {
    process.stdout.write(event.text);
  } else if (event.type === "done") {
    const g = event.grounding;
    process.stdout.write(`\n\n[cited: ${g.cited.join(", ") || "none"}${g.invalid.length ? ` · INVALID: ${g.invalid.join(", ")}` : ""}${g.generatedSection ? " · includes content beyond your notes" : ""}]\n`);
    if (event.usage) process.stdout.write(`[${event.model} · in ${event.usage.inputTokens} (cache read ${event.usage.cacheReadTokens}) · out ${event.usage.outputTokens}]\n`);
    if (event.notice) process.stdout.write(`[note: ${event.notice}]\n`);
    if (event.followUps.length) process.stdout.write(`Next: ${event.followUps.map(text => `"${text}"`).join(" · ")}\n`);
  } else if (event.type === "error") {
    process.stderr.write(`\nError: ${event.message}\n`);
    process.exitCode = 1;
  }
}
