# Web Security (OWASP) — One-liners

> The most asked questions, each answered in one sentence.

1. **What is the OWASP Top 10?** — A list of the most critical web application security risks.
2. **What is SQL injection?** — Attacker input that becomes part of a SQL query.
3. **How do you prevent SQL injection?** — Use parameterized queries or prepared statements.
4. **What is XSS?** — Injecting a script that runs in other users' browsers.
5. **How do you prevent XSS?** — Escape output, avoid raw HTML insertion, sanitize HTML and use a Content Security Policy.
6. **What is CSRF?** — Tricking a logged-in user's browser into sending an unwanted request.
7. **How do you prevent CSRF?** — `SameSite` cookies and CSRF tokens.
8. **What is broken access control?** — Users can reach data or actions they shouldn't.
9. **What is IDOR?** — Accessing another user's data by changing an id in the request.
10. **What is SSRF?** — Tricking the server into calling a URL the attacker chooses, often internal.
11. **Hashing vs encryption vs encoding?** — Hashing is one-way, encryption is reversible with a key, encoding is reversible by anyone.
12. **How should passwords be stored?** — Hashed with a slow, salted algorithm like bcrypt or Argon2.
13. **What is a salt?** — Random data added to a password before hashing so equal passwords hash differently.
14. **What is MFA?** — Requiring two or more kinds of proof to log in.
15. **What does HSTS do?** — Forces browsers to use HTTPS for the site.
16. **What is clickjacking?** — Hiding a real page in an invisible frame to trick clicks.
17. **What is credential stuffing?** — Trying leaked username/password pairs on another site.
18. **What is SAST vs DAST?** — SAST scans source code; DAST tests the running application.
19. **What is SCA?** — Scanning dependencies for known vulnerabilities.
20. **What is the principle of least privilege?** — Give each user or service only the access it needs.
