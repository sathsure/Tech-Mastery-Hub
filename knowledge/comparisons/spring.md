# Spring Boot — Comparisons

> The classic "X vs Y" questions, side by side.

## Spring vs Spring Boot
| | Spring | Spring Boot |
|---|---|---|
| Setup | manual configuration | auto-configuration |
| Server | deploy to external | embedded Tomcat |
| Dependencies | pick each | starters |

## Constructor vs setter vs field injection
| | Constructor | Setter | Field |
|---|---|---|---|
| Final fields | ✅ | ❌ | ❌ |
| Easy to test | ✅ | ✅ | ❌ |
| Recommended | ✅ | for optional deps | ❌ |

## `@Component` vs `@Service` vs `@Repository` vs `@Controller`
| | Layer | Extra |
|---|---|---|
| `@Component` | any | — |
| `@Service` | business logic | — |
| `@Repository` | data access | DB exception translation |
| `@Controller` | web (views) | — |
| `@RestController` | web (JSON) | `@ResponseBody` on every method |

## `@Bean` vs `@Component`
| | `@Bean` | `@Component` |
|---|---|---|
| Placed on | a method in `@Configuration` | your class |
| Good for | third-party classes | your own classes |

## Singleton vs prototype scope
| | Singleton | Prototype |
|---|---|---|
| Instances | one per container | new each time requested |
| Destroy callbacks | ✅ | ❌ |

## `@PathVariable` vs `@RequestParam` vs `@RequestBody`
| | Reads | Example |
|---|---|---|
| `@PathVariable` | URL path | `/users/5` |
| `@RequestParam` | query string | `?page=2` |
| `@RequestBody` | JSON body | POST data |

## Propagation: `REQUIRED` vs `REQUIRES_NEW`
| | `REQUIRED` (default) | `REQUIRES_NEW` |
|---|---|---|
| Existing transaction | joins it | pauses it, starts a new one |
| Use for | normal work | audit logs that must save even if the outer fails |

## `save()` vs `saveAndFlush()`
| | `save` | `saveAndFlush` |
|---|---|---|
| SQL sent | at flush/commit | immediately |

## Lazy vs eager fetching
| | Lazy | Eager |
|---|---|---|
| Loads related data | when accessed | with the parent |
| Default | `@OneToMany` | `@ManyToOne` |

## Filter vs interceptor vs AOP
| | Filter | Interceptor | AOP |
|---|---|---|---|
| Level | servlet | Spring MVC handler | any Spring bean method |
| Example | security, CORS | logging per controller | transactions, auditing |

## `JpaRepository` vs `CrudRepository`
| | `CrudRepository` | `JpaRepository` |
|---|---|---|
| Basic CRUD | ✅ | ✅ |
| Paging, sorting, batch, flush | ❌ | ✅ |
