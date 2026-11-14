# Data Engineering — Cheat Sheet

> **In one line:** build pipelines that move raw data from apps and files into clean tables people can trust for reports and ML.

## ETL vs ELT
- **ETL** — Extract → Transform → Load. Clean the data *before* it lands (older style).
- **ELT** — Extract → Load → Transform. Load raw data first, clean it *inside* the warehouse with SQL (modern style, e.g. dbt).

## Where data is stored
- **Database (OLTP)** — the app's live data; many small reads/writes (MySQL, Postgres).
- **Data warehouse (OLAP)** — for analytics; big read queries (Snowflake, BigQuery, Redshift).
- **Data lake** — raw files of any kind in cheap storage (S3).
- **Lakehouse** — lake files with warehouse features (Delta Lake, Iceberg, Databricks).
- **Medallion layers** — Bronze (raw) → Silver (cleaned) → Gold (ready for business).

## Data modeling
- **Star schema** — one **fact** table (events with numbers: sales) surrounded by **dimension** tables (who/what/when: customer, product, date).
- **Grain** — what one fact row means ("one row per order item").
- **Slowly changing dimension (SCD) Type 2** — when a customer's city changes, add a new row with dates instead of overwriting, so history is kept.

## File formats
- **CSV / JSON** — simple text; big and slow for analytics.
- **Parquet** — stores by column, compressed; fast for analytics (read only the columns you need).
- **Avro** — row-based binary; good for streaming and changing schemas.
- **Partitioning** — folders by a column (`date=2026-11-14/`) so queries skip the rest.

## Spark basics
- Splits big data across many machines: a **driver** plans, **executors** do the work on **partitions**.
- **Lazy** — transformations (`filter`, `join`) only build a plan; **actions** (`count`, `write`) run it.
- **Shuffle** — moving data between machines (`groupBy`, `join`). Expensive.
- **Broadcast join** — send a small table to every machine to avoid a shuffle.
- **Data skew** — one key has most of the data → one slow task.

```python
(spark.read.parquet("s3://raw/orders")
   .filter("status = 'PAID'")
   .groupBy("country").sum("amount")
   .write.mode("overwrite").parquet("s3://gold/revenue"))
```

## Orchestration & transformation
- **Airflow** — schedules pipelines as DAGs (tasks with dependencies), with retries and backfills.
- **dbt** — SQL models that build on each other, with tests and docs.

## Batch vs streaming
- **Batch** — run on a schedule (hourly, daily).
- **Streaming** — process events as they arrive (Kafka + Spark Streaming / Flink).
- **Windows** — group events by time (every 5 minutes). **Watermark** — how long to wait for late events.
- **CDC (Change Data Capture)** — stream every change from a database's log (Debezium).

## Data quality
- Check nulls, duplicates, ranges, row counts and freshness (dbt tests, Great Expectations).
- **Idempotent pipeline** — running it twice gives the same result (use `MERGE`/upsert or overwrite a partition).
- **Lineage** — where each table's data came from.
