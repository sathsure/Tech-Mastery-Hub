# Python — Code Snippets

> Code interviewers ask you to write from memory. Short, commented, ready to explain.

### 1. Decorator with arguments (retry)
```python
import functools, time

def retry(times=3, delay=0.5):
    def decorator(fn):
        @functools.wraps(fn)                     # keep the original name/docstring
        def wrapper(*args, **kwargs):
            for attempt in range(times):
                try:
                    return fn(*args, **kwargs)
                except Exception:
                    if attempt == times - 1:
                        raise
                    time.sleep(delay * 2 ** attempt)
        return wrapper
    return decorator

@retry(times=3)
def fetch(url): ...
```

### 2. Timing context manager
```python
from contextlib import contextmanager
import time

@contextmanager
def timer(label):
    start = time.perf_counter()
    try:
        yield
    finally:
        print(f"{label}: {time.perf_counter() - start:.3f}s")

with timer("load"):
    load_data()
```

### 3. Generator for big files
```python
def read_in_chunks(path, size=1024 * 1024):
    with open(path, "rb") as f:
        while chunk := f.read(size):
            yield chunk
```

### 4. Dataclass
```python
from dataclasses import dataclass, field

@dataclass(frozen=True)              # immutable, hashable
class Order:
    id: int
    items: tuple[str, ...] = ()
    tags: list[str] = field(default_factory=list)   # safe mutable default
```

### 5. Concurrent HTTP calls with asyncio
```python
import asyncio, httpx

async def fetch_all(urls):
    async with httpx.AsyncClient(timeout=5) as client:
        responses = await asyncio.gather(*(client.get(u) for u in urls), return_exceptions=True)
    return [r.status_code if not isinstance(r, Exception) else None for r in responses]

asyncio.run(fetch_all(["https://a.com", "https://b.com"]))
```

### 6. CPU work in parallel
```python
from concurrent.futures import ProcessPoolExecutor

with ProcessPoolExecutor() as pool:
    results = list(pool.map(heavy_calculation, inputs))   # separate processes → no GIL limit
```

### 7. FastAPI endpoint with validation
```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr

app = FastAPI()

class UserIn(BaseModel):
    name: str
    email: EmailStr

@app.post("/users", status_code=201)
async def create_user(user: UserIn):
    if await exists(user.email):
        raise HTTPException(status_code=409, detail="Email already used")
    return await save(user)
```

### 8. Counting and grouping
```python
from collections import Counter, defaultdict

Counter("banana").most_common(1)          # [('a', 3)]

by_dept = defaultdict(list)
for e in employees:
    by_dept[e.dept].append(e.name)
```

### 9. pytest with fixtures and parametrize
```python
import pytest

@pytest.fixture
def cart():
    return Cart()

@pytest.mark.parametrize("price,qty,total", [(10, 2, 20), (5, 0, 0)])
def test_total(cart, price, qty, total):
    cart.add(price, qty)
    assert cart.total() == total
```
