# Dayflow HRMS — Backend Service (`/backend`)

The backend layer for **Dayflow HRMS** is built with **Java 17, Spring Boot 3.2.3, Spring Security, JWT Auth, Spring Data JPA, and Hibernate**.

## Architecture & Package Structure

```
com.dayflow
├── config          # SecurityConfig, CorsConfig
├── controller      # AuthController, EmployeeController, AttendanceController, LeaveController, PayrollController, AdminController
├── dto             # Request & Response DTOs with Bean Validation (@Valid, @NotBlank, etc.)
├── entity          # User, EmployeeProfile, Attendance, LeaveRequest, Payroll, AuditLog, Enums
├── exception       # GlobalExceptionHandler & Custom Exceptions (ResourceNotFound, RateLimitExceeded, etc.)
├── repository      # Spring Data JPA Repositories
├── security        # JwtTokenProvider, JwtAuthenticationFilter, CustomUserDetailsService, RateLimiterService
└── service         # Business logic layer (Auth, Employee, Attendance, Leave, Payroll, Admin, AuditLog)
```

## Security & Access Control
- **Authentication**: JWT Access Token (24h validity) + Refresh Token (7 days validity).
- **Password Hashing**: BCrypt with strength factor 10.
- **Role Enforcement**: Endpoint authorization configured in `SecurityConfig` and method-level `@PreAuthorize("hasAnyRole('HR', 'ADMIN')")`.
- **Data Isolation**: API-level validation prevents employees from viewing or modifying other employees' profile or salary data.
- **Rate Limiting**: `RateLimiterService` locks login attempts after 5 consecutive failed attempts per email for 15 minutes.

## How to Build & Run Locally

### Prerequisites
- JDK 17+ installed
- Maven 3.8+ (or use `./mvnw`)

### Running with Default In-Memory H2 (Instant Demo)
No database setup required! The app initializes an in-memory database with pre-populated demo data:
```bash
cd backend
mvn spring-boot:run
```
- Server API URL: `http://localhost:8080`
- H2 Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:dayflowdb`, User: `sa`, Password: empty)

### Running with PostgreSQL
Pass your database environment variables:
```bash
export DB_URL=jdbc:postgresql://localhost:5432/dayflow_db
export DB_USERNAME=postgres
export DB_PASSWORD=postgres
export DB_DRIVER=org.postgresql.Driver
export DB_DIALECT=org.hibernate.dialect.PostgreSQLDialect

mvn spring-boot:run
```

## Postman API Collection
Find the ready-to-import Postman collection in `postman_collection.json` under `/backend`.
Import into Postman to immediately test endpoints for authentication, attendance check-in/out, leave approvals, payroll visibility, and administrative statistics.
