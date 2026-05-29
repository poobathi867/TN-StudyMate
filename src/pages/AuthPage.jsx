import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../config/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import logoImg from '../../MyLogo.PNG';

export default function AuthPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState('login'); // login | class-select
  const [loginMethod, setLoginMethod] = useState('phone'); // phone | email
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (phone.length >= 10) {
      const savedClass = localStorage.getItem(`class_${phone}`);
      if (savedClass) {
        login({ name: name || 'Student', phone, uid: phone }, savedClass);
        navigate('/');
      } else {
        setStep('class-select');
      }
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email && name) {
      const savedClass = localStorage.getItem(`class_${email}`);
      if (savedClass) {
        login({ name, email, uid: email }, savedClass);
        navigate('/');
      } else {
        setStep('class-select');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userEmail = user.email || user.uid;
      const savedClass = localStorage.getItem(`class_${userEmail}`);
      
      if (savedClass) {
        login({ 
          name: user.displayName || 'Student', 
          email: user.email || '', 
          uid: user.uid,
          avatar: user.photoURL 
        }, savedClass);
        navigate('/');
      } else {
        setName(user.displayName || 'Student');
        setEmail(user.email || '');
        setStep('class-select');
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      const errorCode = error.code || '';
      
      if (errorCode.includes('api-key-not-valid') || errorCode.includes('invalid-api-key')) {
        alert('Google Sign-In requires your actual Firebase Project credentials to show the professional Google Account picker. Please open src/config/firebase.js and replace "YOUR_API_KEY" with your actual Firebase API keys.');
      } else if (errorCode !== 'auth/popup-closed-by-user' && errorCode !== 'auth/cancelled-popup-request') {
        alert('Failed to sign in with Google. ' + (error.message || 'Unknown error occurred.'));
      }
    }
  };

  const handleClassSelect = (cls) => {
    setSelectedClass(cls);
  };

  const handleFinalSubmit = () => {
    if (selectedClass) {
      const identifier = email || phone || Date.now().toString();
      localStorage.setItem(`class_${identifier}`, selectedClass.toString());
      
      login(
        { name: name || 'Student', email, phone, uid: identifier },
        selectedClass.toString()
      );
      navigate('/');
    }
  };

  return (
    <div className="auth-container">
      {/* Background orbs */}
      <div className="auth-bg-orb auth-bg-orb-1" />
      <div className="auth-bg-orb auth-bg-orb-2" />

      <AnimatePresence mode="wait">
        {step === 'login' ? (
          <motion.div
            key="login"
            className="auth-card glass-strong"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
          >
            <img
              src={logoImg}
              alt="TN StudyMate Logo"
              style={{
                width: 80,
                height: 'auto',
                margin: '0 auto var(--space-6)',
                display: 'block',
                filter: 'drop-shadow(0 0 20px rgba(0, 212, 255, 0.4))',
                mixBlendMode: 'screen'
              }}
            />
            <h1 className="auth-title">
              <span className="text-gradient-blue">TN StudyMate</span>
            </h1>
            <p className="auth-subtitle">
              Your complete education companion for Tamil Nadu 10th & 12th students
            </p>

            {loginMethod === 'phone' ? (
              <form className="auth-form" onSubmit={handlePhoneSubmit}>
                <div className="auth-input-group">
                  <label>Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="Enter your 10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    maxLength={10}
                    id="auth-phone-input"
                  />
                </div>
                <div className="auth-input-group">
                  <label>Your Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    id="auth-name-input"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={phone.length < 10}
                  style={{ width: '100%', opacity: phone.length < 10 ? 0.5 : 1 }}
                  id="auth-phone-submit"
                >
                  <Phone size={18} />
                  Continue with Mobile
                  <ArrowRight size={18} />
                </button>
              </form>
            ) : (
              <form className="auth-form" onSubmit={handleEmailSubmit}>
                <div className="auth-input-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    id="auth-name-input-email"
                  />
                </div>
                <div className="auth-input-group">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="auth-email-input"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={!email || !name}
                  style={{ width: '100%', opacity: (!email || !name) ? 0.5 : 1 }}
                  id="auth-email-submit"
                >
                  <Mail size={18} />
                  Continue with Email
                  <ArrowRight size={18} />
                </button>
              </form>
            )}

            <div className="auth-divider">or</div>

            <button
              className="btn btn-google btn-lg"
              style={{ width: '100%' }}
              onClick={handleGoogleSignIn}
              id="auth-google-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>

            <div style={{ marginTop: 'var(--space-4)' }}>
              <button
                className="btn btn-ghost"
                onClick={() => setLoginMethod(loginMethod === 'phone' ? 'email' : 'phone')}
                style={{ fontSize: 'var(--text-sm)' }}
                id="auth-toggle-method"
              >
                {loginMethod === 'phone' ? 'Use Email instead' : 'Use Mobile Number instead'}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="class-select"
            className="auth-card glass-strong"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
          >
            <div style={{ marginBottom: 'var(--space-2)' }}>
              <Sparkles size={40} color="var(--color-accent-blue)" style={{ margin: '0 auto var(--space-4)' }} />
            </div>
            <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>
              Welcome, {name || 'Student'}! 🎉
            </h2>
            <p className="auth-subtitle">
              Which class are you in?
            </p>

            <div className="auth-class-select">
              <div
                className={`auth-class-option ${selectedClass === 10 ? 'selected' : ''}`}
                onClick={() => handleClassSelect(10)}
                id="auth-class-10"
              >
                <div className="auth-class-option-number">10</div>
                <div className="auth-class-option-label">SSLC</div>
              </div>
              <div
                className={`auth-class-option ${selectedClass === 12 ? 'selected' : ''}`}
                onClick={() => handleClassSelect(12)}
                id="auth-class-12"
              >
                <div className="auth-class-option-number">12</div>
                <div className="auth-class-option-label">HSC</div>
              </div>
            </div>

            <button
              className="btn btn-primary btn-lg"
              onClick={handleFinalSubmit}
              disabled={!selectedClass}
              style={{ width: '100%', marginTop: 'var(--space-6)', opacity: !selectedClass ? 0.5 : 1 }}
              id="auth-final-submit"
            >
              Get Started
              <ArrowRight size={18} />
            </button>

            <button
              className="btn btn-ghost"
              onClick={() => setStep('login')}
              style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-sm)' }}
            >
              ← Back to login
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
