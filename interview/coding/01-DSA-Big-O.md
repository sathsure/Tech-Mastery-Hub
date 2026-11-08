# DSA Basics: Time and Space Complexity

## Complexity Basics

### ❓ What is time complexity?

### 📝 Answer

Time complexity describes how the number of steps an algorithm performs grows as the input size `n` grows.

It is written in **Big O notation**, which keeps only the fastest-growing term and drops constants:

- `3n + 5` → `O(n)`
- `n² + 100n` → `O(n²)`
- `500` → `O(1)`

It measures **growth**, not seconds: an `O(n)` algorithm on 2× the data does about 2× the work.

---

### ❓ What is space complexity?

### 📝 Answer

Space complexity is the **extra memory** an algorithm needs as the input grows (auxiliary space). The input itself is usually not counted.

```python
def total(nums):          # O(1) extra space: one variable
    result = 0
    for num in nums:
        result += num
    return result

def doubled(nums):        # O(n) extra space: a new list of size n
    return [num * 2 for num in nums]

def count_down(n):        # O(n) extra space: n frames on the call stack
    if n == 0:
        return
    count_down(n - 1)
```

**Remember:** recursion uses stack space, one frame per active call.

---

### ❓ What do Big O, Big Omega (Ω) and Big Theta (Θ) mean?

### 📝 Answer

| Notation | Meaning | Example (linear search) |
|---|---|---|
| Big O | Upper bound — at most this growth | `O(n)` |
| Big Omega (Ω) | Lower bound — at least this growth | `Ω(1)` (found at first position) |
| Big Theta (Θ) | Tight bound — upper and lower bounds match | `Θ(n)` for the worst case (item missing: every element is checked) |

In interviews, "complexity" normally means the **worst-case Big O**.

---

### ❓ What are the common Big O complexities, from fastest to slowest?

### 📝 Answer

| Big O | Name | Typical example | Steps for n = 1,000,000 |
|---|---|---|---|
| `O(1)` | Constant | Index into a list, dict lookup | 1 |
| `O(log n)` | Logarithmic | Binary search | ~20 |
| `O(√n)` | Square root | Prime check by trial division | 1,000 |
| `O(n)` | Linear | One loop over the input | 1,000,000 |
| `O(n log n)` | Linearithmic | Merge sort, `sorted()` | ~20,000,000 |
| `O(n²)` | Quadratic | Two nested loops | 10¹² |
| `O(n³)` | Cubic | Three nested loops | 10¹⁸ |
| `O(2ⁿ)` | Exponential | All subsets, naive Fibonacci | impossible |
| `O(n!)` | Factorial | All permutations | impossible |

**Rule of thumb:** about 10⁸ simple operations take roughly a second, so for `n = 10⁵` you need `O(n log n)` or better.

## Big O with Python Examples

### ❓ What is O(1) — constant time?

### 📝 Answer

The work does not depend on the input size.

```python
def first_item(items):
    return items[0]              # index access: O(1)

def get_price(prices, product):
    return prices.get(product)   # dict lookup: O(1) on average
```

---

### ❓ What is O(log n) — logarithmic time?

### 📝 Answer

Each step **halves** the remaining work. Doubling the input adds only one step.

```python
def binary_search(nums, target):   # nums must be sorted
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            left = mid + 1           # discard the left half
        else:
            right = mid - 1          # discard the right half
    return -1
```

Searching 1,000,000 sorted items takes at most about 20 comparisons.

---

### ❓ What is O(√n) — square-root time?

### 📝 Answer

The loop runs up to the square root of `n`. Classic example: checking whether a number is prime — if `n` has a factor, one factor is at most `√n`.

```python
def is_prime(n):
    if n < 2:
        return False
    i = 2
    while i * i <= n:            # runs about √n times
        if n % i == 0:
            return False
        i += 1
    return True
```

---

### ❓ What is O(n) — linear time?

### 📝 Answer

The work grows in direct proportion to the input: one pass over the data.

```python
def find_max(nums):
    best = nums[0]
    for num in nums:             # n iterations
        if num > best:
            best = num
    return best
```

---

### ❓ What is O(n log n) — linearithmic time?

### 📝 Answer

Typical of efficient sorting: the data is split `log n` times and each level does `O(n)` work. Python's `sorted()` and `list.sort()` are `O(n log n)`.

```python
def merge_sort(nums):
    if len(nums) <= 1:
        return nums
    mid = len(nums) // 2
    left = merge_sort(nums[:mid])        # log n levels of splitting
    right = merge_sort(nums[mid:])
    merged, i, j = [], 0, 0
    while i < len(left) and j < len(right):   # O(n) merging per level
        if left[i] <= right[j]:
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            j += 1
    return merged + left[i:] + right[j:]
```

---

### ❓ What is O(n²) — quadratic time?

### 📝 Answer

A loop inside a loop, both over the input. Doubling the input makes it 4× slower.

```python
def has_duplicate_slow(nums):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):   # compares every pair
            if nums[i] == nums[j]:
                return True
    return False
```

The `O(n)` alternative uses a set: `return len(set(nums)) != len(nums)`.

---

### ❓ What is O(n³) — cubic time?

### 📝 Answer

Three nested loops over the input. Doubling the input makes it 8× slower.

```python
def count_zero_triplets(nums):
    n, count = len(nums), 0
    for i in range(n):
        for j in range(i + 1, n):
            for k in range(j + 1, n):       # every triplet
                if nums[i] + nums[j] + nums[k] == 0:
                    count += 1
    return count
```

Sorting plus two pointers brings the "three numbers that sum to zero" problem down to `O(n²)` (see the 3Sum practice question).

---

### ❓ What is O(2ⁿ) — exponential time?

### 📝 Answer

Each step branches into two more calls. Naive recursive Fibonacci recomputes the same values again and again:

```python
def fib_slow(n):                 # O(2ⁿ)
    if n < 2:
        return n
    return fib_slow(n - 1) + fib_slow(n - 2)

def fib_fast(n):                 # O(n) time, O(1) space
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
```

Remembering results (memoization or dynamic programming) usually removes the exponential blow-up.

## Calculating Complexity

### ❓ How do you calculate the time complexity of a piece of code?

### 📝 Answer

1. **Sequential steps add:** `O(n) + O(n)` → `O(n)`.
2. **Nested loops multiply:** a loop over `n` inside a loop over `n` → `O(n²)`.
3. **Drop constants:** `O(2n)` → `O(n)`.
4. **Keep the dominant term:** `O(n² + n)` → `O(n²)`.
5. **Different inputs get different variables:** loops over `a` and `b` → `O(a + b)` one after another, `O(a × b)` nested.
6. **Halving the problem each step** → `O(log n)`.
7. **Recursion:** (number of calls) × (work per call).

```python
def example(a, b):
    for x in a:          # O(len(a))
        print(x)
    for x in a:          # nested: O(len(a) × len(b))
        for y in b:
            print(x, y)
# Total: O(a + a·b) → O(a·b)
```

---

### ❓ What is amortized time complexity?

### 📝 Answer

The **average cost per operation over a long sequence**, even if a single operation is occasionally expensive.

Python's `list.append()` is `O(1)` amortized: when the internal array is full, Python copies it into a larger one (`O(n)` once), but this happens so rarely that the average cost per append stays constant.

---

### ❓ What is the time complexity of common Python operations?

### 📝 Answer

| Operation | list | dict / set |
|---|---|---|
| Access by index `a[i]` | `O(1)` | — |
| Lookup `x in c` | `O(n)` | `O(1)` average |
| Append / add | `O(1)` amortized | `O(1)` average |
| Insert or delete at the start | `O(n)` | — |
| `pop()` from the end | `O(1)` | — |
| `pop(0)` | `O(n)` — use `collections.deque` for `O(1)` | — |
| Sort | `O(n log n)` | — |
| Slice `a[i:j]` | `O(j - i)` | — |
| Delete by key | — | `O(1)` average |

`heapq.heappush` / `heappop` are `O(log n)`; `collections.deque.appendleft` / `popleft` are `O(1)`.
