# Web Security (OWASP) — Comparisons

> The classic "X vs Y" questions, side by side.

## Hashing vs encryption vs encoding
| | Reversible | Needs a key | Use for |
|---|---|---|---|
| Hashing | ❌ | ❌ | passwords, integrity |
| Encryption | ✅ | ✅ | secret data |
| Encoding | ✅ | ❌ | safe transport (Base64, URL) |

## XSS vs CSRF
| | XSS | CSRF |
|---|---|---|
| Attacker | runs script in your page | sends requests as you |
| Fix | escape output, CSP | SameSite cookies, tokens |

## Stored vs reflected vs DOM XSS
| | Payload lives in |
|---|---|
| Stored | the database |
| Reflected | the request URL |
| DOM-based | front-end code handling input |

## Authentication vs authorization
| | Authentication | Authorization |
|---|---|---|
| Question | who are you? | what can you do? |
| HTTP code | 401 | 403 |

## bcrypt vs SHA-256 (for passwords)
| | bcrypt / Argon2 | SHA-256 |
|---|---|---|
| Speed | slow on purpose | very fast |
| Salt built in | ✅ | ❌ |
| For passwords | ✅ | ❌ |

## SAST vs DAST vs SCA
| | Scans | When |
|---|---|---|
| SAST | source code | while building |
| DAST | the running app | in test environments |
| SCA | dependencies | on every build |

## RBAC vs ABAC
| | RBAC | ABAC |
|---|---|---|
| Decides by | roles | attributes (user, resource, time) |
| Flexibility | simpler | finer-grained |

## Session cookie vs JWT
| | Session cookie | JWT |
|---|---|---|
| Server state | ✅ | ❌ |
| Revoke instantly | ✅ | ❌ |

## Encryption in transit vs at rest
| | In transit | At rest |
|---|---|---|
| Protects | data moving on the network | stored data |
| Tool | TLS | disk/DB encryption, KMS |
