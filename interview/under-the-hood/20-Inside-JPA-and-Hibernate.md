# 🗃 Inside JPA and Hibernate: Entities, SQL, Fetching and Locking

> **JPA** is the Java persistence **specification** (the rules). **Hibernate** is the most used **implementation**. **Spring Data JPA** adds repositories on top. Most "magic" you see in Spring apps is Hibernate working behind the EntityManager.

## Entity management and the persistence context (Java / JPA / Hibernate)

### ❓ What happens internally when an EntityManager is created?

**Generic answer:** An EntityManager is a lightweight object created from the heavy, shared EntityManagerFactory; it opens a new, empty persistence context and borrows a database connection only when it needs one.

**Under the hood:**

Imagine every request needing database access. Reading entity mappings, building SQL templates and starting a connection pool for every request would be far too slow.

**Step 1: Heavy work once — EntityManagerFactory** — at startup Hibernate reads all `@Entity` classes, builds metadata (tables, columns, relations), prepares SQL templates and links to the DataSource. One per database, thread-safe.

**Step 2: Light work per unit of work — EntityManager** — `emf.createEntityManager()` creates a Hibernate `Session` with an **empty persistence context**. Not thread-safe.

**Step 3: Connection on demand** — it borrows a JDBC connection from the pool when the first SQL must run (or when a transaction begins).

**Step 4: In Spring** — you inject a **shared EntityManager proxy**; each call is routed to the EntityManager bound to the current transaction/thread.

**Step 5: Close** — `close()` clears the context and returns the connection.

**Final understanding:** **Expensive mapping work once (factory) → cheap EntityManager per transaction → connection only when needed → Spring routes calls to the right one.**

---

### ❓ What is the persistence context, and why was it introduced?

**Generic answer:** The persistence context is the EntityManager's in-memory map of the entities it manages, keyed by type and ID; it guarantees one object per row, tracks changes, and delays writes until flush.

**Under the hood:**

Imagine loading employee 101 three times in one request and changing it twice. Without a manager, you'd get three different objects, three SELECTs, and you'd have to remember to write UPDATEs yourself.

**Step 1: A map per unit of work** — `Map<(Employee, 101), employeeObject>`.

**Step 2: One object per row** — loading 101 again returns the **same** Java object (no new SELECT).

**Step 3: Snapshot for change tracking** — the loaded state is remembered.

**Step 4: Write-behind** — changes are queued and sent at **flush**, in an efficient order.

**Step 5: Lifetime** — usually one transaction in Spring.

**Analogy:** a workbench — you take items from the warehouse (database), work on them, and at the end the bench tells the warehouse exactly what changed.

**Final understanding:** **Duplicate objects, repeated SELECTs, manual UPDATEs → one managed map per unit of work → identity, caching, change tracking, batched writes.**

---

### ❓ How does Hibernate manage entity objects in memory?

**Generic answer:** Hibernate keeps each managed entity in the persistence context together with its entity key, a loaded-state snapshot and its status; lazy relationships are represented by proxies or collection wrappers.

**Under the hood:**

Imagine loading an `Order` with 50 lines. Hibernate must know which objects it owns, what they looked like when loaded, and which related data it hasn't loaded yet.

**Step 1: Entity key** — entity type + ID identifies each object.

**Step 2: Entity entry** — status (managed, deleted…), the **loaded state** snapshot (array of column values), version.

**Step 3: Collections** — `List<OrderLine>` is replaced by Hibernate's `PersistentBag`/`PersistentSet`, which tracks additions and removals and can load lazily.

**Step 4: Lazy references** — an unloaded `customer` is a **proxy** (a generated subclass) holding only the ID.

**Step 5: Action queue** — pending inserts, updates and deletes wait here until flush.

**Final understanding:** **Know what you own (keys) → remember how it looked (snapshots) → wrap relations (proxies, persistent collections) → queue writes (action queue).**

---

### ❓ What are the transient, managed, detached and removed entity states?

**Generic answer:** Transient = new object Hibernate doesn't know; managed = tracked by a persistence context; detached = was managed but its context closed; removed = scheduled for deletion at flush.

**Under the hood:**

Imagine an `Employee` object's life: you create it, save it, the request ends, another request edits it, finally it's deleted. Hibernate treats it differently at each stage.

**Step 1: Transient** — `new Employee("Asha")`: no ID in the database, not tracked. Changes do nothing.

**Step 2: Managed** — after `persist()` or `find()`: in the persistence context; changes are **detected and saved** at flush.

**Step 3: Detached** — after the transaction/EntityManager closes (or `detach()`/`clear()`): has an ID, but changes are **not tracked**. Lazy relations can't load.

**Step 4: Back to managed** — `merge(detached)` copies its state onto a managed instance.

**Step 5: Removed** — `remove(managed)`: DELETE runs at flush.

```text
new → (persist) → MANAGED → (tx ends) → DETACHED → (merge) → MANAGED → (remove) → REMOVED → (flush) → gone
```

**Final understanding:** **Only managed entities are watched → know the state to know whether a change will be saved.**

---

### ❓ How does Hibernate identify whether an entity has changed?

**Generic answer:** At flush, Hibernate compares each managed entity's current field values with the snapshot taken when it was loaded (or uses bytecode-enhanced dirty flags), and only changed entities get an UPDATE.

**Under the hood:**

Imagine 200 managed entities, and you changed the salary of one. Hibernate must find that one without asking you.

**Step 1: Snapshot on load** — the loaded column values are copied into an array.

**Step 2: At flush, compare** — for each managed entity, compare current values with the snapshot, field by field (using each type's equality).

**Step 3: Dirty → UPDATE** — any difference schedules an update.

**Step 4: Faster option — bytecode enhancement** — setters mark fields dirty as you change them, so no full comparison is needed.

**Cost:** with thousands of managed entities, the comparison costs CPU — use read-only queries (`@Transactional(readOnly = true)`) or `clear()` in batch jobs.

**Final understanding:** **Snapshot at load → compare at flush (or track on set) → only changed entities are updated.**

---

### ❓ How does dirty checking work internally?

**Generic answer:** Dirty checking automatically detects changes to managed entities at flush time and generates the needed UPDATE statements — no explicit `update()` call.

**Under the hood:**

Imagine:

```java
Employee emp = entityManager.find(Employee.class, 101L);
emp.setSalary(50000);
```

You never call `update(emp)`. Yet the database is updated. How?

**Step 1: Retrieval** — `find()` loads the row and places the entity in the persistence context.

**Step 2: Original state** — Hibernate stores a **loaded-state snapshot** (or uses enhanced dirty tracking).

**Step 3: Modification** — salary changes from ₹40,000 to ₹50,000 in the Java object only.

**Step 4: Dirty check at flush** — Hibernate compares current state with the snapshot and finds `salary` changed.

**Step 5: SQL generation**

```sql
UPDATE employee SET salary = 50000 WHERE id = 101;
```

(By default all columns are in the UPDATE; `@DynamicUpdate` sends only changed ones.)

**Step 6: Synchronise** — the SQL is sent at flush — before a query that needs it, or at commit.

**Important:** **flush ≠ commit**. Flush sends SQL inside the transaction; commit makes it permanent.

**Final understanding:** **Managed entity + snapshot → you change the object → flush compares → UPDATE generated → commit makes it permanent.**

---

### ❓ What happens when `save()` is called in Spring Data JPA?

**Generic answer:** `save()` checks whether the entity is new; if so it calls `persist()`, otherwise `merge()`. The SQL usually runs later, at flush or commit.

**Under the hood:**

Imagine `employeeRepository.save(employee)`. One line — but several layers act.

**Step 1: Repository proxy** — your interface is implemented at runtime by `SimpleJpaRepository`.

**Step 2: New or existing?** — `isNew()` checks: `@Version` field null? Otherwise ID null (or primitive 0)? Or `Persistable.isNew()` if you implement it.

**Step 3: Persist or merge**

```java
if (isNew(entity)) em.persist(entity); return entity;
else return em.merge(entity);
```

**Step 4: Managed** — after `persist`, the same object is managed. After `merge`, the **returned** object is managed — maybe a different instance.

**Step 5: SQL timing** — INSERT/UPDATE is usually deferred to flush/commit (IDENTITY IDs force an immediate INSERT).

**Step 6: Transaction** — `save()` is `@Transactional` itself, so outside your own transaction it commits right away.

**Trap:** assigning your own IDs (UUID set in code) makes `isNew()` false → `merge()` → an extra SELECT before INSERT. Use `@Version` or `Persistable`.

**Final understanding:** **`save()` = decide new vs existing → `persist` or `merge` → managed → SQL at flush.** Always use the returned object.

---

### ❓ What is the difference between `persist()` and `merge()`?

**Generic answer:** `persist()` makes a new (transient) object managed — the same instance; `merge()` copies a detached object's state onto a managed instance (loading it if needed) and returns that managed copy.

**Under the hood:**

Imagine two situations: a brand-new employee from a form, and an employee DTO-turned-entity edited in a previous request (detached).

**Step 1: `persist(newEmp)`**
- Object must be new.
- **That same object** becomes managed.
- INSERT at flush. Detached object → exception.

**Step 2: `merge(detachedEmp)`**
- Look for a managed instance with that ID in the context; if absent, **SELECT** it from the database (or create new if not found).
- **Copy** the detached object's fields onto it.
- Return the managed instance; the argument stays detached.

```java
Employee managed = em.merge(detached);
detached.setName("X");   // ignored — not managed
managed.setName("Y");    // saved at flush
```

**Final understanding:** **New object → `persist` (same instance managed); detached object → `merge` (copy onto a managed instance, returned).**

---

### ❓ How does the first-level cache work?

**Generic answer:** The first-level cache is the persistence context itself: within one EntityManager, loading the same entity by ID returns the same object without another SELECT. It's always on and lives only as long as the EntityManager.

**Under the hood:**

Imagine a request where three different services each call `findById(101)`. Without caching that's three identical SELECTs.

**Step 1: First `find(101)`** — not in the context → SELECT → store in the map → return.

**Step 2: Second `find(101)`** — found in the map → return the same object, no SQL.

**Step 3: Scope** — one EntityManager (≈ one transaction). Another request has its own empty cache.

**Step 4: Limits** — JPQL queries still go to the database (but returned rows are matched to already-managed objects). `clear()` empties it.

**Batch tip:** in a loop of 100,000 inserts the cache grows forever — call `flush()` and `clear()` every N rows.

**Final understanding:** **Repeated loads in one unit of work → map by ID → same object, no SQL → gone when the EntityManager closes.**

---

### ❓ How does the second-level cache work?

**Generic answer:** The second-level cache is an optional, shared cache at the EntityManagerFactory level (Ehcache, Caffeine/JCache, Infinispan) that stores entity data by ID across transactions, so a `find()` in any request can skip the database.

**Under the hood:**

Imagine a `Country` table read on every request and changed once a year. The first-level cache dies with each request, so each request still hits the database.

**Step 1: Enable** — add a provider, `hibernate.cache.use_second_level_cache=true`, and mark entities `@Cache(usage = READ_WRITE)` (or `@Cacheable`).

**Step 2: Lookup order** — `find(Country, "IN")`: first-level cache → second-level cache → database.

**Step 3: Store disassembled state** — not the object, but its field values (so each request builds its own instance).

**Step 4: Keep it consistent** — Hibernate updates/invalidates entries when *it* writes; concurrency strategies (READ_ONLY, READ_WRITE…) define how.

**Step 5: Blind spots** — changes made outside Hibernate (another app, SQL scripts) aren't seen until expiry.

**Final understanding:** **Same reference data in every request → shared cache by ID across transactions → only for read-mostly data changed through Hibernate.**

---

### ❓ What is the query cache?

**Generic answer:** The query cache stores the list of IDs returned by a query for given parameters; on reuse, Hibernate gets the IDs from the cache and the entities from the second-level cache. It's invalidated whenever any table in the query changes.

**Under the hood:**

Imagine `SELECT c FROM Country c WHERE c.region = 'ASIA'` running 1,000 times a minute.

**Step 1: Enable** — `hibernate.cache.use_query_cache=true` and mark the query cacheable (`setHint("org.hibernate.cacheable", true)`).

**Step 2: First run** — execute SQL; store **query + parameters → [IDs]**.

**Step 3: Later runs** — fetch the ID list from the cache, then each entity from the second-level cache.

**Step 4: Invalidation** — any insert/update/delete on `country` marks the cached results stale (via table timestamps).

**Warning:** useless for frequently changing tables, and without the entity in the second-level cache it causes N+1 lookups.

**Final understanding:** **Same query, same parameters, rarely changing table → cache the result IDs → entities from L2 → invalidated on any table change.**

---

### ❓ How does Hibernate manage entity identity?

**Generic answer:** Within one persistence context, a database row maps to exactly one Java object, identified by entity type + primary key, so `==` works between instances loaded in the same context.

**Under the hood:**

Imagine loading employee 101 through `find()` and through a query in the same transaction, then changing one copy. If they were different objects, which change wins?

**Step 1: Key** — (entity class, ID).

**Step 2: Check before building** — whenever a row is read (find, query, relation), Hibernate looks up the key in the context.

**Step 3: Reuse** — if found, the existing object is used; the freshly read row data is ignored.

**Step 4: Result** — one object per row per context: `a == b` is true.

**Across contexts:** different EntityManagers give different objects — implement `equals()`/`hashCode()` on a business key or the ID carefully (stable before and after persist).

**Final understanding:** **One row = one object per context → lookup by (type, ID) before creating → no conflicting copies.**

---

### ❓ What is the identity map pattern?

**Generic answer:** Identity map is a design pattern (named by Martin Fowler) where a unit of work keeps a map of every object it has loaded by ID, so each record is loaded once and represented by one object. Hibernate's persistence context is an identity map.

**Under the hood:**

Imagine any ORM, in any language, loading the same customer through two relations — `order.customer` and `invoice.customer`. Without coordination you'd get two objects for one row and inconsistent edits.

**Step 1: Keep a map** — ID → object, for the duration of the unit of work.

**Step 2: Check the map on every load.**

**Step 3: Return the existing object** when present.

**Step 4: Benefits** — consistency (one object to edit), fewer queries (a cache), and correct relationships (both orders point to the same customer instance).

**Final understanding:** **Same record loaded many ways → one map per unit of work → one object per record.** Hibernate = identity map + unit of work + lazy load patterns.

---

### ❓ What happens when the same entity is fetched multiple times in one persistence context?

**Generic answer:** `find()` returns the cached instance without SQL; a JPQL query still runs SQL, but for rows already in the context Hibernate returns the existing objects and ignores the new row data — so you may not see changes made by others.

**Under the hood:**

Imagine in one transaction: `find(101)` → salary 40,000. Another transaction updates it to 60,000 and commits. You run a JPQL query that includes 101.

**Step 1: Second `find(101)`** — served from the context: still 40,000, no SQL.

**Step 2: JPQL query** — SQL runs and the row says 60,000…

**Step 3: …but identity wins** — Hibernate finds 101 already managed and returns **the existing object** (40,000). Your unsaved changes are protected.

**Step 4: Want fresh data?** — `em.refresh(emp)` re-reads the row, or `clear()`/`detach()` first.

**Final understanding:** **Repeat fetches return the same object → `find` skips SQL, queries don't skip SQL but keep the existing object → `refresh()` to see newer data.**

---

### ❓ How does the persistence context synchronize with the database?

**Generic answer:** Through flush: Hibernate dirty-checks managed entities, turns queued actions into SQL in a safe order (inserts, updates, collection changes, deletes), and sends it over the transaction's connection; commit then makes it permanent.

**Under the hood:**

Imagine in one transaction you insert a department, add two employees, change a salary and delete an old record. Hibernate must send these in an order that respects foreign keys.

**Step 1: Trigger** — commit, a query that touches affected tables (AUTO), or explicit `flush()`.

**Step 2: Dirty check** — find changed managed entities → schedule updates.

**Step 3: Cascade** — follow cascades (persist/remove children).

**Step 4: Order the actions** — inserts → updates → collection removals/inserts → deletes (and parents before children).

**Step 5: Execute** — JDBC statements, batched if configured.

**Step 6: Commit** — the database makes it durable; snapshots now match the database.

**Final understanding:** **Queued changes in memory → flush orders and sends SQL → commit makes it permanent.**

---

## SQL generation and query execution (Java / JPA / Hibernate)

### ❓ How does Hibernate generate SQL from entity operations?

**Generic answer:** From the mapping metadata built at startup, Hibernate prepares SQL templates per entity (insert, update, delete, select by ID) and fills in parameters; queries are parsed into a tree and translated using the database's Dialect.

**Under the hood:**

Imagine `persist(employee)` on PostgreSQL and on Oracle. Same Java code, different SQL quirks (sequences, paging, types).

**Step 1: Metadata at startup** — entity → table, field → column, relations → foreign keys/join tables.

**Step 2: Prepare templates** — e.g. `insert into employee (name, salary, dept_id, id) values (?, ?, ?, ?)`.

**Step 3: Dialect** — adapts to the database: ID generation, `LIMIT`/`FETCH FIRST`, types, functions.

**Step 4: Bind values** — at flush, field values become JDBC parameters (`PreparedStatement`), which also prevents SQL injection.

**Step 5: Execute** — via the transaction's connection.

**See it:** `spring.jpa.show-sql=true` or logger `org.hibernate.SQL=DEBUG` (+ `orm.jdbc.bind=TRACE` for values).

**Final understanding:** **Mappings → prepared SQL templates → dialect adapts → bind parameters → execute.**

---

### ❓ What happens internally when `find()` is called?

**Generic answer:** `find()` checks the persistence context, then the second-level cache (if enabled), then runs a SELECT by primary key, builds the entity, snapshots it and stores it in the context; it returns `null` if the row doesn't exist.

**Under the hood:**

Imagine `em.find(Employee.class, 101L)`.

**Step 1: Persistence context** — already managed? Return it.

**Step 2: Second-level cache** — enabled and present? Assemble an entity from cached state.

**Step 3: SQL** — `select … from employee where id = ?`, plus joins for EAGER relations.

**Step 4: Hydrate** — create the object, set fields, create proxies/collection wrappers for lazy relations.

**Step 5: Register** — store in the context with a snapshot for dirty checking.

**Step 6: Return** — the entity, or `null` if no row.

**Final understanding:** **Context → L2 cache → SELECT by ID → build + snapshot → managed entity (or null).**

---

### ❓ How does JPQL get converted into SQL?

**Generic answer:** Hibernate parses JPQL (HQL) into a syntax tree, resolves entity and field names to tables and columns through the mapping metadata, then renders SQL for the current dialect; the translation is cached.

**Under the hood:**

Imagine `SELECT e FROM Employee e WHERE e.department.name = :dept`. The database knows nothing about `Employee` or `department.name` — only tables and columns.

**Step 1: Parse** — ANTLR grammar → tree (select, from, where).

**Step 2: Resolve names** — `Employee` → table `employee`; `e.department` → join to `department` via `dept_id`.

**Step 3: Build an SQL tree** (Hibernate 6's semantic query model).

**Step 4: Render for the dialect**

```sql
select e1_0.id, e1_0.name, … from employee e1_0
join department d1_0 on d1_0.id = e1_0.dept_id where d1_0.name = ?
```

**Step 5: Cache** — the translation is cached by query string (query plan cache).

**Step 6: Execute and map** — results become managed entities.

**Final understanding:** **Object-oriented query → parse → map names to tables/columns → dialect SQL → cached plan → entities.**

---

### ❓ How does Hibernate execute native SQL queries?

**Generic answer:** Native queries are sent to the database as written (with parameters bound); Hibernate maps the result columns to entities, DTOs or scalar values but doesn't translate or check the SQL itself.

**Under the hood:**

Imagine needing a PostgreSQL window function or a database-specific hint that JPQL can't express.

```java
@Query(value = "SELECT * FROM employee WHERE salary > :min ORDER BY salary DESC LIMIT 10", nativeQuery = true)
List<Employee> topEarners(@Param("min") BigDecimal min);
```

**Step 1: No parsing into JPQL** — the string goes almost unchanged to JDBC.

**Step 2: Auto-flush** — Hibernate can't know which tables you touch, so by default it flushes pending changes first (to be safe).

**Step 3: Bind parameters** — still prepared statements.

**Step 4: Map results** — to an entity (columns must match), to an interface/DTO projection, or `Object[]`.

**Step 5: Trade-offs** — full SQL power; but tied to one database and not validated at startup.

**Final understanding:** **JPQL can't express it → send your SQL as-is → flush first → map columns back to objects.**

---

### ❓ How does Spring Data JPA generate repository implementations?

**Generic answer:** At startup Spring Data finds your repository interfaces, creates a JDK proxy for each backed by `SimpleJpaRepository`, and builds a query object for every custom method — from its name, `@Query` or a named query.

**Under the hood:**

Imagine `interface EmployeeRepository extends JpaRepository<Employee, Long>` — no class implements it, yet you can inject and call it.

**Step 1: Scan** — `@EnableJpaRepositories` (automatic in Boot) finds interfaces extending `Repository`.

**Step 2: Create a proxy** — a `JpaRepositoryFactory` builds a proxy implementing your interface.

**Step 3: Default methods** — `save`, `findById`, `findAll`… go to a `SimpleJpaRepository` instance.

**Step 4: Custom methods** — for each, a **query lookup strategy**: `@Query` → named query → derive from the method name.

**Step 5: Validate early** — derived queries are built at startup, so a typo like `findByNmae` fails the app immediately.

**Step 6: Add-ons** — transactions (`@Transactional(readOnly = true)` on reads), exception translation, paging.

**Final understanding:** **Interface only → proxy at startup → CRUD to `SimpleJpaRepository` → custom methods turned into prepared queries.**

---

### ❓ How does `findByEmployeeName()` become an SQL query?

**Generic answer:** Spring Data's `PartTree` parser splits the method name into a subject (`find…By`) and predicates (`EmployeeName`), maps them to entity properties, builds a JPA Criteria query, and Hibernate turns that into SQL.

**Under the hood:**

Imagine `List<Employee> findByEmployeeNameAndSalaryGreaterThanOrderBySalaryDesc(String name, BigDecimal min)`.

**Step 1: Split the name** — subject `find`, predicate `EmployeeName And SalaryGreaterThan`, order `Salary Desc`.

**Step 2: Map to properties** — `EmployeeName` → field `employeeName`; `SalaryGreaterThan` → `salary` with operator `>`.

**Step 3: Bind parameters by position** — `name`, `min`.

**Step 4: Build a Criteria query** — `where employeeName = ?1 and salary > ?2 order by salary desc`.

**Step 5: Hibernate renders SQL**

```sql
select … from employee e where e.employee_name = ? and e.salary > ? order by e.salary desc
```

**Step 6: Fail fast** — unknown property → startup error.

**Keywords:** `And`, `Or`, `Between`, `Like`, `In`, `IsNull`, `Top3`, `Distinct`, `IgnoreCase`…

**Final understanding:** **Method name → parsed parts → entity properties + operators → Criteria query → SQL.** Long names = switch to `@Query`.

---

### ❓ What is the difference between JPQL and the Criteria API internally?

**Generic answer:** JPQL is a query string parsed at runtime; the Criteria API builds the same query as a tree of Java objects. Both end up in Hibernate's same internal query model and produce the same SQL.

**Under the hood:**

Imagine a search screen with 8 optional filters. Building a JPQL string with `if`s and string concatenation is messy and error-prone.

**Step 1: JPQL** — a string → parser → query tree → SQL. Readable; typos found at parse time (startup for `@Query`).

**Step 2: Criteria** — you build the tree yourself:

```java
CriteriaBuilder cb = em.getCriteriaBuilder();
CriteriaQuery<Employee> q = cb.createQuery(Employee.class);
Root<Employee> e = q.from(Employee.class);
List<Predicate> where = new ArrayList<>();
if (name != null) where.add(cb.equal(e.get("name"), name));
if (min != null)  where.add(cb.gt(e.get("salary"), min));
q.where(where.toArray(Predicate[]::new));
```

**Step 3: Same destination** — both become Hibernate's SQM tree → same SQL.

**Step 4: Choose** — fixed query → JPQL; dynamic filters → Criteria or Spring Data `Specification`s (with the static metamodel for type safety).

**Final understanding:** **Same query model, two front doors: string (JPQL, readable) or object tree (Criteria, dynamic).**

---

### ❓ How does Hibernate batch INSERT and UPDATE statements?

**Generic answer:** With `hibernate.jdbc.batch_size` set, Hibernate groups identical statements during flush and sends them with JDBC `addBatch()`/`executeBatch()`, one round trip per batch instead of per row.

**Under the hood:**

Imagine importing 10,000 employees. One INSERT per round trip at 1 ms each = 10 seconds of just waiting on the network.

**Step 1: Configure**

```properties
spring.jpa.properties.hibernate.jdbc.batch_size=50
spring.jpa.properties.hibernate.order_inserts=true
spring.jpa.properties.hibernate.order_updates=true
```

**Step 2: Queue** — `persist()` calls queue insert actions.

**Step 3: Group** — at flush, consecutive statements with the **same SQL** are grouped (ordering puts same-entity statements together).

**Step 4: Send** — `addBatch()` 50 times, `executeBatch()` once.

**Step 5: Keep memory flat** — `flush()` + `clear()` every 50 rows.

**Blocker:** `GenerationType.IDENTITY` disables insert batching (next questions).

**Final understanding:** **Many identical statements → group per entity → send 50 per round trip → flush and clear to save memory.**

---

### ❓ How does JDBC batching improve performance?

**Generic answer:** JDBC batching sends many parameter sets for one prepared statement in a single network round trip, cutting latency and letting the database process them together.

**Under the hood:**

Imagine posting 1,000 letters: one trip to the post office per letter, or one trip with a bag of 1,000.

**Step 1: Prepare once** — `PreparedStatement ps = con.prepareStatement("insert into t values (?, ?)")`.

**Step 2: Add rows** — `ps.setX(...); ps.addBatch();` repeated.

**Step 3: Send once** — `ps.executeBatch()` → one request with many rows.

**Step 4: Driver tricks** — MySQL needs `rewriteBatchedStatements=true` to turn it into a multi-row INSERT; PostgreSQL has `reWriteBatchedInserts=true`.

**Typical gain:** 5–20× faster bulk writes.

**Final understanding:** **Round trips dominate small writes → one statement, many parameter sets → one round trip.**

---

### ❓ What is the purpose of Hibernate flush modes?

**Generic answer:** Flush mode decides when pending changes are sent to the database: AUTO (before commit and before queries that might see them — the default), COMMIT (only at commit), MANUAL (only when you call `flush()`), ALWAYS (before every query).

**Under the hood:**

Imagine you change a salary, then run "sum of salaries" in the same transaction. If the change wasn't sent first, the sum is wrong.

**Step 1: AUTO (default)** — flush at commit, and before a query whose tables have pending changes.

**Step 2: COMMIT** — only at commit; faster for read-heavy flows, but queries may not see your unflushed changes.

**Step 3: MANUAL** — only explicit `flush()`; used for read-only sessions (Spring sets it for `readOnly = true`).

**Step 4: ALWAYS** — before every query; rarely needed.

**Final understanding:** **Pending changes vs queries in the same transaction → flush mode decides the timing → AUTO keeps queries correct by default.**

---

### ❓ When does Hibernate automatically flush?

**Generic answer:** In AUTO mode: before the transaction commits, before a JPQL/Criteria query that touches tables with pending changes, before every native query (unless told which tables it uses), and when you call `flush()` explicitly.

**Under the hood:**

Imagine you persist an order, then immediately query `count(*) from Order`. You expect it to include the new order.

**Step 1: At commit** — always, so nothing is lost.

**Step 2: Before overlapping JPQL** — Hibernate checks the query's tables against pending actions; overlap → flush.

**Step 3: Before native SQL** — it can't tell which tables are used, so it flushes (Hibernate 6 native queries flush by default in JPA-compliant mode).

**Step 4: Explicit** — `flush()`, `saveAndFlush()`.

**Step 5: Not on `find()`** — `find()` reads the context first.

**Final understanding:** **Pending changes must be visible to queries → flush before overlapping queries and at commit.**

---

### ❓ How does Hibernate handle database-generated IDs?

**Generic answer:** Depending on the strategy, Hibernate gets the ID before the INSERT (SEQUENCE, TABLE, UUID) or reads it back after the INSERT (IDENTITY), then stores it on the entity and uses it as the persistence-context key.

**Under the hood:**

Imagine `persist(order)`. The persistence context needs the ID **as a map key** immediately — but with auto-increment columns the database only knows it after inserting.

**Step 1: Before insert (SEQUENCE)** — call the sequence (`select nextval(...)`), set the ID, INSERT later at flush.

**Step 2: After insert (IDENTITY)** — must INSERT **right away** at `persist()` and read the generated key (`getGeneratedKeys()`).

**Step 3: In code (UUID)** — `@GeneratedValue(strategy = UUID)` or `@UuidGenerator`; no database round trip.

**Step 4: Set and register** — the ID is set on the entity; the entity is keyed in the context.

**Final understanding:** **Context needs an ID now → get it first (sequence/UUID, batch-friendly) or insert immediately (identity).**

---

### ❓ How do the IDENTITY, SEQUENCE and TABLE generation strategies work?

**Generic answer:** IDENTITY uses the column's auto-increment and reads the ID after insert; SEQUENCE asks a database sequence (in blocks via a pooled optimiser); TABLE simulates a sequence with a row in a table, updated under a lock.

**Under the hood:**

Imagine inserting 10,000 rows. How many extra database calls does each strategy cost?

**Step 1: IDENTITY**
- `id BIGINT AUTO_INCREMENT` (MySQL) / `GENERATED AS IDENTITY`.
- INSERT now, read the key → **no batching**.

**Step 2: SEQUENCE**

```java
@Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "emp_seq")
@SequenceGenerator(name = "emp_seq", sequenceName = "emp_seq", allocationSize = 50)
private Long id;
```

- One `nextval` call reserves **50 IDs** (pooled optimiser) → 10,000 rows ≈ 200 calls; INSERTs batch freely.
- `allocationSize` must match the sequence's `INCREMENT BY`.

**Step 3: TABLE**
- A table `hibernate_sequences(name, next_val)`; each allocation SELECT … FOR UPDATE + UPDATE.
- Portable, but slow and a lock hotspot — avoid.

**Step 4: AUTO** — Hibernate picks (usually SEQUENCE where supported).

**Final understanding:** **IDENTITY = simple, no batching; SEQUENCE = reserve IDs in blocks, batch-friendly (best on PostgreSQL/Oracle); TABLE = portable but slow.**

---

### ❓ Why can IDENTITY generation affect INSERT batching?

**Generic answer:** With IDENTITY the ID exists only after the row is inserted, and Hibernate needs the ID immediately to manage the entity, so it executes each INSERT at `persist()` time — one by one — which disables JDBC insert batching.

**Under the hood:**

Imagine persisting 1,000 entities with `batch_size=50`, expecting 20 round trips. The SQL log shows 1,000 separate INSERTs.

**Step 1: `persist()` needs a key** for the persistence-context map.

**Step 2: Only the database can produce it** with an auto-increment column.

**Step 3: So it inserts immediately** — and reads `getGeneratedKeys()`.

**Step 4: No queue → nothing to batch.**

**Fixes:**
- Use **SEQUENCE** with `allocationSize` (PostgreSQL, Oracle, SQL Server, MariaDB).
- On MySQL (no sequences): batch with plain JDBC/`JdbcTemplate`, or app-generated IDs (UUIDv7/TSID).

**Final understanding:** **Entity needs its ID at persist → IDENTITY only gives it after INSERT → INSERT can't wait → no batching.**

---

### ❓ How does Hibernate handle optimistic locking using `@Version`?

**Generic answer:** Hibernate adds the version to every UPDATE's WHERE clause and increments it; if no row matches, someone else changed it first, and Hibernate throws an `OptimisticLockException`.

**Under the hood:**

Imagine two admins open employee 101 (version 5). Admin A sets salary 50,000 and saves. Admin B, still seeing the old data, sets the department and saves — silently overwriting A's salary change (a **lost update**).

**Step 1: Add a version field**

```java
@Version private long version;
```

**Step 2: Read** — both admins get version 5.

**Step 3: A saves**

```sql
UPDATE employee SET salary = 50000, version = 6 WHERE id = 101 AND version = 5;   -- 1 row
```

**Step 4: B saves**

```sql
UPDATE employee SET dept_id = 7, version = 6 WHERE id = 101 AND version = 5;      -- 0 rows!
```

**Step 5: Detect** — 0 rows updated → `OptimisticLockException` (Spring: `ObjectOptimisticLockingFailureException`).

**Step 6: React** — tell B to reload, or retry automatically when safe.

**Final understanding:** **No locks held while users think → version checked at write → 0 rows = conflict → reject instead of overwrite.**

---

## Relationships and fetching strategies (Java / JPA / Hibernate)

### ❓ How does Hibernate manage one-to-one relationships internally?

**Generic answer:** A one-to-one is stored as a foreign key on one table (the owning side, `@JoinColumn`) or as a shared primary key (`@MapsId`); Hibernate follows that key to load the other entity.

**Under the hood:**

Imagine `Employee` and `Passport`: each employee has at most one passport. In the database, something must link the two rows.

**Step 1: Choose the owner** — the side with the foreign key column, e.g. `employee.passport_id`.

```java
@OneToOne(fetch = FetchType.LAZY) @JoinColumn(name = "passport_id")
private Passport passport;
```

**Step 2: Inverse side** — `@OneToOne(mappedBy = "passport")` on `Passport` has no column; it reads the owner's key.

**Step 3: Load** — owner side lazy → a proxy holding the ID. Inverse side → Hibernate can't know if a row exists without querying, so it is often loaded eagerly anyway.

**Step 4: Better option — shared key** — `@MapsId`: the passport's primary key **is** the employee's ID; no extra column, and lazy loading works well.

**Final understanding:** **One row ↔ one row → a foreign key (or shared primary key) on the owning side → Hibernate follows it → prefer `@MapsId` for lazy-friendly mapping.**

---

### ❓ How does one-to-many mapping work internally?

**Generic answer:** The "many" table holds a foreign key to the "one" side; the `@ManyToOne` on the child owns the relationship, and the parent's `@OneToMany(mappedBy = …)` collection is a lazily loaded view of it.

**Under the hood:**

Imagine a `Department` with 200 `Employee`s. The database has no list column — each employee row has `dept_id`.

**Step 1: Owning side = child**

```java
@ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "dept_id")
private Department department;
```

**Step 2: Inverse side = parent's collection**

```java
@OneToMany(mappedBy = "department")
private List<Employee> employees = new ArrayList<>();
```

**Step 3: Writes follow the owner** — only `employee.department` decides `dept_id`. Adding to `dept.getEmployees()` alone changes nothing in the database — set both sides with a helper method.

**Step 4: Loading** — the collection is a `PersistentBag`; first access runs `select … from employee where dept_id = ?`.

**Trap:** a unidirectional `@OneToMany` without `@JoinColumn` creates a join table and extra UPDATEs.

**Final understanding:** **List in Java, foreign key in SQL → child owns it (`@ManyToOne`) → parent's list is a lazy view (`mappedBy`) → keep both sides in sync.**

---

### ❓ How does many-to-many mapping work internally?

**Generic answer:** A join table holds pairs of foreign keys; Hibernate maps it with `@ManyToMany` + `@JoinTable` on the owning side and inserts or deletes join rows as you change the collection.

**Under the hood:**

Imagine students and courses: a student takes many courses, a course has many students. Neither table can hold a single foreign key.

**Step 1: Join table** — `student_course(student_id, course_id)`.

**Step 2: Map the owner**

```java
@ManyToMany
@JoinTable(name = "student_course",
    joinColumns = @JoinColumn(name = "student_id"),
    inverseJoinColumns = @JoinColumn(name = "course_id"))
private Set<Course> courses = new HashSet<>();
```

**Step 3: Inverse side** — `@ManyToMany(mappedBy = "courses")` on `Course`.

**Step 4: Changes** — adding a course inserts a join row; removing one deletes it. (With a `List`, Hibernate may delete **all** rows and re-insert — use a `Set`.)

**Step 5: Need extra columns** (enrolled date, grade)? — model the join table as its own entity with two `@ManyToOne`s.

**Final understanding:** **Many ↔ many → join table of key pairs → kept in sync with the collection → promote it to an entity when the link has data.**

---

### ❓ How does Hibernate manage foreign-key relationships?

**Generic answer:** Hibernate maps each relationship to a foreign key column (or join table) from the owning side, writes the referenced entity's ID into it at flush, and orders inserts and deletes so constraints aren't violated.

**Under the hood:**

Imagine saving a new department and its new employees in one transaction. If an employee row is inserted before its department, the foreign key constraint fails.

**Step 1: Owner decides the column value** — `employee.department.id` → `employee.dept_id`.

**Step 2: References by ID** — even a lazy proxy is enough: it already holds the ID (`getReference()` uses this).

**Step 3: Order at flush** — parents inserted before children; children deleted before parents.

**Step 4: Unsaved reference** — pointing at a transient entity without cascade → `TransientPropertyValueException`.

**Step 5: Schema** — with `ddl-auto`, Hibernate creates FK constraints from mappings (use Flyway/Liquibase in production).

**Final understanding:** **Object references → owner writes the referenced ID → flush orders statements to respect constraints.**

---

### ❓ What happens when CascadeType.ALL is used?

**Generic answer:** Every operation on the parent — persist, merge, remove, refresh, detach — is also applied to the related entities, so saving or deleting an order saves or deletes its lines too.

**Under the hood:**

Imagine an `Order` with 5 new `OrderLine`s. Without cascade you'd persist each line yourself; forget one and you get an exception.

**Step 1: Mark the relation**

```java
@OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
private List<OrderLine> lines = new ArrayList<>();
```

**Step 2: Operation on the parent** — `persist(order)`.

**Step 3: Hibernate walks the relation** — and applies `persist` to every line (recursively).

**Step 4: Same for remove** — `remove(order)` removes all lines.

**Danger:** cascade only from a parent to children it **owns**. `CascadeType.ALL` on `@ManyToOne` (employee → department) can delete a shared department when one employee is deleted.

**Final understanding:** **Parent and children share one lifecycle → cascade repeats parent operations on children → only for true ownership.**

---

### ❓ How does orphanRemoval work internally?

**Generic answer:** With `orphanRemoval = true`, a child removed from the parent's collection (or whose reference is set to null) is deleted at flush, because it can't exist without its parent.

**Under the hood:**

Imagine `order.getLines().remove(line)`. With only cascade, the line row stays in the database as an orphan.

**Step 1: Mark it**

```java
@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
private List<OrderLine> lines;
```

**Step 2: Track removals** — the `PersistentBag` remembers removed elements.

**Step 3: Flush** — each removed element gets a DELETE.

**Step 4: Versus cascade REMOVE** — cascade deletes children when the **parent** is deleted; orphanRemoval deletes a child when it's **removed from** the parent.

**Trap:** replacing the collection (`order.setLines(newList)`) breaks tracking — change the existing list.

**Final understanding:** **Child can't live without its parent → removed from the collection → DELETE at flush.**

---

### ❓ What is lazy loading, and how does Hibernate implement it?

**Generic answer:** Lazy loading delays reading related data until your code first touches it; Hibernate puts a proxy (single reference) or an uninitialised collection wrapper in place, which runs the SELECT on first access.

**Under the hood:**

Imagine loading 50 employees for a list. Each has a department, 10 skills and 200 attendance records. Loading everything reads thousands of rows you never show.

**Step 1: Choose** — `@OneToMany`/`@ManyToMany` are LAZY by default; set `@ManyToOne`/`@OneToOne` to LAZY yourself (they default to EAGER).

**Step 2: Placeholders** — reference → **proxy** with only the ID; collection → `PersistentBag` marked "not initialised".

**Step 3: First access** — `emp.getDepartment().getName()` → the proxy asks the session to SELECT the department.

**Step 4: Then it's real** — later calls use the loaded data.

**Requirement:** the persistence context must still be open — otherwise `LazyInitializationException`.

**Final understanding:** **Don't load what you might not use → placeholders → load on first touch → needs an open session.**

---

### ❓ How does Hibernate create proxy objects for lazy relationships?

**Generic answer:** Hibernate generates (with ByteBuddy) a subclass of each entity; for a lazy reference it creates an instance holding only the ID and an interceptor that loads the real entity on the first non-ID method call.

**Under the hood:**

Imagine `employee.getDepartment()` returning a `Department` without SQL — and `getName()` triggering a query. The object must look like a `Department` but behave differently.

**Step 1: Generate a subclass** — `Department$HibernateProxy$abc extends Department`.

**Step 2: Create with an ID only** — fields empty; an interceptor holds the ID and session.

**Step 3: `getId()`** — answered without loading.

**Step 4: Any other method** — the interceptor loads the target (SELECT by ID) and delegates.

**Consequences:**
- Entity classes/methods must not be `final`.
- `proxy.getClass() != Department.class` — use `instanceof` in `equals()`, or `Hibernate.getClass()`.
- `getReference()` returns such a proxy on purpose.

**Final understanding:** **Look like the entity without loading it → generated subclass + ID + interceptor → load on first real use.**

---

### ❓ What happens when a lazy relationship is accessed outside a session?

**Generic answer:** The proxy or collection needs an open persistence context to run its SELECT; when the entity is detached, Hibernate throws `LazyInitializationException: could not initialize proxy – no Session`.

**Under the hood:**

Imagine a `@Transactional` service returns an `Employee`; Jackson then calls `emp.getDepartment().getName()` while writing the response.

**Step 1: Service transaction ends** — context closed, entity detached.

**Step 2: Proxy still unloaded** — only the department ID.

**Step 3: Access** — the proxy tries its session — gone.

**Step 4: Exception** — `LazyInitializationException`.

**Fixes (best first):** `JOIN FETCH` or `@EntityGraph` inside the transaction; return a **DTO** built inside the transaction. Not: EAGER everywhere or Open Session in View.

**Final understanding:** **Lazy data needs a live session → transaction ended → can't load → fetch what the caller needs before leaving the service.**

---

### ❓ What is the N+1 query problem?

**Generic answer:** N+1 happens when one query loads N parent rows and then each parent's lazy relation triggers its own query — 1 + N queries instead of one or two.

**Under the hood:**

Imagine 100 employees, each in a department:

```java
List<Employee> employees = employeeRepository.findAll();
```

You expect one SQL query.

**Step 1: Parent query**

```sql
SELECT * FROM employee;     -- 100 rows
```

**Step 2: Access related data**

```java
for (Employee emp : employees) {
    System.out.println(emp.getDepartment().getName());
}
```

**Step 3: One query per parent** — each lazy proxy loads itself:

```sql
SELECT * FROM department WHERE id = 10;
SELECT * FROM department WHERE id = 20;
…
```

(The real count depends on distinct departments, caching and batch-fetch settings.)

**Step 4: Why it hurts** — 1 + 100 round trips; at 1 ms each, the page takes 100 ms instead of 2.

**Step 5: Fix with JOIN FETCH**

```java
@Query("SELECT e FROM Employee e JOIN FETCH e.department")
List<Employee> findAllWithDepartment();
```

**Final understanding:** **Lazy loading avoids loading everything, but looping over lazy relations creates N+1 → design the fetch plan per use case.**

---

### ❓ Why does N+1 happen even when relationships are correctly mapped?

**Generic answer:** Because the mapping says how entities relate, not what each screen needs; lazy is the right default, so any code that loops over parents and touches a relation — including Jackson, `toString()` or mappers — loads row by row.

**Under the hood:**

Imagine a perfect mapping: everything LAZY, owning sides correct. Yet one API call logs 101 queries.

**Step 1: Mapping ≠ fetch plan** — `findAll()` never said "also load departments".

**Step 2: Hidden loops** — Jackson calling getters, `toString()`/`equals()` touching relations, MapStruct mappers.

**Step 3: EAGER doesn't fix it** — `findAll()` with EAGER still loads relations **after** the main query, one per row (or batch).

**Step 4: The cure is per query** — `JOIN FETCH`, `@EntityGraph`, DTO projections, or `@BatchSize`.

**Detect:** SQL logging or Hibernate statistics in tests.

**Final understanding:** **Mapping describes relations → each use case must say what to load → otherwise loops load row by row.**

---

### ❓ How does JOIN FETCH solve the N+1 problem?

**Generic answer:** `JOIN FETCH` tells Hibernate to load the relation in the same SQL with a join and initialise it immediately, so nothing is left to load lazily.

**Under the hood:**

Imagine turning 101 queries into one.

**Step 1: Put the fetch in the query**

```java
@Query("SELECT e FROM Employee e JOIN FETCH e.department WHERE e.active = true")
List<Employee> findActiveWithDepartment();
```

**Step 2: SQL with a join**

```sql
select e.*, d.* from employee e join department d on d.id = e.dept_id where e.active = true
```

**Step 3: Build both** — each row gives an employee and its department; each department is put in the context once and reused.

**Step 4: Initialised** — `employee.department` is the real object, not a proxy.

**Cautions:**
- Fetching a **collection** repeats parent rows (Hibernate 6 de-duplicates; in 5 use `DISTINCT`).
- Collection fetch + paging → Hibernate pages in memory (warning HHH90003004) — page IDs first, then fetch.
- Two bag collections at once → `MultipleBagFetchException`.

**Final understanding:** **Lazy relation needed in a loop → join it in the same SQL → initialised up front → one query.**

---

### ❓ How does EntityGraph work internally?

**Generic answer:** An EntityGraph is a named list of attributes to load eagerly for one query; Hibernate adds the matching fetch joins to the SQL without you rewriting the JPQL.

**Under the hood:**

Imagine `findByStatus()` used by a list screen (needs department) and a detail screen (needs department and skills). Two JPQL queries for the same filter is duplication.

**Step 1: Declare the graph**

```java
@EntityGraph(attributePaths = {"department", "skills"})
List<Employee> findByStatus(Status status);
```

**Step 2: Passed as a hint** — `jakarta.persistence.fetchgraph` / `loadgraph`.

**Step 3: Hibernate adds joins** — left join fetches for those attributes.

**Step 4: Fetch vs load graph** — fetch graph: listed attributes eager, others lazy; load graph: listed eager, others keep their mapping default.

**Same limits as JOIN FETCH** — collections + paging, multiple bags.

**Final understanding:** **Same query, different data needs → attach a graph of what to load → Hibernate adds the fetch joins.**

---

### ❓ What happens when EAGER fetching is used excessively?

**Generic answer:** Every load drags in its eager relations — and their eager relations — even when unused, causing huge joins or extra queries, slow responses and high memory, and you can't switch it off per query.

**Under the hood:**

Imagine `Employee` → EAGER `Department` → EAGER `Company` → EAGER `List<Office>`. You just want employee names for a dropdown.

**Step 1: `find()` joins everything** — one wide SQL with duplicated rows.

**Step 2: Queries load relations afterwards** — JPQL ignores EAGER in its SQL, then loads each eager relation separately → N+1 again.

**Step 3: Chains multiply** — eager-of-eager pulls half the database.

**Step 4: No opt-out** — JPA can't make an EAGER mapping lazy for one query.

**Rule:** map **everything LAZY** (set `@ManyToOne(fetch = LAZY)` explicitly) and fetch eagerly **per query**.

**Final understanding:** **EAGER in the mapping = loaded everywhere → bloated and unfixable per query → lazy by default, fetch per use case.**

---

### ❓ How do batch fetching and subselect fetching work?

**Generic answer:** Batch fetching (`@BatchSize` or `default_batch_fetch_size`) loads lazy relations for many parents at once with `WHERE id IN (...)`; subselect fetching loads the children of all parents from the previous query with one subquery.

**Under the hood:**

Imagine a generic `findAll(Pageable)` you can't easily change, but you still want to avoid N+1.

**Step 1: Batch fetching**

```properties
spring.jpa.properties.hibernate.default_batch_fetch_size=50
```

Touching the first department proxy loads up to 50 pending ones:

```sql
select … from department where id in (?, ?, … 50)
```

100 employees → ~2 queries instead of 100.

**Step 2: Subselect fetching**

```java
@OneToMany(mappedBy = "department") @Fetch(FetchMode.SUBSELECT)
private List<Employee> employees;
```

Touching one department's employees loads them for **all** departments from the original query:

```sql
select … from employee where dept_id in (select id from department where …original filter…)
```

**Step 3: Why use them** — they work with paging and fix N+1 globally.

**Final understanding:** **N+1 but can't change the query → load lazy relations in groups (IN list) or all at once (subselect).**

---

## Transactions and concurrency (Java / JPA / Hibernate)

### ❓ How does JPA transaction management work internally?

**Generic answer:** In Spring, `JpaTransactionManager` creates an EntityManager, begins its JDBC transaction and binds both to the current thread; repositories use that bound EntityManager, and at the end it flushes and commits or rolls back.

**Under the hood:**

Imagine a `@Transactional` service calling three repositories. They must share one EntityManager and one database transaction without passing them around.

**Step 1: Proxy intercepts** — `TransactionInterceptor` calls `JpaTransactionManager.getTransaction()`.

**Step 2: Create resources** — new EntityManager; `begin()` → JDBC `setAutoCommit(false)` on a pooled connection.

**Step 3: Bind to the thread** — `TransactionSynchronizationManager` stores it in a ThreadLocal.

**Step 4: Repositories find it** — the shared EntityManager proxy looks up the bound one.

**Step 5: Finish** — flush → JDBC commit (or rollback) → close the EntityManager → connection back to the pool.

**Final understanding:** **One unit of work across many beans → create + begin → bind to the thread → everyone uses it → flush, commit, clean up.**

---

### ❓ How does the EntityManager participate in Spring transactions?

**Generic answer:** The injected EntityManager is a shared proxy; on each call it asks Spring for the EntityManager bound to the current transaction, so all code in that transaction uses one persistence context.

**Under the hood:**

Imagine `@PersistenceContext EntityManager em` injected into a singleton used by 200 threads. EntityManager isn't thread-safe — so how is this safe?

**Step 1: Inject a proxy** — `SharedEntityManagerCreator` makes a thread-safe proxy.

**Step 2: On each call** — it looks up the current thread's transactional EntityManager.

**Step 3: Found** — delegate (same persistence context as the rest of the transaction).

**Step 4: No transaction** — a temporary EntityManager for that one call (writes then fail with `TransactionRequiredException`).

**Step 5: `REQUIRES_NEW`** — suspends the bound EntityManager and binds a new one.

**Final understanding:** **Singleton beans, per-thread state → inject a proxy → route each call to the transaction's EntityManager.**

---

### ❓ How does Hibernate synchronize the persistence context with database transactions?

**Generic answer:** Hibernate registers callbacks with the transaction: before commit it flushes, after commit it treats current state as the new baseline and updates caches, and after rollback the context must be discarded.

**Under the hood:**

Imagine a transaction that changes three entities and then commits — or fails halfway. Memory and database must not disagree afterwards.

**Step 1: Before completion** — flush pending changes (unless MANUAL).

**Step 2: Commit** — database commits; snapshots become the new baseline; second-level cache updated.

**Step 3: Rollback** — database undoes changes, but the Java objects still hold modified values — Spring closes the EntityManager; don't reuse those entities.

**Step 4: After completion** — session closed, connection released.

**Final understanding:** **Memory and database must agree → flush before commit → new baselines after → discard the context after rollback.**

---

### ❓ How does optimistic locking work internally?

**Generic answer:** Optimistic locking assumes conflicts are rare: no lock is held while you work; the UPDATE checks a version and fails if the row changed since you read it.

**Under the hood:**

Imagine an edit form open for 10 minutes. Holding a database lock for 10 minutes would block everyone.

**Step 1: Read with a version** — `version = 7`.

**Step 2: Work without locks** — others can read and write meanwhile.

**Step 3: Write conditionally** — `UPDATE … SET …, version = 8 WHERE id = ? AND version = 7`.

**Step 4: Count rows** — 1 = success; 0 = conflict → `OptimisticLockException`.

**Step 5: Resolve** — reload and ask the user, or retry automated work.

**Also:** `OPTIMISTIC_FORCE_INCREMENT` bumps the version when only children changed.

**Final understanding:** **Long think time, rare conflicts → no locks → verify the version on write → reject stale updates.**

---

### ❓ How does pessimistic locking work internally?

**Generic answer:** Pessimistic locking locks rows in the database when you read them (`SELECT … FOR UPDATE`), so other transactions wait until you commit or roll back.

**Under the hood:**

Imagine the last concert seat and 50 people clicking "book" in the same second. With optimistic locking, 49 would fail after doing their work; you'd rather queue them.

**Step 1: Ask for a lock**

```java
@Lock(LockModeType.PESSIMISTIC_WRITE)
@Query("select s from Seat s where s.id = :id")
Optional<Seat> lockSeat(@Param("id") long id);
```

**Step 2: SQL** — `select … from seat where id = ? for update`.

**Step 3: Row locked** — other `FOR UPDATE` readers and writers **wait**.

**Step 4: Do the work** — check availability, book.

**Step 5: Commit releases the lock** — the next waiter sees "already booked".

**Care:** short transactions, a lock timeout (`jakarta.persistence.lock.timeout`), consistent lock order to avoid deadlocks. `PESSIMISTIC_READ` = shared lock.

**Final understanding:** **High contention on one row → lock at read → others wait → released at commit.**

---

### ❓ What happens when two users update the same entity simultaneously?

**Generic answer:** Without protection, the last commit silently overwrites the first (a lost update); with `@Version` the second gets an optimistic-lock error; with a pessimistic lock the second waits and then sees the first's change.

**Under the hood:**

Imagine product 42 with stock 10. Users A and B each buy 1 at the same moment.

**Step 1: Both read 10.**

**Step 2: Both compute 9.**

**Step 3: No protection** — both write 9; correct answer 8 — **lost update**.

**Step 4: `@Version`** — B's update matches 0 rows → exception → retry reads 9 → writes 8.

**Step 5: `FOR UPDATE`** — B waits for A's commit, reads 9 → writes 8.

**Step 6: Atomic SQL** — `UPDATE product SET stock = stock - 1 WHERE id = 42 AND stock > 0` (no read needed).

**Final understanding:** **Two read-modify-writes → lost update → detect (version), serialise (lock) or make it atomic (single UPDATE).**

---

### ❓ How does `@Version` prevent lost updates?

**Generic answer:** Each UPDATE includes `WHERE version = <version you read>` and increments it; if someone changed the row first, 0 rows match and Hibernate throws instead of overwriting.

**Under the hood:**

Imagine Admin A and Admin B editing employee 101 at version 5.

**Step 1: A saves** — `… SET name = ?, version = 6 WHERE id = 101 AND version = 5` → 1 row.

**Step 2: B saves** — `… WHERE id = 101 AND version = 5` → **0 rows**.

**Step 3: Hibernate checks the count** → `OptimisticLockException`.

**Step 4: B's change isn't applied** — A's work is safe.

**Across REST requests:** send the version (or an `ETag`) to the client and back, and set it on the entity before saving, so the check uses the version the user actually saw.

**Final understanding:** **Every write proves "I saw the latest version" → mismatch = someone was faster → reject, don't overwrite.**

---

### ❓ What is the difference between database locking and application-level locking?

**Generic answer:** Database locks (row locks, `FOR UPDATE`, version checks, constraints) protect data for every client; application-level locks (`synchronized`, Redis/ZooKeeper locks) coordinate your code paths and only work if every writer uses them.

**Under the hood:**

Imagine stock updates from your Spring app (3 instances), a batch job and an admin SQL script.

**Step 1: `synchronized`** — protects threads in **one JVM** only; useless across 3 instances.

**Step 2: Distributed lock** (Redis, ZooKeeper, ShedLock) — coordinates your instances ("only one runs the nightly job"). The SQL script ignores it.

**Step 3: Database locking** — enforced for **every** client.

**Step 4: Choose** — data correctness → database (constraints, versions, row locks, atomic updates); coordinating work → application/distributed locks.

**Final understanding:** **Data rules live with the data (database); coordinating processes lives in the app (distributed locks).**

---

### ❓ How do transaction isolation levels affect JPA operations?

**Generic answer:** The isolation level on the connection decides what your queries see of other transactions' changes; the persistence context adds its own repeatable read for entities, but queries for new rows still follow the database level.

**Under the hood:**

Imagine a report summing salaries while another transaction gives raises. Do you see half the raises?

**Step 1: Set the level** — `@Transactional(isolation = Isolation.REPEATABLE_READ)` → JDBC `setTransactionIsolation`.

**Step 2: Database guarantees**

| Level | Dirty read | Non-repeatable read | Phantom |
|---|---|---|---|
| READ COMMITTED (PostgreSQL/Oracle default) | no | possible | possible |
| REPEATABLE READ (MySQL default) | no | no | possible* |
| SERIALIZABLE | no | no | no |

*InnoDB and PostgreSQL snapshots usually prevent phantoms for plain reads.

**Step 3: JPA's layer** — re-reading an entity in the same context returns the **same object** (application-level repeatable read).

**Step 4: Lost updates need more** — `@Version` or locks.

**Final understanding:** **Isolation = what you see of others → set per transaction → persistence context adds entity repeatable reads → versions/locks for write conflicts.**

---

### ❓ What causes LazyInitializationException?

**Generic answer:** Touching an uninitialised lazy proxy or collection after its persistence context has closed — usually after the `@Transactional` method returned, in the controller, a mapper or JSON serialisation.

**Under the hood:**

Imagine `EmployeeService.get(id)` returns an entity; the controller returns it; Jackson calls `getSkills()`.

**Step 1: Loaded in a transaction** — `skills` is an uninitialised lazy collection.

**Step 2: Transaction ends** — context closed; entity detached.

**Step 3: Something touches it** — getter, `size()`, `toString()`, Jackson.

**Step 4: No session** → `LazyInitializationException`.

**Fix:** JOIN FETCH / EntityGraph, or map to DTOs inside the transaction. Avoid EAGER everywhere, `enable_lazy_load_no_trans`, or relying on Open Session in View.

**Final understanding:** **Lazy needs a live session → closed before the data was touched → fetch it while the transaction is open.**

---

### ❓ What happens when an EntityManager is closed?

**Generic answer:** Its persistence context is cleared, managed entities become detached, unflushed changes are lost, lazy placeholders can no longer load, and the connection returns to the pool.

**Under the hood:**

Imagine a transaction ends and Spring closes the EntityManager — but the controller still holds the entities.

**Step 1: Context cleared** — no more tracking.

**Step 2: Entities detached** — changes won't be saved unless merged later.

**Step 3: Unflushed changes discarded** — only flushed + committed changes survive (Spring's commit flushes first).

**Step 4: Lazy placeholders orphaned** — accessing them throws `LazyInitializationException`.

**Step 5: Connection released.**

**Final understanding:** **Closing ends the unit of work → tracking stops → objects detached → lazy loading impossible → connection freed.**

---

### ❓ How does Open Session in View work?

**Generic answer:** Open Session in View (OSIV) — on by default in Spring Boot — opens an EntityManager when a web request starts and closes it after the response is written, so lazy relations can still load during serialisation.

**Under the hood:**

Imagine controllers returning entities whose lazy relations Jackson touches after the service transaction ended — normally a `LazyInitializationException`.

**Step 1: Request starts** — `OpenEntityManagerInViewInterceptor` creates and binds an EntityManager.

**Step 2: Service transactions reuse it** — they commit, but the EntityManager stays open.

**Step 3: After the service** — lazy access in the web layer runs SELECTs outside a transaction.

**Step 4: Request ends** — EntityManager closed.

**Why it's risky:** a connection can be held for the whole request (pool exhaustion), N+1 queries hide in the web layer, and Boot logs a warning about it.

**Recommendation:** `spring.jpa.open-in-view=false`, fetch what you need, return DTOs.

**Final understanding:** **Lazy errors in the view → keep the session open for the whole request → hides them but costs connections and hides N+1 → prefer explicit fetching.**

---

### ❓ How does Hibernate handle bulk UPDATE and DELETE queries?

**Generic answer:** Bulk JPQL is translated to one SQL statement run directly in the database, bypassing the persistence context, dirty checking, cascades, entity callbacks and automatic version increments.

**Under the hood:**

Imagine a 10% raise for 50,000 employees. Loading, changing and flushing 50,000 entities is slow and memory-hungry.

**Step 1: Write a bulk query**

```java
@Modifying(clearAutomatically = true, flushAutomatically = true)
@Query("UPDATE Employee e SET e.salary = e.salary * 1.10 WHERE e.department.id = :dept")
int raise(@Param("dept") long dept);
```

**Step 2: Flush first** — so the statement sees pending changes.

**Step 3: One SQL statement** — the database updates all rows; returns the count.

**Step 4: Bypassed** — callbacks, cascades, orphan removal, version bump (add `e.version = e.version + 1` yourself); the second-level cache region is invalidated.

**Final understanding:** **Many rows, same change → one SQL statement in the database → fast, but skips entity-level features.**

---

### ❓ Why can bulk JPQL operations cause stale entities in the persistence context?

**Generic answer:** Bulk statements change rows directly in the database without touching managed objects, so entities already loaded still hold old values — and a later flush may overwrite the bulk change.

**Under the hood:**

Imagine in one transaction: load employee 101 (salary 40,000), run the 10% raise, then read `emp.getSalary()`.

**Step 1: 101 is managed** — 40,000 in memory.

**Step 2: Bulk UPDATE** — database now 44,000.

**Step 3: Context unaware** — `emp.getSalary()` is still 40,000; `find(101)` returns the same stale object.

**Step 4: Worse** — change another field of 101 and dirty checking writes **all columns** → salary back to 40,000.

**Fix:** run bulk operations before loading entities, `clear()` after (`clearAutomatically = true`), or `refresh()` affected entities.

**Final understanding:** **Bulk change bypasses memory → in-memory copies go stale → clear or refresh after bulk operations.**

---

### ❓ How do you prevent database connection leaks in JPA applications?

**Generic answer:** Let Spring manage EntityManagers and transactions, keep transactions short, turn off Open Session in View, close anything you open manually, and enable HikariCP leak detection.

**Under the hood:**

Imagine the app runs fine for hours, then every request fails with "Connection is not available, request timed out after 30000ms". All 10 pool connections are borrowed and never returned.

**Step 1: Know who holds connections** — a transaction (until commit), an OSIV request (until the response is written), any manual EntityManager or JDBC connection.

**Step 2: Common leaks** — `createEntityManager()` without `close()`; repository `Stream`s not closed; HTTP calls or file I/O inside transactions; OSIV with slow clients.

**Step 3: Prevent** — inject the shared EntityManager + `@Transactional`; try-with-resources; no remote calls inside transactions; `spring.jpa.open-in-view=false`.

**Step 4: Detect**

```properties
spring.datasource.hikari.leak-detection-threshold=20000   # log a stack trace if held > 20 s
```

Watch `hikaricp_connections_active` / `pending` in Actuator/Prometheus.

**Final understanding:** **Pool exhausted by unreturned connections → let Spring scope them → short transactions, closed resources → leak detection for the rest.**
