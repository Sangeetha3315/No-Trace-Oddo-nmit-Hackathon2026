import React from 'react';
import { Calendar } from 'lucide-react';

const HolidayCalendar = () => {
  const holidays = [
    { date: '2026-09-07', name: 'Labor Day', day: 'Monday', type: 'Public Holiday' },
    { date: '2026-10-12', name: 'Columbus Day / Indigenous Peoples Day', day: 'Monday', type: 'Optional' },
    { date: '2026-11-11', name: 'Veterans Day', day: 'Wednesday', type: 'Public Holiday' },
    { date: '2026-11-26', name: 'Thanksgiving Day', day: 'Thursday', type: 'Public Holiday' },
    { date: '2026-12-25', name: 'Christmas Day', day: 'Friday', type: 'Public Holiday' },
  ];

  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <Calendar size={22} color="var(--accent-primary)" />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Upcoming Company Holidays</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {holidays.map((h, i) => (
          <div key={i} className="flex-between" style={{ padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{h.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{h.day} &bull; {h.date}</div>
            </div>
            <span className="badge badge-info">{h.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HolidayCalendar;
