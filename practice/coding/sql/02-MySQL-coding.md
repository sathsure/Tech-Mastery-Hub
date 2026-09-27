### ❓ Questions

> Given a Customer table and an Order table, can you write a SQL query to retrieve country-wise order analytics?
> How would you calculate the total number of orders placed per country?
> Can you identify the highest and lowest order amount for each country?
> How would you compute the average order value country-wise?
> Can you determine the total number of unique customers per country?
> How would you count orders whose amount is greater than 1000 and less than 5000 for each country?
> Finally, how would you sort the results based on country name?

### 📝 Answer

```sql
SELECT
    c.country,                                       -- Country-wise grouping
    COUNT(o.order_id) AS total_orders,               -- Total number of orders
    MAX(o.order_amount) AS highest_order_amount,     -- Highest order amount
    MIN(o.order_amount) AS lowest_order_amount,      -- Lowest order amount
    AVG(o.order_amount) AS average_order_value,      -- Average order value
    COUNT(DISTINCT c.customer_id) AS total_customers,-- Total unique customers
    SUM(
        CASE
            WHEN o.order_amount > 1000
             AND o.order_amount < 5000
            THEN 1
            ELSE 0
        END
    ) AS orders_between_1000_and_5000                 -- Orders between 1000 and 5000
FROM customer c
JOIN orders o
    ON c.customer_id = o.customer_id                 -- Joining customer and order tables
GROUP BY c.country                                   -- Grouping by country
ORDER BY c.country;                                  -- Ordering result by country
```

---

### ❓ What is the output of the following query?

> ```sql
> SELECT * FROM employee WHERE salary = NULL;
> ```

### 📝 Answer

**Output:** ❌ No rows

✅ Correct:

```sql
WHERE salary IS NULL;
```

---

### ❓ **COUNT(\*), COUNT(col)**

> ```sql
> SELECT COUNT(*), COUNT(salary) FROM employee;
> ```

### 📝 Answer

- `COUNT(*)` → all rows
- `COUNT(salary)` → excludes NULLs

---

### ❓ **Second Highest Salary**

### 📝 Answer

```sql
SELECT MAX(salary)
FROM employee
WHERE salary < (SELECT MAX(salary) FROM employee);

-- OR

SELECT age
FROM users
ORDER BY age DESC
LIMIT 1 OFFSET 1
```

---

### ❓ **Duplicate Records**

### 📝 Answer

```sql
SELECT name, COUNT(*)
FROM employee
GROUP BY name
HAVING COUNT(*) > 1;
```

---

### ❓ **EXISTS vs IN**

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

```sql
-- Using IN
SELECT name
FROM employee
WHERE dept_id IN (
  SELECT id FROM department WHERE dept_name = 'IT'
);

-- OUTPUT:
-- Asha
-- Meena

--------------------------------------

-- Using EXISTS
SELECT e.name
FROM employee e
WHERE EXISTS (
  SELECT 1 FROM department d WHERE d.id = e.dept_id AND d.dept_name = 'IT'
);

-- OUTPUT:
-- Asha
-- Meena
```

| **IN**                | **EXISTS**             |
| --------------------- | ---------------------- |
| Checks values list    | Checks row existence   |
| Subquery runs first   | Stops when match found |
| Slower for large data | Faster for large data  |
