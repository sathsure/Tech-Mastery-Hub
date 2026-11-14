# Kafka & RabbitMQ — Code Snippets

> Code interviewers ask you to write from memory. Short, commented, ready to explain.

### 1. Kafka producer (Spring)
```java
@Service
@RequiredArgsConstructor
class OrderEvents {
  private final KafkaTemplate<String, OrderPlaced> kafka;

  void publish(OrderPlaced event) {
    // key = orderId → all events of one order go to the same partition (kept in order)
    kafka.send("orders", event.orderId(), event);
  }
}
```
```yaml
spring.kafka.producer:
  acks: all
  properties:
    enable.idempotence: true      # no duplicates from producer retries
```

### 2. Kafka consumer with manual commit
```java
@KafkaListener(topics = "orders", groupId = "billing")
void onOrder(OrderPlaced event, Acknowledgment ack) {
  if (!processed.exists(event.eventId())) {     // idempotent: skip duplicates
    billing.charge(event);
    processed.save(event.eventId());
  }
  ack.acknowledge();                             // commit only after success
}
// spring.kafka.listener.ack-mode: manual
```

### 3. Retry + dead letter topic (Spring Kafka)
```java
@Bean
DefaultErrorHandler errorHandler(KafkaTemplate<Object, Object> template) {
  var recoverer = new DeadLetterPublishingRecoverer(template);   // sends to "<topic>.DLT"
  return new DefaultErrorHandler(recoverer, new ExponentialBackOff(1000, 2));
}
```

### 4. RabbitMQ: exchange, queue, binding
```java
@Bean TopicExchange orders() { return new TopicExchange("orders"); }
@Bean Queue emailQueue() {
  return QueueBuilder.durable("email.order-placed")
      .withArgument("x-dead-letter-exchange", "orders.dlx")      // failed messages go here
      .build();
}
@Bean Binding bind() { return BindingBuilder.bind(emailQueue()).to(orders()).with("order.placed"); }

rabbitTemplate.convertAndSend("orders", "order.placed", event);

@RabbitListener(queues = "email.order-placed")
void sendEmail(OrderPlaced event) { mailer.send(event); }
```

### 5. Transactional outbox
```java
@Transactional
public void placeOrder(Order order) {
  orders.save(order);
  outbox.save(new OutboxEvent("orders", order.getId(), toJson(order)));   // same DB transaction
}

@Scheduled(fixedDelay = 1000)
public void relay() {
  for (OutboxEvent e : outbox.findUnsent(100)) {
    kafka.send(e.topic(), e.key(), e.payload());
    e.markSent();                                   // or delete; consumers stay idempotent
  }
}
```
