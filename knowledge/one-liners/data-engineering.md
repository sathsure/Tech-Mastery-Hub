# Data Engineering — One-liners

> The most asked questions, each answered in one sentence.

1. **ETL vs ELT?** — ETL transforms data before loading; ELT loads raw data first and transforms it in the warehouse.
2. **OLTP vs OLAP?** — OLTP handles many small transactions for apps; OLAP runs big analytical queries.
3. **Data lake vs warehouse?** — A lake stores raw files of any type; a warehouse stores structured, cleaned data for analytics.
4. **What is a lakehouse?** — Lake storage with warehouse features like transactions and schemas (Delta, Iceberg).
5. **What is a star schema?** — A fact table of events surrounded by dimension tables describing them.
6. **Fact vs dimension table?** — Facts hold measurable events; dimensions hold descriptive attributes.
7. **What is the grain?** — What a single row in a fact table represents.
8. **What is SCD Type 2?** — Keeping history by adding a new dimension row with validity dates when a value changes.
9. **Why Parquet?** — It's columnar and compressed, so analytic queries read less data.
10. **What is partitioning?** — Splitting data into folders by a column so queries can skip irrelevant data.
11. **What is a Spark shuffle?** — Moving data between machines for operations like `groupBy` and `join`.
12. **Transformation vs action in Spark?** — Transformations build a lazy plan; actions run it.
13. **What is a broadcast join?** — Sending a small table to every executor to avoid a shuffle.
14. **What is data skew?** — A few keys holding most of the data, making some tasks very slow.
15. **`repartition` vs `coalesce`?** — `repartition` reshuffles to any count; `coalesce` only reduces partitions without a full shuffle.
16. **What is Airflow?** — A tool to schedule and monitor pipelines as DAGs of tasks.
17. **What is dbt?** — A tool to build tested, documented SQL transformations inside the warehouse.
18. **What is CDC?** — Change Data Capture: streaming row changes from a database's log.
19. **What is a watermark in streaming?** — How long to wait for late events before closing a time window.
20. **What is an idempotent pipeline?** — One that gives the same result when rerun.
