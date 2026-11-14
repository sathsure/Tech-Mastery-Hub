# SQL & Databases — Code Snippets

> Queries interviewers ask you to write from memory.

### 1. Nth highest salary
```sql
-- 2nd highest (works with ties)
SELECT DISTINCT salary
FROM (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk FROM employees) t
WHERE rnk = 2;

-- Without window functions
SELECT MAX(salary) FROM employees WHERE salary < (SELECT MAX(salary) FROM employees);
```

### 2. Top N per group
```sql
-- top 3 earners in each department
SELECT * FROM (
  SELECT e.*, ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rn
  FROM employees e
) t WHERE rn <= 3;
```

### 3. Find duplicates
```sql
SELECT email, COUNT(*) AS times
FROM users
GROUP BY email
HAVING COUNT(*) > 1;
```

### 4. Delete duplicates, keep the lowest id
```sql
DELETE FROM users
WHERE id NOT IN (
  SELECT keep_id FROM (SELECT MIN(id) AS keep_id FROM users GROUP BY email) k
);
-- (extra derived table needed in MySQL)
```

### 5. Employees earning more than their manager
```sql
SELECT e.name
FROM employees e
JOIN employees m ON e.manager_id = m.id
WHERE e.salary > m.salary;
```

### 6. Rows with no match (anti-join)
```sql
SELECT c.*
FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);
```

### 7. Running total and month-over-month change
```sql
SELECT month,
       revenue,
       SUM(revenue) OVER (ORDER BY month)              AS running_total,
       revenue - LAG(revenue) OVER (ORDER BY month)    AS change_from_last_month
FROM monthly_sales;
```

### 8. Pivot with CASE
```sql
SELECT dept_id,
       SUM(CASE WHEN gender = 'F' THEN 1 ELSE 0 END) AS women,
       SUM(CASE WHEN gender = 'M' THEN 1 ELSE 0 END) AS men
FROM employees
GROUP BY dept_id;
```

### 9. Recursive CTE: org chart
```sql
WITH RECURSIVE chain AS (
  SELECT id, name, manager_id, 1 AS level FROM employees WHERE manager_id IS NULL
  UNION ALL
  SELECT e.id, e.name, e.manager_id, c.level + 1
  FROM employees e JOIN chain c ON e.manager_id = c.id
)
SELECT * FROM chain ORDER BY level;
```

### 10. Safe money transfer
```sql
START TRANSACTION;
SELECT balance FROM accounts WHERE id = 1 FOR UPDATE;      -- lock the row
UPDATE accounts SET balance = balance - 500 WHERE id = 1 AND balance >= 500;
UPDATE accounts SET balance = balance + 500 WHERE id = 2;
COMMIT;   -- or ROLLBACK if the first update changed 0 rows
```

### 11. Composite index for a common query
```sql
-- query: WHERE customer_id = ? AND status = ? ORDER BY created_at DESC
CREATE INDEX idx_orders_cust_status_date ON orders (customer_id, status, created_at);
EXPLAIN SELECT * FROM orders WHERE customer_id = 7 AND status = 'PAID' ORDER BY created_at DESC;
```
