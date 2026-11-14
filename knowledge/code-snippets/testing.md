# Testing — Code Snippets

> Test code interviewers ask you to write from memory.

### 1. Unit test with Mockito
```java
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {
  @Mock PaymentClient payments;
  @Mock OrderRepository orders;
  @InjectMocks OrderService service;

  @Test
  void placesOrderAndChargesCard() {
    when(payments.charge(any())).thenReturn(Receipt.ok("r-1"));

    Order placed = service.place(new Order("c-1", new BigDecimal("500")));

    assertThat(placed.status()).isEqualTo(Status.PAID);
    verify(payments).charge(argThat(c -> c.amount().equals(new BigDecimal("500"))));
    verify(orders).save(placed);
  }

  @Test
  void failedPaymentThrowsAndSavesNothing() {
    when(payments.charge(any())).thenThrow(new PaymentDeclined());
    assertThrows(PaymentDeclined.class, () -> service.place(new Order("c-1", BigDecimal.TEN)));
    verifyNoInteractions(orders);
  }
}
```

### 2. Parameterized test
```java
@ParameterizedTest
@CsvSource({ "100, NONE, 100.00", "100, FESTIVE, 90.00", "50, FLAT100, 0.00" })
void discounts(BigDecimal amount, String code, BigDecimal expected) {
  assertEquals(expected, pricing.apply(amount, code));
}
```

### 3. Controller test with MockMvc
```java
@WebMvcTest(UserController.class)
class UserControllerTest {
  @Autowired MockMvc mvc;
  @MockitoBean UserService service;

  @Test
  void returnsUser() throws Exception {
    when(service.get(1L)).thenReturn(new UserDto(1L, "Asha"));
    mvc.perform(get("/api/users/1"))
       .andExpect(status().isOk())
       .andExpect(jsonPath("$.name").value("Asha"));
  }

  @Test
  void rejectsInvalidEmail() throws Exception {
    mvc.perform(post("/api/users").contentType(APPLICATION_JSON).content("""
           {"name":"A","email":"not-an-email"}"""))
       .andExpect(status().isUnprocessableEntity());
  }
}
```

### 4. Integration test with Testcontainers
```java
@SpringBootTest
@Testcontainers
class OrderRepositoryIT {
  @Container @ServiceConnection
  static PostgreSQLContainer<?> db = new PostgreSQLContainer<>("postgres:16");

  @Autowired OrderRepository repo;

  @Test
  void savesAndFinds() {
    Order saved = repo.save(new Order("c-1", BigDecimal.TEN));
    assertThat(repo.findById(saved.getId())).isPresent();
  }
}
```

### 5. Frontend: React Testing Library
```jsx
test("shows an error for a wrong password", async () => {
  server.use(http.post("/api/login", () => HttpResponse.json({}, { status: 401 })));   // MSW mock
  render(<Login />);
  await userEvent.type(screen.getByLabelText(/email/i), "a@b.com");
  await userEvent.type(screen.getByLabelText(/password/i), "wrong");
  await userEvent.click(screen.getByRole("button", { name: /log in/i }));
  expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument();
});
```

### 6. E2E with Playwright
```ts
test("user can check out", async ({ page }) => {
  await page.goto("/products/42");
  await page.getByRole("button", { name: "Add to cart" }).click();
  await page.getByRole("link", { name: "Cart" }).click();
  await page.getByRole("button", { name: "Pay" }).click();
  await expect(page.getByText("Order confirmed")).toBeVisible();
});
```

### 7. pytest with a mock
```python
def test_sends_welcome_email(mocker):
    send = mocker.patch("app.users.send_email")
    register("a@b.com")
    send.assert_called_once_with("a@b.com", subject="Welcome!")
```
