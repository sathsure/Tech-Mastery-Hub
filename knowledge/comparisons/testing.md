# Testing — Comparisons

> The classic "X vs Y" questions, side by side.

## Unit vs integration vs end-to-end
| | Unit | Integration | E2E |
|---|---|---|---|
| Scope | one class | several real parts | whole app |
| Speed | ms | seconds | minutes |
| How many | many | some | few |

## Mock vs stub vs spy vs fake
| | Is |
|---|---|
| Stub | returns canned answers |
| Mock | stub + checks how it was called |
| Spy | real object, some methods stubbed |
| Fake | simple working version (in-memory repo) |

## `@Mock` vs `@MockitoBean`
| | `@Mock` | `@MockitoBean` (was `@MockBean`) |
|---|---|---|
| Used in | plain unit tests | Spring tests |
| Replaces a Spring bean | ❌ | ✅ |

## `@SpringBootTest` vs `@WebMvcTest` vs `@DataJpaTest`
| | Loads | Speed |
|---|---|---|
| `@SpringBootTest` | everything | slow |
| `@WebMvcTest` | web layer | fast |
| `@DataJpaTest` | JPA layer | fast |

## H2 vs Testcontainers
| | H2 | Testcontainers |
|---|---|---|
| Real production DB | ❌ | ✅ |
| Needs Docker | ❌ | ✅ |

## TDD vs BDD
| | TDD | BDD |
|---|---|---|
| Written by | developers | team incl. business |
| Language | code tests | Given/When/Then |

## Smoke vs sanity vs regression
| | Checks |
|---|---|
| Smoke | the build basically works |
| Sanity | one fix or area quickly |
| Regression | old features still work |

## Load vs stress vs soak vs spike
| | Traffic |
|---|---|
| Load | expected peak |
| Stress | beyond the limit |
| Soak | normal, for hours |
| Spike | sudden jump |

## Black box vs white box
| | Black box | White box |
|---|---|---|
| Knows the code | ❌ | ✅ |

## Line vs branch coverage
| | Counts |
|---|---|
| Line | lines executed |
| Branch | each `if`/`else` path executed |
