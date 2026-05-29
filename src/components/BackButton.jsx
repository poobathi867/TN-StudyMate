import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show on home page, auth page, or AI page (which has custom header)
  if (location.pathname === '/' || location.pathname === '/auth' || location.pathname === '/ai') return null;

  return (
    <div className="back-button-wrapper">
      <motion.button
        className="back-button"
        onClick={() => navigate('/')}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        title="Back to Home"
        id="back-button"
      >
        <ArrowLeft size={18} />
      </motion.button>
    </div>
  );
}
