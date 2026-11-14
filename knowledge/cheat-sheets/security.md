# Web Security (OWASP) — Cheat Sheet

> **In one line:** never trust input from outside; know the common attacks and the standard fix for each.

## OWASP Top 10 (the common reference list)
1. **Broken access control** — users reach data that isn't theirs. *Fix:* check permission on the server for every request.
2. **Cryptographic failures** — data sent or stored without proper encryption. *Fix:* HTTPS, strong algorithms, encrypt sensitive data.
3. **Injection** — input is run as code (SQL, commands). *Fix:* parameterized queries, input validation.
4. **Insecure design** — security missing from the plan. *Fix:* threat modelling, secure patterns.
5. **Security misconfiguration** — default passwords, debug mode on. *Fix:* hardened settings.
6. **Vulnerable components** — old libraries with known holes. *Fix:* scan and update dependencies.
7. **Authentication failures** — weak logins, no rate limit. *Fix:* MFA, lockouts, secure sessions.
8. **Integrity failures** — untrusted updates or pipelines. *Fix:* signed builds, trusted CI.
9. **Logging & monitoring failures** — attacks go unnoticed. *Fix:* log security events and alert.
10. **SSRF** — the server is tricked into calling internal URLs. *Fix:* allow-list destinations.

## SQL injection
```java
// ❌ the input becomes part of the SQL
"SELECT * FROM users WHERE email = '" + email + "'"

// ✅ the input is only data
PreparedStatement ps = conn.prepareStatement("SELECT * FROM users WHERE email = ?");
ps.setString(1, email);
```

## XSS (Cross-Site Scripting)
- An attacker's script runs in another user's browser (steals sessions, acts as them).
- Types: **stored** (saved in the DB), **reflected** (in the URL), **DOM-based** (front-end code inserts it).
- *Fix:* escape output (frameworks do it by default), avoid `innerHTML`, sanitize HTML, add a **Content Security Policy**.

## CSRF (Cross-Site Request Forgery)
- Another site makes your browser send a request with your cookies.
- *Fix:* `SameSite` cookies, CSRF tokens. Not an issue for APIs that use bearer tokens instead of cookies.

## Passwords & logins
- Store passwords with **bcrypt** or **Argon2** (slow and salted). Never plain text, MD5 or SHA-1.
- MFA, rate limits, the same error for wrong user or password, safe password-reset links (one-time, expiring).
- Sessions: new session id after login, `HttpOnly` + `Secure` + `SameSite` cookies.
- JWT: check signature and expiry, keep tokens short-lived, no secrets inside.

## Authentication vs authorization
- **Authentication** — who are you?
- **Authorization** — what are you allowed to do?
- Deny by default; always check on the server; check the user owns the record they ask for.

## Security headers
- `Content-Security-Policy` — which scripts may run (stops XSS).
- `Strict-Transport-Security` — always use HTTPS.
- `X-Content-Type-Options: nosniff` — don't guess file types.
- `X-Frame-Options` / `frame-ancestors` — stop clickjacking.

## Secrets & data
- Keep secrets in a vault or secrets manager, never in code or Git.
- Encrypt **in transit** (TLS) and **at rest**.
- **Encoding** (Base64) — anyone can reverse it. **Encryption** — needs a key. **Hashing** — one-way.

## Other attacks to name
Clickjacking · open redirect · path traversal (`../../etc/passwd`) · insecure deserialization · brute force / credential stuffing · DDoS · man-in-the-middle · mass assignment (sending `isAdmin=true`).

## Security in the pipeline (DevSecOps)
**SAST** (scan code) · **DAST** (scan the running app, e.g. OWASP ZAP) · **SCA** (scan dependencies) · secret scanning · container scanning · threat modelling (STRIDE).
