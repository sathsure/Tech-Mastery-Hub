# Testing — Cheat Sheet

> **In one line:** automated tests check your code still works, so you can change it with confidence.

## The test pyramid
```
       E2E          few — whole app through the UI (slow)
    Integration     some — real parts together (DB, HTTP)
       Unit         many — one class or function (fast)
```
- **Unit** — one piece alone, with its helpers faked.
- **Integration** — real pieces together (e.g. with a real DB in **Testcontainers**).
- **End-to-end (E2E)** — click through the app like a user (Playwright, Cypress, Selenium).
- Also: **contract tests** (Pact), **performance tests** (JMeter, Gatling, k6), **security tests**.

## A good test
- **Arrange → Act → Assert** (or Given / When / Then).
- Fast, independent, repeatable.
- Tests behaviour, not internal details.
- Clear name: `shouldRejectExpiredCoupon`.

## JUnit 5
```java
class PriceServiceTest {
  PriceService service = new PriceService();

  @Test
  void festiveCodeGives10PercentOff() {
    assertEquals(new BigDecimal("90.00"), service.price(new BigDecimal("100.00"), "FESTIVE"));
  }

  @ParameterizedTest
  @CsvSource({"100, NONE, 100.00", "100, FESTIVE, 90.00"})
  void prices(BigDecimal base, String code, BigDecimal expected) {
    assertEquals(expected, service.price(base, code));
  }

  @Test
  void rejectsNegativePrice() {
    assertThrows(IllegalArgumentException.class, () -> service.price(new BigDecimal("-1"), "NONE"));
  }
}
```
- Setup/cleanup: `@BeforeEach`, `@AfterEach`, `@BeforeAll`, `@AfterAll`.
- **AssertJ** reads nicely: `assertThat(list).hasSize(3).contains("a")`.

## Mockito
```java
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {
  @Mock PaymentClient payments;          // fake
  @InjectMocks OrderService service;     // real class, gets the fake

  @Test void chargesTheCard() {
    when(payments.charge(any())).thenReturn(Receipt.ok());
    service.place(order);
    verify(payments).charge(any());      // was it called?
  }
}
```
- **Mock** — a fake you program. **Spy** — a real object with some methods faked. **Stub** — returns fixed data. **Fake** — a simple working version (in-memory repository).

## Spring Boot tests
- `@SpringBootTest` — starts the whole app.
- `@WebMvcTest` — only controllers, with `MockMvc`.
- `@DataJpaTest` — only repositories.
- `@MockitoBean` — replace a bean with a mock.
```java
mockMvc.perform(get("/api/users/1"))
       .andExpect(status().isOk())
       .andExpect(jsonPath("$.name").value("Asha"));
```

## Frontend tests
- **Jest / Vitest** — unit tests.
- **Testing Library** — test components like a user would (`getByRole`, click).
- **Playwright / Cypress** — end-to-end tests.

## Coverage
- Shows which lines tests run (JaCoCo, Istanbul). ~80% is a common goal.
- High coverage ≠ good tests. **Mutation testing** checks if tests really catch bugs.

## TDD & BDD
- **TDD** — write a failing test → make it pass → clean up (Red → Green → Refactor).
- **BDD** — describe behaviour in plain language (`Given … When … Then`), e.g. Cucumber.

## Kinds of testing (often asked)
- **Smoke** — does it start? **Sanity** — quick check after a fix. **Regression** — did old features break?
- **Load** — normal heavy traffic. **Stress** — past the limit. **Soak** — for a long time.
- **Black box** — test without seeing the code. **White box** — test with the code in mind.
- **Boundary values** — test at the edges (0, 1, max, max+1).
