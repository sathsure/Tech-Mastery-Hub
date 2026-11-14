# Spring Boot — Quick Traps

> Tricky spots interviewers love: what goes wrong, a tiny example, and the right answer.

### 1. `@Transactional` calling itself
- ❌ `this.saveOrder()` inside the same class → no transaction.
- ✅ Spring adds transactions through a proxy; internal calls skip it. Move the method to another bean.

### 2. `@Transactional` on private methods
- ❌ `@Transactional private void save()` → ignored.
- ✅ Put it on public methods.

### 3. Checked exceptions don't roll back
- ❌ Throwing `IOException` and expecting a rollback.
- ✅ Only unchecked exceptions roll back by default. Use `@Transactional(rollbackFor = Exception.class)`.

### 4. State in a singleton bean
- ❌ `private User currentUser;` in a `@Service` → users see each other's data.
- ✅ Beans are shared by all requests. Keep them stateless.

### 5. Field injection
- ❌ `@Autowired private Repo repo;` — hidden dependency, hard to test.
- ✅ Constructor injection with `final` fields.

### 6. N+1 queries
- ❌ Loading 100 orders, then `order.getItems()` each → 101 queries.
- ✅ `JOIN FETCH`, `@EntityGraph`, or batch fetching.

### 7. `LazyInitializationException`
- ❌ Reading a lazy collection after the transaction ended (e.g. in the controller).
- ✅ Load what you need in the service (fetch join), and return DTOs.

### 8. Bean not found
- ❌ `@Service` class in a package outside the main application's package.
- ✅ Component scanning starts at the `@SpringBootApplication` package and goes down.

### 9. Two beans of the same type
- ❌ `NoUniqueBeanDefinitionException`
- ✅ Mark one `@Primary`, or pick with `@Qualifier("name")`.

### 10. Prototype inside a singleton
- ❌ Expecting a new prototype bean on every call — it's created once.
- ✅ Use `ObjectProvider<T>` to get a fresh one each time.

### 11. Returning entities from APIs
- ❌ Returning a JPA entity → endless JSON loops, leaked fields, lazy errors.
- ✅ Return DTOs.

### 12. `@RequestParam` vs `@PathVariable`
- ❌ Mixing them up.
- ✅ `/users/5` → `@PathVariable`; `/users?page=2` → `@RequestParam`.
