-- ==========================================
-- Dayflow HRMS - Sample Seed Data Script
-- Seed data: 1 HR Admin & 5 Employees
-- Default password for HR Admin: Admin@1234
-- Default password for Employees: User@1234
-- ==========================================

-- Clear existing data
TRUNCATE audit_log, payroll, leave_requests, attendance, employee_profiles, users RESTART IDENTITY CASCADE;

-- 1. SEED USERS
-- Password for HR Admin (admin@dayflow.com): Admin@1234 -> $2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a
-- Password for Employees (empX@dayflow.com): User@1234 -> $2a$10$e965.d1M./F7QO6kE6k3ueH.d/QzN88K7n4/0lVfJjH51G06L6mWi
INSERT INTO users (employee_id, email, password_hash, role, is_verified, created_at) VALUES
('EMP001', 'admin@dayflow.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'HR', TRUE, CURRENT_TIMESTAMP - INTERVAL '180 days'),
('EMP002', 'emp1@dayflow.com', '$2a$10$e965.d1M./F7QO6kE6k3ueH.d/QzN88K7n4/0lVfJjH51G06L6mWi', 'EMPLOYEE', TRUE, CURRENT_TIMESTAMP - INTERVAL '150 days'),
('EMP003', 'emp2@dayflow.com', '$2a$10$e965.d1M./F7QO6kE6k3ueH.d/QzN88K7n4/0lVfJjH51G06L6mWi', 'EMPLOYEE', TRUE, CURRENT_TIMESTAMP - INTERVAL '120 days'),
('EMP004', 'emp3@dayflow.com', '$2a$10$e965.d1M./F7QO6kE6k3ueH.d/QzN88K7n4/0lVfJjH51G06L6mWi', 'EMPLOYEE', TRUE, CURRENT_TIMESTAMP - INTERVAL '90 days'),
('EMP005', 'emp4@dayflow.com', '$2a$10$e965.d1M./F7QO6kE6k3ueH.d/QzN88K7n4/0lVfJjH51G06L6mWi', 'EMPLOYEE', TRUE, CURRENT_TIMESTAMP - INTERVAL '60 days'),
('EMP006', 'emp5@dayflow.com', '$2a$10$e965.d1M./F7QO6kE6k3ueH.d/QzN88K7n4/0lVfJjH51G06L6mWi', 'EMPLOYEE', TRUE, CURRENT_TIMESTAMP - INTERVAL '30 days');

-- 2. SEED EMPLOYEE PROFILES
INSERT INTO employee_profiles (user_id, name, phone, address, job_title, department, date_of_joining, profile_picture_url) VALUES
(1, 'Sarah Jenkins', '+1 (555) 019-2834', '100 Tech Plaza, San Francisco, CA', 'Head of Human Resources', 'Human Resources', '2023-01-15', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'),
(2, 'Alex Rivera', '+1 (555) 012-9876', '456 Innovation Way, Austin, TX', 'Senior Full Stack Engineer', 'Engineering', '2023-03-01', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
(3, 'Priya Sharma', '+1 (555) 014-4321', '789 Silicon Blvd, San Jose, CA', 'UI/UX Designer', 'Design', '2023-04-15', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'),
(4, 'Marcus Chen', '+1 (555) 018-7654', '321 Cloud Lane, Seattle, WA', 'DevOps Specialist', 'Infrastructure', '2023-06-01', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
(5, 'Elena Rostova', '+1 (555) 016-5544', '654 Data Street, New York, NY', 'Data Analyst', 'Analytics', '2023-08-10', 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150'),
(6, 'David Kim', '+1 (555) 011-2233', '987 Agile Drive, Boston, MA', 'Product Specialist', 'Product', '2023-10-01', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150');

-- 3. SEED PAYROLL RECORDS
INSERT INTO payroll (user_id, base_salary, allowances, deductions, effective_from) VALUES
(1, 95000.00, 12000.00, 8500.00, '2023-01-15'),
(2, 85000.00, 10000.00, 7200.00, '2023-03-01'),
(3, 72000.00, 8000.00, 5800.00, '2023-04-15'),
(4, 88000.00, 11000.00, 7500.00, '2023-06-01'),
(5, 68000.00, 7500.00, 5200.00, '2023-08-10'),
(6, 65000.00, 7000.00, 4900.00, '2023-10-01');

-- 4. SEED ATTENDANCE RECORDS (Past few days)
INSERT INTO attendance (user_id, date, check_in_time, check_out_time, status) VALUES
-- Sarah Jenkins (Admin)
(1, CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE - INTERVAL '2 days' + TIME '09:00:00', CURRENT_DATE - INTERVAL '2 days' + TIME '17:30:00', 'PRESENT'),
(1, CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE - INTERVAL '1 day' + TIME '08:55:00', CURRENT_DATE - INTERVAL '1 day' + TIME '17:45:00', 'PRESENT'),
(1, CURRENT_DATE, CURRENT_DATE + TIME '09:02:00', NULL, 'PRESENT'),

-- Alex Rivera
(2, CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE - INTERVAL '2 days' + TIME '09:15:00', CURRENT_DATE - INTERVAL '2 days' + TIME '18:00:00', 'PRESENT'),
(2, CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE - INTERVAL '1 day' + TIME '09:10:00', CURRENT_DATE - INTERVAL '1 day' + TIME '17:50:00', 'PRESENT'),
(2, CURRENT_DATE, CURRENT_DATE + TIME '09:05:00', NULL, 'PRESENT'),

-- Priya Sharma
(3, CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE - INTERVAL '2 days' + TIME '09:30:00', CURRENT_DATE - INTERVAL '2 days' + TIME '13:30:00', 'HALF_DAY'),
(3, CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE - INTERVAL '1 day' + TIME '09:00:00', CURRENT_DATE - INTERVAL '1 day' + TIME '17:30:00', 'PRESENT'),
(3, CURRENT_DATE, CURRENT_DATE + TIME '08:58:00', NULL, 'PRESENT'),

-- Marcus Chen
(4, CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE - INTERVAL '2 days' + TIME '08:45:00', CURRENT_DATE - INTERVAL '2 days' + TIME '17:15:00', 'PRESENT'),
(4, CURRENT_DATE - INTERVAL '1 day', NULL, NULL, 'ABSENT'),
(4, CURRENT_DATE, CURRENT_DATE + TIME '09:12:00', NULL, 'PRESENT'),

-- Elena Rostova
(5, CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE - INTERVAL '2 days' + TIME '09:00:00', CURRENT_DATE - INTERVAL '2 days' + TIME '17:30:00', 'PRESENT'),
(5, CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE - INTERVAL '1 day' + TIME '09:00:00', CURRENT_DATE - INTERVAL '1 day' + TIME '17:30:00', 'PRESENT'),

-- David Kim
(6, CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE - INTERVAL '2 days' + TIME '09:00:00', CURRENT_DATE - INTERVAL '2 days' + TIME '17:30:00', 'PRESENT'),
(6, CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE - INTERVAL '1 day' + TIME '09:00:00', CURRENT_DATE - INTERVAL '1 day' + TIME '17:30:00', 'PRESENT');

-- 5. SEED LEAVE REQUESTS
INSERT INTO leave_requests (user_id, leave_type, start_date, end_date, remarks, status, reviewed_by, reviewer_comments, created_at) VALUES
(2, 'PAID', CURRENT_DATE + INTERVAL '5 days', CURRENT_DATE + INTERVAL '7 days', 'Attending tech conference', 'APPROVED', 1, 'Approved. Enjoy the conference!', CURRENT_TIMESTAMP - INTERVAL '3 days'),
(3, 'SICK', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '4 days', 'Fever and rest', 'APPROVED', 1, 'Get well soon', CURRENT_TIMESTAMP - INTERVAL '6 days'),
(4, 'UNPAID', CURRENT_DATE + INTERVAL '10 days', CURRENT_DATE + INTERVAL '14 days', 'Personal family trip', 'PENDING', NULL, NULL, CURRENT_TIMESTAMP - INTERVAL '1 day'),
(5, 'PAID', CURRENT_DATE + INTERVAL '15 days', CURRENT_DATE + INTERVAL '18 days', 'Annual vacation', 'PENDING', NULL, NULL, CURRENT_TIMESTAMP - INTERVAL '2 hours');

-- 6. SEED AUDIT LOGS
INSERT INTO audit_log (actor_user_id, action, target_user_id, description, timestamp) VALUES
(1, 'USER_REGISTERED', 2, 'New employee Alex Rivera registered.', CURRENT_TIMESTAMP - INTERVAL '150 days'),
(1, 'PAYROLL_UPDATED', 2, 'Salary structure configured for Alex Rivera.', CURRENT_TIMESTAMP - INTERVAL '149 days'),
(1, 'LEAVE_APPROVED', 2, 'Leave request #1 approved by Sarah Jenkins.', CURRENT_TIMESTAMP - INTERVAL '3 days'),
(2, 'ATTENDANCE_CHECK_IN', 2, 'Employee Alex Rivera checked in.', CURRENT_TIMESTAMP - INTERVAL '1 day'),
(2, 'ATTENDANCE_CHECK_OUT', 2, 'Employee Alex Rivera checked out.', CURRENT_TIMESTAMP - INTERVAL '1 day');
