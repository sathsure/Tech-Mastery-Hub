# Python — Quick Traps

> Tricky spots interviewers love: what goes wrong, a tiny example, and the right answer.

### 1. Mutable default argument
- ❌ `def add(item, items=[])` → the same list is shared across calls.
- ✅ `def add(item, items=None): items = items or []`

### 2. `is` vs `==`
- ❌ `if name is "admin"` — may be `False` even when equal.
- ✅ `is` checks the same object. Use `==` for values; `is` only for `None`.

### 3. `sort()` returns None
- ❌ `nums = nums.sort()` → `nums` becomes `None`.
- ✅ `nums.sort()` sorts in place; `sorted(nums)` returns a new list.

### 4. List of lists with `*`
- ❌ `grid = [[0] * 3] * 3; grid[0][0] = 1` → changes every row.
- ✅ `grid = [[0] * 3 for _ in range(3)]`

### 5. Late binding in closures
- ❌ `fns = [lambda: i for i in range(3)]` → all return `2`.
- ✅ `[lambda i=i: i for i in range(3)]`

### 6. Threads don't speed up CPU work
- ❌ Using threads for heavy calculations.
- ✅ The GIL lets one thread run Python at a time. Use `multiprocessing` for CPU work.

### 7. Changing a list while looping
- ❌ `for x in nums: if x < 0: nums.remove(x)` → skips items.
- ✅ `nums = [x for x in nums if x >= 0]`

### 8. Copying nested data
- ❌ `b = a.copy(); b["inner"]["x"] = 1` → changes `a` too.
- ✅ `copy.deepcopy(a)` for nested data.

### 9. Floats aren't exact
- ❌ `0.1 + 0.2 == 0.3` → `False`
- ✅ `math.isclose(...)`, or `Decimal` for money.

### 10. Catching everything
- ❌ `except:` or `except Exception: pass` → hides real bugs.
- ✅ Catch specific errors, and log them.

### 11. `list.pop(0)` is slow
- ❌ Using a list as a queue.
- ✅ `collections.deque` → `popleft()` is O(1).
