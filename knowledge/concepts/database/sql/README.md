# SQL

> **Canonical concept:** SQL and relational database fundamentals, querying, execution, performance, transactions, and database programming.
>
> This page consolidates knowledge already present in the Tech-Mastery-Hub SQL Masterclass, MySQL interview material, practice material, roadmap, and visual notes. Original learning assets remain unchanged.

## 1. What is SQL and RDBMS?

SQL communicates with a **Relational Database Management System (RDBMS)**. The relational model organizes data into logical tables consisting of rows and columns.

- **Table** — represents a logical collection of related data.
- **Row / Record** — represents one record.
- **Column / Attribute** — represents a property of the record.
- **Primary Key (PK)** — uniquely identifies a row and is non-null.
- **Foreign Key (FK)** — references a key in another table and helps enforce referential integrity.
- **Referential Integrity** — prevents relationships from referring to records that do not exist.

Example relationship: `Users (User_ID)` → `Orders (User_ID)`.

## 2. Database Design

### 2.1 Keys

| Key | Purpose |
|---|---|
| Primary Key | Uniquely identifies each row |
| Unique Key | Prevents duplicate values |
| Foreign Key | Links one table to another |
| Composite Primary Key | Uses multiple columns together as the primary key |

A foreign key can be NULL unless additional constraints prevent it. Composite keys are particularly relevant when a record is identified by a combination of columns.

### 2.2 Normalization

Normalization organizes database tables to reduce duplication and avoid data anomalies. The source material describes it as a **design check**, not a database command or automatic database rule.

It addresses:
- **Insert anomaly** — required data cannot be inserted correctly because related data is missing.
- **Update anomaly** — duplicated data is updated in one place but not another.
- **Delete anomaly** — deleting a record unintentionally removes information that is still needed.

#### 1NF — Atomic values

A column should not contain multiple values or repeating groups. For example, multiple phone numbers stored as `9876,1234` should be separated into related rows.

#### 2NF — Full-key dependency

A table must already satisfy 1NF and non-key attributes must depend on the **whole** composite key rather than only part of it.

#### 3NF — No transitive dependency

A table must already satisfy 2NF and non-key attributes should not depend on other non-key attributes.

## 3. Inside the Database Engine

A SQL query passes through an execution pipeline rather than going directly to storage. The Masterclass describes three major stages:

1. **Parser** — validates syntax and semantics and checks whether referenced tables and columns exist.
2. **Optimizer** — evaluates possible execution paths and chooses an execution plan based on cost and database statistics.
3. **Executor** — follows the selected plan, requests physical data from the storage engine, and produces the result.

```text
SQL Query Text
      ↓
Parser
      ↓
Optimizer
      ↓
Executor
      ↓
Storage / Result
```

## 4. Logical Order of SQL Execution

Although SQL is normally written beginning with `SELECT`, the logical processing order described in the source is:

```text
FROM / JOIN
    ↓
WHERE
    ↓
GROUP BY
    ↓
HAVING
    ↓
SELECT
    ↓
ORDER BY / LIMIT
```

This explains why `WHERE` filters raw rows while `HAVING` filters aggregated groups. It also explains why a `SELECT` alias is not available to `WHERE` at that stage.

## 5. Selecting and Filtering Data

### WHERE

`WHERE` filters individual rows before grouping. It is therefore the appropriate place for row-level filtering.

### HAVING

`HAVING` filters groups after aggregation. It is particularly used with aggregate conditions such as `COUNT(*) > 5`.

### DISTINCT

`DISTINCT` removes duplicate combinations of the selected values. The interview material specifically notes that it applies to the **combined selected values**, not independently to each column.

### BETWEEN

`BETWEEN` is inclusive of both boundaries in the source examples.

### LIKE and indexes

A pattern beginning with `%`, such as `LIKE '%John'`, prevents the described B-tree lookup from using the index in the same way as a prefix search such as `LIKE 'John%'`.

## 6. Joins

Joins combine data from tables according to a matching condition. The Masterclass describes the conceptual process as combining sets and filtering the resulting combinations through the `ON` condition.

### INNER JOIN

Returns rows where matching data exists in both tables.

### LEFT JOIN

Retains every row from the left table. It is useful for finding missing related records by checking for NULLs on the right side.

### FULL OUTER JOIN

Returns rows from both sides, using NULLs where no matching row exists.

### SELF JOIN

A table can be joined to itself by assigning aliases so the same table is treated as two logical inputs. A common example is an employee-to-manager relationship.

### Join Algorithms

The Masterclass identifies three physical join strategies:

- **Nested Loop** — iterates through rows of one input and searches the other; particularly useful when one side is small and the other is appropriately indexed.
- **Hash Match** — builds hash buckets from one input and probes them with another; it can require significant memory.
- **Merge Join** — works with sorted inputs and combines them efficiently using the join key.

## 7. Aggregation and Grouping

`GROUP BY` forms groups of rows and aggregate functions such as `SUM` and `AVG` calculate values for each group.

### COUNT(*) vs COUNT(column)

- `COUNT(*)` counts rows, including rows where a particular column is NULL.
- `COUNT(column)` counts non-NULL values in that column.

The Masterclass also introduces `ROLLUP` and `CUBE` for generating subtotals and grand totals.

## 8. Window Functions

Window functions calculate values across related rows **without collapsing those rows into one summary row**.

### OVER()

Defines the window in which the calculation operates.

### PARTITION BY

Divides rows into groups for the window calculation. The calculation can restart for each partition.

### ORDER BY inside OVER()

Controls ordering within the window and is essential for functions such as `LAG`.

### Ranking functions

| Function | Tie behaviour |
|---|---|
| `ROW_NUMBER()` | Gives each row a unique number |
| `RANK()` | Ties share a rank and subsequent ranks are skipped |
| `DENSE_RANK()` | Ties share a rank without skipping subsequent ranks |

Example for values `100, 100, 50`:

```text
ROW_NUMBER  → 1, 2, 3
RANK        → 1, 1, 3
DENSE_RANK  → 1, 1, 2
```

## 9. Subqueries

A subquery is a query nested inside another query.

- **Scalar subquery** — returns one value.
- **List subquery** — returns one column containing multiple rows and can be used with `IN`.
- **EXISTS** — performs a boolean existence check and can stop when a qualifying match is found.
- **Correlated subquery** — references the outer query and, according to the Masterclass, may cause the inner operation to execute repeatedly for outer rows.

The source material recommends considering a JOIN or window function when a correlated subquery creates a performance problem on large data sets.

## 10. CTEs, Views and Set Operations

### CTE

A Common Table Expression uses the `WITH` clause to define a temporary query expression for the duration of query execution. Recursive CTEs can be used for hierarchical structures such as organizational charts.

### View

A view is a saved query definition that behaves like a table when queried. The interview material describes it as a virtual table rather than independently stored data.

### UNION vs UNION ALL

- `UNION` combines result sets and removes duplicates.
- `UNION ALL` combines result sets while retaining duplicates.

The Masterclass highlights the additional work required by `UNION` to remove duplicates and therefore its potential performance cost.

## 11. Data Shaping and NULL Handling

### CASE WHEN

`CASE WHEN` provides conditional logic similar to IF/ELSE. Conditions are evaluated sequentially and the first condition resolving to TRUE is selected.

### COALESCE

`COALESCE` returns the first non-NULL value from its arguments and is useful for handling missing values. The interview material contrasts it with Oracle `NVL` and identifies `COALESCE` as the ANSI SQL standard form.

### NULL

NULL represents an unknown or missing value rather than zero or an empty string. The source material emphasizes using `IS NULL` rather than `= NULL`.

### CAST / CONVERT

`CAST` is described as ANSI-standard type conversion, while `CONVERT` is noted for database-specific formatting capabilities such as SQL Server formatting.

## 12. Date, String and Mathematical Functions

The Masterclass includes:

- `DATE_TRUNC()` — rounds a timestamp to a selected time unit for time-series analysis.
- `EXTRACT()` — extracts a component such as year or month.
- `DATEDIFF()` — calculates the difference between dates.
- `TRIM()` — removes leading and trailing whitespace.
- `LOWER()` / `UPPER()` — normalizes text case.
- `CEIL()` / `FLOOR()` — perform integer rounding operations.
- `REPLACE()` — replaces part of a string with another string.

## 13. Indexes and Query Performance

An index is a database object designed to improve data retrieval speed. The interview material compares it to the index of a book: instead of scanning every row, the database can use an indexed structure to locate relevant data more efficiently.

### Full Table Scan

Without a suitable index, the database may inspect rows sequentially. The Masterclass contrasts this `O(N)` behaviour with index-based tree navigation.

### B-Tree

The Masterclass describes B-Tree indexes as balanced tree structures that support logarithmic-style searching.

### Index trade-off

Indexes can significantly improve reads, but they also create maintenance work for `INSERT` and `UPDATE` operations because the index structure must be maintained.

### Common index candidates

The interview material identifies columns commonly used in:

- `WHERE`
- `JOIN`
- `ORDER BY`
- `GROUP BY`
- Primary and unique constraints

It also notes that low-cardinality columns, very small tables, and heavily modified columns may not always benefit from an additional index.

## 14. EXPLAIN and Database Diagnostics

`EXPLAIN` is used to inspect how MySQL intends to execute a query. The source identifies information such as index usage, join order, scan type, and estimated rows.

`EXPLAIN ANALYZE` is described as providing actual execution information rather than only estimates.

The interview material also covers MySQL diagnostics including the slow query log, error log, temporary use of the general query log, and index usage inspection.

## 15. Stored Procedures and Database Programming

A stored procedure is SQL logic stored in the database and executed by name. The source material associates procedures with reusable SQL logic, security through controlled execution privileges, and procedural constructs such as variables, loops, and conditional statements.

The interview material covers:

- `IN` parameters
- `OUT` parameters
- `INOUT` parameters
- Stored procedures vs functions
- Cursors
- Exception handlers

A stored function differs in that the source describes it as returning a value and being usable inside SQL expressions.

## 16. Java JDBC Integration

The SQL Masterclass includes an example of Java calling a stored procedure using `CallableStatement`. The flow is:

```text
Java application
      ↓
JDBC Connection
      ↓
CallableStatement
      ↓
Stored Procedure
      ↓
ResultSet
```

The source associates parameterized procedure calls with avoiding direct string construction for the procedure parameters and describes reduced network payload compared with sending large raw SQL strings.

## 17. ACID Transactions

The Masterclass describes ACID as the four properties supporting transactional data integrity:

- **Atomicity** — all-or-nothing behaviour.
- **Consistency** — transactions preserve defined data constraints and valid states.
- **Isolation** — concurrent transactions are separated according to the database isolation mechanisms.
- **Durability** — committed changes persist after the transaction completes.

A bank transfer is used as the conceptual example: if one part of a multi-step update fails, atomicity requires the transaction to roll back rather than leaving a partial result.

## 18. SQL Learning Path

The source-backed progression represented by this repository is:

```text
RDBMS fundamentals
      ↓
Keys + relationships + normalization
      ↓
SELECT + filtering
      ↓
Joins + aggregation
      ↓
Window functions + subqueries
      ↓
CTEs + views + set operations
      ↓
Indexes + execution plans
      ↓
Stored procedures + JDBC
      ↓
Transactions + performance diagnostics
```

## 19. Repository Resources

### Masterclass
- [SQL Masterclass](../../../masterclasses/SQL_MasterClass.html)

### Visual Notes
- [SQL Query 1](../../../visual-notes/sql/SQL_Query_1.jpeg)
- [SQL Query 2](../../../visual-notes/sql/SQL_Query_2.jpeg)
- [SQL Query 3](../../../visual-notes/sql/SQL_Query_3.jpeg)
- [SQL Query 4](../../../visual-notes/sql/SQL_Query_4.jpeg)
- [SQL Query 5](../../../visual-notes/sql/SQL_Query_5.jpeg)
- [SQL Query 6](../../../visual-notes/sql/SQL_Query_6.jpeg)
- [SQL Query 7](../../../visual-notes/sql/SQL_Query_7.jpeg)
- [SQL Query 8](../../../visual-notes/sql/SQL_Query_8.jpeg)
- [SQL Query 9](../../../visual-notes/sql/SQL_Query_9.jpeg)
- [SQL Query 10](../../../visual-notes/sql/SQL_Query_10.jpeg)
- [SQL Query 11](../../../visual-notes/sql/SQL_Query_11.jpeg)
- [SQL Joins](../../../visual-notes/backend/sql-joins.png)

### Interview
- [MySQL Interview Questions](../../../../interview/backend/java/08-MySQL.md)

### Practice
- [MySQL Coding Practice](../../../../practice/coding/sql/02-MySQL-coding.md)

### Roadmap
- [Database Roadmap](../../../../roadmap/database/README.md)

## 20. Source Boundary

This canonical page consolidates material currently present in the repository. It does not claim that every SQL feature, vendor-specific behaviour, or database-engine implementation is covered. Topics not supported by the collected source material are intentionally not presented as covered knowledge.

## Content Status

- **Canonical structure:** complete
- **Source-backed core explanation:** complete
- **Repository relationships:** linked
- **Original learning assets:** unchanged
- **Additional SQL topics:** can be added when supported by repository sources or explicitly researched

