# Observability & SRE — Comparisons

> The classic "X vs Y" questions, side by side.

## Logs vs metrics vs traces
| | Logs | Metrics | Traces |
|---|---|---|---|
| Is | events as text | numbers over time | one request's path |
| Answers | what happened? | how much / how fast? | where is it slow? |
| Cost | high volume | cheap | medium (sampled) |

## Monitoring vs observability
| | Monitoring | Observability |
|---|---|---|
| Finds | known problems | unknown problems |
| Approach | dashboards, alerts | explore rich data |

## SLI vs SLO vs SLA
| | Is | Example |
|---|---|---|
| SLI | a measurement | % requests < 300 ms |
| SLO | a target | 99.9% over 30 days |
| SLA | a contract | refund below 99.5% |

## RED vs USE vs golden signals
| | For | Metrics |
|---|---|---|
| RED | services | rate, errors, duration |
| USE | resources | utilization, saturation, errors |
| Golden signals | user-facing systems | latency, traffic, errors, saturation |

## Average vs p95 vs p99
| | Shows |
|---|---|
| Average | typical, hides outliers |
| p95 | what 1 in 20 users feel |
| p99 | what 1 in 100 users feel |

## Counter vs gauge vs histogram
| | Behaviour | Example |
|---|---|---|
| Counter | only goes up | requests total |
| Gauge | up and down | memory used |
| Histogram | buckets of values | request latency |

## MTTD vs MTTR vs MTBF
| | Measures |
|---|---|
| MTTD | time to detect |
| MTTR | time to recover |
| MTBF | time between failures |

## Prometheus (pull) vs push-based
| | Pull (Prometheus) | Push (StatsD, OTel push) |
|---|---|---|
| Who sends | server scrapes apps | apps send data |
| Short jobs | needs a push gateway | easy |
