# AI & LLMs for Developers — Comparisons

> The classic "X vs Y" questions, side by side.

## RAG vs fine-tuning vs prompting
| | Prompting | RAG | Fine-tuning |
|---|---|---|---|
| Adds knowledge | ❌ | ✅ (fresh, your docs) | weakly |
| Changes style/format | some | ❌ | ✅ |
| Cost to update | none | re-index docs | retrain |
| Cites sources | ❌ | ✅ | ❌ |

## Vector vs keyword vs hybrid search
| | Vector | Keyword (BM25) | Hybrid |
|---|---|---|---|
| Finds | similar meaning | exact words | both |
| Good at | paraphrases | ids, error codes | most RAG apps |

## Agent vs workflow (chain)
| | Workflow | Agent |
|---|---|---|
| Steps | fixed in code | chosen by the model |
| Predictable | ✅ | ❌ |
| Best for | known processes | open-ended tasks |

## Low vs high temperature
| | Low (0–0.3) | High (0.8+) |
|---|---|---|
| Output | focused, repeatable | varied, creative |
| Use for | extraction, code | brainstorming |

## Embeddings vs LLM generation
| | Embedding model | LLM |
|---|---|---|
| Output | a vector | text |
| Used for | search, clustering | answers, writing |

## Open-weight vs API models
| | Open-weight | API (hosted) |
|---|---|---|
| Runs on | your hardware | provider's servers |
| Data control | full | per provider terms |
| Ops effort | high | low |

## Tool calling vs MCP
| | Tool calling | MCP |
|---|---|---|
| Is | the model asking to run a function | a standard way to plug tools into apps |
| Scope | one app's tools | reusable servers across apps |

## Full fine-tuning vs LoRA
| | Full | LoRA |
|---|---|---|
| Weights trained | all | small adapters |
| Cost | high | low |

## Zero-shot vs few-shot
| | Zero-shot | Few-shot |
|---|---|---|
| Examples in prompt | none | a few |
