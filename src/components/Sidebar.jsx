import { NavLink, useLocation } from 'react-router-dom';
import { 
  Trophy, Newspaper, BookOpen, Calculator, Bot, 
  GitBranch, FileQuestion, Settings, X, 
  Home
} from 'lucide-react';
import logoImg from '../../MyLogo.PNG';

const sidebarItems = [
  { path: '/', icon: Trophy, label: 'Results' },
  { path: '/news', icon: Newspaper, label: 'News' },
  { path: '/notes', icon: BookOpen, label: 'Notes' },
  { path: '/questions', icon: FileQuestion, label: 'Q-Papers' },
  { path: '/cutoff', icon: Calculator, label: 'Cutoff' },
  { path: '/recommend', icon: GitBranch, label: 'Branch' },
  { path: '/ai', icon: Bot, label: 'AI Agent' },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  if (location.pathname === '/auth') return null;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <img src={logoImg} alt="TN StudyMate" className="sidebar-logo" />
            <span>TN StudyMate</span>
          </div>
          <button className="sidebar-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-nav-section">MAIN MENU</div>
          {sidebarItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <item.icon size={20} className="sidebar-link-icon" />
              <span>{item.label}</span>
            </NavLink>
          ))}

          <div className="sidebar-nav-section" style={{ marginTop: 'var(--space-6)' }}>PREFERENCES</div>
          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Settings size={20} className="sidebar-link-icon" />
            <span>Settings</span>
          </NavLink>
        </nav>
      </aside>
    </>
  );
}
