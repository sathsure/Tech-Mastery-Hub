### ❓ Merge Two Arrays Alternately

> ```java
> // INPUT
> int[] x = {6, 4, 8, 3, 5};
> int[] y = {4, 5, 1, 3, 8};
>
> // OUTPUT
> int[] k = {4, 6, 5, 4, 1, 8, 3, 3, 8, 5};
> ```

### 📝 Answer

```java
List<Integer> list = new ArrayList<>();

for (int i = 0; i < x.length; i++) {
    list.add(y[i]);  // auto-boxing int → Integer
    list.add(x[i]);
}

int[] k = list.stream()
              .mapToInt(Integer::intValue)
              .toArray();
```

### ❓ Reverse an Array

### 📝 Answer

```java
int[] arr = {1, 2, 3, 4};

System.out.println(Arrays.toString(arr)); // [1,2,3,4]
for(int i=0,j=arr.length -1;i<j;i++,j--) {
  int temp = arr[i];
  arr[i] = arr[j];
  arr[j]=temp;
}
System.out.println(Arrays.toString(arr)); // [4,3,2,1]

/* ---- Works only for object arrays, not primitives.---- */
Integer[] arr = {1, 2, 3};
System.out.println(Arrays.toString(arr)); // [1,2,3,4]
Collections.reverse(Arrays.asList(arr));
System.out.println(Arrays.toString(arr)); // [4,3,2,1]
```

### ❓ Find First Non-Repeating Character

> Input: "swiss"
> Output: 'w'

### 📝 Answer

```java
public static Character firstNonRepeating(String input) {
    Map<Character, Long> countMap =
            input.chars()
                 .mapToObj(c -> (char) c)
                 .collect(Collectors.groupingBy(
                         Function.identity(),
                         LinkedHashMap::new,
                         Collectors.counting()
                 ));

    return countMap.entrySet()
                   .stream()
                   .filter(e -> e.getValue() == 1)
                   .map(Map.Entry::getKey)
                   .findFirst()
                   .orElse(null);
}
```

---

### ❓ Remove Duplicates from a List (Preserve Order)

### 📝 Answer

```java
public static List<Integer> removeDuplicates(List<Integer> list) {
    return new ArrayList<>(new LinkedHashSet<>(list));
}

// OR

Set<Integer> set = list
                    .stream()
                    .collect(Collectors.toCollection(LinkedHashSet::new))
```

---

### ❓ Count Word Occurrences

> Input: "java spring java angular spring java"

### 📝 Answer

```java
public static Map<String, Long> wordCount(String input) {
    return Arrays.stream(input.split(" "))
            .collect(Collectors.groupingBy(
                    word -> word,
                    LinkedHashMap::new,
                    Collectors.counting()
            ));
}
```

---

### ❓ Check if String is Palindrome (Ignore Case & Spaces)

### 📝 Answer

```java
public static boolean isPalindrome(String s) {
    String cleaned = s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
    return new StringBuilder(cleaned).reverse().toString().equals(cleaned);
}
```

---

### ❓ Find Second Highest Number in Array

### 📝 Answer

```java
public static int secondHighest(int[] arr) {
    int first = Integer.MIN_VALUE;
    int second = Integer.MIN_VALUE;

    for (int num : arr) {
        if (num > first) {
            second = first;
            first = num;
        } else if (num > second && num != first) {
            second = num;
        }
    }
    return second;
}
```

---

### ❓ Thread-Safe Counter

### 📝 Answer

```java
class Counter {
    private AtomicInteger count = new AtomicInteger(0);

    public void increment() {
        count.incrementAndGet();
    }

    public int getValue() {
        return count.get();
    }
}
```

---

### ❓ Reverse Words in a Sentence

> Input: "Java is powerful"
> Output: "powerful is Java"

### 📝 Answer

```java
public static String reverseWords(String s) {
    String[] words = s.split(" ");
    Collections.reverse(Arrays.asList(words));
    return String.join(" ", words);
}
```

---

### ❓ Reverse a LinkedList

### 📝 Answer

```java
public class Main {
    public static void main(String[] args) {

        Node node = new Node(1);                 // create head node
        node.next = new Node(1);                 // link second node
        node.next.next = new Node(1);            // link third node
        node.next.next.next = new Node(1);       // link fourth node

        printNode(node);                         // print original list

        node = reverse(node);                    // update head after reversal

        printNode(node);                         // print reversed list
    }

    static void printNode(Node node) {
        Node curr = node;                        // start traversal from head
        while (curr != null) {                   // traverse till end of list
            System.out.println(curr.data);       // print current node data
            curr = curr.next;                    // move to next node
        }
    }

    static Node reverse(Node node) {
        Node prev = null;                        // will become new head
        Node curr = node;                        // start from current head

        while (curr != null) {                   // iterate till list ends
            Node next = curr.next;               // store next node
            curr.next = prev;                    // reverse the link
            prev = curr;                         // move prev forward
            curr = next;                         // move curr forward
        }
        return prev;                             // return new head
    }
}

class Node {
    int data;
    Node next;

    Node(int data) {
        this.data = data;                        // store node value
        this.next = null;                        // initialize next as null
    }
}
```

---

### ❓ Employee–Department Related Questions

> You are given two classes, `Employee` and `Department`.
> Each department references employees using `empId`.
> Write a program to:
>
> 1. Find the total number of employees
> 2. Find the total number of employees grouped by department name
> 3. Identify the department with the lowest number of employees
> 4. Identify the department with the highest number of employees
> 5. Calculate the average employee score

### 📝 Answer

```java
/* ---- Model Classes ----*/
class Employee {
    String empId;
    String empName;
    int empScore;
}

class Department {
    String depId;
    String depName;
    String empId; // Foreign key reference
}


/* ---- Total Number of Employees ----*/
int totalEmployees = employees.size(); // Direct count

/* ---- Employees per Department ----*/
Map<String, Long> empCountByDept =
    departments.stream()
        .collect(Collectors.groupingBy(
            d -> d.depName,
            Collectors.counting()
        )); // Group by department name

/* ---- Department with Lowest Employees ----*/
String minDept =
    empCountByDept.entrySet()
        .stream()
        .min(Map.Entry.comparingByValue())
        .get()
        .getKey(); // Lowest count department

/* ---- Department with Highest Employees ----*/
String maxDept =
    empCountByDept.entrySet()
        .stream()
        .max(Map.Entry.comparingByValue())
        .get()
        .getKey(); // Highest count department

/* ---- Average Employee Score ----*/
double avgScore =
    employees.stream()
        .mapToInt(e -> e.empScore)
        .average()
        .orElse(0); // Handles empty list safely
```

---

### ❓ Perfect Numbers

> Write a program to find all **perfect numbers** up to a given input `N`.
> A perfect number is one where the sum of its positive divisors (excluding itself) equals the number.

### 📝 Answer

```java
static List<Integer> findPerfectNumbers(int n) {
    List<Integer> result = new ArrayList<>();

    for (int i = 2; i <= n; i++) {
        int sum = 1; // 1 is always a divisor

        for (int j = 2; j <= i / 2; j++) {
            if (i % j == 0) sum += j; // Add divisor
        }

        if (sum == i) result.add(i); // Perfect number check
    }
    return result;
}
```

**Time Complexity:** `O(n²)`
**Output (1000):** `[6, 28, 496]`

---

### ❓ Two Sum Problem

> Given an integer array and a target value, find the indices of two numbers whose sum equals the target.
> Implement:
>
> - A brute-force solution (O(n²))
> - An optimized solution (O(n))

### 📝 Answer

**Approach 1: Brute Force (O(n²))**

```java
static int[] twoSumBrute(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++) {
        for (int j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] == target)
                return new int[]{i, j}; // Match found
        }
    }
    return new int[]{};
}
```

**Approach 2: Optimized (O(n)) – HashMap**

```java
static int[] twoSumOptimized(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();

    for (int i = 0; i < nums.length; i++) {
        int diff = target - nums[i];

        if (map.containsKey(diff))
            return new int[]{map.get(diff), i}; // Complement found

        map.put(nums[i], i); // Store number with index
    }
    return new int[]{};
}
```

---

### ❓ Count Segments in a String

> ```java
> Input:  "Hello, my name is John"
> Output: 5
>
> Input:  "Hello"
> Output: 1
> ```

### 📝 Answer

```java
public int countSegments(String s) {
    int count = 0;
    for (int i = 0; i < s.length(); i++) {
        if (s.charAt(i) != ' ' && (i == 0 || s.charAt(i - 1) == ' ')) {
            count++;
        }
    }
    return count;
}
```
