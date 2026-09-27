# AI Tutor Component Contracts

## 1. Intent Analyzer
Input: user query, session state, optional explicit mode.
Output: intent, topic, depth, difficulty, visual behavior, learning mode, repository-backed flag.
Invariant: no repository mutation.

## 2. Retrieval Planner
Input: intent plan, session state, knowledge index.
Output: canonical candidates, search terms, content priorities, relationship request, context budget.
Invariant: cannot invent relationships.

## 3. Knowledge Retriever
Input: retrieval plan, content index, repository reader.
Output: evidence items.
Priority: canonical concept, exact match, metadata, semantic similarity, approved relationships, content type, learning mode.

## 4. Relationship Traversal
Input: approved concept and resource relationships.
Output: related concepts and resources.
Invariant: approved relationships only.

## 5. Context Assembler
Input: evidence, session, intent.
Output: bounded source-aware context.
Required: path, content type, canonical concept, authority, relevant section.

## 6. Teaching Strategy Engine
Supported: definition, conceptual explanation, step-by-step, architecture, lifecycle, data flow, execution flow, comparison, cause/effect, troubleshooting, code execution, analogy, interview, practice, visual explanation.

## 7. Visual Teaching Engine
Output: visual plan.
Selection: repository visual -> structured deterministic diagram -> generated illustration.
Invariant: generation is not selected merely because it is available.

## 8. Example / Demonstration Engine
Produces examples, walkthroughs, and code demonstrations.
Invariant: generated examples are distinguishable from repository source.

## 9. Response Constructor
Produces structured responses while preserving repository, external, AI-generated, and user-provided distinctions.

## 10. Response Validator
Checks response schema, visual schema, source attribution, knowledge boundary, and visual consistency.

## 11. Security and Governance Gateway
Checks untrusted input, prompt injection, secrets, unsafe content, permissions, protected areas, risk, and approvals.
Invariant: unverifiable required conditions fail closed.

## 12. Contribution Pipeline
Creates governed feature-branch changes, validation results, pull request, human approval, merge, and re-index request.
Invariant: no direct main modification, self-approval, or self-merge.

## 13. Re-indexer
Consumes merged authoritative repository state and validates eligible content, exclusions, canonical ownership, relationships, missing files, duplicates, and index paths.
Invariant: unmerged branches never become authoritative.
