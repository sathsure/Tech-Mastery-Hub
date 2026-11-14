# SQL & Databases — One-liners

> The most asked questions, each answered in one sentence.

1. **DELETE vs TRUNCATE vs DROP?** — DELETE removes chosen rows, TRUNCATE empties the table fast, DROP removes the table itself.
2. **WHERE vs HAVING?** — WHERE filters rows before grouping; HAVING filters groups after.
3. **INNER vs LEFT JOIN?** — INNER keeps only matches; LEFT keeps every left row, with NULLs when there's no match.
4. **Primary key vs foreign key?** — A primary key uniquely identifies a row; a foreign key points to a primary key in another table.
5. **Primary key vs unique key?** — Both are unique, but a primary key can't be NULL and there's only one per table.
6. **What is an index?** — A sorted structure (usually a B+ tree) that finds rows without scanning the whole table.
7. **Clustered vs non-clustered index?** — A clustered index stores the table rows in its order; a non-clustered index points to the rows.
8. **What is a composite index?** — An index on several columns, used from the leftmost column onward.
9. **What is a covering index?** — An index that holds every column a query needs.
10. **What is ACID?** — Atomicity, Consistency, Isolation and Durability — the guarantees of a transaction.
11. **What are the isolation levels?** — Read Uncommitted, Read Committed, Repeatable Read and Serializable.
12. **What is a dirty read?** — Reading another transaction's uncommitted changes.
13. **What is a phantom read?** — New rows appearing when the same query runs twice in one transaction.
14. **What is normalization?** — Organising tables to remove duplicate data (1NF, 2NF, 3NF).
15. **What is denormalization?** — Adding duplicate data on purpose to make reads faster.
16. **`RANK` vs `DENSE_RANK` vs `ROW_NUMBER`?** — RANK leaves gaps after ties, DENSE_RANK doesn't, ROW_NUMBER is always unique.
17. **What is a window function?** — A calculation across related rows that keeps every row, using `OVER()`.
18. **What is a CTE?** — A named temporary result defined with `WITH`, for readable queries.
19. **UNION vs UNION ALL?** — UNION removes duplicates; UNION ALL keeps them and is faster.
20. **What is a deadlock?** — Two transactions each wait for a lock the other holds.
21. **Optimistic vs pessimistic locking?** — Optimistic checks a version at update time; pessimistic locks the row up front.
22. **Sharding vs partitioning?** — Partitioning splits a table inside one database; sharding spreads data across servers.
23. **SQL vs NoSQL?** — SQL has fixed schemas, joins and ACID; NoSQL is flexible and scales out easily.
24. **What does `EXPLAIN` show?** — How the database plans to run a query, including index use.
25. **View vs materialized view?** — A view is a saved query; a materialized view stores its result.
