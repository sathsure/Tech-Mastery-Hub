# SOLID & Design Patterns — Quick Traps

> Tricky spots interviewers love: what goes wrong, a tiny example, and the right answer.

### 1. Non-thread-safe singleton
- ❌ `if (instance == null) instance = new Config();` with many threads → two instances.
- ✅ Use an `enum` singleton or the holder idiom (or let Spring manage it).

### 2. Singleton everywhere
- ❌ Making every service a hand-written singleton.
- ✅ Global state is hard to test. Use dependency injection instead.

### 3. Decorator vs Proxy
- ❌ "They're the same."
- ✅ Same shape, different goal: decorator **adds** behaviour; proxy **controls access** (lazy, security, remote).

### 4. Strategy vs State
- ❌ Mixing them up.
- ✅ Strategy is chosen by the caller; State changes itself as the object's state changes.

### 5. Factory vs Builder
- ❌ Using a builder for "which class to create".
- ✅ Factory picks *which* object; Builder assembles *one* complex object step by step.

### 6. Breaking Liskov
- ❌ `class Penguin extends Bird` where `Bird` has `fly()` → throws.
- ✅ Split interfaces (`Bird`, `FlyingBird`) so children can always stand in for parents.

### 7. Dependency Inversion = Dependency Injection
- ❌ Treating them as the same thing.
- ✅ DIP is a principle (depend on abstractions). DI is a technique that helps you follow it.

### 8. Inheritance for code reuse
- ❌ `class Logger extends ArrayList` to reuse `add()`.
- ✅ Prefer composition: have a field, don't be one.

### 9. Patterns for everything
- ❌ A factory, strategy and builder for a 20-line feature.
- ✅ Use a pattern only when it removes real complexity.
