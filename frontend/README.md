# Dayflow HRMS — Frontend Web Application (`/frontend`)

The frontend application for **Dayflow HRMS** is built with **React 18, Vite, React Router v6, Axios, Recharts, Lucide Icons, and Vanilla CSS glassmorphic design system**.

## Features & Pages
- **Authentication**: Sign In & Sign Up pages with client-side & server-side validation messages and instant demo quick-fill buttons.
- **Role-Based Protection**: Protected route wrapper redirecting unauthorized access (e.g., standard employees cannot access `/admin/*`).
- **Employee Dashboard**: Work shift check-in action, weekly attendance Recharts bar chart, visual leave balance tracker, and recent activity log.
- **HR Admin Dashboard**: Total workforce metrics, present/absent counters, live leave approval queue with instant approve/reject actions, and leave request analytics.
- **My Profile**: View full details; employee edit mode strictly limited to phone, address, and avatar URL per security guidelines.
- **Attendance**: Live shift clock, daily check-in/out, status filter (PRESENT, ABSENT, HALF_DAY, LEAVE), and search.
- **Leave Management**: Leave application form, status lifecycle tracker (PENDING -> APPROVED / REJECTED), leave balance visual progress bars, and Holiday Calendar.
- **Payroll**: Employee read-only payslip breakdown card (Base + Allowances - Deductions = Net Payable); HR Admin salary structure editor.
- **Employee Directory (HR)**: Complete workforce table with search and full administrative profile editing.
- **Audit Logs (HR)**: Real-time security audit log tracking logins, profile edits, leave approvals, and payroll adjustments.
- **CSV Data Export**: One-click CSV download for attendance, leave requests, employee lists, payroll, and audit logs.

## Security & Token Storage Tradeoff
In accordance with production security standards:
- Access Tokens (Short-lived 24h JWT) and Refresh Tokens (7-day JWT) are stored in `localStorage` for hackathon web demo simplicity.
- Axios request interceptor automatically attaches `Authorization: Bearer <token>` to every API call.
- Axios response interceptor catches `401 Unauthorized` responses and automatically executes the silent token refresh flow with `/api/auth/refresh`.

## How to Install & Run Locally

### Prerequisites
- Node.js 18+ installed

### Development Server
```bash
cd frontend
npm install
npm run dev
```
The application will launch at `http://localhost:5173`.

### Production Build
```bash
npm run build
npm run preview
```
