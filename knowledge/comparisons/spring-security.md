# Spring Security — Comparisons

> The classic "X vs Y" questions, side by side.

## Authentication vs authorization
| | Authentication | Authorization |
|---|---|---|
| Question | who are you? | what can you do? |
| Failure code | 401 | 403 |
| Comes | first | second |

## Session vs JWT
| | Session (cookie) | JWT (bearer token) |
|---|---|---|
| State on server | ✅ | ❌ |
| Easy to revoke | ✅ | ❌ (wait for expiry / deny-list) |
| Scales across servers | needs shared store | ✅ |
| CSRF risk | ✅ | ❌ (if not in a cookie) |

## Access token vs refresh token
| | Access token | Refresh token |
|---|---|---|
| Lifetime | minutes | days |
| Sent with | every API call | only to get a new access token |

## HS256 vs RS256
| | HS256 | RS256 |
|---|---|---|
| Keys | one shared secret | private signs, public verifies |
| Best for | one service | many services / third parties |

## OAuth2 vs OIDC
| | OAuth2 | OIDC |
|---|---|---|
| Purpose | access (authorization) | login (authentication) |
| Token | access token | + ID token |

## OAuth2 flows
| Flow | Use for |
|---|---|
| Authorization Code + PKCE | web and mobile apps with users |
| Client Credentials | service to service |
| Device Code | TVs, CLIs |
| Implicit / Password | deprecated |

## `hasRole` vs `hasAuthority`
| | `hasRole("ADMIN")` | `hasAuthority("ROLE_ADMIN")` |
|---|---|---|
| Adds `ROLE_` prefix | ✅ | ❌ |

## CSRF vs CORS
| | CSRF | CORS |
|---|---|---|
| Is | an attack | a browser permission system |
| Concern | forged requests with cookies | which origins may call you |

## `@PreAuthorize` vs `@Secured`
| | `@PreAuthorize` | `@Secured` |
|---|---|---|
| Expressions (SpEL) | ✅ | ❌ (roles only) |
