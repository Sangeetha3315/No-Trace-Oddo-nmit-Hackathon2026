# Dayflow HRMS — Database Module (`/database`)

This folder contains the normalization scripts, indexing rules, entity diagrams, and demo seed data for PostgreSQL.

## File Overview

- `schema.sql`: Production PostgreSQL DDL script creating `users`, `employee_profiles`, `attendance`, `leave_requests`, `payroll`, and `audit_log` tables with foreign keys and performance indexes.
- `seed.sql`: Data insertion script containing 1 HR Admin user (`admin@dayflow.com`) and 5 Employee users (`emp1` - `emp5`) with pre-configured profiles, historical attendance, sample leave requests, and salary structures.
- `ER_DIAGRAM.md`: Detailed Mermaid entity relationship diagram and entity interaction notes.

## PostgreSQL Setup Instructions

### 1. Using local PostgreSQL instance
```bash
# Create database
createdb -U postgres dayflow_db

# Run DDL schema
psql -U postgres -d dayflow_db -f schema.sql

# Run seed script
psql -U postgres -d dayflow_db -f seed.sql
```

### 2. Using Docker
```bash
docker run --name dayflow-postgres -e POSTGRES_DB=dayflow_db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15-alpine
```
Then load schema and seed using standard `psql` or database tools (DBeaver, pgAdmin).

## Connection String Format
- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `dayflow_db`
- **User**: `postgres`
- **Password**: `postgres`
- **JDBC URL**: `jdbc:postgresql://localhost:5432/dayflow_db`

> Note: The Spring Boot backend in `/backend` can connect directly to PostgreSQL or automatically launch using an embedded in-memory H2 database in PostgreSQL mode if PostgreSQL is not installed locally.
