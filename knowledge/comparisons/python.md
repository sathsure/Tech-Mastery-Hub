# Python — Comparisons

> The classic "X vs Y" questions, side by side.

## List vs tuple vs set vs dict
| | Ordered | Mutable | Duplicates | Lookup |
|---|---|---|---|---|
| `list` | ✅ | ✅ | ✅ | O(n) search |
| `tuple` | ✅ | ❌ | ✅ | O(n) search |
| `set` | ❌ | ✅ | ❌ | O(1) |
| `dict` | ✅ (insertion) | ✅ | unique keys | O(1) by key |

## `is` vs `==`
| | `is` | `==` |
|---|---|---|
| Compares | identity (same object) | value |
| Use for | `None` | everything else |

## Threads vs processes vs asyncio
| | Threads | Processes | asyncio |
|---|---|---|---|
| Limited by GIL | ✅ | ❌ | ✅ (one thread) |
| Best for | I/O work | CPU work | many I/O tasks |
| Memory | shared | separate | shared |

## `@staticmethod` vs `@classmethod` vs instance method
| | Gets | Use for |
|---|---|---|
| Instance | `self` | object behaviour |
| `@classmethod` | `cls` | alternative constructors |
| `@staticmethod` | nothing | helper related to the class |

## `__str__` vs `__repr__`
| | `__str__` | `__repr__` |
|---|---|---|
| For | users (`print`) | developers (debugging) |

## Generator vs list
| | Generator | List |
|---|---|---|
| Memory | one item at a time | everything at once |
| Reuse | once | many times |

## Shallow vs deep copy
| | `copy.copy` | `copy.deepcopy` |
|---|---|---|
| Nested objects | shared | copied |

## `sort()` vs `sorted()`
| | `list.sort()` | `sorted()` |
|---|---|---|
| Returns | `None` (in place) | a new list |
| Works on | lists only | any iterable |

## Django vs Flask vs FastAPI
| | Django | Flask | FastAPI |
|---|---|---|---|
| Style | batteries included | minimal | modern, typed |
| Async | partial | limited | ✅ |
| Auto API docs | ❌ | ❌ | ✅ |

## Python vs Java (often asked)
| | Python | Java |
|---|---|---|
| Typing | dynamic | static |
| Speed | slower | faster (JIT) |
| Strength | data, scripting, AI | large backend systems |
