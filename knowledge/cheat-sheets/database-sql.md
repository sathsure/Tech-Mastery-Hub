# SQL & Databases — Cheat Sheet

> **In one line:** a relational database keeps data in tables linked by keys; SQL is the language to read and change it.

## SQL command groups
- **DDL** — define tables: `CREATE`, `ALTER`, `DROP`, `TRUNCATE`.
- **DML** — change rows: `INSERT`, `UPDATE`, `DELETE`.
- **DQL** — read: `SELECT`.
- **TCL** — transactions: `COMMIT`, `ROLLBACK`.
- **DELETE** removes chosen rows (can undo); **TRUNCATE** empties the table fast; **DROP** removes the table.

## Order a query actually runs in
`FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT`
- **WHERE** filters rows; **HAVING** filters groups.

## Joins
- **INNER JOIN** — only rows that match in both tables.
- **LEFT JOIN** — all rows from the left + matches (else NULL).
- **RIGHT JOIN** — the opposite.
- **FULL JOIN** — everything from both.
- **SELF JOIN** — a table joined to itself (employee → manager).

```sql
-- customers who never ordered
SELECT c.name
FROM customers c LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;
```

## Keys
- **Primary key** — unique id for each row, never NULL.
- **Foreign key** — points to a primary key in another table.
- **Unique**, **NOT NULL**, **CHECK**, **DEFAULT** constraints.

## Grouping & window functions
- `COUNT`, `SUM`, `AVG`, `MIN`, `MAX` with `GROUP BY`.
- **Window functions** — calculate across rows *without* collapsing them: `ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`, `LAG()`, `LEAD()`, running `SUM() OVER (...)`.

```sql
-- 2nd highest salary in each department
SELECT * FROM (
  SELECT e.*, DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS rnk
  FROM employees e
) t WHERE rnk = 2;
```

## Subqueries & CTEs
- **Subquery** — a query inside a query.
- **CTE** — `WITH name AS (...)` — a named temporary result; easier to read.
- **UNION** removes duplicates; **UNION ALL** keeps them (faster).

## Indexes
- Like a book's index: find rows without reading the whole table (a **B+ tree**).
- Faster reads, slower writes, more disk.
- **Clustered index** — the table itself is stored in this order (one per table).
- **Composite index** `(a, b)` — works for `a` or `a + b`, not `b` alone.
- **Covering index** — holds every column the query needs.
- Check a query plan with `EXPLAIN`.

## Transactions & ACID
- **Atomic** — all or nothing. **Consistent** — rules stay true.
- **Isolated** — transactions don't see each other's half-done work. **Durable** — committed data survives a crash.
- **Isolation levels** (weak → strong): Read Uncommitted → Read Committed → Repeatable Read → Serializable.
- Problems they prevent: **dirty read** (seeing uncommitted data), **non-repeatable read** (a row changes between reads), **phantom read** (new rows appear).
- **Optimistic locking** — a version column; fail if someone changed it. **Pessimistic** — lock the row (`SELECT … FOR UPDATE`).

## Normalization
- **1NF** — one value per cell. **2NF** — every column depends on the whole key. **3NF** — no column depends on another non-key column.
- **Denormalize** — copy data on purpose for faster reads (reports).

## Scaling
Read replicas · connection pooling · caching · **partitioning** (split a table) · **sharding** (split data across servers).

## SQL vs NoSQL
- **SQL** — fixed schema, joins, ACID. MySQL, PostgreSQL.
- **NoSQL** — flexible, scales out easily. Document (MongoDB), key-value (Redis, DynamoDB), wide-column (Cassandra), graph (Neo4j).

## Classic interview queries
Nth highest salary · find duplicates (`GROUP BY … HAVING COUNT(*) > 1`) · delete duplicates · employees earning more than their manager · running totals · top N per group.
