## 1️⃣ OOP & Design Thinking

### ❓ Why OOP was introduced?

### 📝 Answer

Imagine writing a **bank application**.

```java
double balance = 0;

void deposit(double amount) {
    balance += amount;
}

void withdraw(double amount) {
    balance -= amount;
}
```

As the application grows:

- Another developer adds a method
- Someone directly modifies `balance`
- A bug allows negative balance
- No single place controls the rules

```java
balance = -1000; // accidentally or intentionally
```

❌ **The real problem**:
There is **no protection**, **no ownership**, and **no control over change**.

This is the problem OOP was created to solve.

> The core idea of OOP is to **Put data and the logic together, and control access.**

✅ The solution applied to the same problem (OOP style)

```java
class BankAccount {

    private double balance;

    public void deposit(double amount) {
        if (amount <= 0) return;
        balance += amount;
    }

    public void withdraw(double amount) {
        if (amount > balance) return;
        balance -= amount;
    }

    public double getBalance() {
        return balance;
    }
}
```

- `balance` is **private**
- Only this class can modify it
- Rules are enforced in **one place**

This is **not about syntax**. This is about **controlling damage and change**.

👉 **OOP is NOT one thing — it has 4 tools (pillars)**

Each pillar exists to solve a **specific kind of problem**.

1. **Encapsulation — “Protect the inside”**

Encapsulation is the practice of controlling how data is accessed and modified, so that an object always remains in a valid state.

```java
class BankAccount {
    private double balance;

    public void deposit(double amount) {
        if (amount <= 0) return;
        balance += amount;
    }

    public void withdraw(double amount) {
        if (amount > balance) return;
        balance -= amount;
    }
}
```

✅ This is true encapsulation because:

- Balance cannot be negative
- Balance cannot be changed arbitrarily
- Object enforces business rules
- State changes match real-world actions

> Encapsulation is not just about hiding variables and exposing methods;
> it is about protecting an object’s rules so it always stays in a valid state.

2. **Abstraction — “Hide what can change”**

Abstraction means exposing only what the system does, while hiding how it does it, especially for parts that may change.

Now imagine:

- Today you save balance in memory
- Tomorrow you save it in a database
- Later, maybe in a remote service

You don’t want the rest of the system to change every time.

```java
interface AccountService {
    void deposit(double amount);
    void withdraw(double amount);
    double getBalance();
}
```

```java
class BankAccount implements AccountService {
    // implementation here
}
```

✅ This is real abstraction, because

- Interface represents what the system does
- Implementation hides how it is done
- Callers depend on behavior, not details

> Abstraction is not about hiding data;
> it is about hiding change by exposing only stable behavior.

3. **Inheritance — “Reuse with danger”**

Inheritance models an “is-a” relationship by reusing behavior from a parent, but at the cost of tight and permanent coupling.

```java
class Account {
    protected double balance;

    public void withdraw(double amount) {
        if (amount > balance) return;   // prevent negative balance
        balance -= amount;
    }
}

class SavingsAccount extends Account {

    private int withdrawalsThisMonth = 0;

    @Override
    public void withdraw(double amount) {

        // NEW RULE (SavingsAccount specific): Only 3 withdrawals allowed per month
        if (withdrawalsThisMonth >= 3) {
            return; // silently refuse ❌
        }
        super.withdraw(amount);
        withdrawalsThisMonth++;
    }
}

Account acc = new SavingsAccount();
acc.balance = 1000;

// First 3 withdrawals work
acc.withdraw(100);
acc.withdraw(100);
acc.withdraw(100);

// Fourth withdrawal ❌
acc.withdraw(100);   // balance SHOULD become 600, but NOTHING happens

```

❌ **Problem**

- Parent cannot predict child rules
- Every new child risks breaking old code

> Inheritance fails when a child adds rules that the parent never promised to support.

4. **Composition — “Build with parts”**

Composition means building objects using other objects, instead of inheriting from them.

Both inheritance and composition try to achieve:

- Code reuse
- Shared behavior

✅ But composition does it without tight coupling.

```java
class Balance {
    private double amount;

    public void add(double value) {
        amount += value;
    }

    public void subtract(double value) {
        if (value > amount) return;
        amount -= value;
    }

    public double getAmount() {
        return amount;
    }
}

class BankAccount {

    // BankAccount DOES NOT extend Balance, It USES Balance as a part
    private Balance balance = new Balance();

    public void deposit(double amount) {
        balance.add(amount);
    }

    public void withdraw(double amount) {
        balance.subtract(amount);
    }
}
```

What composition solves

- Flexible behavior
- Replaceable parts
- Less coupling

> **Prefer composition over inheritance** unless the relationship is truly “is-a”.

![CompositionVsInheritance Image](/src/assets/backend/composition-vs-inheritance.png)

🤔❓🔹 What is a Pointer?

- A variable that **stores the memory address** of another variable
- Common in **C / C++**

```c
int x = 10;
int *p = &x;   // p holds address of x
```

🤔❓🔹 Why Java Does NOT use Pointers?

Java **intentionally hides pointers** and uses **references** instead.

| Reason                  | Explanation                       |
| ----------------------- | --------------------------------- |
| 🔐 Security             | Prevents direct memory access     |
| 🧹 Automatic GC         | Garbage Collector manages memory  |
| 🌍 Platform-independent | No hardware-level memory handling |

```java
User u = new User(); // u is a reference, not a pointer
```

> Java does not support pointers to ensure security, prevent memory corruption, and enable automatic garbage collection while still allowing object references.

---

### ❓ How do you design a system where the same operation behaves differently based on the object type, without changing the calling code?

### 📝 Answer

This is achieved using polymorphism, where different objects respond to the same method call in their own way, allowing behavior to vary without modifying the caller.

Instead of writing if/else or switch logic to decide behavior, we let objects decide their own behavior.

> Polymorphism means “one name, many behaviors.”

Java supports this idea in two different ways:

- Method Overloading → compile-time polymorphism
- Method Overriding → runtime polymorphism

**Method Overriding (Runtime polymorphism)**

> Polymorphism differentiates behavior based on the object’s runtime type, through a shared abstraction.

💻 **Code Example**

```java
interface Payment {
    void pay(double amount);
}
```

```java
class CreditCardPayment implements Payment {
    public void pay(double amount) {
        System.out.println("Paid " + amount + " using Credit Card");
    }
}

class UpiPayment implements Payment {
    public void pay(double amount) {
        System.out.println("Paid " + amount + " using UPI");
    }
}

class CheckoutService {
    public void checkout(Payment payment, double amount) {
        payment.pay(amount); // polymorphism in action
    }
}
```

**Method Overloading (Compile-time polymorphism)**

> Same method name, different parameter lists, in the same class.

💻 **Code Example**

```java
class Calculator {

    int add(int a, int b) {
        return a + b;
    }

    int add(int a, int b, int c) {
        return a + b + c;
    }

    double add(double a, double b) {
        return a + b;
    }
}
```

```java
Calculator calc = new Calculator();

calc.add(2, 3);        // calls add(int, int)
calc.add(2, 3, 4);     // calls add(int, int, int)
calc.add(2.5, 3.5);    // calls add(double, double)
```

1️⃣ What is a method signature?

A method signature is the method name + parameter types (and order).

⚠️ Return type is NOT part of the method signature.

```java
class Example {

    int getValue() {
        return 10;
    }

    double getValue() {   // ❌ Compile-time error, as method name and parameters are identical
        return 10.5;
    }

    int getValue(int multiplier) { // ✅ Method signature differs by parameter list, not by return type
        return 10 * multiplier;
    }
}
```

2️⃣ Which method gets called when the reference type and object type are different?

The method of the object type (runtime type) is called, not the reference type.
This is called runtime polymorphism / dynamic method dispatch.

- `Reference type` is the type of the variable used to refer to an object.
- `Object type` is the actual class of the object created in memory using new.

```java
Animal a = new Dog(); // Animal - Reference Type,  Dog - Object Type
a.sound(); // a reference points to a Dog object, at runtime → calls Dog.sound()
```

3️⃣ Why is using `instanceof` considered a design smell?

❌ Problem with instanceof

Using instanceof usually means **the polymorphism is not used properly**

```java
class Animal {}

class Dog extends Animal {
    void bark() {
        System.out.println("Bark");
    }
}

class Cat extends Animal {
    void meow() {
        System.out.println("Meow");
    }
}

public class Test {
    static void makeSound(Animal a) {
        if (a instanceof Dog) { // Too many if-else checks, Code becomes fragile and messy
            ((Dog) a).bark();
        } else if (a instanceof Cat) {
            ((Cat) a).meow();
        }
    }
}

```

✅ Better Design (Polymorphism)

```java
class Animal {
    void sound() {}
}

class Dog extends Animal {
    @Override
    void sound() {
        System.out.println("Bark");
    }
}

class Cat extends Animal {
    @Override
    void sound() {
        System.out.println("Meow");
    }
}

public class Test {
    static void makeSound(Animal a) {
        a.sound();  // polymorphism
    }
}
```

> If you’re using instanceof, you’re probably missing polymorphism.

4️⃣ Why doesn’t Java support polymorphism for static methods?

Static methods belong to the class, not the object.
Polymorphism works only with objects, not classes.

```java
class Parent {
    static void show() {
        System.out.println("Parent show");
    }
}

class Child extends Parent {
    static void show() {
        System.out.println("Child show");
    }
}

public class Test {
    public static void main(String[] args) {
        Parent p = new Child();
        p.show(); // Output: Parent show
    }
}
```

Because static methods are resolved at compile time using the reference type, not the object type.
This is called **method hiding**, not method overriding.

🧠 **How Java decides (important rule)**

| Member type     | Decided using  | Time         |
| --------------- | -------------- | ------------ |
| Instance method | Object type    | Runtime      |
| Static method   | Reference type | Compile-time |
| Variables       | Reference type | Compile-time |

So Java literally treats this as:

```java
Parent.show();   // decided at compile time
```

If you add `@Override`:

```java
class Child extends Parent {
    @Override
    static void show() { } // ❌ compile-time error
}
```

Java rejects it because:

> **Static methods cannot be overridden**

🌱 Why Static methods cannot be overridden?

Because, Static methods cannot be overridden because overriding requires runtime (object-based) dispatch, while static methods are bound at compile time and belong to the class, not the object.

🌱 Why do we need class and object?

**Class** → A class is a definition that describes what variables and methods something will have.
**Object** → An object is a real instance created from the class that holds actual data and can use those methods.

```java
class Car {
    String color;
    int speed;

    void drive() {
        System.out.println("Car is driving");
    }

    static void showTrafficRule() {
        System.out.println("All cars must stop at a red signal");
    }
}
```

Class → `Car` describes what a car has and does

```java
Car c1 = new Car();
Car c2 = new Car();

Car.showTrafficRule();  // same method for all cars
```

Object → c1 and c2 are two different cars. Each has their own color, speed and can drive() independently

📌 Objects exist to represent individuality

Hence, **Static methods** exists once per class (Meaning c1.showTrafficRule() and c2.showTrafficRule() point to the same memory) and shared by all objects.

5️⃣ Why doesn’t polymorphism work for variables?

Variables are resolved at compile time, not runtime.

```java
class Parent {
    int x = 10;
}

class Child extends Parent {
    int x = 20;
}

public class Test {
    public static void main(String[] args) {
        Parent p = new Child();
        System.out.println(p.x); // Output: 10
    }
}
```

Variable access depends on reference type. Java does not override variables. This is called **variable hiding**.

---

### ❓ How do you apply OOP principles in real-world systems?

### 📝 Answer

- Where have you used abstraction effectively?
  1. When code depends on the interface, not the implementation.
  2. Loose coupling between two classes

- When does inheritance become harmful?
  1. Due to Deep Hierarchies
  2. Due to Tight Coupling

- When do you prefer composition over inheritance?
  1. To achieve flexible behavior
  2. When behavior must change at runtime

- Can you give an example where strict OOP caused problems?
  1. Deep inheritance hierarchies that are hard to understand.
  2. Breaking simple logic into many interfaces and classes when they aren’t needed.

---

### ❓ Have you ever violated OOP principles intentionally?

### 📝 Answer

Yes, Skipped abstractions to keep code simple and readable

```java
class FileCleaner {
    void cleanTempFiles() {
        // direct logic, no interfaces or layers
    }
}
```

> Strict OOP wasn’t needed; simplicity was the better design choice.

---

### ❓ What design principles do you follow while writing Java code?

### 📝 Answer

Design principles while writing Java code:

- SOLID principles (especially SRP & DIP)
- Prefer composition over inheritance
- Program to interfaces, not implementations
- Keep classes small and focused
- Avoid over-engineering
- Write readable, maintainable code
- Design for change, not perfection

> Clean, simple, and flexible code over “perfect” architecture.

1️⃣ What is the SOLID principle?

SOLID is a set of 5 object-oriented design principles that help write clean, maintainable, and scalable code:

- **SRP – Single Responsibility Principle**
- **OCP – Open/Closed Principle**
- **LSP – Liskov Substitution Principle**
- **ISP – Interface Segregation Principle**
- **DIP – Dependency Inversion Principle**

1. **SRP – Single Responsibility Principle**

Definition: A class should have only one reason to change.

❌ Violation (multiple responsibilities)

```java
class UserService {
    void saveUser() {}
    void sendEmail() {}
}
```

The class UserService has more than one responsibility:

- User persistence (saveUser)
- Email communication (sendEmail)

The class can turn into a **God class** (A class that does too much and knows too much in the system)

✔️ Correct (separate responsibilities)

```java
class UserService {
    void saveUser() {}
}

class EmailService {
    void sendEmail() {}
}
```

What happens is:

- Each class has one clear purpose
- Changes are isolated
- Code is easier to understand and safer to modify

2. **OCP – Open/Closed Principle**

Definition: Classes should be open for extension, closed for modification.

❌ Violation (changing existing code)

```java
class Payment {
    void pay(String type) {
        if (type.equals("CARD")) {}
        if (type.equals("UPI")) {}
    }
}
```

Every time adding a new payment type:

- existing code will be modified
- Risk of introducing bugs
- Create a growing if-else chain

✔️ Correct (extend via abstraction)

```java
interface Payment {
    void pay();
}

class CardPayment implements Payment {
    public void pay() {}
}
```

What happens is:

- Existing code stays untouched
- New behavior is added by adding new classes
- Old, tested code remains stable

3. **LSP – Liskov Substitution Principle**

Definition: Subclasses must be usable without breaking parent behavior.

❌ Violation (unexpected behavior)

```java
class Bird {
    void fly() {}
}

class Ostrich extends Bird {
    void fly() { throw new RuntimeException(); }
}
```

The problem is:

- It breaks the expectation set by Bird
- Causes unexpected behavior at runtime

✔️ Correct (proper hierarchy)

```java
interface Bird {}

interface FlyingBird extends Bird {
    void fly();
}

class Sparrow implements FlyingBird {
    public void fly() {}
}
class Ostrich implements Bird {
    // no fly()
}
```

What happens is:

- Only birds that can actually fly implement FlyingBird
- Ostrich is no longer forced to implement invalid behavior

4. **ISP – Interface Segregation Principle**

Definition: Clients should not be forced to implement unused methods.

❌ Violation (fat interface)

```java
interface Machine {
    void print();
    void scan();
}

class SimplePrinter implements Machine {
    public void print() {}
    public void scan() {} // not needed, but forced
}
```

The Problem is:

- Clients (classes) are forced to implement methods they don’t need.

✔️ Correct (small interfaces)

```java
interface Printer {
    void print();
}

interface Scanner {
    void scan();
}
```

What happens is:

- A class implements only what it uses
- No unused or dummy methods

5. **DIP – Dependency Inversion Principle**

Definition: Depend on abstractions, not concrete classes.

❌ Violation (tight coupling)

```java
class OrderService {
    MySQLDatabase db = new MySQLDatabase();
}
```

The problem is:

- OrderService (high-level business logic) directly depends on MySQLDatabase (low-level detail)
- The class is tightly coupled to one specific database
- If you change the database (MySQL → MongoDB), you must change OrderService

✔️ Correct (loose coupling)

```java
interface Database {}

class OrderService {
    Database db;
    OrderService(Database db) {
        this.db = db;
    }
}
```

What happens is:

- Dependency is inverted → OrderService depends on Database (abstraction)
- Loose coupling → OrderService does not care which database is used

2️⃣ How do SOLID principles help in large systems?

1. Reduce tight coupling between components
2. Make code easier to extend without breaking existing logic
3. Improve readability and maintainability
4. Enable parallel team development
5. Simplify testing and refactoring

> 👉 They control complexity as the system grows.

3️⃣ Which SOLID principle is most commonly violated?

SRP (Single Responsibility Principle)

- **Classes become “God classes”** - A single class grows too large and controls too much logic, making it hard to understand and maintain.
- **One class handles multiple concerns** - A class is responsible for more than one job (e.g., business logic, validation, logging, persistence).
- **Small changes cause unexpected side effects** - Modifying one part of the class accidentally breaks other unrelated functionality.

> 👉 SRP violations are the root cause of many design problems.

---

## 2️⃣ Core Java

### ❓ Difference between == and equals()?

### 📝 Answer

`==` compares references **(memory addresses)**.
`equals()` compares object content **(logical equality)**.

```java
String a = new String("Java");
String b = new String("Java");

System.out.println(a == b);      // false (different memory)
System.out.println(a.equals(b)); // true  (same content)
```

✔ Always use `equals()` for object comparison
✔ Use `==` only when reference equality is intended

---

### ❓ String vs StringBuilder vs StringBuffer?

### 📝 Answer

| Feature         | String                     | StringBuilder               | StringBuffer                |
| --------------- | -------------------------- | --------------------------- | --------------------------- |
| Mutability      | ❌ Immutable               | ✅ Mutable                  | ✅ Mutable                  |
| Thread Safe     | ✅ Yes                     | ❌ No                       | ✅ Yes                      |
| Performance     | ❌ Slow                    | 🚀 Fastest                  | ⚠️ Slower                   |
| Memory          | ❌ High                    | ✅ Efficient                | ⚠️ Moderate                 |
| Synchronization | ❌ No                      | ❌ No                       | ✅ Yes                      |
| Memory          | String Constant Pool (SCP) | object → Heap & value → SCP | object → Heap & value → SCP |

```java
// BAD: creates multiple objects
String s = "";
for(int i = 0; i < 1000; i++) {
    s = s + i;
}

// GOOD: single object
StringBuilder sb = new StringBuilder();
for(int i = 0; i < 1000; i++) {
    sb.append(i);
}
```

---

### ❓ final vs finally vs finalize?

### 📝 Answer

| Aspect             | `final`                 | `finally`                     | `finalize()`                |
| ------------------ | ----------------------- | ----------------------------- | --------------------------- |
| Category           | Keyword                 | Block                         | Method                      |
| Applies To         | Variable, Method, Class | `try-catch`                   | Object (GC)                 |
| When Executed      | Compile-time            | Runtime (always)              | GC-time (uncertain)         |
| Core Purpose       | Prevent modification    | Ensure cleanup                | Last-chance cleanup         |
| JVM Guarantee      | ✅ Yes                  | ✅ Yes (except `System.exit`) | ❌ No                       |
| Java Status        | Active & Recommended    | Active & Recommended          | ❌ **Deprecated (Java 9+)** |
| Modern Alternative | Immutability patterns   | try-with-resources            | `AutoCloseable`, `Cleaner`  |

`final`

```java
final int MAX = 10;
// MAX = 20; ❌ Compile-time error
```

`finally`

```java
try {
    int a = 10 / 0;
} catch (Exception e) {
    System.out.println("Error");
} finally {
    System.out.println("Cleanup always runs");
}
```

`finalize()` (❌ Avoid)

```java
class Demo {
    protected void finalize() {
        System.out.println("May or may not run");
    }
}
```

1. What is `AutoCloseable`?

`AutoCloseable` is an interface whose close() method is automatically invoked by the JVM when the resource exits a try-with-resources block.

```java
try (Resource res = new Resource()) {
    // use resource
}
// res.close() is called automatically
```

---

### ❓ What are the design patterns that you used in Java?

### 📝 Answer

- **Creational Design Patterns** - Singleton, Factory, Builder
- **Structural Design Patterns** - Adapter, Decorator, Proxy
- **Behavioral Design Patterns** - Strategy, Observer, Command

1️⃣ **Creational Design Patterns**

👉 **Focus:** _How objects are created_

❓ Problem They Solve

- Too many `new` keywords
- Tight coupling to concrete classes
- Complex object creation logic

✅ Why They Exist

- Control **object creation**
- Improve **flexibility and maintainability**

⭐ Common Creational Patterns

🔹 Singleton

**Singleton** restricts object creation to one instance and provides a global access point to it.

[Singleton Class](#L3202)

🔹 Factory

Factory creates objects by hiding the `new` keyword and returning an interface-based instance, so the caller depends on behavior, not concrete classes.

✔ Used when:

- Multiple implementations exist

```java
interface Shape { void draw(); }

class Circle implements Shape {
    public void draw() { System.out.println("Circle"); }
}

class ShapeFactory {
    static Shape getShape() {
        return new Circle();
    }
}
```

🔹 Builder

**Builder** Pattern is used to create complex objects with many optional fields by building the object step-by-step, making the code readable, flexible, and avoiding constructor overloads.

✔ Used when:

- Constructors become messy

```java
User user = new User.Builder()
                .name("Dev")
                .age(25)
                .build();
```

2️⃣ **Structural Design Patterns**

👉 **Focus:** _How classes and objects are composed_

❓ Problem They Solve

- Rigid class structures
- Difficult to extend functionality
- Interface incompatibility

✅ Why They Exist

- Improve **flexibility**
- Reduce **class explosion**

⭐ Common Structural Patterns

🔹 Adapter

**Adapter** allows two incompatible interfaces to work together by converting one interface into another that the client expects, without changing existing code.

✔ Problem:

- Old code doesn’t match new interface

```java
interface Charger {
    void charge();
}

class OldCharger {
    void plug() {
        System.out.println("Charging");
    }
}

class Adapter implements Charger {
    OldCharger charger = new OldCharger();
    public void charge() {
        charger.plug();
    }
}
```

🔹 Decorator

**Decorator** adds new responsibilities to an object at runtime by wrapping it, without changing the original class or using inheritance.

✔ Problem:

- Inheritance explosion

```java
interface Coffee {
    int cost();
}

class SimpleCoffee implements Coffee {
    public int cost() { return 50; }
}

class MilkDecorator implements Coffee {
    Coffee coffee;
    MilkDecorator(Coffee coffee) {
        this.coffee = coffee;
    }
    public int cost() {
        return coffee.cost() + 10;
    }
}
```

🔹 Proxy

**Proxy** acts as a middle layer that controls, restricts, or enhances access to a real object without changing its code.

✔ Used for:

- Security
- Lazy loading

```java
class ServiceProxy {
    RealService service = new RealService();
    void execute() {
        service.execute();
    }
}
```

3️⃣ **Behavioral Design Patterns**

👉 **Focus:** _How objects interact and communicate_

❓ Problem They Solve

- Hard-coded logic
- Too many `if-else`
- Tight coupling between behaviors

✅ Why They Exist

- Flexible behavior
- Clean separation of responsibility

⭐ Common Behavioral Patterns

🔹 Strategy

**Strategy pattern** lets us define a family of behaviors, put each one in a separate class, and switch the behavior at runtime instead of using if-else or switch.

✔ Replaces `if-else`

```java
interface Payment {
    void pay();
}

class CardPayment implements Payment {
    public void pay() {
        System.out.println("Card Payment");
    }
}
```

🔹 Observer

**Observer Pattern** defines a one-to-many relationship where when one object changes state, all dependent objects are automatically notified and updated, without tight coupling between them.

✔ Used in:

- Events
- UI updates

```java
interface Observer {
    void update();
}
```

🔹 Command

**Command pattern** turns a request into an object so the sender and receiver are decoupled, allowing undo/redo, queuing, and delayed execution.

✔ Used in:

- Undo/Redo
- Queues

```java
interface Command {
    void execute();
}
```

---

### ❓ Checked Exception vs Unchecked Exception

### 📝 Answer

✔ **Checked Exceptions**

- Checked at **compile time**
- Must be **handled** using `try-catch` **or** declared using `throws`

**Common Checked Exceptions (Important ones to remember)**
_(All extend `Exception` but NOT `RuntimeException`)_

- **IOException** – File/network I/O failure
- **SQLException** – Database access error
- **ClassNotFoundException** – Class not found at runtime loading
- **InterruptedException** – Thread interrupted during execution
- **FileNotFoundException** – Not implemented `Cloneable` but `clone()` is called

👉 **You cannot realistically name all checked exceptions**
(There are **100+**, including custom ones)

✔ **Unchecked Exceptions**

- Checked at **runtime**
- Occur due to **programming mistakes**

**Very common ones (must remember):**
_(Extend `RuntimeException`)_

- **NullPointerException** – Accessing object reference that is null
- **ArrayIndexOutOfBoundsException** – Invalid array index
- **ArithmeticException** – Invalid arithmetic (divide by zero)
- **NumberFormatException** – Invalid string to number conversion
- **ClassCastException** – Invalid object casting
- **IllegalArgumentException** → wrong input
- **ConcurrentModificationException** → modify collection during iteration

```java
class MyChecked extends Exception {}
class MyUnchecked extends RuntimeException {}
```

✔ Exception vs Error

| Exception         | Error                 |
| ----------------- | --------------------- |
| Recoverable       | Not recoverable       |
| App-level issues  | JVM-level issues      |
| Should be handled | Should NOT be handled |

- **OutOfMemoryError** – Heap memory exhausted
- **StackOverflowError** – Infinite recursion
- **NoClassDefFoundError** – Class missing at runtime
- **VirtualMachineError** – JVM internal failure

🤔❓ **`throw` vs `throws`**

| throw                                  | throws                        |
| -------------------------------------- | ----------------------------- |
| Used to **explicitly throw** exception | Used to **declare** exception |
| Inside method                          | Method signature              |
| Throws **one exception**               | Can declare **multiple**      |

```java
throw new IOException();
void read() throws IOException {}
```

---

### ❓ What is JNA?

### 📝 Answer

**JNA** (Java Native Access) is a Java library that lets Java code **call native OS libraries (C/C++)** directly without writing JNI code.

JNA Example

Calling a native C function like `strlen()`:

```xml
<dependency>
    <groupId>net.java.dev.jna</groupId>
    <artifactId>jna</artifactId>
    <version>5.13.0</version>
</dependency>
```

```java
// Java Interface

import com.sun.jna.Library;
import com.sun.jna.Native;

public interface CLibrary extends Library {
    CLibrary INSTANCE = Native.load("c", CLibrary.class);

    int strlen(String s);
}

// Usage
public class JnaDemo {
    public static void main(String[] args) {
        int length = CLibrary.INSTANCE.strlen("Hello JNA");
        System.out.println(length);
    }
}
```

🟢 No C code written
🟢 No JNI
🟢 Clean Java interface

---

## 3️⃣ Collections Framework

![Collections Image](/src/assets/backend/java-collections.png)

### ❓ What is the Collections Framework?

### 📝 Answer

Definition: A unified architecture to store, retrieve, and manipulate groups of objects.

Main components:

- Interfaces → List, Set, Queue, Map
- Implementations → ArrayList, HashSet, HashMap, etc.
- Algorithms → sort(), search(), shuffle() (via Collections class)

```java
List<String> list = new ArrayList<>();
list.add("Java");
list.add("Python");
```

### ❓ Difference between `Collection` and `Collections`

### 📝 Answer

| **Collection**                                                   | **Collections**                                                        |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **Interface**                                                    | **Utility class (`final`)**                                            |
| Used to **store and manage a group of objects**                  | Used to **operate on Collection objects**                              |
| Defines **basic operations** like `add()`, `remove()`, `size()`  | Provides **static helper methods** like `sort()`, `reverse()`, `max()` |
| Implemented by classes like `ArrayList`, `HashSet`, `LinkedList` | Not implemented or extended by any class                               |
| Part of the **Collections Framework hierarchy**                  | Not part of the hierarchy; acts as a **helper**                        |
| Allows **polymorphism** (`Collection ref = new ArrayList()`)     | Cannot be instantiated                                                 |

> **`Collection` stores data, `Collections` processes data.**

```java
// Collection
Collection<String> names = new ArrayList<>();
names.add("Java");
names.add("Python");
names.remove("Python");
System.out.println(names); // [Java]

Collection<Integer> numbers = new HashSet<>();
numbers.add(10);
numbers.add(20);
System.out.println(numbers); // [20, 10]

// Collections
List<Integer> list = new ArrayList<>();
list.add(3);
list.add(1);
list.add(2);

Collections.sort(list);
System.out.println(list); // [1, 2, 3]
```

---

### ❓ Difference between `List`, `Set`, and `Map`

### 📝 Answer

| **Feature**    | **List**                                                                                               | **Set**                                                                                                                 | **Map**                                                                                                                            |
| -------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Duplicates** | Allows duplicate elements. The same value can appear multiple times at different indexes.              | Does **not** allow duplicates. If you try to add a duplicate, it is ignored.                                            | Duplicate **keys** are not allowed (new value replaces old), but **values** can be duplicated.                                     |
| **Order**      | Maintains **insertion order**. Elements are stored and retrieved in the same sequence they were added. | Order **depends on implementation**: `HashSet` → no order, `LinkedHashSet` → insertion order, `TreeSet` → sorted order. | Does **not guarantee order** by default (`HashMap`). Some implementations maintain order (`LinkedHashMap`) or sorting (`TreeMap`). |
| **Access**     | Elements are accessed using a **numeric index** (position-based).                                      | No index available; elements are accessed using **iteration or search**.                                                | Values are accessed using a **key**, not by position or index.                                                                     |

```java
Map<Integer, String> map = new HashMap<>();
map.put(1, "Java");
```

---

### ❓ Why does `Map` not extend `Collection`?

### 📝 Answer

`Map` does **not** extend `Collection` because a **Map does not store single elements** — it stores **key–value pairs**.

A `Collection` represents:

```
[element, element, element]
```

A `Map` represents:

```
[key → value, key → value]
```

These are **fundamentally different data models**.

1️⃣ Why `Collection` methods don’t fit `Map`

If `Map` extended `Collection`, it would inherit methods like:

```java
add(E e)
remove(E e)
iterator()
```

But these don’t make sense for key–value pairs:

| Collection Method | Problem for Map                     |
| ----------------- | ----------------------------------- |
| `add(E e)`        | Add **what**? Key? Value? Both?     |
| `remove(E e)`     | Remove by key or by value?          |
| `iterator()`      | Iterate over keys? values? entries? |

Rather than forcing `Map` into `Collection`, Java provides **views**:

```java
map.keySet()      // Collection of keys
map.values()      // Collection of values
map.entrySet()    // Set of key-value pairs
```

---

### ❓ Difference Between `ArrayList` and `LinkedList`

### 📝 Answer

| Feature                  | ArrayList                                            | LinkedList                                         |
| ------------------------ | ---------------------------------------------------- | -------------------------------------------------- |
| Internal structure       | Uses a **dynamic array**                             | Uses a **doubly linked list**                      |
| How data is stored       | Elements are stored **next to each other** in memory | Each element is stored in a **separate node**      |
| Random access (`get(i)`) | ✅ Very fast because index is directly calculated    | ❌ Slow because it must traverse from start/end    |
| Add at end (`add(e)`)    | ✅ Fast (usually)                                    | ✅ Fast                                            |
| Insert/Delete in middle  | ❌ Slow because elements must be shifted             | ⚠️ Faster than ArrayList _after reaching position_ |
| Traversal                | Faster due to better cache locality                  | Slower due to node hopping                         |
| Memory usage             | Less memory (only data)                              | More memory (data + 2 pointers)                    |
| Queue/Deque support      | ❌ Not supported                                     | ✅ Supported (`addFirst`, `removeLast`, etc.)      |

**Queue** - _First In, First Out_, The first element added is the first one removed
**Stack** - _Last In, First Out_, The last element added is removed first
**Deque** - _Double-Ended Queue_, You can add or remove elements **from both front and end**
**Shift** - Remove the **first element**
**Unshift** - Add an element **at the beginning**

1️⃣ Why `LinkedList` supports Queue and Deque?

In Java, the `LinkedList` class already implements the `Queue` and `Deque` interface

```java
Deque<Integer> dq = new LinkedList<>();
```

- `LinkedList` can add/remove elements from **front and end easily**
- It just changes pointers, no shifting needed

**Operation Cost Comparison**

| Operation         | ArrayList | LinkedList | Reason                                                            |
| ----------------- | --------- | ---------- | ----------------------------------------------------------------- |
| Add at end        | ✅ O(1)   | ✅ O(1)    | No shifting                                                       |
| Remove from end   | ✅ O(1)   | ✅ O(1)    | Just remove last                                                  |
| Add at front      | ❌ O(n)   | ✅ O(1)    | Array shifts, list changes pointer                                |
| Remove from front | ❌ O(n)   | ✅ O(1)    | Array shifts, list changes pointer                                |
| `get(index)`      | ✅ O(1)   | ❌ O(n)    | ArrayList → direct index access, LinkedList → must traverse nodes |

2️⃣ Why `ArrayDeque` is often better than `LinkedList`

ArrayDeque is often preferred over LinkedList for `Queue`, `Stack`, and `Deque` operations because it is faster, more memory-efficient, and ArrayDeque uses a resizable **circular array**, not a normal array and not linked nodes.

in simple terms:

- The array is treated like a circle
- Front and rear wrap around when they reach the end
- No elements need to be shifted

_Visual Representation_

```
Start
[ _ , _ , _ , _ , _ ]  → Empty Array
head=0, tail=0

addLast(10)
[10, _ , _ , _ , _ ]
head=0, tail=1

addLast(20)
[10, 20, _ , _ , _ ]
head=0, tail=2

removeFirst()
[ _ , 20, _ , _ , _ ]
head=1, tail=2

addLast(30)
[ _ , 20, 30, _ , _ ]
head=1, tail=3

addLast(40)
[ _ , 20, 30, 40, _ ]
head=1, tail=4

addLast(50)
[ _ , 20, 30, 40, 50 ]
head=1, tail=0  (wrap)

addLast(60) → array full (nextTail == head) → resize the array → Elements are copied
[20, 30, 40, 50, 60, _ , _ , _ , _ , _ ]
head=0, tail=5

```

> `ArrayList` is best for access, `LinkedList` is good for frequent front operations, and `ArrayDeque` is the best choice for queues and stacks.

---

### ❓ How does `HashMap` work internally?

### 📝 Answer

A HashMap stores data in key–value pairs and allows fast insertion, deletion, and lookup (on average O(1) time).

Internally, a HashMap consists of:

- An array of buckets
- Each bucket can store:
  1. Linked List (Java 7 & earlier)
  2. Red-Black Tree (Java 8+, when collisions are high)

Each stored entry is called a Node:

```
Node {
  int hash;
  Key key;
  Value value;
  Node next;
}
```

🔍 Step-by-Step:

1. Hashing the Key

When you insert `map.put("apple", 10);`

- The key’s `hashCode()` method is called
- Hash is processed to reduce collisions

2. Finding the Bucket Index

The hash is converted into an array index: `index = hash & (capacity - 1)`

Example:

```
capacity = 16
hash = 21
index = 21 & 15 = 5
```

So the entry goes into **bucket 5**.

3. Handling Collisions

If multiple keys map to the **same index**, a **collision** occurs.

- If key exists → value is updated
- If key is different → new node is added

4. Java 8 Optimization (Treeification)

If:

- A bucket has **more than 8 entries**
- Capacity is **at least 64**

Then:
👉 The linked list is converted into a **Red-Black Tree**

This improves lookup time:

- From **O(n)** → **O(log n)**

5. How Data Is Retrieved (get)

```java
map.get("apple");
```

    - Compute `hashCode()` of `"apple"`
    - Find bucket index
    - Traverse in the Linked list **or** Red-Black Tree
    - Use `equals()` to find exact key
    - if `equals()` is false, it is called a **hash collision**. Two keys can have the same hashCode() but equals() can return false.
    - HashMap keeps searching
    - If key matches → Returns **the value**
    - If key not matches → Returns **null**

6. Resizing (Rehashing)

When Number of entries > **capacity × load factor (0.75)**

Then:

- Capacity doubles (e.g., 16 → 32)
- All entries are **rehashed**
- Improves performance by reducing collisions

7. Time Complexity

| Operation | Average | Worst Case |
| --------- | ------- | ---------- |
| put()     | O(1)    | O(log n)   |
| get()     | O(1)    | O(log n)   |
| remove()  | O(1)    | O(log n)   |

---

### ❓ How does ConcurrentHashMap work internally?

### 📝 Answer

`ConcurrentHashMap` does NOT use `HashMap` internally.
ConcurrentHashMap uses an array of buckets, just like HashMap. Each bucket holds entries for keys that hash to the same index.

When a thread reads from a ConcurrentHashMap, it usually does not lock anything at all. It simply reads the value. This allows many threads to read at the same time, which makes it very fast.

When a thread writes (put or remove), it locks only the bucket where the key belongs—not the entire map. So:

- Thread A can update bucket #2
- Thread B can update bucket #7 at the same time
- They do not block each other

---

### ❓ Difference between `HashMap`, `LinkedHashMap`, `TreeMap`

### 📝 Answer

| `Feature`                       | `HashMap`                       | `LinkedHashMap`                                                | `TreeMap`                                                  |
| ------------------------------- | ------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------- |
| **Ordering**                    | Does **not** maintain any order | Maintains **insertion order** (or **access order** if enabled) | Maintains keys in **sorted order** (natural or comparator) |
| **How order is achieved**       | No ordering logic               | Uses a **doubly linked list** connecting entries               | Uses a **Red-Black Tree** to keep keys sorted              |
| **Internal Data Structure**     | Array + Linked List / Tree      | HashMap + **Doubly Linked List**                               | **Red-Black Tree**                                         |
| **Time Complexity (get / put)** | O(1) average, O(n) worst        | O(1) average, O(n) worst                                       | O(log n) always                                            |
| **Performance Impact**          | 🚀 Fastest due to no ordering   | ⚡ Slightly slower (extra pointers for order)                  | 🐢 Slower due to tree balancing                            |
| **Null Keys**                   | One null key allowed            | One null key allowed                                           | ❌ Not allowed (sorting needs comparison)                  |
| **Null Values**                 | Allowed                         | Allowed                                                        | Allowed                                                    |

```java
Map<Integer, String> map = new TreeMap<>();
```

- Use `HashMap` when **fast access matters** and **ordering is irrelevant**.
- Use `LinkedHashMap` when **insertion order must be preserved**.
- Use `TreeMap` when **keys must stay sorted** automatically.

Thread-safety: **(ConcurrentHashMap and Hashtable)**

- Use `Hashtable` only for **legacy synchronized map requirements**.
- `Hashtable` is synchronized (Only one thread can read or write at a time)
- Use `ConcurrentHashMap` when **multiple threads update data concurrently**.
- `ConcurrentHashMap`is not fully synchronized.
  - Reads (get) are non-blocking.
  - Writes lock only a small portion if two threads modify the same bucket
- Both `ConcurrentHashMap` and `Hashtable` does not allow `null` for either `key` or `value`

```java
Map<Integer, String> map = new HashMap<>();
map.put(3, "C");
map.put(1, "A");
map.put(2, "B");

System.out.println(map); // Output: {1=A, 2=B, 3=C}   // or any order
```

```java
Map<Integer, String> map = new LinkedHashMap<>();
map.put(3, "C");
map.put(1, "A");
map.put(2, "B");

System.out.println(map); // Output: {3=C, 1=A, 2=B}
```

```java
Map<Integer, String> map = new TreeMap<>();
map.put(3, "C");
map.put(1, "A");
map.put(2, "B");

System.out.println(map); // Output: {1=A, 2=B, 3=C}
```

```java
Map<Integer, String> map = new ConcurrentHashMap<>();
map.put(1, "A");
map.put(2, "B");

System.out.println(map); // Output: {1=A, 2=B} (Thread-safe)
```

```java
Map<Integer, String> map = new Hashtable<>();
map.put(1, "A");
map.put(2, "B");

System.out.println(map); // Output: {2=B, 1=A}
```

---

### ❓ What is fail-fast vs fail-safe iterator?

### 📝 Answer

A **fail-fast iterator** immediately **throws `ConcurrentModificationException`** if the collection is structurally modified **after the iterator is created**, except through the iterator itself.

- Detects bugs early
- Works on the **original collection**
- Not thread-safe

**Examples:** `ArrayList`, `HashMap`, `HashSet`

```java
Iterator<Integer> it = list.iterator();
list.add(5);   // structural modification
it.next();     // ❌ ConcurrentModificationException
```

```java
List<Integer> list = new ArrayList<>();
list.add(1);
list.add(2);

for (int i : list) {
    list.add(3); // ❌ ConcurrentModificationException
}
```

🧠 Explanation

1. Iterator stores collection’s **modCount** at creation
2. `list.add(5)` changes **modCount**
3. `it.next()` detects mismatch
4. Exception is thrown → **fail-fast behavior**

A **fail-safe iterator** allows modification during iteration because it **iterates over a cloned (snapshot) copy** of the collection.

- No exception thrown
- Thread-safe
- Slightly slower, higher memory usage

**Examples:** `CopyOnWriteArrayList`, `ConcurrentHashMap`

```java
Iterator<Integer> it = list.iterator();
while (it.hasNext()) {
    int i = it.next();
    list.add(3);   // structural change
}

```

```java
List<Integer> list = new CopyOnWriteArrayList<>();
list.add(1);
list.add(2);

for (int i : list) {
    list.add(3); // NO exception
}
```

---

### ❓ Difference between `Iterator` and `ListIterator`

### 📝 Answer

| Feature                 | `Iterator`                               | `ListIterator`                                                      |
| ----------------------- | ---------------------------------------- | ------------------------------------------------------------------- |
| **Traversal direction** | Forward only (`hasNext()`, `next()`)     | Both directions (`hasNext()/next()` and `hasPrevious()/previous()`) |
| **Add elements**        | ❌ Not supported                         | ✔ `add(E e)`                                                        |
| **Replace elements**    | ❌ Not supported                         | ✔ `set(E e)`                                                        |
| **Remove elements**     | ✔ `remove()`                             | ✔ `remove()`                                                        |
| **Index access**        | ❌ No index info                         | ✔ `nextIndex()` / `previousIndex()`                                 |
| **Collection support**  | All Collections (`List`, `Set`, `Queue`) | Only `List` implementations                                         |
| **Starting position**   | Always at beginning                      | Can start at any index                                              |
| **Typical use case**    | Simple forward traversal                 | Bidirectional traversal & modification                              |

**`Iterator` Example (Forward)**

```java
List<String> list = new ArrayList<>(List.of("A", "B", "C"));
Iterator<String> it = list.iterator();
while (it.hasNext()) {
   String val = it.next();
   if (val.equals("B")) {
        it.remove(); // allowed
    }
}
System.out.println("Final List: " + list); // Output: Final List: [A, C]
```

**`ListIterator` Example (Forward + Backward)**

```java
List<String> list = new ArrayList<>(List.of("A", "B", "C"));
ListIterator<String> it = list.listIterator();
// Forward traversal
while (it.hasNext()) {
    String val = it.next();
    if (val.equals("B")) {
        it.set("BB");      // replace
        it.add("D");       // add after B
    }
}
System.out.println(list); // Output: [A, BB, D, C]

 // Backward traversal
while (it.hasPrevious()) {
    System.out.println(it.previous()); // Output: C, D, BB, A
}
```

**Starting `ListIterator` at a Specific Index**

```java
List<String> list = List.of("A", "B", "C", "D");
ListIterator<String> it = list.listIterator(2);

System.out.println(it.next()); // Output: C
System.out.println(it.previousIndex()); // Output: 1
```

---

### ❓ Difference between `Comparable` and `Comparator`

### 📝 Answer

| Feature           | **Comparable**                                  | **Comparator**              |
| ----------------- | ----------------------------------------------- | --------------------------- |
| Purpose           | Defines **natural/default ordering** of objects | Defines **custom ordering** |
| Package           | `java.lang`                                     | `java.util`                 |
| Method            | `compareTo(T o)`                                | `compare(T o1, T o2)`       |
| Where implemented | **Inside the class** whose objects are compared | **Outside the class**       |

**Example 1: Using Comparable**

```java
class Student implements Comparable<Student> {
    int roll;
    String name;

    Student(int roll, String name) {
        this.roll = roll;
        this.name = name;
    }

    @Override
    public int compareTo(Student s) {
        return this.roll - s.roll;   // ascending order
    }

    @Override
    public String toString() {
        return roll + " " + name;
    }
}

List<Student> list = new ArrayList<>();
list.add(new Student(3, "Ravi"));
list.add(new Student(1, "Amit"));
list.add(new Student(2, "Neha"));
Collections.sort(list);
System.out.println(list); // Output: [1 Amit, 2 Neha, 3 Ravi]


```

> `String` implements `Comparable<String>` by default.
> `Integer` implements `Comparable<Integer>` by default.

**Example 2: Using Comparator**

```java
class Student {
    int roll;
    String name;

    Student(int roll, String name) {
        this.roll = roll;
        this.name = name;
    }

    @Override
    public String toString() {
        return roll + " " + name;
    }
}

List<Student> list = new ArrayList<>();
list.add(new Student(3, "Ravi"));
list.add(new Student(1, "Amit"));
list.add(new Student(2, "Neha"));

Comparator<Student> nameComparator = (a, b) -> a.name.compareTo(b.name);
Collections.sort(list, nameComparator);
System.out.println(list); // Output: [1 Amit, 2 Neha, 3 Ravi]


```

1️⃣ Can a class implement **multiple Comparables**?

❌ **No**

```java
class A implements Comparable<A>, Comparable<B> { } // ❌ illegal
```

📌 Reason: `Comparable` defines **only one natural ordering**.

2️⃣ Can a class have **multiple Comparators**?

✅ **Yes**

```java
Comparator<Student> byName = (a, b) -> a.name.compareTo(b.name);
Comparator<Student> byRoll = (a, b) -> a.roll - b.roll;
```

📌 Reason: Comparators define **external & multiple** sorting logic.

3️⃣ Will `Collections.sort()` work **without Comparable**?

❌ **No**

```java
Collections.sort(list); // requires Comparable
```

📌 Reason: Works **only if elements implement `Comparable`**

4️⃣ Will `Collections.sort(list, comparator)` work **without Comparable**?

✅ **Yes**

```java
Collections.sort(list, comparator);
```

📌 Reason: Comparable is **not required** when Comparator is provided.

5️⃣ Is `Comparator` a **functional interface**?

✅ **Yes**

```java
Comparator<Integer> c = (a, b) -> b - a;
```

📌 Reason: Because it has **one abstract method**: `compare()`.

6️⃣ Which has **higher priority**: Comparable or Comparator?

🏆 **Comparator**

```java
Collections.sort(list, comparator);
```

📌 Reason: Comparator **overrides natural ordering**.

7️⃣ Does `Comparator` allow sorting in **reverse order** easily?

✅ **Yes**

```java
Collections.sort(list, Comparator.reverseOrder());
```

### ❓ What is `WeakHashMap`?

### 📝 Answer

A WeakHashMap is a special Map where the **keys** are weakly referenced
If a key is not used anywhere else, Java’s Garbage Collector (GC) can delete it

```java
Map<Object, String> map = new WeakHashMap<>();

Object key1 = new Object();
Object key2 = new Object();
map.put(key1, "Value 1");
map.put(key2, "Value 2");

System.out.println("Before GC: " + map); // Output: Before GC: {java.lang.Object@7344699f=Value 2, java.lang.Object@251a69d7=Value 1}

key1 = null; // Remove strong reference to key1

System.gc(); // Request garbage collection for demonstration purposes (Runs Automatically)
try { Thread.sleep(1000); } catch (Exception e) {} // Give GC some time

System.out.println("After GC: " + map); // Output: After GC: {java.lang.Object@7344699f=Value 2}
```

**Use `WeakHashMap`** to store cached data only as long as the key is in use

> WeakHashMap automatically removes entries when keys are no longer used anywhere else.

---

### ❓ When would you prefer immutable collections?

### 📝 Answer

Immutable collections is preferred when you want safety, simplicity, and predictability, especially in modern Java applications.

An immutable collection is a collection that cannot be changed after it is created.

Once you put data in it:

- ❌ you cannot add
- ❌ you cannot remove
- ❌ you cannot update

```java
List<String> list = List.of("A", "B", "C");
list.add("D"); // ❌ throws UnsupportedOperationException

```

🤔❓ When is this useful?

1.  When multiple threads read the same data

In multi-threaded programs, bugs usually come from shared mutable data.

With immutable collections:

- No locks needed
- No synchronization
- No race conditions

```java
List<String> config = List.of("READ", "WRITE", "DELETE");
// Safe to share across threads forever
```

2. When data represents configuration or constants

Configuration should not change at runtime.

```java
Map<String, String> config =
        Map.of("url", "db.prod", "timeout", "30");

```

---

## JAVA STREAMS — COLLECTORS & COMPARATORS CHEAT SHEET

🔑 **COMMON PLACEHOLDERS — WHAT TO WRITE**

```java
classifier   -> Person::getDepartment
mapper       -> Person::getAge | Person::getName
predicate    -> p -> p.getAge() > 18
comparator   -> Comparator.comparing(Person::getAge)
mergeFn      -> (a, b) -> a
mapSupplier  -> HashMap::new | TreeMap::new
downstream   -> Collectors.toList()
```

⚡ **COLLECTORS — SYNTAX + USAGE**

```java
Collectors.toList()                          // Convert Stream → List
Collectors.toSet()                           // Convert Stream → Set

Collectors.toMap(k, v)                       // Convert List → Map
Collectors.toMap(k, v, mergeFn)              // Map with duplicate keys
Collectors.toMap(k, v, mergeFn, mapSupplier) // Custom Map (HashMap/TreeMap)

Collectors.groupingBy(classifier)            // Group by field
Collectors.groupingBy(classifier, downstream)// Group + aggregate
Collectors.groupingBy(c, mapSupplier, d)     // Group into custom Map

Collectors.partitioningBy(predicate)         // Split true / false
Collectors.partitioningBy(p, downstream)     // Partition + collect

Collectors.counting()                        // Count elements

Collectors.averagingInt(mapper)              // Average int field
Collectors.averagingLong(mapper)             // Average long field
Collectors.averagingDouble(mapper)           // Average double field

Collectors.summingInt(mapper)                // Sum int field
Collectors.summingLong(mapper)               // Sum long field
Collectors.summingDouble(mapper)             // Sum double field

Collectors.minBy(comparator)                 // Find minimum
Collectors.maxBy(comparator)                 // Find maximum

Collectors.mapping(mapper, downstream)       // Transform while collect
Collectors.flatMapping(mapper, downstream)   // Flatten nested streams

Collectors.joining()                         // Convert List → String
Collectors.joining(delimiter)                // String with separator
Collectors.joining(d, prefix, suffix)        // Formatted String

Collectors.summarizingInt(mapper)             // min, max, avg, sum
Collectors.summarizingLong(mapper)            // statistics long
Collectors.summarizingDouble(mapper)          // statistics double

Collectors.collectingAndThen(downstream, f)  // Post-process result
```

⚡ **COMPARATORS — SYNTAX + USAGE**

```java
Comparator.comparing(key)                    // Sort by field
Comparator.comparing(key, comparator)        // Custom sort logic

Comparator.comparingInt(key)                 // Primitive int sort
Comparator.comparingLong(key)                // Primitive long sort
Comparator.comparingDouble(key)              // Primitive double sort

Comparator.naturalOrder()                    // Ascending order
Comparator.reverseOrder()                    // Descending order

comparator.reversed()                        // Reverse comparator
comparator.thenComparing(key)                // Secondary sort
comparator.thenComparing(key, cmp)           // Multi-level sort

Comparator.nullsFirst(cmp)                   // Nulls first
Comparator.nullsLast(cmp)                    // Nulls last

Map.Entry.comparingByKey()                   // Sort map by key
Map.Entry.comparingByValue()                 // Sort map by value
```

---

## 3️⃣ Equals and Hashcode

### ❓ How do equals() and hashCode() work together?

### 📝 Answer

- `equals() `is a normal instance method and can be called independently.

  ```java
  User u1 = new User(1);
  User u2 = new User(1);

  u1.equals(u2); // Works even if hashCode() is not overridden
  ```

- `hashCode()` is used only by hash-based collections (HashMap, HashSet).

In hash-based collections:

- `hashCode()` determines the bucket
- `equals()` compares objects inside the bucket

1️⃣ **`hashCode()` is overridden but `equals()` is not**

❌ Logical equality fails.

```java
class User {
    int id;

    @Override
    public int hashCode() {
        return id;
    }
    // equals() NOT overridden
}

User u1 = new User(1);
User u2 = new User(1);

System.out.println(u1.equals(u2)); // false
```

- `equals()` falls back to `Object.equals()`
- `Object.equals()` default behavior is **reference comparison (== operator)**

2️⃣ `equals()` is overridden but `hashCode()` is not

❌ Hash-based collections break.

```java
class User {
    int id;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User)) return false;
        return id == ((User) o).id;
    }
    // hashCode() NOT overridden
}
Set<User> set = new HashSet<>();
set.add(new User(1));

System.out.println(set.contains(new User(1))); // false ❌
```

- Default `hashCode()` is memory-based
- Objects go into **different buckets**
- `equals()` is never called

---

## 4️⃣ Java 8+ Features

### ❓ What major changes did Java 8 introduce?

### 📝 Answer

Java 8 introduced a paradigm shift from purely **imperative**, object-oriented style toward a **functional-style** programming model, while still remaining fully object-oriented.

However, it’s important to note:

❗ Java is not a functional programming language
✔️ Java 8 supports functional-style programming

1️⃣ **Functional Interface**

A functional interface is an interface that has **exactly one abstract method**.
It is mainly used to support **lambda expressions**.

🎯 **Key Understanding**

- Only **one abstract method**
- Can have **multiple default and static methods**
- `@FunctionalInterface` is optional but recommended

```java
@FunctionalInterface
interface Calculator {
    int add(int a, int b);   // single abstract method

    default void log() {
        System.out.println("Calculating...");
    }

    static void info() {
        System.out.println("Calculator Interface");
    }
}
```

1. Can a functional interface extend another interface?

✅ **Yes**, if total abstract methods = **1**

```java
interface A {
    void show();
}

@FunctionalInterface
interface B extends A {
    // no new abstract method
}
```

2️⃣ **Lambda Expression**

A lambda expression provides an **inline implementation** of a functional interface and helps reduce boilerplate code.

🎯 **Key Understanding**

- Replaces anonymous classes
- Enables passing behavior as data
- Works only with functional interfaces

```java
// Functional Interface:

@FunctionalInterface
interface Calculator {
    int add(int a, int b);
}

class MyClass implements Calculator {
    @Override
    public int add(int a, int b) {
        return a + b;
    }

    Calculator c = new MyClass();
    System.out.println(c.add(10, 20));
}

// (or)

Calculator c = new Calculator() {
    @Override
    public int add(int a, int b) {
        return a + b;
    }
};

System.out.println(c.add(10, 20));

// *******************
// Lambda Expression:

Calculator c = (a, b) -> a + b;
System.out.println(c.add(10, 20));
```

3️⃣ **Stream API**

Stream API is used to **process collections of data in a functional style**.

🎯 **Key Understanding**

- Streams **do not store data**
- Streams **do not modify the source**
- Supports **lazy evaluation**
- Can run **sequential or parallel**

```java
List<Integer> list = List.of(1, 2, 3, 4, 5);

list.stream()
    .filter(n -> n % 2 == 0)
    .map(n -> n * n)
    .forEach(System.out::println); // Output: 4 16
```

4️⃣ **Method References**

Method reference is a **shorter way of writing a lambda expression** when the lambda only calls an existing method.

🎯 **Key Understanding**

- Improves readability
- No additional logic allowed
- Uses `::` operator

```java
list.forEach(System.out::println);

// ****************
// Equivalent lambda:
list.forEach(n -> System.out.println(n));
```

5️⃣ **Optional**

`Optional` is a container object used to **represent presence or absence of a value**.

🎯 **Key Understanding**

- Helps avoid explicit null checks
- Does NOT automatically prevent NPE
- Best used as a **return type**

```java
Optional<String> name1 = Optional.of("Dev");        // ❌ NPE if null
Optional<String> name2 = Optional.ofNullable(null); // ✅ allows null
Optional<String> name3 = Optional.empty();          // empty Optional

```

6️⃣ **Default & Static Methods in Interface**

Java 8 allows interfaces to have default and static methods with implementation.

- To add new methods without breaking existing implementations

```java
interface Vehicle {

    default void start() {
        System.out.println("Vehicle started");
    }

    static void service() {
        System.out.println("Vehicle serviced");
    }
}
```

1. Can a class override a default method?

✅ Yes. Class method always wins.

2. What happens if two interfaces have same default method?

❌ Compile-time error

✅ Fix - override the default method

```java
class C implements A, B {

  @Override
  public void show() {
    A.super.show();
  }
}
```

3. Can default methods call other methods?

✅ Yes

```java
interface A {
    default void show() {
        helper();
    }

    private void helper() { // Java 9+
        System.out.println("Helper");
    }
}
```

4. Why static methods in interfaces?

To provide utility/helper methods related to the interface.

❌ Problem before Java 8

static methods require to be implemented in an Utility class which allow **forced Inheritance**

```java
class Vehicle {

    static Vehicle car() {
        return new Car();
    }
}
class Car extends Vehicle { }   // ❌ forced inheritance
class Car extends Machine extends Vehicle // ❌ Java allows only one superclass.
```

✅ Interface solves this cleanly

```java
interface Vehicle {

    static Vehicle car() {
        return new Car();
    }
}
class Car implements Vehicle { }          // ✅ no inheritance lock
class ElectricCar extends Machine implements Vehicle { } // ✅ still allowed

```

---

### ❓ `input.toCharArray()` vs `input.chars()`?

### 📝 Answer

`input.toCharArray()` 👉 Converts the `String` into a **char[] (character array)**

```java
String input = "ABC";

char[] chars = input.toCharArray();
for (char c : chars) {
    System.out.println(c);
}
```

🎯 **Key Understanding**

- Returns: `char[]`
- Best for **simple loops**

`input.chars()` 👉 Returns a **stream of character codes (int values)**

```java
String input = "ABC";

input.chars()
     .forEach(c -> System.out.println((char) c));
```

🎯 **Key Understanding**

- Returns: `IntStream`
- Each value is an **ASCII/Unicode code**
- Requires casting to `char`
- Useful for **stream operations** (filter, map, count)

---

### ❓ map vs mapToInt vs mapToObj vs mapToLong vs mapToDouble vs flatMap?

### 📝 Answer

1️⃣ `map()` 👉 **Transforms each element → another element**

```java
List<String> names = List.of("java", "angular");

List<String> upper =
    names.stream()
         .map(s -> s.toUpperCase())
         .toList();

System.out.println(upper); // [JAVA, ANGULAR]
```

2️⃣ `mapToInt()` 👉 **Object → primitive `int` stream (`IntStream`)**

```java
List<String> names = List.of("java", "angular");

int[] lengths =
    names.stream()
         .mapToInt(s -> s.length())
         .toArray();

System.out.println(Arrays.toString(lengths)); // [4, 7]
```

3️⃣ `mapToLong()` 👉 **Object → primitive `long` stream (`LongStream`)**

```java
List<String> files = List.of("a", "bb", "ccc");

long total =
    files.stream()
         .mapToLong(s -> s.length())
         .sum();

System.out.println(total); // 6
```

4️⃣ `mapToDouble()` 👉 **Object → primitive `double` stream (`DoubleStream`)**

```java
List<Integer> prices = List.of(100, 200, 300);

double avg =
    prices.stream()
          .mapToDouble(p -> p * 1.18)
          .average()
          .getAsDouble();

System.out.println(avg); // 236.0
```

5️⃣ `mapToObj()` 👉 **Primitive → Object stream**

```java
IntStream.range(1, 4)
         .mapToObj(i -> "Item-" + i)
         .forEach(System.out::println); // Item-1 Item-2 Item-3
```

6️⃣ `flatMap()` 👉 **Flattens nested streams (many → one)**

```java
List<List<String>> data =
    List.of(
        List.of("A", "B"),
        List.of("C", "D")
    );

List<String> flat =
    data.stream()
        .flatMap(list -> list.stream())
        .toList();

System.out.println(flat); // [A, B, C, D]
```

---

### ❓ Collectors to Remember

### 📝 Answer

```java
List<Employee> data = new ArrayList<>();
data.add(new Employee(1, "Adam", "10000", "24"));
data.add(new Employee(2, "Jon",  "10000", "23"));
data.add(new Employee(3, "Tim",  "15000", "26"));
data.add(new Employee(4, "Jim",  "14500", "26"));
```

| Code                                                                                        | Output                              | Syntax                                    |
| ------------------------------------------------------------------------------------------- | ----------------------------------- | ----------------------------------------- |
| `data.stream().collect(toList())`                                                           | `List<Employee>`                    | `toList()`                                |
| `data.stream().map(Employee::getAge).collect(toSet())`                                      | `[23,24,26]`                        | `toSet()`                                 |
| `data.stream().map(Employee::getName).collect(joining(","))`                                | `Adam,Jon,Tim,Jim`                  | `joining(delimiter)`                      |
| `data.stream().collect(counting())`                                                         | `4`                                 | `counting()`                              |
| `data.stream().collect(groupingBy(Employee::getAge))`                                       | `{23=[Jon],24=[Adam],26=[Tim,Jim]}` | `groupingBy(key)`                         |
| `data.stream().collect(groupingBy(Employee::getAge, counting()))`                           | `{23=1,24=1,26=2}`                  | `groupingBy(key, downstream)`             |
| `data.stream().collect(groupingBy(Employee::getAge, HashMap::new, toList()))`               | `{23=[Jon],24=[Adam],26=[Tim,Jim]}` | `groupingBy(key, mapFactory, downstream)` |
| `data.stream().collect(toMap(Employee::getId, Employee::getName))`                          | `{1=Adam,2=Jon,3=Tim,4=Jim}`        | `toMap(key, value)`                       |
| `data.stream().collect(toMap(Employee::getAge, Employee::getName, (a,b)->a))`               | `{23=Jon,24=Adam,26=Tim}`           | `toMap(key, value, mergeFn)`              |
| `data.stream().collect(toMap(Employee::getAge, Employee::getName, (a,b)->a, TreeMap::new))` | `{23=Jon,24=Adam,26=Tim}`           | `toMap(key, value, mergeFn, mapFactory)`  |
| `data.stream().collect(maxBy(Comparator.comparing(Employee::getSalary)))`                   | `Optional[Tim]`                     | `maxBy(comparator)`                       |
| `data.stream().collect(minBy(Comparator.comparing(Employee::getSalary)))`                   | `Optional[Adam]`                    | `minBy(comparator)`                       |
| `data.stream().collect(groupingBy(Employee::getAge, mapping(Employee::getName, toList())))` | `{23=[Jon],24=[Adam],26=[Tim,Jim]}` | `mapping(mapper, downstream)`             |

1️⃣ `groupingBy` — Mandatory vs Optional

🧠 Argument Breakdown

| Argument           | Mandatory?   | Why                                  |
| ------------------ | ------------ | ------------------------------------ |
| `classifier (key)` | ✅ Mandatory | Grouping cannot happen without a key |
| `downstream`       | ❌ Optional  | Defaults to `toList()`               |
| `mapFactory`       | ❌ Optional  | Defaults to `HashMap`                |

2️⃣ `toMap` — Mandatory vs Optional

🧠 Argument Breakdown

| Argument        | Mandatory?     | Why                                                             |
| --------------- | -------------- | --------------------------------------------------------------- |
| `keyMapper`     | ✅ Mandatory   | Keys are required                                               |
| `valueMapper`   | ✅ Mandatory   | Values are required                                             |
| `mergeFunction` | ❌ Conditional | Duplicate keys without mergeFn throw ❌ `IllegalStateException` |
| `mapFactory`    | ❌ Optional    | Defaults to `HashMap`                                           |

3️⃣ `Function.identity()`

✅ Use When - Element is already the key (String, Integer, etc)

```java
toMap(Function.identity(), v -> "VAL")
```

❌ Don’t Use When - Element is an Object (e.g. Employee)

```java
toMap(Function.identity(), Employee::getSalary)
```

3️⃣ `Collectors.counting()`

```java
Collectors.counting()
```

- Counts how many elements fall into each group
- Returns `Long`

---

### ❓ Optional.isPresent vs Optional.IfPresent

### 📝 Answer

`Optional.isPresent()` - To check if the Optional instance contains a non-null value

```java
Optional<String> optional = Optional.of("Hello");

if (optional.isPresent()) {
    System.out.println("Value is: " + optional.get()); // Can throw an exception if the Optional is empty
} else {
    System.out.println("Value is not present.");
}
```

Usage: Typically used in a traditional if-else block

`Optional.ifPresent()` - To perform a specific action on the contained value only if it is present.

```java
Optional<String> optional = Optional.of("Hello");

// The consumer action is executed only if a value is present
optional.ifPresent(value -> System.out.println("Value is: " + value));
// Output: Value is: Hello
```

Usage: It takes a lambda expression (or method reference) as an argument

---

### ❓ `filter()` vs `peek()`

### 📝 Answer

🔹 `filter()`

- **Purpose:** Select elements based on a condition
- **Type:** Intermediate operation
- **Returns:** Stream with filtered elements

```java
List<Integer> nums = Arrays.asList(1, 2, 3, 4);

nums.stream()
    .filter(n -> n % 2 == 0)
    .forEach(System.out::println); // 2, 4
```

🔹 `peek()`

- **Purpose:** Debugging (look at elements without changing them)
- **Type:** Intermediate operation
- **Should NOT be used for logic**

```java
nums.stream()
    .peek(n -> System.out.println("Before: " + n))
    .filter(n -> n > 2)
    .forEach(System.out::println);
```

📌 **Key Difference**

- `filter()` → **changes stream content**
- `peek()` → **just observes**

---

### ❓ `findFirst()` vs `findAny()`

### 📝 Answer

🔹 `findFirst()`

- Returns **first element**
- **Order matters**
- Safer for sequential streams

```java
nums.stream()
    .findFirst()
    .ifPresent(System.out::println);
```

🔹 `findAny()`

- Returns **any element**
- Faster in **parallel streams**
- Order does **not** matter

```java
nums.parallelStream()
    .findAny()
    .ifPresent(System.out::println);
```

📌 **Key Difference**

- `findFirst()` → deterministic
- `findAny()` → performance-oriented

---

### ❓ `map()` vs `flatMap()`

### 📝 Answer

🔹 `map()`

- Converts **one element → one element**

```java
List<String> names = Arrays.asList("java", "spring");

names.stream()
     .map(String::toUpperCase)
     .forEach(System.out::println);
```

🔹 `flatMap()`

- Converts **one element → multiple elements**
- Flattens nested structures

```java
List<List<String>> list = Arrays.asList(
    Arrays.asList("A", "B"),
    Arrays.asList("C", "D")
);

list.stream()
    .flatMap(l -> l.stream())
    .forEach(System.out::println);
```

📌 **Key Difference**

- `map()` → 1 → 1
- `flatMap()` → 1 → many → flattened

---

### ❓ Intermediate vs Terminal Operations

### 📝 Answer

🔹 Intermediate Operations

- Return **Stream**
- Lazy (not executed immediately)

Examples:

- `filter()`
- `map()`
- `peek()`

```java
stream.filter(...).map(...);
```

🔹 Terminal Operations

- End the stream
- Produce **result**

Examples:

- `forEach()`
- `collect()`
- `findFirst()`

```java
stream.filter(...).collect(Collectors.toList());
```

📌 **Rule:**
❌ Stream without terminal operation = **Nothing happens**

---

### ❓ Types of Functional Interfaces

### 📝 Answer

🔹 Core Functional Interfaces

| Interface           | Method              | Description             | Example               |
| ------------------- | ------------------- | ----------------------- | --------------------- |
| `Predicate<T>`      | `boolean test(T)`   | Condition check         | `x -> x > 10`         |
| `BiPredicate<T,U>`  | `boolean test(T,U)` | Two-input condition     | `(a,b) -> a > b`      |
| `Function<T,R>`     | `R apply(T)`        | Transform value         | `x -> x * 2`          |
| `BiFunction<T,U,R>` | `R apply(T,U)`      | Two inputs → one output | `(a,b) -> a + b`      |
| `Consumer<T>`       | `void accept(T)`    | Consumes value          | `x -> print(x)`       |
| `BiConsumer<T,U>`   | `void accept(T,U)`  | Consumes two values     | `(k,v) -> print(k+v)` |
| `Supplier<T>`       | `T get()`           | Supplies value          | `() -> "Hello"`       |

Good catch 👍 — **`BiFunction` and friends are very common Java 8 interview follow-ups**.
Let’s extend the table **crisply**, then see **simple coding examples** for each.

---

## 1️⃣ What about `BiFunction`?

### 🔹 `BiFunction<T, U, R>`

- Takes **2 inputs**
- Returns **1 result**
- Functional method → `R apply(T t, U u)`

```java
BiFunction<Integer, Integer, Integer> add =
        (a, b) -> a + b;

System.out.println(add.apply(10, 20)); // 30
```

📌 **Use Case:**
When logic needs **two inputs** and produces a result (sum, merge, calculate, etc.)

---

## 2️⃣ Extended Functional Interface Table (Important for Interviews)

| Interface           | Method              | Description             | Example               |
| ------------------- | ------------------- | ----------------------- | --------------------- |
| `Predicate<T>`      | `boolean test(T)`   | Condition check         | `x -> x > 10`         |
| `BiPredicate<T,U>`  | `boolean test(T,U)` | Two-input condition     | `(a,b) -> a > b`      |
| `Function<T,R>`     | `R apply(T)`        | Transform value         | `x -> x * 2`          |
| `BiFunction<T,U,R>` | `R apply(T,U)`      | Two inputs → one output | `(a,b) -> a + b`      |
| `Consumer<T>`       | `void accept(T)`    | Consumes value          | `x -> print(x)`       |
| `BiConsumer<T,U>`   | `void accept(T,U)`  | Consumes two values     | `(k,v) -> print(k+v)` |
| `Supplier<T>`       | `T get()`           | Supplies value          | `() -> "Hello"`       |

✅ `Predicate`

```java
Predicate<Integer> isEven = x -> x % 2 == 0;

System.out.println(isEven.test(4)); // true
System.out.println(isEven.test(5)); // false
```

✅ `BiPredicate`

```java
BiPredicate<Integer, Integer> greater =
        (a, b) -> a > b;

System.out.println(greater.test(10, 5)); // true
```

✅ `Function`

```java
Function<String, Integer> length =
        s -> s.length();

System.out.println(length.apply("Java")); // 4
```

✅ `BiFunction`

```java
BiFunction<String, String, String> concat =
        (a, b) -> a + b;

System.out.println(concat.apply("Hello ", "Java")); // Hello Java
```

✅ `Consumer`

```java
Consumer<String> printer =
        s -> System.out.println(s);

printer.accept("Java 8"); // Java 8
```

✅ `BiConsumer`

```java
BiConsumer<String, Integer> printInfo =
        (name, age) -> System.out.println(name + " - " + age);

printInfo.accept("Dev", 25);
```

📌 **Real Use Case:**
Used heavily with `Map.forEach()`

```java
Map<String, Integer> map = Map.of("A", 1, "B", 2);

map.forEach((k, v) -> System.out.println(k + ":" + v));
```

✅ `Supplier`

```java
Supplier<Double> random =
        () -> Math.random();

System.out.println(random.get());
```

📌 **Rule:**
Functional Interface = **Exactly one abstract method**

---

### ❓ Features of `Optional`

### 📝 Answer

🔹 Why Optional?

- Avoids `NullPointerException`
- Makes null-handling explicit

🔹 Useful Methods

```java
Optional<String> opt = Optional.ofNullable("Java");

opt.isPresent();          // true
opt.get();                // Java
opt.orElse("Default");    // Java
opt.orElseGet(() -> "X"); // Java
opt.ifPresent(System.out::println);
```

📌 **Best Practice**

- Use `Optional` as **return type**
- Not for fields or parameters

---

### ❓ Why `Optional` Should NOT Be Used as Method Parameter?

### 📝 Answer

❌ Bad Design

```java
void printName(Optional<String> name) { }
```

❌ Problems

- Caller responsibility becomes unclear
- Breaks readability
- Adds unnecessary wrapping

✅ Correct Approach

```java
void printName(String name) {
    if (name != null) {
        System.out.println(name);
    }
}
```

📌 **Rule of Thumb**

- ✅ Use `Optional` → **return type**
- ❌ Avoid `Optional` → **method parameters & fields**

---

## Java Access Levels

### Explain all Java access levels?

### 📝 Answer

Java provides **four access levels** to control visibility and encapsulation.
They apply to classes, methods, variables, and constructors, but with rules and exceptions.

| Modifier            | Keyword        | Visibility                |
| ------------------- | -------------- | ------------------------- |
| **Public**          | `public`       | Everywhere                |
| **Protected**       | `protected`    | Same package + subclasses |
| **Package-Private** | _(no keyword)_ | Same package only         |
| **Private**         | `private`      | Same class only           |

❗ Rules to remember

1. **Class Level (Top-Level Classes)**

`public` - File name **must exactly match** the class name and accessible from **any package**

```java
public class MyClass {}   // File name must be MyClass.java
```

`Package-Private` (no modifier) - File name **can be anything** and accessible **only within the same package**

```java
class MyClass {} // File name can be anything
```

`protected` ❌
`private` ❌

- **Not allowed** for top-level classes

2. **Constructor Level**

```java
public class Parent {
    private Parent() {
        System.out.println("private constructor");
    }

    Parent(int x) {
        System.out.println("package-private constructor");
    }

    protected Parent(String s) {
        System.out.println("protected constructor");
    }

    public Parent(double d) {
        System.out.println("public constructor");
    }
}

public class Child extends Parent {
    Child() {
        // super();              // ❌ ERROR → private constructor not accessible
        // super(10);            // ❌ ERROR → package-private (different package)
        super("hello");          // ✅ allowed → protected constructor
        // super(10.5);          // ✅ allowed → public constructor
    }
}

```

3. **Interface Level**

Interface Declaration is same as [class-level](#L2350)

Interface Members: (❗Implicit rules)

- Variables → `public static final`
- Methods → `public` (by default)
- `default` & `static` methods → always `public`
- `private` methods → allowed **only as helper methods** (Java 9+)

4. **Access of parent members inside a subclass**

`public` - Always accessible

`protected`

- Accessible in:
  - Same package
  - Subclasses in different packages (via inheritance)

```java
package zoo;

public class Animal {
    protected void eat() {
        System.out.println("Animal is eating");
    }
}
public class Dog {
    public static void main(String[] args) {
        Animal a = new Animal();
        a.eat(); // ✅ allowed: same package
    }
}
```

```java
package pets;

import zoo.Animal;

public class Cat extends Animal {
    public void test() {
        eat(); // ✅ allowed: subclass access
    }

    public static void main(String[] args) {
        Animal a = new Animal();
        a.eat(); // ❌ not-allowed: compile-time error
    }
}
```

`Package-Private` - Accessible **only within same package**
`private` - Not accessible in subclass

---

## 6️⃣ Immutability & Object Design

### ❓ Why do you prefer immutable objects?

### 📝 Answer

Immutable Object - An object whose state cannot change after it is created.

Useful for **Thread Safety** (Without Synchronization)

---

### ❓ How do you design immutable classes?

### 📝 Answer

✅ Rules for Designing an Immutable Class

- Declare the class as `final`
- Make all fields `private final`
- No setters
- Initialize fields via constructor
- Perform defensive copying
- Never expose mutable internal state

```java
public final class Employee {

    private final int id;
    private final List<String> skills;

    public Employee(int id, List<String> skills) {
        this.id = id;
        this.skills = List.copyOf(skills); // Defensive copy
    }

    public int getId() {
        return id;
    }

    public List<String> getSkills() {
        return Collections.unmodifiableList(skills); // Return unmodifiable view
    }
}
```

1️⃣ Why **Defensive Copying** Matters

❌ Wrong Implementation

```java
this.skills = skills;
```

Caller can mutate: `skills.add("Hacking");` . Use `List.copyOf(skills);`

---

### ❓ How Do You Design a Singleton Class?

### 📝 Answer

Singleton - A class that allows only one instance throughout the application lifecycle.

```java
import java.io.Serializable;

public final class Singleton implements Serializable {

    private static final long serialVersionUID = 1L;

    // 1️⃣ Private constructor
    private Singleton() {
        if (Holder.INSTANCE != null) {
            throw new RuntimeException("Use getInstance()");
        }
    }

    // 2️⃣ Lazy-loaded, thread-safe holder
    private static class Holder {
        private static final Singleton INSTANCE = new Singleton();
    }

    // 3️⃣ Global access point
    public static Singleton getInstance() {
        return Holder.INSTANCE;
    }

    // 4️⃣ Prevent serialization from breaking singleton
    private Object readResolve() {
        return Holder.INSTANCE;
    }

    // 5️⃣ Prevent cloning
    @Override
    protected Object clone() throws CloneNotSupportedException {
        throw new CloneNotSupportedException("Cloning not allowed");
    }
}
```

1️⃣ **Private Constructor**

❌ Without

```java
Singleton s = new Singleton(); // anyone can create object
```

✅ With

```java
private Singleton() {}
```

✔ Prevents external object creation
✔ Enforces single instance

2️⃣ **Inner Class**

1. ❌ Without Inner Class

```java
private static final Singleton INSTANCE = new Singleton();
```

What JVM does

- Loads Singleton class
- Initializes ALL static fields
- INSTANCE created immediately **even if never used**

2. ❌ Without Inner Class (Lazy + Thread-Safe is Hard)

```java
private static Singleton instance;

public static Singleton getInstance() {
    if (instance == null) {          // ❌ race condition
        instance = new Singleton();
    }
    return instance;
}
```

- Not thread-safe
- Multiple objects possible

✅ With Inner Class (BEST WAY)

```java
private static class Holder {
    private static final Singleton INSTANCE = new Singleton();
}
```

What JVM does

- Load outer class
- Inner class is NOT initialized
- When getInstance() is called
  - JVM loads Inner class
  - Initializes static fields
  - NOW `new Singleton()` is executed

```java
Singleton s;             // ❌ no object created
Singleton.getInstance(); // ✅ object created HERE
```

3️⃣ **Global Access Method**

❌ Without

```java
// no controlled access
```

✅ With

```java
public static Singleton getInstance() {
    return Holder.INSTANCE;
}
```

✔ Single access point
✔ Controlled instance creation

4️⃣ **Serialization Protection (`readResolve`)**

❌ Without

```java
Singleton s1 = getInstance();
Singleton s2 = deserialize(serialize(s1));

s1 != s2 // ❌ singleton broken
```

✅ With

```java
private Object readResolve() {
    return Holder.INSTANCE;
}
```

✔ Prevents new instance during deserialization
✔ Ensures same object

5️⃣ **Reflection Protection (Constructor Guard)**

❌ Without

```java
Constructor<Singleton> c = Singleton.class.getDeclaredConstructor();
c.newInstance(); // ❌ new object
```

✅ With

```java
private Singleton() {
    if (Holder.INSTANCE != null)
        throw new RuntimeException();
}
```

✔ Stops multiple instantiations
✔ Basic reflection safety

6️⃣ **Clone Protection**

❌ Without

```java
Singleton s2 = (Singleton) s1.clone(); // ❌ new instance
```

✅ With

```java
@Override
protected Object clone() throws CloneNotSupportedException {
    throw new CloneNotSupportedException();
}
```

✔ Prevents object cloning

---

### ❓ AutoBoxing & AutoUnboxing

### 📝 Answer

- Introduced in Java 5 to support Collections & Generics.
- **Autoboxing**: Automatic conversion between **primitive → wrapper**
- **Unboxing**: Automatic conversion between **wrapper → primitive**

```java
Integer a = 10;   // Autoboxing (int → Integer)
int b = a;        // Unboxing (Integer → int)

/* What actually happens (compiler level) */
Integer a = Integer.valueOf(10);
int b = a.intValue();
```

1️⃣ **Byte Conversion in Java**

This is called **WIDENING PRIMITIVE CONVERSION**

🧠 **Basic Rule (Must Remember)**

Java follows this **fixed widening order**:

```
byte  → short → int → long → float → double
char  → int   → long → float → double
```

- Conversion is **implicit**
- **No cast required**
- **No compile-time error**

✔ Example 1:

```java
byte b = 10;

int i = b;       // byte → int (widening)
float f = i;     // int → float
double d = f;    // float → double

System.out.println(d); // 10.0
```

✔ Example 2: Valid char Widening:

```java
char c = 'A';   // Unicode 65

int i = c;      // 65
long l = c;
float f = c;
double d = c;
```

❌ Invalid Conversions

```java
byte b = c;     // ❌ compile-time error
short s = c;    // ❌ compile-time error
```

✔ Example 3: Direct Conversion (Chain Happens Internally)

```java
byte b = 10;
double d = b;  // byte → int → double (internally)
```

> 💡 Compiler inserts intermediate widening automatically.

byte - 8 bits → `-128` to `127`
short - 16 bits → `-32,768` to `32,767`
char - 16 bits → `0` to `65,535`
int - 32 bits → `-2,147,483,648` to `2,147,483,647`
long - 64 bits `-9,223,372,036,854,775,808` to `9,223,372,036,854,775,807`
float - 32-bit floating point
double - 64-bit floating point

✔ Example 4: Widening vs Autoboxing (Very Important)

```java
byte b = 10;

Integer i = b;  // byte → int → Integer (widening + boxing)
Long l = b;     // byte → long → Long
```

✔ Example 5: Narrowing

```java
double d = 10.8;
int i = (int) d;     // 10  (fraction lost)

int x = 130;
byte b = (byte) x;  // -126 (overflow)
```

🤔❓ Why does Java allow `byte → double` but not `double → byte`?

- byte → double is widening (safe range)
- double → byte is narrowing (data loss risk)

---

### ❓ JVM Internal Question

### 📝 Answer

```java
Integer x = 100;
Integer y = 100;
System.out.println(x == y); // true (cached)

Integer p = 200;
Integer q = 200;
System.out.println(p == q); // false (new objects)
```

👉 **Rule**:

- `==` compares **references**
- `.equals()` compares **values**
- JVM caches Integer objects in the range: `-128` to `127`

Runtime behavior:

```java
x --> cached Integer(100)
y --> cached Integer(100)
```

✔ Same object reference

```java
System.out.println(x == y); // true
```

🔹 **Real Production Bug**

```java
Integer count = null;
int total = count; // NullPointerException (auto-unboxing)
```

💥 **Why?**

- JVM tries: `count.intValue()` causing **NullPointerException**

🔹 **Performance Impact**

```java
Long sum = 0L;
for (long i = 0; i < 1_000_000; i++) {
     sum += i; // boxing + unboxing every iteration
}
```

⚠️ **Hidden cost** → creates unnecessary objects → GC pressure

✅ Better:

```java
long sum = 0L;
```
