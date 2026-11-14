# Testing — Quick Traps

> Tricky spots interviewers love: what goes wrong, a tiny example, and the right answer.

### 1. 100% coverage = bug-free
- ❌ "All lines are covered, so it's tested."
- ✅ A test can run a line without checking its result. Check assertions; try mutation testing.

### 2. Mocking everything
- ❌ Mocking the repository, mapper and validator → the test only checks the mocks.
- ✅ Mock slow/external things (HTTP, payments); use real simple objects.

### 3. Testing private details
- ❌ Asserting exactly which internal methods ran.
- ✅ Test inputs and outputs (behaviour), so refactoring doesn't break tests.

### 4. Tests that depend on each other
- ❌ Test B only passes after test A created the data.
- ✅ Each test sets up its own data.

### 5. Flaky tests
- ❌ `Thread.sleep(2000)` and hoping the async work is done.
- ✅ Wait for a condition (Awaitility), control the clock, avoid real networks.

### 6. `@SpringBootTest` for everything
- ❌ Every test starts the whole app → very slow suite.
- ✅ Use plain unit tests and slices (`@WebMvcTest`, `@DataJpaTest`).

### 7. H2 instead of the real database
- ❌ Tests pass on H2, the query fails on Postgres.
- ✅ Use Testcontainers with the same database as production.

### 8. Only the happy path
- ❌ Testing just valid input.
- ✅ Also: empty, null, zero, negative, max size, duplicates, errors.

### 9. Mock vs spy
- ❌ Using a spy and getting surprised that real methods run.
- ✅ A spy calls the real method unless you stub it; a mock never does.

### 10. Smoke vs sanity
- ❌ Using them as the same thing.
- ✅ Smoke = does the build basically work? Sanity = quick check of one fix or area.
