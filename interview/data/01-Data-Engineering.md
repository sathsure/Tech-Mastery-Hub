# 🛢 Data Engineering Interview Preparation

## Basics

### ❓ What does a data engineer do?

A data engineer builds and runs the **pipelines that move data** from where it is created (apps, databases, logs, third-party APIs) to where it is used (warehouses, dashboards, ML models) — cleaned, reliable and on time.

- Data analysts and scientists *use* data; data engineers make sure it *arrives* correctly.
- Daily work: writing SQL and Python/Scala jobs, scheduling pipelines, modelling tables, fixing broken loads, and controlling cost.

**Example:** every night, copy yesterday's orders from the app's PostgreSQL database into Snowflake, join them with marketing data, and refresh the sales dashboard by 7 a.m.

---

### ❓ What is the difference between ETL and ELT?

- **ETL** — **E**xtract from sources, **T**ransform on a separate engine, then **L**oad the clean result into the warehouse. Traditional, used when the warehouse was expensive or the data is sensitive.
- **ELT** — **E**xtract, **L**oad raw data into the warehouse first, then **T**ransform there with SQL. The modern cloud default, because warehouses (Snowflake, BigQuery, Redshift) are fast and scalable.

**Example ELT stack:** Fivetran or Airbyte loads raw tables → dbt transforms them with SQL models → Power BI reads the final tables.

---

### ❓ What is the difference between OLTP and OLAP?

| | OLTP | OLAP |
|---|---|---|
| Purpose | Run the business (orders, payments) | Analyse the business (reports, trends) |
| Queries | Many small reads and writes | Few large scans and aggregations |
| Design | Normalised tables | Denormalised star schemas |
| Storage | Row-based (PostgreSQL, MySQL) | Column-based (Snowflake, BigQuery, Redshift) |

Running heavy reports on the OLTP database slows the app — that's why data is copied to an OLAP warehouse.

---

### ❓ What is the difference between a data warehouse, a data lake and a lakehouse?

- **Data warehouse** — structured, cleaned tables for SQL analytics (Snowflake, BigQuery, Redshift).
- **Data lake** — cheap object storage (S3, ADLS, GCS) holding raw data in any format: JSON, CSV, Parquet, images, logs.
- **Lakehouse** — a lake plus warehouse features: tables with transactions, schemas and fast SQL on top of files (Databricks with Delta Lake, Apache Iceberg, Apache Hudi).

Many companies land everything in a lake first, then build curated warehouse or lakehouse tables from it.

---

## Data Modelling

### ❓ What is a star schema?

**Level:** 🟢 Beginner

A warehouse design with a central **fact table** of events or measurements, surrounded by **dimension tables** that describe them.

```text
            dim_date
               │
dim_customer ─ fact_sales ─ dim_product
               │
            dim_store
```

- **Fact table:** numbers and foreign keys — `fact_sales(date_id, product_id, customer_id, store_id, quantity, amount)`.
- **Dimension tables:** descriptive attributes — `dim_product(product_id, name, category, brand)`.
- Simple joins make reports fast and easy to write. A **snowflake schema** further normalises dimensions (e.g. a separate category table), saving space but adding joins.

---

### ❓ What are slowly changing dimensions (SCD)?

**Level:** 🟡 Intermediate

How you handle dimension values that change over time, like a customer's city.

- **Type 1** — overwrite the old value. Simple, but history is lost.
- **Type 2** — add a new row with `valid_from`, `valid_to` and `is_current`, so old facts still join to the old value. The most common for history.
- **Type 3** — keep a "previous value" column. Rarely used.

**Example (Type 2):** a customer moves from Pune to Chennai — past orders still count toward Pune's sales, new ones toward Chennai.

---

### ❓ Why use columnar file formats like Parquet?

**Level:** 🟡 Intermediate

Parquet (and ORC) store data **column by column** with compression and per-column statistics.

- Queries read only the columns they need → much less data scanned (lower cost in BigQuery or Athena).
- Similar values compress well → files often 5–10× smaller than CSV.
- Stored schema and types → no guessing compared with CSV.

Use CSV or JSON only for small exchanges; store analytics data as Parquet, partitioned by date.

---

### ❓ What is partitioning, and why does it matter?

**Level:** 🟡 Intermediate

Splitting a big table or dataset into parts by a column — usually a date — so queries scan only the parts they need.

**Example:** `events/dt=2026-11-09/…` — a query `WHERE dt = '2026-11-09'` reads one day instead of three years.

Pick a column used in most filters, with a sensible number of partitions; too many tiny partitions or files slow things down (the "small files problem").

---

## Pipelines & Tools

### ❓ What is Apache Spark, and when do you use it?

**Level:** 🟡 Intermediate

Spark is a distributed engine that processes large datasets in parallel across a cluster, in memory where possible. You write transformations in Python (PySpark), Scala, Java or SQL.

- Use it when data is too big or the processing too heavy for one machine or a single SQL query.
- **Lazy evaluation:** transformations build a plan; **actions** (`count`, `write`) run it.
- Watch out for **shuffles** (moving data between machines for joins and group-bys) and **data skew** (one key with far more rows than the others).

```python
orders = spark.read.parquet("s3://lake/orders/")
daily = orders.groupBy("order_date").agg(F.sum("amount").alias("revenue"))
daily.write.mode("overwrite").partitionBy("order_date").parquet("s3://lake/daily_revenue/")
```

---

### ❓ What is Apache Airflow?

**Level:** 🟢 Beginner

Airflow schedules and monitors pipelines written as Python **DAGs** (directed acyclic graphs) — tasks with dependencies, retries and alerts.

```python
with DAG("daily_sales", schedule="0 2 * * *", start_date=datetime(2026, 1, 1), catchup=False) as dag:
    extract = PythonOperator(task_id="extract", python_callable=extract_orders)
    transform = BashOperator(task_id="transform", bash_command="dbt run --select sales")
    extract >> transform
```

Alternatives: Dagster, Prefect, AWS Step Functions, Azure Data Factory.

---

### ❓ What is dbt?

**Level:** 🟢 Beginner

dbt (data build tool) lets you write warehouse transformations as **SQL `SELECT` models** under version control, with tests, documentation and dependency ordering — software engineering practices for SQL.

```sql
-- models/daily_revenue.sql
select order_date, sum(amount) as revenue
from {{ ref('stg_orders') }}
where status = 'PAID'
group by order_date
```

Tests such as `not_null` and `unique` run on every build, so bad data fails the pipeline instead of reaching dashboards.

---

### ❓ What is the difference between batch and stream processing?

**Level:** 🟡 Intermediate

- **Batch** — process data in chunks on a schedule (hourly, nightly). Simpler and cheaper; fine when minutes or hours of delay are OK (daily reports, payroll).
- **Streaming** — process each event within seconds of it happening (Kafka + Flink, Spark Structured Streaming, Kinesis). Needed for fraud detection, live dashboards and alerts.

Most companies use both: streaming for the few use cases that need freshness, batch for everything else.

---

### ❓ What is Change Data Capture (CDC)?

**Level:** 🟡 Intermediate

CDC copies every insert, update and delete from a database as it happens, by reading the database's transaction log — instead of re-copying whole tables.

**Example:** Debezium reads MySQL's binlog and publishes each change to Kafka; a consumer applies the changes to the warehouse within seconds, without slowing the app's database.

---

## Data Quality & Reliability

### ❓ How do you make a pipeline idempotent?

**Level:** 🟡 Intermediate

Running it twice for the same input must give the same result — no duplicates — so retries and backfills are safe.

- **Overwrite a partition** (e.g. replace `dt=2026-11-09`) instead of appending.
- Use **MERGE / upsert** on a unique key instead of plain inserts.
- Pass the run date as a parameter instead of using "now".

**Example:** a failed job is retried; because it overwrites that day's partition, the dashboard doesn't double-count revenue.

---

### ❓ How do you ensure data quality?

**Level:** 🟡 Intermediate

Test data the way you test code, at each stage:

- **Schema checks** — expected columns and types.
- **Rules** — not null, unique keys, accepted values, valid ranges (`amount >= 0`).
- **Freshness and volume** — did today's load arrive, and is the row count normal?
- **Reconciliation** — totals match the source system.

Tools: dbt tests, Great Expectations, Soda, and monitoring that alerts the owner when checks fail.
