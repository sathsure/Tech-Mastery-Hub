# Data Engineering — Comparisons

> The classic "X vs Y" questions, side by side.

## ETL vs ELT
| | ETL | ELT |
|---|---|---|
| Transform | before loading | inside the warehouse |
| Tools | Informatica, Spark | dbt + Snowflake/BigQuery |
| Raw data kept | often ❌ | ✅ |

## OLTP vs OLAP
| | OLTP | OLAP |
|---|---|---|
| Workload | many small transactions | big analytical queries |
| Storage | row-based | column-based |
| Example | MySQL | Snowflake |

## Data lake vs warehouse vs lakehouse
| | Lake | Warehouse | Lakehouse |
|---|---|---|---|
| Data | raw, any format | cleaned, structured | both |
| Cost | low | higher | low |
| ACID tables | ❌ | ✅ | ✅ |

## Star vs snowflake schema
| | Star | Snowflake |
|---|---|---|
| Dimensions | flat | normalized |
| Joins | fewer | more |
| Query speed | faster | slower |

## Fact vs dimension table
| | Fact | Dimension |
|---|---|---|
| Holds | events, numbers | descriptions |
| Example | sales | customer, product, date |

## Parquet vs Avro vs CSV
| | Parquet | Avro | CSV |
|---|---|---|---|
| Layout | columnar | row | row (text) |
| Best for | analytics | streaming, schema evolution | simple exchange |

## Batch vs streaming
| | Batch | Streaming |
|---|---|---|
| Latency | minutes to hours | seconds |
| Tools | Spark, Airflow | Kafka, Flink, Spark Streaming |

## `repartition` vs `coalesce`
| | `repartition` | `coalesce` |
|---|---|---|
| Can increase | ✅ | ❌ |
| Full shuffle | ✅ | ❌ |

## Narrow vs wide transformation
| | Narrow | Wide |
|---|---|---|
| Data moves between machines | ❌ | ✅ (shuffle) |
| Examples | `filter`, `map` | `groupBy`, `join` |

## SCD Type 1 vs Type 2
| | Type 1 | Type 2 |
|---|---|---|
| On change | overwrite | add a new row with dates |
| History kept | ❌ | ✅ |
