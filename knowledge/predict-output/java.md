# Java — Predict the Output

> Read the code, guess what it prints, then tap to check.

### 1. String pool
```java
String a = "hi";
String b = "hi";
String c = new String("hi");
System.out.println((a == b) + " " + (a == c) + " " + a.equals(c) + " " + (a == c.intern()));
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `true false true true`

Literals share one pooled object. `new String` makes a new object. `intern()` returns the pooled one.

</details>

### 2. Integer cache
```java
Integer x = 127, y = 127;
Integer p = 128, q = 128;
System.out.println((x == y) + " " + (p == q));
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `true false`

`Integer` caches −128 to 127. Outside that range, `==` compares different objects. Use `.equals()`.

</details>

### 3. `i++` and `++i`
```java
int i = 5;
int r = i++ + ++i;
System.out.println(r + " " + i);
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `12 7`

`i++` gives 5 (then i = 6). `++i` makes i = 7 and gives 7. 5 + 7 = 12.

</details>

### 4. `finally` with return
```java
static int f() {
  try { return 1; }
  finally { return 2; }
}
System.out.println(f());
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `2`

`finally` runs last and its `return` replaces the earlier one. Never return from `finally`.

</details>

### 5. Strings are immutable
```java
String s = "Java";
s.concat(" 21");
s.toUpperCase();
System.out.println(s);
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `Java`

String methods return new strings. You must assign them: `s = s.concat(" 21");`.

</details>

### 6. Static method hiding vs overriding
```java
class A { static String s() { return "A"; } String i() { return "A"; } }
class B extends A { static String s() { return "B"; } String i() { return "B"; } }

A obj = new B();
System.out.println(obj.s() + obj.i());
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `AB`

Static methods are chosen by the variable type (`A`). Instance methods are chosen by the real object (`B`).

</details>

### 7. String concatenation order
```java
System.out.println(1 + 2 + "3" + 4 + 5);
System.out.println('a' + 1);
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `3345` and `98`

Left to right: 1 + 2 = 3, then text joining: "3" + "3" + "4" + "5". A `char` plus an `int` is a number ('a' = 97).

</details>

### 8. `remove(int)` vs `remove(Object)`
```java
List<Integer> list = new ArrayList<>(List.of(10, 20, 30));
list.remove(1);
list.remove(Integer.valueOf(10));
System.out.println(list);
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `[30]`

`remove(1)` removes the item at **index** 1 (20). `remove(Integer.valueOf(10))` removes the **value** 10.

</details>

### 9. Integer division and rounding
```java
System.out.println(5 / 2 + " " + 5 / 2.0 + " " + Math.round(2.5) + " " + Math.round(-2.5));
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `2 2.5 3 -2`

Int division drops the fraction. `Math.round` rounds half **up** (towards positive infinity), so −2.5 → −2.

</details>

### 10. Pass by value
```java
static void change(StringBuilder sb) {
  sb.append("!");
  sb = new StringBuilder("new");
}
StringBuilder s = new StringBuilder("hi");
change(s);
System.out.println(s);
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `hi!`

The method gets a copy of the reference. Changing the object works; pointing the copy at a new object doesn't affect the caller.

</details>

### 11. Stream laziness
```java
Stream.of(1, 2, 3)
      .filter(n -> { System.out.print("f" + n + " "); return n > 1; })
      .map(n -> { System.out.print("m" + n + " "); return n * 2; })
      .findFirst();
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `f1 f2 m2`

Streams process one item at a time and stop as soon as `findFirst` has its answer.

</details>
