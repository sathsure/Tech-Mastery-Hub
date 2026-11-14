# DSA (Python) — Code Snippets

> The classic solutions to write from memory.

### 1. Two Sum (hash map)
```python
def two_sum(nums, target):
    seen = {}                                   # value → index
    for i, n in enumerate(nums):
        if target - n in seen:
            return [seen[target - n], i]
        seen[n] = i
# O(n) time, O(n) space
```

### 2. Reverse a linked list
```python
def reverse(head):
    prev = None
    while head:
        head.next, prev, head = prev, head, head.next
    return prev
```

### 3. Detect a cycle (fast & slow)
```python
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
        if slow is fast:
            return True
    return False
```

### 4. Merge intervals
```python
def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    out = []
    for start, end in intervals:
        if out and start <= out[-1][1]:
            out[-1][1] = max(out[-1][1], end)
        else:
            out.append([start, end])
    return out
```

### 5. Top K frequent (heap)
```python
import heapq
from collections import Counter

def top_k(nums, k):
    return [n for n, _ in heapq.nlargest(k, Counter(nums).items(), key=lambda x: x[1])]
```

### 6. Number of islands (BFS on a grid)
```python
from collections import deque

def islands(grid):
    rows, cols, count = len(grid), len(grid[0]), 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                count += 1
                grid[r][c] = "0"
                q = deque([(r, c)])
                while q:
                    x, y = q.popleft()
                    for nx, ny in ((x+1, y), (x-1, y), (x, y+1), (x, y-1)):
                        if 0 <= nx < rows and 0 <= ny < cols and grid[nx][ny] == "1":
                            grid[nx][ny] = "0"
                            q.append((nx, ny))
    return count
```

### 7. Tree: max depth and level order
```python
def max_depth(root):
    return 0 if not root else 1 + max(max_depth(root.left), max_depth(root.right))

def level_order(root):
    out, q = [], deque([root] if root else [])
    while q:
        out.append([n.val for n in q])
        q = deque(child for n in q for child in (n.left, n.right) if child)
    return out
```

### 8. Validate a BST
```python
def is_bst(node, low=float("-inf"), high=float("inf")):
    if not node:
        return True
    if not (low < node.val < high):
        return False
    return is_bst(node.left, low, node.val) and is_bst(node.right, node.val, high)
```

### 9. Topological sort (course schedule)
```python
def can_finish(n, prereqs):
    graph, indeg = [[] for _ in range(n)], [0] * n
    for course, pre in prereqs:
        graph[pre].append(course)
        indeg[course] += 1
    q = deque(i for i in range(n) if indeg[i] == 0)
    done = 0
    while q:
        node = q.popleft(); done += 1
        for nxt in graph[node]:
            indeg[nxt] -= 1
            if indeg[nxt] == 0:
                q.append(nxt)
    return done == n                       # False → there's a cycle
```

### 10. DP: longest increasing subsequence (O(n log n))
```python
import bisect

def lis(nums):
    tails = []
    for n in nums:
        i = bisect.bisect_left(tails, n)
        if i == len(tails): tails.append(n)
        else: tails[i] = n
    return len(tails)
```

### 11. Backtracking: permutations
```python
def permutations(nums):
    out = []
    def go(path, used):
        if len(path) == len(nums):
            out.append(path[:]); return
        for i, n in enumerate(nums):
            if not used[i]:
                used[i] = True; path.append(n)
                go(path, used)
                path.pop(); used[i] = False
    go([], [False] * len(nums))
    return out
```

### 12. Dijkstra
```python
import heapq

def dijkstra(graph, start):                # graph: {node: [(neighbour, weight), ...]}
    dist = {start: 0}
    heap = [(0, start)]
    while heap:
        d, node = heapq.heappop(heap)
        if d > dist.get(node, float("inf")):
            continue
        for nxt, w in graph[node]:
            nd = d + w
            if nd < dist.get(nxt, float("inf")):
                dist[nxt] = nd
                heapq.heappush(heap, (nd, nxt))
    return dist
```
