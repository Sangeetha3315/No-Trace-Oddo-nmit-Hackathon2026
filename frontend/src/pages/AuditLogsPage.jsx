import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ExportCsvButton from '../components/ExportCsvButton';
import { adminService } from '../services/adminService';
import { ShieldAlert, Search, Clock } from 'lucide-react';

const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await adminService.getAuditLogs();
        setLogs(data);
      } catch (err) {
        console.error("Failed to load audit logs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(l =>
    (l.action || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.actorName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Navbar title="System Audit Trail & Security Logs" subtitle="Immutable event logging of all authentication events, leave approvals, and profile changes" />

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="flex-between" style={{ gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="input-control"
              style={{ paddingLeft: '2.75rem' }}
              placeholder="Search audit action, user, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <ExportCsvButton data={filteredLogs} filename="audit-trail.csv" title="Export Audit CSV" />
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Audit Event History ({filteredLogs.length})</h3>

        {filteredLogs.length > 0 ? (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Actor</th>
                  <th>Action</th>
                  <th>Target User</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(l => (
                  <tr key={l.id}>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {new Date(l.timestamp).toLocaleString()}
                    </td>
                    <td style={{ fontWeight: 600 }}>{l.actorName}</td>
                    <td>
                      <span className="badge badge-info" style={{ fontFamily: 'monospace' }}>
                        {l.action}
                      </span>
                    </td>
                    <td>{l.targetName || 'N/A'}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{l.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">No audit logs found matching criteria.</div>
        )}
      </div>
    </div>
  );
};

export default AuditLogsPage;
