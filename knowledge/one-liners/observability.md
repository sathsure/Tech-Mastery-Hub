# Observability & SRE — One-liners

> The most asked questions, each answered in one sentence.

1. **Monitoring vs observability?** — Monitoring tells you something is wrong; observability helps you find out why.
2. **What are the three pillars?** — Logs, metrics and traces.
3. **What is OpenTelemetry?** — An open standard and SDK for collecting logs, metrics and traces.
4. **What are the four golden signals?** — Latency, traffic, errors and saturation.
5. **What is RED?** — Rate, Errors and Duration — key metrics for a service.
6. **What is USE?** — Utilization, Saturation and Errors — key metrics for a resource.
7. **Why use percentiles instead of averages?** — Averages hide slow requests; p95/p99 show what unlucky users feel.
8. **What is a structured log?** — A log line in a machine-readable format like JSON with fixed fields.
9. **What is a trace?** — The full path of one request across services.
10. **What is a span?** — One timed operation inside a trace.
11. **What is an SLI?** — A measured indicator of service health, like the share of fast successful requests.
12. **What is an SLO?** — The target for an SLI, like 99.9% over 30 days.
13. **SLO vs SLA?** — An SLO is an internal goal; an SLA is a contract with customers.
14. **What is an error budget?** — The amount of failure the SLO allows, e.g. about 43 minutes a month at 99.9%.
15. **What is MTTR?** — Mean time to recover from an incident.
16. **What is a runbook?** — Step-by-step instructions for handling a specific alert.
17. **What is a blameless postmortem?** — An incident review focused on fixing systems, not blaming people.
18. **What is toil?** — Repetitive manual operational work that should be automated.
19. **What is high cardinality?** — Too many unique label values, which makes metrics costly.
20. **What is chaos engineering?** — Injecting failures on purpose to test resilience.
