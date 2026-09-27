# Tech-Mastery-Hub AI Tutor Retrieval Contract

## Retrieval Objective

Retrieve the smallest authoritative set of repository content required to answer the user's request accurately and usefully.

Repository retrieval must occur before generating repository-derived answers.

The retrieval system should prioritize authoritative canonical knowledge while retaining relevant supporting material.

---

## Retrieval Priority

Use the following priority when assembling repository context:

1. Canonical concept matching the requested topic.
2. Directly related canonical concepts.
3. Resources explicitly associated with the canonical concept.
4. Relevant interview material.
5. Relevant practice material.
6. Relevant projects.
7. Relevant visual notes.
8. Relevant masterclasses.
9. Other indexed content when required.

Canonical concepts should anchor the context whenever a matching concept exists.

---

## Hybrid Retrieval

The retrieval system should combine multiple retrieval signals rather than relying on a single search method.

Supported retrieval signals include:

- exact keyword matching
- metadata matching
- canonical concept lookup
- semantic similarity
- explicit relationship traversal
- content-type relevance
- section or topic relevance

These signals should be combined to produce a ranked set of candidate knowledge items.

---

## Relationship-Aware Retrieval

Use explicit canonical concept relationships to expand context when they are relevant to the user's request.

Relationship traversal should:

- start from the best matching canonical concept
- follow only approved repository relationships
- prefer directly connected concepts before distant concepts
- avoid unnecessary graph expansion
- preserve the direction and meaning of explicit relationships

Do not invent relationships during retrieval.

A concept being technically related in general does not make it an approved repository relationship.

---

## Retrieval Ranking

Candidate knowledge should be ranked using signals such as:

- canonical status
- exact topic match
- semantic relevance
- relationship proximity
- content-type relevance
- section relevance
- source authority
- user-requested depth or mode

Canonical status should provide a strong authority signal, but irrelevant canonical content should not be included merely because it is canonical.

The final context should favor highly relevant authoritative material over large quantities of loosely related content.

---

## Visual Retrieval

When the user's request would benefit from visual explanation, search repository visual notes before considering other visual sources.

Repository visual retrieval should consider:

- canonical concept association
- filename and topic relevance
- visual type
- semantic relevance
- direct repository relationships

If a suitable repository visual exists, prefer it over generating a replacement visual.

If no suitable repository visual exists, the visual planning layer may select a structured diagram or generated illustration according to the visual selection policy.

---

## Interview Retrieval

For interview or mock-interview requests, assemble context from:

1. The relevant canonical concept.
2. Relevant interview material.
3. Explicitly related canonical concepts.
4. Relevant practice material.
5. Relevant project material when applicable.

Interview questions should remain grounded in retrieved repository content when repository-backed interview preparation is requested.

Related concepts should provide context without replacing the primary concept requested by the user.

---

## Context Preservation

Retrieved context should preserve enough metadata to maintain source awareness.

Where available, retain:

- repository path
- content type
- canonical concept
- related concepts
- relevant section
- source authority

The context assembler must not remove source identity in a way that makes repository-backed and externally sourced information indistinguishable.

---

## Unknown Topic Retrieval

When retrieval does not find sufficient repository knowledge:

1. Identify the repository knowledge gap.
2. Return any relevant repository concepts that were actually found.
3. Use approved related concepts when they provide useful context.
4. Use external retrieval only when it is permitted by the system configuration.
5. Mark external information as external.
6. Never fabricate repository sources, relationships, or coverage.

Retrieval failure must not be converted into an invented repository answer.

---

## Context Selection and Limits

Retrieve enough context to answer the request accurately without indiscriminately loading the entire repository.

Prefer:

- the smallest relevant canonical concept set
- directly supporting sections
- directly related resources
- only the visual or interview material required for the requested task

Avoid context expansion when additional material does not materially improve the answer.

When multiple sources contain overlapping information, prefer the authoritative canonical explanation and retain supporting sources when they add distinct evidence or examples.

---

## Retrieval Failure Behavior

If repository retrieval fails because the index, source file, relationship metadata, or retrieval mechanism is unavailable, do not silently present an answer as repository-backed.

The Tutor should clearly distinguish:

- repository content successfully retrieved
- repository content unavailable
- external knowledge used, if permitted

A retrieval failure is not evidence that the repository lacks the topic.

The Tutor should avoid inventing sources or claiming successful retrieval when retrieval did not occur.
