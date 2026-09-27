## DESIGN STRUCTURE (REST Orchestration)

### Repo 1 → dashboard-service

```
DashboardController
    ↓
DashboardService
    ↓
FeignClient → CreditCardService
    ↓
FeignClient → UpiService
    ↓
DashboardRepository (dashboard_db)
```

DashboardService is the orchestrator.

---

### Repo 2 → credit-card-service

```
CreditCardController
    ↓
CreditCardService
    ↓
CreditCardRepository (credit_db)
```

---

### Repo 3 → upi-service

```
UpiController
    ↓
UpiService
    ↓
UpiRepository (upi_db)
```

---

## 🔷 DATA FLOW

### User closes Credit Subtask

```
UI
  ↓
DashboardController
  ↓
DashboardService
  ↓
Feign → CreditCardService (PUT /credit/close)
  ↓
CreditCardService saves to credit_db
  ↓
Returns Response DTO
  ↓
DashboardService updates dashboard_db
```

> Same for UpiService.

---

## 🔷 DATABASE DESIGN

### 🟢 DATABASE 1 → dashboard_db

This DB holds task summary + subtask status.

**Table 1: dashboard_task**

| Column             | Type      | Key   | Description       |
| ------------------ | --------- | ----- | ----------------- |
| id                 | BIGINT    | ✅ PK | Unique Task ID    |
| task_name          | VARCHAR   |       | Name of task      |
| **overall_status** | VARCHAR   |       | **OPEN / CLOSED** |
| created_at         | TIMESTAMP |       | Created time      |
| updated_at         | TIMESTAMP |       | Last update       |

**Table 2: dashboard_subtask**

| Column           | Type      | Key       | Description                    |
| ---------------- | --------- | --------- | ------------------------------ |
| id               | BIGINT    | ✅ PK     | Subtask ID                     |
| **task_id**      | BIGINT    | 🔗 **FK** | **Links to dashboard_task.id** |
| **subtask_type** | VARCHAR   |           | **CREDIT / UPI / WALLET**      |
| **status**       | VARCHAR   |           | **OPEN / CLOSED**              |
| amount           | DECIMAL   |           | Payment amount                 |
| external_ref     | VARCHAR   |           | Transaction reference          |
| updated_at       | TIMESTAMP |           | Last update                    |

👉 Total tables in dashboard_db = **2**

### 🟢 DATABASE 2 → credit_db

**Table 1: credit_payment**

| Column                   | Type      | Key             | Description                        |
| ------------------------ | --------- | --------------- | ---------------------------------- |
| id                       | BIGINT    | ✅ PK           | Payment ID                         |
| **dashboard_subtask_id** | BIGINT    | **Logical Ref** | **Reference to dashboard_subtask** |
| card_number              | VARCHAR   |                 | Card                               |
| amount                   | DECIMAL   |                 | Amount                             |
| transaction_ref          | VARCHAR   |                 | Bank reference                     |
| status                   | VARCHAR   |                 | SUCCESS / FAILED                   |
| processed_at             | TIMESTAMP |                 | Processed time                     |

👉 Total tables in credit_db = **1**

### 🟢 DATABASE 3 → upi_db

**Table 1: upi_payment**

| Column                   | Type          | Key             | Description                        |
| ------------------------ | ------------- | --------------- | ---------------------------------- |
| id                       | BIGINT        | ✅ PK           | Unique Payment ID                  |
| **dashboard_subtask_id** | BIGINT        | **Logical Ref** | **Reference to dashboard_subtask** |
| upi_id                   | VARCHAR(100)  |                 | UPI ID (example: user@bank)        |
| amount                   | DECIMAL(15,2) |                 | Payment amount                     |
| transaction_ref          | VARCHAR(100)  |                 | Bank reference number              |
| status                   | VARCHAR(20)   |                 | SUCCESS / FAILED                   |
| processed_at             | TIMESTAMP     |                 | Processing timestamp               |

👉 Total tables in upi_db = **1**

### 🔷 TOTAL TABLE COUNT (Current System)

| DB           | Tables |
| ------------ | ------ |
| dashboard_db | 2      |
| credit_db    | 1      |
| upi_db       | 1      |

✅ Total = **4 tables**

---

## 🔷 HOW DATA IS PASSED

When CreditCardService closes subtask:

It returns:

```json
{
  "subtaskId": 10,
  "status": "CLOSED",
  "transactionRef": "TXN8899",
  "amount": 1000
}
```

DashboardService updates:

dashboard_subtask table:

```
status = CLOSED
external_ref = TXN8899
```

Then checks:

If all subtasks CLOSED → update dashboard_task.overall_status = CLOSED

---

## 🔷 FUTURE: ADD WalletService

Repo 4:

```
WalletController
WalletService
WalletRepository
```

New DB: wallet_db

### 🟢 DATABASE 4 → wallet_db

**Table 1: wallet_payment**

| Column                   | Type        |
| ------------------------ | ----------- |
| id                       | BIGINT (PK) |
| **dashboard_subtask_id** | BIGINT      |
| wallet_id                | VARCHAR     |
| amount                   | DECIMAL     |
| balance_before           | DECIMAL     |
| balance_after            | DECIMAL     |
| transaction_ref          | VARCHAR     |
| status                   | VARCHAR     |
| processed_at             | TIMESTAMP   |

---
