# Dayflow HRMS — Entity Relationship Diagram (ERD)

This document describes the database schema, relational structure, and integrity constraints powering **Dayflow HRMS**.

## Mermaid ER Diagram

```mermaid
erDiagram
    USERS ||--|| EMPLOYEE_PROFILES : "has profile"
    USERS ||--o{ ATTENDANCE : "logs attendance"
    USERS ||--o{ LEAVE_REQUESTS : "submits leaves"
    USERS ||--o{ LEAVE_REQUESTS : "reviews leaves (HR)"
    USERS ||--|| PAYROLL : "has salary structure"
    USERS ||--o{ AUDIT_LOG : "triggers action (actor)"
    USERS ||--o{ AUDIT_LOG : "is subject of action (target)"

    USERS {
        bigint id PK
        string employee_id UK
        string email UK
        string password_hash
        string role
        boolean is_verified
        timestamp created_at
    }

    EMPLOYEE_PROFILES {
        bigint id PK
        bigint user_id FK, UK
        string name
        string phone
        text address
        string job_title
        string department
        date date_of_joining
        text profile_picture_url
    }

    ATTENDANCE {
        bigint id PK
        bigint user_id FK
        date date
        timestamp check_in_time
        timestamp check_out_time
        string status
    }

    LEAVE_REQUESTS {
        bigint id PK
        bigint user_id FK
        string leave_type
        date start_date
        date end_date
        text remarks
        string status
        bigint reviewed_by FK
        text reviewer_comments
        timestamp created_at
    }

    PAYROLL {
        bigint id PK
        bigint user_id FK, UK
        numeric base_salary
        numeric allowances
        numeric deductions
        date effective_from
    }

    AUDIT_LOG {
        bigint id PK
        bigint actor_user_id FK
        string action
        bigint target_user_id FK
        text description
        timestamp timestamp
    }
```

## Relational Summary & Constraints

1. **`users` -> `employee_profiles` (1 : 1)**
   - Mandatory 1:1 relation. `user_id` is a unique foreign key referencing `users(id)` with `ON DELETE CASCADE`.

2. **`users` -> `attendance` (1 : N)**
   - Unique composite constraint on `(user_id, date)` ensures an employee can check in only once per calendar day.

3. **`users` -> `leave_requests` (1 : N & Self-Reference)**
   - `user_id` FK maps to the requester.
   - `reviewed_by` nullable FK maps to the HR Admin user approving/rejecting the request.

4. **`users` -> `payroll` (1 : 1)**
   - Each employee has exactly one active salary breakdown (`base_salary`, `allowances`, `deductions`).

5. **`users` -> `audit_log` (1 : N)**
   - Tracks security events, profile updates, leave decisions, and payroll changes.
