# Data Engineering — Quick Traps

> Tricky spots interviewers love: what goes wrong, a tiny example, and the right answer.

### 1. Pipelines that double data on rerun
- ❌ `INSERT INTO sales SELECT ...` — rerun after a failure → duplicates.
- ✅ Make loads idempotent: `MERGE`/upsert, or overwrite the day's partition.

### 2. `collect()` on big data
- ❌ `df.collect()` on 500 GB → the driver runs out of memory.
- ✅ Write results out, or `limit()` / `take()` for a sample.

### 3. Too many small files
- ❌ Streaming job writes thousands of tiny files per hour → slow queries.
- ✅ Compact files regularly (aim for ~128 MB–1 GB).

### 4. `repartition` vs `coalesce`
- ❌ `coalesce(200)` to *increase* partitions.
- ✅ `coalesce` only reduces (no shuffle); `repartition` can increase (with a shuffle).

### 5. Ignoring skew
- ❌ Joining on `country` where 90% of rows are "IN" → one task runs for hours.
- ✅ Salt the key, or broadcast the small side.

### 6. Partitioning by a high-cardinality column
- ❌ `partitionBy("user_id")` → millions of folders.
- ✅ Partition by low-cardinality columns like `date`.

### 7. Using processing time for event data
- ❌ Counting events by when they arrived, not when they happened.
- ✅ Use event time with watermarks for late data.

### 8. Overwriting history in dimensions
- ❌ Updating a customer's city in place → old sales now show the new city.
- ✅ SCD Type 2 keeps history rows.

### 9. CSV for analytics
- ❌ Querying huge CSVs daily.
- ✅ Convert to Parquet: columnar, compressed, typed.

### 10. Full reload every night
- ❌ Copying a 2 TB table every day.
- ✅ Incremental loads (by an `updated_at` watermark) or CDC.
