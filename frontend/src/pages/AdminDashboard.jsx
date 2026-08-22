import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import ExportCsvButton from '../components/ExportCsvButton';
import { adminService } from '../services/adminService';
import { leaveService } from '../services/leaveService';
import { Users, UserCheck, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewComment, setReviewComment] = useState('');
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);

  const fetchAdminData = async () => {
    try {
      const [statsData, leavesData] = await Promise.all([
        adminService.getDashboardStats(),
        leaveService.getAllLeaves('PENDING')
      ]);
      setStats(statsData);
      setPendingLeaves(leavesData);
    } catch (err) {
      console.error("Failed to load admin dashboard stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleReview = async (leaveId, status) => {
    try {
      await leaveService.reviewLeave(leaveId, status, reviewComment || (status === 'APPROVED' ? 'Approved by HR' : 'Rejected by HR'));
      setReviewComment('');
      setSelectedLeaveId(null);
      fetchAdminData();
    } catch (err) {
      alert("Review action failed: " + (err.response?.data?.message || err.message));
    }
  };

  const pieData = [
    { name: 'Paid Approved', value: stats?.leaveTypeDistribution?.PAID || 2, color: '#10b981' },
    { name: 'Pending Review', value: stats?.pendingLeaveRequests || 1, color: '#f59e0b' },
    { name: 'Rejected', value: stats?.leaveTypeDistribution?.REJECTED || 0, color: '#ef4444' },
  ];

  return (
    <div>
      <Navbar title="HR Admin Command Center" subtitle="Comprehensive workforce analytics, approval queues, and employee management" />

      {/* Top 4 Stat Cards */}
      <div className="stats-grid">
        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: 'var(--info-bg)', color: 'var(--info-color)' }}>
            <Users size={26} />
          </div>
          <div className="stat-info">
            <h3>{stats?.totalEmployees || 0}</h3>
            <p>Total Workforce</p>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: 'var(--success-bg)', color: 'var(--success-color)' }}>
            <UserCheck size={26} />
          </div>
          <div className="stat-info">
            <h3>{stats?.presentToday || 0}</h3>
            <p>Present Today</p>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: 'var(--warning-bg)', color: 'var(--warning-color)' }}>
            <Clock size={26} />
          </div>
          <div className="stat-info">
            <h3>{stats?.pendingLeaveRequests || 0}</h3>
            <p>Pending Leave Requests</p>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: 'var(--danger-bg)', color: 'var(--danger-color)' }}>
            <AlertTriangle size={26} />
          </div>
          <div className="stat-info">
            <h3>{stats?.absentToday || 0}</h3>
            <p>Absent / Off Today</p>
          </div>
        </div>
      </div>

      {/* Grid: Pending Approvals & Leave Distribution Chart */}
      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        {/* Pending Leave Approval Queue */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Leave Approval Queue</h3>
            <ExportCsvButton data={pendingLeaves} filename="pending-leaves.csv" title="Export CSV" />
          </div>

          {pendingLeaves.length > 0 ? (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Type</th>
                    <th>Dates</th>
                    <th>Remarks</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingLeaves.map(leave => (
                    <tr key={leave.id}>
                      <td style={{ fontWeight: 600 }}>{leave.employeeName} ({leave.employeeId})</td>
                      <td><StatusBadge status={leave.leaveType} /></td>
                      <td>{leave.startDate} to {leave.endDate} ({leave.totalDays}d)</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{leave.remarks || 'None'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => handleReview(leave.id, 'APPROVED')}
                            className="btn btn-primary"
                            style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                          >
                            <CheckCircle size={14} /> Approve
                          </button>
                          <button
                            onClick={() => handleReview(leave.id, 'REJECTED')}
                            className="btn btn-danger"
                            style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">No pending leave requests in queue.</div>
          )}
        </div>

        {/* Leave Distribution Pie Chart */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Leave Request Analytics</h3>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
