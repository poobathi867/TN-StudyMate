import { NavLink, useLocation } from 'react-router-dom';
import { Trophy, Newspaper, Bot } from 'lucide-react';

const navItems = [
  { path: '/news', icon: Newspaper, label: 'News' },
  { path: '/', icon: Trophy, label: 'Results' },
  { path: '/ai', icon: Bot, label: 'AI' },
];

export default function BottomNav() {
  const location = useLocation();

  if (location.pathname === '/auth') return null;

  return (
    <nav className="bottom-nav">
      {navItems.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        >
          <item.icon className="bottom-nav-icon" size={20} />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
