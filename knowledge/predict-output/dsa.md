# DSA (Python) — Predict the Output & Complexity

> Guess the result or the Big O, then tap to check.

### 1. What's the time complexity?
```python
for i in range(n):
    for j in range(i, n):
        print(i, j)
```
<details class="reveal"><summary>Show answer</summary>

**O(n²)**

The inner loop runs n + (n−1) + … + 1 = n(n+1)/2 times.

</details>

### 2. What's the time complexity?
```python
i = 1
while i < n:
    i *= 2
```
<details class="reveal"><summary>Show answer</summary>

**O(log n)**

`i` doubles each time, so the loop runs about log₂(n) times.

</details>

### 3. What's the time complexity?
```python
def has_common(a, b):
    return any(x in b for x in a)   # a and b are lists of size n
```
<details class="reveal"><summary>Show answer</summary>

**O(n²)**

`x in list` is O(n). Turn `b` into a set first to make it O(n).

</details>

### 4. Recursion output
```python
def f(n):
    if n == 0:
        return 0
    return n + f(n - 1)

print(f(4))
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `10` (4 + 3 + 2 + 1 + 0)

</details>

### 5. Stack: valid brackets?
```python
def valid(s):
    stack, pairs = [], {")": "(", "]": "["}
    for ch in s:
        if ch in "([":
            stack.append(ch)
        elif not stack or stack.pop() != pairs[ch]:
            return False
    return not stack

print(valid("([])"), valid("(]"), valid("(("))
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `True False False`

"((" fails because the stack isn't empty at the end.

</details>

### 6. Binary search
```python
import bisect
nums = [1, 3, 3, 5, 8]
print(bisect.bisect_left(nums, 3), bisect.bisect_right(nums, 3), bisect.bisect_left(nums, 4))
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `1 3 3`

`bisect_left` gives the first position for 3; `bisect_right` gives the position after the last 3; 4 would be inserted at index 3.

</details>

### 7. Heap order
```python
import heapq
h = []
for x in [5, 1, 8, 3]:
    heapq.heappush(h, x)
print(heapq.heappop(h), heapq.heappop(h), h[0])
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `1 3 5`

`heapq` is a min-heap: pops come out smallest first; `h[0]` is the current smallest.

</details>

### 8. Space complexity
```python
def fib(n, memo={}):
    if n < 2:
        return n
    if n not in memo:
        memo[n] = fib(n - 1) + fib(n - 2)
    return memo[n]
```
Time and extra space?
<details class="reveal"><summary>Show answer</summary>

**Time O(n), space O(n)**

Each value is computed once; the memo and the recursion stack both grow to n.

</details>

### 9. Sliding window
```python
def max_sum(nums, k):
    window = sum(nums[:k]); best = window
    for i in range(k, len(nums)):
        window += nums[i] - nums[i - k]
        best = max(best, window)
    return best

print(max_sum([2, 1, 5, 1, 3, 2], 3))
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `9` (5 + 1 + 3)

</details>
