# 🧱 Inside Common Data Structures

## Inside common data structures (ideas apply to every language; Java examples)

### ❓ How does a HashMap work internally?

A HashMap stores key–value pairs in an **array of buckets**. It finds the right bucket instantly by turning the key into a number — its **hash**.

**Analogy:** a library with 26 shelves labelled A–Z. To find "Harry Potter" you don't search every shelf — you go straight to shelf **H**. The first letter is the "hash".

**`map.put("ravi", 42)`:**
1. Compute `"ravi".hashCode()` → a number.
2. Turn it into a bucket index: `hash & (capacity − 1)`.
3. Store the entry in that bucket. If another key is already there (a **collision**), add it to that bucket's list.

**`map.get("ravi")`:** same hash → same bucket → check each entry with `equals()` → return the value. On average **O(1)**.

![Hash table: keys are hashed to bucket indexes; colliding keys share a bucket](https://upload.wikimedia.org/wikipedia/commons/7/7d/Hash_table_3_1_1_0_1_0_0_SP.svg)

_Image: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Hash_table_3_1_1_0_1_0_0_SP.svg) · Jorge Stolfi · CC BY-SA 3.0_

**Java details interviewers ask:**
- Default capacity 16, **load factor 0.75** — when 75% full, the array doubles and entries are re-spread ("rehashing").
- Since Java 8, a bucket with more than 8 entries turns into a **red-black tree**, so the worst case is O(log n) instead of O(n).
- Override **both** `equals()` and `hashCode()` for your own key classes, or lookups fail.

#### ↳ Follow-up: Why can't you get the key back from its hash?

↪ Hashing is one-way and squeezes many possible keys into a fixed range of numbers, so different keys can share a hash. The map keeps the real key in the bucket for exactly that reason.

---

### ❓ How do ArrayList and LinkedList store data differently?

- **ArrayList** keeps elements in **one block of memory** (an array). Reading `get(i)` is instant — O(1) — because the position is calculated. Inserting in the middle shifts everything after it.
- **LinkedList** keeps each element in a separate **node** that points to the next (and previous). Inserting at a known node is quick, but finding element *i* means walking the chain — O(n).

![Linked list: each node holds a value and a pointer to the next node](https://upload.wikimedia.org/wikipedia/commons/6/6d/Singly-linked-list.svg)

_Image: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Singly-linked-list.svg) · Lasindi · Public domain_

**In practice:** use **ArrayList** almost always — its continuous memory works with CPU caches and is faster even for many inserts. Use `ArrayDeque` for queues and stacks.

---

### ❓ How do stacks, queues and heaps work?

| Structure | Order | Main operations | Real use |
|---|---|---|---|
| **Stack** | Last in, first out | push, pop — O(1) | Undo, the call stack, matching brackets |
| **Queue** | First in, first out | add, poll — O(1) | Task queues, breadth-first search |
| **Heap / priority queue** | Smallest (or largest) first | add, poll — O(log n); peek — O(1) | Scheduling, "top K" problems, Dijkstra's algorithm |

**Example:** a hospital emergency room is a **priority queue** — the most urgent patient is treated first, not the one who arrived first. Java: `PriorityQueue`.

---

### ❓ How do trees like the B+ tree speed up searching?

A **balanced search tree** keeps data sorted, so each step halves (or better) the remaining search space — about **log(n)** steps instead of checking everything.

- **Binary search tree / red-black tree:** each node has two children; used in memory (`TreeMap`).
- **B+ tree:** each node holds **many** keys, so the tree is very short — a few levels can index millions of rows. All data sits in the leaves, linked together for fast range scans. **This is how database indexes work** (see *Inside a database*).

![B+ tree: internal nodes guide the search; the leaves hold the values and link to each other](https://upload.wikimedia.org/wikipedia/commons/3/37/Bplustree.png)

_Image: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Bplustree.png) · Grundprinzip · CC BY 3.0_

**Numbers to quote:** a B+ tree with 100 keys per node finds one row among **1 million** in about **3 reads**.
