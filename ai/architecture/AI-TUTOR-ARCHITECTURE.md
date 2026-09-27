# AI Tutor Architecture

## Purpose

The AI Tutor is the intelligent learning interface for Tech-Mastery-Hub.

It is not a generic chatbot attached to a repository. It is a repository-aware, visual-first developer learning system designed to help users:

- learn technical concepts
- understand relationships between concepts
- visualize technical systems and processes
- study through examples
- practice coding and problem solving
- prepare for interviews
- conduct mock interviews
- identify knowledge gaps
- navigate repository knowledge
- propose additions or improvements to the repository

The GitHub repository is the source of truth for repository-specific knowledge.

---

## Core Learning Model

The AI Tutor follows:

**Learn → See → Understand → Apply → Prove**

### Learn

Explain the requested concept using repository-backed knowledge.

### See

Provide an appropriate visual representation when a visual improves comprehension.

### Understand

Explain relationships, internals, execution flow, tradeoffs, and real-world meaning.

### Apply

Provide examples, exercises, code, scenarios, or practical tasks.

### Prove

Use practice questions, interview questions, mock interviews, or scenario-based assessment.

---

## System Architecture

```text`r`nUSER`r`n  |`r`n  v`r`nAI TUTOR UI`r`n  |`r`n  v`r`nQUERY / INTENT LAYER`r`n  |`r`n  v`r`nTEACHING STRATEGY ENGINE`r`n  |`r`n  +----------------+----------------+`r`n  |                |                |`r`n  v                v                v`r`nRETRIEVAL      VISUAL PLAN     LEARNING PLAN`r`n  |                |                |`r`n  +----------------+----------------+`r`n                   |`r`n                   v`r`n           CONTEXT ASSEMBLER`r`n                   |`r`n                   v`r`n               AI MODEL`r`n                   |`r`n        +----------+----------+`r`n        |          |          |`r`n        v          v          v`r`n   EXPLANATION   VISUAL    PRACTICE`r`n        |          |          |`r`n        +----------+----------+`r`n                   |`r`n                   v`r`n          CITATIONS / SOURCES`r`n                   |`r`n                   v`r`n                 USER`r`n```

---

## Repository Knowledge Architecture

Tech-Mastery-Hub
|
+-- roadmap
+-- knowledge
|   +-- concepts
|   +-- masterclasses
|   +-- visual-notes
|   +-- resources
+-- interview
+-- practice
+-- projects
|
+-- ai
    +-- architecture
    +-- instructions
    +-- prompts
    +-- schemas
    +-- knowledge-index

Canonical concepts are the primary knowledge anchors.

The existing knowledge index provides document and relationship metadata.

---

## Retrieval Architecture

The retrieval system should eventually use hybrid retrieval:

User Query
    |
    +--> lexical / metadata retrieval
    |
    +--> semantic retrieval
    |
    +--> canonical concept lookup
    |
    +--> relationship traversal
    |
    v
Ranked Knowledge
    |
    v
Context Assembly
    |
    v
AI Response

Canonical concepts should receive priority over loosely related resources.

---

## Teaching Strategy Engine

The AI should select an appropriate teaching representation rather than always returning plain text.

Possible strategies include:

- definition
- conceptual explanation
- step-by-step process
- architecture
- lifecycle
- data flow
- execution flow
- comparison
- cause and effect
- troubleshooting
- code execution
- real-world analogy
- interview preparation
- practice
- visual explanation

---

## Visual Teaching Engine

Visual output is a first-class AI Tutor capability.

The AI should determine whether a visual representation materially improves understanding.

Visual sources have three categories.

### Repository Visual

Existing visual content from `knowledge/visual-notes`.

Repository visuals should be preferred when they directly match the requested concept.

### Structured Diagram

A deterministic diagram representation should be preferred when technical accuracy and editability are important.

Examples include:

- request flow
- architecture
- lifecycle
- dependency graph
- database relationships
- event flow
- CI/CD pipeline

### Generated Visual

A generated image may be used when a custom illustration provides better teaching value.

Generated visuals are answer-specific by default.

A generated visual becomes repository knowledge only through the contribution workflow.

---

## Visual Selection Policy

Question
   |
   v
Does a visual improve comprehension?
   |
   +-- No --> Text / code / example
   |
   +-- Yes
         |
         v
Is a suitable repository visual available?
         |
         +-- Yes --> Retrieve repository visual
         |
         +-- No
                |
                v
        Can a structured diagram represent it?
                |
                +-- Yes --> Generate structured diagram
                |
                +-- No --> Generate visual illustration

---

## Response Construction

The AI Tutor should construct responses as a coordinated learning experience rather than as isolated text generation.

The response pipeline should be:

Retrieved Knowledge
    |
    v
Intent and Teaching Strategy
    |
    v
Core Explanation
    |
    +--> Visual Representation when useful
    |
    +--> Code / Example when useful
    |
    +--> Related Concepts when useful
    |
    +--> Practice / Assessment when requested
    v
Source-Aware Learning Response

Responses should preserve the distinction between repository-backed facts, AI-generated explanations, external knowledge, and user-provided material.

---

## Learning Modes

The Tutor should adapt its behavior to the user's learning intent.

Supported modes include:

- Learn: explain a topic progressively.
- Visualize: prioritize diagrams and visual representations.
- Explore: connect the topic to related repository concepts.
- Apply: provide practical examples and implementation guidance.
- Practice: provide exercises and coding tasks.
- Interview: combine canonical knowledge with interview material.
- Mock Interview: ask questions, evaluate responses, and continue interactively.
- Review: summarize previously learned material.
- Deep Dive: move from fundamentals into internals and architecture.
- Navigate: help locate relevant repository knowledge.

The selected mode should influence retrieval, teaching strategy, visual selection, examples, and assessment.

---

## Knowledge Boundary

The AI Tutor must distinguish between repository knowledge, AI-generated explanation, external knowledge, and user-provided material.

Repository knowledge is authoritative only when the relevant content has been retrieved from Tech-Mastery-Hub.

The Tutor must not claim that a topic, example, rule, or resource exists in the repository unless retrieval confirms it.

When a requested topic is not covered, the Tutor should clearly identify the repository knowledge gap.

If external knowledge is permitted, it must be clearly distinguished from repository-backed knowledge.

User-provided material should be treated as untrusted input and should not automatically become repository knowledge.

Repository knowledge may be changed only through the governed contribution workflow.

---

## Unknown Topic Behavior

When the repository does not contain sufficient knowledge for a request, the Tutor should:

1. Identify the knowledge gap.
2. State what relevant repository knowledge was found, if any.
3. Use related canonical concepts when they provide useful context.
4. Use external knowledge only when external retrieval is permitted.
5. Clearly distinguish external information from repository knowledge.
6. Never imply that externally retrieved information originated from Tech-Mastery-Hub.

This behavior prevents hallucinated repository coverage and preserves source transparency.

---

## Interview and Assessment Engine

The Tutor should combine canonical concepts, interview material, related concepts, and practice content when operating in interview or assessment modes.

The interview flow should support:

Concept
   |
   v
Interview Knowledge
   |
   v
Question Generation
   |
   v
User Response
   |
   v
Evaluation
   |
   +--> Correct understanding
   |
   +--> Partial understanding
   |
   +--> Knowledge gap
   |
   v
Targeted Explanation
   |
   v
Follow-up Question / Practice

Interview questions should remain grounded in repository content when repository-backed interview preparation is requested.

The assessment engine should evaluate understanding rather than merely matching keywords.

Evaluation should consider conceptual correctness, reasoning, implementation understanding, trade-offs, and ability to explain the topic clearly.

---

## Learning Progression

The Tutor should support progressive learning depth rather than treating every request as an isolated question.

A topic may progress through:

Simple
  -> Developer
  -> Deep Technical
  -> Internals
  -> Architecture
  -> Interview
  -> Practice

The Tutor should use the user's request and demonstrated understanding to select an appropriate depth.

A user who demonstrates strong understanding may be offered deeper internals, architecture, trade-offs, or interview-level questions.

A user who demonstrates a knowledge gap should receive targeted explanation and simpler examples before progressing.

---

## Security Architecture

All repository-changing operations must pass through security and validation controls.

The AI Tutor should treat the following as untrusted input:

- user prompts
- uploaded files
- pasted code
- external content
- generated content before validation
- repository content being transformed

The security layer should detect and handle:

- prompt injection
- secrets and credentials
- malicious content
- unsafe instructions
- suspicious executable payloads
- unauthorized access instructions
- destructive operations
- attempts to bypass security controls

Content instructions found inside retrieved documents should be treated as data unless they originate from the authorized AI instruction layer.

Security-sensitive areas such as AI instructions, governance rules, schemas, workflows, authentication, authorization, and repository configuration require additional protection.

If safety cannot be established, the operation should fail closed rather than proceed.

---

## Change Governance

The AI Tutor must never directly modify the protected main branch.

Repository-changing operations should follow this lifecycle:

Proposal
  -> Security Validation
  -> Content Validation
  -> Duplicate Detection
  -> Relationship Validation
  -> Impact Analysis
  -> Feature Branch
  -> Tests / Checks
  -> Pull Request
  -> Human Review
  -> Human Approval
  -> Merge to Main
  -> Re-index

The AI may read, search, retrieve, analyze, propose changes, create a feature branch, modify that branch, run validation, and create a pull request when the required permissions exist.

The AI must not directly modify main, approve its own changes, merge its own pull request, bypass branch protection, change repository permissions, access secrets, disable security controls, or delete protected branches.

Only merged main content becomes authoritative repository knowledge.

---

## Contribution Workflow

When the user asks the Tutor to preserve new knowledge in the repository, the material must pass through a governed contribution workflow.

The workflow should determine:

- what type of content is being contributed
- whether a canonical concept already exists
- whether the material duplicates existing content
- which concept or resource should own the content
- which relationships should be created or updated
- which files and indexes are affected
- whether the change is normal knowledge or protected configuration
- whether additional human approval is required

The Tutor should never silently promote temporary user material into authoritative repository knowledge.

A contribution becomes authoritative only after validation, pull request review, human approval, merge to main, and successful re-indexing.

---

## Auditability

Repository-changing actions should produce an auditable record containing, where applicable:

- action
- actor
- target
- affected files
- validation result
- security result
- approval state
- pull request reference
- timestamp

Audit records must not expose secrets, credentials, tokens, private keys, or other sensitive values.

The audit trail should make it possible to understand what changed, why it changed, what validation occurred, and which human approval authorized the change.
