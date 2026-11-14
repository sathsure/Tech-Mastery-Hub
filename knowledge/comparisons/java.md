# Java — Comparisons

> The classic "X vs Y" questions, side by side.

## JDK vs JRE vs JVM
| | Contains | Needed to |
|---|---|---|
| JVM | runtime engine | run bytecode |
| JRE | JVM + libraries | run apps |
| JDK | JRE + compiler, tools | build apps |

## Abstract class vs interface
| | Abstract class | Interface |
|---|---|---|
| State (fields) | ✅ | constants only |
| Constructors | ✅ | ❌ |
| How many per class | one | many |
| Methods with code | ✅ | `default` / `static` |

## Overloading vs overriding
| | Overloading | Overriding |
|---|---|---|
| Where | same class | subclass |
| Parameters | different | same |
| Decided at | compile time | runtime |

## `String` vs `StringBuilder` vs `StringBuffer`
| | Mutable | Thread-safe | Speed |
|---|---|---|---|
| `String` | ❌ | ✅ | slow for many edits |
| `StringBuilder` | ✅ | ❌ | fastest |
| `StringBuffer` | ✅ | ✅ | slower |

## `ArrayList` vs `LinkedList`
| | `ArrayList` | `LinkedList` |
|---|---|---|
| Get by index | O(1) | O(n) |
| Add/remove at ends | O(1)* / O(n) at front | O(1) |
| Memory | less | more (node links) |

## `HashMap` vs `TreeMap` vs `LinkedHashMap`
| | Order | Get/put |
|---|---|---|
| `HashMap` | none | O(1) |
| `LinkedHashMap` | insertion (or access) | O(1) |
| `TreeMap` | sorted keys | O(log n) |

## `HashMap` vs `Hashtable` vs `ConcurrentHashMap`
| | Thread-safe | Null keys | Speed |
|---|---|---|---|
| `HashMap` | ❌ | one allowed | fast |
| `Hashtable` | ✅ (whole-map lock) | ❌ | slow, legacy |
| `ConcurrentHashMap` | ✅ (fine-grained) | ❌ | fast |

## `Comparable` vs `Comparator`
| | `Comparable` | `Comparator` |
|---|---|---|
| Method | `compareTo` | `compare` |
| Defined | inside the class | outside |
| Orders | one natural order | many |

## Checked vs unchecked exceptions
| | Checked | Unchecked |
|---|---|---|
| Parent | `Exception` | `RuntimeException` |
| Must handle | ✅ | ❌ |
| Example | `IOException` | `NullPointerException` |

## `synchronized` vs `volatile` vs `Atomic*`
| | Visibility | Atomic `++` | Locking |
|---|---|---|---|
| `volatile` | ✅ | ❌ | ❌ |
| `synchronized` | ✅ | ✅ | ✅ |
| `AtomicInteger` | ✅ | ✅ | ❌ (CAS) |

## Heap vs stack
| | Heap | Stack |
|---|---|---|
| Holds | objects | method calls, local variables |
| Shared | by all threads | one per thread |
| Error when full | `OutOfMemoryError` | `StackOverflowError` |

## `sleep()` vs `wait()`
| | `Thread.sleep` | `Object.wait` |
|---|---|---|
| Releases the lock | ❌ | ✅ |
| Woken by | time | `notify` / time |

## Platform vs virtual threads
| | Platform | Virtual (Java 21) |
|---|---|---|
| Cost | heavy (OS thread) | very light |
| How many | thousands | millions |
| Best for | CPU work | blocking I/O |
