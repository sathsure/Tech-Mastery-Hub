# 🧮 SQL Interview Queries

All examples use these tables:

```text
employees(id, name, salary, dept_id, manager_id)
departments(id, name)
customers(id, name)
orders(id, customer_id, amount, order_date)
```

## Joins

### ❓ What are the types of SQL joins? Explain with an example.

**Level:** 🟢 Beginner

### 📝 Answer

A join combines rows from two tables using a matching column.

| Join | Returns |
|---|---|
| `INNER JOIN` | Only rows that match in **both** tables |
| `LEFT JOIN` | **All** rows from the left table + matches (NULL if none) |
| `RIGHT JOIN` | All rows from the right table + matches |
| `FULL OUTER JOIN` | All rows from both (MySQL doesn't have it — use `LEFT JOIN ... UNION ... RIGHT JOIN`) |
| `CROSS JOIN` | Every row × every row (3 × 4 = 12 rows) |
| Self join | A table joined to itself (employee → manager) |

```text
customers: 1 Asha, 2 Ravi, 3 Meena        orders: (10, customer 1), (11, customer 1), (12, customer 2)

INNER JOIN → Asha-10, Asha-11, Ravi-12
LEFT JOIN  → Asha-10, Asha-11, Ravi-12, Meena-NULL
```

```sql
SELECT c.name, o.id AS order_id
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id;
```

#### ↳ Follow-up: Why did my LEFT JOIN behave like an INNER JOIN?

↪ A `WHERE` condition on the right table (`WHERE o.amount > 100`) removes the NULL rows. Put that condition in the `ON` clause instead.

---

### ❓ Find customers who have never placed an order.

**Level:** 🟢 Beginner

### 📝 Answer

```sql
-- LEFT JOIN + IS NULL
SELECT c.name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;

-- or NOT EXISTS (clear and safe with NULLs)
SELECT c.name
FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);
```

> ⚠️ **Trap:** `WHERE id NOT IN (SELECT customer_id FROM orders)` returns **nothing** if any `customer_id` is NULL. Prefer `NOT EXISTS`.

---

### ❓ Find employees who earn more than their manager.

**Level:** 🟢 Beginner

### 📝 Answer

A **self join**: the same table twice, once as employee and once as manager.

```sql
SELECT e.name AS employee, e.salary, m.name AS manager, m.salary AS manager_salary
FROM employees e
JOIN employees m ON e.manager_id = m.id
WHERE e.salary > m.salary;
```

---

## Window Functions

### ❓ What are window functions, and how do they differ from GROUP BY?

**Level:** 🟡 Intermediate

### 📝 Answer

`GROUP BY` **collapses** rows into one per group. A window function **keeps every row** and adds a calculated value from a group of related rows.

```sql
SELECT name, dept_id, salary,
       AVG(salary) OVER (PARTITION BY dept_id) AS dept_avg
FROM employees;
-- every employee row is still there, with its department's average next to it
```

- `PARTITION BY` = which rows form the group (like GROUP BY, without collapsing).
- `ORDER BY` inside `OVER` = order within the group (needed for ranks, running totals).

---

### ❓ ROW_NUMBER vs RANK vs DENSE_RANK?

**Level:** 🟡 Intermediate

### 📝 Answer

All number rows in order; they differ on **ties**.

| salary | ROW_NUMBER | RANK | DENSE_RANK |
|---|---|---|---|
| 900 | 1 | 1 | 1 |
| 800 | 2 | 2 | 2 |
| 800 | 3 | 2 | 2 |
| 700 | 4 | **4** | **3** |

- `ROW_NUMBER` — always unique (ties get different numbers).
- `RANK` — ties share a number, then it **skips** (1, 2, 2, 4).
- `DENSE_RANK` — ties share a number, **no gaps** (1, 2, 2, 3).

```sql
SELECT name, salary,
       ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_num,
       RANK()       OVER (ORDER BY salary DESC) AS rnk,
       DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rnk
FROM employees;
```

---

### ❓ Find the Nth highest salary (e.g. the 3rd).

**Level:** 🟡 Intermediate

### 📝 Answer

**With DENSE_RANK (handles ties correctly):**

```sql
SELECT DISTINCT salary
FROM (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS r FROM employees) t
WHERE r = 3;
```

**With LIMIT/OFFSET:**

```sql
SELECT DISTINCT salary FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 2;          -- skip 2, take 1
```

**Without window functions or LIMIT:**

```sql
SELECT MAX(salary) FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees
                WHERE salary < (SELECT MAX(salary) FROM employees));
```

> ⚠️ **Trap:** without `DISTINCT`, two people on the top salary make "2nd highest" return the top salary again.

---

### ❓ Find the highest-paid employee in each department.

**Level:** 🟡 Intermediate

### 📝 Answer

```sql
SELECT dept_id, name, salary
FROM (
  SELECT dept_id, name, salary,
         RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS r
  FROM employees
) t
WHERE r = 1;               -- RANK keeps ties; use ROW_NUMBER for exactly one per dept
```

The same pattern gives **top N per group**: `WHERE r <= 3`.

---

### ❓ How do you calculate a running total?

**Level:** 🟡 Intermediate

### 📝 Answer

```sql
SELECT order_date, amount,
       SUM(amount) OVER (ORDER BY order_date) AS running_total
FROM orders;
```

Add `PARTITION BY customer_id` to restart the total for each customer.

---

### ❓ What do LAG and LEAD do?

**Level:** 🟡 Intermediate

### 📝 Answer

They read a value from the **previous (LAG)** or **next (LEAD)** row — no self join needed.

```sql
-- change in amount compared with the customer's previous order
SELECT customer_id, order_date, amount,
       amount - LAG(amount) OVER (PARTITION BY customer_id ORDER BY order_date) AS change
FROM orders;
```

The first row of each group gets NULL (no previous row).

---

## Duplicates & Data Cleanup

### ❓ Find duplicate rows.

**Level:** 🟢 Beginner

### 📝 Answer

```sql
SELECT name, COUNT(*) AS copies
FROM employees
GROUP BY name
HAVING COUNT(*) > 1;
```

---

### ❓ Delete duplicate rows but keep one.

**Level:** 🟡 Intermediate

### 📝 Answer

Keep the row with the smallest `id` for each duplicate name:

```sql
DELETE FROM employees
WHERE id NOT IN (
  SELECT keep_id FROM (SELECT MIN(id) AS keep_id FROM employees GROUP BY name) k
);
```

The inner `SELECT ... k` wrapper is needed in MySQL (it can't delete from a table it reads in the same subquery).

With a window function (PostgreSQL, MySQL 8, SQL Server):

```sql
DELETE FROM employees WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY name ORDER BY id) AS rn FROM employees
  ) t WHERE rn > 1
);
```

---

### ❓ DELETE vs TRUNCATE vs DROP?

**Level:** 🟡 Intermediate

### 📝 Answer

| | `DELETE` | `TRUNCATE` | `DROP` |
|---|---|---|---|
| Removes | Some or all rows (`WHERE` allowed) | All rows | The whole table (structure too) |
| Speed | Slow (row by row, logged) | Fast | Fast |
| Rollback | Yes (in a transaction) | Usually no in MySQL (implicit commit); yes in PostgreSQL | Usually no in MySQL |
| Triggers fire | Yes | No | No |
| Auto-increment | Continues | Resets | Gone |

---

## Aggregation Tricks

### ❓ What is the difference between COUNT(*), COUNT(column) and COUNT(DISTINCT column)?

**Level:** 🟡 Intermediate

### 📝 Answer

- `COUNT(*)` — all rows, including NULLs.
- `COUNT(manager_id)` — rows where `manager_id` is **not NULL**.
- `COUNT(DISTINCT dept_id)` — number of different non-NULL values.

Example: 5 employees, 1 has no manager → `COUNT(*) = 5`, `COUNT(manager_id) = 4`.

---

### ❓ How do you turn rows into columns (pivot)?

**Level:** 🟡 Intermediate

### 📝 Answer

Use conditional aggregation with `CASE`:

```sql
SELECT customer_id,
       SUM(CASE WHEN strftime('%Y', order_date) = '2025' THEN amount ELSE 0 END) AS total_2025,
       SUM(CASE WHEN strftime('%Y', order_date) = '2026' THEN amount ELSE 0 END) AS total_2026
FROM orders
GROUP BY customer_id;
```

(`strftime` is SQLite; use `YEAR(order_date) = 2025` in MySQL or `EXTRACT(YEAR FROM order_date)` in PostgreSQL.)

---

### ❓ UNION vs UNION ALL?

**Level:** 🟡 Intermediate

### 📝 Answer

Both stack the results of two queries.

- `UNION` removes duplicate rows (extra sort/compare — slower).
- `UNION ALL` keeps everything (faster). Use it unless you need duplicates removed.

Both queries must return the same number of columns with compatible types.

---

## CTEs & Recursion

### ❓ What is a CTE (WITH clause)?

**Level:** 🟡 Intermediate

### 📝 Answer

A **Common Table Expression** is a named, temporary result you can use in the next query — it makes long queries readable.

```sql
WITH dept_totals AS (
  SELECT dept_id, SUM(salary) AS total FROM employees GROUP BY dept_id
)
SELECT d.name, t.total
FROM dept_totals t JOIN departments d ON d.id = t.dept_id
WHERE t.total > 1000;
```

---

### ❓ How do you query a hierarchy (org chart) with a recursive CTE?

**Level:** 🟡 Intermediate

### 📝 Answer

Start from the top (anchor), then repeatedly join to find the next level.

```sql
WITH RECURSIVE chain AS (
  SELECT id, name, manager_id, 1 AS level
  FROM employees WHERE manager_id IS NULL          -- the CEO
  UNION ALL
  SELECT e.id, e.name, e.manager_id, c.level + 1
  FROM employees e JOIN chain c ON e.manager_id = c.id
)
SELECT name, level FROM chain ORDER BY level, name;
```

---

## Transactions & Isolation

### ❓ What are transaction isolation levels and which problems do they prevent?

**Level:** 🟡 Intermediate

### 📝 Answer

Isolation decides **how much one transaction sees of another's unfinished work**.

**The problems**

- **Dirty read** — you read a change that is later rolled back.
- **Non-repeatable read** — you read a row twice and get different values (someone updated it).
- **Phantom read** — you run the same query twice and get new rows (someone inserted).

| Level | Dirty read | Non-repeatable | Phantom |
|---|---|---|---|
| Read Uncommitted | Possible | Possible | Possible |
| Read Committed (PostgreSQL, SQL Server default) | Prevented | Possible | Possible |
| Repeatable Read (MySQL InnoDB default) | Prevented | Prevented | Possible* |
| Serializable | Prevented | Prevented | Prevented |

\*InnoDB also blocks most phantoms in Repeatable Read using next-key locks.

Higher isolation = safer but slower (more locking or retries).

---

### ❓ What is a deadlock in a database?

**Level:** 🟡 Intermediate

### 📝 Answer

Two transactions each lock a row the other needs:

```text
T1: UPDATE accounts ... WHERE id = 1;   (locks row 1)
T2: UPDATE accounts ... WHERE id = 2;   (locks row 2)
T1: UPDATE accounts ... WHERE id = 2;   (waits for T2)
T2: UPDATE accounts ... WHERE id = 1;   (waits for T1) → deadlock
```

The database detects it and **rolls back one transaction**; the app should retry it. Prevent it by always updating rows in the **same order** (e.g. lower id first) and keeping transactions short.

---

## Performance

### ❓ OFFSET pagination vs keyset (cursor) pagination?

**Level:** 🟡 Intermediate

### 📝 Answer

```sql
-- OFFSET: easy, but page 10,000 still reads and throws away 200,000 rows
SELECT * FROM orders ORDER BY id LIMIT 20 OFFSET 200000;

-- Keyset: jump straight to where the last page ended (uses the index)
SELECT * FROM orders WHERE id > 200020 ORDER BY id LIMIT 20;
```

Keyset is fast on any page and doesn't skip/repeat rows when new rows are inserted. Downside: no "jump to page 57".

---

### ❓ Tricky: Why does `WHERE YEAR(order_date) = 2026` ignore the index on order_date?

**Level:** 🟡 Intermediate

### 📝 Answer

Wrapping the column in a function means the database must compute it for **every row** — the index is on `order_date`, not on `YEAR(order_date)`. Rewrite as a range:

```sql
WHERE order_date >= '2026-01-01' AND order_date < '2027-01-01'
```

Same for `WHERE LOWER(email) = ...` or `WHERE salary + 100 > 1000`.

---

### ❓ Tricky: What does `SELECT NULL = NULL` return?

**Level:** 🟡 Intermediate

### 📝 Answer

`NULL` (unknown), not true. NULL means "unknown", so comparing it with anything is unknown. Use `IS NULL` / `IS NOT NULL`. This is also why `WHERE manager_id = NULL` returns no rows.

---

### ❓ Tricky: Can you use a column alias in WHERE?

**Level:** 🟡 Intermediate

### 📝 Answer

No — `WHERE` runs **before** `SELECT`, so the alias doesn't exist yet.

```sql
SELECT salary * 12 AS yearly FROM employees WHERE yearly > 100000;     -- ❌ error
SELECT salary * 12 AS yearly FROM employees WHERE salary * 12 > 100000; -- ✅
```

You **can** use it in `ORDER BY` (runs after `SELECT`), and MySQL also allows it in `HAVING`.



---

## Indexes & Transactions Deep Dive (Intermediate)

### ❓ What is ACID? Explain each property with an example.

### 📝 Answer

ACID is the set of guarantees a database transaction gives. Example: transfer ₹500 from Asha to Ravi.

```sql
START TRANSACTION;
UPDATE accounts SET balance = balance - 500 WHERE name = 'Asha';
UPDATE accounts SET balance = balance + 500 WHERE name = 'Ravi';
COMMIT;
```

| Property | Means | In the example | How databases do it |
|---|---|---|---|
| **Atomicity** | all or nothing | money never leaves Asha without reaching Ravi | undo log / rollback |
| **Consistency** | rules always hold | balance can't go negative (CHECK), foreign keys stay valid | constraints, triggers |
| **Isolation** | transactions don't see each other's half-done work | another query never sees ₹500 "in the air" | locks, MVCC, isolation levels |
| **Durability** | once committed, it survives a crash | power cut after COMMIT → the transfer is still there | write-ahead log (redo log) flushed to disk |

#### ↳ Follow-up: ACID vs BASE?

↪ BASE (Basically Available, Soft state, Eventually consistent) is the trade-off many distributed NoSQL systems make: stay available and scale, accept short-lived inconsistency.

---

### ❓ Clustered vs non-clustered index — what's the difference?

### 📝 Answer

| | Clustered index | Non-clustered (secondary) index |
|---|---|---|
| What it stores | **the table rows themselves**, sorted by the key | key values + a **pointer** to the row |
| How many per table | **one** (rows can be sorted only one way) | many |
| In MySQL InnoDB | the **primary key** | every other index; its pointer is the primary key value |
| Range scans on the key | very fast (rows are next to each other) | needs a lookup per row (unless covering) |

```mermaid
flowchart LR
  subgraph SI[Secondary index on email]
    e1[a@x.com → id 7]
    e2[b@x.com → id 3]
  end
  subgraph CI["Clustered index = the table, sorted by id"]
    r3[id 3 · Ravi · …]
    r7[id 7 · Asha · …]
  end
  e1 --> r7
  e2 --> r3
```

A query by `email` in InnoDB: search the secondary B+ tree → get the primary key → search the clustered index for the row (**two lookups**).

#### ↳ Follow-up: Why is a random UUID a poor InnoDB primary key?

↪ New rows land in random places in the clustered index, causing page splits and fragmentation. Prefer auto-increment or time-ordered ids (UUIDv7, ULID).

---

### ❓ How do composite indexes work? What is the leftmost prefix rule?

### 📝 Answer

A **composite index** covers several columns, sorted by the first, then the second within it, and so on — like a phone book sorted by last name, then first name.

```sql
CREATE INDEX idx_orders ON orders (customer_id, status, created_at);
```

**Leftmost prefix rule** — the index helps only when the query uses columns **from the left**, without gaps:

| Query filters on | Uses the index? |
|---|---|
| `customer_id` | ✅ |
| `customer_id, status` | ✅ |
| `customer_id, status, created_at` | ✅ |
| `customer_id` + `ORDER BY status` | ✅ (sort comes free) |
| `status` only | ❌ |
| `created_at` only | ❌ |
| `customer_id, created_at` (skips status) | partly — only the `customer_id` part |

**Column order tip:** equality filters first (`=`), then the range or sort column (`>`, `BETWEEN`, `ORDER BY`). A range stops the index from being used for the columns after it.

#### ↳ Follow-up: One composite index or several single-column indexes?

↪ For a query that filters on several columns together, one composite index in the right order is usually much faster.

---

### ❓ What is a covering index?

### 📝 Answer

An index that contains **every column a query needs**, so the database answers from the index alone and **never reads the table rows** ("index-only scan"). `EXPLAIN` in MySQL shows `Using index`.

```sql
CREATE INDEX idx_cust_status_total ON orders (customer_id, status, total);

SELECT status, total            -- every column is in the index
FROM orders
WHERE customer_id = 42;         -- ✅ covering: no table lookups
```

```sql
SELECT status, total, shipping_address  -- shipping_address isn't in the index
FROM orders WHERE customer_id = 42;     -- ❌ needs a row lookup per match
```

PostgreSQL and SQL Server can add extra non-key columns with `INCLUDE (...)`.

**Trade-off:** wider indexes use more disk and slow down writes — cover only your hottest queries.

#### ↳ Follow-up: Why does `SELECT *` hurt?

↪ It can never be covered by an index and sends more data over the network.

---

### ❓ What is MVCC (Multi-Version Concurrency Control)?

### 📝 Answer

With **MVCC**, an update doesn't overwrite a row in place; it creates a **new version**. Each transaction reads a **snapshot**: the versions that were committed when its snapshot was taken.

```text
Row "Asha, balance": v1 = 1000 (committed)
T1 (snapshot at 10:00) reads → 1000
T2 updates to 500 → creates v2 = 500, commits at 10:01
T1 reads again → still 1000 (its snapshot)  ← Repeatable Read
New transaction at 10:02 → 500
```

**Why it matters:** **readers don't block writers and writers don't block readers** — big concurrency win. Two writers updating the **same** row still wait for each other (row lock).

- **PostgreSQL** keeps old versions in the table; **VACUUM** removes dead ones.
- **MySQL InnoDB** keeps old versions in the **undo log**.

#### ↳ Follow-up: Can a long-running transaction cause problems?

↪ Yes — old versions can't be cleaned up while it's open, so tables/undo logs grow (bloat) and performance drops.

---
