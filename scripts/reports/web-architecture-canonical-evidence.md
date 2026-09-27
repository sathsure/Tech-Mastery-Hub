# Web Architecture Canonical Evidence

> Source: `interview/frontend/09-Web_Architecture.md`

This report extracts the source structure for canonicalization. It does not replace or reinterpret the original interview material.

## MEAN Architecture Fundamentals

### ❓ Explain the high-level MEAN stack architecture

### ❓ Explain the complete request lifecycle in a MEAN application

### ❓ How does Express middleware execution order work?

## Authentication, Authorization & Security

### ❓ How do you implement authentication in MEAN applications?

#### ↳ Follow-up: How do you handle authorization and role management?

### ❓ How do you secure APIs beyond authentication?

### ❓ How do you prevent XSS and injection attacks?

### ❓ Explain CORS and how you configure it correctly

### ❓ How do you manage environment configurations?

## Backend Design Patterns

### ❓ How do you structure a large Node.js backend?

## Backend-for-Frontend (BFF) Pattern

### ❓ Can you walk me through the Backend-for-Frontend pattern and describe a situation where you'd recommend it?

#### 🌐 Concrete Example — A Mobile App Home Screen

#### 🆚 BFF vs API Gateway

#### ✅ When to use a BFF

#### ⚠️ When NOT to use a BFF

#### ↳ **Follow-up:** How do you avoid the BFF becoming a "god service" with all the logic?

#### ↳ **Follow-up:** How do you keep BFFs from drifting from each other?

#### ↳ **Follow-up:** What's the failure mode if a downstream service is slow?

#### ↳ **Follow-up:** Where does authentication happen — gateway, BFF, or microservices?

#### ✅ Key Takeaway

## Performance & Frontend Optimization

### ❓ How do you optimize Angular performance?

### ❓ Explain Angular route guards

## Node.js Internals & Concurrency

### ❓ Why is Node.js suitable for high-concurrency systems?

#### ↳ Follow-up: What blocks the Node.js event loop?

#### ↳ Follow-up: How do you handle long-running or heavy jobs?

## Scalable APIs & Caching

### ❓ How do you design scalable APIs?

### ❓ How would you explain API idempotency, and can you give an example of where it could go wrong if ignored?

### ❓ How do you implement caching effectively?

## MongoDB Best Practices

### ❓ How do you optimize MongoDB performance?

#### ↳ Follow-up: How do you manage schema changes in MongoDB?

## Resilience & Failure Handling

### ❓ How do you handle secure file uploads?

### ❓ How do you prevent API abuse?

### ❓ How do you prevent accidental data leaks?

### ❓ How do you handle partial failures in distributed systems?

### ❓ What happens if MongoDB goes down?

### ❓ What happens when Node.js crashes in production?

## Observability, Deployments & HA

### ❓ How do you design logging for production?

#### ↳ Follow-up: Logs vs Monitoring — explain the difference

### ❓ How do you manage secrets securely?

### ❓ How do you handle deployments?

### ❓ How do you ensure high availability?

### ❓ How do you debug slow APIs in production?

### ❓ How do you protect frontend applications?

### ❓ How do you design for traffic spikes?

## Final System Design Question

### ❓ Final Question: Design a MEAN system for 1 million users

#### 🏗 Architecture Overview

#### 🔑 Core Principles

#### 🚧 First Bottlenecks to Address

#### 📈 Capacity Reasoning


## Source Statistics

- Source characters: 35863
- Source lines: 986
- Sections detected: 11

## Canonicalization Boundary

- Preserve the original interview source unchanged.
- Canonical content must be supported by the source.
- Do not infer unsupported architecture rules from headings alone.
- Concrete MEAN system-design material should remain traceable to the original source.
