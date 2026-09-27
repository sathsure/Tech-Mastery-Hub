## Major Java Features (9 → 21)

### ❓ What are the major java features introduced after 8?

### 📝 Answer

1️⃣ **Java Module System (Java 9)**

❌ Problems:

- Classpath hell (version conflicts, missing dependencies)
- No encapsulation (any public class accessible everywhere)
- Hard to scale large applications
- JDK itself was monolithic

✅ The Java Module System provides a way to organize Java code into `modules`. A module is a named, self-describing unit of code that:

- Contains packages
- Declares what it needs
- Declares what it exposes
- Each module has a `module-info.java` file.

**Rules**

- Every module **must have a unique name**
- Use `exports` to make packages visible
- Use `requires` to depend on other modules
- Unexported packages are **not accessible**

```java
/* Module: com.example.utils */

// module-info.java
module com.example.utils {
    exports com.example.utils;  // export the package
}

// MathUtil.java
package com.example.utils;

public class MathUtil {
    public static int add(int a, int b) {
        return a + b;
    }
}

/* Module: com.example.app */
// module-info.java
module com.example.app {
    requires com.example.utils;  // import the package
}

// Main.java
package com.example.app;

import com.example.utils.MathUtil; // works if package is exported and consuming module requires it

public class Main {
    public static void main(String[] args) {
        System.out.println(MathUtil.add(2, 3));
    }
}
```

- A **package** contains multiple classes (and interfaces, enums, etc.).
- A **module** contains multiple packages (and resources).

> **Public classes** are accessible **everywhere** on the classpath.
> In Java 9 named **modules**, access is **restricted** to exported packages only.

2️⃣ **Immutable Collection Factories (Java 9)**

Provide a simple, concise, and safe way to create **immutable collections** (List, Set, Map) using factory methods.

```java
List<String> names = List.of("Alice", "Bob", "Charlie");
// names.add("David"); // throws UnsupportedOperationException

Set<Integer> ids = Set.of(1, 2, 3);
// Set.of(1, 2, 2); // throws IllegalArgumentException - Java detects duplicate element 2

Map<Integer, String> map = Map.of(1, "One", 2, "Two"); // Supports up to 10 entries only
Map<Integer, String> bigMap = Map.ofEntries( // Supports any number of entries
    Map.entry(1, "One"),
    Map.entry(2, "Two"),
    Map.entry(3, "Three")
);
```

3️⃣ **`var` (Java 10)**

`var` lets the compiler infer the type of a **local variable**. Reduce boiler-plate code.

```java
// Before Java 10:
Map<String, List<Integer>> map = new HashMap<String, List<Integer>>();

// With var:
var map = new HashMap<String, List<Integer>>();
```

Where it can be used

- Local variables inside methods
- Index variables in loops
- Enhanced for loops

```java
// Must be initialized
var x = 10;      // valid
var y;           // ❌ invalid
var x = null;    // ❌ Cannot be null

// Only for local variables
class A {
    var x = 10;  // ❌ not allowed (fields)
}

// Initializer must give a clear type
var list = List.of(1, 2, 3); // valid
var arr = {}; // ❌ array initializer needs an explicit type
int[] arr = {}; // ✅ Specify the array type directly

int[] arr = {1,2};
System.out.println(Arrays.toString(arr)); // Output: [1, 2]
```

4️⃣ **String Enhancements (Java 11)**

❌ Before Java 11, developers frequently wrote custom or verbose code for:

- Checking blank strings
- Removing whitespace correctly (Unicode-aware)
- Repeating strings
- Splitting strings into lines

These enhancements reduce boilerplate code and improve readability and correctness.

| Method              | Description                                           |
| ------------------- | ----------------------------------------------------- |
| `isBlank()`         | Checks if string is empty or contains only whitespace |
| `lines()`           | Converts a string into a stream of lines              |
| `strip()`           | Removes leading & trailing Unicode whitespace         |
| `stripLeading()`    | Removes leading Unicode whitespace                    |
| `stripTrailing()`   | Removes trailing Unicode whitespace                   |
| `repeat(int count)` | Repeats the string `count` times                      |

```java
String s = "   ";
System.out.println(s.isBlank()); // true

String text = "Java\nSpring\nHibernate";
text.lines().forEach(System.out::println);
// Output
// Java
// Spring
// Hibernate

String s = "  Java  ";
System.out.println(s.strip());          // "Java"
System.out.println(s.stripLeading());   // "Java  "
System.out.println(s.stripTrailing());  // "  Java"

String s = "Hi ";
System.out.println(s.repeat(3)); // Hi Hi Hi
```

5️⃣ **HTTP Client (Java 11)**

HttpClient in Java 11 is a modern API to send HTTP requests and receive responses (REST calls, APIs, microservices communication) in a simple, efficient, and non-blocking way.

```java
HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder().uri(URI.create("https://api.github.com")).GET().build();
HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
```

❌ Problem

- Old `HttpURLConnection` was complex
- External libraries for HTTP

✅ Solution

- Create one HttpClient and reuse it
- Use send() for synchronous calls
- Use sendAsync() for asynchronous calls

6️⃣ **Switch Expressions (Java 12–14)**

To make `switch` more **concise, expressive, and less error-prone** by allowing it to be used as an expression (returns a value), not just a statement.

❌ Traditional `switch`:

- Was statement-only (no direct return value)
- Required break to avoid fall-through
- Led to verbose and bug-prone code

```java
// Simple Expression Form
int day = 3;
String dayType = switch (day) {
    case 1, 7 -> "Weekend";
    case 2, 3, 4, 5, 6 -> "Weekday";
    default -> "Invalid day";
};
System.out.println(dayType); // Output: Weekday

// Block with yield
int marks = 85;
String result = switch (marks / 10) {
    case 10, 9 -> "Excellent";
    case 8 -> {
        System.out.println("Good performance");
        yield "Very Good";
    }
    default -> "Needs Improvement";
};
System.out.println(result);
// Output:
// Good performance
// Very Good
```

**Key Rules About yield**

- Used only in **switch expressions**
- Used inside `{}` blocks
- Replaces `break` + value-return logic
- Cannot be used in **traditional switch statements**

> default is NOT mandatory - If the compiler can prove that all possible values are covered
> default IS mandatory - If not all possible values are covered

7️⃣ **Text Blocks (Java 15)**

Text Blocks provide a clean, readable way to write multi-line string literals in Java

❌ Before Java 15, multi-line strings required:

- \n for new lines
- Escaping quotes (\")
- String concatenation (+)

This made code hard to read, error-prone, and noisy, especially for JSON, SQL, HTML, or XML.

✅ Rules to Write Text Blocks

- Start and end with `"""`
- Content begins on a **new line**
- Indentation is **automatically normalized**
- Trailing newline is included by default
- Escape sequences like `\n`, `\t`, `\"` still work
- To avoid a newline at end, use `\`

```java
// Before
String json = "{\n" +
              "  \"name\": \"Dev\",\n" +
              "  \"role\": \"Developer\"\n" +
              "}";

// After
String json = """
    {
      "name": "Dev",
      "role": "Developer"
    }
    """;
```

8️⃣ **Records (Java 16)**

❌ Before Java 16, simple data classes required lots of boilerplate:

- Fields
- Constructor
- Getters
- equals(), hashCode(), toString()

✅ Records are a special kind of Java **class** designed to model **immutable data carriers**.

```java
// Traditional Class
class User {
    private final String name;
    private final int age;

    public User(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() { return name; }
    public int getAge() { return age; }

    @Override
    public boolean equals(Object o) { /* boilerplate */ }

    @Override
    public int hashCode() { /* boilerplate */ }

    @Override
    public String toString() { /* boilerplate */ }
}

// Same Using Record
public record User(String name, int age) { }

// Using the Record
User user = new User("Dev", 25);
System.out.println(user.name());   // Dev
System.out.println(user.age());    // 25
```

9️⃣ **Sealed Classes (Java 17)**

Sealed classes **restrict which classes or interfaces can extend or implement them**.

❌ Before Java 17, inheritance was:

- Too open (public / protected classes → anyone could extend)
- Too closed (final → no extension at all)

✅ Rules to Write Sealed Classes

- A sealed class/interface must declare permitted subclasses using `permits`
- All permitted subclasses must:
  - Be in the same module (or same package if no module)
  - Explicitly declare `final`, `sealed`, or `non-sealed`
- Sealed classes cannot be anonymous
- `permits` is optional if subclasses are in the same file

```java
// Sealed Class
public sealed abstract class Shape permits Circle, Rectangle, Triangle {}

// Permitted Subclasses
public final class Circle extends Shape {}

public non-sealed class Triangle extends Shape {}

public sealed class Rectangle extends Shape permits Square {}

public final class Square extends Rectangle {}
```

| Keyword      | Meaning                                                         |
| ------------ | --------------------------------------------------------------- |
| `final`      | **No further inheritance allowed**                              |
| `sealed`     | **Inheritance allowed only to explicitly permitted subclasses** |
| `non-sealed` | **Inheritance is open again** (Anyone may extend from here)     |

🔟 **Pattern Matching (`instanceof` [Java 16] & `switch` [Java 21])**

Pattern Matching allows **testing a value’s type and binding it to a variable in one step**

❌ Traditional Java required:

- Explicit type checks
- Manual casting
- Verbose if-else or switch logic

1. Pattern Matching with `instanceof`

```java
// Without Pattern Matching
if (obj instanceof String) {
    String s = (String) obj;
    System.out.println(s.length());
}

// With Pattern Matching
if (obj instanceof String s) {
    System.out.println(s.length());
}
```

2. Pattern Matching with `switch`

```java
record Success(String data) {}
record ValidationError(String message) {}

// Before
static String handleResponse(Object response) {
    if (response == null) {
        return "No response received";
    }
    if (response instanceof Success) {
        Success s = (Success) response;
        return "Success: " + s.data();
    }
    if (response instanceof ValidationError) {
        ValidationError v = (ValidationError) response;
        return "Validation failed: " + v.message();
    }
    return "Unknown response";
}

// After
static String handleResponse(Object response) {
    return switch (response) {
        case Success s -> "Success: " + s.data();
        case ValidationError v -> "Validation failed: " + v.message();
        case null -> "No response received";
        default -> "Unknown response type";
    };
}
```

> Use `instanceof` pattern matching for simple type checks
> Use `switch` pattern matching for multiple type-based branches

---

## Concurrency & Multithreading

### ❓ How do you handle concurrency in Java applications?

### 📝 Answer

🎯 **Key Understanding**

- Prefer immutability
- Minimize shared mutable state
- Use high-level concurrency utilities
- Design for correctness first, performance second

Core Tools & When to Use Them:

**synchronized**

```java
class Counter {
    private int count = 0;

    synchronized void increment() { // Only one thread can execute increment() at a time.
        count++;
    }
}
```

**ReentrantLock**

```java
Lock lock = new ReentrantLock(); // More control than synchronized

void process() {
    lock.lock(); // explicitly call lock() to acquire the lock
    try {
        // critical section
    } finally {
        lock.unlock(); // explicitly call unlock() to release it
    }
}
```

**ExecutorService**

```java
ExecutorService executor = Executors.newFixedThreadPool(2);

executor.submit(() -> {
    System.out.println("Task running in thread pool");
});

executor.shutdown();
```

- Automatically handles the lifecycle of threads (creation, scheduling, execution, and reuse), avoiding the overhead of creating a new thread for every task.

**CompletableFuture**

```java
CompletableFuture
    .supplyAsync(() -> "Hello")
    .thenApply(result -> result + " World")
    .thenAccept(System.out::println);
```

Non-Blocking Execution - Tasks run on separate threads (by default, the common ForkJoinPool) allowing the main thread to continue its work, thus preventing idle waiting.

**ConcurrentHashMap**

Usage - [Internal Implementation](#L1540)
Coding - [Coding Example](#L1574)

---

### ❓ Deadlocks – How do they occur and how do you prevent them?

### 📝 Answer

Deadlocks occur when processes get stuck in a waiting cycle, each holding a resource the other needs.
For a deadlock to happen, all four of these conditions must be met simultaneously:

1. Mutual exclusion - At least one resource must be non-sharable, meaning only one process can use it at a time.
2. Hold and wait - A process holds at least one resource while waiting for another resource held by a different process
3. No preemption - Resources cannot be forcibly taken (preempted) from a process; they must be released voluntarily.
4. Circular wait - A chain of processes forms where each process waits for a resource held by the next process in the chain, creating a loop.

```java
ExecutorService executor = Executors.newFixedThreadPool(2);
Object lockA = new Object();
Object lockB = new Object();

// Task 1
executor.submit(() -> {
    synchronized (lockA) {
        System.out.println("Task-1 locked lockA");
        synchronized (lockB) {
            System.out.println("Task-1 locked lockB");
        }
    }
});

// Task 2
executor.submit(() -> {
    synchronized (lockB) {
        System.out.println("Task-2 locked lockB");
        synchronized (lockA) {
            System.out.println("Task-2 locked lockA");
        }
    }
});
```

✅ Prevention (Use `ReentrantLock` - Both tasks must follow the exact order.)

```java
ExecutorService executor = Executors.newFixedThreadPool(2);

ReentrantLock lockA = new ReentrantLock();
ReentrantLock lockB = new ReentrantLock();

// Task 1
executor.submit(() -> {
    lockA.lock();
    try {
        System.out.println("Task-1 locked lockA");
        lockB.lock();
        try {
            System.out.println("Task-1 locked lockB");
        } finally {
            lockB.unlock();
        }
    } finally {
        lockA.unlock();
    }
});

// Task 2
executor.submit(() -> {
    lockA.lock();
    try {
        System.out.println("Task-2 locked lockA");
        lockB.lock();
        try {
            System.out.println("Task-2 locked lockB");
        } finally {
            lockB.unlock();
        }
    } finally {
        lockA.unlock();
    }
});
```

> Deadlock happens because of inconsistent lock ordering.
> The fix is to enforce a global lock order across all threads.

Below are **Java 8 interview questions with crisp, simple explanations** and **easy code examples** 👇
(Perfect for quick revision before interviews)

---

### ❓ Process vs Thread?

### 📝 Answer

**Process**

- A **process** is an independent program in execution.
- Has **its own memory space**.
- Heavyweight (creation & switching is costly).

  **Thread**

- A **thread** is a small unit of execution inside a process.
- **Shares memory** with other threads of the same process.
- Lightweight and faster.

  **Key Differences**

| Feature       | Process         | Thread                  |
| ------------- | --------------- | ----------------------- |
| Memory        | Separate memory | Shared memory           |
| Communication | Expensive (IPC) | Easy (shared variables) |
| Creation      | Slow            | Fast                    |
| Example       | Running Chrome  | Chrome tabs             |

**Simple Example**

```java
// One process, multiple threads
public class MyThread extends Thread {
    public void run() {
        System.out.println("Thread running");
    }
}
```

---

### ❓ `volatile` Keyword?

### 📝 Answer

- Ensures **visibility of changes** across threads.
- When one thread updates a volatile variable, **other threads see the updated value immediately**.

  **What it DOES**

✔ Prevents **cached values**
✔ Guarantees **visibility**

**What it DOES NOT**

❌ Does NOT guarantee atomicity
❌ Does NOT replace synchronization

**Example (Without volatile – Problem)**

```java
class FlagTest {
    boolean running = true;

    void stop() {
        running = false;
    }
}
```

Other thread may **never see** `false`.

**Correct Example (With volatile)**

```java
class FlagTest {
    volatile boolean running = true;

    void stop() {
        running = false;
    }
}
```

---

### ❓ Callable vs Runnable

### 📝 Answer

**Runnable**

- Introduced in Java 1.0
- **Does NOT return a result**
- **Cannot throw checked exceptions**

```java
Runnable task = () -> {
    System.out.println("Runnable running");
};
```

**Callable**

- Introduced in Java 5
- **Returns a result**
- **Can throw checked exceptions**

```java
Callable<Integer> task = () -> {
    return 10 + 20;
};
```

**Key Differences**

| Feature      | Runnable                | Callable |
| ------------ | ----------------------- | -------- |
| Return value | ❌ No                   | ✅ Yes   |
| Exception    | ❌ No checked exception | ✅ Yes   |
| Method       | run()                   | call()   |

**Using Callable with Executor**

```java
ExecutorService executor = Executors.newSingleThreadExecutor();

Future<Integer> result = executor.submit(() -> 5 + 5);
System.out.println(result.get()); // 10

executor.shutdown();
```

---

### ❓ Fixed Thread Pool vs Cached Thread Pool

### 📝 Answer

**Fixed Thread Pool**

- Fixed number of threads.
- Threads are **reused**.
- Good for **controlled workload**.

```java
ExecutorService executor = Executors.newFixedThreadPool(2);
```

✔ Predictable
✔ Prevents overload
❌ Tasks may wait

**Cached Thread Pool**

- Creates new threads **as needed**.
- Reuses idle threads.
- Good for **short-lived, fast tasks**.

```java
ExecutorService executor = Executors.newCachedThreadPool();
```

✔ Fast execution
❌ Can create too many threads (risk!)

**Comparison Table**

| Feature      | Fixed Thread Pool  | Cached Thread Pool |
| ------------ | ------------------ | ------------------ |
| Thread count | Fixed              | Unlimited          |
| Performance  | Stable             | Very fast          |
| Risk         | Low                | High (OOM)         |
| Use case     | Long-running tasks | Short tasks        |

---

## JVM Deep Dive

### ❓ What does Serializable mean?

### 📝 Answer

**`Serializable`** is a **marker interface** that is used to **convert Java Object into a byte stream**.

Serializable is like a tag you put on a class to tell Java:

> Hey JVM, this object is allowed to be converted into bytes.

Because Java asks:

> Are you sure you want this object to leave memory?

Serialization is commonly used for:

- Saving objects to a **file**
- Sending objects over a **network**
- Caching objects (Redis, session storage)
- Passing objects between JVMs

🔹 **Marker Interface**

A marker interface is an **interface with no methods** that tells the JVM to treat a class differently.

```java
// Marker Interface
public interface Serializable { }

class User implements Serializable {}

// Annotation
@Serializable
class User {}
```

> **Before annotations existed, marker interfaces were the only way.**

| Marker Interface                   | Purpose                     |
| ---------------------------------- | --------------------------- |
| `Serializable`                     | Allows object serialization |
| `Cloneable`                        | Allows object cloning       |
| `RandomAccess`                     | Optimizes list access       |
| `SingleThreadModel` _(deprecated)_ | Thread safety hint          |

Example: [Serialization Example](/src/questions/backend/java/02-Java-1.md#L3202)

🔹 `serialVersionUID`

```java
private static final long serialVersionUID = 1L;
```

- Ensures **version compatibility**
- Prevents `InvalidClassException`

❌ Without it:

Java secretly creates its own version number based on: `fields`, `types`, `structure`.  
Now you change the class (even slightly), Java creates a different version number.  
Later, when deserializing, Java compares: **version in saved data** and **version of current class**

```text
InvalidClassException: local class incompatible
```

🔹 `transient` Keyword

Used to **exclude fields from serialization**.

```java
class User implements Serializable {
    int id;
    transient String password;
}
```

- `password` will **NOT** be serialized
- After deserialization → `password = null`

🔹 `transient` vs `@Transient`

**transient** is a Java keyword that excludes a field from **serialization**
**@Transient** excludes a field from **database persistence**

🔹 Serializable vs Externalizable

| Feature     | Serializable | Externalizable                  |
| ----------- | ------------ | ------------------------------- |
| Methods     | None         | `writeExternal`, `readExternal` |
| Control     | Automatic    | Full control                    |
| Complexity  | Simple       | Complex                         |
| Performance | Slower       | Faster (custom)                 |

🤔❓ Where is Serializable used in real applications?

Common places:

- HTTP Sessions (Spring Boot)
- File storage
- Messaging (Kafka / RabbitMQ)

```java
User user = session.getAttribute("user");
```

> Internally → Serializable is required

🤔❓ Serializable vs JSON

| Serializable                      | JSON                        |
| --------------------------------- | --------------------------- |
| Java-specific                     | Language-independent        |
| Binary (bytes)                    | Text (readable)             |
| JVM handles it                    | Library handles it          |
| Faster, smaller                   | Slower, bigger              |
| Breaks easily on class change     | Tolerant to changes         |
| Used internally (sessions, cache) | Used externally (REST APIs) |

> `Serializable` is for **Java-to-Java internal object storage**.
> `JSON` is for **sharing data between systems**.

---

### ❓ Explain JVM memory structure. Heap vs Stack vs Metaspace

### 📝 Answer

| Area           | What Lives Here               |
| -------------- | ----------------------------- |
| **Stack**      | Local variables, method calls |
| **Heap**       | Objects, arrays               |
| **Metaspace**  | Class metadata                |
| **Code Cache** | JIT compiled code             |

```java
public class MemoryDemo { // Metaspace (class metadata)

    static int staticCount = 100; // Metaspace (static field)

    public static void main(String[] args) { // Stack (method call)

        int localPrimitive = 10;      // Stack (local primitive)
        Object localReference;        // Stack (reference variable)

        Object obj = new Object();    // Heap (object)
        int[] numbers = new int[5];   // Heap (array)
        String str = new String("Hi");// Heap (object)

        localReference = str;         // Stack -> Heap reference

        demoMethod(obj);              // Stack (method call)
    }

    static void demoMethod(Object param) { // Stack (new stack frame)

        Object localObj;              // Stack (local reference)
        localObj = new Object();      // Heap (object)

        int x = 5;                    // Stack (local primitive)
    }
}

```

---

### ❓ How does Garbage Collection work?

### 📝 Answer

It works by identifying **"dead"** objects (those with no references) through marking reachable ones from **"roots"** (like the stack), sweeping away the unmarked ones, and sometimes compacting live objects to prevent fragmentation, making memory efficient

---

### ❓ What causes memory leaks in Java?

### 📝 Answer

Memory leaks in Java occur when an application unintentionally holds references to objects that are no longer needed

Common causes include:

**Static references** - Referencing a large or heavy object with a static field

```java
private static final List<Object> cache = new ArrayList<>(); // ❌ objects stay alive for entire JVM lifetime

private static final Map<Object, String> cache = new WeakHashMap<>(); // ✅  entries removed when keys are no longer strongly referenced
```

**Unclosed resources** - Forgetting to close streams (file, network, etc.), database connections (Use `try-with-resources`)

```java
FileInputStream fis = new FileInputStream("data.txt"); // ❌ Resource not closed

try (FileInputStream fis = new FileInputStream("data.txt")) { // ✅ try-with-resources → resource automatically closed even on exception
    // use fis
} catch (ExceptionType e) {
    // Handle exceptions
}
```

**Unbounded collections** - Continuously adding objects to collections (like ArrayList, HashMap, HashSet)

```java
static List<Object> cache = new ArrayList<>(); // ❌ Static unbounded collection → no GC → leak

public void add() {
    cache.add(new Object());
}

// Option 1:
List<Object> cache = new ArrayList<>(); // ✅ Make it non-static

// Option 2:
static Map<Object, Boolean> cache = new WeakHashMap<>(); // ✅ Use weak references if static is required

// Option 3:
public static void clearCache() {
    cache.clear(); // ✅ Explicit cleanup when no longer needed
}
```

**Improper equals() and hashCode() implementations** : without correctly implementing equals() and hashCode() methods can lead to duplicate objects being added

---

## JVM vs JRE vs JDK

### ❓ JVM Internals

### 📝 Answer

🔹 High-Level View

```
JDK = JRE + Development Tools
JRE = JVM + Core Libraries
JVM = Execution Engine
```

🔹 **JVM Internal Architecture (Must Know)**

```
          ┌───────────────┐
          │  ClassLoader  │
          └──────┬────────┘
                 │
        ┌────────▼────────┐
        │ Runtime Memory  │
        │  - Heap         │
        │  - Stack        │
        │  - Metaspace   │
        │  - PC Register │
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │ Execution Engine│
        │  - Interpreter │
        │  - JIT Compiler│
        │  - GC          │
        └────────────────┘
```

🔹 **JVM Responsibilities**

✔ Loads `.class` files
✔ Verifies bytecode
✔ Manages memory & GC
✔ Executes bytecode
✔ Ensures platform independence

🔹 **JRE (Runtime Environment)**

Contains:

- JVM
- Java Core APIs (`java.lang`, `java.util`, etc.)
- Native libraries

❌ Cannot compile code

🔹 **JDK (Development Kit)**

Contains:

- JRE
- `javac`, `javadoc`, `jconsole`, `jstack`, `jmap`

**✅ Rules to Remember**

✔ JVM is platform-dependent (**Windows x64 JVM**, **Linux x64 JVM,** **macOS ARM JVM**)
✔ JRE = runtime only
✔ JDK needed for development
✔ Java is platform-independent (Same **.class** file runs on any platform as long as the correct JVM exists)

🤔❓ **Java Compilation and Runtime Execution**

- JDK’s `javac` compiles all `.java` files into `.class` files (written in **bytecode**)
- Tomcat Startup
  - JVM loads `.class` files using the `ClassLoader`
  - JVM **Interpreter** executes bytecode **instruction by instruction**
  - JVM monitors execution
    - Only Frequently executed methods / loops are detected
    - **JIT** compiles them into native machine code

🤔❓ **Why Java is Platform Independent?**

- Java code is compiled into bytecode (.class)
- Bytecode runs on JVM, not directly on OS
- Each OS has its own JVM implementation
- Same bytecode runs unchanged on any platform

> 👉 “Write Once, Run Anywhere (WORA)”

---

### ❓ How Do You Build a Java Application?

### 📝 Answer

🔹 Build tools

- Maven (most common)
- Gradle

🔹 Build flow (Maven)

```text
Code → Compile → Test → Package → Deploy
```

Commands:

```bash
mvn clean install
```

Output:

- JAR (Spring Boot)
- WAR (Traditional apps)
