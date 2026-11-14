# SQL & Databases — Quick Traps

> Tricky spots interviewers love: what goes wrong, a tiny example, and the right answer.

### 1. Comparing with NULL
- ❌ `WHERE manager_id = NULL` → no rows.
- ✅ `WHERE manager_id IS NULL`.

### 2. `NOT IN` with a NULL
- ❌ `WHERE id NOT IN (SELECT manager_id FROM emp)` → no rows if any `manager_id` is NULL.
- ✅ Use `NOT EXISTS`.

### 3. Alias in WHERE
- ❌ `SELECT salary * 12 AS yearly FROM emp WHERE yearly > 100000` → error.
- ✅ `WHERE` runs before `SELECT`. Repeat the expression or use a subquery/CTE.

### 4. WHERE vs HAVING
- ❌ `WHERE COUNT(*) > 1`
- ✅ Aggregates go in `HAVING`: `GROUP BY dept HAVING COUNT(*) > 1`.

### 5. `COUNT(*)` vs `COUNT(col)`
- ❌ Thinking they're the same.
- ✅ `COUNT(col)` skips NULLs.

### 6. LEFT JOIN turned into INNER JOIN
- ❌ `LEFT JOIN orders o ON ... WHERE o.status = 'PAID'` → customers without orders vanish.
- ✅ Put the filter in the `ON` clause: `ON o.customer_id = c.id AND o.status = 'PAID'`.

### 7. Functions kill indexes
- ❌ `WHERE YEAR(created_at) = 2026` → full table scan.
- ✅ `WHERE created_at >= '2026-01-01' AND created_at < '2027-01-01'`.

### 8. Leading wildcard
- ❌ `WHERE name LIKE '%kumar'` → can't use the index.
- ✅ `LIKE 'kumar%'` can. Use full-text search for "contains".

### 9. Composite index order
- ❌ Index on `(city, age)`, query `WHERE age = 30` → index not used.
- ✅ The leftmost column must be in the filter.

### 10. RANK vs DENSE_RANK
- ❌ Using `RANK()` for "2nd highest salary" with ties → rank 2 may not exist.
- ✅ `DENSE_RANK()` has no gaps (1, 1, 2).

### 11. More indexes = faster
- ❌ Indexing every column.
- ✅ Each index slows inserts/updates and uses space. Index what you filter, join and sort on.

### 12. UNION vs UNION ALL
- ❌ Using `UNION` by habit → extra sort to remove duplicates.
- ✅ Use `UNION ALL` when duplicates are fine or impossible.
