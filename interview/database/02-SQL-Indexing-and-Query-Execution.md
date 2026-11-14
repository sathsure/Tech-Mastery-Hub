# SQL Indexing, Query Execution and GROUP BY (MySQL)

## Indexes

### ❓ How does an index work?

**Level:** 🟡 Intermediate

### 📝 Answer

An index lets the database find rows **without scanning the whole table**.

```sql
SELECT * FROM customers WHERE customer_id = 750000;
```

With 1 million rows:

| Without an index | With an index |
|---|---|
| Full table scan | Index lookup |
| Potentially `O(n)` | `O(log n)` B+ Tree traversal |
| Reads many rows and pages | Reads a few relevant pages |

Actual speed also depends on data distribution, caching and the execution plan the optimizer chooses.

---

### ❓ Is an index a separate table?

**Level:** 🟡 Intermediate

### 📝 Answer

No. It is a **separate data structure managed by the database**, not a table you can query.

```sql
CREATE TABLE customers (
    id   INT PRIMARY KEY,
    name VARCHAR(100),
    city VARCHAR(100)
);

CREATE INDEX idx_city ON customers (city);
```

InnoDB keeps two B+ Trees:

**Clustered index (the table itself, ordered by primary key)**

| id | name | city |
|---|---|---|
| 101 | Arun | Chennai |
| 102 | Priya | Bengaluru |
| 103 | Ravi | Chennai |

**Secondary index `idx_city` (ordered by city, then primary key)**

| city | id |
|---|---|
| Bengaluru | 102 |
| Chennai | 101 |
| Chennai | 103 |

| Index type | Leaf entries contain |
|---|---|
| Primary key (clustered) | The complete row |
| Secondary index | Indexed columns + primary key |

A query through a secondary index first finds the primary keys, then looks each row up in the clustered index (a **bookmark / clustered-index lookup**). If the index already contains every column the query needs, that second step is skipped — a **covering index**.

---

### ❓ Where is an index stored?

**Level:** 🟡 Intermediate

### 📝 Answer

| Location | What |
|---|---|
| Disk | Index pages in InnoDB tablespaces — with `innodb_file_per_table`, the table and its indexes share the `.ibd` file |
| RAM | Frequently used index and data pages cached in the **buffer pool** |
| Data dictionary | Index **metadata** (name, columns, type) |

Index metadata and index data are different things: the dictionary says the index exists; the pages hold the B+ Tree itself.

---

### ❓ Why might MySQL do a full table scan even though there is an index on employee_id?

**Level:** 🟡 Intermediate

### 📝 Answer

- **Low selectivity:** the condition matches a large share of rows (e.g. `employee_id > 10`), so reading the table sequentially is cheaper than many index lookups.
- **Small table:** a few pages are faster to scan than to search.
- **A function or calculation on the column:** `WHERE employee_id + 1 = 101` or `WHERE YEAR(hired_at) = 2024` can't use a plain index. Rewrite as `employee_id = 100` or a date range, or use a functional index.
- **Implicit type conversion:** comparing a `VARCHAR` column with a number (`WHERE code = 123`) converts every value.
- **Composite index used without its leftmost column:** an index on `(dept_id, employee_id)` doesn't help `WHERE employee_id = 5`.
- **`OR` across different columns, or `LIKE '%text'`** with a leading wildcard.
- **Stale statistics:** the optimizer misestimates; run `ANALYZE TABLE`.

Check with `EXPLAIN`; `type = ALL` means a full scan.

---

### ❓ How does an index improve a JOIN on customer_id?

**Level:** 🟡 Intermediate

### 📝 Answer

```sql
SELECT c.name, o.total
FROM customers c
JOIN orders o ON o.customer_id = c.id
WHERE c.city = 'Chennai';
```

For each matching customer, MySQL needs that customer's orders. With an index on `orders.customer_id`, each lookup is a quick B+ Tree search instead of scanning the whole `orders` table:

| | Without an index on `orders.customer_id` | With an index |
|---|---|---|
| Per customer | Scan all orders | Index lookup |
| Total | ~ customers × orders | ~ customers × log(orders) |

Index the join column of the table being looked up (foreign keys usually; InnoDB creates an index for a declared foreign key automatically). Without a usable index, MySQL 8 may fall back to a **hash join**, which is better than a nested scan but still reads the whole table.

---

### ❓ Why not index every column?

**Level:** 🟡 Intermediate

### 📝 Answer

Every index:

- uses disk and buffer-pool memory;
- must be updated on every `INSERT`, `UPDATE` and `DELETE`, slowing writes;
- gives the optimizer more plans to consider.

Index columns used in `WHERE`, `JOIN`, `ORDER BY` and `GROUP BY` of frequent queries, prefer selective columns, and use composite indexes in the order queries filter by.

## Query Execution Order

### ❓ What is the logical query execution order in SQL?

**Level:** 🟡 Intermediate

### 📝 Answer

```sql
SELECT department, COUNT(*)
FROM employees
WHERE salary > 50000
GROUP BY department
HAVING COUNT(*) > 5
ORDER BY department
LIMIT 10 OFFSET 5;
```

| Order | Clause | Purpose |
|---|---|---|
| 1 | `FROM` | Identify the source tables |
| 2 | `JOIN … ON` | Combine tables using the join condition |
| 3 | `WHERE` | Filter individual rows |
| 4 | `GROUP BY` | Group the remaining rows |
| 5 | `HAVING` | Filter groups |
| 6 | `SELECT` (+ `DISTINCT`) | Compute the output columns and expressions |
| 7 | `ORDER BY` | Sort the result |
| 8 | `LIMIT … OFFSET` | Skip `OFFSET` rows, then return up to `LIMIT` rows |

That's why a `SELECT` alias can be used in `ORDER BY` but not in `WHERE` (MySQL also allows aliases in `HAVING` as an extension).

---

### ❓ Where do indexes fit when a SQL query runs?

**Level:** 🟡 Intermediate

### 📝 Answer

**Nowhere — an index is not a SQL clause.** The optimizer considers indexes while **planning** the query, before execution starts. It can use them to speed up:

- `WHERE` filters;
- `JOIN` conditions;
- `GROUP BY` (reading rows already grouped in index order);
- `ORDER BY` (avoiding a sort);
- covering-index queries (no table access at all).

The physical execution plan can therefore differ from the logical clause order.

## WHERE, HAVING and GROUP BY

### ❓ What is the difference between the WHERE and HAVING clauses?

**Level:** 🟡 Intermediate

### 📝 Answer

| WHERE | HAVING |
|---|---|
| Filters individual **rows** | Filters **groups** |
| Runs before `GROUP BY` | Runs after `GROUP BY` |
| Can't use aggregate functions | Typically uses `COUNT`, `SUM`, `AVG`… |

```sql
SELECT department, COUNT(*) AS employee_count
FROM employees
WHERE salary > 50000
GROUP BY department
HAVING COUNT(*) > 2;
```

Sample `employees` table:

| id | name | department | salary |
|---|---|---|---:|
| 1 | Arun | IT | 70000 |
| 2 | Priya | IT | 60000 |
| 3 | Ravi | IT | 80000 |
| 4 | Kumar | HR | 40000 |
| 5 | Divya | HR | 70000 |
| 6 | Meena | Finance | 90000 |

1. **FROM** — read all 6 rows.
2. **WHERE salary > 50000** — Kumar is removed; 5 rows remain.
3. **GROUP BY department** — IT: 3, HR: 1, Finance: 1.
4. **HAVING COUNT(\*) > 2** — only IT remains.
5. **SELECT** — department and its count.

| department | employee_count |
|---|---:|
| IT | 3 |

---

### ❓ Does HAVING require the aggregate column in SELECT?

**Level:** 🟡 Intermediate

### 📝 Answer

No. `SELECT` decides what is **displayed**; `HAVING` decides which groups are **kept**.

```sql
SELECT department
FROM employees
GROUP BY department
HAVING COUNT(*) > 2;
```

| department |
|---|
| IT |

`COUNT(*)` filters the groups without appearing in the output. Add `COUNT(*) AS employee_count` to `SELECT` if you want to show it.

---

### ❓ What happens if you add a non-aggregated column (name) to SELECT without adding it to GROUP BY?

**Level:** 🟡 Intermediate

### 📝 Answer

```sql
SELECT department, name
FROM employees
GROUP BY department
HAVING COUNT(*) > 2;
```

With `ONLY_FULL_GROUP_BY` enabled (MySQL's default since 5.7) the query **fails**: the IT group has three names (Arun, Priya, Ravi) and there is no single correct one to show. With that mode disabled, MySQL returns an **arbitrary** name — a common source of bugs.

The exception: a column that is **functionally dependent** on the grouped columns is allowed, e.g. any column of the table when you group by its primary key.

To show names, either aggregate them (`GROUP_CONCAT(name)`) or join the grouped result back to the table.

---

### ❓ What happens if you add name to GROUP BY as well?

**Level:** 🟡 Intermediate

### 📝 Answer

```sql
SELECT department, name
FROM employees
GROUP BY department, name
HAVING COUNT(*) > 2;
```

Now **every department–name combination is its own group**:

| department | name | COUNT(\*) |
|---|---|---:|
| IT | Arun | 1 |
| IT | Priya | 1 |
| IT | Ravi | 1 |
| HR | Kumar | 1 |
| HR | Divya | 1 |
| Finance | Meena | 1 |

Every group has one row, so `HAVING COUNT(*) > 2` removes them all: the result is **empty (0 rows)**.

---

### ❓ Can you use HAVING without GROUP BY?

**Level:** 🟡 Intermediate

### 📝 Answer

Yes. Without `GROUP BY`, the whole result set is treated as **one group**:

```sql
SELECT COUNT(*) AS total
FROM employees
HAVING COUNT(*) > 5;
```

This returns one row (`total = 6`) because the condition holds; with `> 10` it returns **no rows at all** — not a row with 0. For conditions on individual rows, use `WHERE` instead.

## Quick Revision

### ❓ What are the key SQL indexing and GROUP BY interview answers?

**Level:** 🟡 Intermediate

### 📝 Answer

| Question | Key answer |
|---|---|
| How does an index work? | A data structure, usually a B+ Tree, that locates rows without a full scan |
| Is an index a separate table? | No — a database-managed data structure |
| Where is an index stored? | In tablespace pages on disk, cached in the buffer pool |
| How does SQL know an index exists? | Its metadata is in the data dictionary |
| Who decides which index to use? | The query optimizer |
| Does every query use an index? | No |
| Why not index every column? | Storage cost and slower writes |
| What is a clustered index? | In InnoDB, the primary-key B+ Tree whose leaves hold complete rows |
| What is a secondary index? | Leaves hold the indexed columns + the primary key |
| WHERE vs HAVING? | WHERE filters rows; HAVING filters groups |
| Does HAVING need the aggregate in SELECT? | No |
| Can you select a non-grouped column? | Only if it's aggregated or functionally dependent on the grouped columns |
