import { useAuth } from '../contexts/AuthContext';
import Scene3D from '../components/Scene3D';
import { motion } from 'framer-motion';
import { Trophy, ExternalLink, Download, FileText, Info, Award, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const { user, studentClass } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const resultUrl12 = 'https://tnresults.nic.in/rdtpex.htm';
  const resultUrl10 = 'https://tnresults.nic.in/rdclex.htm';
  const resultUrl = studentClass === '12' ? resultUrl12 : resultUrl10;
  const examName = studentClass === '12' ? 'HSC (+2)' : 'SSLC (10th)';

  return (
    <div className="dashboard">
      <div className="dashboard-canvas">
        <Scene3D />
      </div>

      <div className="dashboard-content">
        <motion.div 
          className="dashboard-greeting"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>
            {getGreeting()}, {user?.name?.split(' ')[0] || 'Student'} 
            <Sparkles size={28} style={{ display: 'inline', marginLeft: 8, color: 'var(--color-accent-orange)' }} />
          </h1>
          <p>
            {studentClass}th Standard • Check your exam results below
          </p>
        </motion.div>

        {/* Main Results Card */}
        <motion.div
          className="card results-card-main"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div style={{ 
            width: 80, height: 80, 
            background: 'rgba(16, 185, 129, 0.15)',
            borderRadius: 'var(--radius-2xl)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto var(--space-6)'
          }}>
            <Trophy size={36} color="var(--color-accent-emerald)" />
          </div>

          <h3>{examName} Public Exam Results</h3>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', maxWidth: 480, margin: '0 auto var(--space-6)' }}>
            Click below to check your {examName} results on the official Tamil Nadu results portal.
          </p>

          <a
            href={resultUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-emerald results-link-btn"
            id="results-check-btn"
          >
            <Trophy size={22} />
            Check {examName} Results
            <ExternalLink size={18} />
          </a>

          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-4)' }}>
            Opens tnresults.nic.in in a new tab (govt site blocks in-app viewing)
          </p>
        </motion.div>

        {/* Info Cards */}
        <div className="results-info-grid" style={{ marginTop: 'var(--space-8)' }}>
          <motion.div 
            className="card results-info-item"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div style={{ 
              width: 48, height: 48, 
              background: 'rgba(0, 212, 255, 0.15)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto var(--space-3)'
            }}>
              <FileText size={22} color="var(--color-accent-blue)" />
            </div>
            <div className="results-info-label" style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4 }}>
              How to Check
            </div>
            <div className="results-info-label">
              Enter your Registration Number and Date of Birth on the results page
            </div>
          </motion.div>

          <motion.div 
            className="card results-info-item"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div style={{ 
              width: 48, height: 48, 
              background: 'rgba(124, 58, 237, 0.15)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto var(--space-3)'
            }}>
              <Download size={22} color="var(--color-accent-purple)" />
            </div>
            <div className="results-info-label" style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4 }}>
              Download Marksheet
            </div>
            <div className="results-info-label">
              After results are declared, download your provisional mark sheet from the portal
            </div>
          </motion.div>

          <motion.div 
            className="card results-info-item"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div style={{ 
              width: 48, height: 48, 
              background: 'rgba(245, 158, 11, 0.15)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto var(--space-3)'
            }}>
              <Award size={22} color="var(--color-accent-orange)" />
            </div>
            <div className="results-info-label" style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4 }}>
              After Results
            </div>
            <div className="results-info-label">
              Use our Cutoff Calculator & Branch Recommender after getting your results!
            </div>
          </motion.div>
        </div>

        {/* Alternative Links */}
        <motion.div 
          className="card"
          style={{ marginTop: 'var(--space-6)', padding: 'var(--space-6)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h4 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Info size={18} color="var(--color-accent-blue)" />
            Other Result Links
          </h4>
          <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
            <a
              href={resultUrl12}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ justifyContent: 'flex-start' }}
            >
              <Trophy size={16} />
              12th HSC (+2) Results
              <ExternalLink size={14} style={{ marginLeft: 'auto' }} />
            </a>
            <a
              href={resultUrl10}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ justifyContent: 'flex-start' }}
            >
              <Trophy size={16} />
              10th SSLC Results
              <ExternalLink size={14} style={{ marginLeft: 'auto' }} />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
