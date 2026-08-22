# Dayflow HRMS — Master Setup & Startup Guide

**"Dayflow — Every workday, perfectly aligned."**

This document details the startup order, configuration, and default demo credentials for the 3-tier Dayflow Human Resource Management System.

---

## 🏗️ Directory Architecture Overview

- **`/database`**: PostgreSQL DDL (`schema.sql`), Seed script (`seed.sql`), ER Diagram (`ER_DIAGRAM.md`), and setup guide.
- **`/backend`**: Java 17, Spring Boot 3.2.3 REST API with Spring Security, JWT, JPA, Validation, H2/PostgreSQL options, and Postman API collection (`postman_collection.json`).
- **`/frontend`**: React 18 + Vite SPA with Glassmorphic CSS design system, Auth Context, Recharts analytics, role protection, CSV export, and leave balance tracker.

---

## 🔑 Default Demo Login Credentials

The project comes pre-seeded with ready-to-test accounts for both roles:

| Role | Email | Password | Employee ID | Name |
| :--- | :--- | :--- | :--- | :--- |
| **HR / Admin** | `admin@dayflow.com` | `Admin@1234` | `EMP001` | Sarah Jenkins |
| **Employee** | `emp1@dayflow.com` | `User@1234` | `EMP002` | Alex Rivera |
| **Employee** | `emp2@dayflow.com` | `User@1234` | `EMP003` | Priya Sharma |
| **Employee** | `emp3@dayflow.com` | `User@1234` | `EMP004` | Marcus Chen |

*Note: On the login page, you can also click the quick demo login shortcuts for one-click authentication.*

---

## 🚀 Execution Order & Launch Steps

To ensure zero connection errors, start the components in the following order:

```
Step 1: Database (Optional for PostgreSQL) ──► Step 2: Backend API ──► Step 3: Frontend Web App
```

### Step 1: Database Setup (`/database`) — *Optional*
> **Note:** The Spring Boot backend in `/backend` is configured to run out-of-the-box using an embedded in-memory database pre-loaded with seed data if PostgreSQL is not active!

If using a local PostgreSQL database:
```bash
# Create PostgreSQL Database
createdb -U postgres dayflow_db

# Apply Schema DDL & Seed Data
psql -U postgres -d dayflow_db -f database/schema.sql
psql -U postgres -d dayflow_db -f database/seed.sql
```

### Step 2: Start Backend Service (`/backend`)
```bash
cd backend
mvn spring-boot:run
```
- API Base URL: `http://localhost:8080`
- H2 Web Console (if using H2): `http://localhost:8080/h2-console`
- Postman Collection: [backend/postman_collection.json](file:///c:/Users/user/No-Trace-Oddo-nmit-Hackathon2026/backend/postman_collection.json)

### Step 3: Start Frontend Application (`/frontend`)
```bash
cd frontend
npm install
npm run dev
```
- Application Web URL: `http://localhost:5173`

---

## 🧪 Verification & Feature Map

1. **Auth & Security**: JWT access/refresh token flow, BCrypt password hashing, login rate-limiting (5 attempts max).
2. **Employee Dashboard**: Attendance check-in/out button, weekly attendance chart, leave balance cards.
3. **HR Admin Dashboard**: Workforce metrics, pending leave approvals queue with instant approve/reject.
4. **Profile Management**: Profile picture, personal details, employee self-update vs admin full edit.
5. **Attendance Management**: Daily shift clock, weekly history, company-wide attendance filters.
6. **Leave Management**: Leave application modal (Paid, Sick, Unpaid), approval status lifecycle, Holiday Calendar.
7. **Payroll Management**: Payslip view with base salary, allowances, deductions; HR salary structure editor.
8. **Audit Trail**: Real-time logging of authentication and administrative events.
9. **CSV Export**: One-click CSV export available across attendance, leave, payroll, and audit views.
