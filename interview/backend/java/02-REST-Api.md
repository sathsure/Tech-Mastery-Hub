## 5️⃣ Exception Handling – Senior Strategy

### ❓ How do you design exception handling in large Java applications?

### 📝 Answer

1️⃣ **Layered Exceptions (Don’t leak low-level errors)**

Wrap technical exceptions into meaningful domain exceptions.

```java
try {
    orderRepository.save(order);
} catch (DataAccessException e) {
    throw new OrderPersistenceException("Unable to save order", e);
}
```

✔ Keeps DB details hidden
✔ Improves readability

2️⃣ **Custom Exceptions**

Create clear business exceptions.

```java
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
```

3️⃣ **Global Exception Handling (Centralized)**

Use `@RestControllerAdvice` to handle everything in one place.

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(404).body(ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneric(Exception ex) {
        return ResponseEntity.status(500).body("Internal Server Error");
    }
}
```

✔ Map proper HTTP status codes
✔ Never expose stack trace
✔ Log internally

---

### ❓ Checked vs unchecked exceptions – what is your strategy?

### 📝 Answer

**Checked exceptions**
Exceptions that the Java compiler checks at **compile time**.
If a method throws a checked exception, the programmer must either handle it using a **try-catch block** or declare it in the method signature using the `throws` keyword; otherwise, the code will not compile.

Examples: IOException, SQLException, FileNotFoundException, ClassNotFoundException.

```java
try {
    throw new Exception("Checked exception");
} catch (Exception e) {
    // must be handled
}

// or

void checkedMethod() throws Exception { // must be declared using throws
    throw new Exception("Checked exception");
}
```

**Unchecked exceptions**
Exceptions that occurs at **runtime**.
Examples: NullPointerException, ArrayIndexOutOfBoundsException, ArithmeticException (e.g., division by zero), and IllegalArgumentException

```java
void uncheckedMethod() {
    throw new RuntimeException("Unchecked exception");
    // any code here is NEVER executed
}
```

---

### ❓ Important HTTP Status Codes to Know

### 📝 Answer

**1xx – Informational**

- `100` Continue

**2xx – Success**

- `200` OK
- `201` Created
- `204` No Content

**3xx – Redirection**

- `301` Moved Permanently
- `302` Found
- `304` Not Modified

**4xx – Client Errors**

- `400` Bad Request
- `401` Unauthorized
- `403` Forbidden
- `404` Not Found
- `409` Conflict
- `429` Too Many Requests

**5xx – Server Errors**

- `500` Internal Server Error
- `502` Bad Gateway
- `503` Service Unavailable
- `504` Gateway Timeout

---

### ❓ If I replace GET with PUT, can I still fetch records?

### 📝 Answer

Technically yes — but **architecturally wrong**.

- `GET` → Used to **fetch** data (safe, idempotent)
- `PUT` → Used to **update/replace** data (idempotent but not safe)

If you replace:

```java
@GetMapping("/users")
```

with

```java
@PutMapping("/users")
```

You can still return data — but:

- Violates REST standards
- Caching won’t work correctly
- Proxies/CDN may block it
- Semantically incorrect

---

### ❓ Can we get Request Body in GET?

### 📝 Answer

🚫 Officially → GET should NOT have body.

HTTP spec doesn’t forbid it completely, but:

- Most servers ignore it
- Spring does not bind it by default
- Many proxies drop it

If you try:

```java
@GetMapping("/test")
public String test(@RequestBody User user)
```

You may get:

```
HttpMessageNotReadableException
```

👉 Proper way: Use query params:

```java
@GetMapping("/test")
public String test(@RequestParam String name)
```

---

### ❓ Without @Controller, can we receive API?

### 📝 Answer

Yes ✅

1.  Use `@RestController`

(Combination of `@Controller + @ResponseBody`)

2.  Functional Routing (Spring WebFlux)

```java
@Bean
RouterFunction<ServerResponse> route() {
   return RouterFunctions.route(GET("/hello"),
       req -> ServerResponse.ok().bodyValue("Hi"));
}
```

3.  Servlet (low level)

Implement `HttpServlet`.

👉 So yes — Controller is common way, but not only way.

---

### ❓ How do you implement global HTTP status handling in Spring Boot without setting the status code in each controller method?

### 📝 Answer

Use:

👉 `@ControllerAdvice`

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

   @ExceptionHandler(Exception.class)
   public ResponseEntity<String> handle(Exception ex) {
       return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
               .body("Error occurred");
   }
}
```

This avoids writing status in every controller.

---

---

# 🟢 ANGULAR ROUND

---

