# Web Security (OWASP) — Quick Traps

> Tricky spots interviewers love: what goes wrong, a tiny example, and the right answer.

### 1. Front-end validation is security
- ❌ "The form doesn't allow it, so we're safe."
- ✅ Attackers call the API directly. Validate on the server.

### 2. HTTPS stops all attacks
- ❌ "We use HTTPS, so XSS and SQL injection can't happen."
- ✅ HTTPS only protects data in transit.

### 3. Escaping input
- ❌ Replacing `'` with `''` to stop SQL injection.
- ✅ Use parameterized queries. Hand-made escaping misses cases.

### 4. Base64 is encryption
- ❌ "The token is encoded, so it's secret."
- ✅ Base64 is reversible by anyone. JWT payloads are readable.

### 5. Fast hashes for passwords
- ❌ `SHA-256(password)`.
- ✅ Fast hashes are easy to brute-force. Use bcrypt or Argon2.

### 6. Hiding the button
- ❌ Hiding "Delete" from normal users in the UI.
- ✅ The API must also check the role (broken access control).

### 7. Trusting the record id
- ❌ `GET /invoices/1002` returns any invoice (IDOR).
- ✅ Check the logged-in user owns invoice 1002.

### 8. Different login error messages
- ❌ "No such user" vs "Wrong password".
- ✅ One message ("Invalid email or password") so attackers can't find valid accounts.

### 9. CORS `*` with credentials
- ❌ `Access-Control-Allow-Origin: *` on an API using cookies.
- ✅ Allow only your real frontend origins.

### 10. Removing a leaked key from Git
- ❌ Deleting the line and committing.
- ✅ It's still in history and may be copied already. Rotate the key first.

### 11. Detailed error pages
- ❌ Returning stack traces to users.
- ✅ Log details on the server; show a generic message.
