### ❓ What is an RDBMS?

### 📝 Answer

An RDBMS stores data in **structured tables**, enforces **relationships using keys**, and guarantees **data integrity through constraints and transactions**.

- Data consistency
- Multi-user concurrency
- ACID compliance
- Complex querying

**Example**

```sql
CREATE TABLE employee (
  emp_id INT PRIMARY KEY,
  name VARCHAR(50),
  salary NUMBER
);
```

🤔❓ How is RDBMS different from DBMS?
DBMS doesn’t enforce relationships or ACID strictly.

🤔❓ Can RDBMS scale?
Vertically very well, horizontally with sharding/replication.

---

### ❓ Primary Key vs Unique Key vs Foreign Key?

### 📝 Answer

| Feature                         | **Primary Key**                         | **Unique Key**                           | **Foreign Key**                |
| ------------------------------- | --------------------------------------- | ---------------------------------------- | ------------------------------ |
| **What it does**                | Uniquely identifies each row in a table | Ensures values are not duplicated        | Links a table to another table |
| **Uniqueness**                  | Always unique                           | Always unique                            | Duplicates allowed             |
| **NULL values**                 | ❌ Not allowed                          | ✔ Allowed (Oracle allows multiple NULLs) | ✔ Allowed                      |
| **How many key can be defined** | only ONE (emp_id)                       | MULTIPLE (email, phone)                  | Multiple allowed               |

```sql
CREATE TABLE department (
  dept_id INT PRIMARY KEY,
  dept_name VARCHAR(50)
);

CREATE TABLE employee (
  emp_id INT PRIMARY KEY,
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(20) UNIQUE,
  dept_id INT,
  CONSTRAINT fk_employee_department
    FOREIGN KEY (dept_id) REFERENCES department(dept_id)

-- dept_id INT - creates a column named dept_id in the employee table
-- CONSTRAINT - Constraint means setting a rule on the data
-- CONSTRAINT fk_employee_department - Naming a constraint is a best practice
-- FOREIGN KEY (dept_id) - dept_id is a foreign key (Means this column depends on another table)
-- REFERENCES department(dept_id) - value in employee.dept_id must exist in department.dept_id
);
```

🤔❓ Can a foreign key be NULL?
Yes, unless **constrained**.

🤔❓ What Is a Composite Primary Key?
A composite primary key is a **primary key made up of more than one column**.

```sql
-- Composite Primary Key
CREATE TABLE Employee_Project (
    emp_id INT,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    project_id INT,
    PRIMARY KEY (emp_id, project_id)
);

-- Composite Primary Key with Foreign Keys
CREATE TABLE Employee (
    emp_id INT PRIMARY KEY,
    emp_name VARCHAR(50)
);

CREATE TABLE Project (
    project_id INT PRIMARY KEY,
    project_name VARCHAR(50)
);

CREATE TABLE Employee_Project (
    emp_id INT,
    project_id INT,
    PRIMARY KEY (emp_id, project_id),
    FOREIGN KEY (emp_id) REFERENCES Employee(emp_id),
    FOREIGN KEY (project_id) REFERENCES Project(project_id)
);
```

---

### ❓ What is Normalization?

### 📝 Answer

Normalization is the process of **organizing database** tables to **reduce data duplication** and avoid data inconsistency.

Normalization avoids:

- **Insert anomaly** – A new record cannot be inserted properly because some required data is missing.
- **Update anomaly** – The same data exists in multiple places and is updated in one place but not everywhere.
- **Delete anomaly** – Unintended loss of important data occurs when a record is deleted.

Normalization is a **DESIGN CHECK**, **not a DB rule.**

- No SQL constraint
- No MySQL / Oracle setting
- No “NORMALIZE TABLE” command

> 👉 It happens at design time, when you analyze data relationships.

1️⃣ **1NF - Can this column contain multiple values?**

❌ Problem (Not in 1NF)

```text
Employee
--------------------------------
emp_id | emp_name | phone_numbers
--------------------------------
1      | Ravi     | 9876,1234
```

**Why wrong?**

- `phone_numbers` has **multiple values**
- Violates **atomic value rule**

✅ Fix (Convert to 1NF)

Split multi-valued column into a new table.

```text
Employee
----------------------
emp_id | emp_name
----------------------
1      | Ravi
```

```text
Employee_Phone
------------------------
emp_id | phone_number
------------------------
1      | 9876
1      | 1234
```

✔ Now each column has **single values**
✔ No repeating groups

> “1NF removes repeating groups and multi-valued attributes.”

2️⃣ **2NF - Does this column depend on the FULL primary key?**

📌 Rule

1. **Must already be in 1NF**
2. **No partial dependency**
   - Non-key column **must depend on full primary key**, not part of it

📍 Where this rule applies - **Table with Composite Primary Key**

❌ Problem (Not in 2NF)

```text
Employee_Project
-----------------------------------
(emp_id, project_id) | emp_name
-----------------------------------
1, 101               | Ravi
```

**Primary Key:** `(emp_id, project_id)`

**Why wrong?**

- `emp_name` depends only on `emp_id`
- NOT dependent on `project_id`
- This is a **partial dependency**

✅ Fix (Convert to 2NF)

Split table based on dependency.

```text
Employee
--------------------
emp_id | emp_name
--------------------
1      | Ravi
```

```text
Employee_Project
------------------------
emp_id | project_id
------------------------
1      | 101
```

✔ Every non-key column depends on **whole key**

> “2NF removes partial dependency from composite keys.”

3️⃣ **3NF - Is a non-key column depending on another non-key column?**

📌 Rule (What to add)

1. **Must already be in 2NF**
2. **No transitive dependency**
   - Non-key column should NOT depend on another non-key column

📍 Where this rule applies - **Column dependency level**

❌ Problem (Not in 3NF)

```text
Employee
--------------------------------
emp_id | emp_name | dept_name
--------------------------------
1      | Ravi     | IT
```

**Hidden dependency:**

```text
emp_id → dept_name
dept_name → dept_location
```

So:

```text
emp_id → dept_location  (Indirect / Transitive)
```

✅ Fix (Convert to 3NF)

Split dependent attributes into separate tables.

```text
Employee
-----------------------
emp_id | emp_name | dept_id
-----------------------
1      | Ravi     | 10
```

```text
Department
-----------------------------------
dept_id | dept_name | dept_location
-----------------------------------
10      | IT        | Adelaide
```

✔ Non-key columns depend **only on primary key**
✔ No indirect dependency

> “3NF removes transitive dependency.”

---

### ❓ What is Index?

### 📝 Answer

An Index is a database object that improves the **speed of data retrieval** operations on a table.

- It works like a book index → instead of scanning every page, you jump directly to the required page.
- Internally, most RDBMS use B-Tree (or sometimes Hash) structures.
- Indexes are created on one or more columns of a table.

```sql
CREATE INDEX idx_emp_email ON employee(email);
```

> ➡️ This allows faster searches on the email column.

**When Index is NOT Used, What Happens?**

1. Full Table Scan occurs

- The database checks every row in the table.
- Performance degrades heavily for large tables.

2. Effects:

- Slower SELECT queries
- Higher CPU and I/O usage

```sql
SELECT * FROM employee WHERE email = 'abc@xyz.com';
```

> ➡️ DB scans all rows to find the match

**Rules / Best Practices for Indexes**

✅ When to Create an Index
✔ Columns used in:

- WHERE
- JOIN
- ORDER BY
- GROUP BY
- PRIMARY KEY / UNIQUE

❌ When NOT to Create an Index

- Columns with very few unique values (like gender or status)
- Frequent INSERT / UPDATE / DELETE
- Small tables (table scan is faster)

🤔❓ How Many Indexes Can Be Used in a Query?

- Usually only ONE index per table is used in a query execution plan.
- However, Composite (multi-column) indexes count as one index
- A query involving **multiple tables can use one index per table**.
  ```sql
  SELECT *
  FROM orders o
  JOIN customers c ON o.customer_id = c.id
  WHERE c.email = 'x@y.com';
  ```
  ➡️ Index on customers.email
  ➡️ Index on orders.customer_id

---

### ❓ Which performs better, `JOIN` or `SUBQUERY`?

### 📝 Answer

👉 JOIN usually performs better than a SUBQUERY

- Data is processed in a single execution plan
- Better use of indexes
- More readable and maintainable

```sql
-- Subquery
SELECT name
FROM employee
WHERE dept_id IN (
  SELECT dept_id FROM department WHERE location = 'NY'
);

-- JOIN
SELECT e.name
FROM employee e
JOIN department d
ON e.dept_id = d.dept_id
WHERE d.location = 'NY';
```

---

### ❓ What is a View?

### 📝 Answer

A View is a **virtual table** created from a SQL query.

- It does not store data itself
- It shows data from one or more tables
- It behaves like a table when you query it

```sql
--- CREATE A VIEW
CREATE VIEW active_employees AS
SELECT id, name, department
FROM employee
WHERE status = 'ACTIVE';

-- GET VIEW
SELECT * FROM active_employees;
```

---

### ❓ What is a Stored Procedure?

### 📝 Answer

A stored procedure is a **pre-written SQL program stored in the database** that can be executed by name to perform a specific task.

👉 Think of it like a **function** in programming, but written in SQL and executed by the database.

🔹 Why we use Stored Procedures?

- Reuse SQL logic (write once, use many times)
- Faster execution (precompiled)
- Better security (direct table access can be restricted)
- Keeps business logic close to the data

```sql
-- IN (Input parameter)
CREATE PROCEDURE getEmployeeById(IN empId INT)
BEGIN
  SELECT * FROM employee WHERE id = empId;
END;

-- Call it like this:
CALL getEmployeeById(101);

-------------------------------------------

-- OUT (Output parameter)
CREATE PROCEDURE getEmployeeCount(OUT totalEmployees INT)
BEGIN
  SELECT COUNT(*) INTO totalEmployees FROM employee;
END;

-- Call it like this:
CALL getEmployeeCount(@count);
SELECT @count;

-------------------------------------------

-- INOUT (Input + Output)
CREATE PROCEDURE increaseSalary(INOUT salary INT)
BEGIN
  SET salary = salary + 5000;
END;

-- Call it like this:
SET @sal = 40000;
CALL increaseSalary(@sal);
SELECT @sal;
```

🤔❓ Stored Procedure vs Function?

- **Stored Procedure** - Used to perform actions (insert, update, delete, complex logic), May or may not return a value
- **Function** - Stored SQL block that **always returns a value**, Can be used inside SQL queries

```sql
-- FUNCTION
CREATE FUNCTION calculateBonus(salary DECIMAL(10,2))
RETURNS DECIMAL(10,2)
BEGIN
  RETURN salary * 0.10;
END;

-- Call it like this:
SELECT calculateBonus(salary) FROM employee;
```

🤔❓ Cursor in Stored Procedure

A cursor is used to fetch and process query results row by row inside a stored procedure.

```sql
DECLARE cur CURSOR FOR SELECT salary FROM employee;
OPEN cur;
FETCH cur INTO empSalary;
CLOSE cur;
-- Each FETCH does
-- empSalary = 30000
-- empSalary = 40000
-- empSalary = 50000
```

**Scenario:**
You want to increase salary by 10% for employees one by one, and maybe do some logic per employee

    ```sql
    CREATE PROCEDURE incSalaryCursor()

    BEGIN
        DECLARE done INT DEFAULT 0;
        DECLARE id INT;
        DECLARE sal INT;

        DECLARE cur CURSOR FOR SELECT id, salary FROM employee; -- Defines the data the cursor reads
        DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1; -- Defines what happens when no more rows are available

        OPEN cur;

        LOOP
            FETCH cur INTO id, sal;
            IF done = 1 THEN LEAVE; END IF;

            UPDATE employee
            SET salary = sal * 1.10,
                role = REPLACE(role, 'Junior', 'Senior')
            WHERE id = id;

        END LOOP;

        CLOSE cur;
    END;

    -- CONTINUE → continue execution
    -- HANDLER → declares an exception handler
    -- FOR NOT FOUND → condition when no rows are found (cursor end)
    -- SET done = 1 → action to perform
    ```

🤔❓ What is `REPLACE` in a Stored Procedure?

`REPLACE` is a string function used to replace part of a string with another string.

    ```sql
    SELECT REPLACE('Java Developer', 'Java', 'Angular');

    -- OUTPUT
    -- Angular Developer
    ```

🤔❓ What is `DISTINCT`?

```sql
SELECT DISTINCT dept_id, salary FROM emp;
```

**Explanation:** DISTINCT applies to the **combined values**, not individual columns.

🤔❓ `WHERE` vs `HAVING`

✅ WHERE

- Filters **rows before GROUP BY**
- Faster
- Cannot use aggregate functions

```sql
SELECT * FROM orders WHERE status = 'PAID';
```

✅ HAVING

- Filters **after GROUP BY**
- Used with aggregate functions

```sql
SELECT user_id, COUNT(*)
FROM orders
GROUP BY user_id
HAVING COUNT(*) > 5;
```

🔑 Key Difference

| WHERE           | HAVING             |
| --------------- | ------------------ |
| Before grouping | After grouping     |
| No aggregates   | Aggregates allowed |
| Faster          | Slower             |

📌 **Rule**:
👉 Use `WHERE` whenever possible, `HAVING` only when needed.

🤔❓ Order of SQL execution (VERY COMMON)

```text
FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY
```

🤔❓ `DELETE` vs `TRUNCATE`

```sql
DELETE FROM emp;      -- rollback possible
TRUNCATE TABLE emp;   -- auto commit
```

🤔❓ `BETWEEN` is inclusive

```sql
WHERE salary BETWEEN 5000 AND 10000;
```

Includes **5000 & 10000**.

🤔❓ `LIKE` performance issue with `Index`

```sql
WHERE name LIKE '%John';
```

❌ Index cannot help when the pattern starts with %

```sql
WHERE name LIKE 'John%';
```

✅ The database can jump directly to John in the index

🤔❓ `UNION` vs `UNION ALL`

- UNION → Combines results of two or more SELECT queries and **Removes duplicate rows**
- UNION ALL → Combines results of two or more SELECT queries and **Keeps all rows (including duplicates)**

🤔❓ `COALESCE` vs `NVL`

Both are used to **replace NULL values**

**NVL** - Oracle only

```sql
NVL(salary, 0)
```

**COALESCE** - ANSI SQL standard (works in Oracle, MySQL, PostgreSQL, SQL Server, etc.)

```sql
SELECT COALESCE(salary, 0) FROM emp;
```

🤔❓ Difference between `CHAR` and `VARCHAR`

Both store text

- CHAR → fixed length

  ```sql
  CHAR(10)

  -- OUTPUT
  -- 'ABC       ' (3 chars + 7 spaces)
  ```

- VARCHAR → variable length

  ```sql
  VARCHAR(10)

  -- OUTPUT
  -- 'ABC' (3 chars)
  ```

---

### ❓ I see there is a performance issue with the DB. How will you identify the issue? Is there any log you can check?

### 📝 Answer

🟢 STEP 1: CHECK MYSQL LOGS

1️⃣ Slow Query Log

**Purpose:**
Identifies queries that take longer than expected.

```sql
SHOW VARIABLES LIKE 'slow_query_log';
SHOW VARIABLES LIKE 'long_query_time';
```

Enable if disabled:

```sql
SET GLOBAL slow_query_log = ON;
SET GLOBAL long_query_time = 2;
```

2️⃣ Error Log

**Purpose:**
Detects crashes, deadlocks, disk issues.

```text
/var/log/mysql/error.log
```

Check for:

- InnoDB errors
- Disk full
- Out of memory
- Table corruption

3️⃣ General Query Log (TEMPORARILY)

**Purpose:**
See _what queries are hitting DB right now_

```sql
SET GLOBAL general_log = ON;
```

⚠️ Disable quickly — very heavy.

4️⃣ CHECK INDEX USAGE

**Verify indexes**

```sql
SHOW INDEX FROM orders;
```

**Find unused indexes**

```sql
performance_schema.table_io_waits_summary_by_index_usage;
```

📌 Missing index is the **#1 cause** of performance issues.

---

### ❓ EXPLAIN / ANALYZE Query

### 📝 Answer

`EXPLAIN` - shows **how MySQL executes a query**:

- Which index is used
- Join order
- Table scan or index scan
- Estimated rows

✅ Why is it needed?

- To **find performance problems**
- To know **why a query is slow**
- To decide **which index to add or fix**

```sql
EXPLAIN
SELECT * FROM orders WHERE user_id = 10;
```

**Sample Output (important columns)**

| Column | Meaning                                   |
| ------ | ----------------------------------------- |
| type   | Access type (ALL = bad, ref/range = good) |
| key    | Index used                                |
| rows   | Rows MySQL expects to scan                |
| Extra  | Using where, Using index, etc.            |

`EXPLAIN ANALYZE` - Shows **actual execution time**, not estimates.

```sql
EXPLAIN ANALYZE
SELECT * FROM orders WHERE user_id = 10;
```

📌 **Difference**

- `EXPLAIN` → Estimated plan
- `EXPLAIN ANALYZE` → Real execution time (best for optimization)

✅ How it helps optimization?

- Finds **full table scans**
- Identifies **missing indexes**
- Reveals **bad join order**

Example optimization:

```sql
CREATE INDEX idx_orders_user_id ON orders(user_id);
```

---

### ❓ JOIN Types (INNER, LEFT, RIGHT)

### 📝 Answer

Assume:

- `users(id, name)`
- `orders(id, user_id)`

🔹 **INNER JOIN**

Returns **matching rows only**

```sql
SELECT u.name, o.id
FROM users u
INNER JOIN orders o ON u.id = o.user_id;
```

📌 If user has **no orders → excluded**

🔹 **LEFT JOIN**

Returns **all left table rows**

```sql
SELECT u.name, o.id
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;
```

📌 Users without orders → `NULL` in order columns

🔹 **RIGHT JOIN**

Returns **all right table rows**

```sql
SELECT u.name, o.id
FROM users u
RIGHT JOIN orders o ON u.id = o.user_id;
```

📌 Rarely used (LEFT JOIN is preferred)

🔑 **JOIN Summary**

| Join  | Result              |
| ----- | ------------------- |
| INNER | Only matches        |
| LEFT  | All left + matches  |
| RIGHT | All right + matches |

---

### ❓ Database Sharing

### 📝 Answer

Multiple applications or services **using the same database**

❌ Problems

- Performance bottlenecks
- Locking issues
- Tight coupling
- Risky deployments

✅ Best Practice

- **One database per service**
- Shared DB only for:
  - Reporting
  - Legacy systems

📌 In microservices → **Never share databases**

---

### ❓ Database Replication

### 📝 Answer

Copying data from **Primary (Master)** to **Replica (Slave)**

```
Primary → Replica1 → Replica2
```

✅ Why needed?

- Read scalability
- High availability
- Backup & reporting

✅ Types

| Type          | Use                        |
| ------------- | -------------------------- |
| Master-Slave  | Read scaling               |
| Master-Master | HA (complex)               |
| Async         | Fast, eventual consistency |
| Semi-sync     | Safer, slower              |

**Example Use Case**

```text
Writes → Primary
Reads  → Replica
```

🤔❓ How they stay synced?
MySQL uses Asynchronous Replication by default. Here are the steps the system takes automatically:

**Binary Log (Primary):** The Original database records every change (Insert, Update, Delete) into a file called the `binlog`.

**Relay Log (Replica):** The Replica database connects to the Primary, reads the `binlog`, and copies it to its own file called the `relay log`.

**Applier Thread (Replica):** The Replica executes the queries in the `relay log` one by one to update its own data.

🤔❓ How to check Sync Status

```sql
SHOW SLAVE STATUS\G
```

| Variable                | Target Value | Meaning                                 |
| ----------------------- | ------------ | --------------------------------------- |
| `Slave_IO_Running`      | Yes          | Connected to Primary and receiving logs |
| `Slave_SQL_Running`     | Yes          | Applying the logs to the data           |
| `Seconds_Behind_Master` | 0            | The Replica is perfectly synced         |

```properties
# Primary (Write)
spring.datasource.primary.url=jdbc:mysql://192.168.1.10:3306/db
spring.datasource.primary.username=admin
spring.datasource.primary.password=pass

# Replica (Read)
spring.datasource.replica.url=jdbc:mysql://192.168.1.50:3306/db
spring.datasource.replica.username=admin
spring.datasource.replica.password=pass
```

```java
public class RoutingDataSource extends AbstractRoutingDataSource {
    @Override
    protected Object determineCurrentLookupKey() {
        return TransactionSynchronizationManager.isCurrentTransactionReadOnly()
               ? "READ" : "WRITE";
    }
}

@Configuration
public class DataSourceConfig {
    @Bean
    public DataSource dataSource() {
        Map<Object, Object> targetDataSources = new HashMap<>();
        targetDataSources.put("WRITE", primaryDataSource());
        targetDataSources.put("READ", replicaDataSource());

        RoutingDataSource routingDataSource = new RoutingDataSource();
        routingDataSource.setTargetDataSources(targetDataSources);
        routingDataSource.setDefaultTargetDataSource(primaryDataSource());
        return routingDataSource;
    }
}

@Service
public class OrderService {

    // Goes to REPLICA (192.168.1.50)
    @Transactional(readOnly = true)
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // Goes to PRIMARY (192.168.1.10)
    @Transactional
    public void createOrder(Order order) {
        orderRepository.save(order);
    }
}
```

---

### ❓ Production Bug / SQL Issue – Root Cause Analysis

### 📝 Answer

1.  Configuration

Run these in your MySQL client to enable logging to a table:

```sql
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL log_output = 'TABLE';
SET GLOBAL long_query_time = 2;

```

2.  The Retrieval Query

Use this to find the slowest queries and the tables involved:

```sql
SELECT
    start_time,
    user_host,
    query_time,
    rows_examined,
    sql_text
FROM mysql.slow_log
ORDER BY query_time DESC;

```

3.  Expected Sample Output

| start_time          | user_host              | query_time  | rows_examined | sql_text                                               |
| ------------------- | ---------------------- | ----------- | ------------- | ------------------------------------------------------ |
| 2026-02-04 10:30:01 | root[root] @ localhost | 00:00:05.12 | 500000        | `SELECT * FROM orders WHERE status = 'pending';`       |
| 2026-02-04 10:31:15 | app[app] @ 192.168.1.1 | 00:00:03.45 | 120000        | `SELECT name FROM users WHERE bio LIKE '%developer%';` |

4.  Diagnosing the Table

Take the `sql_text` from the results above and run:

```sql
EXPLAIN SELECT * FROM orders WHERE status = 'pending';

```

**Expected Sample Output:**

| id  | select_type | table      | type | key  | rows   | Extra       |
| --- | ----------- | ---------- | ---- | ---- | ------ | ----------- |
| 1   | SIMPLE      | **orders** | ALL  | NULL | 500000 | Using where |

_(Note: `type: ALL` and `key: NULL` confirms the table is slow because it is missing an index.)_

5. Verification Steps

Run the `EXPLAIN` command again to confirm the fix worked.

```sql
-- Check the new execution plan
EXPLAIN SELECT * FROM orders WHERE status = 'pending';

```

**Expected Result Comparison:**

| Feature  | Before Fix              | After Fix                            |
| -------- | ----------------------- | ------------------------------------ |
| **type** | `ALL` (Full Table Scan) | `ref` or `range` (Targeted Scan)     |
| **key**  | `NULL`                  | `idx_status` (The Index you created) |
| **rows** | `500,000`               | `120`                                |

6. If it is still slow (The Remaining 10%)

If indexes don't fix it, the issue is usually structural or hardware-related.

**SQL Fixes:**

- **Rewrite the Query:** Avoid `SELECT *`. Only fetch columns you need.

```sql
-- Better
SELECT id, order_date FROM orders WHERE status = 'pending';

```

- **Avoid Leading Wildcards:** Change `LIKE '%value%'` to `LIKE 'value%'`.

```sql
-- This cannot use a standard index
SELECT * FROM users WHERE email LIKE '%gmail.com';

```

**Database Fixes:**

- **Table Partitioning:** Splitting a 100-million-row table into smaller physical pieces.
- **Vertical Scaling:** Increasing Server RAM so the entire index fits in memory.

7. Summary of Results

| Action             | Impact | Result                                                   |
| ------------------ | ------ | -------------------------------------------------------- |
| **Create Index**   | High   | Reduces rows searched from millions to hundreds.         |
| **Optimize Table** | Medium | Reclaims space and reorganizes data for faster disk I/O. |
| **Rewrite Query**  | High   | Reduces CPU and memory load per request.                 |

---

### ❓ What happens internally when a transaction fails midway in a Spring Boot application?

### 📝 Answer

When a transaction fails midway in Spring Boot, the transaction is rolled back to maintain data consistency. Spring manages the transaction using `@Transactional`, but the actual rollback and consistency guarantees are enforced by the database.

This behavior is based on the **ACID** principles, which guarantee reliable database transactions.

ACID is a **set of properties that guarantee reliable database transactions**.

It is **mainly a Database concept**, but used through **JPA / Spring Boot / Java** when you perform transactions.

ACID stands for:

- **A – Atomicity**
- **C – Consistency**
- **I – Isolation**
- **D – Durability**

These properties ensure **safe and reliable transactions** in databases.

1️⃣ Atomicity (All or Nothing)

👉 A transaction must either complete fully or rollback fully.

Example:

```java
@Transactional
public void transferMoney() {
    debit(fromAccount);
    credit(toAccount);
}
```

If `credit()` fails → `debit()` must rollback.

✅ Either both happen
❌ Or none happen

2️⃣ Consistency (Valid State Only)

👉 After transaction, DB must follow all rules:

- Primary key
- Foreign key
- Unique constraint
- Check constraints

Example:
If balance cannot be negative,
DB will reject invalid update.

3️⃣ Isolation (No Interference Between Transactions)

👉 Multiple users accessing same data should not corrupt it.

Example:
Two users booking last ticket at same time.

Isolation Levels (DB concept):

- READ UNCOMMITTED
- READ COMMITTED
- REPEATABLE READ
- SERIALIZABLE

In Spring:

```java
@Transactional(isolation = Isolation.SERIALIZABLE)
```

4️⃣ Durability (Permanent After Commit)

👉 Once transaction is committed, it stays saved even if:

- Server crashes
- Power fails

🔥 Where is ACID Used?

| Layer       | Is ACID Here? | Explanation                       |
| ----------- | ------------- | --------------------------------- |
| Java        | ❌ No         | Java is just programming language |
| JPA         | ⚠️ Partial    | JPA manages transactions          |
| Spring Boot | ⚠️ Partial    | Uses `@Transactional`             |
| Database    | ✅ YES        | ACID is implemented at DB level   |

> ACID is **implemented by the Database**
> Spring / JPA just **use it via transactions**

---

### ❓ How do you handle if multiple users / threads access same DB data at the same time?

### 📝 Answer

When multiple users hit your Spring Boot app:

```
User 1 → Thread 1 → DB
User 2 → Thread 2 → DB
User 3 → Thread 3 → DB
```

Each request runs in its own thread,
but isolation control happens at **database level**.

🔥 **How DB Handles Multiple Transactions**

Database uses:

1. **Locks**
2. **MVCC (Multi Version Concurrency Control)**
3. **Isolation Levels**

Let’s see how.

1️⃣ Using Isolation Levels in Spring

In Spring Boot:

```java
@Transactional(isolation = Isolation.REPEATABLE_READ)
public void bookTicket() {
    ...
}
```

Common levels:

| Level                | Simple Explanation                                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **READ_UNCOMMITTED** | Can see uncommitted changes from other transactions (dirty reads possible). Rarely used.                                                   |
| **READ_COMMITTED**   | Each `SELECT` sees only committed data. If another transaction commits changes, the next read will see the updated value.                  |
| **REPEATABLE_READ**  | Within the same transaction, reading the same row twice gives the same result, even if another transaction updates and commits in between. |
| **SERIALIZABLE**     | Transactions behave as if executed one by one (like a queue). Prevents almost all concurrency issues but reduces performance.              |

Most DBs (like MySQL default) use:
👉 **REPEATABLE_READ**

🏦 Scenario

Initial value in DB:

```
balance = 1000
```

Two transactions:

T1 → Reads balance twice
T2 → Updates balance to 2000 (but timing differs)

| Isolation Level  | What T1 Sees                              |
| ---------------- | ----------------------------------------- |
| READ_UNCOMMITTED | 2000 (even though T2 not committed)       |
| READ_COMMITTED   | 1000 → 2000 (Only committed data visible) |
| REPEATABLE_READ  | 1000 → 1000 (Snapshot view)               |
| SERIALIZABLE     | 1000 (T2 waits)                           |

2️⃣ Locking Mechanism

When two users try to update same row:

Example:
Two users booking last seat.

DB does:

- First transaction → acquires row lock
- Second transaction → waits

After first commit:

- Second continues
- Or fails (depending on logic)

🔹 **Pessimistic Locking (DB Level Lock)**

Used when you want strict control.

```java
@Lock(LockModeType.PESSIMISTIC_WRITE)
@Query("SELECT s FROM Seat s WHERE s.id = :id")
Seat findSeatForUpdate(Long id);
```

This prevents others from reading/updating that row.

🔹 **Optimistic Locking (Version Based)**

Very common in enterprise apps.

```java
@Version
private Long version;
```

Flow:

1. User A reads version = 1
2. User B reads version = 1
3. User A updates → version becomes 2
4. User B tries to update → fails (version mismatch)

This throws:

```
OptimisticLockException
```

Then you retry or show error.

3️⃣ Multiple Threads in Java

Important:

Each HTTP request → separate thread
Spring does NOT share transaction between threads.

Example:

```java
@Transactional
public void updateBalance() {
   ...
}
```

Each thread gets:

- Separate DB connection
- Separate transaction

Thread safety at Java level is different from DB isolation.

If you modify shared memory in Java, then you need:

- synchronized
- ReentrantLock
- Concurrent collections

But for DB operations:
👉 Isolation is DB responsibility.

🧠 Real Example: Bank Transfer

_Scenario:_
Two users try to withdraw ₹1000 from same account with ₹1000 balance.

_Without isolation:_
Balance becomes -1000 ❌

_With proper isolation:_

- First succeeds
- Second fails or waits
