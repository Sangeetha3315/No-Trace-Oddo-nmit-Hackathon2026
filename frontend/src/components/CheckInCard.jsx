import React, { useState, useEffect } from 'react';
import { attendanceService } from '../services/attendanceService';
import { Clock, Play, Square, CheckCircle2 } from 'lucide-react';

const CheckInCard = ({ onAttendanceChange }) => {
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadTodayAttendance = async () => {
      try {
        const weekly = await attendanceService.getMyWeeklyAttendance();
        const todayStr = new Date().toISOString().split('T')[0];
        const todayRecord = weekly.find(r => r.date === todayStr);

        if (todayRecord) {
          if (todayRecord.checkInTime) {
            setCheckedIn(true);
            setCheckInTime(new Date(todayRecord.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          }
          if (todayRecord.checkOutTime) {
            setCheckedOut(true);
            setCheckOutTime(new Date(todayRecord.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          }
        }
      } catch (err) {
        console.error("Failed to load today's attendance", err);
      }
    };
    loadTodayAttendance();
  }, []);

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      const res = await attendanceService.checkIn();
      setCheckedIn(true);
      setCheckInTime(new Date(res.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      if (onAttendanceChange) onAttendanceChange();
    } catch (err) {
      alert(err.response?.data?.message || "Check in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      const res = await attendanceService.checkOut();
      setCheckedOut(true);
      setCheckOutTime(new Date(res.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      if (onAttendanceChange) onAttendanceChange();
    } catch (err) {
      alert(err.response?.data?.message || "Check out failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="flex-between">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ padding: '0.6rem', background: 'var(--info-bg)', color: 'var(--info-color)', borderRadius: 'var(--radius-sm)' }}>
            <Clock size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Today's Work Shift</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Live Clock: {currentTime}</p>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          {checkedOut ? (
            <span className="badge badge-success"><CheckCircle2 size={12} /> Shift Completed</span>
          ) : checkedIn ? (
            <span className="badge badge-warning">Clocked In</span>
          ) : (
            <span className="badge badge-info">Not Started</span>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Check In Time</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{checkInTime || '--:--'}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Check Out Time</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{checkOutTime || '--:--'}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        {!checkedIn ? (
          <button
            onClick={handleCheckIn}
            disabled={loading}
            className="btn btn-primary"
            style={{ flex: 1 }}
          >
            <Play size={18} /> Check In Now
          </button>
        ) : (
          <button
            onClick={handleCheckOut}
            disabled={loading || checkedOut}
            className="btn btn-danger"
            style={{ flex: 1, opacity: checkedOut ? 0.5 : 1 }}
          >
            <Square size={18} /> {checkedOut ? "Shift Completed" : "Check Out Now"}
          </button>
        )}
      </div>
    </div>
  );
};

export default CheckInCard;
