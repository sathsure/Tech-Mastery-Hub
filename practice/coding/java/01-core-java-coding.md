### ❓ What will be the output?

> ```java
> try {
>     return 1;
> } finally {
>     return 2;
> }
> ```

### 📝 Answer

```java
2
```

🧠 _Explanation_

`finally` always overrides the return value.

---

### ❓ What will be the output?

> ```java
> try {
>     int a = 10 / 0;
>     return 1;
> } catch (Exception e) {
>     return 2;
> } finally {
>     return 3;
> }
> ```

### 📝 Answer

```java
3
```

🧠 _Explanation_

`finally` executes even after `catch` return.

---

### ❓ What will be the output?

> ```java
> int x = 10;
> try {
>     return x;
> } finally {
>     x = 20;
> }
> ```

### 📝 Answer

```java
10
```

🧠 _Explanation_

Returned value is copied before `finally` executes.

---

### ❓ What will be the output?

> ```java
> class Test {
>     int x = 10;
> }
>
> Test t = new Test();
> try {
>     return t;
> } finally {
>     t.x = 20;
> }
> ```

### 📝 Answer

```java
Test{x=20}
```

🧠 _Explanation_

Object reference is returned, not the object state.

---

### ❓ What will be the output?

> ```java
> try {
>     System.exit(0);
> } finally {
>     System.out.println("Finally");
> }
> ```

### 📝 Answer

```java
(No Output)
```

🧠 _Explanation_

`System.exit()` terminates JVM immediately.

---

### ❓ What will be the output?

> ```java
> public static void main(String[] args) {
>     main(10);
> }
> ```

public static void main(int a) {
System.out.println(a);
}

````

### 📝 Answer

```java
10
````

🧠 _Explanation_

Overloaded `main()` is a normal static method.

---

### ❓ What will be the output?

> ```java
> static {
>     System.out.println("Before Main");
> }
>
> public static void main(String[] args) {
>     System.out.println("Main");
> }
>
> static {
>     System.out.println("After Main");
> }
> ```

### 📝 Answer

```java
Before Main
After Main
Main
```

🧠 _Explanation_

Static blocks execute before `main()`.

---

### ❓ What will be the output?

> ```java
> {
>     System.out.println("Instance");
> }
>
> Test() {
>     System.out.println("Constructor");
> }
>
> new Test();
> ```

### 📝 Answer

```java
Instance
Constructor
```

🧠 _Explanation_

Instance block runs before constructor.

---

### ❓ What will be the output?

> ```java
> String a = "Java";
> String b = "Java";
> System.out.println(a == b);
> ```

### 📝 Answer

```java
true
```

🧠 _Explanation_

String literals are stored in the String Pool.

---

### ❓ What will be the output?

> ```java
> String a = new String("Java");
> String b = new String("Java");
> System.out.println(a == b);
> ```

### 📝 Answer

```java
false
```

🧠 _Explanation_

`new` creates separate heap objects.

---

### ❓ What will be the output?

> ```java
> String a = new String("Java").intern();
> String b = "Java";
> System.out.println(a == b);
> ```

### 📝 Answer

```java
true
```

🧠 _Explanation_

`intern()` returns pooled reference.

---

### ❓ What will be the output?

> ```java
> Integer a = 127;
> Integer b = 127;
> System.out.println(a == b);
> ```

### 📝 Answer

```java
true
```

🧠 _Explanation_

Integer cache range is `-128 to 127`.

---

### ❓ What will be the output?

> ```java
> Integer a = 128;
> Integer b = 128;
> System.out.println(a == b);
> ```

### 📝 Answer

```java
false
```

🧠 _Explanation_

Outside Integer cache range.

---

### ❓ What will be the output?

> ```java
> Integer a = null;
> int b = a;
> ```

### 📝 Answer

```java
NullPointerException
```

🧠 _Explanation_

Auto-unboxing `null` throws NPE.

---

### ❓ What will be the output?

> ```java
> static void test(Object o) {
>     System.out.println("Object");
> }
>
> static void test(String s) {
>     System.out.println("String");
> }
>
> test(null);
> ```

### 📝 Answer

```java
String
```

🧠 _Explanation_

Most specific overloaded method is chosen.

---

### ❓ What will be the output?

> ```java
> class A {
>     static void show() {
>         System.out.println("A");
>     }
> }
>
> class B extends A {
>     static void show() {
>         System.out.println("B");
>     }
> }
>
> A a = new B();
> a.show();
> ```

### 📝 Answer

```java
A
```

🧠 _Explanation_

Static methods are resolved at compile time.

---

### ❓ What will be the output?

> ```java
> class A {
>     void show() {
>         System.out.println("A");
>     }
> }
>
> class B extends A {
>     void show() {
>         System.out.println("B");
>     }
> }
>
> A a = new B();
> a.show();
> ```

### 📝 Answer

```java
B
```

🧠 _Explanation_

Runtime polymorphism applies to instance methods.

---

### ❓ What will be the output?

> ```java
> class A {
>     A() {
>         System.out.println("A");
>     }
> }
>
> class B extends A {
>     B() {
>         System.out.println("B");
>     }
> }
>
> new B();
> ```

### 📝 Answer

```java
A
B
```

🧠 _Explanation_

Parent constructor executes first.

---

### ❓ What will be the output?

> ```java
> final StringBuilder sb = new StringBuilder("Java");
> sb.append(" World");
> System.out.println(sb);
> ```

### 📝 Answer

```java
Java World
```

🧠 _Explanation_

`final` prevents reassignment, not mutation.

---

### ❓ What will be the output?

> ```java
> String s = "Java";
> s.concat(" World");
> System.out.println(s);
> ```

### 📝 Answer

```java
Java
```

---

### ❓ What will be the output?

> ```java
> Collection<Integer> c = new ArrayList<>();
> c.add(3);
> c.add(1);
> c.add(2);
>
> Collections.sort(c);
> System.out.println(c);
>
> ```

### 📝 Answer

❌ Compiles and throws ClassCastException at runtime.

🧠 _Explanation_

- `Collections.sort()` accepts a `List`, not a `Collection`.
- Reference type mismatch

---

### ❓ What will be the output?

> ```java
> List<Integer> list = new ArrayList<>();
> list.add(10);
> list.add(20);
> list.remove(10);
> ```

### 📝 Answer

❌ it throws java.lang.IndexOutOfBoundsException at `list.remove(10);`

🧠 _Explanation_

List has two overloaded remove() methods:

- remove(int index)
- remove(Object o)

---

### ❓ What will be the output?

> ```java
> List<String> list = new ArrayList<>();
> list.add("A");
> list.add("B");
>
> for (String s : list) {
>     list.remove(s);
> }
> System.out.println(list);
> ```

### 📝 Answer

❌ it throws java.util.ConcurrentModificationException at `list.remove(s);`

🧠 _Explanation_

- Enhanced for-loop uses an **Iterator internally**
- Modifying the list directly breaks iterator contract

✅ _Correct Way_

```java
Iterator<String> it = list.iterator();
while (it.hasNext()) {
    it.next();
    it.remove();
}
System.out.println(list); // []
```

_Alternate 1_

❌ Traditional for loop — Does NOT throw exception

```java
List<String> list = new ArrayList<>();
list.add("A");
list.add("B");

for (int i = 0; i < list.size(); i++) {
    list.remove(i);
}
System.out.println(list); // [B] - No exception, but wrong Output

```

- When you remove index `0`, elements shift left
- `"B"` moves to index `0`
- Loop increments `i` → skips `"B"`

✅ _Correct Way_

```java
for (int i = list.size() - 1; i >= 0; i--) {
    list.remove(i);
}
System.out.println(list); // []

```

- Removing from the end
- No shifting issues

_Alternate 2_

✅ while loop with index — Safe

```java
int i = 0;
while (i < list.size()) {
    list.remove(i);
}
System.out.println(list); // []
```

- After removal, next element shifts to same index
- Index is not incremented

---

### ❓ What will be the output?

> ```java
> Set<Integer> set = new HashSet<>();
> set.add(10);
> set.add(20);
> set.add(10);
> System.out.println(set);
> ```

### 📝 Answer

```
[20, 10]   // or [10, 20]
```

✔️ If order matters

```java
Set<Integer> set = new LinkedHashSet<>();
```

---

### ❓ What will be the output?

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

```
2
```

🧠 _Explanation_

> Each `new Employee(1)` is a different object in memory, so both are added to the set.

✅ _Correct Way_

```java
class Employee {
    int id;
    Employee(int id) { this.id = id; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true; // this refers to: The object already present in the HashSet. o refers to: The new object being added to the HashSet.
        if (!(o instanceof Employee)) return false; // Ensures the other object is of the correct type before comparing data
        Employee e = (Employee) o;
        return id == e.id;
    }

    @Override
    public int hashCode() {
        return Integer.hashCode(id);
    }
}

Set<Employee> set = new HashSet<>();
set.add(new Employee(1));
set.add(new Employee(1));
System.out.println(set.size()); // 1

```

---

### ❓ What will be the output?

> ```java
> Map<String, Integer> map = new HashMap<>();
> map.put(null, 1);
> map.put(null, 2);
> System.out.println(map);
> ```

### 📝 Answer

```
{null=2}
```

🧠 _Explanation_

`HashMap` allows one `null` key & multiple `null` values.

---

### ❓ What will be the output?

> ```java
> Map<StringBuilder, String> map   new HashMap<>();
>
> StringBuilder key = new StringBuilder("A");
> map.put(key, "Value");
>
> key.append("B");
>
> System.out.println(map.get(key));
> ```

### 📝 Answer

```
null
```

🧠 _Explanation_

- `StringBuilder` is **mutable**
- `map.get(key);`, generate a Hash based on `"AB"` and check in the bucket.
- Since there is no content for `"AB"`, the output result is `null`

✅ _Correct Way_

```java
Map<String, String> map = new HashMap<>();
String key = "A";
map.put(key, "Value");
```

> String is immutable, StringBuilder is mutable.
> HashMap requires keys to be immutable.

---

### ❓ What will be the output? **(orElse() vs orElseGet())**

> ```java
> Optional<String> name = Optional.of("Dev");
>
> String value = name.orElse(getDefault());
> System.out.println(value);
>
> static String getDefault() {
>     System.out.println("Default called");
>     return "Default";
> }
> ```

### 📝 Answer

```
Default called
Dev
```

🧠 _Explanation_

- orElse() always executes the argument even when value is present.
- use `orElseGet()` → `name.orElseGet(() -> getDefault());`

```
Dev
```

---

### ❓ What will be the output? **(Optional get())**

> ```java
> Optional<String> name = Optional.empty();
> System.out.println(name.get());
> ```

### 📝 Answer

❌ Throws NoSuchElementException

---

### ❓ What will be the output? (Static + Inheritance Trap)

> ```java
> class A {
>     static {
>         System.out.println("A Static");
>     }
> }
>
> class B extends A {
>     static {
>         System.out.println("B Static");
>     }
> }
>
> public class Test {
>     public static void main(String[] args) {
>         new B();
>     }
> }
> ```

### 📝 Answer

```java
A Static
B Static
```

🧠 _Explanation_

Parent class loads before child class.

---

### ❓ What will be the output? (Instance vs Static Block)

> ```java
> class Test {
>     static {
>         System.out.println("Static");
>     }
>
>     {
>         System.out.println("Instance");
>     }
>
>     Test() {
>         System.out.println("Constructor");
>     }
>
>     public static void main(String[] args) {
>         new Test();
>     }
> }
> ```

### 📝 Answer

```java
Static
Instance
Constructor
```

🧠 _Explanation_

Static → Instance block → Constructor.

---

### ❓ What will be the output? (Method Overloading + Boxing)

> ```java
> static void test(long a) {
>     System.out.println("long");
> }
>
> static void test(Integer a) {
>     System.out.println("Integer");
> }
>
> public static void main(String[] args) {
>     test(10);
> }
> ```

### 📝 Answer

```java
long
```

🧠 _Explanation_

Widening beats boxing in method resolution.

---

### ❓ What will be the output? (Overloading + Varargs)

> ```java
> static void test(int a) {
>     System.out.println("int");
> }
>
> static void test(int... a) {
>     System.out.println("varargs");
> }
>
> public static void main(String[] args) {
>     test(10);
> }
> ```

### 📝 Answer

```java
int
```

🧠 _Explanation_

Exact match is preferred over varargs.

---

### ❓ What will be the output? (Ambiguous Overload)

> ```java
> static void test(Integer a) {
>     System.out.println("Integer");
> }
>
> static void test(Long a) {
>     System.out.println("Long");
> }
>
> public static void main(String[] args) {
>     test(null);
> }
> ```

### 📝 Answer

```java
Compile-time error
```

🧠 _Explanation_

`null` matches both wrappers → ambiguity.

---

### ❓ What will be the output? (finally + throw)

> ```java
> static int test() {
>     try {
>         throw new RuntimeException();
>     } finally {
>         return 10;
>     }
> }
>
> public static void main(String[] args) {
>     System.out.println(test());
> }
> ```

### 📝 Answer

```java
10
```

🧠 _Explanation_

`return` in `finally` suppresses exception.

---

### ❓ What will be the output? (try-with-resources Order)

> ```java
> class A implements AutoCloseable {
>     public void close() {
>         System.out.println("A Closed");
>     }
> }
>
> class B implements AutoCloseable {
>     public void close() {
>         System.out.println("B Closed");
>     }
> }
>
> public static void main(String[] args) {
>     try (A a = new A(); B b = new B()) {
>         System.out.println("Try");
>     }
> }
> ```

### 📝 Answer

```java
Try
B Closed
A Closed
```

🧠 _Explanation_

Resources close in reverse order of creation.

---

### ❓ What will be the output? (StringBuilder Trap)

> ```java
> StringBuilder sb = new StringBuilder("A");
> change(sb);
> System.out.println(sb);
>
> static void change(StringBuilder sb) {
>     sb.append("B");
>     sb = new StringBuilder("C");
> }
> ```

### 📝 Answer

```java
AB
```

🧠 _Explanation_

Reference reassignment doesn’t affect caller.

---

### ❓ What will be the output? (HashMap Mutation Trap)

> ```java
> Map<String, String> map = new HashMap<>();
> map.put("A", "1");
>
> for (String key : map.keySet()) {
>     map.put("B", "2");
> }
>
> System.out.println(map.size());
> ```

### 📝 Answer

```java
ConcurrentModificationException
```

🧠 _Explanation_

Structural modification during iteration is illegal.

---

### ❓ What will be the output? (Finalize Trap)

> ```java
> class Test {
>     protected void finalize() {
>         System.out.println("Finalize");
>     }
>
>     public static void main(String[] args) {
>         Test t = new Test();
>         t = null;
>         System.gc();
>     }
> }
> ```

### 📝 Answer

```java
May or may not print "Finalize"
```

🧠 _Explanation_

`finalize()` execution is not guaranteed.

---

### ❓ What will be the output? (Precedence Trap)

> ```java
> int a = 10;
> System.out.println(a++ + ++a + a++);
> ```

### 📝 Answer

```java
34
```

🧠 _Explanation_

Post → Pre → Post evaluation order.

---

### ❓ What will be the output? (Thread start vs run)

> ```java
> Thread t = new Thread(() -> System.out.println("Run"));
> t.run();
> ```

### 📝 Answer

```java
Run
```

🧠 _Explanation_

`run()` executes like a normal method.

---

### ❓ What will be the output? (Dead Code Trap)

> ```java
> if (true)
>     System.out.println("A");
> else
>     System.out.println("B");
> ```

### 📝 Answer

```java
A
```

🧠 _Explanation_

Compiler removes unreachable branch.

---

### ❓ What will be the output? (ClassCast Trap)

> ```java
> Object o = new Integer(10);
> String s = (String) o;
> ```

### 📝 Answer

```java
ClassCastException
```

🧠 _Explanation_

Runtime cast mismatch.

---

### ❓ What will be the output? (Volatile Visibility)

> ```java
> volatile boolean flag = false;
>
> new Thread(() -> {
>     while (!flag) {}
>     System.out.println("Done");
> }).start();
>
> flag = true;
> ```

### 📝 Answer

```java
Done
```

🧠 _Explanation_

`volatile` guarantees visibility across threads.
