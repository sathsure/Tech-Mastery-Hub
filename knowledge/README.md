# Knowledge

The Knowledge layer contains the reusable technical knowledge of Tech-Mastery-Hub.

It is the central learning layer between the roadmap and the supporting learning resources.

## Knowledge Architecture

```text
Roadmap
   ↓
Canonical Concepts
   ├── Masterclasses
   ├── Visual Notes
   ├── Interview
   ├── Practice
   └── Projects
```

## Sections

### Concepts

`knowledge/concepts/`

Canonical, reusable technical knowledge.

Each canonical concept represents a stable knowledge area that can be referenced by multiple learning activities.

Current canonical concepts include:

- HTML
- CSS
- JavaScript
- TypeScript
- Angular
- React
- RxJS
- Node.js
- REST API
- Java
- Spring
- Spring Security
- Spring Cloud
- SQL
- Microservices
- AWS
- DevOps
- Web Architecture
- Web Vitals

See [concepts/README.md](concepts/README.md) for the canonical concept framework.

### Masterclasses

`knowledge/masterclasses/`

Long-form, deep-learning material.

Masterclasses provide detailed study material beyond the reusable concept layer.

### Visual Notes

`knowledge/visual-notes/`

Image-based explanations and technical diagrams.

Visual notes may support one or more canonical concepts and are indexed separately for future AI retrieval and multimodal understanding.

### Resources

`knowledge/resources/`

Reserved for reusable supporting learning resources that do not belong directly to the canonical concept, masterclass, or visual-note categories.

## Relationship Model

```text
Roadmap Topic
     ↓
Canonical Concept
     ├── Related Concepts
     ├── Masterclass
     ├── Visual Notes
     ├── Interview Questions
     ├── Practice
     └── Projects
```

The repository knowledge index records these relationships for future retrieval.

## AI Usage

The Knowledge layer is the primary source for the future AI Tutor.

```text
Repository
    ↓
Knowledge Index
    ↓
Relevant Concepts / Resources
    ↓
Retrieval
    ↓
AI Tutor
```

Canonical concepts provide reusable explanations.

Interview and practice material provide assessment-oriented context.

Masterclasses provide deeper learning context.

Visual notes provide visual context.

The AI should retrieve repository content before generating repository-derived answers.

## Source-of-Truth Rule

Canonical concept pages are the reusable technical knowledge source of truth.

Supporting resources remain preserved in their original form.

The canonical layer consolidates evidence from those sources without silently replacing or destroying the original material.

Repository-derived AI changes require human review before becoming canonical knowledge.
