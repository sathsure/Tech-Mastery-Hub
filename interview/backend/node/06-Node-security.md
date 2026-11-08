## 🔐 AUTHENTICATION & AUTHORIZATION

### ❓ Can you clearly explain the difference between authentication and authorization, and how both are implemented in a real MEAN stack application?

### 📝 Answer

Authentication is the process of **verifying the identity of a user**.
It confirms that the user is genuinely who they claim to be, typically using credentials such as username/password, OTP, or OAuth tokens.

Authorization happens **after authentication** and determines **what actions or resources the authenticated user is allowed to access**.

In a real MEAN application:

- Authentication usually happens during login
- Authorization is checked on **every protected API call**

If authentication is implemented without proper authorization, any authenticated user could access sensitive endpoints, which is a major security flaw.

💡 Example

When a user logs in successfully, the backend knows:

> “This request belongs to user ID 42.”

Authorization then decides:

> “Is user ID 42 allowed to delete users or view admin data?”

💻 **Code Example**

```js
const jwt = require("jsonwebtoken");

// Authentication middleware: WHO are you? (verify the token)
function authenticate(req, res, next) {
  const token = req.cookies.access_token || req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "User not authenticated" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);   // checks signature and expiry
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// Authorization middleware: WHAT may you do? (check permissions)
function authorize(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
}

app.delete("/admin/user/:id", authenticate, authorize("admin"), handler);
```

#### ↳ Follow-up: When a user is authenticated, does that mean they are authorized?

No. Authentication only proves identity. Authorization is required to determine **what the authenticated user can do**. Both must exist together.

---

### ❓ Explain localStorage, sessionStorage, cookies, and server sessions. When should each be used?

### 📝 Answer

![Image](https://miro.medium.com/v2/resize%3Afit%3A1400/1%2A9ILLhR8WGAPflT9-KWNyew.png)

![Image](https://miro.medium.com/v2/resize%3Afit%3A1400/1%2AfKkGXyI5_Dg4dSslgozsoA.png)

![Image](https://assets.bytebytego.com/diagrams/0154-cookies-vs-session.png)

**localStorage** stores data permanently in the browser and is accessible through JavaScript. It should never store sensitive data because it is vulnerable to XSS attacks.

**sessionStorage** is similar but scoped to a single browser tab and cleared when the tab is closed. It still suffers from XSS vulnerabilities.

**Cookies** are automatically sent with every HTTP request. When marked as HTTP-only, they are inaccessible to JavaScript, which improves security. However, cookies are vulnerable to CSRF if not protected.

**Server sessions** store data on the backend and send only a session ID to the browser. This is the most secure option but requires proper scaling using Redis or a shared store.

#### ↳ Follow-up: Why not store JWT in localStorage since it is easy?

Storing JWT in localStorage exposes it to XSS attacks. Any injected script can steal the token and impersonate the user. For production systems, JWT should be stored in HTTP-only cookies.

---

### ❓ Is JWT secure? Many people say JWT is insecure.

### 📝 Answer

![Image](https://assets.bytebytego.com/diagrams/0152-cookies-session-jwt.png)

![Image](https://assets.bytebytego.com/diagrams/0155-cookies-vs-sessions-vs-jwt-vs-paseto.png)

JWT itself is not insecure. It is simply a signed token format.
Security problems arise from **how and where the token is stored**.

JWT stored in:

- localStorage → vulnerable to XSS
- sessionStorage → vulnerable to XSS
- HTTP-only cookies → significantly safer

The most secure modern approach is:

> JWT stored in HTTP-only, secure cookies with CSRF protection

This provides:

- Stateless authentication
- XSS protection
- Controlled CSRF defense

#### ↳ Follow-up: Does using JWT authentication completely eliminate the need for CSRF protection?

JWT is immune to CSRF **only when it is not stored in cookies**.
If JWT is stored in cookies, CSRF protection is still required.

---

### ❓ Explain the complete JWT authentication flow including refresh tokens.

### 📝 Answer

![Image](https://bezkoder.com/wp-content/uploads/2021/04/spring-boot-refresh-token-jwt-example-flow.png)

![Image](https://images.ctfassets.net/xqb1f63q68s1/4seIYPJdWX8xWwrDHKvOvp/a26eaa2fc2ecddb43ae1a45d8f16fcc9/JWT_storage_image.png)

1. User submits login credentials
2. Server validates credentials
3. Server issues a short-lived access token
4. Server issues a long-lived refresh token
5. Access token is used for API calls
6. When access token expires, client requests new token
7. Refresh token is validated
8. New access token is issued
9. Refresh token is rotated for security (the old one stops working; reuse of an old one signals theft → revoke the whole session)

Typical lifetimes: access token 5–15 minutes, refresh token days to weeks. Keep the refresh token in an **HttpOnly, Secure cookie** limited to the refresh path, and store it (or its hash) on the server so it can be revoked. See the JWT access & refresh token notes for the full sequence diagram.

---

### ❓ Explain CSRF with a real example and how you protect against it.

### 📝 Answer

![Image](https://supertokens.com/static/921e703a29cdd46983749a195f4a811e/fe238/csrf-diagram.png)

![Image](https://cdn.prod.website-files.com/5ff66329429d880392f6cba2/6447a042dbde2b3f1abe8855_647%20Preview.jpg)

CSRF occurs when a malicious website tricks a logged-in user's browser into sending a request to a trusted site. Since cookies are automatically included, the server cannot distinguish between legitimate and forged requests.

**Real example:** you're logged in to `bank.com`. You open `evil.com`, which contains:

```html
<form action="https://bank.com/transfer" method="POST">
  <input name="to" value="attacker" /><input name="amount" value="50000" />
</form>
<script>document.forms[0].submit()</script>
```

Your browser sends your `bank.com` cookie with it — the bank sees a valid session.

**Protection (use more than one):**

1. **`SameSite=Lax` or `Strict` cookies** — the browser doesn't send the cookie on cross-site POSTs. Modern browsers default to `Lax`.
2. **CSRF token** — a random value the page must send back in a header or form field; `evil.com` can't read it.
3. Check the `Origin` header on state-changing requests.
4. Never change data with `GET`.

```js
// Double-submit token with the maintained csrf-csrf package
const { doubleCsrf } = require("csrf-csrf");
const { doubleCsrfProtection, generateCsrfToken } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET,
  getSessionIdentifier: (req) => req.cookies.sid ?? "",
});
app.get("/csrf-token", (req, res) => res.json({ token: generateCsrfToken(req, res) }));
app.use(doubleCsrfProtection);   // POST/PUT/DELETE must send the token in the x-csrf-token header
```

> ⚠️ The old `csurf` package is **deprecated and archived** — don't use it in new code.

---

### ❓ Explain XSS and why it is considered one of the most dangerous web vulnerabilities.

### 📝 Answer

![Image](https://www.imperva.com/learn/wp-content/uploads/sites/13/2019/01/sorted-XSS.png)

![Image](https://www.inspectiv.com/hs-fs/hubfs/Inspectiv_December2022/images/61cccea250b8fe03e2c3aec2_Screen-Shot-2021-05-19-at-7.52.57-AM.png?height=374&name=61cccea250b8fe03e2c3aec2_Screen-Shot-2021-05-19-at-7.52.57-AM.png&width=547)

XSS allows attackers to execute arbitrary JavaScript in a victim’s browser. This can lead to:

- Session hijacking
- Token theft
- Unauthorized actions
- Malware injection

❌ **Vulnerable Code**

```js
element.innerHTML = userInput;
```

✅ **Secure Code**

```js
element.textContent = userInput;   // treated as text, never as HTML
```

**Three types:**

- **Stored** — the script is saved in the database (a comment) and served to every visitor.
- **Reflected** — the script is in a URL parameter and echoed back in the page.
- **DOM-based** — frontend code puts URL or user data into the page unsafely (`innerHTML`, `eval`).

**Prevention:**

- Let the framework escape output (React `{value}`, Angular `{{ value }}`); avoid `dangerouslySetInnerHTML` / `bypassSecurityTrust…` unless sanitized (DOMPurify).
- Validate input on the server and encode output for its context (HTML, attribute, URL).
- Add a **Content-Security-Policy** header (Helmet) so injected inline scripts don't run.
- Keep tokens in **HttpOnly** cookies so a successful XSS can't read them.

---

### ❓ What is CORS and why is it not real backend security?

### 📝 Answer

![Image](https://drek4537l1klr.cloudfront.net/hossain/Figures/04fig18_alt.jpg)

![Image](https://portswigger.net/web-security/images/attack-on-cors.svg)

CORS is a browser-enforced mechanism that restricts cross-origin HTTP requests.
It does not protect APIs from direct attacks such as Postman or curl.
Backend security must rely on authentication and authorization, not CORS alone.

---

### ❓ Explain hashing, salting, and peppering in password security.

### 📝 Answer

- **Hashing** turns a password into a fixed value that can't be reversed. Use a **slow** password hash — **bcrypt**, **Argon2** or **scrypt** — never fast hashes like MD5 or SHA-256, which attackers can try billions of times per second.
- **Salting** adds a unique random value per password, so two users with the same password get different hashes and precomputed (rainbow) tables don't work. bcrypt/Argon2 generate and store the salt for you.
- **Peppering** adds one secret value kept **outside the database** (env/vault), so a stolen database alone isn't enough to crack hashes.

```js
const crypto = require("crypto");
const bcrypt = require("bcrypt");

// Apply the pepper with an HMAC first: bcrypt only uses the first 72 bytes of its input
const peppered = crypto.createHmac("sha256", process.env.PEPPER).update(password).digest("base64");
const hash = await bcrypt.hash(peppered, 12);            // 12 = cost factor (2^12 rounds)

// Login
const ok = await bcrypt.compare(peppered, storedHash);
```

---

### ❓ Is storing secrets in .env file safe in production?

### 📝 Answer

No. Environment files can leak through logs, container images, or CI pipelines.
Secrets should be managed using secure vault services such as AWS Secrets Manager or HashiCorp Vault.

---

### ❓ How do you secure authentication systems?

### 📝 Answer

- **HTTPOnly Cookies** prevent JavaScript access to tokens.
- **SameSite Cookies** protect against CSRF attacks.
- **CSRF Tokens** validate request origin.
- **Helmet** secures HTTP headers.
- **Rate Limiting** prevents brute-force attacks.
- **Password Hashing** ensures passwords are never stored in plaintext.
- **Salting** prevents rainbow table attacks.
- **Peppering** adds an application-level secret.
- **MFA / 2FA / OTP / TOTP** add extra verification layers.
- **RBAC, ABAC, PBAC** control access based on roles, attributes, or policies.
- **Nonce usage** prevents replay attacks.
- **Token expiration handling** ensures old tokens are invalidated properly.
- **API Keys & Basic Auth** are used for machine-to-machine communication.

![Image](/src/assets/nodejs-authorization-flow.png)

![Image](/src/assets/nodejs-csrftoken.png)
