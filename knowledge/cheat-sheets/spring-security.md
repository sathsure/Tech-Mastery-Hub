# Spring Security — Cheat Sheet

> **In one line:** a chain of filters that checks *who you are* (authentication) and *what you may do* (authorization) before a request reaches your controller.

## How a request is checked
1. Request enters the **security filter chain**.
2. A filter reads the credentials (password, JWT, session cookie).
3. **AuthenticationManager** asks a provider to verify them; **UserDetailsService** loads the user; **PasswordEncoder** checks the password.
4. On success the user is stored in the **SecurityContext** for this request.
5. Authorization rules decide if the user may access the URL or method.

## Modern config (Spring Security 6)
```java
@Bean
SecurityFilterChain api(HttpSecurity http) throws Exception {
  return http
    .csrf(csrf -> csrf.disable())                 // OK for token-only APIs
    .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
    .authorizeHttpRequests(auth -> auth
      .requestMatchers("/auth/**").permitAll()
      .requestMatchers("/admin/**").hasRole("ADMIN")
      .anyRequest().authenticated())
    .oauth2ResourceServer(o -> o.jwt(Customizer.withDefaults()))
    .build();
}
@Bean PasswordEncoder encoder() { return new BCryptPasswordEncoder(); }
```
- `WebSecurityConfigurerAdapter` is gone — define `SecurityFilterChain` beans.

## Ways to log in
- **Form login** — username/password, then a session cookie.
- **HTTP Basic** — credentials on every request (simple tools).
- **JWT** — a signed token on every request; no server session.
- **OAuth2 / OIDC** — log in with Google, Keycloak, Okta…

## Authorization
- URL rules: `hasRole("ADMIN")`, `hasAuthority("order:read")`, `permitAll()`, `authenticated()`.
- Method rules: `@PreAuthorize("hasRole('ADMIN')")` (needs `@EnableMethodSecurity`).
- **Role vs authority** — a role is an authority starting with `ROLE_`.

## JWT in short
- Token = `header.payload.signature`. Signed (can't be changed), **not encrypted** (anyone can read it).
- Login → short **access token** (~15 min) + longer **refresh token**.
- Client sends `Authorization: Bearer <token>`; a filter checks signature and expiry.
- **HS256** — one shared secret. **RS256** — private key signs, public key verifies (better for many services).

## OAuth2 & OIDC
- **OAuth2** — lets an app act for you (access tokens). **OIDC** — adds login (ID token with user info).
- **Authorization Code + PKCE** — for web and mobile apps.
- **Client Credentials** — service-to-service, no user.

## CSRF & CORS
- **CSRF** — another site tricks your browser into sending your cookie. Keep protection on for cookie-based apps.
- **CORS** — browser rule for calls from another domain; allow your frontend's origin in config.

## Passwords
Hash with **BCrypt** or Argon2 (slow and salted). Never store plain text.

## 401 vs 403
- **401 Unauthorized** — not logged in / bad token.
- **403 Forbidden** — logged in, but not allowed.

## Testing
`@WithMockUser(roles = "ADMIN")`, MockMvc with `.with(jwt())` or `.with(csrf())`.
