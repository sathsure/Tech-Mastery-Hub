# Python — Predict the Output

> Read the code, guess what it prints, then tap to check.

### 1. Mutable default argument
```python
def add(x, items=[]):
    items.append(x)
    return items

print(add(1))
print(add(2))
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `[1]` then `[1, 2]`

The default list is created once and shared by every call. Use `items=None`.

</details>

### 2. Late-binding lambdas
```python
funcs = [lambda: i for i in range(3)]
print([f() for f in funcs])
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `[2, 2, 2]`

Each lambda looks up `i` when called, after the loop ends. Fix: `lambda i=i: i`.

</details>

### 3. List multiplication
```python
grid = [[0] * 2] * 2
grid[0][0] = 1
print(grid)
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `[[1, 0], [1, 0]]`

Both rows are the same list object. Use `[[0] * 2 for _ in range(2)]`.

</details>

### 4. `+=` on list vs tuple
```python
a = [1, 2]; b = a; b += [3]
t = (1, 2); u = t; u += (3,)
print(a, t)
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `[1, 2, 3] (1, 2)`

Lists change in place, so `a` sees it. Tuples can't change, so `u` becomes a new tuple.

</details>

### 5. Banker's rounding
```python
print(round(2.5), round(3.5), round(-0.5))
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `2 4 0`

Python rounds halves to the nearest **even** number.

</details>

### 6. `True` is 1
```python
d = {1: "one", True: "true", 1.0: "float"}
print(d, True + True)
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `{1: 'float'} 2`

`1`, `True` and `1.0` are equal and hash the same, so they're one key. The first key stays; the last value wins.

</details>

### 7. `finally` return
```python
def f():
    try:
        return "try"
    finally:
        return "finally"

print(f())
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `finally`

`finally` runs last and its `return` wins.

</details>

### 8. Slicing never fails
```python
nums = [1, 2, 3]
print(nums[5:], nums[-1:], nums[::-1])
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `[] [3] [3, 2, 1]`

Out-of-range slices return an empty list instead of an error (indexing `nums[5]` would fail).

</details>

### 9. Generators are used once
```python
gen = (x * x for x in range(3))
print(sum(gen), sum(gen))
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `5 0`

The first `sum` uses up the generator (0 + 1 + 4). The second gets nothing.

</details>

### 10. `is` vs `==`
```python
a = [1, 2]
b = [1, 2]
print(a == b, a is b)
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `True False`

Same values, different objects.

</details>
