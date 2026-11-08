# 🧠 Data Structures & Coding Patterns (Python)

## Data Structures

### ❓ Array vs linked list — when do you use which?

### 📝 Answer

| Operation | Array (Python `list`) | Linked list |
|---|---|---|
| Access by index `a[i]` | **O(1)** | O(n) — walk from the head |
| Insert/delete at end | O(1) amortized | O(1) with a tail pointer |
| Insert/delete at start or middle | O(n) — shift elements | **O(1)** once you're at the node |
| Memory | Compact, cache-friendly | Extra pointer per node |

Use an array by default. Use a linked list when you insert/remove in the middle a lot and already hold the node (e.g. an LRU cache).

---

### ❓ How does a hash table work?

### 📝 Answer

A hash table stores key → value pairs. A **hash function** turns the key into an index in an array of buckets, so lookup is **O(1) on average**.

```text
hash("apple") % 8 = 3  →  bucket 3: ("apple", 5)
```

- **Collision:** two keys land in the same bucket → keep a small list there (chaining) or try the next slot (open addressing).
- **Resize:** when it gets too full, it doubles and re-places every key.
- Worst case O(n) if many keys collide.

In Python: `dict` and `set`. Keys must be **hashable** (immutable): strings, numbers, tuples — not lists.

---

### ❓ Stack vs queue vs deque?

### 📝 Answer

- **Stack — LIFO** (last in, first out), like a pile of plates. Undo, matching brackets, DFS.
- **Queue — FIFO** (first in, first out), like a ticket line. BFS, task scheduling.
- **Deque** — add/remove at both ends in O(1).

```python
stack = []; stack.append(1); stack.pop()          # O(1)

from collections import deque
q = deque(); q.append(1); q.popleft()             # O(1)  (list.pop(0) is O(n)!)
```

---

### ❓ What is a heap (priority queue)?

### 📝 Answer

A heap always gives you the **smallest (min-heap) or largest (max-heap) item in O(1)**, and adds/removes in **O(log n)**. It's a binary tree stored in an array where every parent ≤ its children.

```python
import heapq
h = []
heapq.heappush(h, 5); heapq.heappush(h, 1); heapq.heappush(h, 3)
heapq.heappop(h)          # 1  (smallest)
heapq.heappush(h, -x)     # trick: push negatives for a max-heap
```

Use for: top K items, merge K sorted lists, Dijkstra, scheduling by priority.

---

### ❓ What are a binary tree and a binary search tree (BST)?

### 📝 Answer

- **Binary tree:** each node has at most 2 children.
- **BST:** for every node, **left subtree < node < right subtree**. Search, insert, delete are **O(log n)** when balanced, O(n) if it degrades into a line.

```text
        8
      /   \
     3     10        in-order traversal of a BST gives sorted order: 1 3 6 8 10 14
    / \      \
   1   6      14
```

**Traversals**

| Order | Visit | Use |
|---|---|---|
| Pre-order | node, left, right | Copy a tree |
| In-order | left, node, right | Sorted output of a BST |
| Post-order | left, right, node | Delete a tree, evaluate expressions |
| Level-order | level by level (BFS) | Shortest path in a tree, print by level |

#### ↳ Follow-up: What is a balanced tree?

↪ A tree whose height stays about log n (AVL, Red-Black). Java's `TreeMap` is a Red-Black tree.

---

### ❓ How do you represent a graph?

### 📝 Answer

```python
# Adjacency list — most common, O(V + E) space
graph = {"A": ["B", "C"], "B": ["D"], "C": ["D"], "D": []}

# Adjacency matrix — O(V²) space, O(1) "is there an edge?"
#     A B C D
# A [ 0 1 1 0 ]
```

Use an **adjacency list** for most problems (graphs are usually sparse).

---

### ❓ What is a trie?

### 📝 Answer

A tree where each edge is a **character**, so words with the same prefix share a path. Great for autocomplete and prefix search: lookup is **O(length of the word)**.

```python
class Trie:
    def __init__(self): self.root = {}
    def insert(self, word):
        node = self.root
        for ch in word:
            node = node.setdefault(ch, {})
        node["$"] = True                      # end of word
    def starts_with(self, prefix):
        node = self.root
        for ch in prefix:
            if ch not in node: return False
            node = node[ch]
        return True
```

---

## Patterns with Templates

### ❓ What is the sliding window pattern? Give a template.

### 📝 Answer

Keep a **window** `[left, right]` over an array/string and slide it, instead of re-checking every subarray. Turns O(n²) into **O(n)**.

**Fixed size — max sum of any 3 consecutive numbers:**

```python
def max_sum(nums, k):
    window = sum(nums[:k]); best = window
    for i in range(k, len(nums)):
        window += nums[i] - nums[i - k]   # add new, drop old
        best = max(best, window)
    return best
```

**Variable size — Minimum Size Subarray Sum (LeetCode 209): shortest subarray with sum ≥ target:**

```python
def min_sub_array_len(target, nums):
    left = total = 0; best = float("inf")
    for right, x in enumerate(nums):
        total += x                          # grow
        while total >= target:              # shrink while valid
            best = min(best, right - left + 1)
            total -= nums[left]; left += 1
    return 0 if best == float("inf") else best
```

**Spot it:** "longest/shortest/max subarray or substring that…".

---

### ❓ What is the two pointers pattern?

### 📝 Answer

Use two indexes that move toward each other (or at different speeds), usually on a **sorted** array or a string.

```python
# Two Sum II — sorted input (LeetCode 167)
def two_sum_sorted(nums, target):
    l, r = 0, len(nums) - 1
    while l < r:
        s = nums[l] + nums[r]
        if s == target: return [l + 1, r + 1]
        if s < target: l += 1      # need bigger
        else: r -= 1               # need smaller
```

Also used for: reversing, removing duplicates in place, palindromes, 3Sum.

---

### ❓ What is the fast and slow pointer pattern?

### 📝 Answer

One pointer moves 1 step, the other 2 steps.

- **Middle of a linked list (LeetCode 876):** when fast reaches the end, slow is in the middle.
- **Cycle detection (LeetCode 141):** if there is a loop, fast eventually meets slow.

```python
def middle(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
    return slow
```

---

### ❓ What is the prefix sum pattern?

### 📝 Answer

Pre-compute running totals so any range sum is **O(1)**: `sum(i..j) = prefix[j+1] - prefix[i]`.

**Subarray Sum Equals K (LeetCode 560)** — count subarrays summing to k (works with negatives):

```python
def subarray_sum(nums, k):
    count = total = 0
    seen = {0: 1}                         # prefix sum → how many times seen
    for x in nums:
        total += x
        count += seen.get(total - k, 0)   # an earlier prefix that leaves exactly k
        seen[total] = seen.get(total, 0) + 1
    return count
```

---

### ❓ What is a binary search template that avoids off-by-one bugs?

### 📝 Answer

Search on a **sorted** range by halving it: **O(log n)**.

```python
def lower_bound(nums, target):     # first index with nums[i] >= target
    lo, hi = 0, len(nums)          # hi is exclusive
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] < target: lo = mid + 1
        else: hi = mid
    return lo
```

Python has it built in: `bisect.bisect_left(nums, target)`.

**Binary search on the answer:** "smallest speed/capacity that works" — search over the answer range and test each guess (e.g. Koko Eating Bananas, LeetCode 875).

---

### ❓ What is the monotonic stack pattern?

### 📝 Answer

A stack kept in increasing or decreasing order. Answers "**next greater/smaller element**" in **O(n)**.

**Daily Temperatures (LeetCode 739)** — days to wait for a warmer day:

```python
def daily_temperatures(t):
    ans = [0] * len(t); stack = []        # indexes, temps decreasing
    for i, temp in enumerate(t):
        while stack and t[stack[-1]] < temp:
            j = stack.pop(); ans[j] = i - j
        stack.append(i)
    return ans
# [73,74,75,71,69,72,76,73] → [1,1,4,2,1,1,0,0]
```

---

### ❓ How do BFS and DFS work, and when do you use each?

### 📝 Answer

- **BFS (breadth-first):** explore level by level with a **queue**. Finds the **shortest path** in an unweighted graph.
- **DFS (depth-first):** go as deep as possible, then backtrack, with **recursion or a stack**. Good for exploring everything, cycles, paths, islands.

```python
from collections import deque

def bfs(graph, start):
    seen, q = {start}, deque([start])
    while q:
        node = q.popleft()
        for nxt in graph[node]:
            if nxt not in seen:
                seen.add(nxt); q.append(nxt)
    return seen

def dfs(graph, node, seen=None):
    seen = seen or set()
    seen.add(node)
    for nxt in graph[node]:
        if nxt not in seen: dfs(graph, nxt, seen)
    return seen
```

Both are **O(V + E)**.

---

### ❓ Binary Tree Level Order Traversal (LeetCode 102)

### 📝 Answer

BFS, processing one level at a time.

```python
def level_order(root):
    if not root: return []
    result, q = [], deque([root])
    while q:
        level = []
        for _ in range(len(q)):            # exactly this level's nodes
            node = q.popleft(); level.append(node.val)
            if node.left: q.append(node.left)
            if node.right: q.append(node.right)
        result.append(level)
    return result
```

---

### ❓ Validate Binary Search Tree (LeetCode 98)

### 📝 Answer

Each node must be inside a **range** that narrows as you go down — checking only the direct children is a common bug.

```python
def is_valid_bst(node, low=float("-inf"), high=float("inf")):
    if not node: return True
    if not (low < node.val < high): return False
    return is_valid_bst(node.left, low, node.val) and is_valid_bst(node.right, node.val, high)
```

> ⚠️ **Trap:** a right grandchild smaller than the root breaks the BST even if it's bigger than its own parent.

---

### ❓ Lowest Common Ancestor of a Binary Tree (LeetCode 236)

### 📝 Answer

Search both sides; the node where `p` and `q` come from different sides is the LCA.

```python
def lca(root, p, q):
    if not root or root in (p, q): return root
    left, right = lca(root.left, p, q), lca(root.right, p, q)
    if left and right: return root        # one on each side
    return left or right
```

---

### ❓ What is topological sort? (Course Schedule, LeetCode 207)

### 📝 Answer

An order of tasks where every task comes **after its prerequisites**. Only possible if there is **no cycle**.

**Kahn's algorithm:** start with tasks that have no prerequisites, remove them, repeat.

```python
def can_finish(n, prerequisites):
    graph = [[] for _ in range(n)]; indegree = [0] * n
    for course, pre in prerequisites:
        graph[pre].append(course); indegree[course] += 1
    q = deque(i for i in range(n) if indegree[i] == 0)
    done = 0
    while q:
        c = q.popleft(); done += 1
        for nxt in graph[c]:
            indegree[nxt] -= 1
            if indegree[nxt] == 0: q.append(nxt)
    return done == n          # False → there is a cycle
```

Real use: build systems, package installs, the study-path order in this repository.

---

### ❓ What is Dijkstra's algorithm?

### 📝 Answer

Finds the **shortest path from one node** in a graph with **non-negative weights**. Always expand the closest unvisited node, using a min-heap.

```python
def dijkstra(graph, start):           # graph[u] = [(v, weight), ...]
    dist = {start: 0}; heap = [(0, start)]
    while heap:
        d, u = heapq.heappop(heap)
        if d > dist.get(u, float("inf")): continue
        for v, w in graph[u]:
            if d + w < dist.get(v, float("inf")):
                dist[v] = d + w; heapq.heappush(heap, (d + w, v))
    return dist
```

O((V + E) log V). Negative weights → use Bellman-Ford.

---

### ❓ What is backtracking? (Subsets and Permutations)

### 📝 Answer

Build a solution step by step; when a choice is done (or fails), **undo it and try the next**.

```python
def subsets(nums):                         # LeetCode 78 → 2ⁿ results
    result, path = [], []
    def go(i):
        if i == len(nums): result.append(path[:]); return
        path.append(nums[i]); go(i + 1)    # take it
        path.pop();           go(i + 1)    # skip it
    go(0); return result

def permutations(nums):                    # LeetCode 46 → n! results
    result = []
    def go(path, rest):
        if not rest: result.append(path); return
        for i in range(len(rest)):
            go(path + [rest[i]], rest[:i] + rest[i+1:])
    go([], nums); return result
```

Used for: subsets, permutations, combinations, N-Queens, Sudoku, word search.

---

### ❓ How do you approach a dynamic programming problem?

### 📝 Answer

DP = solve small subproblems once, **save the answers**, build up the big one. Use it when a problem has **overlapping subproblems** (same calls repeat).

Steps:

1. Define the state: `dp[i]` = best answer for the first i items.
2. Write the choice: `dp[i] = max(dp[i-1], dp[i-2] + nums[i])`.
3. Set base cases.
4. Fill in order (bottom-up) or recurse with a cache (top-down, `@lru_cache`).

**House Robber (LeetCode 198)** — can't rob two neighbours:

```python
def rob(nums):
    prev2 = prev1 = 0
    for x in nums:
        prev2, prev1 = prev1, max(prev1, prev2 + x)   # skip it, or take it
    return prev1
# [2,7,9,3,1] → 12  (2 + 9 + 1)
```

#### ↳ Follow-up: Memoization vs tabulation?

↪ Memoization = top-down recursion with a cache. Tabulation = bottom-up loop filling a table. Same complexity; tabulation avoids recursion limits.

---

### ❓ Longest Common Subsequence (LeetCode 1143)

### 📝 Answer

Classic 2-D DP: compare the last characters.

```python
def lcs(a, b):
    dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
    for i in range(1, len(a) + 1):
        for j in range(1, len(b) + 1):
            if a[i-1] == b[j-1]: dp[i][j] = dp[i-1][j-1] + 1
            else:                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[-1][-1]
# lcs("abcde", "ace") → 3
```

O(m × n) time and space.

---

### ❓ LRU Cache (LeetCode 146)

### 📝 Answer

Keep items in **use order**; when full, evict the **least recently used**. Both `get` and `put` must be O(1): a hash map + a doubly linked list. In Python, `OrderedDict` does both.

```python
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.cap, self.data = capacity, OrderedDict()
    def get(self, key):
        if key not in self.data: return -1
        self.data.move_to_end(key)          # mark as recently used
        return self.data[key]
    def put(self, key, value):
        self.data[key] = value; self.data.move_to_end(key)
        if len(self.data) > self.cap:
            self.data.popitem(last=False)   # remove the oldest
```

---

### ❓ Merge K Sorted Lists (LeetCode 23)

### 📝 Answer

Put the head of each list in a **min-heap**; repeatedly take the smallest and push its next node. O(N log k).

```python
def merge_k_lists(lists):
    heap = [(node.val, i, node) for i, node in enumerate(lists) if node]
    heapq.heapify(heap)
    dummy = tail = ListNode()
    while heap:
        _, i, node = heapq.heappop(heap)    # i breaks ties (nodes can't be compared)
        tail.next = tail = node
        if node.next: heapq.heappush(heap, (node.next.val, i, node.next))
    return dummy.next
```

---

## Sorting

### ❓ How do the main sorting algorithms compare?

### 📝 Answer

| Algorithm | Best | Average | Worst | Space | Stable |
|---|---|---|---|---|---|
| Bubble / Insertion | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Merge sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Quick sort | O(n log n) | O(n log n) | **O(n²)** | O(log n) | No |
| Heap sort | O(n log n) | O(n log n) | O(n log n) | O(1) | No |
| Python `sorted` (Timsort) | O(n) | O(n log n) | O(n log n) | O(n) | Yes |

**Stable** = equal items keep their original order (matters when sorting by one field after another).

#### ↳ Follow-up: Why is quick sort fast in practice despite the O(n²) worst case?

↪ It sorts in place with good cache use; a random pivot makes the worst case extremely unlikely.

#### ↳ Follow-up: Explain merge sort in one line.

↪ Split the list in half, sort each half, then merge the two sorted halves.

---

## Interview Tricks

### ❓ How do you approach a coding problem you haven't seen before?

### 📝 Answer

1. **Restate** the problem and ask about input size, duplicates, negatives, empty input.
2. **Work an example** by hand.
3. Say the **brute force** and its Big O.
4. **Match a pattern** from the clues:

| Clue in the question | Try |
|---|---|
| Sorted array | Binary search, two pointers |
| Subarray / substring | Sliding window, prefix sum |
| "Top K", "smallest/largest K" | Heap |
| Pairs that sum to X / "seen before" | Hash map |
| Tree or graph, shortest path | BFS |
| All combinations / permutations | Backtracking |
| Count ways / min cost / max profit with choices | Dynamic programming |
| Next greater element | Monotonic stack |
| Dependencies / order of tasks | Topological sort |

5. Code it, then **test** with the example and edge cases.
6. State the final time and space complexity.

---

### ❓ Tricky: What is the time complexity of `x in my_list` vs `x in my_set`?

### 📝 Answer

`x in list` is **O(n)** — it checks each item. `x in set` (and `dict`) is **O(1)** on average — a hash lookup. Converting a list to a set before many lookups is a common easy speed-up.
