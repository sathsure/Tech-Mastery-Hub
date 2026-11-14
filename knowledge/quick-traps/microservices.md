# Microservices — Quick Traps

> Tricky spots interviewers love: what goes wrong, a tiny example, and the right answer.

### 1. Starting with microservices
- ❌ A 3-person startup builds 15 services on day one.
- ✅ Start with a modular monolith; split when teams or scale need it.

### 2. Shared database
- ❌ Five services reading and writing the same tables.
- ✅ Each service owns its data; others go through its API or events.

### 3. Distributed monolith
- ❌ Services that must be deployed together.
- ✅ That's the worst of both worlds. Version APIs and keep services independent.

### 4. Two-phase commit across services
- ❌ Using 2PC/XA for an order + payment.
- ✅ Use a Saga with compensating actions; accept eventual consistency.

### 5. Publishing events after commit
- ❌ `save(order); kafka.send(event);` → crash between them loses the event.
- ✅ Outbox pattern: write the event in the same transaction, publish it later.

### 6. Duplicate messages
- ❌ Assuming each message arrives exactly once.
- ✅ Most systems are at-least-once. Make consumers idempotent (store processed ids).

### 7. Long sync call chains
- ❌ A → B → C → D over REST; one slow service slows everything.
- ✅ Fewer hops, async events, timeouts and circuit breakers.

### 8. Too-small services
- ❌ A service per table or per function ("nanoservices").
- ✅ Split by business capability.

### 9. No trace id
- ❌ An error in service D, but you can't find which request caused it.
- ✅ Pass a trace id through every call and log it.

### 10. CAP in one line
- ❌ "We'll have consistency, availability and partition tolerance."
- ✅ During a network split you pick consistency *or* availability.
