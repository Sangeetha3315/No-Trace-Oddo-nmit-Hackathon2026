import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CheckInCard from '../components/CheckInCard';
import LeaveBalanceTracker from '../components/LeaveBalanceTracker';
import StatusBadge from '../components/StatusBadge';
import { leaveService } from '../services/leaveService';
import { attendanceService } from '../services/attendanceService';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, DollarSign, UserCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [weeklyAttendance, setWeeklyAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [bal, leaves, weekly] = await Promise.all([
        leaveService.getLeaveBalance(),
        leaveService.getMyLeaves(),
        attendanceService.getMyWeeklyAttendance()
      ]);
      setLeaveBalance(bal);
      setRecentLeaves(leaves.slice(0, 4));
      setWeeklyAttendance(weekly);
    } catch (err) {
      console.error("Error loading dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const chartData = weeklyAttendance.map(a => ({
    day: a.date.substring(5),
    status: a.status === 'PRESENT' ? 1 : a.status === 'HALF_DAY' ? 0.5 : 0
  }));

  return (
    <div>
      <Navbar title={`Welcome back, ${user?.name || 'Employee'}`} subtitle="Here is your daily workday summary and status" />

      {/* Top 4 Quick Stat Cards */}
      <div className="stats-grid">
        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: 'var(--info-bg)', color: 'var(--info-color)' }}>
            <UserCheck size={26} />
          </div>
          <div className="stat-info">
            <h3>{user?.employeeId}</h3>
            <p>Employee ID</p>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: 'var(--success-bg)', color: 'var(--success-color)' }}>
            <Calendar size={26} />
          </div>
          <div className="stat-info">
            <h3>{leaveBalance ? leaveBalance.paidRemaining : 0} Days</h3>
            <p>Paid Leave Remaining</p>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: 'var(--warning-bg)', color: 'var(--warning-color)' }}>
            <Clock size={26} />
          </div>
          <div className="stat-info">
            <h3>{weeklyAttendance.filter(a => a.status === 'PRESENT').length} Days</h3>
            <p>Present This Week</p>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
            <DollarSign size={26} />
          </div>
          <div className="stat-info">
            <h3>Active</h3>
            <p>Payroll Status</p>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        {/* Card 1: Attendance Shift Action */}
        <CheckInCard onAttendanceChange={fetchDashboardData} />

        {/* Card 2: Weekly Attendance Chart */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Weekly Attendance Overview</h3>
          {chartData.length > 0 ? (
            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} />
                  <YAxis domain={[0, 1]} ticks={[0, 0.5, 1]} stroke="var(--text-muted)" fontSize={12} />
                  <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
                  <Bar dataKey="status" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="empty-state">No weekly attendance recorded yet.</div>
          )}
        </div>
      </div>

      {/* Visual Leave Balance Tracker */}
      <LeaveBalanceTracker balance={leaveBalance} />

      {/* Recent Leave Requests */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div className="flex-between" style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Leave Applications</h3>
        </div>

        {recentLeaves.length > 0 ? (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Dates</th>
                  <th>Days</th>
                  <th>Remarks</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentLeaves.map(leave => (
                  <tr key={leave.id}>
                    <td style={{ fontWeight: 600 }}>{leave.leaveType}</td>
                    <td>{leave.startDate} to {leave.endDate}</td>
                    <td>{leave.totalDays} day(s)</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{leave.remarks || '--'}</td>
                    <td><StatusBadge status={leave.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">No recent leave requests found.</div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
