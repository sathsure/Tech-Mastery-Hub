# 🧠 Memory & Data: Where a Program Keeps Its Data

## Where data lives: RAM, disk and many servers (the big picture)

### ❓ What is the difference between data structures, a database and a data warehouse?

They all organise data — the difference is **where** the data lives and **how long** it lasts.

| Where the data lives | What organises it | Lasts | Example |
|---|---|---|---|
| **Main memory (RAM)** of one running program | **Data structures** — arrays, lists, hash maps, trees | Until the program stops | A `HashMap` of logged-in users inside a Spring Boot app |
| **Storage (disk/SSD)** of a server | **Database management system (DBMS)** — tables, indexes, transactions | Permanently | MySQL storing every order |
| **Many servers**, collected from many systems | **Data warehouse** — huge tables built for analysis | Years of history | Snowflake holding 5 years of sales from the app, payments and marketing |

**Analogy:**
- **RAM / data structures** = the papers on your desk while you work — fast, but cleared when you leave.
- **Disk / database** = the filing cabinet in your office — slower, but kept safely.
- **Data warehouse** = the company's central archive, combining every department's cabinets for big reports.

![A data warehouse collects data from many operational systems and serves reports and analysis](https://upload.wikimedia.org/wikipedia/commons/4/46/Data_warehouse_overview.JPG)

_Image: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Data_warehouse_overview.JPG) · Hhultgren · Public domain_

---

### ❓ What is the difference between CPU cache, RAM and disk?

Computers use layers of memory: the closer to the CPU, the **faster, smaller and more expensive** it is.

| Layer | Typical size | Speed (roughly) | Kept when power is off? |
|---|---|---|---|
| CPU registers | Bytes | Instant | No |
| CPU cache (L1/L2/L3) | KB – MB | ~1–10 ns | No |
| RAM | GBs | ~100 ns | No |
| SSD | 100s of GB – TBs | ~0.1 ms | Yes |
| Hard disk | TBs | ~10 ms | Yes |

![Memory hierarchy: registers and cache at the top are fastest and smallest; disks at the bottom are slowest and largest](https://upload.wikimedia.org/wikipedia/commons/0/0c/ComputerMemoryHierarchy.svg)

_Image: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:ComputerMemoryHierarchy.svg) · Danlas · Public domain_

**Why it matters:** reading from RAM is ~1,000× faster than from an SSD. That's why apps **cache** hot data in memory (Redis), and why databases keep busy pages in RAM.

---

## Stack and heap: memory inside a running program (all languages)

### ❓ What are stack and heap memory?

A running program splits its memory into two main areas:

- **Stack** — small and very fast. Holds each method call's **local variables** and where to return to. Each thread has its own stack. Memory is freed automatically when the method returns.
- **Heap** — large and shared by all threads. Holds **objects** (`new Order()`), arrays and anything that must outlive one method call. Freed by the garbage collector (Java, JS, Python) or by you (C, C++).

```java
void placeOrder() {
    int qty = 2;                    // stack: a simple local value
    Order order = new Order(qty);   // 'order' (the reference) is on the stack;
}                                   // the Order object itself is on the heap
```

![The call stack: each method call gets a frame with its local variables and return address](https://upload.wikimedia.org/wikipedia/commons/d/d3/Call_stack_layout.svg)

_Image: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Call_stack_layout.svg) · R. S. Shaw · Public domain_

**Common errors:** `StackOverflowError` = too many nested calls (usually endless recursion). `OutOfMemoryError: Java heap space` = too many live objects.

---

### ❓ How does garbage collection work?

The garbage collector (GC) finds objects your program can no longer reach and frees their memory, so you don't free memory by hand.

1. **Mark:** start from "roots" — local variables on stacks, static fields — and follow every reference, marking each object reached.
2. **Sweep / compact:** anything not marked is garbage; free it, and often move live objects together to avoid gaps.

![Mark and sweep: reachable objects are marked, the rest are swept away](https://upload.wikimedia.org/wikipedia/commons/4/4a/Animation_of_the_Naive_Mark_and_Sweep_Garbage_Collector_Algorithm.gif)

_Image: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Animation_of_the_Naive_Mark_and_Sweep_Garbage_Collector_Algorithm.gif) · M17 · CC0_

- **Generational GC** (JVM, .NET, V8): most objects die young, so new objects are collected often and cheaply; long-lived ones are checked rarely.
- **Pauses:** collection can briefly pause the app; modern collectors (Java's G1, ZGC) keep pauses very short.
- **Memory leak in a GC language** = objects still referenced by mistake, e.g. a static `Map` that only ever grows.

---

### ❓ What is virtual memory?

Each program gets its **own private address space**, as if it had the whole memory to itself. The operating system maps these virtual addresses to real RAM in fixed-size **pages**, and can move rarely used pages to disk.

![Virtual memory: each process's addresses map to pages in physical RAM or on disk](https://upload.wikimedia.org/wikipedia/commons/6/6e/Virtual_memory.svg)

_Image: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Virtual_memory.svg) · Ehamberg · CC BY-SA 3.0_

**Why:** one program can't read or crash another's memory (isolation), and programs can use more memory than physically free. When the system keeps moving pages to and from disk ("swapping"), everything gets very slow.
