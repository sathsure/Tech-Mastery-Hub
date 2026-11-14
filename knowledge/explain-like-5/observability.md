# Observability & SRE — Explain Like I'm 5

> Hard ideas as everyday pictures, then what they really mean.

## Logs, metrics, traces
🩺 Logs are the patient's diary, metrics are the heartbeat monitor, traces are the path they walked through the hospital.
**Really:** events, numbers over time, and one request's journey.

## Percentiles (p99)
🚌 "Most buses come in 5 minutes" (average) hides that 1 in 100 people waits 40 minutes (p99).
**Really:** percentiles show what the unlucky users experience.

## SLO and error budget
📵 Your parents allow 1 hour of screen time a day. Used it up? No more games — homework (reliability work) first.
**Really:** a reliability target and the failure you're allowed before you must stop shipping features.

## Alerting
🔥 A smoke alarm should ring for fire, not every time you make toast.
**Really:** alert on real user pain, not every small blip.

## Postmortem
⚽ After a lost match, the team watches the replay to learn, not to blame the goalkeeper.
**Really:** a blameless review that fixes the system.

## Chaos engineering
🚒 Fire drills: practise the emergency before the real one.
**Really:** break things on purpose to prove the system recovers.
