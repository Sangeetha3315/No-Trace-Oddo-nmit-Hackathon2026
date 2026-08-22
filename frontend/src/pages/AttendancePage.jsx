import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CheckInCard from '../components/CheckInCard';
import StatusBadge from '../components/StatusBadge';
import ExportCsvButton from '../components/ExportCsvButton';
import { attendanceService } from '../services/attendanceService';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, Calendar as CalendarIcon } from 'lucide-react';

const AttendancePage = () => {
  const { user } = useAuth();
  const isHR = user?.role === 'HR' || user?.role === 'ADMIN';

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const loadAttendance = async () => {
    try {
      if (isHR) {
        const data = await attendanceService.getAllAttendance();
        setRecords(data);
      } else {
        const data = await attendanceService.getMyAttendance();
        setRecords(data);
      }
    } catch (err) {
      console.error("Failed to load attendance logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const filteredRecords = records.filter(r => {
    const matchesSearch = (r.employeeName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (r.employeeId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.date.includes(searchTerm);
    const matchesStatus = !statusFilter || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <Navbar title="Attendance & Work Hours" subtitle="Log daily shifts, track weekly work hours, and inspect attendance logs" />

      {/* Check In Action Panel */}
      <div style={{ maxWidth: '800px', marginBottom: '2rem' }}>
        <CheckInCard onAttendanceChange={loadAttendance} />
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '280px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="input-control"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="Search date or employee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="input-control"
              style={{ width: '180px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="PRESENT">PRESENT</option>
              <option value="HALF_DAY">HALF_DAY</option>
              <option value="ABSENT">ABSENT</option>
              <option value="LEAVE">LEAVE</option>
            </select>
          </div>

          <ExportCsvButton data={filteredRecords} filename="attendance-records.csv" title="Export Attendance CSV" />
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
          {isHR ? "Company-Wide Attendance Records" : "My Attendance History"}
        </h3>

        {filteredRecords.length > 0 ? (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  {isHR && <th>Employee</th>}
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Total Duration</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(r => {
                  const checkIn = r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--';
                  const checkOut = r.checkOutTime ? new Date(r.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--';

                  return (
                    <tr key={r.id}>
                      {isHR && <td style={{ fontWeight: 600 }}>{r.employeeName} ({r.employeeId})</td>}
                      <td style={{ fontWeight: 600 }}>{r.date}</td>
                      <td>{checkIn}</td>
                      <td>{checkOut}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {r.checkInTime && r.checkOutTime ? "8 hrs 30 mins" : (r.checkInTime ? "Active Shift" : "--")}
                      </td>
                      <td><StatusBadge status={r.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">No attendance records found matching filters.</div>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;
