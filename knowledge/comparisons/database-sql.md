# SQL & Databases — Comparisons

> The classic "X vs Y" questions, side by side.

## DELETE vs TRUNCATE vs DROP
| | DELETE | TRUNCATE | DROP |
|---|---|---|---|
| Removes | chosen rows | all rows | the table |
| `WHERE` | ✅ | ❌ | ❌ |
| Speed | slow (row by row) | fast | fast |
| Fires triggers | ✅ | ❌ | ❌ |

## WHERE vs HAVING
| | WHERE | HAVING |
|---|---|---|
| Filters | rows | groups |
| Runs | before `GROUP BY` | after `GROUP BY` |
| Aggregates allowed | ❌ | ✅ |

## INNER vs LEFT vs RIGHT vs FULL JOIN
| | Keeps |
|---|---|
| INNER | only matching rows |
| LEFT | all left rows + matches |
| RIGHT | all right rows + matches |
| FULL | all rows from both |

## Primary key vs unique key vs foreign key
| | Unique | NULL allowed | Per table |
|---|---|---|---|
| Primary key | ✅ | ❌ | one |
| Unique key | ✅ | ✅ (usually) | many |
| Foreign key | ❌ | ✅ | many |

## Clustered vs non-clustered index
| | Clustered | Non-clustered |
|---|---|---|
| Stores | the rows themselves, sorted | pointers to rows |
| Per table | one | many |

## `RANK` vs `DENSE_RANK` vs `ROW_NUMBER`
| Salaries 100, 100, 90 | ROW_NUMBER | RANK | DENSE_RANK |
|---|---|---|---|
| 100 | 1 | 1 | 1 |
| 100 | 2 | 1 | 1 |
| 90 | 3 | **3** | **2** |

## UNION vs UNION ALL
| | UNION | UNION ALL |
|---|---|---|
| Duplicates | removed | kept |
| Speed | slower | faster |

## `IN` vs `EXISTS`
| | `IN` | `EXISTS` |
|---|---|---|
| Stops at first match | ❌ | ✅ |
| Safe with NULLs in `NOT` form | ❌ | ✅ |

## Isolation levels
| | Dirty read | Non-repeatable read | Phantom read |
|---|---|---|---|
| Read Uncommitted | ✅ | ✅ | ✅ |
| Read Committed | ❌ | ✅ | ✅ |
| Repeatable Read | ❌ | ❌ | ✅ |
| Serializable | ❌ | ❌ | ❌ |

## Optimistic vs pessimistic locking
| | Optimistic | Pessimistic |
|---|---|---|
| How | version column check | lock the row |
| Best when | conflicts are rare | conflicts are common |

## SQL vs NoSQL
| | SQL | NoSQL |
|---|---|---|
| Schema | fixed | flexible |
| Joins | ✅ | limited |
| Scaling | mostly vertical | horizontal |
| Transactions | ACID | often eventual |

## View vs materialized view
| | View | Materialized view |
|---|---|---|
| Stores data | ❌ | ✅ |
| Always fresh | ✅ | ❌ (needs refresh) |

## Partitioning vs sharding
| | Partitioning | Sharding |
|---|---|---|
| Split across | one database | many servers |
