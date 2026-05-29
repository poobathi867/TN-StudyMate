import logoImg from '../assets/logo.png';

export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <img
        src={logoImg}
        alt="TN StudyMate"
        style={{
          width: 140,
          height: 'auto',
          marginBottom: 'var(--space-6)',
          animation: 'float 2s ease-in-out infinite',
          filter: 'drop-shadow(0 0 25px rgba(0, 212, 255, 0.4))',
          mixBlendMode: 'screen',
        }}
      />
      <div className="splash-loading-dots" style={{ opacity: 1, marginTop: 'var(--space-4)' }}>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
      <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
        Loading your study companion...
      </p>
    </div>
  );
}
