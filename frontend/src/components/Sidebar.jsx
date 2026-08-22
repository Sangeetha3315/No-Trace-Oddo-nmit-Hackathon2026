import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  User, 
  Clock, 
  CalendarDays, 
  DollarSign, 
  Users, 
  ShieldAlert, 
  LogOut 
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isHR = user?.role === 'HR' || user?.role === 'ADMIN';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">D</div>
        <span className="brand-text">Dayflow</span>
      </div>

      <ul className="nav-list">
        <li className="nav-item">
          <NavLink to={isHR ? "/admin/dashboard" : "/dashboard"} className={({ isActive }) => isActive ? 'active' : ''}>
            <LayoutDashboard size={20} />
            <span className="nav-text">Dashboard</span>
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>
            <User size={20} />
            <span className="nav-text">My Profile</span>
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/attendance" className={({ isActive }) => isActive ? 'active' : ''}>
            <Clock size={20} />
            <span className="nav-text">Attendance</span>
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/leaves" className={({ isActive }) => isActive ? 'active' : ''}>
            <CalendarDays size={20} />
            <span className="nav-text">Leave Requests</span>
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/payroll" className={({ isActive }) => isActive ? 'active' : ''}>
            <DollarSign size={20} />
            <span className="nav-text">Payroll</span>
          </NavLink>
        </li>

        {isHR && (
          <>
            <div style={{ margin: '1rem 0 0.5rem 0.75rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              HR Management
            </div>

            <li className="nav-item">
              <NavLink to="/admin/employees" className={({ isActive }) => isActive ? 'active' : ''}>
                <Users size={20} />
                <span className="nav-text">Employees</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/admin/audit-logs" className={({ isActive }) => isActive ? 'active' : ''}>
                <ShieldAlert size={20} />
                <span className="nav-text">Audit Trail</span>
              </NavLink>
            </li>
          </>
        )}
      </ul>

      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
          <LogOut size={18} />
          <span className="nav-text">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
