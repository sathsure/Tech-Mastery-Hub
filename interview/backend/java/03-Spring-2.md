## Database

### ❓ What is DataSource?

### 📝 Answer

DataSource = Connection factory to DB.

Spring Boot default:

- HikariCP

Default pool size:

- 10 connections

Configured via:

```properties
spring.datasource.url=
spring.datasource.username=
spring.datasource.password=
spring.datasource.hikari.maximum-pool-size=20
```

---

### ❓ What is connection pooling?

Connection pooling means reusing database connections instead of creating a new one every time.

🔹 Why do we need it?

- Creating DB connections is slow & expensive
- Too many connections can crash DB
- Improves performance & scalability

🔹 How it works?

- Tomcat has a Thread Pool
- Each incoming HTTP request is assigned one thread from the thread pool
- If the thread pool is full:
  - The request waits in the queue
  - Or fails after timeout (if queue is full or timeout is reached)
- Once a thread is assigned and the request needs database access:
  - The thread requests a DB connection from the Connection Pool
- If the connection pool is not full:
  - The connection pool provides an idle connection (or creates a new one)
  - The thread executes the query using the connection
  - After use, the connection is returned to the Connection Pool (not closed)
- After request processing completes:
  - The thread is returned to the Thread Pool

| Pool            | Default Size | Why                      |
| --------------- | ------------ | ------------------------ |
| Thread Pool     | ~200         | Handles HTTP concurrency |
| Connection Pool | ~10          | Limits DB load           |

> Not every request hits the database

🔹 Common libraries

- HikariCP (Default in **Spring Boot**)
- Tomcat JDBC Connection Pool (Default in **Tomcat**, Faster than DBCP)
- Apache DBCP (Apache Commons Database Connection Pool)

🔹 DB Configuration

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/mydb
spring.datasource.username=dbuser
spring.datasource.password=dbpass
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

SpringBoot uses auto-configuration and automatically creates these beans for you:

- DataSource (backed by HikariCP by default)
- JdbcTemplate (if JDBC starter is present)
- EntityManagerFactory & TransactionManager (if JPA starter is present)

🤔❓ What does an application server do?

- Runs Servlets & REST APIs
- Manages thread pool
- Manages connection pool
- Handles security & transactions

Common Application Servers are:

- Application Server
- JBoss / WildFly
- WebLogic

---

### ❓How do I allow only certain threads to use certain DB connections?

### 📝 Answer

1️⃣ **Create different executors** (Simple)

```java
ExecutorService dbExecutor = Executors.newFixedThreadPool(10);

ExecutorService nonDbExecutor = Executors.newFixedThreadPool(50);

// DB work
dbExecutor.submit(() -> {
    userRepository.findAll();
});

// Non-DB work
nonDbExecutor.submit(() -> {
    processFile();
});
```

2️⃣ Using MULTIPLE Connection Pools (DB vs Non-DB Separation)

| API        | Uses DB?       | Which Connection Pool |
| ---------- | -------------- | --------------------- |
| `/health`  | ❌ No          | None                  |
| `/users`   | ✅ Yes         | **Primary Pool**      |
| `/reports` | ✅ Yes (heavy) | **Reporting Pool**    |

1. application.yml (Multiple Connection Pools)

```yaml
server:
  port: 8080

spring:
  datasource:
    primary:
      jdbc-url: jdbc:mysql://db1-host:3306/appdb
      username: app_user
      password: app_pwd
      driver-class-name: com.mysql.cj.jdbc.Driver
      hikari:
        maximum-pool-size: 10
        minimum-idle: 5
        pool-name: PRIMARY_POOL

    reporting:
      jdbc-url: jdbc:postgresql://db2-host:5432/reportdb
      username: report_user
      password: report_pwd
      driver-class-name: com.mysql.cj.jdbc.Driver
      hikari:
        maximum-pool-size: 5
        minimum-idle: 2
        pool-name: REPORTING_POOL
```

2. DataSource Configuration

```java
@Configuration
public class DataSourceConfig {

    @Primary
    @Bean(name = "primaryDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.primary")
    public DataSource primaryDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "reportingDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.reporting")
    public DataSource reportingDataSource() {
        return DataSourceBuilder.create().build();
    }
}
```

3. Service

```java
@Service
public class ApplicationService {

    // ❌ NON-DB METHOD
    public String health() {
        return "Application is Under Process";
    }

    // ✅ PRIMARY DB
    public List<String> getUsers() {
        return repository.getUsers();
    }

    // ✅ REPORTING DB
    public Integer getUserCount() {
        return repository.getUserCount();
    }
}
```

4. Repository

```java
@Repository
public class ApplicationRepository {

    private final JdbcTemplate primaryJdbc;
    private final JdbcTemplate reportingJdbc;

    public ApplicationRepository(
        @Qualifier("primaryDataSource") DataSource primaryDs,
        @Qualifier("reportingDataSource") DataSource reportingDs) {

        this.primaryJdbc = new JdbcTemplate(primaryDs);
        this.reportingJdbc = new JdbcTemplate(reportingDs);
    }

    // ✅ PRIMARY DB ACCESS
    public List<String> getUsers() {
        return primaryJdbc.query("SELECT name FROM users", (rs, rowNum) -> rs.getString("name"));
    }

    // ✅ REPORTING DB ACCESS
    public Integer getUserCount() {
        return reportingJdbc.queryForObject("SELECT COUNT(*) FROM users", Integer.class);
    }
}
```

---

## Spring Data JPA

### ❓ What is Declarative Transactions, Spring Transactions & Spring Data JPA?

### 📝 Answer

1. Declarative Transactions (Concept)

A **style of transaction management**, not a framework.

- You **declare** transaction rules
- You do **not** write `begin / commit / rollback` code

Example:

```java
@Transactional
public void placeOrder() { }
```

> ✔ Focus on _what_ should be transactional
> ✔ Not _how_ it is implemented

2. Spring Transactions (Implementation)

Spring’s **transaction management framework** provided by the **Spring Framework**.

- Implements **Declarative Transactions**
- Uses **AOP + proxies**
- Manages commit / rollback automatically

Under the hood:

- `PlatformTransactionManager`
- Integrates with JDBC, JPA, Hibernate

Example:

```java
@Service
@Transactional
public class OrderService { }
```

> ✔ This is the **engine** that makes declarative transactions work

3. Spring Data JPA (Usage Layer)

A **data access abstraction** built on top of JPA + Spring Transactions.

- Auto-provides CRUD repositories
- Uses Spring Transactions internally
- Many repository methods are transactional by default

Example:

```java
public interface OrderRepository extends JpaRepository<Order, Long> {}
```

> ✔ You usually **don’t write transaction code**
> ✔ Spring Data JPA handles it for you

4. Transaction Propagation

- REQUIRED (Default – 90% use case)

  ```java
  @Transactional
  public void placeOrder() {
      paymentService.pay(); // joins same transaction
  }
  ```

  > ✔ If any method fails → everything rolls back

- REQUIRES_NEW
  - Suspends existing transaction
  - Starts a new independent transaction

  ```java
  @Transactional(propagation = Propagation.REQUIRES_NEW)
  public void logAudit() { }
  ```

- SUPPORTS
  - Uses transaction only if one exists
  - Otherwise runs without transaction

  ```java
  @Transactional(propagation = Propagation.SUPPORTS)
  public void readData() { }
  ```

  > ✔ Good for read-only operations

- NOT_SUPPORTED
  - Always runs without transaction

  ```java
  @Transactional(propagation = Propagation.NOT_SUPPORTED)
  public void exportData() { }
  ```

🤔❓ What is Rollback and Commit?

**Rollback** - Reverts all DB changes made in the transaction
**Commit** - Makes all DB changes save permanently

🤔❓ What happens if `@Transactional` is NOT used?

- Each DB operation runs independently
- Partial data may be saved

```java
repo.save(order);   // saved
repo.save(payment); // fails
```

> Result: Inconsistent data

🤔❓ What happens if a Checked Exception is added?

By default in Spring:

- Checked exception ❌ does NOT rollback
- Transaction commits

```java
@Transactional
public void save() throws Exception {
    throw new Exception(); // checked
}
```

> ✔ Data is still saved

🤔❓ How to rollback for Checked Exception?

Use `rollbackFor = Exception.class` to explicitly roll back for checked exceptions.

```java
@Transactional(rollbackFor = Exception.class)
```

🤔❓ Do we need `@Transactional` with Spring Data JPA?

- Simple CRUD → often **not needed**
- Multiple DB operations / service logic → **needed**

---

### ❓ Explain what is JPA Entity class, How pagination works in Spring Data JPA?

### 📝 Answer

An **Entity** is a **Java class mapped to a database table** using JPA.

👉 One object = one row
👉 One class = one table

Used with **Spring Framework** + **Hibernate**

Simple Entity Class Example:

```java
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String productName;

    private double price;

    // getters & setters
}
```

✔ Automatically mapped to `orders` table
✔ No SQL required

**Main Annotations Used in Entity**

| Annotation        | Purpose                                                                                          |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| `@Entity`         | Tells JPA that this Java class should be mapped to a database table                              |
| `@Table`          | Specifies the table name and table-level details **(optional if class name matches table name)** |
| `@Id`             | Marks the field as the **primary key** of the table                                              |
| `@GeneratedValue` | Automatically generates primary key values (AUTO, IDENTITY, SEQUENCE, TABLE)                     |
| `@Column`         | Maps a class field to a table column and allows constraints like `nullable`, `unique`, `length`  |
| `@Transient`      | Excludes the field from persistence (not saved in the database)                                  |
| `@Enumerated`     | Defines how an enum is stored in the database (ORDINAL or STRING)                                |
| `@OneToMany`      | Defines a one-to-many relationship between two entities                                          |
| `@ManyToOne`      | Defines a many-to-one relationship and creates a foreign key                                     |

**@GeneratedValue strategies:**

- `AUTO` → JPA automatically picks `IDENTITY`, `SEQUENCE`, or `TABLE` based on DB
- `IDENTITY` → Database auto-increments the ID (e.g., MySQL AUTO_INCREMENT)
- `SEQUENCE` → Uses a database sequence to generate IDs (e.g., Oracle, PostgreSQL)
- `TABLE` → Uses a separate table to generate and manage unique IDs (least used)

**Relationships:**

- One **User** can place **many Orders**
- Each **Order** belongs to **one User**

1. `@ManyToOne` - Many rows in **Order table** point to **one row** in **User table**

```java
@Entity
public class Order {

    @Id
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id") // FK column
    private User user;
}
```

👉 `@JoinColumn` = **Foreign Key column**

> **Foreign key is stored in the `Order` table**
> **Always add `@ManyToOne` on the child table**

2. `@OneToMany` — One **User** has many **Orders**

```java
@Entity
public class User {

    @Id
    private Long id;

    @OneToMany(mappedBy = "user")
    private List<Order> orders;
}
```

👉 `mappedBy` refers to **field name** in the other entity

3. `@OneToOne` — One **User** has one **Profile**

```java
@Entity
public class UserProfile {

    @Id
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}
```

✔ One row ↔ One row
✔ FK stored in one table only

4. `@ManyToMany` — Many **Users** can enroll in many **Courses**

- One User → many Courses
- One Course → many Users

```java
@Entity
public class User {

    @ManyToMany
    @JoinTable(
        name = "user_course",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "course_id")
    )
    private List<Course> courses;
}
```

✔ No direct FK
✔ Join table manages relationship

> Uses a **join table**

5. `Cascade`

Cascade tells JPA to automatically apply the changes from parent to child.

```java
@Entity
class User {

    @OneToMany(
        mappedBy = "user",
        cascade = CascadeType.ALL
    )
    private List<UserCourse> courses = new ArrayList<>();
}
```

✔ User is saved
✔ UserCourse rows are saved automatically

❌ What if Cascade is NOT added?

- User is saved
- UserCourse is NOT saved
- Exception or missing rows

> Cascade saves you from writing extra `save()` calls.

6. `orphanRemoval` — Delete row when relationship is removed

`orphanRemoval` deletes a child row when it is removed from the parent collection.

```java
@Entity
class User {

    @OneToMany(
        mappedBy = "user",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<UserCourse> courses;
}
```

✔ It deletes only a child, not all children automatically.

❌ Without orphanRemoval

- Child is NOT deleted automatically from the children list (`List<UserCourse>`)
- Explicitly must be deleted `childRepository.delete(child);` in case of deletion of a child.

7. `EAGER` vs `LAZY` — When should data be loaded?

FetchType.EAGER

```java
@OneToMany(fetch = FetchType.EAGER)
private List<StudentCourse> courses;

/* ---------------- */

Student s = repo.findById(1);
```

✔ Student loaded
✔ Courses loaded immediately
❌ Heavy queries
❌ Performance risk

```java
FetchType.LAZY (Recommended)
@OneToMany(fetch = FetchType.LAZY)
private List<StudentCourse> courses;

/* ---------------- */

Student s = repo.findById(1); // only student
s.getCourses(); // courses loaded now
```

✔ Faster initial query
✔ Better memory usage

| EAGER                 | LAZY                     |
| --------------------- | ------------------------ |
| Loads immediately     | Loads only when accessed |
| Risky for performance | Safe & recommended       |

---

### ❓ How do Pagination and Sorting work in Spring Data JPA?

### 📝 Answer

When tables grow to millions of rows:

- Fetching all data → ❌ OutOfMemory
- UI needs small chunks → ✅ Pagination
- Users want ordered data → ✅ Sorting
- DB should do the work → ✅ LIMIT + OFFSET / ORDER BY

Spring Data JPA provides:

| Concept    | Purpose                           |
| ---------- | --------------------------------- |
| `Pageable` | Request (page number, size, sort) |
| `Page<T>`  | Response (data + metadata)        |
| `Sort`     | Sorting rules                     |

```java
/* --------ENTITY------- */
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private LocalDateTime createdAt;
}

/* -----REPOSITORY------- */
public interface UserRepository extends JpaRepository<User, Long> {
    Page<User> findAll(Pageable pageable); // That’s it. No SQL needed.
}

/* -----SERVICE------- */
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public Page<User> getUsers(int page, int size, String sortBy) {

        Pageable pageable = PageRequest.of(
                page,                     // page number (0-based)
                size,                     // page size
                Sort.by(sortBy).descending()
        );

        return userRepository.findAll(pageable);
    }
}

/* -------CONTROLLER--------*/
@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public Page<User> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy
    ) {
        return userService.getUsers(page, size, sortBy);
    }
}
```

What SQL Generates from the above code is:

```sql
SELECT * FROM users ORDER BY created_at DESC
LIMIT 5 OFFSET 0;
```

👉 OFFSET = Skip rows
👉 OFFSET RULES → **OFFSET = pageNumber × pageSize (Spring Data JPA does this automatically)**

```
OFFSET 0 → skip 0 rows
OFFSET 10 → skip first 10 rows
OFFSET 20 → skip first 20 rows
```

1. **Pagination with Custom Queries**

Two Ways to Write the Same Pagination Query

```java
// Option 1: Custom JPQL using @Query
@Query("SELECT u FROM User u WHERE u.email LIKE %:email%")
Page<User> searchByEmail(@Param("email") String email, Pageable pageable);

// Option 2: Spring Data JPA Derived Queries
Page<User> findByEmailContaining(String email, Pageable pageable);
```

> Use `@Query` for Complex queries
> Use Derived Query when Query is simple

2. ✅ Allowed prefixes and Rules

```
find…
read…
get…
query…
search…
stream…
```

| Keyword                    | Meaning            | Example Method                                                 |
| -------------------------- | ------------------ | -------------------------------------------------------------- |
| `By`                       | Start condition    | `findByEmail(String email)`                                    |
| `And` / `Or`               | Combine conditions | `findByStatusAndRole(String status, String role)`              |
| `Containing`               | `LIKE %value%`     | `findByEmailContaining(String email)`                          |
| `StartingWith`             | `LIKE value%`      | `findByNameStartingWith(String name)`                          |
| `EndingWith`               | `LIKE %value`      | `findByNameEndingWith(String name)`                            |
| `Between`                  | Range              | `findByCreatedAtBetween(LocalDateTime from, LocalDateTime to)` |
| `LessThan` / `GreaterThan` | Comparisons        | `findByAgeGreaterThan(int age)`                                |
| `In`                       | `IN` clause        | `findByStatusIn(List<String> statuses)`                        |
| `OrderBy`                  | Sorting            | `findByStatusOrderByCreatedAtDesc(String status)`              |

3. `Page` Vs `Slice` Vs `List`

| Type       | Use When                                                                |
| ---------- | ----------------------------------------------------------------------- |
| `Page<T>`  | You need page numbers **and total count** (typical UI pagination)       |
| `Slice<T>` | You only need **next/previous data**, not total count (infinite scroll) |
| `List<T>`  | Data is **small** and pagination is not required                        |

> Page → Tell me how many total records exist
> Slice → Just tell me if there is a next page
> List → Give me everything

🔹 Use Page when Data size is large / UI needs page numbers

    ```java
    /* ------REPOSITORY ----- */
    public interface UserRepository extends JpaRepository<User, Long> {
    Page<User> findAll(Pageable pageable);
    }

    /*-------SERVICE ------*/
    Pageable pageable = PageRequest.of(0, 10);
    Page<User> page = userRepository.findAll(pageable);
    ```
    ➡️ Spring Data JPA executes TWO SQL queries:
    ```sql
    <!-- ✅ Query 1 – Fetch page data -->
    SELECT * FROM users LIMIT 10 OFFSET 0;

    <!-- ✅ Query 2 – Count total rows -->
    SELECT COUNT(*) FROM users;
    ```

🔹 Use Slice when Data is large and need to know is there a next page?

    ```java
    /* ------REPOSITORY ----- */
    public interface UserRepository extends JpaRepository<User, Long> {
        Slice<User> findByStatus(String status, Pageable pageable);
    }

    /*-------SERVICE ------*/
    Pageable pageable = PageRequest.of(0, 10);
    Slice<User> users = userRepository.findByStatus("ACTIVE", pageable);

    boolean hasNext = users.hasNext();
    ```

    ➡️ Spring Data JPA executes ONE SQL query:
    ```sql
    SELECT * FROM users WHERE status='ACTIVE'
    LIMIT 10 OFFSET 0;
    ```
    > ❌ No COUNT(*) query → faster.
    > Used for **Infinite scrolling**

🔹 Use List when Data size is small / want all records at once

    ```java
    public interface RoleRepository extends JpaRepository<Role, Long> {
        List<Role> findAll();
    }
    ```

🤔❓ Difference between `CrudRepository`, `PagingAndSortingRepository`, `JpaRepository`

| Repository                   | What it Provides                                                                                                             |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `CrudRepository`             | Basic **Create, Read, Update, Delete** operations like `save()`, `findById()`, `deleteById()`                                |
| `PagingAndSortingRepository` | All CRUD features **plus pagination and sorting** using `Pageable` and `Sort`                                                |
| `JpaRepository`              | Everything from above **plus JPA-specific features** like `flush()`, batch operations, and better integration with Hibernate |

```java
/* -----CrudRepository----- */
public interface UserRepo extends CrudRepository<User, Long> {}

// Provides
// save(), findById(), deleteById()

/* -----PagingAndSortingRepository----- */
public interface UserRepo extends PagingAndSortingRepository<User, Long> {}

// Adds
// findAll(Pageable pageable);

/* -----JpaRepository (Most used)----- */
public interface UserRepo extends JpaRepository<User, Long> {}

// Adds
// flush(), saveAndFlush(), deleteInBatch()
```

🔹 flush()

save() → entity stored in persistence context
flush() → SQL executed immediately

When flush() is useful

**Case 1: DB constraint validation NOW**

```java
save(user);
flush();   // check unique constraint now
```

If email is duplicate → exception thrown here, not at commit.

**Case 2: Need DB-generated values immediately**

```java
save(order);
flush();
Long id = order.getId();
```

(Some DBs need flush to generate ID.)

> `flush` forces SQL execution but does not commit the transaction.

**flush vs commit**

- `Flush` sends SQL to the database, while `commit` permanently saves it.
- `Flush` can be rolled back; `commit` cannot.

```
save()  → memory
flush() → DB (temporary)
commit  → DB (permanent)
```

🔹 deleteInBatch()

- Deletes multiple records in one SQL query
- Much faster than deleting one by one

```java
userRepository.deleteInBatch(users);
```

```sql
DELETE FROM users WHERE id IN (1,2,3);
```

> deleteInBatch improves performance by executing a single delete query.

🤔❓ What is EntityManager

**EntityManager** is the core JPA interface that:

- Manages entities
- Talks directly to the database
- Tracks entity changes

> Spring Data JPA internally uses EntityManager.

🤔❓ Difference between @Embeddable and @Embedded

They help you group related fields into a reusable value object
➡️ without creating a separate table

Example:

- Address = street, city, pincode
- You don’t want an `ADDRESS` table
- You want those fields inside the `USER` table

```java
@Embeddable
public class Address {

    private String street;
    private String city;
    private String pincode;
}
```

✔ This class cannot exist on its own in DB
✔ It has no ID
✔ Think of it as a group of columns

```java
@Entity
public class User {

    @Id
    @GeneratedValue
    private Long id;

    private String name;

    @Embedded
    private Address address;
}
```

❌ No separate address table
✅ Columns are flattened into the entity table
| id | name | street | city | pincode |
| -- | ---- | ------ | ---- | ------- |
| 1 | Dev | MG Rd | BLR | 560001 |

```sql
INSERT INTO user (id, name, street, city, pincode)
VALUES (1, 'Dev', 'MG Rd', 'BLR', '560001');
```

🤔❓ When Should You Use DTO?

Use DTO when:

- You don’t want to expose entity directly
- You need **only selected fields**
- API response should be lightweight

🔹 Why we should NOT expose entity directly?

    Exposing entity causes:

    ❌ Security risk (sensitive fields exposed)
    ❌ Lazy loading issues (LazyInitializationException)
    ❌ Tight coupling between DB & API
    ❌ Accidental updates to DB fields

---

### ❓ What is the **N+1 Problem**? How to solve it?

### 📝 Answer

❌ Problem

When fetching a parent entity, **Hibernate fires 1 query for parent + N queries for children**.

```java
List<Order> orders = orderRepository.findAll();
for (Order o : orders) {
    o.getItems().size(); // triggers extra queries
}
```

🤔❓ What happens in DB?

```sql
1 query → fetch orders
N queries → fetch items for each order
```

❌ Performance killer

✅ Solutions

1. Fetch Join (Best & Most Used)

```java
@Query("SELECT o FROM Order o JOIN FETCH o.items")
List<Order> findAllWithItems();
```

2. EntityGraph

```java
@EntityGraph(attributePaths = "items")
List<Order> findAll();
```

3. Batch Fetching

```properties
hibernate.default_batch_fetch_size=10
```

> _N+1 occurs due to lazy loading. I solve it using fetch joins or EntityGraph._

---

### ❓ JPA vs Hibernate

### 📝 Answer

| JPA            | Hibernate                   |
| -------------- | --------------------------- |
| Specification  | Implementation              |
| Interface      | Concrete ORM                |
| Defines API    | Executes SQL                |
| Vendor neutral | Hibernate specific features |

👉 Simple answer:
JPA is a contract. Hibernate is an implementation.

---

### ❓ Is @JoinColumn mandatory? If not, what happens if we don’t use it?

### 📝 Answer

Because relationship must map to a **foreign key column** in DB.

```java
@ManyToOne
@JoinColumn(name="order_id")
private Order order;
```

Without `@JoinColumn`:

- Hibernate auto-generates column
- But you lose control over column name & FK behavior

It tells:

- Which column
- Nullable?
- Unique?
- FK constraint?

---

### ❓ JPQL vs Native Query

### 📝 Answer

| Feature        | JPQL         | Native Query     |
| -------------- | ------------ | ---------------- |
| Works on       | Entity names | Table names      |
| DB Independent | ✅ Yes       | ❌ No            |
| Performance    | Good         | Sometimes faster |
| Portability    | High         | Low              |

**JPQL Example**

```java
@Query("SELECT e FROM Employee e WHERE e.salary > :salary")
List<Employee> findHighPaid(@Param("salary") double salary);
```

**Native Query Example**

```java
@Query(value = "SELECT * FROM employee WHERE salary > ?", nativeQuery = true)
List<Employee> findHighPaid(double salary);
```

- ✅ **JPQL** → 90% of cases
- ✅ **Native** → Complex joins, DB-specific features

> _JPQL is preferred for portability; native queries only when JPQL is insufficient._

---

### ❓ First-Level vs Second-Level Cache

### 📝 Answer

**First-Level Cache**

- Enabled by default
- **Scope: Session / EntityManager**
- Cannot be turned off

```java
Employee e1 = em.find(Employee.class, 1);
Employee e2 = em.find(Employee.class, 1);
// DB hit happens only once
```

**Second-Level Cache**

- Optional
- **Shared across sessions**
- Requires configuration (Ehcache, Hazelcast)

```properties
spring.jpa.properties.hibernate.cache.use_second_level_cache=true
```

**Comparison**

| Cache        | Scope       | Default |
| ------------ | ----------- | ------- |
| First-level  | Session     | ✅ Yes  |
| Second-level | Application | ❌ No   |

> _First-level cache is mandatory and session-scoped; second-level cache is optional and shared._

---

### ❓ Spring JPA Inheritance

### 📝 Answer

Mapping **Java inheritance** to **database tables**.

1️⃣ **SINGLE_TABLE (Most Used)**

```java
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type")
class Vehicle { }

@Entity
class Car extends Vehicle { }
```

✅ Fast
❌ Nullable columns

2️⃣ **JOINED**

```java
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
class Vehicle { }
```

✅ Normalized DB
❌ Slower joins

3️⃣ **TABLE_PER_CLASS**

```java
@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
class Vehicle { }
```

❌ Poor performance
❌ Rarely used
