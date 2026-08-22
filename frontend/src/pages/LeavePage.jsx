import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import LeaveBalanceTracker from '../components/LeaveBalanceTracker';
import HolidayCalendar from '../components/HolidayCalendar';
import StatusBadge from '../components/StatusBadge';
import ExportCsvButton from '../components/ExportCsvButton';
import { leaveService } from '../services/leaveService';
import { useAuth } from '../context/AuthContext';
import { Plus, Calendar, FileText, CheckCircle2, XCircle } from 'lucide-react';

const LeavePage = () => {
  const { user } = useAuth();
  const isHR = user?.role === 'HR' || user?.role === 'ADMIN';

  const [leaves, setLeaves] = useState([]);
  const [balance, setBalance] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    leaveType: 'PAID',
    startDate: '',
    endDate: '',
    remarks: ''
  });

  const loadData = async () => {
    try {
      const [balData, listData] = await Promise.all([
        leaveService.getLeaveBalance(),
        isHR ? leaveService.getAllLeaves() : leaveService.getMyLeaves()
      ]);
      setBalance(balData);
      setLeaves(listData);
    } catch (err) {
      console.error("Failed to load leave records", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await leaveService.applyForLeave(formData);
      setShowApplyModal(false);
      setFormData({ leaveType: 'PAID', startDate: '', endDate: '', remarks: '' });
      alert("Leave application submitted successfully!");
      loadData();
    } catch (err) {
      alert("Application failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleReview = async (id, status) => {
    try {
      await leaveService.reviewLeave(id, status, status === 'APPROVED' ? 'Approved by HR' : 'Rejected by HR');
      loadData();
    } catch (err) {
      alert("Review failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <Navbar title="Leave & Time-Off Management" subtitle="Submit leave applications, track balances, and manage time-off requests" />

      {/* Visual Balance Tracker */}
      <LeaveBalanceTracker balance={balance} />

      {/* Top Bar with Apply Button & Export */}
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <button onClick={() => setShowApplyModal(true)} className="btn btn-primary">
          <Plus size={18} /> Apply For Leave
        </button>

        <ExportCsvButton data={leaves} filename="leave-requests.csv" title="Export Leaves CSV" />
      </div>

      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        {/* Table of Leave Requests */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
            {isHR ? "All Employee Leave Requests" : "My Leave Request Lifecycle"}
          </h3>

          {leaves.length > 0 ? (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    {isHR && <th>Employee</th>}
                    <th>Type</th>
                    <th>Dates</th>
                    <th>Days</th>
                    <th>Status</th>
                    {isHR && <th>Review</th>}
                  </tr>
                </thead>
                <tbody>
                  {leaves.map(l => (
                    <tr key={l.id}>
                      {isHR && <td style={{ fontWeight: 600 }}>{l.employeeName}</td>}
                      <td><StatusBadge status={l.leaveType} /></td>
                      <td>{l.startDate} to {l.endDate}</td>
                      <td>{l.totalDays}d</td>
                      <td><StatusBadge status={l.status} /></td>
                      {isHR && (
                        <td>
                          {l.status === 'PENDING' ? (
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                              <button onClick={() => handleReview(l.id, 'APPROVED')} className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}>
                                <CheckCircle2 size={12} />
                              </button>
                              <button onClick={() => handleReview(l.id, 'REJECTED')} className="btn btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}>
                                <XCircle size={12} />
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Reviewed</span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">No leave requests found — apply for your first one above!</div>
          )}
        </div>

        {/* Holiday Calendar Component */}
        <HolidayCalendar />
      </div>

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div className="modal-overlay" onClick={() => setShowApplyModal(false)}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Apply for Leave</h3>
              <button onClick={() => setShowApplyModal(false)} className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem' }}>X</button>
            </div>

            <form onSubmit={handleApply}>
              <div className="form-group">
                <label>Leave Category</label>
                <select
                  className="input-control"
                  value={formData.leaveType}
                  onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                >
                  <option value="PAID">PAID LEAVE</option>
                  <option value="SICK">SICK LEAVE</option>
                  <option value="UNPAID">UNPAID LEAVE</option>
                </select>
              </div>

              <div className="grid-2" style={{ gap: '1rem', marginBottom: '0' }}>
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    className="input-control"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    className="input-control"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Reason / Remarks</label>
                <textarea
                  className="input-control"
                  rows={3}
                  placeholder="Explain reason for leave..."
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
                Submit Leave Application
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeavePage;
