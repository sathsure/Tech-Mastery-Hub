# Spring Security — Quick Traps

> Tricky spots interviewers love: what goes wrong, a tiny example, and the right answer.

### 1. 401 vs 403
- ❌ Returning 401 for "you're not an admin".
- ✅ 401 = not logged in; 403 = logged in but not allowed.

### 2. Disabling CSRF everywhere
- ❌ `csrf.disable()` on a cookie/session web app.
- ✅ Safe to disable only for stateless APIs using bearer tokens. Cookie apps need CSRF protection.

### 3. `hasRole` adds a prefix
- ❌ `hasRole("ROLE_ADMIN")` → looks for `ROLE_ROLE_ADMIN`.
- ✅ `hasRole("ADMIN")`, or `hasAuthority("ROLE_ADMIN")`.

### 4. `@PreAuthorize` does nothing
- ❌ Annotation added, no effect.
- ✅ Add `@EnableMethodSecurity`. (And internal calls in the same class skip it — proxy again.)

### 5. Secrets inside JWTs
- ❌ Putting a password or card number in the payload.
- ✅ JWTs are only Base64-encoded; anyone can read them. Put just ids and roles.

### 6. JWTs can't be "logged out"
- ❌ Expecting a JWT to stop working after logout.
- ✅ It's valid until it expires. Use short expiry + refresh tokens, or a deny-list.

### 7. Rule order
- ❌ `.anyRequest().authenticated()` before `.requestMatchers("/public/**").permitAll()` → error/unexpected rules.
- ✅ Specific rules first, `anyRequest()` last.

### 8. Custom filter in the wrong place
- ❌ JWT filter added after authorization has already run.
- ✅ `addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)`.

### 9. Weak password hashing
- ❌ `MD5` or plain `SHA-256` for passwords.
- ✅ `BCryptPasswordEncoder` or Argon2.

### 10. CORS errors after adding security
- ❌ CORS set up in MVC only → preflight `OPTIONS` blocked by security.
- ✅ Enable `http.cors(...)` so the security chain uses your CORS config.
