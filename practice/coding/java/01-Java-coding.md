# ☕ Java Coding Practice

### ❓ Merge Two Arrays Alternately

**Level:** 🟡 Intermediate

> ```java
> // INPUT
> int[] x = {6, 4, 8, 3, 5};
> int[] y = {4, 5, 1, 3, 8};
>
> // OUTPUT (y first, then x, one at a time)
> int[] k = {4, 6, 5, 4, 1, 8, 3, 3, 8, 5};
> ```

### 📝 Answer

```java
static int[] mergeAlternately(int[] x, int[] y) {
    int[] k = new int[x.length + y.length];
    int pos = 0;
    for (int i = 0; i < Math.max(x.length, y.length); i++) {
        if (i < y.length) k[pos++] = y[i];   // y first
        if (i < x.length) k[pos++] = x[i];
    }
    return k;
}
```

🧠 **How:** walk both arrays with one index and copy one element from each. The `if` checks also handle arrays of **different lengths** — the leftover elements are added at the end. O(n) time, no boxing into a `List`.

---

### ❓ Reverse an Array

**Level:** 🟢 Beginner

### 📝 Answer

**Two pointers (works for primitive arrays):**

```java
int[] arr = {1, 2, 3, 4};
for (int i = 0, j = arr.length - 1; i < j; i++, j--) {
    int temp = arr[i];   // swap the two ends
    arr[i] = arr[j];
    arr[j] = temp;
}
System.out.println(Arrays.toString(arr)); // [4, 3, 2, 1]
```

🧠 Swap the first and last, move both pointers inward, stop when they meet. O(n) time, O(1) extra space.

**For object arrays only:**

```java
Integer[] boxed = {1, 2, 3, 4};
Collections.reverse(Arrays.asList(boxed));   // the list view writes through to the array
System.out.println(Arrays.toString(boxed));  // [4, 3, 2, 1]
```

> ⚠️ `Arrays.asList(int[])` gives a `List<int[]>` with **one** element, so `Collections.reverse` does nothing for primitive arrays.

---

### ❓ Find First Non-Repeating Character

**Level:** 🟢 Beginner

> Input: `"swiss"` → Output: `'w'`

### 📝 Answer

```java
public static Character firstNonRepeating(String input) {
    Map<Character, Long> counts = input.chars()
            .mapToObj(c -> (char) c)
            .collect(Collectors.groupingBy(
                    Function.identity(),
                    LinkedHashMap::new,          // keeps first-seen order
                    Collectors.counting()));

    return counts.entrySet().stream()
            .filter(e -> e.getValue() == 1)
            .map(Map.Entry::getKey)
            .findFirst()
            .orElse(null);
}
```

🧠 **How:** count each character, keeping the order they first appear (`LinkedHashMap`), then return the first one with count 1. With a plain `HashMap` the order would be random and the answer could be wrong.

---

### ❓ Remove Duplicates from a List (Preserve Order)

**Level:** 🟢 Beginner

### 📝 Answer

```java
public static List<Integer> removeDuplicates(List<Integer> list) {
    return new ArrayList<>(new LinkedHashSet<>(list));
}

// or with streams
List<Integer> unique = list.stream().distinct().toList();
```

🧠 A `Set` drops duplicates; `LinkedHashSet` remembers insertion order. `distinct()` also keeps the first occurrence in order.

---

### ❓ Count Word Occurrences

**Level:** 🟡 Intermediate

> Input: `"java spring java angular spring java"` → `{java=3, spring=2, angular=1}`

### 📝 Answer

```java
public static Map<String, Long> wordCount(String input) {
    return Arrays.stream(input.trim().split("\\s+"))   // split on any run of spaces
            .collect(Collectors.groupingBy(
                    word -> word,
                    LinkedHashMap::new,
                    Collectors.counting()));
}
```

🧠 `groupingBy` puts equal words in one group; `counting()` counts each group. Splitting on `"\\s+"` (not `" "`) avoids empty "words" when there are double spaces.

---

### ❓ Check if String is Palindrome (Ignore Case & Spaces)

**Level:** 🟢 Beginner

### 📝 Answer

```java
public static boolean isPalindrome(String s) {
    String cleaned = s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
    return new StringBuilder(cleaned).reverse().toString().equals(cleaned);
}
// isPalindrome("A man, a plan, a canal: Panama") → true
```

🧠 Remove everything except letters and digits, lower-case it, and compare it with its reverse.

**Without extra memory** — two pointers from both ends, skipping non-letters:

```java
int i = 0, j = s.length() - 1;
while (i < j) {
    if (!Character.isLetterOrDigit(s.charAt(i))) i++;
    else if (!Character.isLetterOrDigit(s.charAt(j))) j--;
    else if (Character.toLowerCase(s.charAt(i++)) != Character.toLowerCase(s.charAt(j--))) return false;
}
return true;
```

---

### ❓ Find Second Highest Number in Array

**Level:** 🟢 Beginner

### 📝 Answer

```java
public static int secondHighest(int[] arr) {
    int first = Integer.MIN_VALUE;
    int second = Integer.MIN_VALUE;
    for (int num : arr) {
        if (num > first) {          // new highest: old highest becomes second
            second = first;
            first = num;
        } else if (num > second && num != first) {
            second = num;           // between second and first
        }
    }
    return second;
}
// secondHighest(new int[]{10, 5, 10, 8}) → 8
```

🧠 One pass, O(n). `num != first` ignores duplicates of the highest. If there is no second distinct value (e.g. `{5, 5}`), it returns `Integer.MIN_VALUE` — say how you'd handle that (throw, or return `OptionalInt`).

---

### ❓ Thread-Safe Counter

**Level:** 🟡 Intermediate

### 📝 Answer

```java
class Counter {
    private final AtomicInteger count = new AtomicInteger();

    public void increment() { count.incrementAndGet(); }
    public int getValue()   { return count.get(); }
}
```

🧠 `count++` on a plain `int` is three steps (read, add, write), so two threads can lose updates. `AtomicInteger.incrementAndGet()` does it as one **atomic** step without locks. A `synchronized` method also works, but is slower under heavy contention.

---

### ❓ Reverse Words in a Sentence

**Level:** 🟢 Beginner

> Input: `"Java is powerful"` → Output: `"powerful is Java"`

### 📝 Answer

```java
public static String reverseWords(String s) {
    List<String> words = Arrays.asList(s.trim().split("\\s+"));
    Collections.reverse(words);
    return String.join(" ", words);
}
```

🧠 Split into words, reverse the list, join with single spaces. `trim()` and `"\\s+"` also clean up extra spaces.

---

### ❓ Reverse a LinkedList

**Level:** 🟢 Beginner

### 📝 Answer

```java
class Node {
    int data;
    Node next;
    Node(int data) { this.data = data; }
}

static Node reverse(Node head) {
    Node prev = null;
    Node curr = head;
    while (curr != null) {
        Node next = curr.next;   // 1. remember the rest of the list
        curr.next = prev;        // 2. point this node backwards
        prev = curr;             // 3. move prev forward
        curr = next;             // 4. move curr forward
    }
    return prev;                 // prev is the new head
}

// 1 → 2 → 3 → 4   becomes   4 → 3 → 2 → 1
Node head = new Node(1);
head.next = new Node(2);
head.next.next = new Node(3);
head.next.next.next = new Node(4);
head = reverse(head);
```

```text
Before: null   1 → 2 → 3 → 4 → null
Step 1: null ← 1   2 → 3 → 4
Step 2: null ← 1 ← 2   3 → 4
...
After:  null ← 1 ← 2 ← 3 ← 4   (head = 4)
```

O(n) time, O(1) space.

---

### ❓ Employee–Department Related Questions

**Level:** 🟡 Intermediate

> You are given two classes, `Employee` and `Department`.
> Each department row references an employee using `empId`.
> Write a program to:
>
> 1. Find the total number of employees
> 2. Find the total number of employees grouped by department name
> 3. Identify the department with the lowest number of employees
> 4. Identify the department with the highest number of employees
> 5. Calculate the average employee score

### 📝 Answer

```java
record Employee(String empId, String empName, int empScore) { }
record Department(String depId, String depName, String empId) { } // one row per employee in the department

// 1. Total employees
int totalEmployees = employees.size();

// 2. Employees per department
Map<String, Long> countByDept = departments.stream()
        .collect(Collectors.groupingBy(Department::depName, Collectors.counting()));

// 3. Department with the fewest employees
String minDept = countByDept.entrySet().stream()
        .min(Map.Entry.comparingByValue())
        .map(Map.Entry::getKey)
        .orElse(null);

// 4. Department with the most employees
String maxDept = countByDept.entrySet().stream()
        .max(Map.Entry.comparingByValue())
        .map(Map.Entry::getKey)
        .orElse(null);

// 5. Average score
double avgScore = employees.stream()
        .mapToInt(Employee::empScore)
        .average()
        .orElse(0);
```

🧠 `groupingBy` + `counting` builds a `department → count` map; `min`/`max` with `comparingByValue()` pick the smallest/largest count. Using `.map(...).orElse(null)` instead of `.get()` avoids an exception when the list is empty.

---

### ❓ Perfect Numbers

**Level:** 🟢 Beginner

> Write a program to find all **perfect numbers** up to a given input `N`.
> A perfect number equals the sum of its positive divisors excluding itself (6 = 1 + 2 + 3).

### 📝 Answer

```java
static List<Integer> findPerfectNumbers(int n) {
    List<Integer> result = new ArrayList<>();
    for (int i = 2; i <= n; i++) {
        int sum = 1;                                  // 1 divides everything
        for (int j = 2; j * j <= i; j++) {            // only up to √i
            if (i % j == 0) {
                sum += j;
                if (j != i / j) sum += i / j;         // add the paired divisor too
            }
        }
        if (sum == i) result.add(i);
    }
    return result;
}
// findPerfectNumbers(10000) → [6, 28, 496, 8128]
```

🧠 Divisors come in pairs (for 28: 2 × 14, 4 × 7), so checking up to √i finds them all. That makes it **O(n√n)** instead of O(n²) for the simple "check every j up to i/2" version.

---

### ❓ Two Sum Problem

**Level:** 🟡 Intermediate

> Given an integer array and a target value, return the indices of two numbers that add up to the target.
>
> - A brute-force solution (O(n²))
> - An optimized solution (O(n))

### 📝 Answer

**Brute force — try every pair, O(n²):**

```java
static int[] twoSumBrute(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++)
        for (int j = i + 1; j < nums.length; j++)
            if (nums[i] + nums[j] == target) return new int[]{i, j};
    return new int[]{};
}
```

**Optimized — remember what you've seen, O(n):**

```java
static int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();   // value → index
    for (int i = 0; i < nums.length; i++) {
        int need = target - nums[i];
        if (seen.containsKey(need)) return new int[]{seen.get(need), i};
        seen.put(nums[i], i);
    }
    return new int[]{};
}
// twoSum(new int[]{2, 7, 11, 15}, 9) → [0, 1]
```

🧠 For each number, ask "have I already seen the number that completes it?" A `HashMap` answers in O(1). Checking **before** inserting stops a number from pairing with itself.

---

### ❓ Count Segments in a String

**Level:** 🟡 Intermediate

> ```text
> Input:  "Hello, my name is John"  → Output: 5
> Input:  "Hello"                   → Output: 1
> ```

### 📝 Answer

```java
public int countSegments(String s) {
    int count = 0;
    for (int i = 0; i < s.length(); i++) {
        // a segment starts at a non-space whose previous character is a space (or the start)
        if (s.charAt(i) != ' ' && (i == 0 || s.charAt(i - 1) == ' ')) count++;
    }
    return count;
}
```

🧠 Count **where words start** instead of splitting — works with leading, trailing and double spaces, and uses O(1) memory. (`s.split(" ")` would count empty strings between double spaces.)
