# DSA Coding Questions in Python (LeetCode)

## Python: Arrays and Hashing

### ❓ Two Sum (LeetCode 1)

Given an array `nums` and an integer `target`, return the indices of the two numbers that add up to `target`. Exactly one solution exists, and the same element can't be used twice.

Example: `nums = [2, 7, 11, 15], target = 9` → `[0, 1]`

### 📝 Answer

**Pattern:** hash map. For each number, check whether its complement (`target - num`) was already seen.

```python
def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}                        # value -> index
    for i, num in enumerate(nums):
        need = target - num
        if need in seen:
            return [seen[need], i]
        seen[num] = i
    return []

print(two_sum([2, 7, 11, 15], 9))   # [0, 1]
print(two_sum([3, 2, 4], 6))        # [1, 2]
```

**Complexity:** `O(n)` time, `O(n)` space. The brute-force double loop is `O(n²)`.

---

### ❓ Three Sum (LeetCode 15)

Given an array `nums`, return all **unique** triplets `[a, b, c]` with `a + b + c == 0`.

Example: `nums = [-1, 0, 1, 2, -1, -4]` → `[[-1, -1, 2], [-1, 0, 1]]`

### 📝 Answer

**Pattern:** sort, then fix one number and find the other two with **two pointers**. Skip equal neighbours to avoid duplicate triplets.

```python
def three_sum(nums: list[int]) -> list[list[int]]:
    nums.sort()
    result = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue                     # same first number: skip duplicates
        if nums[i] > 0:
            break                        # sorted: three positives can't sum to 0
        left, right = i + 1, len(nums) - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total < 0:
                left += 1                # need a bigger sum
            elif total > 0:
                right -= 1               # need a smaller sum
            else:
                result.append([nums[i], nums[left], nums[right]])
                left += 1
                right -= 1
                while left < right and nums[left] == nums[left - 1]:
                    left += 1            # skip duplicate second numbers
    return result

print(three_sum([-1, 0, 1, 2, -1, -4]))  # [[-1, -1, 2], [-1, 0, 1]]
print(three_sum([0, 0, 0, 0]))           # [[0, 0, 0]]
```

**Complexity:** `O(n²)` time (sorting is `O(n log n)`), `O(1)` extra space apart from the output.

---

### ❓ Contains Duplicate (LeetCode 217)

Return `True` if any value appears at least twice in `nums`.

### 📝 Answer

```python
def contains_duplicate(nums: list[int]) -> bool:
    return len(set(nums)) != len(nums)
```

**Complexity:** `O(n)` time, `O(n)` space.

---

### ❓ Valid Anagram (LeetCode 242)

Return `True` if `t` is an anagram of `s` (same letters, same counts).

Example: `s = "anagram", t = "nagaram"` → `True`

### 📝 Answer

```python
from collections import Counter

def is_anagram(s: str, t: str) -> bool:
    return Counter(s) == Counter(t)
```

**Complexity:** `O(n)` time, `O(k)` space for `k` distinct characters.

---

### ❓ Group Anagrams (LeetCode 49)

Group the words that are anagrams of each other.

Example: `["eat", "tea", "tan", "ate", "nat", "bat"]` → `[["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]`

### 📝 Answer

**Pattern:** anagrams share the same sorted letters, so use those as the dictionary key.

```python
from collections import defaultdict

def group_anagrams(words: list[str]) -> list[list[str]]:
    groups = defaultdict(list)
    for word in words:
        groups["".join(sorted(word))].append(word)
    return list(groups.values())
```

**Complexity:** `O(n · k log k)` for `n` words of length `k`.

---

### ❓ Top K Frequent Elements (LeetCode 347)

Return the `k` most frequent numbers.

Example: `nums = [1, 1, 1, 2, 2, 3], k = 2` → `[1, 2]`

### 📝 Answer

```python
import heapq
from collections import Counter

def top_k_frequent(nums: list[int], k: int) -> list[int]:
    counts = Counter(nums)
    return heapq.nlargest(k, counts.keys(), key=counts.get)
```

**Complexity:** `O(n log k)` time, `O(n)` space.

---

### ❓ Product of Array Except Self (LeetCode 238)

Return an array where `answer[i]` is the product of all numbers except `nums[i]`, without using division, in `O(n)`.

Example: `[1, 2, 3, 4]` → `[24, 12, 8, 6]`

### 📝 Answer

**Pattern:** prefix and suffix products. First store the product of everything to the left, then multiply by the product of everything to the right.

```python
def product_except_self(nums: list[int]) -> list[int]:
    n = len(nums)
    result = [1] * n
    prefix = 1
    for i in range(n):
        result[i] = prefix           # product of nums[0..i-1]
        prefix *= nums[i]
    suffix = 1
    for i in range(n - 1, -1, -1):
        result[i] *= suffix          # times product of nums[i+1..]
        suffix *= nums[i]
    return result
```

**Complexity:** `O(n)` time, `O(1)` extra space apart from the output.

## Python: Binary Search

### ❓ Search Insert Position (LeetCode 35)

Given a sorted array of distinct integers and a target, return the index of the target. If it is absent, return the index where it would be inserted to keep the array sorted.

Example: `nums = [1, 3, 5, 6], target = 2` → `1`

### 📝 Answer

**Pattern:** binary search for the first position whose value is `>= target` (the "lower bound").

```python
def search_insert(nums: list[int], target: int) -> int:
    left, right = 0, len(nums)       # the answer can be len(nums)
    while left < right:
        mid = (left + right) // 2
        if nums[mid] < target:
            left = mid + 1           # answer is to the right of mid
        else:
            right = mid              # mid may be the answer
    return left

print(search_insert([1, 3, 5, 6], 5))  # 2 (found)
print(search_insert([1, 3, 5, 6], 2))  # 1 (insert between 1 and 3)
print(search_insert([1, 3, 5, 6], 7))  # 4 (insert at the end)
print(search_insert([1, 3, 5, 6], 0))  # 0 (insert at the start)
```

Python's standard library does the same: `bisect.bisect_left(nums, target)`.

**Complexity:** `O(log n)` time, `O(1)` space.

---

### ❓ Search in Rotated Sorted Array (LeetCode 33)

A sorted array was rotated at an unknown pivot (e.g. `[4, 5, 6, 7, 0, 1, 2]`). Return the index of `target`, or `-1`, in `O(log n)`.

### 📝 Answer

**Pattern:** binary search. At every step one half is still sorted; check whether the target lies inside that sorted half.

```python
def search_rotated(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        if nums[left] <= nums[mid]:              # left half is sorted
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:                                    # right half is sorted
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    return -1

print(search_rotated([4, 5, 6, 7, 0, 1, 2], 0))  # 4
```

**Complexity:** `O(log n)` time, `O(1)` space.

## Python: Two Pointers and Sliding Window

### ❓ Valid Palindrome (LeetCode 125)

After lower-casing and removing non-alphanumeric characters, is the string a palindrome?

Example: `"A man, a plan, a canal: Panama"` → `True`

### 📝 Answer

```python
def is_palindrome(s: str) -> bool:
    cleaned = [ch.lower() for ch in s if ch.isalnum()]
    return cleaned == cleaned[::-1]
```

**Complexity:** `O(n)` time, `O(n)` space. A two-pointer version that skips non-alphanumeric characters uses `O(1)` space.

---

### ❓ Container With Most Water (LeetCode 11)

Given wall heights, choose two walls that hold the most water: `width × min(height)`.

Example: `[1, 8, 6, 2, 5, 4, 8, 3, 7]` → `49`

### 📝 Answer

**Pattern:** two pointers at both ends. Always move the **shorter** wall inward — moving the taller one can never increase the area.

```python
def max_area(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    best = 0
    while left < right:
        best = max(best, (right - left) * min(height[left], height[right]))
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return best
```

**Complexity:** `O(n)` time, `O(1)` space.

---

### ❓ Longest Substring Without Repeating Characters (LeetCode 3)

Return the length of the longest substring with no repeated characters.

Example: `"abcabcbb"` → `3` (`"abc"`)

### 📝 Answer

**Pattern:** sliding window. Remember where each character was last seen; when a character repeats inside the window, move the window's start past it.

```python
def length_of_longest_substring(s: str) -> int:
    last_seen = {}                   # character -> last index
    start = best = 0
    for i, ch in enumerate(s):
        if ch in last_seen and last_seen[ch] >= start:
            start = last_seen[ch] + 1
        last_seen[ch] = i
        best = max(best, i - start + 1)
    return best

print(length_of_longest_substring("abcabcbb"))  # 3
print(length_of_longest_substring("pwwkew"))    # 3
```

**Complexity:** `O(n)` time, `O(k)` space for `k` distinct characters.

---

### ❓ Best Time to Buy and Sell Stock (LeetCode 121)

`prices[i]` is the price on day `i`. Buy once and sell later; return the maximum profit (0 if none).

Example: `[7, 1, 5, 3, 6, 4]` → `5` (buy at 1, sell at 6)

### 📝 Answer

Track the lowest price so far and the best profit from selling today.

```python
def max_profit(prices: list[int]) -> int:
    min_price = float("inf")
    best = 0
    for price in prices:
        min_price = min(min_price, price)
        best = max(best, price - min_price)
    return best
```

**Complexity:** `O(n)` time, `O(1)` space.

## Python: Stack, Intervals and Heaps

### ❓ Valid Parentheses (LeetCode 20)

Given a string of `()[]{}`, check that every bracket is closed in the correct order.

Example: `"()[]{}"` → `True`, `"(]"` → `False`

### 📝 Answer

**Pattern:** stack. Push opening brackets; each closing bracket must match the top of the stack.

```python
def is_valid(s: str) -> bool:
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in s:
        if ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
        else:
            stack.append(ch)
    return not stack                 # every bracket must be closed
```

**Complexity:** `O(n)` time, `O(n)` space.

---

### ❓ Merge Intervals (LeetCode 56)

Merge all overlapping intervals.

Example: `[[1, 3], [2, 6], [8, 10], [15, 18]]` → `[[1, 6], [8, 10], [15, 18]]`

### 📝 Answer

Sort by start; extend the last merged interval while the next one overlaps.

```python
def merge(intervals: list[list[int]]) -> list[list[int]]:
    intervals.sort(key=lambda interval: interval[0])
    merged = []
    for start, end in intervals:
        if merged and start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)   # overlaps: extend
        else:
            merged.append([start, end])
    return merged
```

**Complexity:** `O(n log n)` time (sorting), `O(n)` space.

---

### ❓ Kth Largest Element in an Array (LeetCode 215)

Return the `k`-th largest element.

Example: `nums = [3, 2, 1, 5, 6, 4], k = 2` → `5`

### 📝 Answer

**Pattern:** keep a min-heap of the `k` largest values seen; its smallest element is the answer.

```python
import heapq

def find_kth_largest(nums: list[int], k: int) -> int:
    heap = []
    for num in nums:
        heapq.heappush(heap, num)
        if len(heap) > k:
            heapq.heappop(heap)      # drop the smallest
    return heap[0]
```

**Complexity:** `O(n log k)` time, `O(k)` space.

## Python: Linked Lists

### ❓ Reverse a Linked List (LeetCode 206)

Reverse a singly linked list and return the new head.

### 📝 Answer

Walk the list once, turning each `next` pointer backwards.

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head: ListNode | None) -> ListNode | None:
    prev = None
    while head:
        nxt = head.next      # remember the rest of the list
        head.next = prev     # reverse this pointer
        prev = head
        head = nxt
    return prev
```

**Complexity:** `O(n)` time, `O(1)` space.

---

### ❓ Merge Two Sorted Lists (LeetCode 21)

Merge two sorted linked lists into one sorted list.

### 📝 Answer

A dummy head avoids special cases for the first node.

```python
def merge_two_lists(a: ListNode | None, b: ListNode | None) -> ListNode | None:
    dummy = tail = ListNode()
    while a and b:
        if a.val <= b.val:
            tail.next, a = a, a.next
        else:
            tail.next, b = b, b.next
        tail = tail.next
    tail.next = a or b       # attach whatever remains
    return dummy.next
```

**Complexity:** `O(n + m)` time, `O(1)` space.

---

### ❓ Linked List Cycle (LeetCode 141)

Return `True` if the linked list has a cycle.

### 📝 Answer

**Pattern:** Floyd's fast and slow pointers. If there is a cycle, the fast pointer eventually meets the slow one.

```python
def has_cycle(head: ListNode | None) -> bool:
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False
```

**Complexity:** `O(n)` time, `O(1)` space.

## Python: Trees and Graphs

### ❓ Maximum Depth of Binary Tree (LeetCode 104)

Return the number of nodes on the longest path from the root down to a leaf.

### 📝 Answer

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def max_depth(root: TreeNode | None) -> int:
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))
```

**Complexity:** `O(n)` time, `O(h)` space for tree height `h` (recursion stack).

---

### ❓ Number of Islands (LeetCode 200)

Given a grid of `"1"` (land) and `"0"` (water), count the islands (groups of land connected up, down, left or right).

### 📝 Answer

**Pattern:** DFS flood fill. When you find land, count an island and "sink" all land connected to it.

```python
def num_islands(grid: list[list[str]]) -> int:
    rows, cols = len(grid), len(grid[0])

    def sink(r, c):
        if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] != "1":
            return
        grid[r][c] = "0"             # mark as visited
        sink(r + 1, c)
        sink(r - 1, c)
        sink(r, c + 1)
        sink(r, c - 1)

    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                count += 1
                sink(r, c)
    return count
```

**Complexity:** `O(rows × cols)` time and space. For very large grids, use BFS with `collections.deque` to avoid Python's recursion limit.

## Python: Dynamic Programming

### ❓ Climbing Stairs (LeetCode 70)

You can climb 1 or 2 steps at a time. How many distinct ways are there to reach step `n`?

Example: `n = 3` → `3` (1+1+1, 1+2, 2+1)

### 📝 Answer

Ways to reach step `n` = ways to reach `n-1` + ways to reach `n-2` — the Fibonacci pattern.

```python
def climb_stairs(n: int) -> int:
    a, b = 1, 1              # ways to reach the previous two steps
    for _ in range(n - 1):
        a, b = b, a + b
    return b

print(climb_stairs(5))       # 8
```

**Complexity:** `O(n)` time, `O(1)` space.

---

### ❓ Maximum Subarray (LeetCode 53)

Find the contiguous subarray with the largest sum.

Example: `[-2, 1, -3, 4, -1, 2, 1, -5, 4]` → `6` (`[4, -1, 2, 1]`)

### 📝 Answer

**Pattern:** Kadane's algorithm. At each number, either extend the current subarray or start a new one there.

```python
def max_sub_array(nums: list[int]) -> int:
    best = current = nums[0]
    for num in nums[1:]:
        current = max(num, current + num)
        best = max(best, current)
    return best
```

**Complexity:** `O(n)` time, `O(1)` space.

---

### ❓ Coin Change (LeetCode 322)

Return the fewest coins needed to make `amount`, or `-1` if it can't be made.

Example: `coins = [1, 2, 5], amount = 11` → `3` (5 + 5 + 1)

### 📝 Answer

`dp[v]` = fewest coins for value `v`, built up from smaller values.

```python
def coin_change(coins: list[int], amount: int) -> int:
    dp = [0] + [float("inf")] * amount
    for value in range(1, amount + 1):
        for coin in coins:
            if coin <= value:
                dp[value] = min(dp[value], dp[value - coin] + 1)
    return dp[amount] if dp[amount] != float("inf") else -1
```

**Complexity:** `O(amount × len(coins))` time, `O(amount)` space.

## Python: Patterns

### ❓ Which problem-solving pattern fits which kind of question?

### 📝 Answer

| Clue in the question | Pattern | Examples |
|---|---|---|
| "Find a pair / complement", fast lookup | Hash map / set | Two Sum, Contains Duplicate |
| Sorted array, or "find a triplet/pair" | Two pointers | 3Sum, Container With Most Water |
| "Longest / shortest substring or subarray" | Sliding window | Longest Substring Without Repeating Characters |
| Sorted input, "find position", `O(log n)` | Binary search | Search Insert Position, Rotated Array |
| Matching brackets, "next greater" | Stack | Valid Parentheses |
| "Top K", "K-th largest" | Heap | Top K Frequent, Kth Largest |
| Overlapping ranges | Sort + merge | Merge Intervals |
| Linked list cycle or middle | Fast and slow pointers | Linked List Cycle |
| Grid or connected components | DFS / BFS | Number of Islands |
| "Number of ways", "minimum cost" with overlapping subproblems | Dynamic programming | Climbing Stairs, Coin Change |
