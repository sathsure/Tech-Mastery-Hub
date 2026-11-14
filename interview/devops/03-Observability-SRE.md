# 📈 Observability & SRE Interview Preparation

## Observability Basics

### ❓ What is observability, and how is it different from monitoring?

**Monitoring** watches known things you decided to check in advance (is CPU above 80%? is the site up?). **Observability** means the system emits enough data that you can answer *new* questions about it — including problems you never predicted.

- Monitoring: "Is it broken?" Observability: "Why is it broken, and for whom?"
- You build observability from three kinds of data: **logs, metrics and traces**.

**Example:** monitoring alerts that checkout errors are up; observability lets you find that only users of one payment provider in one region are failing, after a specific deploy.

---

### ❓ What are the three pillars: logs, metrics and traces?

| Pillar | What it is | Good for | Example tools |
|---|---|---|---|
| **Logs** | Timestamped records of events | Details of one event or error | ELK/OpenSearch, Loki, CloudWatch Logs |
| **Metrics** | Numbers measured over time | Trends, dashboards, alerts | Prometheus, Datadog, CloudWatch |
| **Traces** | The path of one request across services, with timings | Finding which service or call is slow | Jaeger, Tempo, Zipkin, X-Ray |

They work together: a **metric** alert tells you errors rose, a **trace** shows the slow or failing service, and its **logs** show the exact error.

---

### ❓ What is structured logging, and why use it?

Writing logs as key–value data (usually JSON) instead of free text, so tools can search, filter and count them.

```json
{"ts":"2026-11-09T10:15:02Z","level":"ERROR","service":"payment","traceId":"7f3a…","orderId":"A1043","msg":"Card declined","code":"insufficient_funds"}
```

- Add a **trace or correlation ID** to every line so you can follow one request across services.
- Use levels properly: ERROR (needs action), WARN, INFO (business events), DEBUG (off in production).
- Never log passwords, tokens, card numbers or other personal data.

---

### ❓ What is distributed tracing?

Tracing follows one request through every service it touches. Each step is a **span** (name, start time, duration); all spans of one request share a **trace ID**, passed along in request headers (W3C `traceparent`).

```text
GET /checkout ─────────────────────────────── 820 ms
  ├─ order-service: create order ─── 60 ms
  ├─ payment-service: charge ─────────────── 690 ms   ← the slow part
  │    └─ HTTP call to card gateway ──────── 650 ms
  └─ email-service: send receipt ── 40 ms
```

In Spring Boot 3, Micrometer Tracing with an OpenTelemetry exporter adds this with little code.

---

### ❓ What is OpenTelemetry?

OpenTelemetry (OTel) is an open, vendor-neutral standard and set of SDKs for producing logs, metrics and traces. You instrument your code once, then send the data to any backend — Jaeger, Prometheus, Grafana, Datadog, New Relic — without changing code.

It is a CNCF project and is now the default choice for new instrumentation.

---

## Metrics & Alerts

### ❓ What are the golden signals (and RED / USE)?

**Level:** 🟡 Intermediate

Simple checklists for what to measure:

- **Four golden signals** (Google SRE): **latency**, **traffic**, **errors**, **saturation** (how full a resource is).
- **RED** for request-driven services: **R**ate, **E**rrors, **D**uration.
- **USE** for resources such as CPU, disk and queues: **U**tilisation, **S**aturation, **E**rrors.

**Example dashboard for an API:** requests per second, % of 5xx responses, p50/p95/p99 latency, and thread-pool or DB-connection usage.

---

### ❓ Why look at p95/p99 latency instead of the average?

**Level:** 🟡 Intermediate

The average hides slow requests. p95 means 95% of requests were faster than this value; p99 shows the slowest 1% — often your most active users with the biggest carts or accounts.

**Example:** average 200 ms looks fine, but p99 is 4 s, so 1 in 100 checkouts is painfully slow. Set targets and alerts on percentiles.

---

### ❓ What makes a good alert?

**Level:** 🟡 Intermediate

An alert should mean "a human must act now", and it should be about user impact.

- Alert on **symptoms** (error rate, latency, failed checkouts), not every cause (one pod restarted).
- Every alert links to a **runbook** with first steps.
- Page only for urgent problems; send everything else to a ticket or chat channel.
- Too many noisy alerts cause **alert fatigue** — people start ignoring real ones.

**Example:** "5xx rate above 2% for 5 minutes on checkout" pages on-call; "disk 70% full" opens a ticket.

---

## SRE Practices

### ❓ What is SRE (Site Reliability Engineering)?

**Level:** 🟡 Intermediate

SRE is Google's approach to running production systems: software engineers apply engineering to operations — automating toil, measuring reliability with SLOs, and sharing responsibility for production with development teams.

Core ideas: SLIs and SLOs, **error budgets**, blameless postmortems, limiting manual toil (Google suggests under 50% of an SRE's time), and designing for failure.

---

### ❓ What are SLI, SLO, SLA and an error budget?

**Level:** 🟡 Intermediate

- **SLI** (indicator): what you measure — e.g. % of requests that succeed in under 300 ms.
- **SLO** (objective): your target for it — e.g. 99.9% over 30 days.
- **SLA** (agreement): the promise in a customer contract, with penalties — usually looser than the SLO (e.g. 99.5%).
- **Error budget** = 100% − SLO. At 99.9%, you may "spend" 0.1% of requests (or about 43 minutes a month) on failures.

**How it's used:** while budget remains, teams ship features fast; when it runs out, they slow releases and fix reliability first. It turns "stability vs speed" into a number both sides agree on.

---

### ❓ How do you handle a production incident?

**Level:** 🟡 Intermediate

1. **Detect & declare:** an alert fires; name an incident commander and open a channel.
2. **Mitigate first:** stop the user impact — roll back the last deploy, switch traffic, scale up, turn off a feature flag. Root cause can wait.
3. **Communicate:** regular status updates to stakeholders and a status page.
4. **Resolve & verify:** confirm metrics are back to normal.
5. **Postmortem:** a blameless write-up with timeline, root cause, impact and action items with owners.

**Example:** errors spike right after a release → roll back in 5 minutes → users are fine → then debug the bad change calmly.

---

### ❓ What is a blameless postmortem?

**Level:** 🟡 Intermediate

A written review after an incident that focuses on **what in the system allowed the failure**, not who to blame. People share details honestly only when they won't be punished, and that is how the real fixes are found.

Contents: summary, impact (users, duration, money), timeline, root cause and contributing factors, what went well, and action items with owners and dates.

---

### ❓ What are MTTD, MTTR and MTBF?

**Level:** 🟡 Intermediate

- **MTTD** — mean time to **detect** a problem.
- **MTTR** — mean time to **recover** (or repair).
- **MTBF** — mean time **between failures**.

Teams usually get the most value from cutting MTTD (better alerts) and MTTR (rollbacks, runbooks, feature flags), because failures will happen anyway.

---

### ❓ What is toil, and how do SREs reduce it?

**Level:** 🟡 Intermediate

Toil is manual, repetitive operational work that adds no lasting value and grows with the system — restarting stuck jobs, hand-running deploys, clearing disks.

Reduce it by automating (scripts, self-healing such as Kubernetes restarts, auto-scaling), fixing root causes, and tracking how much time toil takes.

---

### ❓ What is chaos engineering?

**Level:** 🟡 Intermediate

Deliberately injecting failures in a controlled way — killing instances, adding latency, blocking a dependency — to check that the system copes before a real outage does it for you.

Start small (staging, one service, business hours, a clear stop button), state what you expect, and measure. Tools: Chaos Monkey, AWS Fault Injection Service, Gremlin, Chaos Mesh.
