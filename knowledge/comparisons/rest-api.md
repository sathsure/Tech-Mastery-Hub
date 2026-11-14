# REST API — Comparisons

> The classic "X vs Y" questions, side by side.

## PUT vs PATCH vs POST
| | Purpose | Idempotent |
|---|---|---|
| POST | create / action | ❌ |
| PUT | replace the whole resource | ✅ |
| PATCH | change some fields | not guaranteed |

## 401 vs 403
| | 401 Unauthorized | 403 Forbidden |
|---|---|---|
| Meaning | not logged in / bad token | logged in, not allowed |
| Fix | log in | get permission |

## 400 vs 422 vs 409
| | Meaning |
|---|---|
| 400 | request is malformed |
| 422 | well-formed but fails validation |
| 409 | conflicts with current state |

## 502 vs 503 vs 504
| | Meaning |
|---|---|
| 502 Bad Gateway | the upstream sent a bad response |
| 503 Unavailable | the service is down or overloaded |
| 504 Gateway Timeout | the upstream didn't answer in time |

## REST vs GraphQL vs gRPC
| | REST | GraphQL | gRPC |
|---|---|---|---|
| Endpoints | many | one | methods |
| Format | JSON | JSON | Protobuf (binary) |
| Over-fetching | common | ❌ | ❌ |
| Best for | public APIs | flexible UIs | fast internal calls |

## REST vs SOAP
| | REST | SOAP |
|---|---|---|
| Format | JSON (usually) | XML |
| Contract | OpenAPI (optional) | WSDL (strict) |
| Weight | light | heavy |

## Offset vs cursor pagination
| | Offset | Cursor |
|---|---|---|
| Example | `?page=3&size=20` | `?after=abc` |
| Big tables | slow | fast |
| Jump to page N | ✅ | ❌ |

## URL vs header versioning
| | URL `/v1/` | Header |
|---|---|---|
| Easy to see and test | ✅ | ❌ |
| Clean URLs | ❌ | ✅ |

## Webhook vs polling
| | Webhook | Polling |
|---|---|---|
| Who starts | the server calls you | you ask repeatedly |
| Efficiency | high | wasteful |

## Path params vs query params
| | Path `/users/5` | Query `?status=active` |
|---|---|---|
| Use for | identifying a resource | filtering, sorting, paging |
