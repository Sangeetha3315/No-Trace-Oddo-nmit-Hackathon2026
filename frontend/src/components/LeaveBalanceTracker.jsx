import React from 'react';

const LeaveBalanceTracker = ({ balance }) => {
  if (!balance) return null;

  const items = [
    { label: 'Paid Leave', total: balance.paidTotal, used: balance.paidUsed, remaining: balance.paidRemaining, color: '#3b82f6' },
    { label: 'Sick Leave', total: balance.sickTotal, used: balance.sickUsed, remaining: balance.sickRemaining, color: '#10b981' },
    { label: 'Unpaid Leave', total: 'Unlimited', used: balance.unpaidUsed, remaining: 'N/A', color: '#f59e0b' },
  ];

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Visual Leave Balance Tracker</h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {items.map((item, idx) => {
          const percent = typeof item.total === 'number' ? Math.min(100, Math.round((item.used / item.total) * 100)) : 0;
          return (
            <div key={idx} style={{ background: 'rgba(0,0,0,0.25)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.label}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.remaining} left</span>
              </div>

              <div style={{ height: '8px', background: 'var(--bg-glass)', borderRadius: '4px', overflow: 'hidden', margin: '0.5rem 0' }}>
                <div style={{ width: `${percent}%`, background: item.color, height: '100%', transition: 'width 0.5s ease' }}></div>
              </div>

              <div className="flex-between" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <span>Used: {item.used} days</span>
                <span>Allowance: {item.total}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeaveBalanceTracker;
