import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Settings, Menu } from 'lucide-react';
import { useState } from 'react';
import logoImg from '../../MyLogo.PNG';

export default function Navbar({ onMenuClick }) {
  const { user, studentClass, logout } = useAuth();
  const location = useLocation();

  if (location.pathname === '/auth') return null;

  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <button 
          className="btn btn-ghost btn-icon" 
          onClick={onMenuClick}
          style={{ margin: 0, color: 'var(--color-text-primary)' }}
        >
          <Menu size={24} />
        </button>
        <Link to="/" className="navbar-brand" style={{ textDecoration: 'none' }}>
          <img
          src={logoImg}
          alt="TN StudyMate"
          className="navbar-brand-logo"
        />
        <span>TN StudyMate</span>
        </Link>
      </div>

      <div className="navbar-actions">
        {studentClass && (
          <span className="navbar-class-badge">
            {studentClass}th Std
          </span>
        )}
        {user && (
          <div className="navbar-user">
            <div className="navbar-avatar">{user.avatar}</div>
            <span>{user.name.split(' ')[0]}</span>
          </div>
        )}

      </div>
    </nav>
  );
}
