# SOLID & Design Patterns — Code Snippets

> The patterns interviewers ask you to code, in Java.

### 1. Builder
```java
public class Pizza {
  private final String size; private final boolean cheese; private final List<String> toppings;
  private Pizza(Builder b) { size = b.size; cheese = b.cheese; toppings = List.copyOf(b.toppings); }

  public static Builder builder(String size) { return new Builder(size); }
  public static class Builder {
    private final String size; private boolean cheese; private final List<String> toppings = new ArrayList<>();
    private Builder(String size) { this.size = size; }
    public Builder cheese() { cheese = true; return this; }
    public Builder topping(String t) { toppings.add(t); return this; }
    public Pizza build() { return new Pizza(this); }
  }
}
Pizza p = Pizza.builder("L").cheese().topping("olives").build();
```

### 2. Factory
```java
interface Notifier { void send(String to, String msg); }
class EmailNotifier implements Notifier { public void send(String to, String msg) { … } }
class SmsNotifier implements Notifier { public void send(String to, String msg) { … } }

class NotifierFactory {
  static Notifier of(String channel) {
    return switch (channel) {
      case "email" -> new EmailNotifier();
      case "sms" -> new SmsNotifier();
      default -> throw new IllegalArgumentException("Unknown channel " + channel);
    };
  }
}
```

### 3. Strategy (no if/else)
```java
interface DiscountStrategy { BigDecimal apply(BigDecimal amount); }

Map<String, DiscountStrategy> strategies = Map.of(
  "NONE", amount -> amount,
  "FESTIVE", amount -> amount.multiply(new BigDecimal("0.90")),
  "FLAT100", amount -> amount.subtract(new BigDecimal("100")).max(BigDecimal.ZERO));

BigDecimal total = strategies.getOrDefault(code, strategies.get("NONE")).apply(cartTotal);
// In Spring: inject Map<String, DiscountStrategy> and every strategy bean is collected by name.
```

### 4. Observer
```java
interface OrderListener { void onPlaced(Order o); }

class OrderService {
  private final List<OrderListener> listeners = new CopyOnWriteArrayList<>();
  void subscribe(OrderListener l) { listeners.add(l); }
  void place(Order o) { save(o); listeners.forEach(l -> l.onPlaced(o)); }
}
// Spring: publisher.publishEvent(new OrderPlaced(o)) + @EventListener
```

### 5. Decorator
```java
interface DataSource { String read(); }
class FileSource implements DataSource { public String read() { return "data"; } }
class CompressedSource implements DataSource {
  private final DataSource inner;
  CompressedSource(DataSource inner) { this.inner = inner; }
  public String read() { return decompress(inner.read()); }     // adds behaviour, same interface
}
DataSource src = new CompressedSource(new FileSource());
```

### 6. Adapter
```java
// Our code expects PaymentGateway; the vendor SDK has a different API.
interface PaymentGateway { Receipt pay(BigDecimal amount); }
class VendorPayAdapter implements PaymentGateway {
  private final VendorSdk sdk;
  VendorPayAdapter(VendorSdk sdk) { this.sdk = sdk; }
  public Receipt pay(BigDecimal amount) {
    VendorResult r = sdk.makeCharge(amount.movePointRight(2).longValueExact());   // rupees → paise
    return new Receipt(r.id(), r.ok());
  }
}
```

### 7. Template method
```java
abstract class ReportJob {
  public final void run() { var data = load(); var rows = transform(data); export(rows); }   // fixed steps
  protected abstract List<Row> load();
  protected List<Row> transform(List<Row> rows) { return rows; }   // optional hook
  protected abstract void export(List<Row> rows);
}
```

### 8. Chain of responsibility
```java
abstract class Handler {
  private Handler next;
  Handler then(Handler next) { this.next = next; return next; }
  void handle(Request r) { if (next != null) next.handle(r); }
}
class AuthCheck extends Handler { void handle(Request r) { if (!r.authed()) throw new SecurityException(); super.handle(r); } }
class RateCheck extends Handler { void handle(Request r) { limiter.check(r.ip()); super.handle(r); } }

Handler chain = new AuthCheck();
chain.then(new RateCheck());
chain.handle(request);
```
