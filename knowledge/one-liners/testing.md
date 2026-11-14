# Testing — One-liners

> The most asked questions, each answered in one sentence.

1. **What is the test pyramid?** — Many unit tests, fewer integration tests and very few end-to-end tests.
2. **Unit vs integration test?** — A unit test checks one piece alone; an integration test checks real pieces working together.
3. **What is an end-to-end test?** — A test that uses the whole app like a real user.
4. **What is AAA?** — Arrange, Act, Assert — the structure of a clear test.
5. **Mock vs stub?** — A stub returns canned data; a mock also verifies how it was called.
6. **Mock vs spy?** — A mock is fully fake; a spy wraps a real object and lets you stub some methods.
7. **What does `@InjectMocks` do?** — Creates the class under test and injects the `@Mock` fields into it.
8. **What is `@WebMvcTest`?** — A Spring test slice that loads only the web layer with MockMvc.
9. **What is `@DataJpaTest`?** — A Spring test slice for repositories with a test database.
10. **What is Testcontainers?** — A library that starts real databases and services in Docker for tests.
11. **What is a parameterized test?** — One test run with several sets of inputs.
12. **What is TDD?** — Writing a failing test first, then code to pass it, then refactoring.
13. **What is BDD?** — Describing behaviour as Given/When/Then scenarios.
14. **What is code coverage?** — The share of code run by tests.
15. **What is mutation testing?** — Changing code slightly to check whether the tests catch it.
16. **What is a flaky test?** — A test that sometimes passes and sometimes fails without code changes.
17. **What is a contract test?** — A test that checks a service still meets its consumers' expectations.
18. **Smoke vs regression testing?** — Smoke checks the basics work; regression checks old features didn't break.
19. **Load vs stress testing?** — Load tests expected traffic; stress tests beyond the limits.
20. **What is boundary value testing?** — Testing at the edges of valid input, like 0, max and max+1.
