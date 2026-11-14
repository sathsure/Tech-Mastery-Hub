# Spring Security — One-liners

> The most asked questions, each answered in one sentence.

1. **Authentication vs authorization?** — Authentication checks who you are; authorization checks what you may do.
2. **How does Spring Security work?** — A chain of servlet filters checks every request before it reaches the controller.
3. **What is `SecurityFilterChain`?** — The bean where you configure the security rules (it replaced `WebSecurityConfigurerAdapter`).
4. **What is `UserDetailsService`?** — It loads a user's details (username, password, roles) for authentication.
5. **What is `PasswordEncoder` for?** — Hashing and checking passwords, usually with BCrypt.
6. **What is the `SecurityContext`?** — Where the logged-in user's details are stored for the current request.
7. **Role vs authority?** — A role is an authority with the `ROLE_` prefix; authorities can be fine-grained permissions.
8. **What does `@PreAuthorize` do?** — It checks a security rule before a method runs (needs `@EnableMethodSecurity`).
9. **What is a JWT?** — A signed token holding user claims, sent as `Authorization: Bearer <token>`.
10. **Access token vs refresh token?** — The access token is short-lived and used on each call; the refresh token gets new access tokens.
11. **HS256 vs RS256?** — HS256 uses one shared secret; RS256 signs with a private key and verifies with a public key.
12. **What is OAuth2?** — A standard for letting an app access resources on a user's behalf using tokens.
13. **What is OIDC?** — A login layer on top of OAuth2 that adds an ID token with user identity.
14. **What is Authorization Code + PKCE?** — The secure OAuth2 flow for web and mobile apps.
15. **What is Client Credentials flow?** — OAuth2 for service-to-service calls with no user involved.
16. **What is CSRF?** — An attack where another site makes your browser send a request using your cookies.
17. **When can CSRF be disabled?** — For stateless APIs that use bearer tokens instead of cookies.
18. **What is CORS?** — Browser rules that control which other origins can call your API.
19. **401 vs 403?** — 401 means not authenticated; 403 means authenticated but not allowed.
20. **Why is the session STATELESS for JWT APIs?** — The token carries identity, so the server keeps no session.
