# Spring Boot — Code Snippets

> Code interviewers ask you to write from memory. Short, commented, ready to explain.

### 1. REST controller with validation
```java
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
class UserController {
  private final UserService service;

  @GetMapping("/{id}")
  UserDto get(@PathVariable Long id) { return service.get(id); }

  @GetMapping
  Page<UserDto> list(@RequestParam(defaultValue = "0") int page) { return service.list(PageRequest.of(page, 20)); }

  @PostMapping
  ResponseEntity<UserDto> create(@Valid @RequestBody CreateUserRequest req) {
    UserDto saved = service.create(req);
    return ResponseEntity.created(URI.create("/api/users/" + saved.id())).body(saved);
  }
}

record CreateUserRequest(@NotBlank String name, @Email @NotBlank String email) {}
```

### 2. Global error handling
```java
@RestControllerAdvice
class ApiErrors {
  @ExceptionHandler(NotFoundException.class)
  ProblemDetail notFound(NotFoundException ex) {
    return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
  }
  @ExceptionHandler(MethodArgumentNotValidException.class)
  ProblemDetail invalid(MethodArgumentNotValidException ex) {
    ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.UNPROCESSABLE_ENTITY);
    pd.setProperty("errors", ex.getFieldErrors().stream().map(e -> e.getField() + ": " + e.getDefaultMessage()).toList());
    return pd;
  }
}
```

### 3. Service with a transaction
```java
@Service
@RequiredArgsConstructor
class TransferService {
  private final AccountRepository accounts;

  @Transactional
  public void transfer(long from, long to, BigDecimal amount) {
    Account a = accounts.findById(from).orElseThrow();
    Account b = accounts.findById(to).orElseThrow();
    a.withdraw(amount);          // throws if not enough money → whole transfer rolls back
    b.deposit(amount);
  }
}
```

### 4. Entity + repository
```java
@Entity
class Order {
  @Id @GeneratedValue Long id;
  @ManyToOne(fetch = FetchType.LAZY) Customer customer;
  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL) List<OrderItem> items = new ArrayList<>();
  @Version Long version;                          // optimistic locking
}

interface OrderRepository extends JpaRepository<Order, Long> {
  List<Order> findByCustomerIdAndStatus(Long customerId, Status status);

  @Query("select o from Order o join fetch o.items where o.id = :id")   // avoids N+1
  Optional<Order> findWithItems(Long id);
}
```

### 5. Type-safe configuration
```java
@ConfigurationProperties(prefix = "payment")
record PaymentProps(String baseUrl, Duration timeout, int retries) {}
// application.yml:  payment: { base-url: https://pay.example.com, timeout: 2s, retries: 3 }
// enable with @ConfigurationPropertiesScan on the main class
```

### 6. Calling another API with RestClient
```java
@Bean RestClient paymentClient(PaymentProps p) {
  return RestClient.builder().baseUrl(p.baseUrl()).build();
}
Receipt r = paymentClient.post().uri("/charges").body(charge).retrieve().body(Receipt.class);
```

### 7. Scheduled job and async method
```java
@Scheduled(cron = "0 0 2 * * *")          // every day at 02:00
void nightlyCleanup() { … }

@Async
CompletableFuture<Report> build(long id) { return CompletableFuture.completedFuture(…); }
// enable with @EnableScheduling and @EnableAsync
```

### 8. Caching
```java
@Cacheable(value = "products", key = "#id")
public Product get(long id) { return repo.findById(id).orElseThrow(); }

@CacheEvict(value = "products", key = "#p.id")
public Product update(Product p) { return repo.save(p); }
```
