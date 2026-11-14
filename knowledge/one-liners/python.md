# Python — One-liners

> The most asked questions, each answered in one sentence.

1. **List vs tuple?** — A list can change; a tuple can't, so it can be a dict key.
2. **Mutable vs immutable types?** — Lists, dicts and sets can change; ints, strings and tuples can't.
3. **`is` vs `==`?** — `is` checks the same object; `==` checks equal values.
4. **What is a decorator?** — A function that wraps another function to add behaviour.
5. **What is a generator?** — A function that uses `yield` to produce values one at a time, saving memory.
6. **What are `*args` and `**kwargs`?** — Extra positional arguments as a tuple and extra keyword arguments as a dict.
7. **What is the GIL?** — A lock that lets only one thread run Python bytecode at a time in CPython.
8. **Threads vs processes in Python?** — Threads suit waiting (I/O) work; processes suit heavy CPU work.
9. **What is `asyncio`?** — A library for running many I/O tasks concurrently on one thread with `async`/`await`.
10. **What is a list comprehension?** — A short way to build a list: `[x * 2 for x in nums if x > 0]`.
11. **`@staticmethod` vs `@classmethod`?** — A static method gets no `self` or `cls`; a class method gets the class as `cls`.
12. **What is `__init__`?** — The method that sets up a new object.
13. **`__str__` vs `__repr__`?** — `__str__` is for users; `__repr__` is a precise version for developers.
14. **What is a context manager?** — An object used with `with` that sets up and cleans up, like closing a file.
15. **Shallow vs deep copy?** — A shallow copy shares nested objects; `copy.deepcopy` copies them too.
16. **What is a lambda?** — A small anonymous one-expression function.
17. **What is a virtual environment?** — An isolated folder of packages for one project.
18. **What is `if __name__ == "__main__"` for?** — Code inside it runs only when the file is run directly, not imported.
19. **What is a dataclass?** — A class decorator that generates `__init__`, `__repr__` and `__eq__` from fields.
20. **What is the LEGB rule?** — Python looks up names in Local, Enclosing, Global, then Built-in scope.
21. **What is duck typing?** — If an object has the needed methods, it can be used, whatever its class.
