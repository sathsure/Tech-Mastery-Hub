# DSA Coding Questions in Python (LeetCode)

## Python: Arrays and Hashing

### ❓ Two Sum (LeetCode 1)

Given an array `nums` and an integer `target`, return the indices of the two numbers that add up to `target`. Exactly one solution exists, and the same element can't be used twice.

Example: `nums = [2, 7, 11, 15], target = 9` → `[0, 1]`

### 📝 Answer

**In simple words:** Find two numbers in the list that add up to the target, and return their positions.

**How to approach it:**

1. For each number, the partner you need is `target - number` (for `7` with target `9`, you need `2`).
2. Keep a dictionary of the numbers already seen → their index.
3. If the partner is already in the dictionary, you're done; otherwise store the current number and move on.

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

**In simple words:** Find every group of three numbers that adds up to 0, without repeating the same group.

**How to approach it:**

1. Sort the list, so equal numbers sit together and you can move left or right by size.
2. Fix one number, then look for two more that add up to its negative, with one pointer at each end of the rest.
3. Sum too small → move the left pointer right; too big → move the right pointer left.
4. Skip a number equal to the previous one, so no group repeats.

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

**In simple words:** Does any number appear more than once?

**How to approach it:**

1. A set keeps only unique values.
2. If the set is smaller than the list, something was repeated.

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

**In simple words:** Do both words use exactly the same letters, the same number of times? ("listen" and "silent" do.)

**How to approach it:**

1. Count each letter in both words.
2. If the counts match, they are anagrams.

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

**In simple words:** Put words made of the same letters into the same group.

**How to approach it:**

1. Sort each word's letters: "eat", "tea" and "ate" all become "aet".
2. Use that sorted form as a dictionary key and add the word to its list.
3. The dictionary's lists are the groups.

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

**In simple words:** Return the `k` numbers that appear most often.

**How to approach it:**

1. Count how often each number appears.
2. Pick the `k` numbers with the highest counts (a heap does this without sorting everything).

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

**In simple words:** For each position, multiply all the other numbers together — without using division.

**How to approach it:**

1. The answer at `i` = (product of everything to its left) × (product of everything to its right).
2. Pass 1, left to right: store the running product of the left side.
3. Pass 2, right to left: multiply in the running product of the right side.

_Example:_ in `[1, 2, 3, 4]`, position 2 → left `1 × 2 = 2`, right `4`, answer `8`.

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

**In simple words:** Find the target in a sorted list; if it isn't there, say where it would go.

**How to approach it:**

1. The list is sorted, so use binary search: look at the middle and throw away the half that can't hold the answer.
2. Look for the first position whose value is `>= target`. That is the index if the target is there, and the insert spot if it isn't.

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

**In simple words:** A sorted list was "rotated" (its end moved to the front). Find the target quickly, in `O(log n)`.

**How to approach it:**

1. Use binary search, but first check which half around the middle is still in order.
2. If the target fits inside the ordered half's range, search there; otherwise search the other half.

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

**In simple words:** Ignoring spaces, punctuation and case, does the text read the same forwards and backwards?

**How to approach it:**

1. Keep only letters and digits, in lower case.
2. Compare the cleaned text with its reverse.

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

**In simple words:** Each number is the height of a wall. Pick two walls; the water between them = the distance between them × the shorter wall. Find the most water.

**How to approach it:**

1. Start with the widest container: one pointer at each end.
2. Work out the water and remember the best so far.
3. Move the **shorter** wall inward. The water is limited by the shorter wall, so moving the taller one can only make it worse.
4. Stop when the pointers meet.

_Example:_ walls `8` (index 1) and `7` (index 8) → width `7` × shorter wall `7` = `49`.

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

**In simple words:** Find the longest stretch of the text where no character repeats ("abcabcbb" → "abc", length 3).

**How to approach it:**

1. Keep a "window" of characters with no repeats, and grow it one character at a time.
2. When a character repeats inside the window, move the window's start just past its earlier copy.
3. Track the biggest window size seen.

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

**In simple words:** Pick one day to buy and a later day to sell, for the biggest profit.

**How to approach it:**

1. Walk through the days, remembering the cheapest price so far.
2. On each day, the profit if you sold today = today's price − the cheapest so far.
3. Keep the best profit.

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

**In simple words:** Is every opening bracket closed by the right kind of bracket, in the right order? `"([])"` is fine, `"(]"` is not.

**How to approach it:**

1. Push each opening bracket onto a stack.
2. On a closing bracket, the top of the stack must be its matching opener; pop it.
3. At the end, the stack must be empty.

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

**In simple words:** Combine ranges that overlap into one range: `[1, 3]` and `[2, 6]` become `[1, 6]`.

**How to approach it:**

1. Sort the ranges by their start.
2. If a range starts before the last merged one ends, they overlap — extend the end.
3. Otherwise, start a new merged range.

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

**In simple words:** Find the number that would be at position `k` if the list were sorted from largest to smallest.

**How to approach it:**

1. Keep a small min-heap holding the `k` largest numbers seen so far.
2. When it grows past `k`, drop its smallest.
3. At the end, the smallest of those `k` numbers is the k-th largest.

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

**In simple words:** Turn the chain `1 → 2 → 3` into `3 → 2 → 1`.

**How to approach it:**

1. Walk the list, keeping `prev` (the part already reversed; empty at first).
2. For each node: remember the next node, point the current node back to `prev`, then step forward.
3. When you run off the end, `prev` is the new head.

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

**In simple words:** Join two sorted chains into one sorted chain.

**How to approach it:**

1. Compare the two front nodes and attach the smaller one to the result.
2. Move forward in the list you took it from, and repeat.
3. When one list runs out, attach the rest of the other.

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

**In simple words:** Does the chain loop back on itself instead of ending?

**How to approach it:**

1. Move a slow pointer 1 step and a fast pointer 2 steps at a time.
2. If there is a loop, the fast one laps the slow one and they meet.
3. If the fast one reaches the end, there is no loop.

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

**In simple words:** How many levels does the tree have, from the top down to its deepest leaf?

**How to approach it:**

1. An empty tree has depth 0.
2. A node's depth = 1 + the deeper of its left and right subtrees.
3. Recursion works this out from the leaves upward.

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

**In simple words:** In a map of land (`"1"`) and water (`"0"`), count the separate pieces of land. Land touching up, down, left or right belongs to the same island.

**How to approach it:**

1. Scan every cell.
2. When you find land, count one island, then "sink" it: turn it and all land connected to it into water.
3. Because each island is sunk when first found, it is counted only once.

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

**In simple words:** You climb 1 or 2 steps at a time. How many different ways can you reach the top?

**How to approach it:**

1. Your last move onto step `n` came either from step `n-1` or from step `n-2`.
2. So ways(`n`) = ways(`n-1`) + ways(`n-2`) — the Fibonacci sequence.
3. Keep only the last two counts as you go up.

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

**In simple words:** Find the block of consecutive numbers with the biggest total.

**How to approach it:**

1. Walk the list, keeping the best total of a block that ends at the current number.
2. At each number: if the block so far has a negative total it only hurts, so start fresh here; otherwise add the number to it.
3. Track the best total seen.

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

**In simple words:** Using the given coin values (as many of each as you like), make the amount with the fewest coins.

**How to approach it:**

1. Solve every smaller amount first: `dp[v]` = fewest coins for value `v`, with `dp[0] = 0`.
2. For each value, try each coin as the last coin: `dp[v - coin] + 1`, and keep the smallest.
3. If the amount still can't be made, return `-1`.

_Example:_ `11` with coins `[1, 2, 5]` → `5 + 5 + 1`, 3 coins.

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
