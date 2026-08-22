import React from 'react';
import { useAuth } from '../context/AuthContext';
import StatusBadge from './StatusBadge';

const Navbar = ({ title, subtitle }) => {
  const { user } = useAuth();

  return (
    <header className="top-navbar">
      <div className="page-title">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>

      <div className="user-profile-summary">
        <StatusBadge status={user?.role} />
        <img
          src={user?.profilePictureUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
          alt={user?.name || "User Avatar"}
          className="avatar"
        />
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{user?.name || user?.email}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: {user?.employeeId}</div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
