import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ExportCsvButton from '../components/ExportCsvButton';
import { payrollService } from '../services/payrollService';
import { useAuth } from '../context/AuthContext';
import { DollarSign, Shield, Edit, CreditCard, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const PayrollPage = () => {
  const { user } = useAuth();
  const isHR = user?.role === 'HR' || user?.role === 'ADMIN';

  const [payroll, setPayroll] = useState(null);
  const [allPayrolls, setAllPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPayroll, setEditingPayroll] = useState(null);

  const [editFormData, setEditFormData] = useState({
    baseSalary: '',
    allowances: '',
    deductions: '',
    effectiveFrom: new Date().toISOString().split('T')[0]
  });

  const loadPayrollData = async () => {
    try {
      if (isHR) {
        const list = await payrollService.getAllPayrolls();
        setAllPayrolls(list);
      } else {
        const myPay = await payrollService.getMyPayroll();
        setPayroll(myPay);
      }
    } catch (err) {
      console.error("Failed to load payroll details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayrollData();
  }, []);

  const handleEditClick = (p) => {
    setEditingPayroll(p);
    setEditFormData({
      baseSalary: p.baseSalary,
      allowances: p.allowances,
      deductions: p.deductions,
      effectiveFrom: p.effectiveFrom || new Date().toISOString().split('T')[0]
    });
  };

  const handleSavePayroll = async (e) => {
    e.preventDefault();
    try {
      await payrollService.updatePayroll(editingPayroll.userId, editFormData);
      alert("Salary structure updated successfully!");
      setEditingPayroll(null);
      loadPayrollData();
    } catch (err) {
      alert("Payroll update failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <Navbar title="Payroll & Salary Structure" subtitle="Transparent compensation statements, allowances, deductions, and payslips" />

      {!isHR && payroll && (
        <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '720px', margin: '0 auto' }}>
          <div className="flex-between" style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Payslip Summary Statement</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Employee: {payroll.employeeName} ({payroll.employeeId})</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Effective From</div>
              <div style={{ fontWeight: 700 }}>{payroll.effectiveFrom}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Base Salary</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>${Number(payroll.baseSalary).toLocaleString()}</div>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--success-color)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <ArrowUpRight size={16} /> Allowances
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success-color)' }}>+${Number(payroll.allowances).toLocaleString()}</div>
            </div>

            <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--danger-color)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <ArrowDownRight size={16} /> Deductions
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--danger-color)' }}>-${Number(payroll.deductions).toLocaleString()}</div>
            </div>
          </div>

          <div style={{ background: 'var(--accent-gradient)', padding: '1.5rem', borderRadius: 'var(--radius-md)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 8px 25px var(--accent-glow)' }}>
            <div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Net Payable Monthly Salary</div>
              <div style={{ fontSize: '2.25rem', fontWeight: 900 }}>${Number(payroll.netSalary).toLocaleString()}</div>
            </div>
            <CreditCard size={44} opacity={0.8} />
          </div>
        </div>
      )}

      {isHR && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Company-Wide Payroll Directory</h3>
            <ExportCsvButton data={allPayrolls} filename="company-payroll.csv" title="Export Payroll CSV" />
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Base Salary</th>
                  <th>Allowances</th>
                  <th>Deductions</th>
                  <th>Net Salary</th>
                  <th>Effective Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {allPayrolls.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600 }}>{p.employeeName} ({p.employeeId})</td>
                    <td>${Number(p.baseSalary).toLocaleString()}</td>
                    <td style={{ color: 'var(--success-color)' }}>+${Number(p.allowances).toLocaleString()}</td>
                    <td style={{ color: 'var(--danger-color)' }}>-${Number(p.deductions).toLocaleString()}</td>
                    <td style={{ fontWeight: 800 }}>${Number(p.netSalary).toLocaleString()}</td>
                    <td>{p.effectiveFrom}</td>
                    <td>
                      <button onClick={() => handleEditClick(p)} className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}>
                        <Edit size={14} /> Update Structure
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* HR Edit Modal */}
      {editingPayroll && (
        <div className="modal-overlay" onClick={() => setEditingPayroll(null)}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              Update Salary Structure for {editingPayroll.employeeName}
            </h3>

            <form onSubmit={handleSavePayroll}>
              <div className="form-group">
                <label>Base Salary ($)</label>
                <input
                  type="number"
                  className="input-control"
                  value={editFormData.baseSalary}
                  onChange={(e) => setEditFormData({ ...editFormData, baseSalary: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Allowances ($)</label>
                <input
                  type="number"
                  className="input-control"
                  value={editFormData.allowances}
                  onChange={(e) => setEditFormData({ ...editFormData, allowances: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Deductions ($)</label>
                <input
                  type="number"
                  className="input-control"
                  value={editFormData.deductions}
                  onChange={(e) => setEditFormData({ ...editFormData, deductions: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Effective Date</label>
                <input
                  type="date"
                  className="input-control"
                  value={editFormData.effectiveFrom}
                  onChange={(e) => setEditFormData({ ...editFormData, effectiveFrom: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
                Save Salary Structure
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollPage;
