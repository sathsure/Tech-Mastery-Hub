# Observability & SRE — Cheat Sheet

> **In one line:** collect enough signals from running systems to know *when* something breaks and figure out *why*.

## The three signals
- **Logs** — text records of events ("payment failed for order 991").
- **Metrics** — numbers over time (requests/sec, error %, latency).
- **Traces** — the path of one request through every service.
- **OpenTelemetry (OTel)** — one standard way to collect all three.
- Tools: Prometheus + Grafana (metrics), ELK / Loki (logs), Jaeger / Tempo (traces), Datadog / New Relic (all-in-one).

## Good logs
- **Structured** (JSON), with a level, time, service name and **trace id**.
- Levels: ERROR (needs action), WARN, INFO (business events), DEBUG (off in production).
- Never log passwords, tokens or personal data.

```json
{"level":"ERROR","service":"payments","traceId":"4bf92f","msg":"card declined","orderId":991}
```

## What to measure
- **Four golden signals** — **latency**, **traffic**, **errors**, **saturation** (how full the system is).
- **RED** (for services) — Rate, Errors, Duration.
- **USE** (for machines) — Utilization, Saturation, Errors.
- Use **percentiles** (p95, p99), not averages — averages hide slow users.

## Traces
- **Trace** — one whole request. **Span** — one step in it (a DB call, an HTTP call).
- The trace id is passed between services in a header.

## SLI, SLO, SLA, error budget
- **SLI** — what you measure: "% of requests faster than 300 ms".
- **SLO** — your target: "99.9% over 30 days".
- **SLA** — a promise to customers, with penalties (looser than the SLO).
- **Error budget** — the failure you're allowed: 99.9% → about **43 minutes a month**. Budget left → ship features. Budget used → fix reliability.

| Target | Downtime per month |
|---|---|
| 99% | ~7.3 hours |
| 99.9% | ~43 minutes |
| 99.99% | ~4.4 minutes |

## Alerts
- Alert on what users feel (errors, slowness, SLO burn), not every CPU spike.
- Every alert needs an action and a **runbook**.

## Incidents
1. Detect → 2. Set severity → 3. Assign an incident commander → 4. **Fix the impact first** (rollback, failover) → 5. Find the root cause → 6. **Blameless postmortem** with action items.
- **MTTD** — time to detect. **MTTR** — time to recover.

## SRE practices
Automate repetitive manual work (**toil**), plan capacity, test failure on purpose (**chaos engineering**), keep on-call healthy.
