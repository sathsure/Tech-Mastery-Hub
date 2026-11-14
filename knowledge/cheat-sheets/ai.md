# AI & LLMs for Developers — Cheat Sheet

> **In one line:** an LLM predicts the next piece of text; developers make it useful by giving it the right instructions, data and tools, and by testing its answers.

## LLM basics
- **LLM (Large Language Model)** — a model trained on huge amounts of text to predict the next word piece.
- **Token** — a word piece (about ¾ of a word). Cost and limits are counted in tokens.
- **Context window** — how many tokens the model can read at once (prompt + answer).
- **Transformer / attention** — the design that lets each word "look at" all other words.
- **Temperature** — randomness. Low = focused and repeatable; high = creative.
- **Hallucination** — a confident but wrong answer. Reduce it with real data (RAG), citations and "say you don't know".

## Prompting
- Say the role, the task, the context, the rules and the output format.
- Give examples (**few-shot**).
- **System prompt** — standing rules for the whole chat.
- **Structured output** — ask for JSON that matches a schema, so code can read it.

## Embeddings & vector search
- **Embedding** — a list of numbers that captures meaning. Similar texts → close numbers.
- **Cosine similarity** — how close two embeddings are.
- **Vector database** — stores embeddings and finds the nearest ones fast (pgvector, Pinecone, Qdrant).

## RAG (Retrieval-Augmented Generation)
Let the model answer from *your* documents without retraining it.
```
Prepare: documents → split into chunks → embed → store in a vector DB
Answer:  question → embed → find the most similar chunks
         → put chunks + question in the prompt → LLM answers with sources
```
- Better results: good chunk sizes, **hybrid search** (vectors + keywords), a **reranker**, filters, citations.
- **RAG vs fine-tuning** — RAG adds *knowledge*; fine-tuning changes *style or behaviour*.

## Tools & agents
- **Tool calling** — the model asks your code to run a function (`get_weather("Chennai")`) and uses the result.
- **Agent** — an LLM in a loop: think → use a tool → look at the result → repeat until done.
- **MCP (Model Context Protocol)** — a standard way to plug tools and data sources into AI apps.
- Keep agents safe: step limits, timeouts, approval for risky actions.

## Evaluation (evals)
- Keep a test set of real questions with expected answers.
- Score with exact checks, **LLM-as-judge** (with a rubric), and RAG checks (did it find the right chunks? is the answer grounded?).
- Run evals on every prompt or model change.

## Running in production
- **Speed** — stream answers, use smaller models for easy steps, cache.
- **Cost** — shorter prompts, fewer tokens, cheaper models where possible.
- **Safety** — remove personal data, filter harmful content, check permissions on retrieved documents.
- **Reliability** — retries, fallback models, timeouts, validate outputs.
- **Prompt injection** — text in a document or web page tries to give the model new instructions. Treat outside text as data, limit tool permissions.

## In Java (Spring AI)
```java
String answer = chatClient.prompt()
    .user(question)
    .advisors(QuestionAnswerAdvisor.builder(vectorStore).build())   // adds RAG
    .call().content();
```

## Words to know
Inference (using a model) · training · parameters (weights) · fine-tuning / LoRA · quantization (smaller model) · multimodal (text + images) · open-weight vs API models.
