## Spring Security

### ❓ What is Spring Security and why do we need it??

### 📝 Answer

**Spring Security** is a **framework that handles authentication, authorization, and protection against security vulnerabilities** in Spring-based applications.

Without Spring Security:

- We would manually write login logic
- We would manually protect URLs
- We might forget edge cases like CSRF, session fixation, etc.

Spring Security solves this using **filters**, **contexts**, and **standard security patterns**.

---

### ❓ Explain authentication vs authorization with a real example.

### 📝 Answer

- **Authentication** answers: _Who are you?_
- **Authorization** answers: _What are you allowed to do?_

**Example:**

- Logging in with username/password → Authentication
- Accessing `/admin/deleteUser` → Authorization

👉 Authentication happens **before** authorization.

🤔❓ Can authorization happen without authentication?

❌ **No.**
Authorization **always depends on authentication**.

Spring Security **never checks permissions for an anonymous user unless explicitly allowed** (`permitAll()`).

🤔❓ What happens when we add `spring-boot-starter-security`?

Spring Security automatically:

- Secures all endpoints
- Creates a default login page
- Creates a default user
- Prints a generated password in logs

This is called **auto-configuration**.

---

### ❓ Explain Spring Security architecture.

### 📝 Answer

Spring Security works using a **Filter Chain**.

1. HTTP request enters application
2. Goes through **Security Filters**
3. Authentication is performed
4. Authorization decision is made
5. Request allowed or rejected

Each filter has **one responsibility**.

🤔❓ What is SecurityFilterChain?

It defines **how requests are secured**:

- Which URLs are protected
- Which authentication method is used
- Which filters are enabled

```java
@Bean
SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.authorizeHttpRequests(auth -> auth.anyRequest().authenticated())
        .formLogin();
    return http.build();
}
```

🤔❓ Why do we need PasswordEncoder?

Because:

- Plain text passwords are insecure
- Hashing prevents password leaks
- BCrypt adds **salt + adaptive hashing**

```java
@Bean
PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

---

### ❓ Difference between Roles and Authorities in Spring Security?

- **Role** → High-level permission (coarse-grained)
- **Authority** → Low-level permission (fine-grained)

```java
hasRole("ADMIN")        // Automatically becomes ROLE_ADMIN
hasAuthority("DELETE_USER")
```

🤔❓ Can a user have authorities without roles?

✅ **Yes**
Spring Security doesn’t require roles at all.

---

### ❓ Explain JWT authentication flow.

### 📝 Answer

🔐 First Understand the Big Picture

When a user logs in:

👉 Backend verifies username/password
👉 Backend generates **2 tokens**

- Access Token (short life)
- Refresh Token (long life)

Access Token and Refresh Token are two JWTs used for different purposes.

Think like this:

- 🪪 **Access token = Entry ticket**
- 🔑 **Refresh token = Ticket renewal pass**

1️⃣ When user logs in, We send both access & refresh token

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

- Purpose of Access Token is to access protected APIs.

Every API request sends:

```
Authorization: Bearer <access_token>
```

⏳ Access Token Life: Short-lived (5–15 minutes usually)

- Purpose of Refresh Token to generate a new access token without asking user to login again.

It is like:

> “Hey server, my entry ticket expired, but I still have renewal pass.”

⏳ Refresh Token Life: Long-lived (7 days usually)

🔄 Refresh Flow:

```
Frontend → /refresh API → Send refresh token
Backend validates refresh token
Backend generates new access token
Backend sends new access token
```

```json
{
  "accessToken": "new_access_token_here"
}
```

🤔❓ Structure of JWT

JWT = **JSON Web Token**

It has 3 parts:

```
HEADER (algorithm)
+
PAYLOAD (user data)
+
SIGNATURE (security)
```

Each part is Base64 encoded.

1️⃣ Header

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

2️⃣ Payload

```json
{
  "sub": "dev",
  "role": "USER",
  "iat": 1707000000,
  "exp": 1707000600
}
```

3️⃣ Signature

```
HMACSHA256(
   base64UrlEncode(header) + "." +
   base64UrlEncode(payload),
   secret_key
)
```

🤔❓ How to Generate Access Token?

```java
public String generateAccessToken(String username) {
    return Jwts.builder()
            .setSubject(username)
            .claim("role", "USER")
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 10)) // 10 mins
            .signWith(SignatureAlgorithm.HS256, "mySecretKey")
            .compact();
}
```

🤔❓ How to Generate Refresh Token?

```java
public String generateRefreshToken(String username) {
    return Jwts.builder()
            .setSubject(username)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24 * 7)) // 7 days
            .signWith(SignatureAlgorithm.HS256, "mySecretKey")
            .compact();
}
```

🤔❓ What happens when Access Token expires?

Backend will return:

```
401 Unauthorized
```

Frontend then:

1. Detects 401
2. Calls **Refresh API (/refresh)**
3. Backend validates refresh token and generates new access token and send to Frontend
4. Retries original API

User does NOT see logout.

🤔❓ What if Refresh Token expires?

Then user must login again.

Backend returns:

```
403 Forbidden
```

Frontend:
👉 Clears tokens
👉 Redirects to Login page

🤔❓ Where should tokens be stored?

✅ Access Token

- Store in **memory (variable)**
- Or in **HttpOnly cookie**

Not recommended:

- ❌ localStorage (XSS risk)

✅ Refresh Token

- Store in **HttpOnly Secure Cookie**

🤔❓ Why store refresh token in HttpOnly cookie and Access Token in Memory? Why not in localstorage or sessionstorage?

🔐 First Understand the Risk: XSS

XSS = Cross Site Scripting attack

If attacker injects JavaScript into your app, they can read:

```js
localStorage.getItem("token");
sessionStorage.getItem("token");
```

So anything stored there can be stolen.

⚡ Access Token in memory

- Not stored permanently
- Disappears on refresh
- Harder to steal
- Not accessible after page reload

If attacker injects script: They can only steal it while page is active.

Limited exposure.

⚡ Refresh Token in HttpOnly Cookie

- ❌ Cannot be accessed by JavaScript
- ❌ Cannot be read via localStorage
- Automatically sent by browser
- Secure + SameSite options available

🤔❓ Why NOT store both in cookies?

If Access Token is also in cookie:

- It is auto-sent with every request
- **Increases CSRF attack**

🤔❓ What is CSRF?

**CSRF (Cross-Site Request Forgery)** is an attack where a malicious website tricks a logged-in user’s browser into sending an unwanted request to another site.

CSRF happens when:

- User is already authenticated
- Browser automatically sends cookies
- Attacker triggers a state-changing request (POST/PUT/DELETE)

Because **cookies are automatically sent by the browser**, even if the request was triggered from another website.

**Authorization headers (Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9)** are not automatically sent, so they reduce CSRF risk.

🤔❓ When Can We Disable CSRF in Spring?

If your API is:

- Stateless (The server does NOT store any user session data between requests)
- Uses JWT in Authorization header

```java
http.csrf(csrf -> csrf.disable());
```

---

### ❓ CORS vs CSRF vs OAuth2 vs JWT?

### 📝 Answer

- **CORS** is a **browser security mechanism** that controls _which origins can call your API_
- **CSRF** is an **attack** that exploits _authenticated users via cookies_
- **OAuth2** is an **authorization framework**
- **JWT** is a **token format**

🔹 CORS (Cross-Origin Resource Sharing)

A **browser-enforced rule** that prevents JavaScript on one origin from calling another origin **unless explicitly allowed**.

**Key point:**
👉 CORS is **not a Spring Security feature**
👉 It is enforced by the **browser**, not the backend

**Example:**

```text
Frontend: http://localhost:3000
Backend:  http://api.company.com
```

Browser blocks the request unless backend allows it.

🔹 OAuth2 Explained

**OAuth2 is about delegation of access**

**Example:**

> Let Google authenticate the user, but let _my app_ access their profile.

OAuth2 defines:

- Authorization flows
- Tokens
- Roles of participants

🔹 JWT Explained

**JWT (JSON Web Token)** is:

- A compact token format
- Self-contained
- Signed (and sometimes encrypted)

```java
@Configuration
@EnableWebSecurity // Enables Spring Security for web (HTTP) requests
public class SecurityConfig {

    // 1️⃣ API SECURITY (Access Token - JWT - Stateless)
    @Bean
    @Order(1)
    SecurityFilterChain apiSecurityChain(HttpSecurity http) throws Exception {

        http
            .securityMatcher("/api/**")

            // CORS needed for browser-based APIs
            .cors(cors -> {})

            // JWT in header → no CSRF needed
            .csrf(csrf -> csrf.disable())

            // Stateless
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // Authorization
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )

            // JWT validation
            .oauth2ResourceServer(oauth2 -> oauth2.jwt());

        return http.build();
    }

    // 2️⃣ AUTH SECURITY (Refresh Token - Cookie - CSRF Protected)
    @Bean
    @Order(2)
    SecurityFilterChain authSecurityChain(HttpSecurity http) throws Exception {

        http
            .securityMatcher("/auth/**")

            // CORS often still needed
            .cors(cors -> {})

            // Cookie-based refresh → CSRF REQUIRED
            .csrf(csrf -> csrf.enable())

            // Usually no session, but IF_REQUIRED is ok
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            )

            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/login", "/auth/refresh").permitAll()
                .anyRequest().authenticated()
            )

            // Optional: OAuth2 login (Google, GitHub, etc.)
            .oauth2Login();

        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() { // Automatically gets called by .cors(cors -> {})
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET","POST","PUT","DELETE"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
```

🤔❓ _Why `@Order` matters?_

- Spring Security checks filter chains in order.
- More specific (`/api/**`) must come first.

🤔❓ What happens when we call `.cors(cors -> {})`?

Spring Security automatically looks for a `CorsConfigurationSource` bean in the application context and wires it into the `CorsFilter`

🤔❓ _Does Spring MVC CORS config also work here?_

Spring Security **runs before MVC**, so:

- Security CORS config takes precedence
- **MVC `@CrossOrigin` may be ignored**

🤔❓ _Is `csrf(csrf -> csrf.disable())` enabled by default?_

Yes. **CSRF protection is enabled by default** in Spring Security for web applications.
When you add Spring Security:

- CSRF protection is **ON by default**
- Applies to **state-changing HTTP methods** (POST, PUT, DELETE, PATCH)
- Uses a CSRF token **stored in session or cookie**

🤔❓ _Why CSRF is not needed for JWT?_

CSRF protection is not needed for JWT because **JWT is not automatically sent by the browser**.

CSRF exploits **cookie-based authentication**:

- User logs into a site
- Browser stores session cookie
- **Browser automatically sends cookies with every request**
- Malicious site triggers a request
- Cookie is sent → request is authenticated

With JWT authentication:

- Token is stored in client-side memory (E.g `useState`, `NgRx`) or localstorage, sessionStorage
- Not stored in cookies
- Explicitly sent in headers

🤔❓ _Even JWT refresh token might need help from cookie and CSRF to protect, correct?_

✅ Correct

- Refresh tokens are often stored in **HttpOnly cookies**
- Cookies are automatically sent by the browser
- That reintroduces CSRF risk
- So CSRF protection is required

Access Token - Sent via `Authorization` header, Not automatically sent by the browser, **No CSRF Protection**
Refresh Token - Automatically sent by the browser, **CSRF protection IS needed**

🤔❓ _Why Access Token in Header and Refresh Token in Cookie?_

You must balance two threats:

- ❌ XSS (JavaScript stealing tokens)
- ❌ CSRF (browser auto-sending credentials)

| Endpoint type | Auth mechanism   | CSRF          | Session      |
| ------------- | ---------------- | ------------- | ------------ |
| `/api/**`     | JWT (header)     | ❌ Not needed | ❌ Stateless |
| `/auth/**`    | Cookie (refresh) | ✅ Required   | ⚠️ Minimal   |

> You **cannot eliminate both completely** — you minimize damage.

🤔❓ _What SessionCreationPolicy Actually Controls?_

**SessionCreationPolicy** tells Spring Security:

> Should I create / use an **HTTP session** to store authentication?

- `IF_REQUIRED` allows Spring Security to **create and use an HTTP session**, which is typical for stateful authentication.
- `STATELESS` disables server-side session storage, which is commonly used with **JWT-based authentication**.

🤔❓ _Is OAuth2 authentication or authorization?_

👉 **Authorization framework**

---

### ❓ Filters vs Interceptors

### 📝 Answer

🔹 Spring Security **Filters**

- Part of **Servlet container**
- Execute **before the request reaches the Controller**
- Used for **authentication & authorization**
- Spring Security works **mainly using filters**

📌 Examples:

- `UsernamePasswordAuthenticationFilter`
- `JwtAuthenticationFilter`

🔹 Spring MVC **Interceptors**

- Part of **Spring MVC**
- Execute **after filter, before controller method**
- Used for **logging, auditing, request modification**
- **NOT** used for security

🔁 Execution Flow

```
Client → Filters → Interceptors → Controller
```

✅ Simple Comparison Table

| Feature                | Filter  | Interceptor |
| ---------------------- | ------- | ----------- |
| Layer                  | Servlet | Spring MVC  |
| Runs before Controller | ✅      | ✅          |
| Can block request      | ✅      | ❌ (mostly) |
| Used for Security      | ✅      | ❌          |
| Spring Security uses   | Filters | ❌          |

> **Spring Security uses Filters because security must be applied before request reaches the controller.**

---

### ❓ How Role-Based Access is Implemented in Spring Security

### 📝 Answer

🔹 Concept

- Users are assigned **roles** (ADMIN, USER)
- Roles are checked **before allowing access**

🔹 Role vs Authority

- `ROLE_ADMIN` → internally treated as **authority**
- `hasRole("ADMIN")` → checks `ROLE_ADMIN`

✅ Method-Level Security (Most Asked)

```java
@PreAuthorize("hasRole('ADMIN')")
@GetMapping("/admin")
public String adminOnly() {
    return "Admin Access";
}
```

✅ URL-Based Security

```java
@Bean
SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/admin/**").hasRole("ADMIN")
            .requestMatchers("/user/**").hasAnyRole("USER", "ADMIN")
            .anyRequest().authenticated()
        )
        .httpBasic();
    return http.build();
}
```

---

### ❓ What is SAML?

### 📝 Answer

**SAML (Security Assertion Markup Language)** is an **XML-based authentication protocol** used for **Single Sign-On (SSO)**.

📌 Example:

> Login once → Access Gmail, Jira, Confluence without logging in again

🔹 How SAML Works (Simple Flow)

1. User tries to access App
2. App redirects to **Identity Provider (IdP)** (like Okta)
3. User logs in
4. IdP sends **SAML Assertion (XML)**
5. App trusts it → Login success

🔹 Why SAML?

- Used in **Enterprise applications**
- Works well with **legacy systems**
- Browser-based SSO

---

### ❓ SAML vs JWT

### 📝 Answer

| Feature         | SAML             | JWT         |
| --------------- | ---------------- | ----------- |
| Format          | XML              | JSON        |
| Size            | Large            | Small       |
| Transport       | Browser Redirect | HTTP Header |
| Common Use      | Enterprise SSO   | REST APIs   |
| Mobile Friendly | ❌               | ✅          |
| Complexity      | High             | Low         |

> **SAML is XML-based and heavy, JWT is lightweight and ideal for APIs.**

---

### ❓ SAML vs OAuth vs OIDC

### 📝 Answer

🔹 OAuth 2.0

- **Authorization protocol**
- Allows apps to access user data
- Does **NOT authenticate users**

📌 Example:

> Allow this app to access your Google Drive

🔹 OpenID Connect (OIDC)

- Built **on top of OAuth**
- Used for **Authentication**
- Returns **ID Token (JWT)**

📌 Example:

> Login with Google

🔹 SAML

- Older SSO protocol
- XML-based
- Mostly enterprise usage

✅ Comparison Table

| Feature        | SAML           | OAuth         | OIDC           |
| -------------- | -------------- | ------------- | -------------- |
| Purpose        | Authentication | Authorization | Authentication |
| Token Type     | XML Assertion  | Access Token  | ID Token (JWT) |
| Modern APIs    | ❌             | ✅            | ✅             |
| Mobile Support | ❌             | ✅            | ✅             |
| Best For       | Enterprise SSO | API Access    | Login / SSO    |
