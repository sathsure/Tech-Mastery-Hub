# SQL & Databases — Predict the Result

> Read the query, guess the result, then tap to check.

Tables used below:

```
employees                         departments
id | name  | dept_id | salary     id | name
1  | Asha  | 1       | 100        1  | Engineering
2  | Ravi  | 1       | 100        2  | Sales
3  | Meena | 2       | 90         3  | HR
4  | John  | NULL    | 80
```

### 1. Comparing with NULL
```sql
SELECT COUNT(*) FROM employees WHERE dept_id = NULL;
```
<details class="reveal"><summary>Show answer</summary>

**Result:** `0`

`= NULL` is never true. Use `WHERE dept_id IS NULL` (returns 1).

</details>

### 2. COUNT(*) vs COUNT(column)
```sql
SELECT COUNT(*), COUNT(dept_id), COUNT(DISTINCT dept_id) FROM employees;
```
<details class="reveal"><summary>Show answer</summary>

**Result:** `4 | 3 | 2`

`COUNT(column)` skips NULLs. `DISTINCT` counts 1 and 2 once each.

</details>

### 3. LEFT JOIN
```sql
SELECT d.name, COUNT(e.id)
FROM departments d LEFT JOIN employees e ON e.dept_id = d.id
GROUP BY d.name;
```
<details class="reveal"><summary>Show answer</summary>

**Result:** `Engineering 2 | Sales 1 | HR 0`

LEFT JOIN keeps HR with no employees; `COUNT(e.id)` counts 0 for the NULL row. (`COUNT(*)` would wrongly give 1.)

</details>

### 4. NOT IN with a NULL
```sql
SELECT name FROM departments
WHERE id NOT IN (SELECT dept_id FROM employees);
```
<details class="reveal"><summary>Show answer</summary>

**Result:** no rows (empty)

The subquery contains NULL, so `id NOT IN (1, 1, 2, NULL)` is never true. Use `NOT EXISTS` to get HR.

</details>

### 5. RANK vs DENSE_RANK
```sql
SELECT name,
       RANK()       OVER (ORDER BY salary DESC) AS r,
       DENSE_RANK() OVER (ORDER BY salary DESC) AS dr
FROM employees;
```
<details class="reveal"><summary>Show answer</summary>

**Result:** Asha 1 1 · Ravi 1 1 · Meena **3** **2** · John **4** **3**

RANK leaves a gap after ties; DENSE_RANK doesn't.

</details>

### 6. WHERE on a LEFT JOIN
```sql
SELECT d.name, e.name
FROM departments d LEFT JOIN employees e ON e.dept_id = d.id
WHERE e.salary > 95;
```
<details class="reveal"><summary>Show answer</summary>

**Result:** `Engineering Asha` · `Engineering Ravi`

The `WHERE` removes rows where `e.salary` is NULL, so the LEFT JOIN acts like an INNER JOIN. Put the filter in `ON` to keep every department.

</details>

### 7. UNION vs UNION ALL
```sql
SELECT dept_id FROM employees WHERE salary = 100
UNION
SELECT dept_id FROM employees WHERE salary = 100;
```
<details class="reveal"><summary>Show answer</summary>

**Result:** one row: `1`

UNION removes duplicates (across and within both parts). UNION ALL would return four rows.

</details>

### 8. Integer division
```sql
SELECT 5 / 2;
```
<details class="reveal"><summary>Show answer</summary>

**Result:** depends on the database — MySQL: `2.5000`, PostgreSQL / SQL Server: `2`

Integer division in Postgres/SQL Server drops the fraction. Use `5 / 2.0` or `CAST`.

</details>

### 9. AVG ignores NULL
```sql
SELECT AVG(dept_id) FROM employees;
```
<details class="reveal"><summary>Show answer</summary>

**Result:** `1.33` (4 ÷ 3), not 1.0

Aggregates skip NULLs, so it averages 1, 1 and 2.

</details>

### 10. HAVING
```sql
SELECT dept_id, COUNT(*) FROM employees
GROUP BY dept_id HAVING COUNT(*) > 1;
```
<details class="reveal"><summary>Show answer</summary>

**Result:** `1 | 2`

Only department 1 has more than one employee. The NULL group (John) has 1.

</details>
