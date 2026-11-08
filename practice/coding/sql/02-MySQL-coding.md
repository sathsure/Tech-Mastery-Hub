# 🐬 MySQL Coding Practice

### ❓ Write a country-wise order analytics query (orders, highest/lowest/average amount, unique customers, orders between 1000 and 5000)

> Given a `customer` table and an `orders` table:
>
> - total number of orders per country
> - highest and lowest order amount per country
> - average order value per country
> - number of unique customers per country
> - number of orders with amount greater than 1000 and less than 5000
> - sorted by country name

### 📝 Answer

```sql
SELECT
    c.country,
    COUNT(o.order_id)              AS total_orders,
    MAX(o.order_amount)            AS highest_order_amount,
    MIN(o.order_amount)            AS lowest_order_amount,
    AVG(o.order_amount)            AS average_order_value,
    COUNT(DISTINCT c.customer_id)  AS total_customers,
    SUM(CASE WHEN o.order_amount > 1000 AND o.order_amount < 5000 THEN 1 ELSE 0 END)
                                   AS orders_between_1000_and_5000
FROM customer c
JOIN orders o ON o.customer_id = c.customer_id
GROUP BY c.country
ORDER BY c.country;
```

🧠 **How it works:** the join gives one row per order with its customer's country; `GROUP BY` makes one result row per country; each aggregate summarises that country's orders. The `SUM(CASE ...)` trick counts only the rows that match a condition.

> 💡 `JOIN` skips customers with no orders. To include them (with 0 orders), use `LEFT JOIN` — `COUNT(o.order_id)` then correctly gives 0.

---

### ❓ What is the output of `WHERE salary = NULL`?

> ```sql
> SELECT * FROM employee WHERE salary = NULL;
> ```

### 📝 Answer

**No rows** — even if some salaries are NULL.

🧠 **Why:** `NULL` means "unknown". `salary = NULL` is never true (it's unknown), so no row passes.

✅ Correct:

```sql
SELECT * FROM employee WHERE salary IS NULL;
```

---

### ❓ What is the difference between COUNT(*) and COUNT(column)?

> ```sql
> SELECT COUNT(*), COUNT(salary) FROM employee;
> ```

### 📝 Answer

- `COUNT(*)` → counts **all rows**.
- `COUNT(salary)` → counts rows where `salary` is **not NULL**.

Example: 5 employees, 2 without a salary → `COUNT(*) = 5`, `COUNT(salary) = 3`.

---

### ❓ How do you find the second highest salary?

### 📝 Answer

```sql
-- 1. Subquery: highest salary below the maximum
SELECT MAX(salary) AS second_highest
FROM employee
WHERE salary < (SELECT MAX(salary) FROM employee);

-- 2. LIMIT / OFFSET — DISTINCT is required
SELECT DISTINCT salary
FROM employee
ORDER BY salary DESC
LIMIT 1 OFFSET 1;
```

> ⚠️ **Trap:** without `DISTINCT`, if two people share the top salary, query 2 returns the **top salary again**.

For the Nth highest, `DENSE_RANK()` is the cleanest — see the SQL interview queries notes.

---

### ❓ How do you find duplicate records?

### 📝 Answer

```sql
SELECT name, COUNT(*) AS copies
FROM employee
GROUP BY name
HAVING COUNT(*) > 1;
```

🧠 **How:** group rows by the column(s) that define a duplicate, then keep groups with more than one row. `HAVING` filters groups (after `GROUP BY`); `WHERE` can't use `COUNT(*)`.

---

### ❓ EXISTS vs IN — what's the difference?

> employee
>
> | id  | name  | dept_id |
> | --- | ----- | ------- |
> | 1   | Asha  | 10      |
> | 2   | Ravi  | 20      |
> | 3   | Meena | 10      |
>
> department
>
> | id  | dept_name |
> | --- | --------- |
> | 10  | IT        |
> | 20  | HR        |

### 📝 Answer

Both find employees in the IT department:

```sql
-- IN: is dept_id in this list of values?
SELECT name
FROM employee
WHERE dept_id IN (SELECT id FROM department WHERE dept_name = 'IT');

-- EXISTS: does at least one matching row exist?
SELECT e.name
FROM employee e
WHERE EXISTS (
  SELECT 1 FROM department d WHERE d.id = e.dept_id AND d.dept_name = 'IT'
);

-- Both return: Asha, Meena
```

| `IN` | `EXISTS` |
|---|---|
| Compares a value with a **list** | Checks whether **any row** matches |
| Natural for small, fixed lists: `IN (1, 2, 3)` | Natural for "has related rows" checks |
| `NOT IN` breaks if the list contains **NULL** | `NOT EXISTS` is safe with NULLs |

**Performance:** modern MySQL (8.0+) and PostgreSQL usually turn both into the same plan (a semi-join), so speed is normally similar. The real difference is **`NOT IN` vs `NOT EXISTS`**:

```sql
-- If any department id were NULL, this returns NO rows at all
SELECT name FROM employee WHERE dept_id NOT IN (SELECT id FROM department);
```

✅ Prefer `NOT EXISTS` for "not in another table" checks.
