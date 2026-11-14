# SOLID & Design Patterns — Comparisons

> The classic "X vs Y" questions, side by side.

## Factory vs Abstract Factory vs Builder
| | Creates | Use when |
|---|---|---|
| Factory | one object, class chosen for you | many subtypes |
| Abstract Factory | families of related objects | matching sets (UI themes) |
| Builder | one complex object step by step | many optional fields |

## Decorator vs Proxy vs Adapter
| | Same interface? | Goal |
|---|---|---|
| Decorator | ✅ | add behaviour |
| Proxy | ✅ | control access |
| Adapter | ❌ (converts) | make interfaces fit |

## Strategy vs State
| | Strategy | State |
|---|---|---|
| Who switches | the caller | the object itself |
| Example | sorting algorithm | order status |

## Strategy vs Template Method
| | Strategy | Template Method |
|---|---|---|
| Uses | composition | inheritance |
| Varies | the whole algorithm | some steps |

## Observer vs Pub/Sub
| | Observer | Pub/Sub |
|---|---|---|
| Middleman | ❌ (subject knows observers) | ✅ (broker) |
| Coupling | tighter | looser |

## Composition vs inheritance
| | Composition | Inheritance |
|---|---|---|
| Relationship | has-a | is-a |
| Flexibility | high (swap at runtime) | low |

## Abstract class vs interface (design view)
| | Abstract class | Interface |
|---|---|---|
| Shares code and state | ✅ | ❌ (only defaults) |
| Multiple per class | ❌ | ✅ |

## Dependency Inversion vs Dependency Injection
| | DIP | DI |
|---|---|---|
| Is | a principle | a technique |
| Says | depend on abstractions | pass dependencies in |

## Singleton pattern vs Spring singleton
| | Singleton pattern | Spring singleton bean |
|---|---|---|
| One instance per | JVM (class loader) | Spring container |
| Testable | hard | easy (injected) |
