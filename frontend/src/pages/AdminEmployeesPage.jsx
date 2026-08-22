import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import ExportCsvButton from '../components/ExportCsvButton';
import { employeeService } from '../services/employeeService';
import { Search, Edit, Eye, UserPlus, Shield } from 'lucide-react';

const AdminEmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingEmployee, setEditingEmployee] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    jobTitle: '',
    department: '',
    role: 'EMPLOYEE'
  });

  const loadEmployees = async () => {
    try {
      const list = await employeeService.getAllEmployees();
      setEmployees(list);
    } catch (err) {
      console.error("Failed to load employee list", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleEdit = (emp) => {
    setEditingEmployee(emp);
    setFormData({
      name: emp.name || '',
      email: emp.email || '',
      phone: emp.phone || '',
      address: emp.address || '',
      jobTitle: emp.jobTitle || '',
      department: emp.department || '',
      role: emp.role || 'EMPLOYEE'
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await employeeService.adminUpdateProfile(editingEmployee.userId, formData);
      alert("Employee profile updated successfully!");
      setEditingEmployee(null);
      loadEmployees();
    } catch (err) {
      alert("Update failed: " + (err.response?.data?.message || err.message));
    }
  };

  const filteredEmployees = employees.filter(e =>
    (e.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.employeeId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.department || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Navbar title="Employee Directory & HR Management" subtitle="Inspect full workforce profiles, update designations, and manage access roles" />

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="flex-between" style={{ gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="input-control"
              style={{ paddingLeft: '2.75rem' }}
              placeholder="Search by name, email, department, or employee ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <ExportCsvButton data={filteredEmployees} filename="employee-directory.csv" title="Export Employee CSV" />
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Active Employee Records ({filteredEmployees.length})</h3>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Work Email</th>
                <th>Job Title</th>
                <th>Department</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(emp => (
                <tr key={emp.userId}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img src={emp.profilePictureUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 700 }}>{emp.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {emp.employeeId}</div>
                      </div>
                    </div>
                  </td>
                  <td>{emp.email}</td>
                  <td>{emp.jobTitle}</td>
                  <td>{emp.department}</td>
                  <td><StatusBadge status={emp.role} /></td>
                  <td>{emp.dateOfJoining}</td>
                  <td>
                    <button onClick={() => handleEdit(emp)} className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}>
                      <Edit size={14} /> Full Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Full Edit Modal */}
      {editingEmployee && (
        <div className="modal-overlay" onClick={() => setEditingEmployee(null)}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              Full Profile Edit — {editingEmployee.name} ({editingEmployee.employeeId})
            </h3>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" className="input-control" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input type="email" className="input-control" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </div>

              <div className="grid-2" style={{ gap: '1rem', marginBottom: '0' }}>
                <div className="form-group">
                  <label>Job Title</label>
                  <input type="text" className="input-control" value={formData.jobTitle} onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <input type="text" className="input-control" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} required />
                </div>
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input type="text" className="input-control" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea className="input-control" rows={2} value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
              </div>

              <div className="form-group">
                <label>System Access Role</label>
                <select className="input-control" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                  <option value="EMPLOYEE">Standard Employee</option>
                  <option value="HR">HR Admin</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
                Save Admin Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEmployeesPage;
