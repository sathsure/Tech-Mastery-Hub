# Observability & SRE — Quick Traps

> Tricky spots interviewers love: what goes wrong, a tiny example, and the right answer.

### 1. Averages hide pain
- ❌ "Average latency is 120 ms, all good."
- ✅ 5% of users may wait 4 seconds. Watch p95/p99.

### 2. 100% as the target
- ❌ "Our SLO is 100% uptime."
- ✅ Impossible and blocks all change. Pick a target users actually need.

### 3. SLA = SLO
- ❌ Using them interchangeably.
- ✅ SLO is the internal goal; SLA is the customer contract (set looser than the SLO).

### 4. Alerting on causes
- ❌ Paging at 2 AM because CPU hit 85%.
- ✅ Page on symptoms users feel (error rate, latency, SLO burn).

### 5. Logs without a trace id
- ❌ An error in one service, impossible to connect to the user's request.
- ✅ Add the trace id to every log line.

### 6. Logging secrets
- ❌ `log.info("login request: " + body)` with the password.
- ✅ Mask or skip sensitive fields.

### 7. Unique ids as metric labels
- ❌ `requests_total{user_id="..."}` → millions of series, huge bill.
- ✅ Keep labels low-cardinality (status, route). Put ids in logs/traces.

### 8. Root cause first during an incident
- ❌ Debugging for an hour while users are down.
- ✅ Restore service first (rollback, failover), investigate after.

### 9. Blame in postmortems
- ❌ "Ravi caused the outage."
- ✅ Blameless: find the system gap that let the mistake through.
