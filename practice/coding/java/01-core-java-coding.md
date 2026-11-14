# ☕ Core Java — Output Questions (Tricks & Traps)

## try / catch / finally

### ❓ What will be the output? (return in try and in finally)

**Level:** 🟡 Intermediate

> ```java
> static int test() {
>     try {
>         return 1;
>     } finally {
>         return 2;
>     }
> }
> System.out.println(test());
> ```

### 📝 Answer

```text
2
```

🧠 **Why:** `finally` always runs, and a `return` inside `finally` **replaces** the earlier return value. (Never return from `finally` in real code — it also hides exceptions.)

---

### ❓ What will be the output? (return in catch and in finally)

**Level:** 🟡 Intermediate

> ```java
> static int test() {
>     try {
>         int a = 10 / 0;
>         return 1;
>     } catch (Exception e) {
>         return 2;
>     } finally {
>         return 3;
>     }
> }
> ```

### 📝 Answer

```text
3
```

🧠 **Why:** `10 / 0` throws, `catch` prepares to return 2, then `finally` runs and its `return 3` wins.

---

### ❓ What will be the output? (changing a primitive in finally)

**Level:** 🟡 Intermediate

> ```java
> static int test() {
>     int x = 10;
>     try {
>         return x;
>     } finally {
>         x = 20;
>     }
> }
> ```

### 📝 Answer

```text
10
```

🧠 **Why:** the value `10` is **copied** as the return value before `finally` runs. Changing `x` afterwards doesn't change that copy.

---

### ❓ What will be the output? (changing an object in finally)

**Level:** 🟡 Intermediate

> ```java
> class Test { int x = 10; }
>
> static Test test() {
>     Test t = new Test();
>     try {
>         return t;
>     } finally {
>         t.x = 20;
>     }
> }
> System.out.println(test().x);
> ```

### 📝 Answer

```text
20
```

🧠 **Why:** what is copied is the **reference**, not the object. `finally` changes the same object, so the caller sees `x = 20`.

> ⚠️ Printing `test()` itself would show something like `Test@1b6d3586`, because `Test` doesn't override `toString()`.

---

### ❓ What will be the output? (System.exit in try)

**Level:** 🟡 Intermediate

> ```java
> try {
>     System.exit(0);
> } finally {
>     System.out.println("Finally");
> }
> ```

### 📝 Answer

```text
(no output)
```

🧠 **Why:** `System.exit()` stops the JVM immediately, so `finally` never gets a chance to run. This is the classic exception to "finally always runs".

---

### ❓ What will be the output? (return in finally swallows an exception)

**Level:** 🟡 Intermediate

> ```java
> static int test() {
>     try {
>         throw new RuntimeException();
>     } finally {
>         return 10;
>     }
> }
> System.out.println(test());
> ```

### 📝 Answer

```text
10
```

🧠 **Why:** the `return` in `finally` **discards the exception** — the caller never knows it happened. Another reason not to return from `finally`.

---

### ❓ What will be the output? (try-with-resources closing order)

**Level:** 🟡 Intermediate

> ```java
> class A implements AutoCloseable { public void close() { System.out.println("A Closed"); } }
> class B implements AutoCloseable { public void close() { System.out.println("B Closed"); } }
>
> try (A a = new A(); B b = new B()) {
>     System.out.println("Try");
> }
> ```

### 📝 Answer

```text
Try
B Closed
A Closed
```

🧠 **Why:** resources close **in reverse order** of opening — like stacking plates, the last one opened is closed first.

---

## Initialization Order

### ❓ What will be the output? (overloaded main method)

**Level:** 🟡 Intermediate

> ```java
> public static void main(String[] args) {
>     main(10);
> }
>
> public static void main(int a) {
>     System.out.println(a);
> }
> ```

### 📝 Answer

```text
10
```

🧠 **Why:** only `main(String[])` is the entry point. Any other `main` is just a normal overloaded static method.

---

### ❓ What will be the output? (static blocks and main)

**Level:** 🟡 Intermediate

> ```java
> static { System.out.println("Before Main"); }
>
> public static void main(String[] args) {
>     System.out.println("Main");
> }
>
> static { System.out.println("After Main"); }
> ```

### 📝 Answer

```text
Before Main
After Main
Main
```

🧠 **Why:** all static blocks run **when the class loads**, top to bottom — before `main()` is called, no matter where they appear in the file.

---

### ❓ What will be the output? (instance block and constructor)

**Level:** 🟡 Intermediate

> ```java
> class Test {
>     { System.out.println("Instance"); }
>     Test() { System.out.println("Constructor"); }
> }
> new Test();
> ```

### 📝 Answer

```text
Instance
Constructor
```

🧠 **Why:** instance initializer blocks run on every `new`, just **before the constructor body**.

---

### ❓ What will be the output? (static, instance block and constructor)

**Level:** 🟡 Intermediate

> ```java
> class Test {
>     static { System.out.println("Static"); }
>     { System.out.println("Instance"); }
>     Test() { System.out.println("Constructor"); }
>
>     public static void main(String[] args) {
>         new Test();
>     }
> }
> ```

### 📝 Answer

```text
Static
Instance
Constructor
```

🧠 **Why:** order is **static (once, at class load) → instance block → constructor** (every object).

---

### ❓ What will be the output? (static blocks in parent and child)

**Level:** 🟡 Intermediate

> ```java
> class A { static { System.out.println("A Static"); } }
> class B extends A { static { System.out.println("B Static"); } }
>
> new B();
> ```

### 📝 Answer

```text
A Static
B Static
```

🧠 **Why:** a parent class is loaded (and its static blocks run) **before** its child class.

---

### ❓ What will be the output? (parent and child constructors)

**Level:** 🟡 Intermediate

> ```java
> class A { A() { System.out.println("A"); } }
> class B extends A { B() { System.out.println("B"); } }
>
> new B();
> ```

### 📝 Answer

```text
A
B
```

🧠 **Why:** every constructor first calls `super()` (added automatically), so the parent is built first.

---

## Strings & Wrappers

### ❓ What will be the output? (== on string literals)

**Level:** 🟡 Intermediate

> ```java
> String a = "Java";
> String b = "Java";
> System.out.println(a == b);
> ```

### 📝 Answer

```text
true
```

🧠 **Why:** identical string literals share **one object in the String Pool**, so both variables hold the same reference.

---

### ❓ What will be the output? (== on new String objects)

**Level:** 🟡 Intermediate

> ```java
> String a = new String("Java");
> String b = new String("Java");
> System.out.println(a == b);
> ```

### 📝 Answer

```text
false
```

🧠 **Why:** `new` always creates a **new object**. `==` compares references; use `a.equals(b)` (true) to compare content.

---

### ❓ What will be the output? (String intern)

**Level:** 🟡 Intermediate

> ```java
> String a = new String("Java").intern();
> String b = "Java";
> System.out.println(a == b);
> ```

### 📝 Answer

```text
true
```

🧠 **Why:** `intern()` returns the **pooled** copy of the string — the same one the literal uses.

---

### ❓ What will be the output? (String concat is immutable)

**Level:** 🟡 Intermediate

> ```java
> String s = "Java";
> s.concat(" World");
> System.out.println(s);
> ```

### 📝 Answer

```text
Java
```

🧠 **Why:** strings are **immutable**. `concat` returns a **new** string, which is thrown away here. Fix: `s = s.concat(" World");`

---

### ❓ What will be the output? (final StringBuilder)

**Level:** 🟡 Intermediate

> ```java
> final StringBuilder sb = new StringBuilder("Java");
> sb.append(" World");
> System.out.println(sb);
> ```

### 📝 Answer

```text
Java World
```

🧠 **Why:** `final` stops you **re-assigning the variable**, not changing the object it points to.

---

### ❓ What will be the output? (StringBuilder passed to a method)

**Level:** 🟡 Intermediate

> ```java
> static void change(StringBuilder sb) {
>     sb.append("B");
>     sb = new StringBuilder("C");
> }
>
> StringBuilder sb = new StringBuilder("A");
> change(sb);
> System.out.println(sb);
> ```

### 📝 Answer

```text
AB
```

🧠 **Why:** Java passes **a copy of the reference**. `append` changes the shared object; re-assigning `sb` inside the method only changes the method's own copy.

---

### ❓ What will be the output? (Integer == with 127)

**Level:** 🟡 Intermediate

> ```java
> Integer a = 127;
> Integer b = 127;
> System.out.println(a == b);
> ```

### 📝 Answer

```text
true
```

🧠 **Why:** autoboxing uses `Integer.valueOf`, which **caches -128 to 127**, so both get the same object.

---

### ❓ What will be the output? (Integer == with 128)

**Level:** 🟡 Intermediate

> ```java
> Integer a = 128;
> Integer b = 128;
> System.out.println(a == b);
> ```

### 📝 Answer

```text
false
```

🧠 **Why:** 128 is outside the cache, so two different objects are created. Always compare wrappers with `equals()`.

---

### ❓ What will be the output? (unboxing null)

**Level:** 🟡 Intermediate

> ```java
> Integer a = null;
> int b = a;
> ```

### 📝 Answer

```text
NullPointerException
```

🧠 **Why:** `int b = a` really calls `a.intValue()` — on `null`.

---

## Overloading & Polymorphism

### ❓ What will be the output? (null with Object and String overloads)

**Level:** 🟡 Intermediate

> ```java
> static void test(Object o) { System.out.println("Object"); }
> static void test(String s) { System.out.println("String"); }
>
> test(null);
> ```

### 📝 Answer

```text
String
```

🧠 **Why:** `null` fits both; Java picks the **most specific** type, and `String` is more specific than `Object`.

---

### ❓ What will be the output? (null with Integer and Long overloads)

**Level:** 🟡 Intermediate

> ```java
> static void test(Integer a) { System.out.println("Integer"); }
> static void test(Long a)    { System.out.println("Long"); }
>
> test(null);
> ```

### 📝 Answer

```text
Compile-time error: reference to test is ambiguous
```

🧠 **Why:** neither `Integer` nor `Long` is more specific than the other, so the compiler can't choose.

---

### ❓ What will be the output? (overloading: widening vs boxing)

**Level:** 🟡 Intermediate

> ```java
> static void test(long a)    { System.out.println("long"); }
> static void test(Integer a) { System.out.println("Integer"); }
>
> test(10);
> ```

### 📝 Answer

```text
long
```

🧠 **Why:** Java tries in this order: **exact match → widening (int → long) → boxing (int → Integer) → varargs**. Widening comes before boxing.

---

### ❓ What will be the output? (overloading: exact match vs varargs)

**Level:** 🟡 Intermediate

> ```java
> static void test(int a)    { System.out.println("int"); }
> static void test(int... a) { System.out.println("varargs"); }
>
> test(10);
> ```

### 📝 Answer

```text
int
```

🧠 **Why:** varargs is the **last** choice; an exact match always wins.

---

### ❓ What will be the output? (static method "overriding")

**Level:** 🟡 Intermediate

> ```java
> class A { static void show() { System.out.println("A"); } }
> class B extends A { static void show() { System.out.println("B"); } }
>
> A a = new B();
> a.show();
> ```

### 📝 Answer

```text
A
```

🧠 **Why:** static methods are **hidden, not overridden**. The call is chosen at compile time by the variable's type (`A`), not the object's type.

---

### ❓ What will be the output? (instance method overriding)

**Level:** 🟡 Intermediate

> ```java
> class A { void show() { System.out.println("A"); } }
> class B extends A { void show() { System.out.println("B"); } }
>
> A a = new B();
> a.show();
> ```

### 📝 Answer

```text
B
```

🧠 **Why:** instance methods use **runtime polymorphism** — the actual object (`B`) decides.

---

## Collections

### ❓ What will be the output? (Collections.sort on a Collection)

**Level:** 🟡 Intermediate

> ```java
> Collection<Integer> c = new ArrayList<>();
> c.add(3); c.add(1); c.add(2);
> Collections.sort(c);
> ```

### 📝 Answer

```text
Compile-time error: no suitable method found for sort(Collection<Integer>)
```

🧠 **Why:** `Collections.sort()` accepts only a **`List`**. The variable's type is `Collection`, so it doesn't compile — even though the object is an `ArrayList`. Fix: declare `List<Integer> c`.

---

### ❓ What will be the output? (List remove by index vs by value)

**Level:** 🟡 Intermediate

> ```java
> List<Integer> list = new ArrayList<>();
> list.add(10);
> list.add(20);
> list.remove(10);
> ```

### 📝 Answer

```text
IndexOutOfBoundsException: Index 10 out of bounds for length 2
```

🧠 **Why:** `List` has `remove(int index)` and `remove(Object o)`. The literal `10` is an `int`, so **remove by index** is chosen. To remove the value: `list.remove(Integer.valueOf(10));`

---

### ❓ What will be the output? (removing from a list inside a for-each loop)

**Level:** 🟡 Intermediate

> ```java
> List<String> list = new ArrayList<>(List.of("A", "B"));
> for (String s : list) {
>     list.remove(s);
> }
> System.out.println(list);
> ```

### 📝 Answer

```text
[B]
```

🧠 **Why (the trap inside the trap):** removing "A" shrinks the list to size 1. The loop's `hasNext()` checks `cursor != size` → `1 != 1` is false, so the loop **just stops** — no exception, and "B" is never visited.

With **three** items (`"A", "B", "C"`) the same code throws **`ConcurrentModificationException`**, because the iterator's next `next()` call sees the list changed.

✅ **Correct ways:**

```java
list.removeIf(s -> true);                // simplest

Iterator<String> it = list.iterator();   // or the iterator's own remove()
while (it.hasNext()) { it.next(); it.remove(); }

for (int i = list.size() - 1; i >= 0; i--) list.remove(i);   // or go backwards by index
```

> ⚠️ A forward index loop `for (int i = 0; i < list.size(); i++) list.remove(i);` doesn't throw but **skips** elements: after removing index 0, "B" shifts to index 0 and `i` moves on to 1.

---

### ❓ What will be the output? (HashSet with duplicates)

**Level:** 🟡 Intermediate

> ```java
> Set<Integer> set = new HashSet<>();
> set.add(10);
> set.add(20);
> set.add(10);
> System.out.println(set);
> ```

### 📝 Answer

```text
[20, 10]
```

🧠 **Why:** the duplicate `10` is ignored (`add` returns `false`). `HashSet` has **no guaranteed order** — this order comes from the hash buckets and can change. Use `LinkedHashSet` for insertion order or `TreeSet` for sorted order.

---

### ❓ What will be the output? (HashSet without equals and hashCode)

**Level:** 🟡 Intermediate

> ```java
> class Employee {
>     int id;
>     Employee(int id) { this.id = id; }
> }
>
> Set<Employee> set = new HashSet<>();
> set.add(new Employee(1));
> set.add(new Employee(1));
> System.out.println(set.size());
> ```

### 📝 Answer

```text
2
```

🧠 **Why:** without `equals()` and `hashCode()`, Java compares objects by **identity**. Two `new` objects are different, so both are kept.

✅ **Fix:** override both (or use a `record`, which generates them):

```java
record Employee(int id) { }   // equals/hashCode by id → set.size() == 1
```

---

### ❓ What will be the output? (HashMap with null keys)

**Level:** 🟡 Intermediate

> ```java
> Map<String, Integer> map = new HashMap<>();
> map.put(null, 1);
> map.put(null, 2);
> System.out.println(map);
> ```

### 📝 Answer

```text
{null=2}
```

🧠 **Why:** `HashMap` allows **one** `null` key (the second `put` replaces its value) and any number of `null` values. `TreeMap` and `ConcurrentHashMap` don't allow `null` keys.

---

### ❓ What will be the output? (changing a key after putting it in a HashMap)

**Level:** 🟡 Intermediate

> ```java
> Map<StringBuilder, String> map = new HashMap<>();
> StringBuilder key = new StringBuilder("A");
> map.put(key, "Value");
> key.append("B");
>
> System.out.println(map.get(key));
> System.out.println(map.get(new StringBuilder("AB")));
> ```

### 📝 Answer

```text
Value
null
```

🧠 **Why:** `StringBuilder` does **not** override `equals()`/`hashCode()`, so it's compared by **identity**. The same object is still found; a new object with the same text is not.

The real "mutable key" trap is with keys whose `hashCode` depends on their content:

```java
Map<List<String>, String> map = new HashMap<>();
List<String> key = new ArrayList<>(List.of("A"));
map.put(key, "Value");
key.add("B");                       // hashCode changes → entry sits in the old bucket
System.out.println(map.get(key));   // null — the entry is "lost"
```

Rule: use **immutable keys** (`String`, `Integer`, records).

---

### ❓ What will be the output? (adding to a HashMap while looping over it)

**Level:** 🟡 Intermediate

> ```java
> Map<String, String> map = new HashMap<>();
> map.put("A", "1");
>
> for (String key : map.keySet()) {
>     map.put("B", "2");
> }
> System.out.println(map.size());
> ```

### 📝 Answer

```text
2
```

🧠 **Why (surprising):** with only one entry, the iterator has already found there is no next entry before `"B"` is added, so the loop ends without checking for changes.

With **two or more** entries (e.g. `"A"` and `"C"`), the next `next()` call detects the change and throws **`ConcurrentModificationException`**. Never rely on this — don't modify a map while iterating it; collect changes first or use `ConcurrentHashMap`.

---

## Optional

### ❓ What will be the output? (orElse vs orElseGet)

**Level:** 🟡 Intermediate

> ```java
> static String getDefault() {
>     System.out.println("Default called");
>     return "Default";
> }
>
> Optional<String> name = Optional.of("Dev");
> System.out.println(name.orElse(getDefault()));
> ```

### 📝 Answer

```text
Default called
Dev
```

🧠 **Why:** `orElse(x)` is a normal method call, so `getDefault()` runs **first, always**, even though a value exists. `orElseGet(() -> getDefault())` calls it **only when empty** — it would print just `Dev`.

---

### ❓ What will be the output? (Optional.get on empty)

**Level:** 🟡 Intermediate

> ```java
> Optional<String> name = Optional.empty();
> System.out.println(name.get());
> ```

### 📝 Answer

```text
NoSuchElementException: No value present
```

🧠 **Why:** `get()` on an empty `Optional` throws. Prefer `orElse`, `orElseGet`, `orElseThrow`, or `ifPresent`.

---

## Miscellaneous Traps

### ❓ What will be the output? (finalize and System.gc)

**Level:** 🟡 Intermediate

> ```java
> class Test {
>     protected void finalize() { System.out.println("Finalize"); }
>
>     public static void main(String[] args) {
>         Test t = new Test();
>         t = null;
>         System.gc();
>     }
> }
> ```

### 📝 Answer

```text
May or may not print "Finalize"
```

🧠 **Why:** `System.gc()` is only a **request**, and `finalize()` is never guaranteed to run. `finalize()` is deprecated — use try-with-resources or `Cleaner` instead.

---

### ❓ What will be the output? (a++ + ++a + a++)

**Level:** 🟡 Intermediate

> ```java
> int a = 10;
> System.out.println(a++ + ++a + a++);
> ```

### 📝 Answer

```text
34
```

🧠 **Why:** evaluated left to right:

| Part | Value used | `a` after |
|---|---|---|
| `a++` | 10 | 11 |
| `++a` | 12 | 12 |
| `a++` | 12 | 13 |

10 + 12 + 12 = **34**.

---

### ❓ What will be the output? (Thread run instead of start)

**Level:** 🟡 Intermediate

> ```java
> Thread t = new Thread(() -> System.out.println("Run " + Thread.currentThread().getName()));
> t.run();
> ```

### 📝 Answer

```text
Run main
```

🧠 **Why:** `run()` is just a normal method call on the **current (main) thread**. Only `start()` creates a new thread.

---

### ❓ What will be the output? (if (true) else)

**Level:** 🟡 Intermediate

> ```java
> if (true)
>     System.out.println("A");
> else
>     System.out.println("B");
> ```

### 📝 Answer

```text
A
```

🧠 **Why:** the condition is a compile-time constant, so the `else` branch can never run (the compiler may even drop it). Unlike `while (false) { }`, an unreachable `if` branch is **not** a compile error — Java allows it for "debug flag" code.

---

### ❓ What will be the output? (casting an Integer to String)

**Level:** 🟡 Intermediate

> ```java
> Object o = Integer.valueOf(10);
> String s = (String) o;
> ```

### 📝 Answer

```text
ClassCastException: class java.lang.Integer cannot be cast to class java.lang.String
```

🧠 **Why:** the cast compiles (an `Object` *might* be a `String`), but at runtime the object is an `Integer`. Check first with pattern matching: `if (o instanceof String s) { ... }`.

---

### ❓ What will be the output? (volatile flag between threads)

**Level:** 🟡 Intermediate

> ```java
> static volatile boolean flag = false;
>
> public static void main(String[] args) {
>     new Thread(() -> {
>         while (!flag) { }
>         System.out.println("Done");
>     }).start();
>     flag = true;
> }
> ```

### 📝 Answer

```text
Done
```

🧠 **Why:** `volatile` makes the main thread's write **visible** to the other thread, so its loop ends. Without `volatile`, the loop might **never** see the change and spin forever.

> Note: `volatile` only works on fields — a local variable can't be `volatile` (and a lambda can't change a local variable anyway).
