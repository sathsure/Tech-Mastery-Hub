# Java — Quick Traps

> Tricky spots interviewers love: what goes wrong, a tiny example, and the right answer.

### 1. `==` on strings
- ❌ `new String("hi") == "hi"` → `false`
- ✅ `==` checks the same object. Use `.equals()` to compare text.

### 2. Integer cache
- ❌ `Integer a = 128, b = 128; a == b` → `false` (but `127 == 127` → `true`)
- ✅ Java caches −128 to 127 only. Compare wrappers with `.equals()`.

### 3. equals without hashCode
- ❌ Overriding only `equals` → `set.contains(sameUser)` returns `false`.
- ✅ Always override both (or use a `record`).

### 4. Removing while looping
- ❌ `for (String s : list) if (s.isEmpty()) list.remove(s);` → `ConcurrentModificationException`
- ✅ `list.removeIf(String::isEmpty)` or use an `Iterator`.

### 5. `Arrays.asList` is fixed-size
- ❌ `Arrays.asList(1, 2).add(3)` → `UnsupportedOperationException`
- ✅ Wrap it: `new ArrayList<>(Arrays.asList(1, 2))`. (`List.of` can't change at all.)

### 6. `HashMap` across threads
- ❌ Several threads writing to a `HashMap` → lost or broken data.
- ✅ Use `ConcurrentHashMap`.

### 7. `volatile` isn't atomic
- ❌ `volatile int count; count++` from many threads → wrong total.
- ✅ `++` is read + add + write. Use `AtomicInteger` or `synchronized`.

### 8. `finally` with `return`
- ❌ `try { return 1; } finally { return 2; }` → returns `2` and hides exceptions.
- ✅ Never `return` from `finally`.

### 9. Java passes by value
- ❌ "Objects are passed by reference."
- ✅ The *reference* is copied. You can change the object's fields, but `obj = new X()` inside a method doesn't affect the caller.

### 10. String concatenation in loops
- ❌ `s += item` in a big loop → creates a new string every time.
- ✅ Use `StringBuilder`.

### 11. `Optional.get()` without a check
- ❌ `findUser(id).get()` → `NoSuchElementException` when empty.
- ✅ `orElse`, `orElseThrow`, `map`, `ifPresent`.

### 12. Streams are single-use
- ❌ Calling `stream.count()` then `stream.toList()` → `IllegalStateException`.
- ✅ Create a new stream each time.

### 13. Overloading vs overriding with static
- ❌ "A static method can be overridden."
- ✅ Static methods are *hidden*, not overridden; the call depends on the variable's type.

### 14. Integer division
- ❌ `5 / 2` → `2`
- ✅ Use `5 / 2.0` → `2.5`. For money, use `BigDecimal`, not `double`.
