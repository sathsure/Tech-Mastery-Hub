# DSA (Python) — Comparisons

> The classic "X vs Y" questions, side by side.

## Array vs linked list
| | Array (`list`) | Linked list |
|---|---|---|
| Access by index | O(1) | O(n) |
| Insert at front | O(n) | O(1) |
| Memory | compact | extra pointers |

## Stack vs queue
| | Stack | Queue |
|---|---|---|
| Order | last in, first out | first in, first out |
| Python | `list` (append/pop) | `deque` (append/popleft) |
| Used in | DFS, undo, brackets | BFS, scheduling |

## BFS vs DFS
| | BFS | DFS |
|---|---|---|
| Uses | queue | stack / recursion |
| Finds shortest path (unweighted) | ✅ | ❌ |
| Memory | wide graphs: more | deep graphs: more |
| Good for | levels, nearest | paths, backtracking, cycles |

## Hash map vs BST (sorted map)
| | Hash map | Balanced BST |
|---|---|---|
| Lookup | O(1) avg | O(log n) |
| Keeps order | ❌ | ✅ |

## Merge sort vs quick sort vs heap sort
| | Average | Worst | Extra space | Stable |
|---|---|---|---|---|
| Merge | n log n | n log n | n | ✅ |
| Quick | n log n | n² | log n | ❌ |
| Heap | n log n | n log n | 1 | ❌ |

## Memoization vs tabulation
| | Memoization | Tabulation |
|---|---|---|
| Direction | top-down (recursion + cache) | bottom-up (loop + table) |
| Recursion limit risk | ✅ | ❌ |

## Greedy vs dynamic programming
| | Greedy | DP |
|---|---|---|
| Choice | best right now | tries all, reuses sub-answers |
| Always correct | only for some problems | ✅ when subproblems overlap |

## Dijkstra vs BFS vs Bellman-Ford
| | Weights | Negative edges |
|---|---|---|
| BFS | none (all equal) | — |
| Dijkstra | non-negative | ❌ |
| Bellman-Ford | any | ✅ |

## Min-heap vs max-heap
| | Top item |
|---|---|
| Min-heap (`heapq`) | smallest |
| Max-heap | largest (push `-x` in Python) |
