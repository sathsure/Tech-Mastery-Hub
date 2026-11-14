# DSA (Python) — Cheat Sheet

> **In one line:** pick the right data structure and pattern, and you can solve most coding-round problems quickly.

## Big O — how work grows with input size
| Big O | Name | Example |
|---|---|---|
| O(1) | constant | dict lookup |
| O(log n) | logarithmic | binary search |
| O(n) | linear | one loop |
| O(n log n) | — | sorting |
| O(n²) | quadratic | loop inside a loop |
| O(2ⁿ) | exponential | all subsets |
- Ignore constants: O(2n) is O(n).
- Count memory too (space complexity), including the recursion stack.

## Python data structures
- `list` — index O(1), append O(1), insert/remove at the front O(n).
- `dict` / `set` — add, look up, delete in O(1) on average.
- `collections.deque` — fast add/remove at both ends (queues, BFS).
- `heapq` — smallest item in O(1), push/pop in O(log n).
- `collections.Counter` — count things. `defaultdict` — dict with default values.
- `bisect` — binary search in a sorted list.

## Patterns — spot the clue
- **Hash map** — "have I seen this?", counts, pairs → *Two Sum*.
- **Two pointers** — sorted array, pairs, palindromes → *3Sum*.
- **Sliding window** — longest/shortest *continuous* part → *Longest substring without repeats*.
- **Prefix sum** — sums over ranges → *Subarray sum equals K*.
- **Binary search** — sorted data, or "smallest value that works".
- **Stack** — brackets, "next greater element".
- **Fast & slow pointers** — linked list cycle or middle.
- **BFS** — shortest path in a grid or unweighted graph, level by level.
- **DFS / backtracking** — all combinations, permutations, paths.
- **Heap** — top K items, merge K sorted lists.
- **Intervals** — sort by start, then merge.
- **Graphs** — topological sort (task order), union-find (groups), Dijkstra (weighted shortest path).
- **Dynamic programming** — "number of ways", min/max, reuse smaller answers → *Coin change*, *Climbing stairs*.
- **Greedy** — the best local choice works → *Jump game*.

## Templates
```python
# Sliding window: longest substring without repeating characters
def longest_unique(s):
    last, left, best = {}, 0, 0
    for right, ch in enumerate(s):
        if last.get(ch, -1) >= left:
            left = last[ch] + 1
        last[ch] = right
        best = max(best, right - left + 1)
    return best

# Binary search
def search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target: return mid
        if nums[mid] < target: lo = mid + 1
        else: hi = mid - 1
    return -1

# BFS on a grid (shortest steps)
from collections import deque
def steps(grid, start, goal):
    q, seen = deque([(start, 0)]), {start}
    while q:
        (r, c), d = q.popleft()
        if (r, c) == goal: return d
        for nr, nc in ((r+1, c), (r-1, c), (r, c+1), (r, c-1)):
            if 0 <= nr < len(grid) and 0 <= nc < len(grid[0]) and grid[nr][nc] != '#' and (nr, nc) not in seen:
                seen.add((nr, nc)); q.append(((nr, nc), d + 1))
    return -1

# DP: fewest coins
def coin_change(coins, amount):
    dp = [0] + [float('inf')] * amount
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a: dp[a] = min(dp[a], dp[a - c] + 1)
    return -1 if dp[amount] == float('inf') else dp[amount]
```

## Sorting
- **Merge sort** — O(n log n) always, stable, needs extra memory.
- **Quick sort** — O(n log n) usually, O(n²) worst case, in place.
- **Python `sorted()`** — Timsort, O(n log n), stable.

## Trees
- Traversals: **inorder** (a BST comes out sorted), preorder, postorder, level order (BFS).
- **BST** — left < node < right; search is O(log n) when balanced.
- **Trie** — prefix tree for autocomplete.

## How to answer in the interview
1. Ask about input size and edge cases. 2. Say the brute force and its Big O. 3. Find the pattern and improve it. 4. Code while explaining. 5. Test with a small example. 6. State time and space.
