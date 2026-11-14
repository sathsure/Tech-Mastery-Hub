# Python — Cheat Sheet

> **In one line:** a simple, readable language used for backend APIs, data work, automation and AI.

## Core types
- **Can't change (immutable):** `int`, `float`, `bool`, `str`, `tuple`.
- **Can change (mutable):** `list`, `dict`, `set`.
- Only immutable values can be dict keys or set items.
- `==` — same value. `is` — same object (use `is None`).

```python
nums = [3, 1, 2]                 # list
user = {"name": "Asha"}          # dict (keeps insertion order)
point = (1, 2)                   # tuple
tags = {"a", "b"}                # set (unique values)
```

## Handy syntax
```python
squares = [n * n for n in range(5)]        # list comprehension → [0, 1, 4, 9, 16]
by_id = {u.id: u for u in users}           # dict comprehension
nums[-1], nums[1:3], nums[::-1]            # last item, slice, reversed
a, b = b, a                                # swap
```

## Functions
- `*args` — extra positional arguments (a tuple). `**kwargs` — extra named arguments (a dict).
- `lambda x: x * 2` — a small one-line function.
- **Scope order (LEGB):** Local → Enclosing → Global → Built-in.

## Decorators
A function that wraps another to add behaviour (logging, timing, auth).
```python
def log_calls(fn):
    def wrapper(*args, **kwargs):
        print("calling", fn.__name__)
        return fn(*args, **kwargs)
    return wrapper

@log_calls
def greet(name): return f"Hi {name}"
```
- Built-in ones: `@property`, `@staticmethod`, `@classmethod`, `@lru_cache`, `@dataclass`.

## Generators
- `yield` gives values one at a time — uses little memory for big data.
```python
def read_lines(path):
    with open(path) as f:
        for line in f:
            yield line.strip()
```

## Classes
- `__init__` — sets up a new object. `self` — the current object.
- `@classmethod` — gets the class (`cls`); used for alternative constructors.
- `@staticmethod` — a plain function inside a class.
- **Dunder methods** — `__str__` (nice text), `__repr__` (debug text), `__eq__`, `__len__`.
- `@dataclass` — writes `__init__`, `__repr__` and `__eq__` for you.
- `_name` means "internal" by convention (Python has no real private).

## Concurrency
- **GIL** — only one thread runs Python code at a time.
- **Waiting work** (network, files) → `asyncio` or threads.
- **Heavy CPU work** → `multiprocessing` (separate processes).
```python
results = await asyncio.gather(fetch(a), fetch(b))   # run both at once
```

## Errors & files
- `try / except / else / finally`; `raise ValueError("bad input")`.
- `with open("a.txt") as f:` closes the file automatically (a **context manager**).

## Tooling
- `venv` — a separate environment per project. `pip install`, `requirements.txt` or `pyproject.toml`.
- `if __name__ == "__main__":` — run only when the file is run directly.
- Type hints `def add(a: int, b: int) -> int:`; check with mypy.

## Web, tests, data
- **FastAPI** (fast, async, auto docs), **Django** (full-featured), **Flask** (minimal).
- **pytest** — plain `assert`, fixtures, `@pytest.mark.parametrize`.
- **pandas** — tables (`DataFrame`): `read_csv`, `groupby`, `merge`. **NumPy** — fast arrays.
