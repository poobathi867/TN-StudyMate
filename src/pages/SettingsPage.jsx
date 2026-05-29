import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  Download, Moon, Sun, Calendar, FileText,
  ShieldCheck, LogOut, Settings as SettingsIcon 
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' }
  },
};

export default function SettingsPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'light') {
      setIsDarkMode(false);
      document.body.classList.add('light-theme');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.body.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const settingsOptions = [
    {
      id: 'downloads',
      icon: Download,
      title: 'Downloads',
      desc: 'View your saved notes, PDFs, and offline content',
      color: 'blue',
      action: () => navigate('/notes'),
    },
    {
      id: 'theme',
      icon: isDarkMode ? Sun : Moon,
      title: isDarkMode ? 'Light Mode' : 'Dark Mode',
      desc: 'Toggle between dark and light appearance',
      color: 'purple',
      action: toggleTheme,
    },
    {
      id: 'timetable',
      icon: Calendar,
      title: 'Public Exam Timetable',
      desc: 'Check official upcoming 10th and 12th board exam dates',
      color: 'emerald',
      action: () => window.open('https://dge.tn.gov.in/timetable.html', '_blank'),
    },

    {
      id: 'terms',
      icon: ShieldCheck,
      title: 'Terms of Service',
      desc: 'Privacy policy and user guidelines',
      color: 'cyan',
      action: () => window.open('https://policies.google.com/privacy', '_blank'),
    },
    {
      id: 'logout',
      icon: LogOut,
      title: 'Log Out',
      desc: 'Sign out of your TN StudyMate account gracefully',
      color: 'red',
      action: () => {
        logout();
        navigate('/auth');
      },
    },
  ];

  return (
    <div className="page-container" style={{ paddingBottom: '90px' }}>
      <div className="page-header">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
        >
          <div className="navbar-brand-icon" style={{ background: 'var(--gradient-purple)' }}>
            <SettingsIcon size={20} color="#fff" />
          </div>
          <h1 className="page-title" style={{ background: 'var(--gradient-purple)', margin: 0, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Settings
          </h1>
        </motion.div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="page-subtitle"
          style={{ marginTop: '8px' }}
        >
          Manage your app preferences and account settings
        </motion.p>
      </div>

      <motion.div 
        className="grid-cards"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}
      >
        {settingsOptions.map((option) => (
          <motion.div key={option.id} variants={cardVariants}>
            <button 
              className={`card flex-between`}
              onClick={option.action}
              style={{ width: '100%', textAlign: 'left', cursor: 'pointer', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '16px' }}
            >
              <div 
                style={{ 
                  width: '48px', height: '48px', 
                  borderRadius: '12px', 
                  background: `var(--gradient-${option.color})`, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `var(--shadow-glow-${option.color})`,
                  color: '#fff', flexShrink: 0 
                }}
              >
                <option.icon size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px', color: 'var(--color-text-primary)' }}>
                  {option.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  {option.desc}
                </p>
              </div>
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
