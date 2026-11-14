# DSA (Python) — Quick Traps

> Tricky spots interviewers love: what goes wrong, a tiny example, and the right answer.

### 1. `list.pop(0)` in BFS
- ❌ `queue = []; queue.pop(0)` → O(n) each time.
- ✅ `deque.popleft()` is O(1).

### 2. Binary search bounds
- ❌ `while lo < hi` with `hi = len(nums) - 1` → misses the last element.
- ✅ Pick one style and stay consistent: `lo <= hi` with `hi = len - 1`.

### 3. `x in list` inside a loop
- ❌ `for a in A: if a in B_list` → O(n²).
- ✅ Turn `B` into a set first → O(n).

### 4. Forgetting edge cases
- ❌ Not testing empty input, one element, duplicates, negatives.
- ✅ Say them out loud before coding.

### 5. Sliding window on non-contiguous problems
- ❌ Using a window for "any subset".
- ✅ Windows are for continuous subarrays/substrings only.

### 6. Recursion depth
- ❌ Recursive DFS on 100,000 nodes → `RecursionError`.
- ✅ Use an explicit stack, or raise the limit carefully.

### 7. Shared default in recursion
- ❌ `def dfs(node, path=[])` → the path leaks between calls.
- ✅ Pass `path` explicitly; copy (`path[:]`) when saving results.

### 8. `heapq` is a min-heap
- ❌ Expecting the largest item from `heappop`.
- ✅ Push negatives (`-x`) to get a max-heap.

### 9. Visiting nodes twice in a graph
- ❌ BFS/DFS on a graph without a `seen` set → infinite loop.
- ✅ Mark nodes as seen when you add them to the queue.

### 10. "Average" vs "worst" case
- ❌ "Dict lookup is always O(1)."
- ✅ Average O(1); worst case O(n) with many collisions. Quicksort is O(n²) worst case.

### 11. Jumping to code
- ❌ Coding straight away in silence.
- ✅ Explain brute force → better approach → complexity, then code.
